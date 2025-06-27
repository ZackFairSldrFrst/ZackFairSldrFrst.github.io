module.exports = {
  DEEPSEEK_API_KEY: 'sk-8a894fb826fd43a88083e4df9d70ae28',
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  UPLOAD_DIR: './uploads',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['pdf', 'docx', 'txt', 'doc']
}; 