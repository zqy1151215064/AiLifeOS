package image2

import (
	"bytes"
	"context"
	"crypto/sha1"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/zqy1151215064/AiLifeOS/apps/server-go/internal/config"
)

type Handler struct {
	cfg      config.Config
	imageDir string
	client   *http.Client
}

type GenerateRequest struct {
	ExerciseID string `json:"exerciseId"`
	Prompt     string `json:"prompt"`
	Version    string `json:"version"`
}

type GenerateResponse struct {
	AssetID    string `json:"assetId"`
	Status     string `json:"status"`
	ImageURL   string `json:"imageUrl"`
	PromptHash string `json:"promptHash"`
	CreatedAt  string `json:"createdAt"`
}

type errorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func NewHandler(cfg config.Config, imageDir string) http.Handler {
	return &Handler{
		cfg:      cfg,
		imageDir: imageDir,
		client:   &http.Client{Timeout: 90 * time.Second},
	}
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, errorResponse{Code: "method_not_allowed", Message: "method not allowed"})
		return
	}

	var input GenerateRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Code: "invalid_json", Message: "invalid JSON body"})
		return
	}

	input.ExerciseID = sanitizeSlug(input.ExerciseID)
	input.Version = sanitizeSlug(defaultString(input.Version, "v1"))
	input.Prompt = strings.TrimSpace(input.Prompt)

	if input.ExerciseID == "" || input.Prompt == "" {
		writeJSON(w, http.StatusBadRequest, errorResponse{Code: "invalid_input", Message: "exerciseId and prompt are required"})
		return
	}

	promptHash := shortHash(input.Prompt)
	assetID := fmt.Sprintf("%s-%s-%s", input.ExerciseID, input.Version, promptHash)
	fileName := assetID + ".png"
	filePath := filepath.Join(h.imageDir, fileName)

	if _, err := os.Stat(filePath); err == nil {
		writeJSON(w, http.StatusOK, GenerateResponse{
			AssetID:    assetID,
			Status:     "ready",
			ImageURL:   "/assets/exercise-images/" + fileName,
			PromptHash: promptHash,
			CreatedAt:  time.Now().Format(time.RFC3339),
		})
		return
	}

	if h.cfg.ImageAPIKey == "" || h.cfg.ImageBaseURL == "" {
		writeJSON(w, http.StatusServiceUnavailable, errorResponse{
			Code:    "image2_not_configured",
			Message: "IMAGE_API_BASE_URL and IMAGE_API_KEY are required before generating images",
		})
		return
	}

	imageBytes, err := h.generateImage(r.Context(), input.Prompt)
	if err != nil {
		writeJSON(w, http.StatusBadGateway, errorResponse{Code: "image2_generation_failed", Message: err.Error()})
		return
	}

	if err := os.WriteFile(filePath, imageBytes, 0o644); err != nil {
		writeJSON(w, http.StatusInternalServerError, errorResponse{Code: "asset_write_failed", Message: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, GenerateResponse{
		AssetID:    assetID,
		Status:     "ready",
		ImageURL:   "/assets/exercise-images/" + fileName,
		PromptHash: promptHash,
		CreatedAt:  time.Now().Format(time.RFC3339),
	})
}

func (h *Handler) generateImage(ctx context.Context, prompt string) ([]byte, error) {
	endpoint, err := joinURL(h.cfg.ImageBaseURL, h.cfg.ImageEndpoint)
	if err != nil {
		return nil, err
	}

	payload := map[string]string{
		"model":           h.cfg.ImageModel,
		"prompt":          prompt,
		"size":            h.cfg.ImageSize,
		"response_format": "b64_json",
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+h.cfg.ImageAPIKey)
	req.Header.Set("Content-Type", "application/json")

	res, err := h.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return nil, fmt.Errorf("image2 returned %d: %s", res.StatusCode, truncate(string(resBody), 300))
	}

	var parsed struct {
		Data []struct {
			B64JSON string `json:"b64_json"`
			URL     string `json:"url"`
		} `json:"data"`
	}
	if err := json.Unmarshal(resBody, &parsed); err != nil {
		return nil, err
	}
	if len(parsed.Data) == 0 {
		return nil, errors.New("image2 response has no data")
	}
	if parsed.Data[0].B64JSON != "" {
		return base64.StdEncoding.DecodeString(parsed.Data[0].B64JSON)
	}
	if parsed.Data[0].URL != "" {
		return h.downloadImage(ctx, parsed.Data[0].URL)
	}
	return nil, errors.New("image2 response has neither b64_json nor url")
}

func (h *Handler) downloadImage(ctx context.Context, imageURL string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, imageURL, nil)
	if err != nil {
		return nil, err
	}
	res, err := h.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return nil, fmt.Errorf("image download returned %d", res.StatusCode)
	}
	return io.ReadAll(res.Body)
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func joinURL(base string, path string) (string, error) {
	parsed, err := url.Parse(base)
	if err != nil {
		return "", err
	}
	parsed.Path = strings.TrimRight(parsed.Path, "/") + "/" + strings.TrimLeft(path, "/")
	return parsed.String(), nil
}

var slugPattern = regexp.MustCompile(`[^a-zA-Z0-9_-]+`)

func sanitizeSlug(value string) string {
	value = strings.TrimSpace(value)
	value = slugPattern.ReplaceAllString(value, "-")
	value = strings.Trim(value, "-_")
	return strings.ToLower(value)
}

func shortHash(value string) string {
	sum := sha1.Sum([]byte(value))
	return hex.EncodeToString(sum[:])[:10]
}

func defaultString(value string, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return value
}

func truncate(value string, max int) string {
	if len(value) <= max {
		return value
	}
	return value[:max] + "..."
}

