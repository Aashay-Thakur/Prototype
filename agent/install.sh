if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi
apt-get update -y
apt-get upgrade -y
if ! command -v node &> /dev/null
then
    echo "Installing Node"
    apt-get install nodejs -y
    if ! command -v node &> /dev/null
    then
        echo "Node was not successfully installed"
        exit
    fi
else 
    echo "Node is already installed"
fi
if ! command -v npm &> /dev/null
then
    echo "Installing npm"
    apt-get install npm -y
    if ! command -v npm &> /dev/null
    then
        echo "npm was not successfully installed"
        exit
    fi
else 
    echo "npm is already installed"
fi
if ! command -v python3 &> /dev/null
then
    echo "Installing python3"
    apt-get install python3 -y
    if ! command -v python3 &> /dev/null
    then
        echo "python3 was not successfully installed"
        exit
    fi
else 
    echo "python3 is already installed"
fi
source npm install
python3 -m venv venv
source venv/bin/activate
python3 pip install -r requirements.txt
if ! command -v gnome-terminal &> /dev/null
then
    echo "Installing gnome-terminal"
    apt-get install gnome-terminal -y
    if ! command -v gnome-terminal &> /dev/null
    then
        echo "gnome-terminal was not successfully installed"
        exit
    fi
else 
    echo "gnome-terminal is already installed"
fi
gnome-terminal -- bash -c "npm run expose; exec bash"
python3 agent.py