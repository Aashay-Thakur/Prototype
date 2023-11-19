from flask import Flask, request, jsonify
import platform
import psutil
import subprocess
import socket


app = Flask(__name__)

@app.route('/info', methods=['GET'])
def getInfo():
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
    # os.system('shutdown -h now') # for linux
    ip = getIP()
    data = {
        "ip": ip['ip'],
        "hostname": ip['hostname'],
        "message": "PC shutting down..."
    }
    return jsonify(data)

@app.route('/applications', methods=['GET'])
def applications():
    data = subprocess.check_output(['wmic', 'product', 'get', 'name'])
    data = data.decode('utf-8')
    data = data.split('\n')
    data = data[1:-2]
    return jsonify(data)

def getIP():
    return {
        "ip": socket.gethostbyname(socket.gethostname()),
        "hostname": socket.gethostname()
    }

if __name__ == '__main__':
    app.run(host='localhost', port=3001, debug=True)