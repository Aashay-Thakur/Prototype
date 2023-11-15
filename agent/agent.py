from flask import Flask, request, jsonify
import platform
import os

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
    }
    return jsonify(data)

@app.route('/shutdown', methods=['GET'])
def shutdown():
    # os.system('shutdown /s')
    # /a - to abort
    # /p - to shutdown immediately
    # /r - to restart
    # /t xxx - to specify the time in seconds, xxx is the time in seconds
    # /f - to force the shutdown (force close all running applications)
    return 'Server shutting down...'

@app.route('/applications', methods=['GET'])
def applications():
    return 'List of applications'

if __name__ == '__main__':
    app.run(host='localhost', port=3001, debug=True)