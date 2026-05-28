package main

import (
	"log"
	"net/http"

	"github.com/zqy1151215064/AiLifeOS/apps/server-go/internal/config"
	"github.com/zqy1151215064/AiLifeOS/apps/server-go/internal/httpserver"
)

func main() {
	cfg := config.Load()
	handler, err := httpserver.New(cfg)
	if err != nil {
		log.Fatalf("start ailifeos server: %v", err)
	}

	log.Printf("AiLifeOS Go service listening on %s", cfg.Addr)
	if err := http.ListenAndServe(cfg.Addr, handler); err != nil {
		log.Fatalf("serve ailifeos server: %v", err)
	}
}

