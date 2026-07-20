from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

def generate_pdf(resume_data, template_name):
    # This is a simplified generator.
    # In a real scenario, this would use more advanced layouting (e.g., Platypus).
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    
    # Minimal template example
    c.drawString(100, 750, resume_data.get('personal_info', {}).get('name', 'Name'))
    c.drawString(100, 730, resume_data.get('summary', {}).get('text', 'Summary'))
    
    c.showPage()
    c.save()
    
    buffer.seek(0)
    return buffer.getvalue()
