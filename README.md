# IdeaBlob - AI-Powered Note Taking App

IdeaBlob is a modern web application that combines note-taking with AI-powered features to help you organize your thoughts, generate ideas, and manage your notes efficiently.

## Features

- **AI-Powered Chat**: Interact with Google Generative AI to brainstorm ideas, get suggestions, and more
- **Smart Note Organization**: Categorize and tag your notes for easy retrieval
- **Dark/Light Mode**: Choose your preferred theme for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login with email/password or Google authentication
- **Real-time Updates**: Changes to notes are saved and updated in real-time

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI Integration**: Google Generative AI
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm package manager
- Firebase account
- Google AI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ideablob.git
   cd ideablob
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
ideablob/
├── app/                  # Next.js app directory
│   ├── chat/             # Chat page
│   ├── notes/            # Notes page
│   ├── profile/          # Profile page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Root page (redirects to /chat)
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── chat/             # Chat components
│   ├── layout/           # Layout components
│   ├── notes/            # Notes components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                  # Utility functions and services
│   ├── ai-service.ts     # Google AI integration
│   ├── auth-context.tsx  # Authentication context
│   ├── category-service.ts # Category management
│   ├── firebase.ts       # Firebase configuration
│   ├── note-service.ts   # Note management
│   └── user-context.tsx  # User preferences context
├── public/               # Static assets
└── ...                   # Configuration files
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/)
- [Google Generative AI](https://ai.google.dev/)
