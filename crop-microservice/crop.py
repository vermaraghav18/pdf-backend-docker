from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import StreamingResponse
import fitz  # PyMuPDF
import io

app = FastAPI()

@app.post("/")
async def crop_pdf(
    file: UploadFile,
    top_percent: float = Form(...),
    bottom_percent: float = Form(...),
    left_percent: float = Form(...),
    right_percent: float = Form(...)
):
    try:
        input_pdf_bytes = await file.read()
        input_stream = io.BytesIO(input_pdf_bytes)
        output_stream = io.BytesIO()

        doc = fitz.open(stream=input_stream.read(), filetype="pdf")

        for page in doc:
            rect = page.rect
            width = rect.width
            height = rect.height

            # Calculate crop box in absolute values
            new_rect = fitz.Rect(
                left_percent / 100 * width,
                top_percent / 100 * height,
                width - (right_percent / 100 * width),
                height - (bottom_percent / 100 * height)
            )

            page.set_cropbox(new_rect)

        doc.save(output_stream)
        output_stream.seek(0)

        return StreamingResponse(output_stream, media_type="application/pdf", headers={
            "Content-Disposition": "attachment; filename=cropped.pdf"
        })

    except Exception as e:
        return {"error": str(e)}
