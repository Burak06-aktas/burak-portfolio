from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "cv"
FONT_DIR = Path("/System/Library/Fonts/Supplemental")

NAVY = colors.HexColor("#0B2036")
INK = colors.HexColor("#15283A")
BODY = colors.HexColor("#46596B")
BLUE = colors.HexColor("#5BB5EA")
STEEL = colors.HexColor("#64839A")
PALE = colors.HexColor("#E2E8ED")


def register_fonts():
    pdfmetrics.registerFont(TTFont("ResumeSans", str(FONT_DIR / "Arial.ttf")))
    pdfmetrics.registerFont(TTFont("ResumeSans-Bold", str(FONT_DIR / "Arial Bold.ttf")))


def styles_for(language):
    base = getSampleStyleSheet()
    body_size = 8.8 if language == "tr" else 8.8
    return {
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName="ResumeSans-Bold",
            fontSize=9,
            leading=12,
            textColor=NAVY,
            tracking=1.3,
            spaceBefore=3,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="ResumeSans",
            fontSize=body_size,
            leading=13.4,
            textColor=BODY,
            alignment=TA_LEFT,
            spaceAfter=0,
        ),
        "institution": ParagraphStyle(
            "Institution",
            parent=base["Normal"],
            fontName="ResumeSans-Bold",
            fontSize=9.4,
            leading=12,
            textColor=INK,
        ),
        "program": ParagraphStyle(
            "Program",
            parent=base["Normal"],
            fontName="ResumeSans",
            fontSize=8.2,
            leading=11,
            textColor=BODY,
        ),
        "date": ParagraphStyle(
            "Date",
            parent=base["Normal"],
            fontName="ResumeSans-Bold",
            fontSize=7.2,
            leading=10,
            textColor=STEEL,
            alignment=2,
        ),
        "company": ParagraphStyle(
            "Company",
            parent=base["Normal"],
            fontName="ResumeSans-Bold",
            fontSize=10,
            leading=13,
            textColor=INK,
        ),
    }


def draw_header(canvas, document, language):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 75 * mm, width, 75 * mm, stroke=0, fill=1)

    canvas.setStrokeColor(colors.HexColor("#5BB5EA"))
    canvas.setLineWidth(1.5)
    canvas.line(18 * mm, height - 31 * mm, 37 * mm, height - 31 * mm)

    canvas.setFillColor(colors.white)
    canvas.setFont("ResumeSans-Bold", 22)
    canvas.drawString(18 * mm, height - 48 * mm, "Mehmet Burak Aktaş")

    subtitle = "Havacılık  ·  Yapay zekâ" if language == "tr" else "Aviation  ·  Artificial intelligence"
    canvas.setFillColor(colors.HexColor("#C5D8E7"))
    canvas.setFont("ResumeSans", 9.2)
    canvas.drawString(18 * mm, height - 58 * mm, subtitle)

    canvas.setStrokeColor(colors.HexColor("#457391"))
    canvas.setLineWidth(0.7)
    canvas.line(18 * mm, height - 72 * mm, width - 18 * mm, height - 72 * mm)

    # A restrained aircraft plan mark ties the document to the site theme.
    center_x = width - 36 * mm
    center_y = height - 47 * mm
    canvas.setStrokeColor(colors.HexColor("#8FC7E8"))
    canvas.setLineWidth(0.8)
    path = canvas.beginPath()
    path.moveTo(center_x, center_y + 16 * mm)
    path.curveTo(center_x + 1.8 * mm, center_y + 16 * mm, center_x + 2.3 * mm, center_y + 13 * mm, center_x + 2.6 * mm, center_y + 10 * mm)
    path.lineTo(center_x + 4.2 * mm, center_y + 1.6 * mm)
    path.lineTo(center_x + 12 * mm, center_y - 4 * mm)
    path.lineTo(center_x + 11 * mm, center_y - 7 * mm)
    path.lineTo(center_x + 2.9 * mm, center_y - 4.5 * mm)
    path.lineTo(center_x + 3.8 * mm, center_y - 12 * mm)
    path.lineTo(center_x + 7 * mm, center_y - 15 * mm)
    path.lineTo(center_x + 6 * mm, center_y - 17 * mm)
    path.lineTo(center_x, center_y - 14.5 * mm)
    path.lineTo(center_x - 6 * mm, center_y - 17 * mm)
    path.lineTo(center_x - 7 * mm, center_y - 15 * mm)
    path.lineTo(center_x - 3.8 * mm, center_y - 12 * mm)
    path.lineTo(center_x - 2.9 * mm, center_y - 4.5 * mm)
    path.lineTo(center_x - 11 * mm, center_y - 7 * mm)
    path.lineTo(center_x - 12 * mm, center_y - 4 * mm)
    path.lineTo(center_x - 4.2 * mm, center_y + 1.6 * mm)
    path.lineTo(center_x - 2.6 * mm, center_y + 10 * mm)
    path.curveTo(center_x - 2.3 * mm, center_y + 13 * mm, center_x - 1.8 * mm, center_y + 16 * mm, center_x, center_y + 16 * mm)
    path.close()
    canvas.drawPath(path, stroke=1, fill=0)

    canvas.restoreState()


