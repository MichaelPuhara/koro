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

        # WAV files are directly compatible with Whisper - no conversion needed
        print(f"Processing audio file: {file_path}")

        # Open the audio file for processing
        with open(file_path, "rb") as audio_input:
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
    


    







  
