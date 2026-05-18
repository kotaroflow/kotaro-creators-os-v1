param(
  [string]$OutputDirectory = ".."
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$projectName = Split-Path $projectRoot -Leaf
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outputRoot = Resolve-Path $OutputDirectory
$zipPath = Join-Path $outputRoot "$projectName-google-studio-$stamp.zip"

$excludeNames = @(
  "node_modules",
  "dist",
  ".npm-cache",
  ".git",
  ".env.local",
  ".env.local.txt"
)

$items = Get-ChildItem -Path $projectRoot -Force | Where-Object {
  $excludeNames -notcontains $_.Name
}

Compress-Archive -Path $items.FullName -DestinationPath $zipPath -Force

Write-Host "Pacote criado:"
Write-Host $zipPath
