from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
import io

def generate_pdf(resume_data, template_name):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Choose template style
    if template_name == 'modern':
        title_style = ParagraphStyle(name='Title', parent=styles['Title'], fontSize=24, textColor=colors.navy)
        body_style = styles['Normal']
    elif template_name == 'minimal':
        title_style = ParagraphStyle(name='Title', parent=styles['Title'], fontSize=18, textColor=colors.black)
        body_style = styles['Normal']
    else: # Classic
        title_style = ParagraphStyle(name='Title', parent=styles['Title'], fontSize=20, fontName='Times-Bold')
        body_style = ParagraphStyle(name='Body', parent=styles['Normal'], fontName='Times-Roman')

    # Content generation
    story.append(Paragraph(resume_data.get('personal_info', {}).get('name', 'Name'), title_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph(resume_data.get('summary', {}).get('text', 'Summary'), body_style))
    story.append(Spacer(1, 12))
    
    # ... Add experience, education etc.

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
