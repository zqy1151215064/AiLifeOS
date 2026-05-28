package config

import (
	"bufio"
	"os"
	"strings"
)

type Config struct {
	Addr          string
	StorageDir    string
	ImageBaseURL  string
	ImageAPIKey   string
	ImageModel    string
	ImageSize     string
	ImageEndpoint string
}

func Load() Config {
	loadEnvFile(".env.local")
	loadEnvFile(".env")

	return Config{
		Addr:          getEnv("AILIFEOS_SERVER_ADDR", ":8080"),
		StorageDir:    getEnv("AILIFEOS_STORAGE_DIR", "apps/server-go/storage"),
		ImageBaseURL:  os.Getenv("IMAGE_API_BASE_URL"),
		ImageAPIKey:   os.Getenv("IMAGE_API_KEY"),
		ImageModel:    getEnv("IMAGE_MODEL", "image2"),
		ImageSize:     getEnv("IMAGE_OUTPUT_SIZE", "1024x1024"),
		ImageEndpoint: getEnv("IMAGE_API_IMAGES_PATH", "/v1/images/generations"),
	}
}

func getEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

func loadEnvFile(path string) {
	file, err := os.Open(path)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)
		if key == "" || os.Getenv(key) != "" {
			continue
		}
		_ = os.Setenv(key, value)
	}
}
