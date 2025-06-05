from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import shutil
import uuid
import os
import time

app = FastAPI()

@app.post("/redact")
async def redact_pdf(pdf: UploadFile, keywords: str = Form(...)):
    input_filename = f"temp_{uuid.uuid4()}.pdf"
    output_filename = f"redacted_{uuid.uuid4()}.pdf"

    with open(input_filename, "wb") as f:
        shutil.copyfileobj(pdf.file, f)

    keywords_to_redact = [kw.strip() for kw in keywords.split(",") if kw.strip()]

    try:
        doc = fitz.open(input_filename)

        for page in doc:
            for keyword in keywords_to_redact:
                text_instances = page.search_for(keyword)
                for inst in text_instances:
                    page.add_redact_annot(inst, fill=(0, 0, 0))

        doc.save(output_filename, redacted=True)
        doc.close()

        # ✅ Ensure OS releases file lock
        time.sleep(0.5)
        try:
            os.remove(input_filename)
        except PermissionError:
            pass

        return FileResponse(path=output_filename, filename="redacted.pdf", media_type="application/pdf")

    except Exception as e:
        if os.path.exists(input_filename):
            try:
                os.remove(input_filename)
            except:
                pass
        return {"error": str(e)}
