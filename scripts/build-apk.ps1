param(
    [switch]$Release
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSCommandPath)

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     SecureWealth Twin - Android APK Builder     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Check Android SDK
if (-not $env:ANDROID_HOME) {
    $possiblePaths = @(
        "$env:LOCALAPPDATA\Android\Sdk",
        "$env:ProgramFiles\Android\Sdk",
        "C:\Android\Sdk"
    )
    foreach ($p in $possiblePaths) {
        if (Test-Path $p) { $env:ANDROID_HOME = $p; break }
    }
    if (-not $env:ANDROID_HOME) {
        Write-Host "❌ ANDROID_HOME not set. Install Android Studio first." -ForegroundColor Red
        Write-Host "   https://developer.android.com/studio"
        exit 1
    }
}
Write-Host "✅ Android SDK: $env:ANDROID_HOME" -ForegroundColor Green

# 2. Check Java
if (-not $env:JAVA_HOME) {
    $java = Get-Command java -ErrorAction SilentlyContinue
    if (-not $java) {
        Write-Host "❌ Java not found. Install JDK 17+ from https://adoptium.net/" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Java: $(java -version 2>&1 | Select-String 'version' | ForEach-Object { $_.ToString().Trim() })" -ForegroundColor Green

# 3. Install dependencies
Write-Host "`n📦 Installing npm dependencies..." -ForegroundColor Yellow
Set-Location $root
npm install

# 4. Build www directory
Write-Host "`n📁 Building www/..." -ForegroundColor Yellow
node scripts/copy-to-www.js

# 5. Sync Capacitor
Write-Host "`n🔄 Syncing Capacitor..." -ForegroundColor Yellow
npx cap sync android

# 6. Create local.properties
Set-Content -Path "$root\android\local.properties" -Value "sdk.dir=$env:ANDROID_HOME".Replace('\', '\\')

# 7. Build APK
Write-Host "`n🔨 Building APK..." -ForegroundColor Yellow
Set-Location "$root\android"
if ($Release) {
    ./gradlew assembleRelease
    $apkPath = "app\build\outputs\apk\release\app-release-unsigned.apk"
} else {
    ./gradlew assembleDebug
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
}

$fullApkPath = Join-Path $root "android\$apkPath"
if (Test-Path $fullApkPath) {
    $size = (Get-Item $fullApkPath).Length / 1MB
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║     ✅ APK BUILD SUCCESSFUL!                    ║" -ForegroundColor Green
    Write-Host "╠══════════════════════════════════════════════════╣" -ForegroundColor Green
    Write-Host "║  File: $apkPath" -ForegroundColor Green
    Write-Host "║  Size: $([math]::Round($size, 2)) MB" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed - check errors above" -ForegroundColor Red
    exit 1
}

Set-Location $root
