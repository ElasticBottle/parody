import modal

# Modal Image to run ComfyUI
image = (
    modal.Image.debian_slim(python_version="3.11")  # start from basic Linux with Python
    .apt_install("git")  # install git to clone ComfyUI
    .pip_install("comfy-cli==1.1.6")  # install comfy-cli
    .run_commands(  # use comfy-cli to install the ComfyUI repo and its dependencies
        "comfy --skip-prompt install --nvidia",
    )
    .run_commands(  # download the inpainting model
        "comfy --skip-prompt model download --url https://huggingface.co/stabilityai/stable-diffusion-2-inpainting/resolve/main/512-inpainting-ema.safetensors --relative-path models/checkpoints"
    )
    .run_commands("comfy node install image-resize-comfyui")  # download a custom node
    # can layer additional models and custom node downloads as needed
)

app = modal.App(name="comfyui", image=image)
