from flask import Flask, request, jsonify
import platform
import psutil
import subprocess
import socket
import os
import time

app = Flask(__name__)


@app.route('/info', methods=['GET'])
def get_info():
    ip = get_ip()
    data = {
        "uptime": get_uptime(),
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
        "ip": ip['ip'],
    }
    return jsonify(data)

@app.route('/peripherals', methods=['GET'])
def get_peripherals():
    # return jsonify([{"keyboard": "connected", "mouse": "connected", "monitor": "connected"}])
    data = subprocess.check_output("lsusb", shell=True)
    data = data.decode('utf-8')
    data = data.split('\n')
    data = data[1:-2]
    return jsonify(data)

@app.route('/shutdown', methods=['GET'])
def shutdown():
    # return jsonify({"message": "PC shutting down..."})
    # os.system('shutdown /s') # for windows
    os.system('shutdown -h now') # for linux
    ip = get_ip()
    data = {
        "ip": ip['ip'],
        "hostname": ip['hostname'],
        "message": "PC shutting down..."
    }
    return jsonify(data)

@app.route('/search', methods=['GET'])
def search_app():
    app_name = request.args.get('name')
    # return jsonify({"name": app_name, "version": "test", "description": "test"})
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

@app.route('/installed_from_list', methods=['GET'])
def installed_from_list():
    # return jsonify([{"name": "Android", "version": "test", "description": "test"}, {"name": "Firefox", "version": "test", "description": "test"}])
    app_list = request.data.decode("utf-8").split(",")  
    output = subprocess.check_output(["apt", "list", "--installed"])
    return_array = []
    for line in output.decode("utf-8").splitlines():
        columns = line.split()
        columns[0] = columns[0].split("/")[0]
        if columns[0] in app_list:
            app_details = {
                "name": columns[0],
                "version": columns[1],
                "description": columns[2],
            }
            return_array.append(app_details)
    return jsonify(return_array)
    

@app.route('/applications', methods=['GET'])
def applications():
    # return jsonify([{"name": "Android", "version": "test", "description": "test"}, {"name": "Firefox", "version": "test", "description": "test"}])
    output = subprocess.check_output(["apt", "list", "--installed"])
    return_array = []
    output = output.decode("utf-8").splitlines()
    output.pop(0)
    for line in output:
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

def get_uptime():
    return time.time() - psutil.boot_time()

if __name__ == '__main__':
    app.run(host='localhost', port=3001, debug=True)
    # 192.168.56.102 for virtualbox