import React, { useRef, useState } from 'react';
import './ui.css';
import axios from 'axios';

function UI() {
    const videoRef = useRef(null);
    const [translation, setTranslation] = useState('');
    const [loading, setLoading] = useState(false);

    // Start camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error starting camera:', error);
            setTranslation("Camera access failed. Try again.");
        }
    };

    // Handle file upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;

            try {
                setLoading(true);
                const res = await axios.post('http://localhost:5000/analyze', {
                    image: base64Image,
                });

                console.log('Server response:', res.data); // now just a string
                setTranslation(res.data); // ✅ this line updated
            } catch (error) {
                console.error('Upload error:', error);
                setTranslation("Couldn't understand your plant. Try again?");
            } finally {
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // Capture frame from video and send
    const captureAndSend = async () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/analyze', {
                image: imageData,
            });

            console.log('Server response:', res.data);
            setTranslation(res.data);
        } catch (error) {
            console.error('Capture error:', error);
            setTranslation("Couldn't understand your plant. Try again?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <h1>🌿 FloraLingo</h1>
            <video ref={videoRef} autoPlay playsInline width="400" height="300" />
            <br />
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={captureAndSend}>Translate My Plant</button>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {loading ? (
                <p>Analyzing plant vibes...</p>
            ) : (
                <p className="translation">{translation}</p>
            )}
        </div>
    );
}

export default UI;
