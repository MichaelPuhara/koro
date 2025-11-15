# Ōwairaka AI - Educational AI Chatbot

An AI-powered educational chatbot designed to help with research on "Reimagining Education: Exploring the Impact of AI Chatbots on Assessment, Engagement, and Critical Thinking Skills."

This project includes both web and mobile (iOS) versions of the application.

## Project Structure

```
koro/
├── frontend/          # React web application
├── backend/           # Python FastAPI backend
└── mobile/            # React Native iOS application
```

## Features

- **Voice-based Interaction**: Record audio messages and receive voice responses
- **AI-Powered Conversations**: Powered by OpenAI's GPT-3.5-turbo
- **Speech-to-Text**: Uses OpenAI's Whisper API
- **Text-to-Speech**: Uses Eleven Labs API with "Rachel" voice
- **Conversation History**: Maintains context across multiple messages
- **Multi-Platform**: Available as web app and iOS mobile app

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   # or
   venv\Scripts\activate     # Windows
   ```

3. Install dependencies:
   ```bash
   pip install fastapi uvicorn python-decouple openai requests aiofiles
   ```

4. Create a `.env` file with your API keys:
   ```
   OPEN_AI_ORG=your_openai_org_id
   OPEN_AI_KEY=your_openai_api_key
   ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
   ```

5. Run the backend:
   ```bash
   uvicorn main:app --reload
   ```

   For mobile development (to accept external connections):
   ```bash
   uvicorn main:app --reload --host 0.0.0.0
   ```

### Web Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Run the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Mobile (iOS) Setup

See the [mobile README](./mobile/README.md) for detailed instructions.

Quick start:
```bash
cd mobile
npm install
npm start
```

Then press `i` to run on iOS simulator, or scan the QR code with Expo Go on your iPhone.

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **OpenAI API**: GPT-3.5-turbo & Whisper
- **Eleven Labs**: Text-to-speech
- **Uvicorn**: ASGI server

### Web Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **react-media-recorder**: Audio recording

### Mobile (iOS)
- **React Native**: Mobile framework
- **Expo**: Development platform
- **TypeScript**: Type safety
- **expo-av**: Audio recording and playback
- **Axios**: HTTP client
- **react-native-svg**: SVG support

## API Endpoints

- `GET /health` - Health check
- `GET /reset` - Clear conversation history
- `POST /post-audio` - Upload audio, get AI response

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
OPEN_AI_ORG=your_openai_organization_id
OPEN_AI_KEY=your_openai_api_key
ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
```

**⚠️ Security Warning**: Never commit the `.env` file to version control!

## Development

### Running Both Web Frontend and Backend

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

Terminal 2 (Web Frontend):
```bash
cd frontend
yarn dev
```

### Running Mobile App

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0
```

Terminal 2 (Mobile):
```bash
cd mobile
npm start
```

## Building for Production

### Web Frontend
```bash
cd frontend
yarn build
```

### Mobile iOS
```bash
cd mobile
eas build --platform ios
```

See the [mobile README](./mobile/README.md) for detailed build instructions.

## Features Comparison

| Feature | Web | iOS Mobile |
|---------|-----|------------|
| Voice Recording | ✅ | ✅ |
| Voice Playback | ✅ | ✅ |
| Conversation History | ✅ | ✅ |
| Reset Conversation | ✅ | ✅ |
| Offline Support | ❌ | ❌ (planned) |
| Dark Mode | ❌ | ❌ (planned) |
| Android Support | N/A | ❌ (planned) |

## Project Purpose

This application is designed to facilitate research on AI in education by:
- Providing voice-based interaction for more natural conversations
- Asking thought-provoking questions about AI in education
- Maintaining conversation context for deeper discussions
- Supporting both web and mobile platforms for accessibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile (if applicable)
5. Submit a pull request

## Troubleshooting

### Backend Issues
- Ensure all API keys are set in `.env`
- Check that the virtual environment is activated
- Verify Python dependencies are installed

### Web Frontend Issues
- Clear the Vite cache: `rm -rf node_modules/.vite`
- Reinstall dependencies: `yarn install`
- Check browser console for errors

### Mobile Issues
- See the [mobile troubleshooting guide](./mobile/README.md#troubleshooting)
- Ensure backend URL is correctly configured
- Verify device and computer are on the same network

## License

[Add your license here]

## Acknowledgments

- OpenAI for GPT-3.5 and Whisper APIs
- Eleven Labs for text-to-speech
- Expo team for excellent mobile development tools
