package httpserver

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	"github.com/zqy1151215064/AiLifeOS/apps/server-go/internal/config"
	"github.com/zqy1151215064/AiLifeOS/apps/server-go/internal/image2"
)

func New(cfg config.Config) (http.Handler, error) {
	imageDir := filepath.Join(cfg.StorageDir, "exercise-images")
	if err := os.MkdirAll(imageDir, 0o755); err != nil {
		return nil, err
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", handleHealth)
	mux.Handle("POST /api/image2/exercise-image", image2.NewHandler(cfg, imageDir))
	mux.Handle(
		"GET /assets/exercise-images/",
		http.StripPrefix("/assets/exercise-images/", http.FileServer(http.Dir(imageDir))),
	)

	return mux, nil
}

func handleHealth(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

