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
    output_guess = input_path.replace(file_ext, ".pdf")
    output_final = f"temp_{temp_id}.pdf"

    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        result = subprocess.run([
            "soffice",
            "--headless",
            "--convert-to", "pdf",
            "--outdir", ".",
            input_path
        ], capture_output=True, text=True)

        print("🔍 LibreOffice stdout:", result.stdout)
        print("🔴 LibreOffice stderr:", result.stderr)

        if result.returncode != 0:
            return {"error": f"LibreOffice failed: {result.stderr}"}

        # If output file exists, rename it; otherwise, fail gracefully
        if os.path.exists(output_guess):
            os.rename(output_guess, output_final)
        elif os.path.exists(output_guess + ".pdf"):
            os.rename(output_guess + ".pdf", output_final)
        else:
            return {"error": "Output PDF not generated"}

        return FileResponse(output_final, media_type="application/pdf", filename="converted.pdf")

    except Exception as e:
        return {"error": f"Exception: {str(e)}"}

    finally:
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_final):
            os.remove(output_final)
