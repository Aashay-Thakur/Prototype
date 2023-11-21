echo off
if exist package.json (
    echo package.json exists
) else (
    echo package.json does not exist
    echo Please include package.json in the same directory as install.bat
    echo If you do not have package.json, please run npm init -y
    echo Press any key to exit
    pause >nul
    exit
)
if exist node_modules\ (
    echo node_modules exists
) else (
    echo node_modules does not exist
    echo Installing node_modules
    call npm install
)
if exist venv\ (
    echo venv exists
) else (
    echo venv does not exist
    echo creating python virtual environment
    call python -m venv ./venv
)
echo activating python virtual environment
call ./venv/Scripts/activate.bat
if exist requirements.txt (
    echo requirements.txt exists
) else (
    echo requirements.txt does not exist
    echo Please include requirements.txt in the same directory as install.bat
    echo If you do not have requirements.txt, please run pip freeze > requirements.txt
    echo Press any key to exit
    pause >nul
    exit
)
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
echo Installation complete
echo starting new localtunnel session in a new window
start cmd /C npm run expose
echo starting agent.py
python agent.py
```