apt-get update -y
apt-get upgrade -y
apt-get install nodejs -y
apt-get install npm -y
apt-get install python3 -y
source npm install
python3 -m venv venv
source venv/bin/activate
python3 pip install -r requirements.txt
gnome-terminal -- bash -c "npm run expose; exec bash"
python3 agent.py