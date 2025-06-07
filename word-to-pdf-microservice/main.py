from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import os
import uuid
import subprocess

app = FastAPI()

@app.post("/")
async def convert_word_to_pdf(file: UploadFile = File(...)):
    input_ext = os.path.splitext(file.filename)[-1]
    if input_ext.lower() != '.docx':
        return {"error": "Only .docx files are supported."}

    input_path = f"/tmp/{uuid.uuid4().hex}.docx"
    output_dir = "/tmp"
    output_pdf = input_path.replace('.docx', '.pdf')

    with open(input_path, "wb") as f:
        f.write(await file.read())

    try:
        result = subprocess.run(
            ["soffice", "--headless", "--convert-to", "pdf", "--outdir", output_dir, input_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=30
        )

        if result.returncode != 0:
            raise Exception(result.stderr.decode())

        return FileResponse(output_pdf, media_type='application/pdf', filename=os.path.basename(output_pdf))

    except Exception as e:
        return {"error": f"Conversion failed: {str(e)}"}

    finally:
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_pdf):
            os.remove(output_pdf)
