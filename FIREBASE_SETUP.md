# Firebase Setup Guide for Seattle Puzzles

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project (e.g., "seattle-puzzles")
4. Disable Google Analytics (optional for this use case)
5. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon `</>`
4. Register your app with a nickname (e.g., "seattle-puzzles-web")
5. Copy the `firebaseConfig` object

## Step 4: Update Your HTML File

Replace the placeholder config in your HTML file:

```javascript
// Replace this in layouts/_default/seattle-puzzles.html
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 5: Set up Firestore Security Rules (Optional but Recommended)

In Firestore → Rules, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow writes to puzzle_events collection
    match /puzzle_events/{document} {
      allow create: if true;
      allow read: if false; // Prevent reading by clients
    }
  }
}
```

## Step 6: Test Your Setup

1. Deploy your site
2. Open browser developer tools → Console
3. Play through a puzzle
4. Check Firebase Console → Firestore → Data
5. You should see documents in the `puzzle_events` collection

## Data Structure

Your Firebase will collect these events:

### Player Registration
```json
{
  "eventType": "player_name_entered",
  "playerName": "John Doe",
  "category": "game_start",
  "sessionId": "session_1234567890_abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "userAgent": "Mozilla/5.0...",
  "screenSize": "1920x1080",
  "url": "https://yoursite.com/puzzles"
}
```

### Puzzle Attempts
```json
{
  "eventType": "puzzle_attempt",
  "playerName": "John Doe",
  "puzzleNumber": 2,
  "answer": "bronze",
  "isCorrect": true,
  "category": "puzzle_interaction",
  "timeSpent": 45000,
  "sessionId": "session_1234567890_abc123",
  "timestamp": "2024-01-15T10:32:15Z"
}
```

### Game Completion
```json
{
  "eventType": "game_completed",
  "playerName": "John Doe",
  "category": "game_completion",
  "totalTime": 180000,
  "sessionId": "session_1234567890_abc123",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

## Benefits Over Google Analytics

1. **Full Answer Tracking**: See exactly what users typed, not sanitized versions
2. **Time Tracking**: Know how long users spend on each puzzle
3. **Session Tracking**: Follow complete user journeys
4. **Real-time Data**: See responses as they happen
5. **Better Analysis**: Query and filter data easily
6. **No Data Sampling**: Get 100% of your data, not samples

## Viewing Your Data

1. Go to Firebase Console → Firestore → Data
2. Click on `puzzle_events` collection
3. Browse individual documents or use the query interface
4. Export data to CSV/JSON for analysis

## Privacy Notes

- Player names are stored as entered (not sanitized)
- No personal data beyond what users voluntarily provide
- Consider adding a privacy notice to your puzzle page
- Data is stored in Google's secure Firebase infrastructure

## Troubleshooting

- If events aren't appearing, check browser console for errors
- Ensure Firestore rules allow writes to `puzzle_events`
- Verify your Firebase config is correct
- Test with a simple console.log first to ensure Firebase is loading
