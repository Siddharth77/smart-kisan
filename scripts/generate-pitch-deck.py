#!/usr/bin/env python3
"""Generate Kisan Alert pitch deck PDF (12 slides)."""

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUTPUT = "pitch/KisanAlert_PitchDeck.pdf"
PAGE = landscape((10 * inch, 7.5 * inch))
MARGIN = 0.65 * inch

EMERALD = colors.HexColor("#065F46")
EMERALD_LIGHT = colors.HexColor("#D1FAE5")
EMERALD_MID = colors.HexColor("#059669")
TEXT = colors.HexColor("#1F2937")
MUTED = colors.HexColor("#4B5563")
WHITE = colors.white


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=34,
            leading=40,
            textColor=WHITE,
            alignment=TA_LEFT,
        ),
        "deck_subtitle": ParagraphStyle(
            "deck_subtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=16,
            leading=22,
            textColor=EMERALD,
            alignment=TA_LEFT,
        ),
        "slide_title": ParagraphStyle(
            "slide_title",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=28,
            leading=34,
            textColor=EMERALD,
            spaceAfter=14,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=15,
            leading=22,
            textColor=TEXT,
            spaceAfter=8,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=14,
            leading=20,
            textColor=TEXT,
            leftIndent=18,
            bulletIndent=6,
            spaceAfter=6,
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        "tag": ParagraphStyle(
            "tag",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=12,
            textColor=EMERALD_MID,
            spaceAfter=4,
        ),
    }


def header_band(title_text, st):
    band = Table([[Paragraph(title_text, st["title"])]], colWidths=[PAGE[0] - 2 * MARGIN])
    band.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), EMERALD),
                ("LEFTPADDING", (0, 0), (-1, -1), 24),
                ("RIGHTPADDING", (0, 0), (-1, -1), 24),
                ("TOPPADDING", (0, 0), (-1, -1), 28),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 28),
            ]
        )
    )
    return band


def slide_footer(num, total, st):
    return Paragraph(f"Kisan Alert  ·  Slide {num} of {total}", st["footer"])


def bullets(items, st):
    return [Paragraph(f"• {item}", st["bullet"]) for item in items]


