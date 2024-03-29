import whisperx
import gc
import torch

# Check if GPU is available
device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using device:", device)

# Define paths
model_dir = "models/"
batch_size = 8  # reduce if low on GPU mem
compute_type = "int8"  # change to "int8" if low on GPU mem (may reduce accuracy)

# 1. Transcribe with original whisper (batched)
model_path = model_dir + "whisperx_model.pt"

# Load or download model
if not torch.cuda.is_available() and device == "cuda":
    # If GPU is not available but CUDA device was chosen, switch to CPU
    print("CUDA device not available. Switching to CPU.")
    device = "cpu"

if not os.path.exists(model_path):
    print("Downloading model...")
    model = whisperx.download_model("medium",device, compute_type=compute_type,download_root = model_path)

print("Loading model...")
model = model


# Delete model if low on GPU resources
# import gc; gc.collect(); torch.cuda.empty_cache(); del model
