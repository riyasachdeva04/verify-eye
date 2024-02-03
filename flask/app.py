from flask import Flask, request
from moviepy.editor import *
from pydub import AudioSegment
from pytube import YouTube

app = Flask(__name__)

OUTPUT_PATH = "downloads" 

def download_video(url, output_path=OUTPUT_PATH):
    try:
        yt = YouTube(url)
        audio_stream = yt.streams.filter(only_audio=True).first()
        audio_stream.download(output_path)
        print(f"Audio downloaded successfully to {output_path}/{yt.title}.mp3")
        return yt.title
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

def MP4ToMP3(mp4, mp3):
    FILE_TO_CONVERT = AudioFileClip(mp4)
    FILE_TO_CONVERT.write_audiofile(mp3)
    FILE_TO_CONVERT.close()

def convert_mp3_to_wav(mp3, wav):
    sound = AudioSegment.from_mp3(mp3)
    sound.export(wav, format="wav")

def get_wav_file(url):
    input_str = download_video(url)
    video_file_path = f"{input_str}.mp4"
    audio_file_path = "hello.mp3"
    result_wav_file = "result.wav"

    MP4ToMP3(video_file_path, audio_file_path)
    convert_mp3_to_wav(audio_file_path, result_wav_file)


@app.route('/', methods=['GET', 'POST'])
def get_wav():
    if request.method == 'POST':
        try:
            data = request.json
            url = data['url']
            get_wav_file(url)
            return "Processing request..."
        except Exception as e:
            return f"Error: {str(e)}", 400  
    return "Invalid request method"

if __name__ == '__main__':
    app.run(debug=True, port=5001)
