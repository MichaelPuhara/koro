# Koro AI Chat - iOS App

An AI-powered voice chat educational assessment tool built with React Native for iOS.

## Overview

This is the iOS version of the Koro AI Chat application, converted from the original web application. The app allows users to have voice conversations with an AI assistant focused on educational assessment topics.

## Features

- Voice recording using native iOS audio APIs
- Real-time audio transcription using OpenAI's Whisper API
- AI-powered responses using GPT-3.5-turbo
- Text-to-speech conversion using Eleven Labs API
- Conversation history management
- Clean, native iOS interface

## Prerequisites

Before running the app, make sure you have the following installed:

- Node.js (version 18 or higher)
- Xcode (latest version)
- CocoaPods
- React Native CLI

## Installation

1. Navigate to the ios-app directory:
```bash
cd ios-app
```

2. Install Node dependencies:
```bash
npm install
```

3. Install iOS dependencies (CocoaPods):
```bash
cd ios
pod install
cd ..
```

## Running the App

### Start the Backend Server

The iOS app requires the backend FastAPI server to be running. From the root directory:

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload
```

The backend should be running on `http://localhost:8000`.

### Start the iOS App

1. Start the Metro bundler:
```bash
npm start
```

2. In a new terminal, run the iOS app:
```bash
npm run ios
```

Or open the project in Xcode:
```bash
open ios/KoroChat.xcworkspace
```

Then build and run from Xcode.

## Configuration

### Backend URL

If your backend is not running on localhost (e.g., when testing on a physical device), you'll need to update the API URL in the following files:

- `src/components/Controller.tsx` (line 29)
- `src/components/Title.tsx` (line 16)

Replace `http://localhost:8000` with your computer's IP address or deployed backend URL.

### Permissions

The app requires microphone permission to record audio. This is already configured in `ios/KoroChat/Info.plist` with the following key:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Koro AI Chat needs access to your microphone to record your voice messages for AI conversation.</string>
```

## Project Structure

```
ios-app/
├── App.tsx                          # Root component
├── index.js                         # App entry point
├── src/
│   └── components/
│       ├── Controller.tsx           # Main conversation logic
│       ├── RecordMessage.tsx        # Audio recording component
│       ├── RecordIcon.tsx           # Microphone icon component
│       └── Title.tsx                # Header with reset button
├── ios/                             # iOS native code
│   └── KoroChat/
│       └── Info.plist              # iOS app configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
├── babel.config.js                  # Babel configuration
└── metro.config.js                  # Metro bundler configuration
```

## Dependencies

### Main Dependencies
- **react-native**: Core framework for building native apps
- **react-native-audio-recorder-player**: Native audio recording and playback
- **react-native-sound**: Audio playback library
- **react-native-fs**: File system access for saving audio files
- **react-native-svg**: SVG support for icons
- **axios**: HTTP client for API requests

## Development

### TypeScript

The project uses TypeScript for type safety. Type definitions are included for all components.

### Debugging

To debug the app:

1. In Xcode, select "Debug" → "Attach to Process" → "KoroChat"
2. Use React Native Debugger or Chrome DevTools
3. View logs with `npx react-native log-ios`

## Testing on Physical Device

To test on a physical iOS device:

1. Connect your iPhone to your Mac
2. Open the project in Xcode: `open ios/KoroChat.xcworkspace`
3. Select your device from the device dropdown
4. Update the bundle identifier if needed
5. Click "Run"

Note: Make sure to update the backend URL to your computer's IP address instead of localhost.

## Troubleshooting

### CocoaPods Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Build Errors
```bash
# Clean build
cd ios
xcodebuild clean
cd ..
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

### Metro Bundler Issues
```bash
# Reset cache
npx react-native start --reset-cache
```

### Audio Recording Not Working
- Check microphone permissions in Settings → Privacy → Microphone
- Ensure Info.plist contains NSMicrophoneUsageDescription
- Verify the app is requesting permissions correctly

## Known Limitations

- Currently configured for iOS only (Android support can be added)
- Requires active internet connection for AI features
- Audio files are stored locally and may accumulate over time

## Future Enhancements

- Add conversation export feature
- Implement offline mode with cached responses
- Add support for different AI voice personalities
- Integrate push notifications for conversation reminders
- Add analytics for tracking learning progress

## License

This project is part of a Master's research project on AI in education.

## Support

For issues or questions, please refer to the main project repository or contact the development team.
