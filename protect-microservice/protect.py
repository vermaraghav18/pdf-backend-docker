from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import StreamingResponse
import pikepdf
import io

app = FastAPI()

@app.post("/")
async def protect_pdf(file: UploadFile, password: str = Form(...)):
    try:
        input_pdf_bytes = await file.read()
        input_pdf = io.BytesIO(input_pdf_bytes)

        # Open PDF using pikepdf
        pdf = pikepdf.open(input_pdf)

        # Output to memory with encryption
        output_stream = io.BytesIO()
        pdf.save(output_stream, encryption=pikepdf.Encryption(owner=password, user=password, R=4))
        output_stream.seek(0)

        return StreamingResponse(output_stream, media_type="application/pdf", headers={
            "Content-Disposition": "attachment; filename=protected.pdf"
        })
    except Exception as e:
        return {"error": str(e)}
