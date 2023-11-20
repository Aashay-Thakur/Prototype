from flask import Flask, request, jsonify
import platform
import psutil
import subprocess
import socket
import os


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
    app_name = request.args.get('name')
    data = subprocess.check_output(['flatpack', 'search', app_name])
    data = data.decode('utf-8')
    data = data.split('\n')
    data = data[1:-2]
    return jsonify(data)
    

@app.route('/applications', methods=['GET'])
def applications():
    data = subprocess.check_output(['wmic', 'product', 'get', 'name'])
    data = data.decode('utf-8')
    data = data.split('\n')
    data = data[1:-2]
    return jsonify(data)

def get_ip():
    return {
        "ip": socket.gethostbyname(socket.gethostname()),
        "hostname": socket.gethostname()
    }

if __name__ == '__main__':
    app.run(host='localhost', port=3002, debug=True)