package main

import (
	"backend-go/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"fmt"
)

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=ai_pdf_management port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	println("Koneksi ke database berhasil!")
	println("Pilih mode migrasi:")
	println("1. AutoMigrate")
	println("2. Drop & Migrate \n")
	print("Pilih: ")

	var mode int
	n, err := fmt.Scanln(&mode)

	if err != nil || n != 1 || (mode != 1 && mode != 2) {
		println("Pilihan tidak valid")
		return
	}

	if mode == 2 {
		if err := db.Migrator().DropTable(
			&models.PDF{},
			&models.Summaries{},
		); err != nil {
			println("Drop Table Gagal " + err.Error())
			return
		}
	}

	if err := db.AutoMigrate(
		&models.PDF{},
		&models.Summaries{},
	); err != nil {
		println("Migration Gagal " + err.Error())
		return
	}

	println("Migration berhasil!")
}
