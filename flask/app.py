from flask import Flask, request, jsonify
import os
import moviepy.editor as mpy  
from pytube import YouTube
from pydub import AudioSegment
import requests
from bs4 import BeautifulSoup
from googleapiclient.discovery import build
import speech_recognition as sr


app = Flask(__name__)

OUTPUT_PATH = "downloads"

# Load the pre-trained model and processor
# model_name = "facebook/wav2vec2-base-960h"
# processor = Wav2Vec2Processor.from_pretrained(model_name)
# model = Wav2Vec2ForCTC.from_pretrained(model_name)
r = sr.Recognizer()

def download_audio(url):
    try:
        yt = YouTube(url)
        # Download audio only as mp3
        audio_stream = yt.streams.filter(only_audio=True).first() 
        audio_stream.download(output_path=OUTPUT_PATH, filename=f"{yt.title}.mp3")
        print(f"Downloaded: {yt.title}.mp3")  
        return yt.title
    except Exception as e:
        print(f"Download Error: {str(e)}")
        return None

def audio_to_wav(audio_file_path, output_wav_file_path):
    sound = AudioSegment.from_file(audio_file_path)
    sound.export(output_wav_file_path, format="wav")

def get_transcript(audio_file_path):
    # waveform, sample_rate = torchaudio.load(audio_file_path)
    # # Tokenize the audio file
    # input_values = processor(waveform.squeeze().numpy(), return_tensors="pt", padding="longest", sample_rate=sample_rate).input_values
    # # Pass the tokenized input to the model
    # logits = model(input_values).logits
    # # Take argmax and decode
    # predicted_ids = torch.argmax(logits, dim=-1)
    # transcription = processor.batch_decode(predicted_ids)[0]
    # return transcription
    with sr.AudioFile(audio_file_path) as source:
        audio = r.record(source)
        s=""
    try:
        s = r.recognize_google(audio)
    except Exception as e:
        s = str(e)
    return s
    

@app.route('/', methods=['POST'])
def home():
    if 'url' not in request.json:
        return jsonify({'error': 'URL not provided'}), 400
    
    url = request.json['url']
    
    # Scraping the channel URL to get the channel ID
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    canonical_tag = soup.find('link', attrs={'rel': 'canonical'})
    if canonical_tag:
        channel_url = canonical_tag['href']
        channel_id = channel_url.split("/")[-1]
    else:
        return jsonify({'error': 'Channel ID not found'}), 500
    
    # YouTube API setup
    API_KEY = 'AIzaSyCDWikYjZgY9jlEMVukD3b_L6-G4gc14fs' 
    MAX_RESULTS = 1
    youtube = build('youtube', 'v3', developerKey=API_KEY)

    # Retrieve videos from the specified channel
    try:
        videos_response = youtube.search().list(
            part='id',
            channelId=channel_id,
            order='viewCount',
            maxResults=MAX_RESULTS
        ).execute()
        # Extract video IDs
        video_ids = [item['id']['videoId'] for item in videos_response['items']]
    except KeyError as e:
        return jsonify({'error': f'Error accessing videoId from response: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Error retrieving videos: {str(e)}'}), 500

    transcripts = []

    for video_id in video_ids:
        video_url = f'https://www.youtube.com/watch?v={video_id}'
        audio_title = download_audio(video_url)
        
        if audio_title is None:
            return jsonify({'error': f'Failed to download audio for video {video_id}'}), 500
        
        mp3_file = os.path.join(OUTPUT_PATH, f"{audio_title}.mp3")
        wav_file = os.path.join(OUTPUT_PATH, "result.wav")

        audio_to_wav(mp3_file, wav_file)
        os.remove(mp3_file)

        transcript = get_transcript(wav_file)
        transcripts.append({'video_id': video_id, 'transcription': transcript})
        os.remove(wav_file)

        return jsonify({"transcripts": transcripts}), 200

if __name__=='__main__':
    app.run(debug=True, port=5001)
