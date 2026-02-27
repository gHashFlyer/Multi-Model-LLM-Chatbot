/**
 * Chatbot.js — React 17 functional component
 * Mirrors the functionality of index.html + script.js using hooks and CSS modules.
 *
 * IMPORTANT: For CSS Modules to be recognised by standard CRA / Vite projects,
 * rename Chatbot.css → Chatbot.module.css and update the import accordingly.
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import styles from './Chatbot.css';

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_API_KEYS = {
  anthropic: 'YOUR_ANTHROPIC_API_KEY',
  openai: 'YOUR_OPENAI_API_KEY',
  gemini: 'YOUR_GEMINI_API_KEY',
  deepseek: 'YOUR_DEEPSEEK_API_KEY',
  grok: 'YOUR_GROK_API_KEY',
};

const ENDPOINTS = {
  anthropic: 'https://api.anthropic.com/v1/messages',
  anthropicModels: 'https://api.anthropic.com/v1/models',
  openai: 'https://api.openai.com/v1/chat/completions',
  openaiModels: 'https://api.openai.com/v1/models',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  deepseekModels: 'https://api.deepseek.com/v1/models',
  grok: 'https://api.x.ai/v1/chat/completions',
  grokModels: 'https://api.x.ai/v1/models',
  ollama: 'http://localhost:11434/v1/chat/completions',
  ollamaModels: 'http://localhost:11434/v1/models',
};

const DEFAULTS = { maxTokens: 4096, temperature: 0.7 };

const DEFAULT_SYSTEM_PROMPTS = [
  { id: 'none', title: 'None', prompt: '' },
  {
    id: 'general',
    title: 'General Assistant',
    prompt:
      'You are a helpful, friendly, and knowledgeable AI assistant. Provide clear, accurate, and concise answers to user questions.',
  },
  {
    id: 'code',
    title: 'Code Generation',
    prompt:
      'You are an expert software engineer. Provide clean, well-documented, and efficient code. Follow best practices and explain your reasoning when helpful.',
  },
  {
    id: 'financial',
    title: 'Financial Model Evaluation',
    prompt:
      'You are a financial analyst with expertise in evaluating business models, analyzing financial statements, and providing investment insights. Be thorough, data-driven, and objective in your analysis.',
  },
  {
    id: 'creative',
    title: 'Creative Writing',
    prompt:
      'You are a creative writer with a flair for storytelling. Help users with creative writing, brainstorming ideas, and crafting engaging narratives.',
  },
  {
    id: 'technical',
    title: 'Technical Documentation',
    prompt:
      'You are a technical writer specializing in clear, comprehensive documentation. Write precise, well-structured technical documentation that is easy to understand.',
  },
];

const PRICING_TABLE = {
  'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
  'claude-3-5-haiku-20241022': { input: 0.8, output: 4.0 },
  'claude-sonnet-4-20250514': { input: 3.0, output: 15.0 },
  'claude-opus-4-20250514': { input: 15.0, output: 75.0 },
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  o1: { input: 15.0, output: 60.0 },
  'gpt-5.2': { input: 5.0, output: 20.0 },
  'gpt-5-mini': { input: 0.1, output: 0.4 },
  'gpt-5-nano': { input: 0.05, output: 0.2 },
  'gemini-1.5-pro': { input: 1.25, output: 5.0 },
  'gemini-1.5-flash': { input: 0.075, output: 0.3 },
  'gemini-2.0-flash': { input: 0.1, output: 0.4 },
  'gemini-3-flash-preview': { input: 0.075, output: 0.3 },
  'gemini-3-pro-preview': { input: 1.25, output: 5.0 },
};

const DEFAULT_MODELS = {
  ollama: [
    { id: 'nemotron-3-nano:30b', label: 'Nemotron 3 Nano 30B' },
    { id: 'qwen3-coder:30b', label: 'Qwen 3 Coder 30B' },
    { id: 'ministral-3:8b', label: 'Ministral 3 8B' },
    { id: 'volvi/TARS3.3-3B:latest', label: 'TARS 3.3 3B' },
    { id: 'deepseek-r1:1.5b', label: 'DeepSeek R1 1.5B' },
    { id: 'gpt-oss:latest', label: 'GPT OSS' },
    { id: 'qwen2.5-coder:1.5b', label: 'Qwen 2.5 Coder 1.5B' },
    { id: 'codellama:latest', label: 'CodeLlama' },
    { id: 'qwen3:8b', label: 'Qwen 3 8B' },
  ],
  deepseek: [
    { id: 'deepseek-chat', label: 'DeepSeek Chat' },
    { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner' },
  ],
  grok: [
    { id: 'grok-2-latest', label: 'Grok 2 (Latest)' },
    { id: 'grok-2', label: 'Grok 2' },
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
    { id: 'claude-sonnet-4-20250514', label: 'Claude 4 Sonnet' },
    { id: 'claude-opus-4-20250514', label: 'Claude 4 Opus' },
  ],
  openai: [
    { id: 'gpt-5.2', label: 'GPT-5.2' },
    { id: 'gpt-5-mini', label: 'GPT-5 Mini' },
    { id: 'gpt-5-nano', label: 'GPT-5 Nano' },
    { id: 'gpt-4o', label: 'GPT-4o' },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  ],
  gemini: [
    { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { id: 'gemini-3-flash-preview', label: 'Gemini 3.5 Flash Preview' },
    { id: 'gemini-3-pro-preview', label: 'Gemini 3.5 Pro Preview' },
  ],
};

const OPENAI_CHAT_COMPLETIONS_PREFIXES = [
  'gpt-5.2',
  'gpt-5-mini',
  'gpt-5-nano',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-4',
  'gpt-3.5-turbo',
];

const TEXT_ONLY_MODEL_EXCLUDE =
  /-(realtime|audio|vision|image|embedding|transcribe|tts|speech|search|computer|cu)/i;

const PROVIDER_LABELS = {
  ollama: 'Ollama',
  deepseek: 'DeepSeek',
  grok: 'Grok (xAI)',
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  gemini: 'Google Gemini',
};

const PROVIDER_ORDER = [
  'ollama',
  'deepseek',
  'grok',
  'anthropic',
  'openai',
  'gemini',
];

const MODEL_CACHE_KEY = 'llm_chatbot_model_catalog';
const MODEL_CACHE_TTL_MS = 1000 * 60 * 60 * 6;

const TECHNICAL_NOTES_MD = `# This is a multi-model LLM chat application with model selection, system prompts, API key management, session cost display, and modals for editing system prompts, and viewing these technical notes. Requires Chatbot.css for styling and Chatbot.js for interactivity and chat logic.

# ⚠️ Caution
## This app calls APIs directly from the browser.
## For a personal local tool, it's acceptable, but you should know that the keys are stored in localStorage.
## Ideally, you'd want a chatbot to use a backend service to proxy API calls, alas this does not yet support that.

# 🦙 Ollama
## IF you want to run local ollama models, then you may have to do something about CORS. One way is to set  OLLAMA_ORIGINS=*  Note: you can change the default/fallback models in Chatbot.js under DEFAULT_MODELS.

# 🗓️ Future Plans
### -Add backend proxy service for API calls
For example: (1) run a tiny localhost proxy; (2) keep keys in .env; (3) serve the static frontend locally; (4) bind proxy to 127.0.0.1 only.
### -Add support for more models
### -Add support for more features

# 🌐 Download Updates from GitHub
### https://github.com/gHashFlyer/Multi-Model-LLM-Chatbot`;

// ============================================================
// PURE UTILITY FUNCTIONS (outside component)
// ============================================================

function escapeHtml(text) {
  const map = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return date.toLocaleDateString();
}

function formatTokenCount(count) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(2)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return `${count}`;
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function calculateCost(inputTokens, outputTokens, modelId) {
  const pricing = PRICING_TABLE[modelId];
  if (!pricing) return 0;
  return (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output;
}

function ensureConversationMetrics(conv) {
  return {
    ...conv,
    totalCost:
      typeof conv.totalCost === 'number' ? conv.totalCost : 0,
    totalInputTokens:
      typeof conv.totalInputTokens === 'number' ? conv.totalInputTokens : 0,
    totalOutputTokens:
      typeof conv.totalOutputTokens === 'number' ? conv.totalOutputTokens : 0,
    modelUsage:
      conv.modelUsage && typeof conv.modelUsage === 'object'
        ? conv.modelUsage
        : {},
  };
}

function createNewConvObject(modelId = '') {
  return {
    id: 'conv_' + Date.now(),
    title: 'New Chat',
    messages: [],
    model: modelId,
    totalCost: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    modelUsage: {},
    createdAt: new Date().toISOString(),
  };
}

// ---- Syntax highlighting ----
function highlightSyntax(code) {
  let h = code;
  const keywords = [
    'function','const','let','var','if','else','for','while','return',
    'class','import','export','from','async','await','try','catch',
    'throw','new','this','super','extends','static','public','private',
    'protected','interface','type','enum','namespace','module','declare',
    'def','print','True','False','None','lambda','with','as','pass',
    'break','continue','elif','except','finally','raise','yield','in',
    'not','and','or','is','assert','global','nonlocal','del',
  ];
  h = h.replace(
    /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g,
    '<span class="syntax-string">$1$2$1</span>'
  );
  h = h.replace(
    /(\/\/.*$|#.*$)/gm,
    '<span class="syntax-comment">$1</span>'
  );
  h = h.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    '<span class="syntax-comment">$1</span>'
  );
  h = h.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="syntax-number">$1</span>'
  );
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b(${kw})\\b`, 'g');
    h = h.replace(re, '<span class="syntax-keyword">$1</span>');
  });
  h = h.replace(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
    '<span class="syntax-function">$1</span>('
  );
  return h;
}

// ---- Markdown table rendering ----
function renderMarkdownTableToHTML(tableText) {
  const lines = tableText.trim().split(/[\r\n]+/);
  if (lines.length < 3) return tableText;
  const headers = lines[0]
    .split('|')
    .map((h) => h.trim())
    .filter((h) => h.length > 0);
  if (!headers.length) return tableText;
  const dataRows = lines.slice(2).map((line) =>
    line
      .split('|')
      .map((c) => c.trim())
      .filter((_, i) => i > 0 && i <= headers.length)
  );
  let html = '<div class="markdown-table-wrapper"><table class="markdown-table"><thead><tr>';
  headers.forEach((h) => { html += `<th>${escapeHtml(h)}</th>`; });
  html += '</tr></thead><tbody>';
  dataRows.forEach((row) => {
    if (row.length > 0) {
      html += '<tr>';
      row.forEach((cell) => { html += `<td>${escapeHtml(cell)}</td>`; });
      html += '</tr>';
    }
  });
  html += '</tbody></table></div>';
  return html;
}

function parseMarkdownTable(tableText) {
  const lines = tableText.trim().split(/[\r\n]+/);
  if (lines.length < 3) return null;
  const headers = lines[0]
    .split('|')
    .map((h) => h.trim())
    .filter((h) => h.length > 0);
  if (!headers.length) return null;
  const dataRows = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i]
      .split('|')
      .map((c) => c.trim())
      .filter((_, idx) => idx > 0 && idx <= headers.length);
    if (cells.length > 0) {
      const row = {};
      headers.forEach((header, idx) => { row[header] = cells[idx] || ''; });
      dataRows.push(row);
    }
  }
  return dataRows.length > 0 ? dataRows : null;
}

// ---- Message content formatting ----
function formatMessageContent(content) {
  let formatted = content.replace(
    /<span class="syntax-[^"]+">([\s\S]*?)<\/span>/g,
    '$1'
  );
  formatted = formatted.replace(
    /<pre(?:[^>]*)><code(?:[^>]*)>([\s\S]*?)<\/code><\/pre>/g,
    '```\n$1\n```'
  );
  formatted = formatted.replace(
    /<code(?:[^>]*)>([\s\S]*?)<\/code>/g,
    '`$1`'
  );

  const tablePlaceholders = [];
  const tableRegex =
    /(\|[^\n]+\|[\r\n]+\|[\s\-:|]+\|[\r\n]+(?:\|[^\n]+\|[\r\n]+)*)/g;
  formatted = formatted.replace(tableRegex, (match) => {
    const ph = `__TABLE_PLACEHOLDER_${tablePlaceholders.length}__`;
    tablePlaceholders.push(renderMarkdownTableToHTML(match));
    return ph;
  });

  formatted = escapeHtml(formatted);

  formatted = formatted.replace(
    /```(\w+)?\s*([\s\S]*?)```/g,
    (match, lang, code) => {
      const language = lang || 'text';
      const highlighted = highlightSyntax(code.trim());
      const blockId = 'code_' + Math.random().toString(36).substr(2, 9);
      return (
        `<div class="code-block-header">` +
        `<span class="code-block-lang">${language}</span>` +
        `<button class="copy-code-btn" onclick="window.copyCode('${blockId}')">Copy</button>` +
        `</div>` +
        `<div class="code-block with-header" id="${blockId}">${highlighted}</div>`
      );
    }
  );

  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<span class="inline-code">$1</span>'
  );
  formatted = formatted.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong>$1</strong>'
  );
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  tablePlaceholders.forEach((tableHTML, idx) => {
    formatted = formatted.replace(`__TABLE_PLACEHOLDER_${idx}__`, tableHTML);
  });

  return formatted;
}

// ---- CSV / Excel ----
function convertToCSV(data) {
  if (!data || !data.length) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const v = row[h] || '';
        return typeof v === 'string' && (v.includes(',') || v.includes('"'))
          ? `"${v.replace(/"/g, '""')}"`
          : v;
      })
      .join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

function extractDataFromResponse(text) {
  const tableRegex =
    /(\|[^\n]+\|[\r\n]+\|[\s\-:|]+\|[\r\n]+(?:\|[^\n]+\|[\r\n]+)+)/g;
  const tableMatches = text.match(tableRegex);
  if (tableMatches) {
    const parsed = parseMarkdownTable(tableMatches[0]);
    if (parsed && parsed.length > 0) return parsed;
  }
  const jsonRegex = /\[\s*\{[\s\S]*?\}\s*\]/g;
  const jsonMatches = text.match(jsonRegex);
  if (jsonMatches) {
    for (const m of jsonMatches) {
      try {
        const d = JSON.parse(m);
        if (Array.isArray(d) && d.length > 0 && typeof d[0] === 'object')
          return d;
      } catch {}
    }
  }
  return null;
}

function mentionsDataConversion(content) {
  const lc = content.toLowerCase();
  return ['csv', 'excel', 'spreadsheet', 'download', 'export', 'table', 'xlsx'].some(
    (kw) => lc.includes(kw)
  );
}

function generateDownloadLinksHTML(data, baseFilename = 'data') {
  let linksHtml = '';
  try {
    const csvData = convertToCSV(data);
    const csvBlob = new Blob([csvData], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);
    linksHtml += `<a href="${csvUrl}" download="${baseFilename}.csv">Download ${baseFilename}.csv</a>`;
  } catch {}
  try {
    const XLSX = window.XLSX;
    if (XLSX) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const excelUrl = URL.createObjectURL(excelBlob);
      linksHtml += `<a href="${excelUrl}" download="${baseFilename}.xlsx">Download ${baseFilename}.xlsx</a>`;
    }
  } catch {}
  return (
    `<div class="download-links-container">` +
    `<div style="margin-bottom:8px;font-weight:600;font-size:14px;">📥 Download Options:</div>` +
    `<div style="display:flex;flex-wrap:wrap;gap:8px;">${linksHtml}</div>` +
    `</div>`
  );
}

function enhanceMessageWithDownloads(content) {
  const formatted = formatMessageContent(content);
  if (!mentionsDataConversion(content)) return formatted;
  const data = extractDataFromResponse(content);
  if (data && data.length > 0) {
    const ts = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return formatted + generateDownloadLinksHTML(data, `export_${ts}`);
  }
  return formatted;
}

// ---- Markdown → HTML (for tech notes modal) ----
function convertMarkdownToHTML(markdown) {
  const lines = markdown.split('\n');
  let html = '';
  let inCode = false;
  let codeContent = '';
  let first = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();

    if (t.startsWith('```')) {
      if (inCode) {
        html += `<pre style="margin-top:10px;margin-bottom:20px;">${escapeHtml(
          codeContent.trim()
        )}</pre>`;
        codeContent = '';
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) { codeContent += line + '\n'; continue; }
    if (!t) continue;

    if (t.startsWith('### ')) {
      html += `<h3 style="margin-top:25px;margin-bottom:10px;font-size:14px;">${t.slice(4)}</h3>`;
      first = false;
    } else if (t.startsWith('## ')) {
      html += `<h3 style="margin-top:30px;margin-bottom:12px;">${t.slice(3)}</h3>`;
      first = false;
    } else if (t.startsWith('# ')) {
      const mt = first ? '0' : '35px';
      html += `<h2 style="font-size:18px;margin-top:${mt};margin-bottom:15px;color:var(--text-primary);">${t.slice(
        2
      )}</h2>`;
      first = false;
    } else {
      let para = t;
      while (
        i + 1 < lines.length &&
        lines[i + 1].trim() &&
        !lines[i + 1].trim().startsWith('#') &&
        !lines[i + 1].trim().startsWith('```')
      ) {
        i++;
        para += ' ' + lines[i].trim();
      }
      para = para
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      html += `<p>${para}</p>`;
      first = false;
    }
  }
  return html;
}

// ---- Model catalog helpers ----
function isOpenAIChatCompletionsModel(modelId) {
  if (!modelId || !modelId.startsWith('gpt-')) return false;
  if (TEXT_ONLY_MODEL_EXCLUDE.test(modelId)) return false;
  return OPENAI_CHAT_COMPLETIONS_PREFIXES.some((p) => modelId.startsWith(p));
}

function isChatModelForProvider(provider, modelId) {
  if (!modelId) return false;
  switch (provider) {
    case 'ollama':    return !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
    case 'deepseek':  return modelId.startsWith('deepseek') && !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
    case 'grok':      return modelId.startsWith('grok') && !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
    case 'anthropic': return modelId.startsWith('claude') && !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
    case 'openai':    return isOpenAIChatCompletionsModel(modelId);
    case 'gemini':    return modelId.startsWith('gemini') && !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
    default:          return false;
  }
}

function getModelDisplayName(modelId, availableModels) {
  if (!modelId) return 'None';
  if (availableModels) {
    for (const models of Object.values(availableModels)) {
      const match = (models || []).find(
        (m) => (typeof m === 'string' ? m : m?.id) === modelId
      );
      if (match?.label) return match.label;
    }
  }
  const fallback = {
    'deepseek-chat': 'DeepSeek Chat',
    'deepseek-reasoner': 'DeepSeek Reasoner',
    'grok-2-latest': 'Grok 2 (Latest)',
    'grok-2': 'Grok 2',
    'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
    'claude-3-5-haiku-20241022': 'Claude 3.5 Haiku',
    'claude-sonnet-4-20250514': 'Claude 4 Sonnet',
    'claude-opus-4-20250514': 'Claude 4 Opus',
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o Mini',
    o1: 'o1',
    'gpt-5.2': 'GPT-5.2',
    'gpt-5-mini': 'GPT-5 Mini',
    'gpt-5-nano': 'GPT-5 Nano',
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
    'gemini-1.5-flash': 'Gemini 1.5 Flash',
    'gemini-2.0-flash': 'Gemini 2.0 Flash',
    'gemini-3-flash-preview': 'Gemini 3.5 Flash Preview',
    'gemini-3-pro-preview': 'Gemini 3.5 Pro Preview',
  };
  return (
    fallback[modelId] ||
    modelId
      .replace(/models\//g, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function normalizeModelCatalog(catalog) {
  const normalized = {
    ollama: [], deepseek: [], grok: [], anthropic: [], openai: [], gemini: [],
  };
  Object.keys(normalized).forEach((provider) => {
    const models = catalog?.[provider] || [];
    normalized[provider] = models
      .map((m) =>
        typeof m === 'string'
          ? { id: m, label: getModelDisplayName(m, catalog) }
          : { id: m.id, label: m.label || getModelDisplayName(m.id, catalog) }
      )
      .filter((m) => isChatModelForProvider(provider, m.id));
  });
  return normalized;
}

function hasApiKeyForProvider(provider, config) {
  switch (provider) {
    case 'ollama':    return true;
    case 'deepseek':  return !!(config.deepseek && config.deepseek !== 'YOUR_DEEPSEEK_API_KEY');
    case 'grok':      return !!(config.grok && config.grok !== 'YOUR_GROK_API_KEY');
    case 'anthropic': return !!(config.anthropic && config.anthropic !== 'YOUR_ANTHROPIC_API_KEY');
    case 'openai':    return !!(config.openai && config.openai !== 'YOUR_OPENAI_API_KEY');
    case 'gemini':    return !!(config.gemini && config.gemini !== 'YOUR_GEMINI_API_KEY');
    default:          return false;
  }
}

function getProvider(modelId, availableModels) {
  if (availableModels) {
    for (const [provider, models] of Object.entries(availableModels)) {
      if (
        (models || []).some((m) =>
          (typeof m === 'string' ? m : m?.id) === modelId
        )
      )
        return provider;
    }
  }
  if (modelId.startsWith('deepseek')) return 'deepseek';
  if (modelId.startsWith('grok'))     return 'grok';
  if (modelId.startsWith('claude'))   return 'anthropic';
  if (modelId.startsWith('gpt') || /^o\d/.test(modelId)) return 'openai';
  if (modelId.startsWith('gemini'))   return 'gemini';
  return 'ollama';
}

// ---- Model catalog cache ----
function getCachedModelCatalog() {
  try {
    const raw = localStorage.getItem(MODEL_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !parsed?.catalog) return null;
    if (Date.now() - parsed.timestamp > MODEL_CACHE_TTL_MS) return null;
    return parsed.catalog;
  } catch {
    return null;
  }
}

function setCachedModelCatalog(catalog) {
  localStorage.setItem(
    MODEL_CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), catalog })
  );
}

// ============================================================
// API CALL FUNCTIONS
// ============================================================

async function callAnthropicAPI(conv, config, systemPromptText) {
  const messages = conv.messages.map((m) => ({ role: m.role, content: m.content }));
  const body = {
    model: conv.model,
    max_tokens: DEFAULTS.maxTokens,
    messages,
    ...(systemPromptText ? { system: systemPromptText } : {}),
  };
  const resp = await fetch(ENDPOINTS.anthropic, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.anthropic,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
  }
  const data = await resp.json();
  return {
    content: data.content[0].text,
    usage: {
      input_tokens: data.usage?.input_tokens || 0,
      output_tokens: data.usage?.output_tokens || 0,
    },
  };
}

async function callOpenAIAPI(conv, config, systemPromptText) {
  const messages = conv.messages.map((m) => ({ role: m.role, content: m.content }));
  if (systemPromptText) messages.unshift({ role: 'system', content: systemPromptText });
  const resp = await fetch(ENDPOINTS.openai, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openai}`,
    },
    body: JSON.stringify({
      model: conv.model,
      max_completion_tokens: DEFAULTS.maxTokens,
      messages,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
  }
  const data = await resp.json();
  return {
    content: data.choices[0].message.content,
    usage: {
      input_tokens: data.usage?.prompt_tokens || 0,
      output_tokens: data.usage?.completion_tokens || 0,
    },
  };
}

async function callDeepSeekAPI(conv, config, systemPromptText) {
  const messages = conv.messages.map((m) => ({ role: m.role, content: m.content }));
  if (systemPromptText) messages.unshift({ role: 'system', content: systemPromptText });
  const resp = await fetch(ENDPOINTS.deepseek, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.deepseek}`,
    },
    body: JSON.stringify({
      model: conv.model,
      max_tokens: DEFAULTS.maxTokens,
      temperature: DEFAULTS.temperature,
      messages,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
  }
  const data = await resp.json();
  return {
    content: data.choices[0].message.content,
    usage: {
      input_tokens: data.usage?.prompt_tokens || 0,
      output_tokens: data.usage?.completion_tokens || 0,
    },
  };
}

async function callGrokAPI(conv, config, systemPromptText) {
  const messages = conv.messages.map((m) => ({ role: m.role, content: m.content }));
  if (systemPromptText) messages.unshift({ role: 'system', content: systemPromptText });
  const resp = await fetch(ENDPOINTS.grok, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.grok}`,
    },
    body: JSON.stringify({
      model: conv.model,
      max_tokens: DEFAULTS.maxTokens,
      temperature: DEFAULTS.temperature,
      messages,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
  }
  const data = await resp.json();
  return {
    content: data.choices[0].message.content,
    usage: {
      input_tokens: data.usage?.prompt_tokens || 0,
      output_tokens: data.usage?.completion_tokens || 0,
    },
  };
}

async function callOllamaAPI(conv, _config, systemPromptText) {
  const messages = conv.messages.map((m) => ({ role: m.role, content: m.content }));
  if (systemPromptText) messages.unshift({ role: 'system', content: systemPromptText });
  const resp = await fetch(ENDPOINTS.ollama, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: conv.model,
      max_tokens: DEFAULTS.maxTokens,
      temperature: DEFAULTS.temperature,
      messages,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
  }
  const data = await resp.json();
  return {
    content: data.choices[0].message.content,
    usage: {
      input_tokens: data.usage?.prompt_tokens || 0,
      output_tokens: data.usage?.completion_tokens || 0,
    },
  };
}

async function callGeminiAPI(conv, config, systemPromptText) {
  const url = `${ENDPOINTS.gemini}/${conv.model}:generateContent?key=${config.gemini}`;
  const contents = conv.messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const body = {
    contents,
    generationConfig: {
      maxOutputTokens: DEFAULTS.maxTokens,
      temperature: DEFAULTS.temperature,
    },
    ...(systemPromptText
      ? { systemInstruction: { parts: [{ text: systemPromptText }] } }
      : {}),
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
  }
  const data = await resp.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    usage: {
      input_tokens: data.usageMetadata?.promptTokenCount || 0,
      output_tokens: data.usageMetadata?.candidatesTokenCount || 0,
    },
  };
}

async function fetchAvailableModelsFromAPIs(config) {
  const catalog = {
    ollama: [], deepseek: [], grok: [], anthropic: [], openai: [], gemini: [],
  };
  const hasDeepSeek =  hasApiKeyForProvider('deepseek', config);
  const hasGrok =      hasApiKeyForProvider('grok', config);
  const hasAnthropic = hasApiKeyForProvider('anthropic', config);
  const hasOpenAI =    hasApiKeyForProvider('openai', config);
  const hasGemini =    hasApiKeyForProvider('gemini', config);

  // --- Ollama (always try, short timeout) ---
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 2000);
    const resp = await fetch(ENDPOINTS.ollamaModels, { signal: ctrl.signal });
    clearTimeout(tid);
    if (resp.ok) {
      const data = await resp.json();
      const list = data.data || data.models || [];
      catalog.ollama = list.map((m) => {
        const id = m.id || m.name;
        return { id, label: id };
      });
    } else {
      catalog.ollama = DEFAULT_MODELS.ollama;
    }
  } catch {
    catalog.ollama = DEFAULT_MODELS.ollama;
  }

  // --- DeepSeek ---
  if (hasDeepSeek) {
    try {
      const resp = await fetch(ENDPOINTS.deepseekModels, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.deepseek}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        catalog.deepseek = (data.data || []).map((m) => ({ id: m.id, label: m.id }));
      }
    } catch {}
  }

  // --- Grok ---
  if (hasGrok) {
    try {
      const resp = await fetch(ENDPOINTS.grokModels, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.grok}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        catalog.grok = (data.data || []).map((m) => ({ id: m.id, label: m.id }));
      }
    } catch {}
  }

  // --- Anthropic ---
  if (hasAnthropic) {
    try {
      const resp = await fetch(ENDPOINTS.anthropicModels, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.anthropic,
          'anthropic-version': '2023-06-01',
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        catalog.anthropic = (data.data || [])
          .filter((m) => m.id?.startsWith('claude'))
          .map((m) => ({ id: m.id, label: m.display_name || m.id }));
      }
    } catch {}
  }

  // --- OpenAI ---
  if (hasOpenAI) {
    try {
      const resp = await fetch(ENDPOINTS.openaiModels, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.openai}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        catalog.openai = (data.data || [])
          .map((m) => m.id)
          .filter(isOpenAIChatCompletionsModel)
          .map((id) => ({ id, label: getModelDisplayName(id, null) }));
      }
    } catch {}
  }

  // --- Gemini ---
  if (hasGemini) {
    try {
      const resp = await fetch(`${ENDPOINTS.gemini}?key=${config.gemini}`);
      if (resp.ok) {
        const data = await resp.json();
        catalog.gemini = (data.models || [])
          .filter((m) =>
            (m.supportedGenerationMethods || []).includes('generateContent')
          )
          .map((m) => {
            const id = m.name?.replace('models/', '');
            return { id, label: m.displayName || id };
          })
          .filter((m) => m.id && m.id.startsWith('gemini'));
      }
    } catch {}
  }

  const hasAny = Object.values(catalog).some((l) => l.length > 0);
  if (!hasAny) return null;

  // Merge defaults for providers with keys but no live models
  const merged = { ...catalog };
  Object.keys(DEFAULT_MODELS).forEach((provider) => {
    if (
      hasApiKeyForProvider(provider, config) &&
      (!merged[provider] || !merged[provider].length)
    ) {
      merged[provider] = DEFAULT_MODELS[provider];
    }
  });
  return merged;
}

// ============================================================
// CHATBOT COMPONENT
// ============================================================
const Chatbot = () => {
  // ---- App state ----
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentSystemPromptId, setCurrentSystemPromptId] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [availableModels, setAvailableModels] = useState(null);
  const [showOllamaModels, setShowOllamaModels] = useState(true);
  const [systemPrompts, setSystemPrompts] = useState([...DEFAULT_SYSTEM_PROMPTS]);
  const [apiConfig, setApiConfig] = useState({ ...DEFAULT_API_KEYS });

  // ---- UI state ----
  const [localTime, setLocalTime] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // ---- Modal states ----
  const [showTechNotesModal, setShowTechNotesModal] = useState(false);
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);
  const [showSystemPromptsModal, setShowSystemPromptsModal] = useState(false);
  const [systemPromptsEditList, setSystemPromptsEditList] = useState([]);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // ---- API key input form state ----
  const [apiKeyInputs, setApiKeyInputs] = useState({
    anthropic: '', openai: '', gemini: '', deepseek: '', grok: '',
  });

  // ---- Toast ----
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // ---- Title editing ----
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');

  // ---- Refs ----
  const textareaRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const rightSidebarRef = useRef(null);
  const apiConfigRef = useRef({ ...DEFAULT_API_KEYS }); // always-current keys for API calls
  const isInitialized = useRef(false);

  // ============================================================
  // DERIVED / MEMOIZED VALUES
  // ============================================================
  const currentConversation = useMemo(
    () => conversations.find((c) => c.id === currentConversationId),
    [conversations, currentConversationId]
  );

  const currentModel = currentConversation?.model || '';

  const currentModelName = useMemo(
    () => getModelDisplayName(currentModel, availableModels),
    [currentModel, availableModels]
  );

  const currentSystemPromptName = useMemo(
    () => systemPrompts.find((p) => p.id === currentSystemPromptId)?.title || 'None',
    [systemPrompts, currentSystemPromptId]
  );

  const currentSystemPromptText = useMemo(
    () => systemPrompts.find((p) => p.id === currentSystemPromptId)?.prompt || '',
    [systemPrompts, currentSystemPromptId]
  );

  const normalizedModels = useMemo(
    () => normalizeModelCatalog(availableModels || DEFAULT_MODELS),
    [availableModels]
  );

  // Right sidebar is forced open when no model is selected
  const effectiveRightSidebarOpen = isRightSidebarOpen || !currentModel;

  // ============================================================
  // EFFECTS
  // ============================================================

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString([], {
          hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
        })
      );
      const h = now.getUTCHours().toString().padStart(2, '0');
      const m = now.getUTCMinutes().toString().padStart(2, '0');
      const s = now.getUTCSeconds().toString().padStart(2, '0');
      setUtcTime(`UTC: ${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Apply theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Expose copyCode globally (for onclick in dangerouslySetInnerHTML code blocks)
  useEffect(() => {
    window.copyCode = (blockId) => {
      const el = document.getElementById(blockId);
      if (!el) return;
      navigator.clipboard.writeText(el.innerText).then(() => {
        const btn = el.previousElementSibling?.querySelector('.copy-code-btn');
        if (btn) {
          const orig = btn.innerText;
          btn.innerText = 'Copied!';
          setTimeout(() => { btn.innerText = orig; }, 2000);
        }
      }).catch(console.error);
    };
    return () => { delete window.copyCode; };
  }, []);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setIsMobileSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close sidebar when clicking mobile chat area
  useEffect(() => {
    const onClick = (e) => {
      if (
        window.innerWidth <= 768 &&
        isMobileSidebarOpen
      ) {
        const sidebar = document.getElementById('chatbot-sidebar');
        const btn = document.getElementById('chatbot-mobile-btn');
        if (
          sidebar && !sidebar.contains(e.target) &&
          btn && !btn.contains(e.target)
        ) {
          setIsMobileSidebarOpen(false);
        }
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [isMobileSidebarOpen]);

  // Close right sidebar on outside click (only when a model is selected)
  useEffect(() => {
    const onClick = (e) => {
      if (!currentModel) return; // never close when no model
      if (!isRightSidebarOpen) return;
      const sidebar = rightSidebarRef.current;
      const toggleBtn = document.getElementById('chatbot-settings-btn');
      if (
        sidebar && !sidebar.contains(e.target) &&
        toggleBtn && !toggleBtn.contains(e.target)
      ) {
        setIsRightSidebarOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [currentModel, isRightSidebarOpen]);

  // Escape key closes modals / mobile sidebar
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowTechNotesModal(false);
        setShowApiKeysModal(false);
        setIsMobileSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Initialisation (runs once on mount)
  useEffect(() => {
    // 1. Load API keys
    let initialApiConfig = { ...DEFAULT_API_KEYS };
    try {
      const savedKeys = localStorage.getItem('llm_chatbot_api_keys');
      if (savedKeys) {
        const keys = JSON.parse(savedKeys);
        Object.entries(keys).forEach(([k, v]) => {
          if (v) initialApiConfig[k] = v;
        });
      }
    } catch {}
    apiConfigRef.current = initialApiConfig;
    setApiConfig(initialApiConfig);

    // 2. Load system prompts
    try {
      const savedPrompts = localStorage.getItem('llm_chatbot_system_prompts');
      if (savedPrompts) setSystemPrompts(JSON.parse(savedPrompts));
    } catch {}

    // 3. Load main state
    let initialConvs = [];
    let initialCurrentId = null;
    let initialPromptId = 'none';
    let initialTheme = 'light';
    let initialShowOllama = true;
    try {
      const saved = localStorage.getItem('llm_chatbot_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        initialConvs = (parsed.conversations || []).map(ensureConversationMetrics);
        initialCurrentId = parsed.currentConversationId || null;
        initialPromptId = parsed.currentSystemPromptId || 'none';
        initialTheme = parsed.theme || 'light';
        initialShowOllama =
          parsed.showOllamaModels !== undefined ? parsed.showOllamaModels : true;
      }
    } catch {}

    // 4. Ensure at least one conversation
    if (initialConvs.length === 0) {
      const newConv = createNewConvObject('');
      initialConvs = [newConv];
      initialCurrentId = newConv.id;
    } else if (
      !initialCurrentId ||
      !initialConvs.find((c) => c.id === initialCurrentId)
    ) {
      initialCurrentId = initialConvs[0].id;
    }

    setConversations(initialConvs);
    setCurrentConversationId(initialCurrentId);
    setCurrentSystemPromptId(initialPromptId);
    setTheme(initialTheme);
    setShowOllamaModels(initialShowOllama);

    isInitialized.current = true;

    // 5. Initialise model selector
    initModels(initialApiConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state whenever it changes (skip initial render)
  const persistenceSkip = useRef(true);
  useEffect(() => {
    if (persistenceSkip.current) { persistenceSkip.current = false; return; }
    if (!isInitialized.current) return;
    localStorage.setItem(
      'llm_chatbot_state',
      JSON.stringify({
        conversations,
        currentConversationId,
        currentSystemPromptId,
        theme,
        showOllamaModels,
      })
    );
  }, [conversations, currentConversationId, currentSystemPromptId, theme, showOllamaModels]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [conversations, currentConversationId]);

  // After models load, auto-select first model if current conversation has none
  useEffect(() => {
    if (!availableModels || !currentConversationId) return;
    const conv = conversations.find((c) => c.id === currentConversationId);
    if (!conv || conv.model) return;

    const allAvail = PROVIDER_ORDER.flatMap((p) => {
      if (p === 'ollama' && !showOllamaModels) return [];
      if (!hasApiKeyForProvider(p, apiConfigRef.current)) return [];
      return normalizedModels[p] || [];
    });

    if (allAvail.length > 0) {
      const firstId = allAvail[0].id;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId ? { ...c, model: firstId } : c
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableModels]);

  // ============================================================
  // HELPERS
  // ============================================================

  const initModels = useCallback(async (config) => {
    const cfg = config || apiConfigRef.current;
    const cached = getCachedModelCatalog();
    if (cached) setAvailableModels(cached);
    const live = await fetchAvailableModelsFromAPIs(cfg);
    if (live) {
      setCachedModelCatalog(live);
      setAvailableModels(live);
    } else if (!cached) {
      setAvailableModels(DEFAULT_MODELS);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current)
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
  }, []);

  const scrollToLastAssistant = useCallback((msgs) => {
    let lastIdx = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant') { lastIdx = i; break; }
    }
    if (lastIdx >= 0) {
      setTimeout(() => {
        const el = document.getElementById(`msg-${lastIdx}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, []);

  const showToast = useCallback((msg = 'Saved successfully!') => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, []);

  // ============================================================
  // CONVERSATION MANAGEMENT
  // ============================================================

  const handleCreateNewConversation = useCallback(() => {
    const newConv = createNewConvObject(currentModel || '');
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  }, [currentModel]);

  const handleLoadConversation = useCallback(
    (convId) => {
      setCurrentConversationId(convId);
      setTimeout(scrollToBottom, 50);
    },
    [scrollToBottom]
  );

  const handleDeleteRequest = useCallback((convId, e) => {
    e.stopPropagation();
    setPendingDeleteId(convId);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (currentConversationId === id) {
        if (filtered.length > 0) {
          setCurrentConversationId(filtered[0].id);
          return filtered;
        } else {
          const newConv = createNewConvObject(currentModel || '');
          setCurrentConversationId(newConv.id);
          return [newConv];
        }
      }
      return filtered;
    });
  }, [pendingDeleteId, currentConversationId, currentModel]);

  const handleModelChange = useCallback(
    (e) => {
      const val = e.target.value;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId ? { ...c, model: val } : c
        )
      );
    },
    [currentConversationId]
  );

  const handleSystemPromptChange = useCallback((e) => {
    setCurrentSystemPromptId(e.target.value);
  }, []);

  const handleTitleEditStart = useCallback(
    (convId, e) => {
      e.stopPropagation();
      const conv = conversations.find((c) => c.id === convId);
      if (conv) {
        setEditingTitleId(convId);
        setEditingTitleValue(conv.title);
      }
    },
    [conversations]
  );

  const handleTitleEditSave = useCallback(() => {
    const newTitle = editingTitleValue.trim();
    if (newTitle && editingTitleId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === editingTitleId ? { ...c, title: newTitle } : c
        )
      );
    }
    setEditingTitleId(null);
    setEditingTitleValue('');
  }, [editingTitleId, editingTitleValue]);

  const handleTitleEditKeyDown = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') handleTitleEditSave();
      if (e.key === 'Escape') { setEditingTitleId(null); setEditingTitleValue(''); }
    },
    [handleTitleEditSave]
  );

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleInputChange = useCallback((e) => {
    setMessageInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') e.stopPropagation();
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = messageInput.trim();
    if (!trimmed || isLoading || !currentConversationId) return;

    const conv = conversations.find((c) => c.id === currentConversationId);
    if (!conv) return;

    const userMsg = { role: 'user', content: trimmed };
    const updatedMessages = [...conv.messages, userMsg];
    const newTitle =
      conv.messages.length === 0 && conv.title === 'New Chat'
        ? trimmed.substring(0, 40) + (trimmed.length > 40 ? '...' : '')
        : conv.title;

    // Update UI immediately with user message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConversationId
          ? { ...c, messages: updatedMessages, title: newTitle }
          : c
      )
    );
    setMessageInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    const convForApi = { ...conv, messages: updatedMessages };
    const sysPrompt = currentSystemPromptText;
    const cfg = apiConfigRef.current;
    const models = availableModels;

    try {
      const provider = getProvider(conv.model, models);
      let response;
      switch (provider) {
        case 'anthropic': response = await callAnthropicAPI(convForApi, cfg, sysPrompt); break;
        case 'openai':    response = await callOpenAIAPI(convForApi, cfg, sysPrompt); break;
        case 'deepseek':  response = await callDeepSeekAPI(convForApi, cfg, sysPrompt); break;
        case 'grok':      response = await callGrokAPI(convForApi, cfg, sysPrompt); break;
        case 'gemini':    response = await callGeminiAPI(convForApi, cfg, sysPrompt); break;
        default:          response = await callOllamaAPI(convForApi, cfg, sysPrompt); break;
      }

      const assistantMsg = {
        role: 'assistant',
        content: response.content,
        model: conv.model,
        systemPromptId: currentSystemPromptId,
      };
      const finalMessages = [...updatedMessages, assistantMsg];

      const inputTokens = response.usage
        ? response.usage.input_tokens || 0
        : estimateTokens(updatedMessages.map((m) => m.content).join(''));
      const outputTokens = response.usage
        ? response.usage.output_tokens || 0
        : estimateTokens(response.content);
      const cost = calculateCost(inputTokens, outputTokens, conv.model);

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentConversationId) return c;
          const updated = ensureConversationMetrics(c);
          const modelUsage = { ...updated.modelUsage };
          if (!modelUsage[conv.model])
            modelUsage[conv.model] = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
          modelUsage[conv.model].inputTokens += inputTokens;
          modelUsage[conv.model].outputTokens += outputTokens;
          modelUsage[conv.model].totalTokens += inputTokens + outputTokens;
          return {
            ...updated,
            messages: finalMessages,
            title: newTitle,
            totalCost: updated.totalCost + cost,
            totalInputTokens: updated.totalInputTokens + inputTokens,
            totalOutputTokens: updated.totalOutputTokens + outputTokens,
            modelUsage,
          };
        })
      );

      scrollToLastAssistant(finalMessages);
    } catch (err) {
      console.error('API Error:', err);
      const errMsg = {
        role: 'assistant',
        content: `Error: ${err.message}\n\nPlease check your API key and ensure CORS is properly configured. See Technical Notes for more information.`,
        model: conv.model,
        systemPromptId: currentSystemPromptId,
      };
      const errMessages = [...updatedMessages, errMsg];
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId
            ? { ...c, messages: errMessages, title: newTitle }
            : c
        )
      );
      scrollToLastAssistant(errMessages);
    } finally {
      setIsLoading(false);
    }
  }, [
    messageInput, isLoading, currentConversationId, conversations,
    currentSystemPromptId, currentSystemPromptText, availableModels, scrollToLastAssistant,
  ]);

  // ============================================================
  // OLLAMA TOGGLE
  // ============================================================
  const handleToggleOllama = useCallback(() => {
    setShowOllamaModels((prev) => !prev);
  }, []);

  // ============================================================
  // API KEYS MODAL
  // ============================================================
  const handleOpenApiKeys = useCallback(() => {
    const cfg = apiConfigRef.current;
    setApiKeyInputs({
      anthropic: cfg.anthropic !== 'YOUR_ANTHROPIC_API_KEY' ? cfg.anthropic : '',
      openai:    cfg.openai    !== 'YOUR_OPENAI_API_KEY'    ? cfg.openai    : '',
      gemini:    cfg.gemini    !== 'YOUR_GEMINI_API_KEY'    ? cfg.gemini    : '',
      deepseek:  cfg.deepseek  !== 'YOUR_DEEPSEEK_API_KEY'  ? cfg.deepseek  : '',
      grok:      cfg.grok      !== 'YOUR_GROK_API_KEY'      ? cfg.grok      : '',
    });
    setShowApiKeysModal(true);
  }, []);

  const handleSaveApiKeys = useCallback(async () => {
    const newConfig = {
      anthropic: apiKeyInputs.anthropic || 'YOUR_ANTHROPIC_API_KEY',
      openai:    apiKeyInputs.openai    || 'YOUR_OPENAI_API_KEY',
      gemini:    apiKeyInputs.gemini    || 'YOUR_GEMINI_API_KEY',
      deepseek:  apiKeyInputs.deepseek  || 'YOUR_DEEPSEEK_API_KEY',
      grok:      apiKeyInputs.grok      || 'YOUR_GROK_API_KEY',
    };
    apiConfigRef.current = newConfig;
    setApiConfig(newConfig);
    localStorage.setItem(
      'llm_chatbot_api_keys',
      JSON.stringify({
        anthropic: apiKeyInputs.anthropic,
        openai:    apiKeyInputs.openai,
        gemini:    apiKeyInputs.gemini,
        deepseek:  apiKeyInputs.deepseek,
        grok:      apiKeyInputs.grok,
      })
    );
    setShowApiKeysModal(false);
    showToast('API keys saved successfully!');
    await initModels(newConfig);
  }, [apiKeyInputs, showToast, initModels]);

  // ============================================================
  // SYSTEM PROMPTS MODAL
  // ============================================================
  const handleOpenSystemPrompts = useCallback(() => {
    setSystemPromptsEditList(systemPrompts.map((p) => ({ ...p })));
    setShowSystemPromptsModal(true);
  }, [systemPrompts]);

  const handleSaveSystemPrompts = useCallback(() => {
    setSystemPrompts(systemPromptsEditList);
    localStorage.setItem(
      'llm_chatbot_system_prompts',
      JSON.stringify(systemPromptsEditList)
    );
    setShowSystemPromptsModal(false);
    showToast('System prompts saved successfully!');
  }, [systemPromptsEditList, showToast]);

  const handleAddSystemPrompt = useCallback(() => {
    setSystemPromptsEditList((prev) => [
      ...prev,
      { id: 'custom_' + Date.now(), title: 'New Custom Prompt', prompt: '' },
    ]);
  }, []);

  const handleDeleteSystemPrompt = useCallback((index) => {
    setSystemPromptsEditList((prev) => {
      const next = [...prev];
      const deleted = next[index];
      next.splice(index, 1);
      if (deleted && currentSystemPromptId === deleted.id) {
        setCurrentSystemPromptId('none');
      }
      return next;
    });
  }, [currentSystemPromptId]);

  const handleUpdateSystemPromptField = useCallback((index, field, value) => {
    setSystemPromptsEditList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  // ============================================================
  // COPY MESSAGE (React-managed, no DOM traversal needed)
  // ============================================================
  const handleCopyMessage = useCallback((content, btn) => {
    // Get the rendered text from the content div using a data attribute selector
    const msgDiv = btn.closest(`[data-message-wrapper]`);
    const contentDiv = msgDiv?.querySelector('[data-message-content]');
    const text = contentDiv ? contentDiv.innerText : content;
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✅';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }).catch(() => {
      navigator.clipboard.writeText(content).catch(console.error);
    });
  }, []);

  // ============================================================
  // RENDER HELPERS
  // ============================================================

  const renderConversationItem = (conv) => {
    const totalTokens = conv.totalInputTokens + conv.totalOutputTokens;
    const metaParts = [
      formatDate(conv.createdAt),
      getModelDisplayName(conv.model, availableModels),
      `${formatTokenCount(totalTokens)} tokens`,
      `$${conv.totalCost.toFixed(4)}`,
    ];
    const isActive = conv.id === currentConversationId;
    const isEditing = editingTitleId === conv.id;

    return (
      <div
        key={conv.id}
        className={`${styles.conversationItem}${isActive ? ' ' + styles.active : ''}`}
        onClick={() => !isEditing && handleLoadConversation(conv.id)}
      >
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {isEditing ? (
            <input
              type="text"
              className={styles.titleEditInput}
              value={editingTitleValue}
              onChange={(e) => setEditingTitleValue(e.target.value)}
              onBlur={handleTitleEditSave}
              onKeyDown={handleTitleEditKeyDown}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <div className={styles.conversationTitle}>{conv.title}</div>
          )}
          <div className={styles.conversationMeta}>{metaParts.join(' • ')}</div>
        </div>
        {!isEditing && (
          <button
            className={styles.editTitleBtn}
            onClick={(e) => handleTitleEditStart(conv.id, e)}
            title="Edit title"
          >
            ✏️
          </button>
        )}
        <button
          className={styles.deleteConvBtn}
          onClick={(e) => handleDeleteRequest(conv.id, e)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    );
  };

  const renderMessage = (msg, index) => {
    let roleLabel = 'You';
    if (msg.role === 'assistant') {
      const sp = systemPrompts.find((p) => p.id === msg.systemPromptId);
      const promptTitle = sp ? sp.title : 'None';
      const modelName = msg.model
        ? getModelDisplayName(msg.model, availableModels)
        : currentModelName;
      roleLabel = `${modelName} (${promptTitle})`;
    }

    const messageContent =
      msg.role === 'assistant'
        ? enhanceMessageWithDownloads(msg.content)
        : formatMessageContent(msg.content);

    return (
      <div
        key={index}
        id={`msg-${index}`}
        className={`${styles.message} ${msg.role === 'user' ? styles.user : msg.role === 'assistant' ? styles.assistant : styles.system}`}
        data-message-wrapper
      >
        <button
          className={styles.copyMsgBtn}
          title="Copy message"
          onClick={(e) => handleCopyMessage(msg.content, e.currentTarget)}
        >
          📋
        </button>
        <div className={styles.messageRole}>{roleLabel}</div>
        <div
          className={styles.messageContent}
          data-message-content
          dangerouslySetInnerHTML={{ __html: messageContent }}
        />
      </div>
    );
  };

  const renderModelOptions = () => {
    const opts = [];
    PROVIDER_ORDER.forEach((provider) => {
      if (provider === 'ollama' && !showOllamaModels) return;
      if (!hasApiKeyForProvider(provider, apiConfig)) return;
      const models = normalizedModels[provider] || [];
      if (!models.length) return;
      opts.push(
        <optgroup key={provider} label={PROVIDER_LABELS[provider]}>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </optgroup>
      );
    });
    if (!opts.length) {
      return (
        <option value="" disabled>
          No models available – configure API keys
        </option>
      );
    }
    return opts;
  };

  const apiKeyStatusBadge = (key, placeholder) => {
    const configured = !!(apiConfig[key] && apiConfig[key] !== placeholder);
    return (
      <span
        className={`${styles.apiKeyStatus} ${configured ? styles.configured : styles.missing}`}
      >
        {configured ? '✓ Configured' : '✗ Not set'}
      </span>
    );
  };

  // Cost / tokens for current conversation
  const convCost = currentConversation?.totalCost || 0;
  const convTokens =
    (currentConversation?.totalInputTokens || 0) +
    (currentConversation?.totalOutputTokens || 0);

  // ============================================================
  // JSX
  // ============================================================
  return (
    <div className={styles.appContainer}>
      {/* Mobile Menu Button */}
      <button
        id="chatbot-mobile-btn"
        className={styles.mobileMenuBtn}
        onClick={() => setIsMobileSidebarOpen((v) => !v)}
        aria-label="Toggle Menu"
      >
        ☰
      </button>

      {/* ---- Left Sidebar ---- */}
      <aside
        id="chatbot-sidebar"
        className={`${styles.sidebar}${isMobileSidebarOpen ? ' ' + styles.mobileOpen : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <h1>▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒</h1>
          <button className={styles.newChatBtn} onClick={handleCreateNewConversation}>
            + New Chat
          </button>
        </div>

        <div className={styles.conversationsList}>
          {conversations.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px', fontSize: '13px' }}>
              No conversations yet
            </p>
          ) : (
            conversations.map(renderConversationItem)
          )}
        </div>

        <div className={styles.sidebarFooter} />
      </aside>

      {/* ---- Main Chat Area ---- */}
      <main className={styles.chatArea}>
        <header className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.currentModelDisplay}>
              <span className={styles.modelLabel}>Model:</span>
              <span className={styles.modelName}>{currentModelName}</span>
            </div>
            <div className={styles.currentPromptDisplay}>
              <span className={styles.promptLabel}>Prompt:</span>
              <span className={styles.promptName}>{currentSystemPromptName}</span>
            </div>
          </div>

          <div className={styles.headerCenter}>
            <div className={styles.clockDisplay}>
              <span>{localTime}</span>
              <span className={styles.utcTime}>{utcTime}</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.costDisplay}>
              <span className={styles.costLabel}>Session Cost:</span>
              <span className={styles.costValue}>${convCost.toFixed(4)}</span>
              <span className={styles.costLabel} style={{ marginLeft: '10px' }}>
                Tokens:
              </span>
              <span className={styles.costValue}>{formatTokenCount(convTokens)}</span>
            </div>
            <button
              id="chatbot-settings-btn"
              className={styles.toggleRightSidebarBtn}
              onClick={() => setIsRightSidebarOpen((v) => !v)}
              title="Toggle Settings"
            >
              ⚙️
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className={styles.messagesContainer} ref={messagesContainerRef}>
          {!currentConversation || currentConversation.messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon} />
            </div>
          ) : (
            currentConversation.messages.map(renderMessage)
          )}

          {isLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.loadingDots}>
                <span /><span /><span />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Generating response...
              </span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              className={styles.messageInput}
              value={messageInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Press Enter for new line)"
              rows={1}
            />
            <button
              type="button"
              className={styles.sendBtn}
              onClick={sendMessage}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      </main>

      {/* ---- Right Sidebar ---- */}
      <aside
        ref={rightSidebarRef}
        className={`${styles.rightSidebar}${effectiveRightSidebarOpen ? ' ' + styles.active : ''}`}
      >
        <div className={styles.sidebarSection}>
          <h3>Settings</h3>
          <button className={styles.settingsBtn} onClick={handleOpenApiKeys}>
            🔑 API Keys Settings
          </button>
          <button className={styles.settingsBtn} onClick={handleToggleOllama}>
            🦙 {showOllamaModels ? 'Hide' : 'Show'} Ollama Models
          </button>
          <div className={styles.themeToggle} onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
            <div className={styles.toggleSwitch} />
            <span className={styles.themeToggleLabel}>Dark Mode</span>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <h3>Model Settings</h3>
          <div className={styles.modelSelector}>
            <label htmlFor="model-select">Model:</label>
            <select
              id="model-select"
              value={currentModel}
              onChange={handleModelChange}
            >
              {availableModels === null && (
                <option value="" disabled>
                  Loading models…
                </option>
              )}
              {renderModelOptions()}
            </select>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <h3>System Prompt</h3>
          <div className={styles.systemPromptSelector}>
            <select
              id="system-prompt-select"
              value={currentSystemPromptId}
              onChange={handleSystemPromptChange}
            >
              {systemPrompts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <button className={styles.editPromptsBtn} onClick={handleOpenSystemPrompts}>
              ✏️ Edit
            </button>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <h3>Information</h3>
          <button
            className={styles.techNoteBtn}
            onClick={() => setShowTechNotesModal(true)}
          >
            ⚙️ Technical Notes
          </button>
        </div>
      </aside>

      {/* ============================================================
          MODALS
          ============================================================ */}

      {/* Technical Notes Modal */}
      <div
        className={`${styles.modalOverlay}${showTechNotesModal ? ' ' + styles.active : ''}`}
        onClick={(e) => e.target === e.currentTarget && setShowTechNotesModal(false)}
      >
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>Technical Notes</h2>
            <button className={styles.modalClose} onClick={() => setShowTechNotesModal(false)}>
              &times;
            </button>
          </div>
          <div
            className={styles.modalContent}
            dangerouslySetInnerHTML={{
              __html: showTechNotesModal ? convertMarkdownToHTML(TECHNICAL_NOTES_MD) : '',
            }}
          />
        </div>
      </div>

      {/* System Prompts Modal */}
      <div
        className={`${styles.modalOverlay}${showSystemPromptsModal ? ' ' + styles.active : ''}`}
        onClick={(e) => e.target === e.currentTarget && setShowSystemPromptsModal(false)}
      >
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>✏️ Edit System Prompts</h2>
            <button
              className={styles.modalClose}
              onClick={() => setShowSystemPromptsModal(false)}
            >
              &times;
            </button>
          </div>
          <div className={styles.modalContent}>
            <p style={{ marginBottom: '25px', color: 'var(--text-muted)' }}>
              Customize your system prompts below. System prompts guide the AI's behavior and persona.
            </p>

            {systemPromptsEditList.map((prompt, index) => (
              <div key={prompt.id} className={styles.systemPromptItem}>
                <div className={styles.systemPromptHeader}>
                  <input
                    type="text"
                    value={prompt.title}
                    placeholder="Prompt Title"
                    onChange={(e) =>
                      handleUpdateSystemPromptField(index, 'title', e.target.value)
                    }
                  />
                  {prompt.id !== 'none' && (
                    <button
                      className={styles.deletePromptBtn}
                      onClick={() => handleDeleteSystemPrompt(index)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <textarea
                  value={prompt.prompt}
                  placeholder="System prompt text..."
                  disabled={prompt.id === 'none'}
                  onChange={(e) =>
                    handleUpdateSystemPromptField(index, 'prompt', e.target.value)
                  }
                />
              </div>
            ))}

            <button
              className={styles.btnSave}
              onClick={handleAddSystemPrompt}
              style={{ marginTop: '15px', width: '100%' }}
            >
              + Add New Prompt
            </button>

            <div className={styles.formActions}>
              <button
                className={styles.btnCancel}
                onClick={() => setShowSystemPromptsModal(false)}
              >
                Cancel
              </button>
              <button className={styles.btnSave} onClick={handleSaveSystemPrompts}>
                Save Prompts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Modal */}
      <div
        className={`${styles.modalOverlay}${showApiKeysModal ? ' ' + styles.active : ''}`}
        onClick={(e) => e.target === e.currentTarget && setShowApiKeysModal(false)}
      >
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>🔑 API Keys Settings</h2>
            <button className={styles.modalClose} onClick={() => setShowApiKeysModal(false)}>
              &times;
            </button>
          </div>
          <div className={styles.modalContent}>
            <p style={{ marginBottom: '25px', color: 'var(--text-muted)' }}>
              Enter your API keys below. Keys are stored locally in your browser and never sent to
              any server except the respective API providers.
            </p>

            <div className={styles.ollamaToggleRow}>
              <div className={styles.ollamaToggleText}>
                <h3>Ollama Models</h3>
                <p className={styles.hint}>Show or hide local Ollama models in the model selector.</p>
              </div>
              <button type="button" className={styles.btnGhost} onClick={handleToggleOllama}>
                {showOllamaModels ? 'Hide Ollama Models' : 'Show Ollama Models'}
              </button>
            </div>

            {[
              { key: 'anthropic', placeholder: 'sk-ant-api03-…', label: 'Anthropic API Key', href: 'https://console.anthropic.com/', linkText: 'console.anthropic.com', defaultPlaceholder: 'YOUR_ANTHROPIC_API_KEY' },
              { key: 'openai',    placeholder: 'sk-…',           label: 'OpenAI API Key',    href: 'https://platform.openai.com/api-keys', linkText: 'platform.openai.com', defaultPlaceholder: 'YOUR_OPENAI_API_KEY' },
              { key: 'gemini',    placeholder: 'AIza…',          label: 'Gemini API Key',    href: 'https://aistudio.google.com/apikey', linkText: 'aistudio.google.com', defaultPlaceholder: 'YOUR_GEMINI_API_KEY' },
              { key: 'deepseek',  placeholder: 'sk-…',           label: 'DeepSeek API Key',  href: 'https://platform.deepseek.com/', linkText: 'platform.deepseek.com', defaultPlaceholder: 'YOUR_DEEPSEEK_API_KEY' },
              { key: 'grok',      placeholder: 'xai-…',          label: 'Grok (xAI) API Key',href: 'https://console.x.ai/', linkText: 'console.x.ai', defaultPlaceholder: 'YOUR_GROK_API_KEY' },
            ].map(({ key, placeholder, label, href, linkText, defaultPlaceholder }) => (
              <div key={key} className={styles.formGroup}>
                <label>
                  {label} {apiKeyStatusBadge(key, defaultPlaceholder)}
                </label>
                <input
                  type="password"
                  placeholder={placeholder}
                  autoComplete="off"
                  value={apiKeyInputs[key]}
                  onChange={(e) =>
                    setApiKeyInputs((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
                <p className={styles.hint}>
                  Get your key from{' '}
                  <a href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)' }}>
                    {linkText}
                  </a>
                </p>
              </div>
            ))}

            <div className={styles.formActions}>
              <button className={styles.btnCancel} onClick={() => setShowApiKeysModal(false)}>
                Cancel
              </button>
              <button className={styles.btnSave} onClick={handleSaveApiKeys}>
                Save Keys
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div
        className={`${styles.modalOverlay} ${styles.deleteModalOverlay}${pendingDeleteId ? ' ' + styles.active : ''}`}
        onClick={(e) => e.target === e.currentTarget && setPendingDeleteId(null)}
      >
        <div className={`${styles.modal} ${styles.deleteModal}`}>
          <div className={styles.modalHeader}>
            <h2>Confirm Deletion</h2>
            <button className={styles.modalClose} onClick={() => setPendingDeleteId(null)}>
              &times;
            </button>
          </div>
          <div className={styles.modalContent}>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className={styles.formActions}>
              <button className={styles.btnCancel} onClick={() => setPendingDeleteId(null)}>
                Cancel
              </button>
              <button className={styles.btnDanger} onClick={handleConfirmDelete}>
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <div className={`${styles.successToast}${toastVisible ? ' ' + styles.show : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
};

export default Chatbot;
