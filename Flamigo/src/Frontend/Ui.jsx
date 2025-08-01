import React, { useRef, useState } from 'react';
import './ui.css';

function UI() {
    const videoRef = useRef(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
    };

    const captureAndSend = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');

        setLoading(true);
        const res = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });

        const data = await res.json();
        setMessage(data.translation);
        setLoading(false);
    };

    return (
        <div className="app">
            <h1>🌿 FloraLingo</h1>
            <video ref={videoRef} autoPlay playsInline width="400" height="300" />
            <br />
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={captureAndSend}>Translate My Plant</button>
            {loading ? <p>Analyzing plant vibes...</p> : <p>{message}</p>}
        </div>
    );
}

export default UI;

