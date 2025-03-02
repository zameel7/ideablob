# IdeaBlob - AI-Powered Note Taking App

IdeaBlob is a modern web application that combines note-taking with AI-powered features to help you organize your thoughts, generate ideas, and manage your notes efficiently.

## Features

- **AI-Powered Chat**: Interact with Google Gemini AI to brainstorm ideas, get suggestions, and more
- **Smart Note Organization**: Categorize and tag your notes for easy retrieval
- **Dark/Light Mode**: Choose your preferred theme for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login with email/password or Google authentication
- **Real-time Updates**: Changes to notes are saved and updated in real-time
- **Client-side API Key**: Your Google Gemini API key is stored securely in your browser

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini 2.0
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm package manager
- Firebase account
- Google Gemini API key (users can add their own in the app)

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
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Using the App

1. **Sign up or log in** using email/password or Google authentication
2. **Add your Google Gemini API key** in the profile settings
   - You can get a free API key from [Google AI Studio](https://ai.google.dev/)
   - The key is stored securely in your browser's localStorage
3. **Start chatting** with the AI assistant to generate ideas and take notes
4. **Organize your notes** by categories and tags
5. **Customize your experience** in the profile settings

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
│   ├── ai-service.ts     # Google Gemini integration
│   ├── auth-context.tsx  # Authentication context
│   ├── category-service.ts # Category management
│   ├── firebase.ts       # Firebase configuration
│   ├── note-service.ts   # Note management
│   └── user-context.tsx  # User preferences context
├── public/               # Static assets
└── ...                   # Configuration files
```

## Security

- **Firebase Authentication** secures user accounts
- **Firestore Security Rules** protect user data
- **API Keys** are stored in the user's browser localStorage, not on the server
- **HTTPS** ensures secure communication

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/)
- [Google Gemini AI](https://ai.google.dev/)
