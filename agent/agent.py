from flask import Flask, request, jsonify
import platform
import psutil
import subprocess
import socket
import os
import re


app = Flask(__name__)

@app.route('/info', methods=['GET'])
def get_info():
    data = {
        "platform": platform.system(),
        "release": platform.release(),
        "type": platform.machine(),
        "version": platform.version(),
        "hostname": platform.node(),
        "arch": platform.architecture(),
        "cpus": platform.processor(),
        "memory": psutil.virtual_memory(),
        "disk": psutil.disk_usage('/'),
        "network": psutil.net_io_counters(),
        "users": psutil.users(),
    }
    return jsonify(data)

@app.route('/peripherals', methods=['GET'])
def get_peripherals():
    data = subprocess.check_output("lsusb", shell=True)
    data = data.decode('utf-8')
    data = data.split('\n')
    data = data[1:-2]
    return jsonify(data)

@app.route('/shutdown', methods=['GET'])
def shutdown():
    # os.system('shutdown /s') # for windows
    os.system('shutdown -h now') # for linux
    ip = get_ip()
    data = {
        "ip": ip['ip'],
        "hostname": ip['hostname'],
        "message": "PC shutting down..."
    }
    return jsonify(data)

@app.route('/search-app', methods=['GET'])
def search_app():
    app_name = "firefox"
    output = subprocess.check_output(["apt", "list", "--installed"])
    for line in output.decode("utf-8").splitlines():
        columns = line.split()
        columns[0] = columns[0].split("/")[0]
        if columns[0] == app_name:
            app_details = {
                "name": app_name,
                "version": columns[1],
                "description": columns[2],
            }
            return jsonify(app_details)
    return {"response": "Application not found"}
    

@app.route('/applications', methods=['GET'])
def applications():
    output = subprocess.check_output(["apt", "list", "--installed"])
    return_array = []
    for line in output.decode("utf-8").splitlines():
        columns = line.split()
        columns[0] = columns[0].split("/")[0]
        data = {
            "name": columns[0],
        }
        if len(columns) > 1:
            data["version"] = columns[1]
        if len(columns) > 2:
            data["description"] = columns[2]
        return_array.append(data)
    return jsonify(return_array)

def get_ip():
    return {
        "ip": socket.gethostbyname(socket.gethostname()),
        "hostname": socket.gethostname()
    }

if __name__ == '__main__':
    app.run(host='localhost', port=3001, debug=True)
    # 192.168.56.102 for virtualbox