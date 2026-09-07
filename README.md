# ReadSmart 20 — working MVP

A tablet-friendly, installable Progressive Web App for a Year 6 child who wants to improve reading fluency, comprehension and spelling in 20 minutes a day.

## Included
- Child-friendly 20-minute mission flow
- Football, gaming and technology stories
- Word warm-up with browser text-to-speech
- Read-aloud mode using Web Speech Recognition when supported
- Reading timer and words-per-minute estimate
- Inference, prediction and evidence-style comprehension questions
- Personalised spelling words from the current story
- Local progress storage on the device
- Parent dashboard
- PWA/offline caching

## Run locally
Any static web server will work. For example:

```bash
python3 -m http.server 8080
```

Then open:
http://localhost:8080

## Tablet deployment
Upload the files to any HTTPS static host (GitHub Pages, Azure Static Web Apps, Netlify, Cloudflare Pages, etc.). Open the HTTPS URL on the iPad and use Safari's "Add to Home Screen".

## Important note on voice recognition
iOS/Safari support for SpeechRecognition varies by version/device. The app therefore has a graceful fallback: text-to-speech always works where supported, while voice reading is optional. The app does not send recordings to a server.

## Next production steps
1. Add secure parent account and cloud sync.
2. Add 50–100 story passages and an adaptive difficulty engine.
3. Add phonics/morphology spelling rules and spaced repetition.
4. Improve fluency measurement using transcript alignment rather than simple elapsed-time WPM.
5. Add teacher/parent reports and accessibility settings.
