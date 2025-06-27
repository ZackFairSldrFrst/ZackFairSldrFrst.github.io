# DocuRead - AI Document Analysis System

A powerful web application that uses DeepSeek AI to analyze documents, with special focus on tax forms, legal documents, and business documents. The system can identify missing information, errors, compliance issues, and provide detailed recommendations.

## Features

- **Multi-format Support**: Upload PDF, DOCX, DOC, and TXT files
- **AI-Powered Analysis**: Uses DeepSeek AI for intelligent document analysis
- **Comprehensive Analysis**: 
  - Document overview and completeness assessment
  - Missing information identification
  - Error detection and validation
  - Compliance warnings
  - Actionable recommendations
- **Modern UI**: Beautiful, responsive interface with drag-and-drop functionality
- **Real-time Processing**: Instant analysis with progress indicators
- **Security**: Secure file handling with automatic cleanup

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- DeepSeek API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd docuread
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the API key**
   Edit `config.js` and update the `DEEPSEEK_API_KEY` with your actual API key:
   ```javascript
   DEEPSEEK_API_KEY: 'your-deepseek-api-key-here'
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3001`

## Development

To run the application in development mode with auto-restart:

```bash
npm run dev
```

## API Endpoints

### POST `/api/analyze`
Upload and analyze a document.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `document` field containing the file

**Response:**
```json
{
  "success": true,
  "analysis": "Detailed AI analysis in markdown format",
  "fileName": "document.pdf"
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Supported File Types

- **PDF** (.pdf) - Tax forms, legal documents, reports
- **DOCX** (.docx) - Microsoft Word documents
- **DOC** (.doc) - Legacy Word documents
- **TXT** (.txt) - Plain text files

## Analysis Features

### Document Overview
- Identifies document type and purpose
- Assesses overall completeness
- Highlights key information found

### Missing Information Detection
- Flags incomplete fields and sections
- Identifies missing signatures
- Notes required attachments
- Highlights blank required fields

### Error Detection
- Mathematical errors in calculations
- Data inconsistencies
- Formatting issues
- Compliance violations

### Warnings and Recommendations
- Critical issues requiring immediate attention
- Potential penalties or consequences
- Specific actions needed for completion
- Compliance advice and best practices

## Configuration

Edit `config.js` to customize:

```javascript
module.exports = {
  DEEPSEEK_API_KEY: 'your-api-key',
  PORT: 3001,
  NODE_ENV: 'development',
  UPLOAD_DIR: './uploads',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['pdf', 'docx', 'txt', 'doc']
};
```

## Security Considerations

- Files are automatically deleted after analysis
- API keys are stored securely in configuration
- File type validation prevents malicious uploads
- File size limits prevent abuse

## Troubleshooting

### Common Issues

1. **"Failed to analyze document"**
   - Check your DeepSeek API key
   - Ensure the file is not corrupted
   - Verify file type is supported

2. **"No text could be extracted"**
   - The document might be image-based PDF
   - Try converting to text format first
   - Check if the document is password protected

3. **"File size too large"**
   - Reduce file size or compress the document
   - Current limit is 10MB

### Logs

Check the console output for detailed error messages and processing information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the console logs
3. Create an issue in the repository

## Example Usage

### Tax Form Analysis
Upload a partially filled tax form and the system will:
- Identify missing fields (income, deductions, etc.)
- Flag mathematical errors
- Check for required signatures
- Provide deadline warnings
- Suggest next steps

### Legal Document Review
Upload contracts or legal documents to:
- Identify missing clauses
- Flag potential legal issues
- Check for compliance requirements
- Highlight critical terms

### Business Document Analysis
Upload business documents to:
- Verify completeness
- Check for inconsistencies
- Identify missing approvals
- Provide improvement suggestions 