const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    console.log('Attempting to serve index.html from:', indexPath);
    
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error sending index.html:', err);
            res.status(500).send('Error loading page');
        }
    });
});

// Add a test route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Current directory:', __dirname);
    console.log('Files in directory:', require('fs').readdirSync(__dirname));
}); 