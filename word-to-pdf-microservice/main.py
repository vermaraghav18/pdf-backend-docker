from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import os
import uuid
import pypandoc

app = FastAPI()

@app.post("/")
async def convert_word_to_pdf(file: UploadFile = File(...)):
    input_ext = os.path.splitext(file.filename)[-1]
    if input_ext.lower() != '.docx':
        return {"error": "Only .docx files are supported."}

    input_path = f"temp_{uuid.uuid4().hex}.docx"
    output_path = input_path.replace('.docx', '.pdf')

    with open(input_path, "wb") as f:
        f.write(await file.read())

    try:
        pypandoc.convert_file(input_path, 'pdf', outputfile=output_path)
    except Exception as e:
        return {"error": str(e)}

    return FileResponse(output_path, media_type='application/pdf', filename=os.path.basename(output_path))
