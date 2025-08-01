from flask import Flask, jsonify
import cv2
import numpy as np
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from flask_cors import CORS
import threading
import time

app = Flask(__name__)
CORS(app)
current_volume = 50.0  # Initialize with default value

# Pycaw setup
devices = AudioUtilities.GetSpeakers()
interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
volume_control = cast(interface, POINTER(IAudioEndpointVolume))

def set_volume(vol):
    global current_volume
    vol = max(0.0, min(1.0, vol))  # Ensure volume is between 0 and 1
    volume_control.SetMasterVolumeLevelScalar(vol, None)
    current_volume = vol * 100  # Store as percentage

def camera_loop():
    global current_volume
    cap = cv2.VideoCapture(0)
    prev_vol = 0.5  # Start at 50%

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        avg_brightness = gray.mean()

        # --- Lid detection based on darkness ---
        darkness_threshold = 40  # Lower this if needed
        brightness_threshold = 100  # Considered open if brighter than this

        if avg_brightness < darkness_threshold:
            # Lid mostly closed => Increase volume
            vol = min(prev_vol + 0.05, 1.0)
        elif avg_brightness > brightness_threshold:
            # Lid open => Decrease volume
            vol = max(prev_vol - 0.05, 0.0)
        else:
            vol = prev_vol  # No major change

        set_volume(vol)
        prev_vol = vol
        time.sleep(0.5)

@app.route('/get-volume')
def get_volume():
    return jsonify({
        'volume': float(current_volume),
        'status': 'success'
    })

if __name__ == '__main__':
    threading.Thread(target=camera_loop, daemon=True).start()
    app.run(port=5000)
