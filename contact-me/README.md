# Contact Me - Professional Contact Page Service

A modern, professional contact page service that allows businesses to create beautiful landing pages with their contact information and social media links.

## Features

- Create a unique landing page with a custom URL slug
- Add and manage multiple contact links
- Professional and modern design
- Mobile-responsive layout
- Free and premium subscription options
- Analytics tracking
- Social media integration

## Tech Stack

- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- Payment Processing: Stripe
- Frontend: React with TypeScript
- Styling: Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe account (for payment processing)

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/contact-me.git
cd contact-me
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cd ../backend
cp .env.example .env

# Edit .env with your configuration
```

4. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Profile
- GET /api/profile - Get user profile
- PUT /api/profile - Update user profile
- GET /api/profile/:slug - Get public profile by slug

### Links
- GET /api/links - Get all user links
- POST /api/links - Create new link
- PUT /api/links/:id - Update link
- DELETE /api/links/:id - Delete link
- PUT /api/links/reorder - Reorder links
- GET /api/links/public/:slug - Get public links by user slug

## Subscription Plans

### Free Plan
- Up to 5 links
- Basic analytics
- Standard support

### Premium Plan ($5/month)
- Unlimited links
- Advanced analytics
- Priority support
- Custom themes
- Custom domain support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@contactme.com or join our Slack channel. 