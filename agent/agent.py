from flask import Flask, request, jsonify
import platform
import psutil
import subprocess
import socket
import os
import time
import re

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
    if (platform.system() == "Linux"):
        data = subprocess.check_output("lsusb", shell=True)
        data = data.decode('utf-8')
        data = data.split('\n')
        data = data[1:-2]
        return jsonify(data)
    elif (platform.system() == "Windows"):
        data = subprocess.check_output("wmic path Win32_PnPEntity get caption", shell=True)
        data = data.decode('utf-8')
        data = data.split('\n')
        data = data[1:-2]
        return jsonify(data)
        

@app.route('/shutdown', methods=['GET'])
def shutdown():
    # return jsonify({"message": "PC shutting down..."})
    if (platform.system() == "Linux"):
        os.system('shutdown -h now') # for linux
        ip = get_ip()
        data = {
            "ip": ip['ip'],
            "hostname": ip['hostname'],
            "message": "PC shutting down..."
        }
        return jsonify(data)
    elif (platform.system() == "Windows"):
        os.system('shutdown /s /t 1')
        ip = get_ip()
        data = {
            "ip": ip['ip'],
            "hostname": ip['hostname'],
            "message": "PC shutting down..."
        }
        return jsonify(data)
    
@app.route('/reboot', methods=['GET'])
def reboot():
    # return jsonify({"message": "PC rebooting..."})
    if (platform.system() == "Linux"):
        os.system('shutdown -r now')
        ip = get_ip()
        data = {
            "ip": ip['ip'],
            "hostname": ip['hostname'],
            "message": "PC rebooting..."
        }
        return jsonify(data)
    elif (platform.system() == "Windows"):
        os.system('shutdown /r /t 1')
        ip = get_ip()
        data = {
            "ip": ip['ip'],
            "hostname": ip['hostname'],
            "message": "PC rebooting..."
        }
        return jsonify(data)

@app.route('/search', methods=['GET'])
def search_app():
    app_name = request.args.get('name')
    app_name = app_name.strip().replace(" ", "-").lower()
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
    # regex_list = []
    for i in range(len(app_list)):
        # regex = re.compile(app.strip().replace(" ", ".").lower(), flags=re.IGNORECASE)
        # regex_list.append(regex)
        app_list[i] = app_list[i].strip().replace(" ", "-").lower()
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
    #! Find an alternative to this, unstable
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
    if (platform.system() == "Windows"):
        output = subprocess.check_output(["ip a"], shell=True)
    elif (platform.system() == "Linux"):
        output = subprocess.check_output(["ifconfig"])
    regex = re.compile("(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", flags=re.MULTILINE)
    ip = regex.findall(output.decode("utf-8"))
    return {
        "ip": ip,
        "hostname": socket.gethostname()
    }

    # return {
    #     "ip": socket.gethostbyname(socket.gethostname()),
    #     "hostname": socket.gethostname()
    # }

def get_uptime():
    return time.time() - psutil.boot_time()

if __name__ == '__main__':
    ip_list = get_ip()['ip']
    regex = re.compile("(172\.18\.36\.\d{1,3})")
    for ip in ip_list:
        if regex.findall(ip):
            if ip.split(".")[-1] != "1":
                host = ip        
    app.run(host, port=3001, debug=True)
    # 192.168.56.102 for virtualbox