# Profile App
 
A modern Next.js application with Google Authentication, Image Uploads to Cloudinary, and specific production-grade polish.
 
## Features
 
- **Authentication**: Secure sign-in with Google using NextAuth.js (v5).
- **Profile Management**: View and edit your profile.
- **Image Upload**: Upload profile pictures directly to Cloudinary with optimistic updates.
- **Production Polish**:
  - Loading skeletons & spinners
  - Toast notifications for success/error feedback
  - Global error boundaries
  - Responsive and accessible design
 
## Tech Stack
 
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Auth**: NextAuth.js (Auth.js) v5
- **Database**: PostgreSQL (via Prisma ORM)
- **Styling**: Tailwind CSS
- **Storage**: Cloudinary
- **UI Feedback**: React Hot Toast
 
## Getting Started
 
### Prerequisites
 
- Node.js 18+
- PostgreSQL database
 
### Installation
 
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd profile-app
   ```
 
2. **Install dependencies:**
   ```bash
   npm install
   ```
 
3. **Environment Setup:**
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```
 
### Configuration Guide
 
#### 1. Database (PostgreSQL)
Ensure you have a PostgreSQL database running. Update `DATABASE_URL` in `.env`.
   ```bash
   npx prisma db push
   ```
 
#### 2. Google OAuth credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Configure the OAuth content screen (External).
4. Create credentials > OAuth 2.0 Client ID.
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret to `.env`.
 
#### 3. Cloudinary credentials
1. Sign up at [Cloudinary](https://cloudinary.com/).
2. Go to your Dashboard and copy the **Cloud Name**, **API Key**, and **API Secret**.
3. Add them to `.env`.
 
4. **Run the development server:**
   ```bash
   npm run dev
   ```
 
   Open [http://localhost:3000](http://localhost:3000) with your browser.
 
## Project Structure
 
- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components.
- `/lib`: Utility functions and configurations (auth, prisma, cloudinary).
- `/prisma`: Database schema.
 
## License
 
MIT
