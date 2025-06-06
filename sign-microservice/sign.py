from fastapi import FastAPI, UploadFile, Form, File
from fastapi.responses import StreamingResponse
import fitz  # PyMuPDF
import io

app = FastAPI()

@app.post("/")
async def sign_pdf(
    file: UploadFile,
    method: str = Form(...),
    text: str = Form(None),
    x: int = Form(0),
    y: int = Form(0),
    page: int = Form(0),
    opacity: float = Form(1.0),
    image: UploadFile = File(None)  # for "draw" method
):
    input_bytes = await file.read()
    doc = fitz.open(stream=input_bytes, filetype="pdf")

    try:
        page_obj = doc[page]
    except IndexError:
        return {"error": "Invalid page number."}

    if method == "type" and text:
        # ✅ Insert semi-transparent text
        page_obj.insert_text(
            (x, y),
            text,
            fontsize=18,
            render_mode=3,  # Fill text with opacity
            color=(0, 0, 0),  # Black
            fill_opacity=opacity
        )

    elif method == "draw" and image:
        image_bytes = await image.read()
        pix = fitz.Pixmap(image_bytes)
        rect = fitz.Rect(x, y, x + pix.width, y + pix.height)
        page_obj.insert_image(rect, pixmap=pix, overlay=True, opacity=opacity)

    output = io.BytesIO()
    doc.save(output)
    output.seek(0)

    return StreamingResponse(output, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=signed.pdf"
    })
