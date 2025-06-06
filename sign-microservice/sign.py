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
    image: UploadFile = File(None)  # ✅ Support for drawn signature
):
    try:
        input_bytes = await file.read()
        doc = fitz.open(stream=input_bytes, filetype="pdf")

        page_obj = doc[page]

        if method == "type" and text:
            page_obj.insert_text((x, y), text, fontsize=18, overlay=True)

        elif method == "draw" and image:
            image_bytes = await image.read()
            image_rect = fitz.Rect(x, y, x + 100, y + 50)  # You can scale this if needed
            page_obj.insert_image(image_rect, stream=image_bytes, overlay=True)

        output = io.BytesIO()
        doc.save(output)
        output.seek(0)

        return StreamingResponse(output, media_type="application/pdf", headers={
            "Content-Disposition": "attachment; filename=signed.pdf"
        })
    except Exception as e:
        print("SIGN ERROR:", e)
        return {"error": str(e)}
