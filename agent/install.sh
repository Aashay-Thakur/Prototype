#!/bin/bash
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi
if ! command -v python3 &> /dev/null
then
    echo "Installing Node"
    apt-get install nodejs -y
else 
    echo "node is already installed"
fi
if ! command -v npm &> /dev/null
then
    echo "Installing python3"
    apt-get install npm -y
else 
    echo "npm is already installed"
fi
if ! command -v python3 &> /dev/null
then
    echo "Installing python3"
    apt-get install python3 -y
else 
    echo "python3 is already installed"
fi
npm install localtunnel -y
apt install python3.10-venv -y
if [ ! -d "$venv" ]
then
	python3 -m venv venv
fi
source venv/bin/activate
if test -f "requirements.txt"
then
	pip install -r requirements.txt
else
	echo "Please include the requirements.txt file"
	exit
fi
if ! command -v gnome-terminal &> /dev/null
then
    echo "Installing gnome-terminal"
    apt-get install gnome-terminal -y
else 
    echo "gnome-terminal is already installed"
fi
if ! command -v dbus-launch &> /dev/null
then
	echo "Installing dbus-launch"
	apt install dbus-x11 -y
fi
sudo -u mca gnome-terminal -- bash -c "npx lt -s test -p 3001; exec bash -i"
python3 agent.py
