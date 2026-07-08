# Deployment checklist — Kisan Alert

## Vercel deploy (zero-config)

```bash
npx vercel login
npx vercel deploy --prod
```

No env vars required. Storage mode: **memory** (auto-seeded Lakshmi Devi).

### Verify

- [ ] `GET /api/health` → `{ "status": "ok", "storage": "memory" }`
- [ ] Home → Quick demo → crop recommendation
- [ ] Inbox → Simulate dry spell
- [ ] Diagnose → leaf_spot → RSK ticket
- [ ] /rsk → Mark resolved

---

## Optional upgrades

| Upgrade | When | How |
|---------|------|-----|
| **Turso persistence** | Data lost on cold starts bothers you | Set `DATABASE_URL` + `TURSO_AUTH_TOKEN` |
| **Gemini API** | HACK CORE submission | Add `GeminiAIProvider` |
| **Firebase / GCP** | Full hackathon stack | See chat plan |

---

## HACK CORE submission gaps

| Item | Status |
|------|--------|
| GitHub repo | ✅ Siddharth77/smart-kisan |
| Deployed prototype | ⏳ Run `vercel deploy --prod` |
| Demo video | ❌ Record after live URL |
| Pitch deck | ❌ Not created |
| Google Cloud / Gemini | ❌ Rules engine only |

---

## Storage modes

| Environment | `DATABASE_URL` | Storage |
|-------------|----------------|---------|
| Vercel (default) | unset | In-memory |
| Local dev | `file:./dev.db` | SQLite via Prisma |
| Vercel + Turso | `libsql://...` | Turso via Prisma |

Set `USE_MEMORY_STORE=true` locally to test memory mode without SQLite.
