@echo off

set chocolateyFound=false
where /q choco.exe
if %ERRORLEVEL%==0 (
  set chocolateyFound=true
)

if %chocolateyFound%==true (
  echo Chocolatey already installed !
  echo Upgrading chocolatey if possible...
  choco upgrade chocolatey -y
) else (
  echo Installing chocolatey...
  @powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
)
