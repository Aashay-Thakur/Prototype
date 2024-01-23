#!/bin/bash

setlocal

YELLOW_BG='\033[43m'
RED='\033[0;31m'
RESET='\033[0m'

echo "---Checking for dependencies---"

if command -v wget &>/dev/null; then
    echo "wget is installed"
else
    echo "wget is not installed"
    # echo "Please install curl"
    echo "Press any key to exit..."
    read -n 1 -s
    exit
fi

# if command -v node &>/dev/null; then
#     echo "node is installed"
# else
#     echo "node is not installed"
#     echo "installing nodejs"
#     sudo apt-get install nodejs -y
#     if [ $? -eq 1 ]; then
#         echo "Failed to install nodejs"
#         echo "Press any key to exit..."
#         read -n 1 -s
#         exit
#     else
#         echo "nodejs installed"
#     fi
# fi

# if command -v npm &>/dev/null; then
#     echo "npm is installed"
# else
#     echo "npm is not installed"
#     echo "installing npm"
#     apt-get install npm -y
#     if [ $? -eq 1 ]; then
#         echo "Failed to install npm"
#         echo "Press any key to exit..."
#         read -n 1 -s
#         exit
#     else
#         echo "npm installed"
#     fi
# fi

if command -v python3 &>/dev/null; then
    echo "python3 is installed"
else
    echo "python3 is not installed"
    echo "installing python3"
    apt-get install python3 -y
    if [ $? -eq 1 ]; then
        echo "Failed to install python3"
        echo "Press any key to exit..."
        read -n 1 -s
        exit
    else
        echo "python3 installed"
    fi
fi

if command -v pip &>/dev/null; then
    echo "pip is installed"
else
    echo "pip is not installed"
    echo "installing pip"
    apt-get install python3-pip -y
    if [ $? -eq 1 ]; then
        echo "Failed to install pip"
        echo "Press any key to exit..."
        read -n 1 -s
        exit
    else
        echo "pip installed"
    fi
fi

# if [ -f package.json ]; then
#     echo "package.json exists"
# else
#     echo "package.json does not exist"
#     echo "Downloading package.json"
#     wget -O package.json https://raw.githubusercontent.com/Aashay-Thakur/Prototype/react/agent/package.json
# fi

# if [ $? -eq 0 ]; then
#     echo "package.json downloaded successfully"
# else
#     echo "Failed to download package.json"
#     echo "Looks like package.json was not downloaded successfully"
#     echo "Creating package.json"
#     npm init -y
#     if [ $? -eq 1 ]; then
#         echo "Failed to create package.json"
#         echo "Press any key to exit..."
#         read -n 1 -s
#         exit
#     else
#         echo "package.json created"
#     fi
# fi

# if command -v npx localtunnel &>/dev/null; then
#     echo "localtunnel is installed"
# else
#     echo "localtunnel is not installed"
#     echo "Installing localtunnel"
#     npm install localtunnel
# fi

if [ -d venv ]; then
    echo "venv exists"
else
    echo "venv does not exist"
    echo "Creating python virtual environment"
    apt install python3.10-venv -y
    if [ $? -eq 1 ]; then
        echo "Failed to install python3.10-venv"
        echo "Press any key to exit..."
        read -n 1 -s
        exit
    fi
    python3 -m venv ./venv
fi

if [ $? -eq 1 ]; then
    echo "Failed to create python virtual environment"
    echo "Press any key to exit"
    read -n 1 -s
    exit
else
    echo "Python virtual environment created"
fi

echo "Downloading requirements.txt"
wget -O requirements.txt https://raw.githubusercontent.com/Aashay-Thakur/Prototype/react/agent/requirements.txt

if [ $? -eq 0  ]; then
    echo "requirements.txt downloaded successfully"
else
    echo "Looks like requirements.txt was not downloaded successfully"
    if [ -e requirements.txt ]; then
        echo "found an old requirements.txt"
    else
        echo "requirements.txt does not exist"
        echo "Creating requirements.txt"
        touch requirements.txt
        echo "requirements.txt created"
        
        echo -e "${YELLOW_BG}${RED}Warning${RESET}: This is an empty requirements.txt file"
        echo "This might cause errors"
        # echo "Press any key to continue..."
        # read -n 1 -s
    fi
fi

echo "Activating python virtual environment"
source venv/bin/activate

if [ $? -eq 1 ]; then
    echo "Failed to activate python virtual environment"
    echo "Press any key to exit"
    read -n 1 -s
    exit
else
    echo "Python virtual environment activated"
fi

if [ ! -s requirements.txt ]; then
    echo "requirements.txt is empty"
    echo -e "${YELLO_BG}${RED}Warning${RESET}: Are you sure you want to continue?"
    echo -e "${YELLO_BG}${RED}Warning${RESET}: Requirements.txt is empty"
    echo "Please replace the file with a valid requirements.txt file"
    echo "Press any key to continue..."
    read -n 1 -s
fi

pip install -r requirements.txt

echo "Downloading agent.py"
wget -O agent.py https://raw.githubusercontent.com/Aashay-Thakur/Prototype/react/agent/agent.py

if [ $? -eq 0 ]; then
    echo "Downloaded agent.py successfully"
else
    echo "agent.py does not exist"
    echo "Looks like agent.py was not downloaded successfully"
    echo "Press any key to exit..."
    read -n 1 -s
    # exit
fi

apt install dbus-x11
echo "---Installation complete---"
# echo "Starting a localtunnel session in a new window"
# sudo -u mca gnome-terminal -- bash -c "npx lt -s test -p 3001; exec bash -i"
# gnome-terminal -- bash -c "npm run expose; exec bash -i"
echo "Starting agent.py"
python3 agent.py
