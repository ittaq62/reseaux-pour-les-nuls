// Réseaux pour les nuls - serveur local pour Mac (équivalent de serveur.ps1)
//   - sert le dossier web/
//   - enregistre la progression dans sauvegarde/progression.json (+ .bak.json et .csv)
//   - accessible uniquement depuis cet ordinateur (127.0.0.1 et ::1)
// Compilation : python outils/construire_mac.py
package main

import (
	"flag"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

const port = "8766"

var types = map[string]string{
	".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
	".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
	".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
}

var web, sauve string

// dossier qui contient web/index.html : celui de l'exécutable ou l'un de ses parents
func trouverRacine() string {
	exe, err := os.Executable()
	if err == nil {
		if r, e := filepath.EvalSymlinks(exe); e == nil {
			exe = r
		}
		d := filepath.Dir(exe)
		for i := 0; i < 3; i++ {
			if _, e := os.Stat(filepath.Join(d, "web", "index.html")); e == nil {
				return d
			}
			d = filepath.Dir(d)
		}
	}
	return ""
}

func envoyer(w http.ResponseWriter, code int, typ string, corps []byte) {
	w.Header().Set("Content-Type", typ)
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(code)
	w.Write(corps)
}

func ok(w http.ResponseWriter) { envoyer(w, 200, "application/json; charset=utf-8", []byte(`{"ok":true}`)) }

func lireCorps(w http.ResponseWriter, r *http.Request) ([]byte, error) {
	return io.ReadAll(http.MaxBytesReader(w, r.Body, 64<<20))
}

func api(w http.ResponseWriter, r *http.Request) bool {
	switch r.URL.Path {
	case "/api/health":
		ok(w)
		return true
	case "/api/csv":
		if r.Method != http.MethodPost {
			return false
		}
		corps, err := lireCorps(w, r)
		if err != nil {
			envoyer(w, 400, "text/plain; charset=utf-8", []byte("Requête invalide"))
			return true
		}
		/* BOM UTF-8 pour qu'Excel lise bien les accents, comme sous Windows */
		os.WriteFile(filepath.Join(sauve, "progression.csv"), append([]byte{0xEF, 0xBB, 0xBF}, corps...), 0644)
		ok(w)
		return true
	case "/api/progression":
		fichier := filepath.Join(sauve, "progression.json")
		switch r.Method {
		case http.MethodGet:
			txt, err := os.ReadFile(fichier)
			if err != nil {
				txt = []byte("{}")
			}
			envoyer(w, 200, "application/json; charset=utf-8", txt)
		case http.MethodPost:
			corps, err := lireCorps(w, r)
			if err != nil || !strings.HasPrefix(strings.TrimSpace(string(corps)), "{") {
				envoyer(w, 400, "text/plain; charset=utf-8", []byte("JSON attendu"))
				return true
			}
			tmp := fichier + ".tmp"
			if err := os.WriteFile(tmp, corps, 0644); err != nil {
				envoyer(w, 500, "text/plain; charset=utf-8", []byte("Erreur d'écriture"))
				return true
			}
			if ancien, err := os.ReadFile(fichier); err == nil {
				os.WriteFile(filepath.Join(sauve, "progression.bak.json"), ancien, 0644)
			}
			os.Rename(tmp, fichier)
			ok(w)
		case http.MethodDelete:
			liste, _ := filepath.Glob(filepath.Join(sauve, "progression*"))
			for _, f := range liste {
				os.Remove(f)
			}
			ok(w)
		default:
			return false
		}
		return true
	}
	return false
}

func servir(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if e := recover(); e != nil {
			fmt.Println("  [erreur]", e)
			envoyer(w, 500, "text/plain; charset=utf-8", []byte("Erreur serveur"))
		}
	}()
	if api(w, r) {
		return
	}
	chemin := r.URL.Path
	if chemin == "/" {
		chemin = "/index.html"
	}
	complet := filepath.Join(web, filepath.FromSlash(filepath.Clean("/"+chemin)))
	if complet != web && !strings.HasPrefix(complet, web+string(os.PathSeparator)) {
		envoyer(w, 403, "text/plain; charset=utf-8", []byte("Interdit"))
		return
	}
	info, err := os.Stat(complet)
	if err != nil || info.IsDir() {
		envoyer(w, 404, "text/plain; charset=utf-8", []byte("Introuvable"))
		return
	}
	octets, err := os.ReadFile(complet)
	if err != nil {
		envoyer(w, 500, "text/plain; charset=utf-8", []byte("Erreur serveur"))
		return
	}
	typ := types[strings.ToLower(filepath.Ext(complet))]
	if typ == "" {
		typ = "application/octet-stream"
	}
	envoyer(w, 200, typ, octets)
}

func ouvrir(url string) {
	var c *exec.Cmd
	switch runtime.GOOS {
	case "darwin":
		c = exec.Command("open", url)
	case "windows":
		c = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	default:
		c = exec.Command("xdg-open", url)
	}
	c.Start()
}

func attendreFin(code int) {
	fmt.Println("  (Tu peux fermer cette fenêtre.)")
	time.Sleep(8 * time.Second)
	os.Exit(code)
}

func main() {
	racine := flag.String("racine", "", "dossier de l'application (celui qui contient web/)")
	sansNav := flag.Bool("sans-navigateur", false, "ne pas ouvrir le navigateur")
	flag.Parse()
	url := "http://localhost:" + port + "/"
	fmt.Print("\033]0;Réseaux pour les nuls (serveur - ne pas fermer)\007")

	dossier := *racine
	if dossier == "" {
		dossier = trouverRacine()
	}
	if dossier == "" {
		fmt.Println("\n  Dossier « web » introuvable : garde cet exécutable dans le dossier de l'application.")
		attendreFin(1)
	}
	dossier, _ = filepath.Abs(dossier)
	web = filepath.Join(dossier, "web")
	sauve = filepath.Join(dossier, "sauvegarde")
	os.MkdirAll(sauve, 0755)

	ecoute, err := net.Listen("tcp", "127.0.0.1:"+port)
	if err != nil {
		/* déjà lancé ? on ouvre simplement la page */
		cl := http.Client{Timeout: 2 * time.Second}
		if rep, e := cl.Get("http://127.0.0.1:" + port + "/api/health"); e == nil && rep.StatusCode == 200 {
			rep.Body.Close()
			fmt.Println("\n  Le serveur tourne déjà : ouverture de " + url)
			if !*sansNav {
				ouvrir(url)
			}
			attendreFin(0)
		}
		fmt.Println("\n  Impossible de démarrer le serveur sur le port " + port + " (déjà utilisé par un autre programme ?).")
		attendreFin(1)
	}
	gestion := http.HandlerFunc(servir)
	if e6, err := net.Listen("tcp", "[::1]:"+port); err == nil {
		go http.Serve(e6, gestion)
	}

	fmt.Println()
	fmt.Println("  \033[36mRéseaux pour les nuls\033[0m")
	fmt.Println("  Serveur démarré sur " + url)
	fmt.Println("  Progression enregistrée dans : " + sauve)
	fmt.Println("  Laisse cette fenêtre ouverte pendant que tu révises (fermer la fenêtre = arrêter).")
	fmt.Println()
	if !*sansNav {
		ouvrir(url)
	}
	if err := http.Serve(ecoute, gestion); err != nil {
		fmt.Println("  [erreur]", err)
		attendreFin(1)
	}
}
