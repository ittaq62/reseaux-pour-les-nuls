# ============================================================
#  Réseaux pour les nuls - petit serveur local (PowerShell)
#  - sert le dossier web\
#  - enregistre la progression dans sauvegarde\progression.json (+ .csv)
#  Accessible uniquement depuis cet ordinateur (localhost).
# ============================================================
param([switch]$SansNavigateur)
$ErrorActionPreference = 'Stop'
$Port = 8766
$Racine = Split-Path -Parent $MyInvocation.MyCommand.Path
$Web = Join-Path $Racine 'web'
$Sauve = Join-Path $Racine 'sauvegarde'
if (-not (Test-Path $Sauve)) { New-Item -ItemType Directory -Path $Sauve | Out-Null }
$Utf8 = New-Object System.Text.UTF8Encoding($false)

$Types = @{
  '.html' = 'text/html; charset=utf-8'; '.js' = 'application/javascript; charset=utf-8';
  '.css' = 'text/css; charset=utf-8'; '.json' = 'application/json; charset=utf-8';
  '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.gif' = 'image/gif';
  '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'; '.woff2' = 'font/woff2'; '.txt' = 'text/plain; charset=utf-8'
}

function Envoyer($ctx, [int]$code, [string]$type, [byte[]]$octets) {
  $r = $ctx.Response
  $r.StatusCode = $code
  $r.ContentType = $type
  $r.Headers.Add('Cache-Control', 'no-store')
  $r.ContentLength64 = $octets.Length
  $r.OutputStream.Write($octets, 0, $octets.Length)
  $r.OutputStream.Close()
}
function EnvoyerTexte($ctx, [int]$code, [string]$type, [string]$texte) {
  Envoyer $ctx $code $type ($Utf8.GetBytes($texte))
}

$Ecoute = New-Object System.Net.HttpListener
$Ecoute.Prefixes.Add("http://localhost:$Port/")
$Ecoute.Prefixes.Add("http://127.0.0.1:$Port/")
try { $Ecoute.Start() } catch {
  Write-Host ""
  Write-Host "  Impossible de démarrer le serveur sur le port $Port (déjà utilisé ?)." -ForegroundColor Red
  Write-Host "  Ouvre simplement http://localhost:$Port/ dans ton navigateur."
  Start-Sleep -Seconds 6
  exit 1
}
$Host.UI.RawUI.WindowTitle = 'Réseaux pour les nuls (serveur - ne pas fermer)'
Write-Host ""
Write-Host "  Réseaux pour les nuls" -ForegroundColor Cyan
Write-Host "  Serveur démarré sur http://localhost:$Port/"
Write-Host "  Progression enregistrée dans : $Sauve"
Write-Host "  Laisse cette fenêtre ouverte pendant que tu révises (Ctrl+C ou fermer = arrêter)."
Write-Host ""
if (-not $SansNavigateur) { Start-Process "http://localhost:$Port/" }

while ($Ecoute.IsListening) {
  $ctx = $null
  try {
    $ctx = $Ecoute.GetContext()
    $req = $ctx.Request
    $chemin = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)

    if ($chemin -eq '/api/health') {
      EnvoyerTexte $ctx 200 'application/json; charset=utf-8' '{"ok":true}'
      continue
    }
    if ($chemin -eq '/api/csv' -and $req.HttpMethod -eq 'POST') {
      $lecteur = New-Object System.IO.StreamReader($req.InputStream, $Utf8)
      $corps = $lecteur.ReadToEnd(); $lecteur.Close()
      [System.IO.File]::WriteAllText((Join-Path $Sauve 'progression.csv'), $corps, (New-Object System.Text.UTF8Encoding($true)))
      EnvoyerTexte $ctx 200 'application/json; charset=utf-8' '{"ok":true}'
      continue
    }
    if ($chemin -eq '/api/progression') {
      $fichier = Join-Path $Sauve 'progression.json'
      if ($req.HttpMethod -eq 'GET') {
        if (Test-Path $fichier) { $txt = [System.IO.File]::ReadAllText($fichier, $Utf8) } else { $txt = '{}' }
        EnvoyerTexte $ctx 200 'application/json; charset=utf-8' $txt
        continue
      }
      if ($req.HttpMethod -eq 'POST') {
        $lecteur = New-Object System.IO.StreamReader($req.InputStream, $Utf8)
        $corps = $lecteur.ReadToEnd(); $lecteur.Close()
        if (-not $corps.TrimStart().StartsWith('{')) { EnvoyerTexte $ctx 400 'text/plain; charset=utf-8' 'JSON attendu'; continue }
        $tmp = "$fichier.tmp"
        [System.IO.File]::WriteAllText($tmp, $corps, $Utf8)
        if (Test-Path $fichier) { Copy-Item $fichier (Join-Path $Sauve 'progression.bak.json') -Force }
        Move-Item $tmp $fichier -Force
        EnvoyerTexte $ctx 200 'application/json; charset=utf-8' '{"ok":true}'
        continue
      }
      if ($req.HttpMethod -eq 'DELETE') {
        Get-ChildItem $Sauve -Filter 'progression*' | Remove-Item -Force
        EnvoyerTexte $ctx 200 'application/json; charset=utf-8' '{"ok":true}'
        continue
      }
    }

    # fichiers statiques
    if ($chemin -eq '/') { $chemin = '/index.html' }
    $rel = $chemin.TrimStart('/').Replace('/', '\')
    $complet = [System.IO.Path]::GetFullPath((Join-Path $Web $rel))
    if (-not $complet.StartsWith([System.IO.Path]::GetFullPath($Web))) {
      EnvoyerTexte $ctx 403 'text/plain; charset=utf-8' 'Interdit'
      continue
    }
    if (Test-Path $complet -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($complet).ToLower()
      $type = $Types[$ext]; if (-not $type) { $type = 'application/octet-stream' }
      Envoyer $ctx 200 $type ([System.IO.File]::ReadAllBytes($complet))
    } else {
      EnvoyerTexte $ctx 404 'text/plain; charset=utf-8' 'Introuvable'
    }
  } catch {
    Write-Host ("  [erreur] " + $_.Exception.Message) -ForegroundColor DarkYellow
    try { if ($ctx) { EnvoyerTexte $ctx 500 'text/plain; charset=utf-8' 'Erreur serveur' } } catch {}
  }
}
