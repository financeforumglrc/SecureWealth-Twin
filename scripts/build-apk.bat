@echo off
title SecureWealth Twin - Android APK Builder
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║     SecureWealth Twin - Android APK Builder     ║
echo ╚══════════════════════════════════════════════════╝
echo.

:: Check for Android SDK
if "%ANDROID_HOME%"=="" (
    if exist "%LOCALAPPDATA%\Android\Sdk" (
        set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
    ) else (
        echo [ERROR] ANDROID_HOME is not set!
        echo.
        echo Please install Android Studio from:
        echo https://developer.android.com/studio
        echo.
        echo After installing, set ANDROID_HOME environment variable:
        echo   setx ANDROID_HOME "%%LOCALAPPDATA%%\Android\Sdk"
        echo.
        pause
        exit /b 1
    )
)

:: Check for Java
if "%JAVA_HOME%"=="" (
    echo [WARN] JAVA_HOME not set - checking for Java in PATH...
    where java >nul 2>nul
    if errorlevel 1 (
        echo [ERROR] Java not found! Install JDK 17+:
        echo https://adoptium.net/
        pause
        exit /b 1
    )
)

echo [1/4] Building www/ directory...
cd /d "%~dp0.."
node scripts\copy-to-www.js
if errorlevel 1 (
    echo [ERROR] Failed to build www/
    pause
    exit /b 1
)

echo [2/4] Syncing Capacitor...
call npx cap sync android
if errorlevel 1 (
    echo [ERROR] Capacitor sync failed
    pause
    exit /b 1
)

echo [3/4] Setting up local.properties...
echo sdk.dir=%ANDROID_HOME% > android\local.properties

echo [4/4] Building APK...
cd android
call gradlew assembleDebug
cd ..

if exist android\app\build\outputs\apk\debug\app-debug.apk (
    echo.
    echo ╔══════════════════════════════════════════════════╗
    echo ║     ✅ APK BUILD SUCCESSFUL!                    ║
    echo ╠══════════════════════════════════════════════════╣
    echo ║  APK: android\app\build\outputs\apk\debug\      ║
    echo ║        app-debug.apk                            ║
    echo ╚══════════════════════════════════════════════════╝
) else (
    echo [ERROR] APK build failed - check errors above
    pause
    exit /b 1
)

pause
