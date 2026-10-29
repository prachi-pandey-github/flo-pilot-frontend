# Personalized email workflow

This workflow uses Groq to draft one personalized plain-text email per client
and Resend to deliver it. It can be run as a CLI or as a FastAPI service.

## Frontend authentication

The static frontend uses Supabase Auth for email/password signup, login,
session persistence, and logout. In the Supabase dashboard, add each deployed
frontend URL under **Authentication → URL Configuration → Redirect URLs**:

- `https://imaginative-lolly-b1c60c.netlify.app/login.html`
- Your Vercel deployment URL with `/login.html`, if you use one

If **Confirm email** is enabled under **Authentication → Providers → Email**,
new users must click the confirmation link before logging in. The frontend
uses the Supabase publishable key; never put a service-role key in the browser.

## Setup

1. Copy `clients.example.json` to `clients.json` and replace the sample data.
2. Create a `.env` file with `GROQ_API_KEY`, `RESEND_API_KEY`, and
   `EMAIL_FROM`. Optionally set `GROQ_MODEL`; it defaults to
   `qwen/qwen3.8-27b`. The application loads this file automatically;
   variables already set in the process environment take precedence. The
   sender domain must be verified in Resend.
   Browser clients are allowed from any origin for this prototype. CORS is
   configured with `allow_origins=["*"]` and credentials are disabled.
3. Run a draft-only preview first:

```powershell
$env:GROQ_API_KEY = "..."
python .\app.py --input .\clients.json --goal "Offer a 20-minute product consultation" --dry-run
```

4. After reviewing the drafts, send them:

```powershell
$env:RESEND_API_KEY = "..."
$env:EMAIL_FROM = "Your Name <hello@your-verified-domain.com>"
python .\app.py --input .\clients.json --goal "Offer a 20-minute product consultation"
```

The input JSON must be an array with `name` and `email`; `company` and `context`
are optional. The workflow stops on the first provider error rather than
silently reporting a successful send.

## API

Install the API dependencies and start the service:

```powershell
python -m pip install -r .\requirements.txt
uvicorn app:app --reload
```

Check that the service is running:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

Create a draft-only campaign (the default) with `POST /campaigns`:

```powershell
$body = @{
    campaign_goal = "Offer a 20-minute product consultation"
    dry_run = $true
    clients = @(
        @{
            name = "Avery Johnson"
            email = "avery@example.com"
            company = "Example Co"
            context = "Interested in reducing manual reporting."
        }
    )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri http://127.0.0.1:8000/campaigns `
    -Method Post -ContentType "application/json" -Body $body
```

Set `dry_run` to `false` to send the generated emails. Sending requires both
`RESEND_API_KEY` and `EMAIL_FROM`; draft requests only require
`GROQ_API_KEY`. Interactive API documentation is available at
`http://127.0.0.1:8000/docs`.
