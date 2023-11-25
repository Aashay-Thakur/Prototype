echo off
echo ---Checking for dependencies---
where curl --version >nul 2>nul
if errorlevel 1 (
    echo curl is not installed
    echo Please install curl
    echo Press any key to exit...
    pause >nul
    exit
) else (
    echo curl is installed
)
where node -version >nul 2>nul
if errorlevel 1 (
    echo node is not installed
    echo Please install node.js
    echo Press any key to exit
    pause >nul
    exit
) else (
    echo node is installed
)
where npm -version >nul 2>nul
if errorlevel 1 (
    echo npm is not installed
    echo looks like npm was not installed with nodejs
    echo reinstalling nodejs should fix this
    echo Press any key to exit...
    pause >nul
    exit
) else (
    echo npm is installed
)
where python -version >nul 2>nul
if errorlevel 1 (
    echo python is not installed
    echo Please install python
    echo Press any key to exit
    pause >nul
    exit
) else (
    echo python is installed
)
if exist package.json (
    echo package.json exists
) else (
    echo package.json does not exist
    echo downloading package.json
    curl https://raw.githubusercontent.com/Aashay-Thakur/Prototype/main/agent/package.json -O
)
if errorlevel 0 (
    goto :continue
) else (
    echo failed to download package.json
    echo looks like package.json was not downloaded successfully
    echo creating package.json
    call npm init -y   
)
if errorlevel 1 (
    echo failed to create package.json
    echo Press any key to exit
    pause >nul
    exit
) else (
    echo package.json created
)
:continue
where npx lt --version >nul 2>nul
if errorlevel 1 (
    echo localtunnel is not installed
    echo installing localtunnel
    call npm install localtunnel
) else (
    echo localtunnel is installed
)
if exist venv\ (
    echo venv exists
) else (
    echo venv does not exist
    echo creating python virtual environment
    call python -m venv ./venv
)
if errorlevel 1 (
    echo failed to activate python virtual environment
    echo Press any key to exit
    pause >nul
    exit
) else (
    echo python virtual environment created
)
echo downloading requirements.txt
curl https://raw.githubusercontent.com/Aashay-Thakur/Prototype/main/agent/requirements.txt -O
if exist requirements.txt (
    echo requirements.txt exists
) else (
    echo requirements.txt does not exist
    echo looks like requirements.txt was not downloaded successfully
    echo please include requirements.txt in the same directory as install.bat
    echo Press any key to exit...
    pause >nul
    exit
)
echo activating python virtual environment
call ./venv/Scripts/activate.bat
if errorlevel 1 (
    echo failed to activate python virtual environment
    echo Press any key to exit
    pause >nul
    exit
) else (
    echo python virtual environment activated
)
echo checking if requirements.txt is up to date
pip freeze > temp.txt
fc /b temp.txt requirements.txt > nul
if errorlevel 1 (
    echo requirements.txt is not up to date
    echo Installing requirements.txt
    pip install -r requirements.txt
) else (
    echo requirements.txt is up to date
)
del temp.txt
echo downloading agent.py
curl https://raw.githubusercontent.com/Aashay-Thakur/Prototype/main/agent/agent.py -O
if exist agent.py (
    echo downloaded agent.py successfully
) else (
    echo agent.py does not exist
    echo looks like agent.py was not downloaded successfully
    echo Press any key to exit...
    pause >nul
    exit
)
echo ---Installation complete---
echo starting a localtunnel session in a new window
start cmd /C "npm run expose"
echo starting agent.py
python agent.py