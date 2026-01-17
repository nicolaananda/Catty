# ReceiveMail - Disposable Email Service

<div align="center">

**Privacy-focused temporary email service with intelligent filtering**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Development](#development)

</div>

---

## Overview

ReceiveMail is a modern, self-hosted disposable email service designed for developers and privacy-conscious users. It provides temporary email addresses with intelligent service-specific filtering, ensuring sensitive verification codes remain secure while filtering out unwanted emails.

## Features

### 🔐 Security & Privacy
- **Intelligent Filtering**: Service-specific whitelists prevent sensitive emails from leaking
- **Auto-Cleanup**: Emails automatically deleted after 24 hours
- **Password-Protected Admin**: Secure dashboard for managing filters

### 📧 Email Management
- **Multi-Domain Support**: `@ghzm.us` and `@nicola.id` domains
- **Real-time IMAP**: Live email fetching from external SMTP servers
- **Service Filters**: Pre-configured for Zoom, Netflix, and general use
- **Smart Inbox**: Separate views for each service with exclusion logic

### 🎨 Modern UI
- **Dark/Light Mode**: Persistent theme with automatic email content adaptation
- **Responsive Design**: Optimized for desktop and mobile
- **Clean Aesthetics**: Professional SaaS-style interface
- **Live Updates**: Auto-refresh every 5 seconds

### 🐳 Deployment
- **Docker-Ready**: Single-command deployment with Docker Compose
- **Nginx Integration**: Production-ready reverse proxy configuration
- **Environment Variables**: Easy configuration management

## Quick Start

### Docker Deployment (Recommended)

```bash
# Clone the repository
git clone git@github.com:nicolaananda/receive-mail.git
cd receive-mail

# Start services
docker-compose up -d --build
```

**Access Points:**
- Frontend: http://localhost:6661
- Backend API: http://localhost:6662
- Admin Panel: http://localhost:6661/admin (Password: `1905`)

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for detailed deployment guide.

### Development Setup

**Prerequisites:**
- Node.js 18+
- npm or yarn

**Backend:**
```bash
cd server
npm install
npm run dev
```
- API Server: http://localhost:3001

**Frontend:**
```bash
cd client
npm install
npm run dev
```
- Dev Server: http://localhost:5173

## Architecture

### Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS v4 (custom theme system)
- React Router for navigation
- Axios for API calls
- Lucide React for icons

**Backend:**
- Node.js with Express
- SQLite database
- IMAP client (`imap-simple`, `mailparser`)
- CORS enabled for cross-origin requests

**Deployment:**
- Docker & Docker Compose
- Nginx (reverse proxy + static file serving)
- Multi-stage builds for optimization

### How It Works

1. **Email Reception**: IMAP client polls external SMTP server for new emails
2. **Parsing**: Emails are parsed and stored in SQLite database
3. **Filtering**: Backend applies service-specific subject filters
4. **Display**: Frontend fetches and displays emails with theme-aware rendering
5. **Cleanup**: Cron job deletes emails older than 24 hours

### Service Filtering Logic

- **Zoom**: Only shows emails matching whitelist (e.g., "sign-in code")
- **Netflix**: Only shows emails matching whitelist (e.g., "temporary access code")
- **General**: Shows all emails EXCEPT those matching Zoom/Netflix filters

This prevents sensitive emails (like "change email" notifications) from appearing in the General inbox.

## Configuration

### Environment Variables

**Backend (`server/.env`):**
```env
API_PORT=3001
IMAP_USER=your-email@example.com
IMAP_PASSWORD=your-password
IMAP_HOST=imap.example.com
IMAP_PORT=993
```

**Frontend:**
- No environment variables required for development
- API endpoint configured in `vite.config.js` proxy

### Admin Panel

Access the admin panel at `/admin` to:
- View all configured services
- Update subject filters for Zoom/Netflix
- Modify sender filters (currently subject-only matching)

Default password: `1905` (change in `client/src/pages/Admin.jsx`)

## Usage

1. **Generate Email**: Visit homepage and enter a username (or click "Generate Random")
2. **Select Service**: Choose Zoom, Netflix, or General
3. **View Inbox**: Emails appear in real-time with 5-second polling
4. **Read Email**: Click to view with theme-aware rendering
5. **Auto-Delete**: Emails are automatically removed after 24 hours

## Project Structure

```
receive-mail/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components (Layout, etc.)
│   │   ├── context/       # Theme context
│   │   ├── pages/         # Home, Inbox, Admin
│   │   └── index.css      # Tailwind v4 config
│   ├── Dockerfile
│   └── nginx.conf
├── server/                # Node.js backend
│   ├── db.js             # SQLite setup
│   ├── imap.js           # IMAP polling
│   ├── routes.js         # API endpoints
│   ├── index.js          # Express server
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

- `GET /api/emails/:user` - Get all emails for user (excludes Zoom/Netflix)
- `GET /api/emails/:user/service/:serviceId` - Get filtered emails
  - `serviceId=1`: Zoom
  - `serviceId=2`: Netflix
  - `serviceId=3`: General (Other)
- `GET /api/services` - List all services
- `PUT /admin/services/:id` - Update service filters

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- Built with modern web technologies
- Inspired by privacy-focused email services
- Designed for developers who value security

---

<div align="center">
Made with ❤️ by <a href="https://github.com/nicolaananda">Nicola Ananda</a>
</div>
