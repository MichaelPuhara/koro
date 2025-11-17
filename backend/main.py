# uvicorn main:app
# uvicorn main:app --reload

# Main Imports
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config

# Custom Functions Import
from functions.database import store_messages, reset_messages
from functions.openai_requests import convert_audio_to_text, get_chat_response
from functions.text_to_speech import convert_text_to_speech


# Initiate app
app = FastAPI()

# CORS - Origins
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:4174",
    "http://localhost:3000",
    "http://192.168.68.50:8081",  # iOS Simulator Metro bundler
    "*",  # Allow all origins for development
]

# CORS - Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check Health
@app.get("/health")
async def check_health():
    return {"message": "healthy"}

# Reset Messages
@app.get("/reset")
async def reset_conversation():
    reset_messages()
    return {"message": "conversation reset"}

# Get audio
@app.post("/post-audio")
async def post_audio(file: UploadFile = File(...)):
    try:
        print(f"Received file: {file.filename}, content_type: {file.content_type}")

        # Save file from Frontend
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        print(f"File saved to: {file_path}, size: {len(content)} bytes")

        # Convert m4a to mp3 for Whisper compatibility
        import subprocess
        converted_path = file_path.replace('.m4a', '.mp3')

        try:
            # Use ffmpeg to convert (if available)
            result = subprocess.run([
                'ffmpeg', '-i', file_path,
                '-acodec', 'libmp3lame',
                '-ar', '16000',  # 16kHz sample rate for Whisper
                '-y',  # Overwrite output file
                converted_path
            ], check=True, capture_output=True, text=True)
            audio_file_to_use = converted_path
            print(f"Converted audio to: {converted_path}")
        except FileNotFoundError as e:
            print(f"FFmpeg not found: {e}")
            print("Please install ffmpeg: brew install ffmpeg")
            audio_file_to_use = file_path
        except subprocess.CalledProcessError as e:
            print(f"FFmpeg conversion failed: {e}")
            print(f"FFmpeg stderr: {e.stderr}")
            print(f"FFmpeg stdout: {e.stdout}")
            audio_file_to_use = file_path

        # Open the audio file for processing
        with open(audio_file_to_use, "rb") as audio_input:
            # Decode Audio using Whisper
            print("Calling Whisper API for transcription...")
            message_decoded = convert_audio_to_text(audio_input)

        if not message_decoded:
            print("Failed to transcribe audio")
            raise HTTPException(status_code=400, detail="Failed to transcribe audio")

        print(f"Transcribed message: {message_decoded}")

        # Get ChatGPT response
        print("Getting ChatGPT response...")
        chat_response = get_chat_response(message_decoded)

        if not chat_response:
            print("Failed to get chat response")
            raise HTTPException(status_code=400, detail="Failed to get chat response")

        print(f"ChatGPT response: {chat_response}")

        # Store messages
        store_messages(message_decoded, chat_response)

        # Convert chat response to audio
        print("Converting response to speech...")
        audio_output = convert_text_to_speech(chat_response)

        if not audio_output:
            print("Failed to convert text to speech")
            raise HTTPException(status_code=400, detail="Failed to convert text to speech")

        print("Successfully generated audio response")

        # Create a generator that yields chunks of data
        def iterfile():
            yield audio_output

        # Return audio file
        return StreamingResponse(iterfile(), media_type="application/octet-stream")

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error processing audio: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    


    







  
