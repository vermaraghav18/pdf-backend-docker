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
    image: UploadFile = File(None)
):
    input_bytes = await file.read()
    doc = fitz.open(stream=input_bytes, filetype="pdf")
    page_obj = doc[page]

    if method == "type" and text:
        # Insert text with RGBA color (opacity applied to black)
        page_obj.insert_text(
            (x, y),
            text,
            fontsize=18,
            color=(0, 0, 0, opacity)
        )

    elif method == "draw" and image:
        image_bytes = await image.read()

        # Load image into pixmap
        pix = fitz.Pixmap(image_bytes)

        # Check if image already has alpha channel
        if pix.alpha:
            page_obj.insert_image(
                fitz.Rect(x, y, x + pix.width, y + pix.height),
                pixmap=pix
            )
        else:
            # Add alpha manually
            pix_with_alpha = fitz.Pixmap(pix, 1)  # force alpha copy
            pix_with_alpha.set_alpha(int(opacity * 255))
            page_obj.insert_image(
                fitz.Rect(x, y, x + pix.width, y + pix.height),
                pixmap=pix_with_alpha
            )

    output = io.BytesIO()
    doc.save(output)
    output.seek(0)

    return StreamingResponse(output, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=signed.pdf"
    })
