const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/analyze', (req, res) => {
    const imageBase64 = req.body.image;
    console.log("hiii")

    // Spawn Python script
    const python = spawn(
        'C:/Users/arjun/AppData/Local/Programs/Python/Python311/python.exe',
        ['./Analyzer/Analyzer.py']
    );

    let result = '';
    let errorOutput = '';

    // Handle Python stdout
    python.stdout.on('data', (data) => {
        result += data.toString();
    });

    // Handle Python stderr
    python.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`Python error: ${data}`);
    });

    // Handle Python process exit
    python.on('close', (code) => {
        console.log('Raw Python result:', result);
        if (code === 0) {
            try {
                //const output = JSON.parse(result);
                //console.log('Parsed output:', output);
                res.json(result);
            } catch (e) {
                console.error('Failed to parse JSON from Python:', result);
                res.status(500).json({ error: 'Failed to parse Python output.' });
            }
        } else {
            res.status(500).json({ error: 'Python script failed.', stderr: errorOutput });
        }
    });

    // Send base64 image to Python via stdin
    python.stdin.write(JSON.stringify({ image: imageBase64 }));
    python.stdin.end();
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
