from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import StreamingResponse
import fitz  # PyMuPDF
import io

app = FastAPI()

@app.post("/")
async def sign_pdf(file: UploadFile, method: str = Form(...),
                   text: str = Form(None),
                   x: int = Form(0), y: int = Form(0), page: int = Form(0)):
    input_bytes = await file.read()
    doc = fitz.open(stream=input_bytes, filetype="pdf")

    page_obj = doc[page]

    if method == "type" and text:
        page_obj.insert_text((x, y), text, fontsize=18)

    # Future: Support for "draw" and "upload image" can go here

    output = io.BytesIO()
    doc.save(output)
    output.seek(0)

    return StreamingResponse(output, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=signed.pdf"
    })
