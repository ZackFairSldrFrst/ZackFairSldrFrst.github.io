const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const config = require('./config');
const { analyzeDocument } = require('./services/documentAnalyzer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure upload directory exists
fs.ensureDirSync(config.UPLOAD_DIR);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase().substring(1);
    if (config.ALLOWED_FILE_TYPES.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${fileExt} is not allowed`));
    }
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload and analyze document
app.post('/api/analyze', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileType = path.extname(fileName).toLowerCase().substring(1);

    console.log(`Analyzing document: ${fileName}`);

    // Analyze the document using DeepSeek AI
    const analysis = await analyzeDocument(filePath, fileType, fileName);

    // Clean up uploaded file
    await fs.remove(filePath);

    res.json({
      success: true,
      analysis: analysis,
      fileName: fileName
    });

  } catch (error) {
    console.error('Error analyzing document:', error);
    
    // Clean up file if it exists
    if (req.file) {
      await fs.remove(req.file.path).catch(() => {});
    }

    res.status(500).json({
      error: 'Failed to analyze document',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: error.message
  });
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
  console.log(`Upload directory: ${config.UPLOAD_DIR}`);
  console.log(`Allowed file types: ${config.ALLOWED_FILE_TYPES.join(', ')}`);
}); 