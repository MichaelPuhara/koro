import requests
from decouple import config

# Load the API key from environment variables using decouple
ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

# Eleven Labs - Convert Text to Speech
def convert_text_to_speech(message):

    # Define Data (Body)
    body = {
        "text": message,
        "voice_settings": {
            "stability": 0,
            "similarity_boost": 0
        }
    }

    # Define voice
    voice_rachel = "21m00Tcm4TlvDq8ikWAM"

    # Construct Headers and Endpoint
    headers = {"xi-api-key": ELEVEN_LABS_API_KEY, "Content-Type": "application/json", "accept": "audio/mpeg"}
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_rachel}"

    # Send request
    try:
        response = requests.post(endpoint, json=body, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

    # Handle Response
    if response.status_code == 200:
        return response.content
    else:
        return

# Example usage:
# audio_data = convert_text_to_speech("Hello, this is a test.")
# if audio_data:
#     with open("output.mp3", "wb") as audio_file:
#         audio_file.write(audio_data)



# Example usage:
#audio_data = convert_text_to_speech("Hello, this is a test.")
#if audio_data:
   #with open("output.mp3", "wb") as audio_file:
       #audio_file.write(audio_data)