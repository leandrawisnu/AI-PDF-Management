package utils

import (
	"fmt"
	"strings"
)

// ValidatePaginationParams validates and normalizes pagination parameters
func ValidatePaginationParams(page, itemsPerPage int) (int, int) {
	if page < 1 {
		page = 1
	}
	if itemsPerPage < 1 || itemsPerPage > 100 {
		itemsPerPage = 10
	}
	return page, itemsPerPage
}

// ValidateSortParams validates sort field and order
func ValidateSortParams(sortBy, order string, validFields map[string]bool, defaultSort string) (string, string) {
	if !validFields[sortBy] {
		sortBy = defaultSort
	}
	if order != "asc" && order != "desc" {
		order = "desc"
	}
	return sortBy, order
}

// SanitizeSearchQuery sanitizes search query to prevent SQL injection
func SanitizeSearchQuery(query string) string {
	// Remove potentially dangerous characters
	query = strings.ReplaceAll(query, "'", "")
	query = strings.ReplaceAll(query, "\"", "")
	query = strings.ReplaceAll(query, ";", "")
	query = strings.ReplaceAll(query, "--", "")
	query = strings.TrimSpace(query)

	// Limit length
	if len(query) > 100 {
		query = query[:100]
	}

	return query
}

// ValidateFileSize validates file size is within acceptable limits
func ValidateFileSize(size int64) error {
	const maxSize = 100 * 1024 * 1024 // 100MB
	if size <= 0 {
		return fmt.Errorf("file size must be greater than 0")
	}
	if size > maxSize {
		return fmt.Errorf("file size exceeds maximum limit of %d bytes", maxSize)
	}
	return nil
}

// ValidateFileExtension validates file extension
func ValidateFileExtension(filename string) error {
	allowedExtensions := map[string]bool{
		".pdf": true,
	}

	ext := strings.ToLower(filename[strings.LastIndex(filename, "."):])
	if !allowedExtensions[ext] {
		return fmt.Errorf("file extension %s is not allowed", ext)
	}

	return nil
}

// ValidateTitle validates PDF title
func ValidateTitle(title string) error {
	title = strings.TrimSpace(title)
	if len(title) == 0 {
		return fmt.Errorf("title cannot be empty")
	}
	if len(title) > 255 {
		return fmt.Errorf("title cannot exceed 255 characters")
	}
	return nil
}

// ValidateSummaryStyle validates summary style
func ValidateSummaryStyle(style string) error {
	validStyles := map[string]bool{
		"short":    true,
		"general":  true,
		"detailed": true,
	}

	if !validStyles[strings.ToLower(style)] {
		return fmt.Errorf("invalid summary style: %s", style)
	}

	return nil
}

// ValidateLanguage validates language code
func ValidateLanguage(language string) error {
	validLanguages := map[string]bool{
		"english":    true,
		"indonesian": true,
	}

	if !validLanguages[strings.ToLower(language)] {
		return fmt.Errorf("invalid language: %s", language)
	}

	return nil
}
