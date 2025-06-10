from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import os
import uuid
import subprocess

app = FastAPI()

@app.post("/")
async def convert_excel_to_pdf(file: UploadFile = File(...)):
    file_id = uuid.uuid4().hex
    input_path = f"/tmp/{file_id}-{file.filename}"
    output_path = input_path.rsplit('.', 1)[0] + ".pdf"

    with open(input_path, "wb") as f:
        f.write(await file.read())

    try:
        subprocess.run(
            ["libreoffice", "--headless", "--convert-to", "pdf", "--outdir", "/tmp", input_path],
            check=True
        )
    except subprocess.CalledProcessError as e:
        return {"error": f"Conversion failed: {str(e)}"}

    if not os.path.exists(output_path):
        return {"error": "Converted PDF not found"}

    return FileResponse(output_path, media_type="application/pdf", filename=os.path.basename(output_path))
