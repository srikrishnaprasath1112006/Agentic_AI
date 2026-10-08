import pymupdf as fitz

from fastapi import HTTPException, UploadFile


MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def extract_text_from_pdf_bytes(pdf_bytes: bytes, filename: str = "uploaded_file.pdf") -> str:
    """Extract and validate text content from PDF binary data using PyMuPDF."""
    if not pdf_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty. Please upload a valid resume PDF."
        )

    if len(pdf_bytes) > MAX_PDF_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"The file size ({len(pdf_bytes) / (1024 * 1024):.1f} MB) exceeds the 10 MB limit."
        )

    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted PDF file. Please verify the document format."
        )

    extracted_pages = []
    try:
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text")
            if text:
                extracted_pages.append(text.strip())
        doc.close()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error reading PDF content: {str(e)}"
        )

    combined_text = "\n\n".join(extracted_pages).strip()

    if not combined_text or len(combined_text) < 30:
        raise HTTPException(
            status_code=400,
            detail="Unable to extract readable text from this PDF. Please upload a text-based resume (scanned images are not supported)."
        )

    return combined_text


async def process_pdf_upload(file: UploadFile) -> str:
    """Validate and extract text from an uploaded FastAPI UploadFile."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only PDF (.pdf) files are supported."
        )

    content = await file.read()
    return extract_text_from_pdf_bytes(content, filename=file.filename)
