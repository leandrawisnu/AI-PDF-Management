package utils

import (
	"backend-go/dto"
	"backend-go/models"
)

// ConvertPDFToResponse converts PDF model to PDFResponse DTO
func ConvertPDFToResponse(pdf models.PDF) dto.PDFResponse {
	return dto.PDFResponse{
		ID:        pdf.ID,
		Filename:  pdf.Filename,
		FileSize:  pdf.FileSize,
		Title:     pdf.Title,
		PageCount: pdf.PageCount,
		CreatedAt: pdf.CreatedAt,
		UpdatedAt: pdf.UpdatedAt,
	}
}

// ConvertPDFsToResponse converts slice of PDF models to slice of PDFResponse DTOs
func ConvertPDFsToResponse(pdfs []models.PDF) []dto.PDFResponse {
	responses := make([]dto.PDFResponse, len(pdfs))
	for i, pdf := range pdfs {
		responses[i] = ConvertPDFToResponse(pdf)
	}
	return responses
}

// ConvertPDFToDetailResponse converts PDF model with summaries to PDFDetailResponse DTO
func ConvertPDFToDetailResponse(pdf models.PDF) dto.PDFDetailResponse {
	summaries := make([]dto.SummaryResponse, len(pdf.Summaries))
	for i, summary := range pdf.Summaries {
		summaries[i] = ConvertSummaryToResponse(summary)
	}

	return dto.PDFDetailResponse{
		ID:        pdf.ID,
		Filename:  pdf.Filename,
		FileSize:  pdf.FileSize,
		Title:     pdf.Title,
		PageCount: pdf.PageCount,
		CreatedAt: pdf.CreatedAt,
		UpdatedAt: pdf.UpdatedAt,
		Summaries: summaries,
	}
}

// ConvertSummaryToResponse converts Summary model to SummaryResponse DTO
func ConvertSummaryToResponse(summary models.Summaries) dto.SummaryResponse {
	return dto.SummaryResponse{
		ID:          summary.ID,
		Style:       summary.Style,
		Content:     summary.Content,
		PDFID:       summary.PDFID,
		Language:    summary.Language,
		SummaryTime: summary.SummaryTime,
		CreatedAt:   summary.CreatedAt,
		UpdatedAt:   summary.UpdatedAt,
	}
}

func ConvertSummariesToResponse(summaries []models.Summaries) []dto.SummaryResponse {
	responses := make([]dto.SummaryResponse, len(summaries))
	for i, summary := range summaries {
		responses[i] = ConvertSummaryToResponse(summary)
	}
	return responses
}
