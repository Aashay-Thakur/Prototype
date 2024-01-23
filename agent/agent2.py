import socket
import platform
import psutil
import time
import socketio

sio = socketio.Client(logger=True, engineio_logger=True)

@sio.event
def connect():
    print("I'm connected!")

@sio.event
def connect_error(data):
    print("The connection failed!")

@sio.event
def disconnect():
    print("I'm disconnected!")

@sio.on('info')
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
    sio.emit('response_info', data)

def main():
    sio.connect('http://localhost:3000', transports=["websocket"], namespaces=['/agent'])
    sio.wait()

def get_ip():
    return {
        "ip": socket.gethostbyname(socket.gethostname()),
        "hostname": socket.gethostname()
    }

def get_uptime():
    return time.time() - psutil.boot_time()

if __name__ == '__main__':
    main()