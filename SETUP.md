# Diploma Notes - Setup Guide

## Overview
This is a React Native + Expo application for managing notes with full Supabase integration for authentication and database operations.

## Fixed Issues

### 1. **Component Props Fixed**
- ✅ `NoteModal.tsx` - Added proper TypeScript props destructuring
- ✅ `EditNoteModal.tsx` - Added proper TypeScript props destructuring

### 2. **Database Functions Implemented**
- ✅ `fetchTask()` - Fetches all notes from Supabase
- ✅ `handleSubmit()` - Creates new notes in database
- ✅ `updateTask()` - Updates existing notes
- ✅ `deleteTask()` - Deletes notes from database

### 3. **Authentication Implemented**
- ✅ `SignIn.tsx` - Complete sign-in with Supabase auth
- ✅ `SignUp.tsx` - Complete sign-up with Supabase auth

### 4. **Other Fixes**
- ✅ Fixed color hex code in `color-notes.ts` (#4AB → #4DB8E8)
- ✅ All TypeScript compilation errors resolved
- ✅ Environment variables configured

## Supabase Setup Required

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to initialize

### 2. Create Database Table
In Supabase SQL Editor, run:

```sql
CREATE TABLE appnotes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX appnotes_user_id_idx ON appnotes(user_id);

-- Enable Row Level Security
ALTER TABLE appnotes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own notes
CREATE POLICY "Users can view their own notes"
  ON appnotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON appnotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON appnotes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON appnotes FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Update Environment Variables
The `.env.local` file already contains your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Update Database Functions
Update `components/functions/NotesFunctions.tsx` to include user_id in queries:

For `fetchTask()`:
```typescript
const { data: { user } } = await supabase.auth.getUser();
const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });
```

For `handleSubmit()`:
```typescript
const { data: { user } } = await supabase.auth.getUser();
const { error } = await supabase
    .from(tableName)
    .insert([{
        user_id: user?.id,
        title: newTitle.trim(),
        description: newDesc.trim(),
        created_at: new Date().toISOString(),
    }]);
```

## Features

✅ **Authentication**
- Sign up with email/password
- Sign in with email/password
- Session management with Supabase Auth
- Automatic redirect based on auth state

✅ **Notes Management**
- Create notes with title and description
- View all notes in responsive grid layout
- Edit existing notes
- Delete notes
- Search notes by title or description
- Pull-to-refresh functionality

✅ **UI/UX**
- Modern design with NativeWind (Tailwind CSS)
- Haptic feedback on interactions
- Colorful note cards (8 colors)
- Loading states
- Error handling with alerts
- Responsive grid (1, 2, or 3 columns based on screen size)

✅ **Data Persistence**
- All data stored in Supabase
- Real-time sync
- Secure with Row Level Security

## Installation

```bash
# Install dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g expo-cli

# Start the development server
npm start

# Run on specific platform
npm run android   # Android
npm run ios       # iOS
npm run web       # Web
```

## Project Structure

```
app/
  ├── _layout.tsx              # Root layout
  ├── index.tsx                # Entry point
  ├── intro.tsx                # Intro screen
  ├── (auth)/
  │   ├── SignIn/signin.tsx    # Sign in page
  │   └── SignUp/signup.tsx    # Sign up page
  └── (notes)/
      ├── _layout.tsx          # Notes layout
      └── task.tsx             # Notes main page

components/
  ├── functions/
  │   └── NotesFunctions.tsx   # All database functions
  └── modals/
      ├── NoteModal.tsx        # Create note modal
      └── EditNoteModal.tsx    # Edit note modal

lib/
  ├── color-notes.ts           # Color palette
  └── notes-column.ts          # Responsive column logic

services/
  └── supabase.ts              # Supabase client setup

types/
  ├── index.ts                 # Task interface
  └── notemodal.ts             # Modal prop types

utils/
  └── validation.ts            # Email/password validation
```

## Key Dependencies

- **@supabase/supabase-js** - Database & Auth
- **expo-router** - Navigation
- **react-native** - Core framework
- **nativewind** - Tailwind CSS
- **expo-haptics** - Haptic feedback
- **@react-navigation/** - Navigation components

## Configuration Files

- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind configuration
- `babel.config.js` - Babel configuration
- `.env.local` - Environment variables

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
expo prebuild
```

### Supabase connection issues
1. Verify `.env.local` has correct credentials
2. Check that the `appnotes` table exists in Supabase
3. Ensure Row Level Security policies are set correctly

### Hot reload not working
```bash
# Clear cache and restart
npm start -- --clear
```

## Notes

- All user data is protected by Row Level Security
- Users can only see/edit their own notes
- Validation is done both client-side and via database constraints
- Haptic feedback provides better UX feedback

## Support

For issues with Supabase, visit: https://supabase.com/docs
For Expo documentation: https://docs.expo.dev
