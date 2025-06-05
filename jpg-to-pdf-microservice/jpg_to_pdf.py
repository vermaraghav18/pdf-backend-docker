from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import img2pdf
import uuid
import os

app = FastAPI()

@app.post("/")
async def jpg_to_pdf(files: list[UploadFile] = File(...)):
    file_paths = []

    for file in files:
        contents = await file.read()
        temp_path = f"{uuid.uuid4().hex}.jpg"
        with open(temp_path, "wb") as f:
            f.write(contents)
        file_paths.append(temp_path)

    output_path = f"merged_{uuid.uuid4().hex}.pdf"
    with open(output_path, "wb") as f:
        f.write(img2pdf.convert(file_paths))

    # Cleanup
    for path in file_paths:
        os.remove(path)

    return FileResponse(output_path, filename="merged_output.pdf", media_type="application/pdf")
