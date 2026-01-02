package models

import (
	"gorm.io/gorm"
)

type Summaries struct {
	gorm.Model
	Style       string  `gorm:"not null"`
	Content     string  `gorm:"not null"`
	PDFID       uint    `gorm:"not null"`
	Language    string  `gorm:"not null"`
	SummaryTime float64 `gorm:"not null"`
	PDF         PDF     `gorm:"foreignKey:PDFID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
