# Ōwairaka AI - Mobile App (iOS)

This is the iOS mobile version of the Ōwairaka AI chatbot application, built with React Native and Expo.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS development:
  - macOS with Xcode installed
  - iOS Simulator or physical iOS device
  - Expo Go app (from App Store) for testing on device

## Project Structure

```
mobile/
├── App.tsx                      # Main app component
├── src/
│   └── components/
│       ├── Controller.tsx       # Main conversation controller
│       ├── Title.tsx           # Header with reset button
│       ├── RecordMessage.tsx   # Audio recording component
│       └── RecordIcon.tsx      # Microphone icon
├── app.json                    # Expo configuration
├── package.json                # Dependencies
└── tsconfig.json              # TypeScript configuration
```

## Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the App

### Development with Expo Go

1. Start the development server:
   ```bash
   npm start
   # or
   expo start
   ```

2. This will open the Expo Developer Tools in your browser.

3. To run on iOS:
   - **iOS Simulator**: Press `i` in the terminal or click "Run on iOS simulator" in the browser
   - **Physical Device**:
     - Install Expo Go from the App Store
     - Scan the QR code shown in the terminal/browser with your camera
     - The app will open in Expo Go

### Running on iOS Simulator (macOS only)

```bash
npm run ios
# or
expo start --ios
```

### Running on Physical iOS Device

1. Install Expo Go from the App Store
2. Ensure your device and computer are on the same network
3. Run `npm start` and scan the QR code with your camera
4. The app will open in Expo Go

## Backend Configuration

The mobile app connects to the same FastAPI backend as the web version.

### Important: Update Backend URL

Before deploying or testing on a physical device, update the backend URL in:

- `src/components/Controller.tsx` (line ~67)
- `src/components/Title.tsx` (line ~18)

Replace `http://localhost:8000` with your actual backend URL:

```typescript
// For local development on physical device, use your computer's IP
const response = await axios.post("http://YOUR_IP_ADDRESS:8000/post-audio", ...)

// For production, use your deployed backend URL
const response = await axios.post("https://your-backend.com/post-audio", ...)
```

### Finding Your Local IP Address

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Look for your local IP (usually something like `192.168.x.x` or `10.0.x.x`)

## Backend Setup

Ensure your backend is running:

```bash
cd ../backend
# Activate virtual environment if needed
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Run the backend
uvicorn main:app --reload --host 0.0.0.0
```

Note: Using `--host 0.0.0.0` allows the backend to accept connections from other devices on your network.

## Features

- **Voice Recording**: Hold the microphone button to record your voice message
- **AI Responses**: Receive voice responses from Ōwairaka AI
- **Conversation History**: View and replay past messages
- **Reset Conversation**: Clear the conversation history with the reset button

## Permissions

The app requires the following permissions:

- **Microphone Access**: To record audio messages
- **Speech Recognition**: For processing voice input

These permissions are automatically requested when you first use the recording feature.

## Building for Production

### Building a Standalone iOS App

1. Create an Expo account at https://expo.dev

2. Login to Expo:
   ```bash
   expo login
   ```

3. Build for iOS:
   ```bash
   eas build --platform ios
   ```

4. Follow the prompts to configure your build

For more details, see the [Expo documentation](https://docs.expo.dev/build/setup/).

## Troubleshooting

### Cannot connect to backend

- Ensure the backend is running and accessible
- Check that you're using the correct IP address (not localhost when on device)
- Verify your device and computer are on the same network
- Check firewall settings

### Audio recording not working

- Ensure microphone permissions are granted
- Check device volume settings
- Try restarting the app

### App crashes on iOS

- Check the console for error messages
- Ensure all dependencies are properly installed (`npm install`)
- Try clearing the Metro bundler cache: `expo start -c`

## Key Differences from Web Version

1. **Audio Recording**: Uses `expo-av` instead of `react-media-recorder`
2. **Styling**: Uses React Native `StyleSheet` instead of Tailwind CSS
3. **Components**: Uses React Native components (`View`, `Text`, `TouchableOpacity`) instead of HTML elements
4. **Audio Playback**: Uses `expo-av` Sound API instead of HTML5 Audio
5. **Permissions**: Requires explicit permission requests for microphone access

## Tech Stack

- **React Native**: Mobile framework
- **Expo**: Development platform and tooling
- **TypeScript**: Type safety
- **expo-av**: Audio recording and playback
- **axios**: HTTP client
- **react-native-svg**: SVG support for icons

## Future Enhancements

- [ ] Add Android support
- [ ] Implement offline message queuing
- [ ] Add user authentication
- [ ] Support for multiple voice options
- [ ] Add text transcription display
- [ ] Implement push notifications
- [ ] Add dark mode support

## License

Same as the main project.

## Support

For issues or questions, please refer to the main project repository.