def section(title, style):
    return [
        Paragraph(title.upper(), style["section"]),
        HRFlowable(width="100%", thickness=0.55, color=PALE, spaceBefore=1, spaceAfter=7),
    ]


def education_entry(institution, program, date, style):
    left = [Paragraph(institution, style["institution"]), Paragraph(program, style["program"])]
    right = Paragraph(date, style["date"]) if date else ""
    table = Table([[left, right]], colWidths=[138 * mm, 36 * mm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return table


def build(language, filename):
    style = styles_for(language)
    is_tr = language == "tr"
    document = SimpleDocTemplate(
        str(OUTPUT / filename),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=82 * mm,
        bottomMargin=19 * mm,
        title=("Mehmet Burak Aktaş — Özgeçmiş" if is_tr else "Mehmet Burak Aktaş — CV"),
        author="Mehmet Burak Aktaş",
        subject=("Güvenli web CV'si" if is_tr else "Privacy-safe web CV"),
        creator="Mehmet Burak Aktaş Portfolio",
    )

    story = []
    story += section("Profil" if is_tr else "Profile", style)
    profile = (
        "Havacılık ve savunma sanayisi üretim ortamındaki staj deneyimimi, yapay zekâ eğitim geçmişimle bir araya getiriyorum. Kariyer hedefim, uçak mühendisliği ve yapay zekânın kesiştiği alanlarda gelişmek."
        if is_tr
        else "I bring together internship experience in aviation and defence manufacturing with an educational background in artificial intelligence. My career goal is to develop in fields where aircraft engineering and AI meet."
    )
    story.extend([Paragraph(profile, style["body"]), Spacer(1, 8)])

    story += section("Deneyim" if is_tr else "Experience", style)
    company = Paragraph("Küçükpazarlı Kardeşler Kalıp ve Mak. San. Ltd. Şti.", style["company"])
    period = Paragraph("Eylül 2024 — Haziran 2025" if is_tr else "September 2024 — June 2025", style["date"])
    header = Table([[company, period]], colWidths=[127 * mm, 47 * mm], hAlign="LEFT")
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    internship_label = "Havacılık ve savunma sanayisi stajı" if is_tr else "Aviation and defence industry internship"
    description = (
        "Staj, Boeing tipi uçak parçalarının üretim ve montajının yer aldığı bir üretim ortamında gerçekleştirildi."
        if is_tr
        else "Internship in a manufacturing environment involving the production and assembly of Boeing type aircraft parts."
    )
    story.extend([
        KeepTogether([
            header,
            Paragraph(internship_label, style["program"]),
            Spacer(1, 3),
            Paragraph(description, style["body"]),
        ]),
        Spacer(1, 9),
    ])

    story += section("Eğitim" if is_tr else "Education", style)
    story.append(education_entry(
        "Özel Data Koleji Bağlıca Mesleki ve Teknik Anadolu Lisesi" if is_tr else "Özel Data Koleji Bağlıca Vocational and Technical Anatolian High School",
        "Mesleki ve Teknik Anadolu Lisesi" if is_tr else "Vocational and Technical Anatolian High School",
        "Eylül 2022 — Haziran 2025" if is_tr else "September 2022 — June 2025",
        style,
    ))
    story.append(education_entry(
        "Türk Hava Kurumu Üniversitesi",
        "Yapay Zekâ Operatörlüğü · Ön Lisans" if is_tr else "Artificial Intelligence Operations · Associate Degree",
        "",
        style,
    ))
    story.append(Spacer(1, 3))

    story += section("Beceri" if is_tr else "Skill", style)
    story.append(Paragraph("Boeing parça montajı" if is_tr else "Boeing parts assembly", style["body"]))

    document.build(
        story,
        onFirstPage=lambda canvas, doc: draw_header(canvas, doc, language),
        onLaterPages=lambda canvas, doc: draw_header(canvas, doc, language),
    )


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    register_fonts()
    build("tr", "cv-mehmet-burak-aktas-tr.pdf")
    build("en", "cv-mehmet-burak-aktas-en.pdf")
    print(f"Created privacy-safe CVs in {OUTPUT}")


if __name__ == "__main__":
    main()
