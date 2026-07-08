# Deployment checklist — Kisan Alert

## Vercel deploy (required)

### 1. Turso database (free tier)

```bash
# Install: https://docs.turso.tech/cli/introduction
turso auth login
turso db create smart-kisan
turso db show smart-kisan --url          # → libsql://...
turso db tokens create smart-kisan       # → auth token
```

### 2. Vercel project

**Option A — GitHub (recommended)**
1. [vercel.com/new](https://vercel.com/new) → Import `Siddharth77/smart-kisan`
2. Framework: Next.js (auto)
3. Add environment variables (Production + Preview):

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `libsql://smart-kisan-xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | `eyJ...` |
| `NEXT_PUBLIC_APP_URL` | `https://smart-kisan.vercel.app` |

4. Deploy

**Option B — CLI**
```bash
npx vercel login
npx vercel link
npx vercel env add DATABASE_URL
npx vercel env add TURSO_AUTH_TOKEN
npx vercel env add NEXT_PUBLIC_APP_URL
npx vercel --prod
```

### 3. Post-deploy seed

```bash
curl -X POST https://YOUR-APP.vercel.app/api/demo/reset
curl https://YOUR-APP.vercel.app/api/health
```

### 4. Verify E2E on live URL

- [ ] Home → Quick demo (Lakshmi Devi)
- [ ] Crop recommendation loads
- [ ] Inbox → Simulate dry spell → Telugu alert
- [ ] Diagnose → leaf_spot → RSK ticket
- [ ] /rsk → Mark resolved
- [ ] `/api/health` returns `{ "status": "ok" }`

---

## HACK CORE submission gaps

| Item | Status | Action |
|------|--------|--------|
| **GitHub repo** | ✅ `Siddharth77/smart-kisan` | Add README deploy URL after Vercel |
| **Deployed prototype** | ⏳ Needs Turso + Vercel env vars | Complete steps above |
| **Demo video (3–5 min)** | ❌ Missing | Record against live Vercel URL |
| **Pitch deck (10–12 slides)** | ❌ Missing | See plan in chat history |
| **Google Cloud / Gemini** | ❌ Not integrated | Add `GeminiAIProvider` for hackathon scoring |
| **Voice/SMS (Cloud TTS, Dialogflow)** | ⚠️ Mock only | Web Speech + in-app inbox; upgrade for submission |
| **Earth Engine / BigQuery** | ⚠️ Static seed data | Load IMD rainfall into BigQuery for pitch |
| **Public data citations** | ⚠️ Partial | Cite IMD, data.gov.in in deck |

---

## Known limitations (current MVP)

| Limitation | Impact | Fix |
|------------|--------|-----|
| `sessionStorage` for farmer/plot IDs | New tab loses session | Acceptable for demo; add URL params later |
| Rules engine, not Gemini | Weak AI story for judges | Phase A: Gemini provider |
| SVG demo images, not real photos | Diagnosis is mapped, not vision | Gemini multimodal |
| No real SMS | Inbox simulates SMS | Twilio/MSG91 + Cloud Functions |
| SQLite local only | Can't deploy without Turso | Turso (documented above) |

---

## Build troubleshooting

| Error | Fix |
|-------|-----|
| `DATABASE_URL not configured for Turso` | Set libsql URL in Vercel env vars |
| `Prisma migrate deploy failed` | Check Turso token; run `turso db show smart-kisan` |
| `/api/health` 503 | DB credentials wrong or migrations not applied |
| Empty recommend page | Run `POST /api/demo/reset` or register farmer |
