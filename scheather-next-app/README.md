# Scheather - Next.js Calendar & Analytics App

This is a [Next.js](https://nextjs.org) project with Google Analytics integration, calendar functionality, and user management.

## Features

- 📊 **Real-time Analytics Dashboard** - Google Analytics 4 integration
- 📅 **Calendar Management** - Event scheduling and management
- 👥 **User Authentication** - Firebase Auth integration
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Beautiful, intuitive interface

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google Analytics 4 property
- Firebase project (for authentication)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd scheather-next-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your actual values
```

4. **Set up Google Analytics**
   - Create a service account in Google Cloud Console
   - Download the service account key as `service-account-key.json`
   - Add the service account email to your GA4 property with "Viewer" permissions
   - Update `GA_PROPERTY_ID` in `.env.local`

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy `env.example` to `.env.local` and fill in your values:

- `GOOGLE_APPLICATION_CREDENTIALS` - Path to your service account key file
- `GA_PROPERTY_ID` - Your Google Analytics 4 Property ID

## Security Notes

⚠️ **Never commit sensitive files:**
- `service-account-key.json` - Contains API credentials
- `.env.local` - Contains environment variables
- Any other files with API keys or secrets

These files are automatically ignored by Git.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
