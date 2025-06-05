from fastapi import FastAPI, UploadFile, Form, File
from fastapi.responses import StreamingResponse
import fitz  # PyMuPDF
import io

app = FastAPI()

@app.post("/")
async def watermark_pdf(file: UploadFile,
                        method: str = Form(...),
                        text: str = Form(None),
                        x: int = Form(0), y: int = Form(0),
                        page: int = Form(0),
                        opacity: float = Form(0.3)):

    input_bytes = await file.read()
    doc = fitz.open(stream=input_bytes, filetype="pdf")
    page_obj = doc[page]

    if method == "text" and text:
        page_obj.insert_text((x, y), text, fontsize=24, rotate=0, overlay=True, render_mode=0, fill_opacity=opacity)

    # Future support: if method == "image": add image watermark

    output = io.BytesIO()
    doc.save(output)
    output.seek(0)

    return StreamingResponse(output, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=watermarked.pdf"
    })
