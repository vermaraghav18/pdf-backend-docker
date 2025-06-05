from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
import os
import uuid
import zipfile
from pdf2image import convert_from_bytes
from PIL import Image

app = FastAPI()

@app.post("/")
async def convert_pdf_to_jpg(file: UploadFile, dpi: int = Form(150)):
    input_bytes = await file.read()

    # Convert PDF pages to PIL images
    images = convert_from_bytes(input_bytes, dpi=dpi)

    # Create a temporary folder
    folder_name = f"output_{uuid.uuid4().hex}"
    os.makedirs(folder_name, exist_ok=True)

    output_paths = []
    for i, image in enumerate(images):
        rgb_image = image.convert("RGB")
        output_path = os.path.join(folder_name, f"page_{i + 1}.jpg")
        rgb_image.save(output_path, format="JPEG", quality=95)
        output_paths.append(output_path)

    # ✅ Zip all JPGs using zipfile (cross-platform)
    zip_name = f"{folder_name}.zip"
    with zipfile.ZipFile(zip_name, 'w') as zipf:
        for path in output_paths:
            arcname = os.path.basename(path)
            zipf.write(path, arcname=arcname)

    # Cleanup raw images
    for path in output_paths:
        os.remove(path)
    os.rmdir(folder_name)

    return FileResponse(zip_name, filename="converted_images.zip", media_type="application/zip")

