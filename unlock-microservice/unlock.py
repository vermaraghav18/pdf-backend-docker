from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import StreamingResponse
import pikepdf
import io

app = FastAPI()

@app.post("/")
async def unlock_pdf(file: UploadFile, password: str = Form(...)):
    try:
        input_pdf_bytes = await file.read()
        input_pdf = io.BytesIO(input_pdf_bytes)

        # Try to open the encrypted PDF with password
        pdf = pikepdf.open(input_pdf, password=password)

        # Save unlocked PDF to stream (no encryption)
        output_stream = io.BytesIO()
        pdf.save(output_stream)
        output_stream.seek(0)

        return StreamingResponse(output_stream, media_type="application/pdf", headers={
            "Content-Disposition": "attachment; filename=unlocked.pdf"
        })

    except pikepdf._qpdf.PasswordError:
        return {"error": "Incorrect password"}
    except Exception as e:
        return {"error": str(e)}
