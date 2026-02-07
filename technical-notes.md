# This is a multi-model LLM chat application with model selection, system prompts, API key management, session cost display, and modals for editing system prompts, and viewing these technical notes. Requires styles.css for styling and script.js for interactivity and chat logic.

# ⚠️ Caution
## This app calls APIs directly from the browser.
## For a personal local tool, it’s acceptable, but you should know that the keys are stored in localStorage.
## Ideally, you’d want a chatbot to use a backend service to proxy API calls, alas this does not yet support that.

# 🦙 Ollama
## IF you want to run local ollama models, then you may have to do something about CORS. One way is to set  OLLAMA_ORIGINS=*  Note: you can change the default/fallback models in script.js under Model Catalog.

# 🗓️ Future Plans
### -Add backend proxy service for API calls
For example: (1) run a tiny localhost proxy; (2) keep keys in .env; (3) serve the static frontend locally; (4) bind proxy to 127.0.0.1 only.
### -Add support for more models
### -Add support for more features

# 🌐 Download Updates from GitHub
### https://github.com/gHashFlyer/Multi-Model-LLM-Chatbot
