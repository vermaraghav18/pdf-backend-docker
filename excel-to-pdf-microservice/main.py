from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import os
import uuid
import shutil
import subprocess

app = FastAPI()

@app.post("/")
async def convert_excel_to_pdf(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[-1].lower()
    if file_ext not in [".xlsx", ".xls"]:
        return {"error": "Only .xlsx and .xls files are supported."}

    temp_id = uuid.uuid4().hex
    input_path = f"temp_{temp_id}{file_ext}"
    output_pdf = f"temp_{temp_id}.pdf"

    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        subprocess.run([
            "soffice",
            "--headless",
            "--convert-to", "pdf",
            "--outdir", ".",
            input_path
        ], check=True)

        # Convert output name based on LibreOffice output
        generated_pdf = input_path.replace(file_ext, ".pdf")

        os.rename(generated_pdf, output_pdf)

        return FileResponse(output_pdf, media_type="application/pdf", filename="converted.pdf")

    except subprocess.CalledProcessError:
        return {"error": "Conversion failed using LibreOffice"}
    finally:
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(output_pdf): os.remove(output_pdf)
