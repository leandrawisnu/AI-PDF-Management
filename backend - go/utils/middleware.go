package utils

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

// CORSMiddleware handles CORS headers
func CORSMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Method() == "OPTIONS" {
			return c.SendStatus(204)
		}

		return c.Next()
	}
}

// LoggingMiddleware logs requests with timing
func LoggingMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		err := c.Next()

		duration := time.Since(start)
		status := c.Response().StatusCode()

		fmt.Printf("[%s] %s %s - %d (%v)\n",
			c.Method(),
			c.Path(),
			c.IP(),
			status,
			duration,
		)

		return err
	}
}

// ErrorHandler provides consistent error responses
func ErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal Server Error"

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
		message = e.Message
	}

	return c.Status(code).JSON(fiber.Map{
		"error":     "server_error",
		"message":   message,
		"code":      code,
		"timestamp": time.Now().Unix(),
	})
}

// RateLimitMiddleware provides basic rate limiting
func RateLimitMiddleware() fiber.Handler {
	// Simple in-memory rate limiter
	requests := make(map[string][]time.Time)

	return func(c *fiber.Ctx) error {
		ip := c.IP()
		now := time.Now()

		// Clean old requests (older than 1 minute)
		if times, exists := requests[ip]; exists {
			var validTimes []time.Time
			for _, t := range times {
				if now.Sub(t) < time.Minute {
					validTimes = append(validTimes, t)
				}
			}
			requests[ip] = validTimes
		}

		// Check rate limit (100 requests per minute)
		if len(requests[ip]) >= 100 {
			return c.Status(429).JSON(fiber.Map{
				"error":   "rate_limit_exceeded",
				"message": "Too many requests, please try again later",
			})
		}

		// Add current request
		requests[ip] = append(requests[ip], now)

		return c.Next()
	}
}
