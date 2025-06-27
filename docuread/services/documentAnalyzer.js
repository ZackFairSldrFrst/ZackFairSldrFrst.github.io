const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const config = require('../config');

class DocumentAnalyzer {
  constructor() {
    this.deepseekApiKey = config.DEEPSEEK_API_KEY;
    this.deepseekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
  }

  async extractText(filePath, fileType) {
    try {
      const buffer = await fs.readFile(filePath);
      
      switch (fileType) {
        case 'pdf':
          const pdfData = await pdfParse(buffer);
          return pdfData.text;
        
        case 'docx':
        case 'doc':
          const result = await mammoth.extractRawText({ buffer });
          return result.value;
        
        case 'txt':
          return buffer.toString('utf-8');
        
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      throw new Error(`Failed to extract text from ${fileType} file: ${error.message}`);
    }
  }

  async analyzeWithDeepSeek(text, fileName) {
    try {
      const prompt = this.buildAnalysisPrompt(text, fileName);
      
      const response = await axios.post(this.deepseekApiUrl, {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert document analyzer specializing in tax forms, legal documents, and business documents. You provide detailed analysis with specific warnings about missing information, errors, and compliance issues.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.1
      }, {
        headers: {
          'Authorization': `Bearer ${this.deepseekApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error.response?.data || error.message);
      throw new Error(`Failed to analyze document with DeepSeek: ${error.message}`);
    }
  }

  buildAnalysisPrompt(text, fileName) {
    return `Please analyze the following document "${fileName}" and provide a comprehensive analysis. 

Document content:
${text}

Please provide your analysis in the following structured format:

## DOCUMENT OVERVIEW
- Document type and purpose
- Key information identified
- Overall completeness assessment

## MISSING INFORMATION
- List all missing fields, signatures, or required information
- Flag any incomplete sections
- Note any required attachments that are missing

## ERRORS AND ISSUES
- Identify any mathematical errors
- Flag inconsistencies in data
- Note any compliance issues
- Highlight potential legal problems

## WARNINGS
- Critical issues that need immediate attention
- Potential penalties or consequences
- Recommendations for correction

## RECOMMENDATIONS
- Specific actions needed to complete the document
- Suggested improvements
- Compliance advice

## SUMMARY
- Overall assessment (Complete/Incomplete/Needs Review)
- Priority level (High/Medium/Low)
- Next steps

Please be thorough and specific in your analysis. If this appears to be a tax form, pay special attention to tax-specific requirements and deadlines.`;
  }

  async analyzeDocument(filePath, fileType, fileName) {
    try {
      console.log(`Extracting text from ${fileName}...`);
      const extractedText = await this.extractText(filePath, fileType);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the document');
      }

      console.log(`Text extracted successfully. Length: ${extractedText.length} characters`);
      console.log(`Analyzing document with DeepSeek AI...`);
      
      const analysis = await this.analyzeWithDeepSeek(extractedText, fileName);
      
      return {
        fileName: fileName,
        fileType: fileType,
        textLength: extractedText.length,
        analysis: analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Document analysis failed: ${error.message}`);
    }
  }
}

// Export the analyzeDocument function
async function analyzeDocument(filePath, fileType, fileName) {
  const analyzer = new DocumentAnalyzer();
  return await analyzer.analyzeDocument(filePath, fileType, fileName);
}

module.exports = {
  analyzeDocument,
  DocumentAnalyzer
}; 