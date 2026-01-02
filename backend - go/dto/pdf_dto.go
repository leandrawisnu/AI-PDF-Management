package dto

import "time"

type PDFCreateRequest struct {
	Filename  string `json:"filename" binding:"required"`
	FileSize  int64  `json:"file_size" binding:"required"`
	Title     string `json:"title" binding:"required"`
	PageCount int    `json:"page_count" binding:"required"`
}

type PDFResponse struct {
	ID        uint      `json:"id"`
	Filename  string    `json:"filename"`
	FileSize  int64     `json:"file_size"`
	Title     string    `json:"title"`
	PageCount int       `json:"page_count"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type PDFListResponse struct {
	Data         []PDFResponse `json:"data"`
	Page         int           `json:"page"`
	ItemsPerPage int           `json:"itemsPerPage"`
	TotalPages   int           `json:"totalPages"`
	TotalItems   int64         `json:"totalItems"`
}

type PDFDetailResponse struct {
	ID        uint              `json:"id"`
	Filename  string            `json:"filename"`
	FileSize  int64             `json:"file_size"`
	Title     string            `json:"title"`
	PageCount int               `json:"page_count"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
	Summaries []SummaryResponse `json:"summaries"`
}