def build_pdf():
    import os

    os.makedirs("pitch", exist_ok=True)
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=PAGE,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=0.45 * inch,
    )
    st = styles()
    total = 12
    story = []

    # Slide 1 — Title
    story.append(header_band("Kisan Alert", st))
    story.append(Spacer(1, 0.35 * inch))
    story.append(
        Paragraph(
            "Voice &amp; SMS agricultural intelligence for small and marginal farmers",
            st["deck_subtitle"],
        )
    )
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("HACK CORE 2026  ·  Agriculture &amp; Climate-Resilient Farming", st["body"]))
    story.append(Paragraph("Telugu-first  ·  Data-driven  ·  RSK expert-backed", st["body"]))
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph("github.com/Siddharth77/smart-kisan", st["tag"]))
    story.append(Spacer(1, 0.5 * inch))
    story.append(slide_footer(1, total, st))

    slides = [
        (
            "The Problem",
            [
                "Farmers lose crops to unpredictable monsoons and habit-based decisions—not data.",
                "Crop choices follow neighbors or tradition, ignoring soil health, groundwater, and rainfall.",
                "Dry spells arrive without localized irrigation guidance; fertilizer is applied at the wrong time.",
                "When crops show disease symptoms, there is no fast path from photo to expert help.",
                "Small and marginal farmers are left out: feature phones, Telugu/Hindi, patchy connectivity.",
            ],
        ),
        (
            "Who We Serve",
            [
                "Small &amp; marginal farmers: 1–3 acres, low literacy-friendly UX",
                "Primary languages: Telugu (demo), Hindi scale path",
                "Devices: feature phones + occasional smartphone (WhatsApp)",
                "Demo persona: <b>Lakshmi Devi</b>, 2-acre farmer, Hanamkonda, Warangal",
                "Channels: SMS-style alerts, voice readout, photo upload, RSK callback",
            ],
        ),
        (
            "Our Solution",
            [
                "<b>Three integrated pillars</b> in one platform:",
                "1. <b>Smart crop recommendation</b> — soil, rainfall, groundwater → ranked crops + risk scores",
                "2. <b>Real-time advisory</b> — dry-spell detection → Telugu irrigation &amp; fertilizer alerts",
                "3. <b>Crop health + RSK</b> — photo diagnosis → auto-ticket to Rythu Seva Kendra when AI is uncertain",
                "Closed loop: data in → advice out → human expert when needed",
            ],
        ),
        (
            "Pillar 1 — Crop Recommendation",
            [
                "Farmer registers village + plot size (acres, season)",
                "Engine scores crops: soil fit (40%), water need vs availability (35%), season (25%)",
                "Output: top 3 crops with risk % and reasoning in English + Telugu",
                "Example: groundnut ranked #1; cotton flagged high water-stress for Hanamkonda kharif",
                "Data: Warangal soil grid, IMD-style rainfall, groundwater bands",
            ],
        ),
        (
            "Pillar 2 — Dry-Spell Alerts",
            [
                "Monitors: days since rain, soil moisture threshold, forecast context",
                "Trigger: 10+ dry days + moisture &lt; 35% → dry_spell alert",
                "Farmer inbox (SMS simulator): actionable Telugu message",
                "Example: “Irrigate lightly in evening; hold fertilizer until rain returns.”",
                "Voice: Web Speech reads alert aloud; production → Cloud Text-to-Speech",
            ],
        ),
        (
            "Pillar 3 — Diagnosis &amp; RSK",
            [
                "Farmer uploads crop photo → disease label + confidence score",
                "If confidence &lt; 80% → automatic RSK ticket with photo + AI summary",
                "Expert queue: view, add notes, mark resolved → farmer confirmation",
                "Demo: leaf_spot (62% confidence) creates ticket; healthy (95%) does not",
                "Production: Gemini multimodal vision + state RSK MIS webhook",
            ],
        ),
        (
            "Live Demo Flow",
            [
                "1. Register plot  →  2. Crop advice  →  3. Simulate dry spell",
                "4. Photo diagnosis  →  5. RSK expert resolves ticket",
                "Deployed MVP: Next.js on Vercel — zero-config, full E2E working",
                "Quick demo: Lakshmi Devi pre-seeded; reset anytime via /api/demo/reset",
                "Dashboard: rainfall stats, soil panel, satellite NDVI map (Warangal)",
            ],
        ),
        (
            "AI &amp; Technical Approach",
            [
                "<b>MVP (now):</b> Rules engine — reliable, offline-capable, demo-safe",
                "<b>Pilot:</b> Gemini API — crop Q&amp;A, multimodal disease diagnosis",
                "<b>Scale:</b> Vertex AI, Earth Engine (NDVI), BigQuery (IMD + public datasets)",
                "Architecture: Next.js API routes → pluggable ai-provider interface",
                "Storage: in-memory (Vercel) / SQLite (local) / Turso or Firestore (prod)",
            ],
        ),
        (
            "Google Cloud Roadmap",
            [
                "Gemini API / Vertex AI — recommendations + photo diagnosis",
                "Firebase — Hosting, Firestore realtime inbox &amp; RSK tickets",
                "Cloud Functions + Scheduler — automated alert pipeline",
                "Translation + Text-to-Speech — Telugu/Hindi SMS and voice",
                "Earth Engine + BigQuery — satellite layers, IMD rainfall, data.gov.in",
                "Dialogflow — voice/SMS conversational intake for feature phones",
            ],
        ),
        (
            "Why It Is Deployable",
            [
                "SMS-first: no app install; works on 2G feature phones",
                "Serverless: Vercel today → Cloud Run / Firebase tomorrow",
                "Low cost: rules MVP free; GCP pay-per-use at scale",
                "RSK-ready: ticket schema maps to Kendra expert workflows",
                "Progressive AI: rules work without connectivity; Gemini adds depth when available",
            ],
        ),
        (
            "Pilot &amp; Scale",
            [
                "<b>Pilot (6 mo):</b> Warangal district, 500 farmers, 3 RSK partners",
                "<b>Metrics:</b> alert open rate, crop switch adoption, RSK resolution time",
                "<b>District:</b> 10K farmers, IoT soil sensors, hourly Scheduler alerts",
                "<b>State:</b> Telangana rollout, Dialogflow IVR, ag dept MIS integration",
                "<b>National:</b> 10+ languages, Earth Engine at scale, BigQuery analytics",
            ],
        ),
        (
            "Thank You",
            [
                "<b>Kisan Alert</b> — data-driven farming in the farmer’s language",
                "Repo: github.com/Siddharth77/smart-kisan",
                "Live demo: Vercel deploy (zero-config)",
                "Team: [Your names here]",
                "Questions?",
            ],
        ),
    ]

    for i, (title, items) in enumerate(slides, start=2):
        story.append(PageBreak())
        story.append(Paragraph(title, st["slide_title"]))
        story.extend(bullets(items, st))
        story.append(Spacer(1, 0.35 * inch))
        story.append(slide_footer(i, total, st))

    doc.build(story)
    print(f"Generated {OUTPUT}")


if __name__ == "__main__":
    build_pdf()
