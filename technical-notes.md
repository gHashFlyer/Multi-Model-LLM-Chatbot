# This is a multi-model (not MODAL) LLM chat application with model selection, system prompts, API key management, session cost display, and modals for editing system prompts, and viewing these technical notes. Requires styles.css for styling and script.js for interactivity and chat logic.

# ⚠️ Caution
## This app calls APIs directly from the browser.
## For a personal local tool, it’s acceptable, but the keys are still “client-side exposed.”
## Ideally, you’d want to use a backend service to proxy API calls, alas this does not yet support that.

# 🔑 Security
API keys are stored in localStorage (not secure for production)


# 🗓️ Future Plans
### -Add backend proxy service for API calls
For example: (1) run a tiny localhost proxy; (2) keep keys in .env; (3) serve the static frontend locally; (4) bind proxy to 127.0.0.1 only.
### -Add support for more models
### -Add support for more features
