package main

import (
	"backend-go/dto"
	"backend-go/models"
	"backend-go/utils"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/extemporalgenome/npdfpages"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=ai_pdf_management port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	app := fiber.New()

	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "pong",
		})
	})

	app.Get("/pdf", func(c *fiber.Ctx) error {
		var pdfs []models.PDF

		// Pagination parameters
		page := c.QueryInt("page", 1)
		itemsPerPage := c.QueryInt("itemsperpage", 10)

		// Calculate offset from page and itemsPerPage
		offset := (page - 1) * itemsPerPage
		limit := itemsPerPage

		// Other query parameters
		sortBy := c.Query("sort", "created_at")
		order := c.Query("order", "desc")
		search := c.Query("search", "")

		query := db.Model(&models.PDF{})

		if search != "" {
			query = query.Where("title ILIKE ?", "%"+search+"%")
		}

		// Get total count for pagination
		var totalCount int64
		if err := query.Count(&totalCount).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to count PDFs",
			})
		}

		// Calculate total pages
		totalPages := int((totalCount + int64(itemsPerPage) - 1) / int64(itemsPerPage))

		if err := query.Order(fmt.Sprintf("%s %s", sortBy, order)).Limit(limit).Offset(offset).Find(&pdfs).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to fetch PDFs",
			})
		}

		response := dto.PDFListResponse{
			Data:         utils.ConvertPDFsToResponse(pdfs),
			Page:         page,
			ItemsPerPage: itemsPerPage,
			TotalPages:   totalPages,
			TotalItems:   totalCount,
		}

		return c.Status(200).JSON(response)
	})

	app.Post("/pdf", func(c *fiber.Ctx) error {
		var req dto.PDFCreateRequest

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"message": "Invalid request body: " + err.Error(),
			})
		}

		// Convert DTO to model
		pdf := models.PDF{
			Filename:  req.Filename,
			FileSize:  req.FileSize,
			Title:     req.Title,
			PageCount: req.PageCount,
		}

		if err := db.Create(&pdf).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to create PDF record: " + err.Error(),
			})
		}

		// Convert model to response DTO
		response := utils.ConvertPDFToResponse(pdf)
		return c.Status(201).JSON(response)
	})

	app.Get("/pdf/:id", func(c *fiber.Ctx) error {
		var pdf models.PDF

		if err := db.Preload("Summaries").First(&pdf, c.Params("id")).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"message": "PDF not found",
			})
		}

		response := utils.ConvertPDFToDetailResponse(pdf)
		return c.Status(200).JSON(response)
	})

	app.Delete("/pdf/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		var pdf models.PDF

		db.First(&pdf, id)

		if pdf.ID == 0 {
			return c.Status(404).JSON(fiber.Map{
				"message": "PDF not found",
			})
		}

		filePath := filepath.Join("uploads", pdf.Filename)
		if _, err := os.Stat(filePath); err == nil {
			if err := os.Remove(filePath); err != nil {
				return c.Status(500).JSON(fiber.Map{
					"message": "Failed to delete file",
				})
			}
		} else if !os.IsNotExist(err) {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to check file existence",
			})
		}

		db.Delete(&pdf)

		return c.Status(200).JSON(fiber.Map{
			"message": "PDF deleted successfully",
		})
	})

	app.Post("/pdf/upload", func(c *fiber.Ctx) error {
		file, err := c.FormFile("file")
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"message": "File is required",
			})
		}

		// Get title from form data, fallback to filename without extension
		title := c.FormValue("title")
		if title == "" {
			ext := filepath.Ext(file.Filename)
			title = strings.TrimSuffix(file.Filename, ext)
		}

		if err := os.MkdirAll("./uploads", os.ModePerm); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to create upload directory",
			})
		}

		ext := filepath.Ext(file.Filename)
		filename := uuid.New().String() + ext

		if err := c.SaveFile(file, "./uploads/"+filename); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to save file",
			})
		}

		pdf := models.PDF{
			Filename:  filename,
			FileSize:  file.Size,
			Title:     title,
			PageCount: npdfpages.PagesAtPath(filepath.Join("uploads", filename)),
		}

		if err := db.Create(&pdf).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to create PDF",
			})
		}

		response := utils.ConvertPDFToResponse(pdf)
		return c.Status(201).JSON(response)
	})

	app.Post("/pdf/:id/summarize", func(c *fiber.Ctx) error {
		var req dto.SummarizeRequest

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"message": "Invalid request body: " + err.Error(),
			})
		}

		id := c.Params("id")
		var pdf models.PDF

		if err := db.First(&pdf, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"message": "PDF not found",
			})
		}

		filePath := filepath.Join("uploads", pdf.Filename)
		file, err := os.Open(filePath)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to open file: " + err.Error(),
			})
		}
		defer file.Close()

		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)

		filePart, err := writer.CreateFormFile("file", pdf.Filename)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to create form file",
			})
		}
		io.Copy(filePart, file)

		writer.WriteField("style", req.Style)
		writer.WriteField("language", req.Language)
		writer.Close()

		httpReq, _ := http.NewRequest(
			"POST",
			"http://127.0.0.1:8000/summarize",
			body,
		)
		httpReq.Header.Set("Content-Type", writer.FormDataContentType())

		client := &http.Client{}
		resp, err := client.Do(httpReq)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to connect to Python backend: " + err.Error(),
			})
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			bodyBytes, _ := io.ReadAll(resp.Body)
			return c.Status(resp.StatusCode).JSON(fiber.Map{
				"message": "Python backend error: " + string(bodyBytes),
			})
		}

		// Parse response into PythonSummaryResponse struct
		var pythonResponse dto.PythonSummaryResponse
		if err := json.NewDecoder(resp.Body).Decode(&pythonResponse); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to parse response: " + err.Error(),
			})
		}

		// Save summary to database
		summary := models.Summaries{
			Style:       pythonResponse.Style,
			Content:     pythonResponse.Summary.MainSummary,
			PDFID:       pdf.ID,
			Language:    pythonResponse.Language,
			SummaryTime: pythonResponse.ProcessInfo.ProcessingTimeSeconds,
		}

		if err := db.Create(&summary).Error; err != nil {
			fmt.Printf("Failed to save summary: %v\n", err)
		}

		return c.Status(200).JSON(pythonResponse)
	})

	app.Get("/summaries", func(c *fiber.Ctx) error {
		var summaries []models.Summaries

		// Pagination parameters
		page := c.QueryInt("page", 1)
		itemsPerPage := c.QueryInt("itemsperpage", 10)

		// Calculate offset from page and itemsPerPage
		offset := (page - 1) * itemsPerPage
		limit := itemsPerPage

		// Other query parameters
		sortBy := c.Query("sort", "created_at")
		order := c.Query("order", "desc")
		search := c.Query("search", "")

		query := db.Model(&models.Summaries{})

		if search != "" {
			query = query.Where("content ILIKE ?", "%"+search+"%")
		}

		// Get total count for pagination
		var totalCount int64
		if err := query.Count(&totalCount).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to count summaries",
			})
		}

		// Calculate total pages
		totalPages := int((totalCount + int64(itemsPerPage) - 1) / int64(itemsPerPage))

		if err := query.Order(fmt.Sprintf("%s %s", sortBy, order)).Limit(limit).Offset(offset).Find(&summaries).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to fetch summaries",
			})
		}

		response := dto.SummaryListResponse{
			Data:         utils.ConvertSummariesToResponse(summaries),
			Page:         page,
			ItemsPerPage: itemsPerPage,
			TotalPages:   totalPages,
			TotalItems:   totalCount,
		}

		return c.Status(200).JSON(response)
	})

	app.Get("/summaries/:id", func(c *fiber.Ctx) error {
		var summary models.Summaries

		if err := db.First(&summary, c.Params("id")).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"message": "Summary not found",
			})
		}

		response := utils.ConvertSummaryToResponse(summary)
		return c.Status(200).JSON(response)
	})

	app.Delete("/summaries/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		var summary models.Summaries

		db.First(&summary, id)

		if summary.ID == 0 {
			return c.Status(404).JSON(fiber.Map{
				"message": "Summary not found",
			})
		}

		db.Delete(&summary)

		return c.Status(200).JSON(fiber.Map{
			"message": "Summary deleted successfully",
		})
	})

	app.Listen("0.0.0.0:8080")
}
