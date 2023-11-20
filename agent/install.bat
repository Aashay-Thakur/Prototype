call npm install
python -m venv ./venv
call ./venv/Scripts/activate.bat
pip install -r requirements.txt
start cmd /C npm run expose
python agent.py
```