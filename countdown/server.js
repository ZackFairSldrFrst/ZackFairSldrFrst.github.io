const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Handle dynamic countdown pages
app.get('/countdown/:id.html', (req, res) => {
    const countdownId = req.params.id;
    const pageContent = localStorage.getItem(`countdown-${countdownId}`);
    
    if (pageContent) {
        res.send(pageContent);
    } else {
        res.status(404).send('Countdown not found');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 