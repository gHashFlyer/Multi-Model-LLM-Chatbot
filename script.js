// ============================================
// GLOBAL CONFIGURATION
// ============================================
const GLOBAL_CONFIG = {
    // API Keys - Replace with your actual API keys
    apiKeys: {
        anthropic: 'YOUR_ANTHROPIC_API_KEY',
        openai: 'YOUR_OPENAI_API_KEY',
        gemini: 'YOUR_GEMINI_API_KEY',
        deepseek: 'YOUR_DEEPSEEK_API_KEY',
        grok: 'YOUR_GROK_API_KEY'
    },
    
    // API Endpoints
    endpoints: {
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
        ollamaModels: 'http://localhost:11434/v1/models'
    },
    
    // Default Settings
    defaults: {
        maxTokens: 4096,
        temperature: 0.7
    }
};

// ============================================
// SYSTEM PROMPTS
// ============================================
const DEFAULT_SYSTEM_PROMPTS = [
    {
        id: 'none',
        title: 'None',
        prompt: ''
    },
    {
        id: 'general',
        title: 'General Assistant',
        prompt: 'You are a helpful, friendly, and knowledgeable AI assistant. Provide clear, accurate, and concise answers to user questions.'
    },
    {
        id: 'code',
        title: 'Code Generation',
        prompt: 'You are an expert software engineer. Provide clean, well-documented, and efficient code. Follow best practices and explain your reasoning when helpful.'
    },
    {
        id: 'financial',
        title: 'Financial Model Evaluation',
        prompt: 'You are a financial analyst with expertise in evaluating business models, analyzing financial statements, and providing investment insights. Be thorough, data-driven, and objective in your analysis.'
    },
    {
        id: 'creative',
        title: 'Creative Writing',
        prompt: 'You are a creative writer with a flair for storytelling. Help users with creative writing, brainstorming ideas, and crafting engaging narratives.'
    },
    {
        id: 'technical',
        title: 'Technical Documentation',
        prompt: 'You are a technical writer specializing in clear, comprehensive documentation. Write precise, well-structured technical documentation that is easy to understand.'
    }
];

let systemPrompts = [...DEFAULT_SYSTEM_PROMPTS];

// ============================================
// PRICING TABLE (2025/2026 rates per 1M tokens)
// ============================================
const PRICING_TABLE = {
    // Anthropic Models
    'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
    'claude-3-5-haiku-20241022': { input: 0.80, output: 4.00 },
    'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },
    'claude-opus-4-20250514': { input: 15.00, output: 75.00 },
    
    // OpenAI Models
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'o1': { input: 15.00, output: 60.00 },
    'gpt-5.2': { input: 5.00, output: 20.00 },
    'gpt-5-mini': { input: 0.10, output: 0.40 },
    'gpt-5-nano': { input: 0.05, output: 0.20 },
    
    // Google Gemini Models
    'gemini-1.5-pro': { input: 1.25, output: 5.00 },
    'gemini-1.5-flash': { input: 0.075, output: 0.30 },
    'gemini-2.0-flash': { input: 0.10, output: 0.40 },
    'gemini-3-flash-preview': { input: 0.075, output: 0.30 },
    'gemini-3-pro-preview': { input: 1.25, output: 5.00 }
};

// ============================================
// MODEL CATALOG (fallback + cache)
// ============================================
const DEFAULT_MODELS = {
    ollama: [
        { id: 'llama3.1', label: 'Llama 3.1 (Ollama)' },
        { id: 'llama3', label: 'Llama 3 (Ollama)' }
    ],
    deepseek: [
        { id: 'deepseek-chat', label: 'DeepSeek Chat' },
        { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner' }
    ],
    grok: [
        { id: 'grok-2-latest', label: 'Grok 2 (Latest)' },
        { id: 'grok-2', label: 'Grok 2' }
    ],
    anthropic: [
        { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
        { id: 'claude-sonnet-4-20250514', label: 'Claude 4 Sonnet' },
        { id: 'claude-opus-4-20250514', label: 'Claude 4 Opus' }
    ],
    openai: [
        { id: 'gpt-5.2', label: 'GPT-5.2' },
        { id: 'gpt-5-mini', label: 'GPT-5 Mini' },
        { id: 'gpt-5-nano', label: 'GPT-5 Nano' },
        { id: 'gpt-4o', label: 'GPT-4o' },
        { id: 'gpt-4o-mini', label: 'GPT-4o Mini' }
    ],
    gemini: [
        { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
        { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
        { id: 'gemini-3-flash-preview', label: 'Gemini 3.5 Flash Preview' },
        { id: 'gemini-3-pro-preview', label: 'Gemini 3.5 Pro Preview' }
    ]
};

const OPENAI_CHAT_COMPLETIONS_PREFIXES = [
    'gpt-5.2',
    'gpt-5-mini',
    'gpt-5-nano',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo'
];
const TEXT_ONLY_MODEL_EXCLUDE = /-(realtime|audio|vision|image|embedding|transcribe|tts|speech|search|computer|cu)/i;

const PROVIDER_LABELS = {
    ollama: 'Ollama',
    deepseek: 'DeepSeek',
    grok: 'Grok (xAI)',
    anthropic: 'Anthropic',
    openai: 'OpenAI',
    gemini: 'Google Gemini'
};

const MODEL_CACHE_KEY = 'llm_chatbot_model_catalog';
const MODEL_CACHE_TTL_MS = 1000 * 60 * 60 * 6;

// ============================================
// APPLICATION STATE
// ============================================
let state = {
    conversations: [],
    currentConversationId: null,
    currentSystemPromptId: 'none',
    isLoading: false,
    theme: 'light',
    availableModels: null,
    pendingDeleteId: null
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    loadApiKeysFromStorage();
    loadSystemPromptsFromStorage();
    loadFromLocalStorage();
    renderConversationsList();
    renderSystemPromptSelector();
    initTheme();
    await initModelSelector();
    
    if (state.conversations.length === 0) {
        createNewConversation();
    } else if (state.currentConversationId) {
        loadConversation(state.currentConversationId);
    } else {
        loadConversation(state.conversations[0].id);
    }
    
    // Add event listener for system prompts modal
    const systemPromptsModal = document.getElementById('systemPromptsModal');
    if (systemPromptsModal) {
        systemPromptsModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeSystemPromptsModal();
            }
        });
    }

    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    if (deleteConfirmModal) {
        deleteConfirmModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeDeleteConfirmModal();
            }
        });
    }

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteConversation);
    }
});

// ============================================
// LOCAL STORAGE FUNCTIONS
// ============================================
function saveToLocalStorage() {
    localStorage.setItem('llm_chatbot_state', JSON.stringify({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        currentSystemPromptId: state.currentSystemPromptId,
        theme: state.theme
    }));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('llm_chatbot_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        state.conversations = parsed.conversations || [];
        state.currentConversationId = parsed.currentConversationId;
        state.currentSystemPromptId = parsed.currentSystemPromptId || 'none';
        state.theme = parsed.theme || 'light';
        state.conversations.forEach(ensureConversationMetrics);
    }
}

// ============================================
// THEME FUNCTIONS
// ============================================
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    saveToLocalStorage();
}

// ============================================
// CONVERSATION MANAGEMENT
// ============================================
function createNewConversation() {
    const id = 'conv_' + Date.now();
    const conversation = {
        id: id,
        title: 'New Chat',
        messages: [],
        model: document.getElementById('modelSelect').value,
        totalCost: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        modelUsage: {},
        createdAt: new Date().toISOString()
    };
    
    state.conversations.unshift(conversation);
    state.currentConversationId = id;
    saveToLocalStorage();
    renderConversationsList();
    renderMessages();
    updateCostDisplay();
}

function loadConversation(conversationId) {
    state.currentConversationId = conversationId;
    const conversation = getCurrentConversation();
    
    if (conversation) {
        document.getElementById('modelSelect').value = conversation.model;
        saveToLocalStorage();
        renderConversationsList();
        renderMessages();
        updateCostDisplay();
    }
}

function requestDeleteConversation(conversationId, event) {
    event.stopPropagation();
    showDeleteConfirmModal(conversationId);
}

function deleteConversation(conversationId) {
    state.conversations = state.conversations.filter(c => c.id !== conversationId);
    
    if (state.currentConversationId === conversationId) {
        if (state.conversations.length > 0) {
            loadConversation(state.conversations[0].id);
        } else {
            createNewConversation();
        }
    }
    
    saveToLocalStorage();
    renderConversationsList();
}

function showDeleteConfirmModal(conversationId) {
    state.pendingDeleteId = conversationId;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeDeleteConfirmModal() {
    state.pendingDeleteId = null;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function confirmDeleteConversation() {
    if (!state.pendingDeleteId) return;
    const conversationId = state.pendingDeleteId;
    closeDeleteConfirmModal();
    deleteConversation(conversationId);
}

function getCurrentConversation() {
    return state.conversations.find(c => c.id === state.currentConversationId);
}

function ensureConversationMetrics(conversation) {
    if (typeof conversation.totalCost !== 'number') {
        conversation.totalCost = 0;
    }
    if (typeof conversation.totalInputTokens !== 'number') {
        conversation.totalInputTokens = 0;
    }
    if (typeof conversation.totalOutputTokens !== 'number') {
        conversation.totalOutputTokens = 0;
    }
    if (!conversation.modelUsage || typeof conversation.modelUsage !== 'object') {
        conversation.modelUsage = {};
    }
}

function updateConversationTitle(conversation) {
    if (conversation.messages.length === 1 && conversation.title === 'New Chat') {
        const firstMessage = conversation.messages[0].content;
        conversation.title = firstMessage.substring(0, 40) + (firstMessage.length > 40 ? '...' : '');
        saveToLocalStorage();
        renderConversationsList();
    }
}

function handleModelChange() {
    const conversation = getCurrentConversation();
    if (conversation) {
        conversation.model = document.getElementById('modelSelect').value;
        saveToLocalStorage();
    }
}

function enableTitleEdit(conversationId, event) {
    event.stopPropagation();
    
    const titleElement = document.getElementById(`title-${conversationId}`);
    if (!titleElement) return;
    
    const conversation = state.conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    const currentTitle = conversation.title;
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTitle;
    input.className = 'title-edit-input';
    
    // Handle save
    const saveTitle = () => {
        const newTitle = input.value.trim();
        if (newTitle && newTitle !== currentTitle) {
            conversation.title = newTitle;
            saveToLocalStorage();
        }
        renderConversationsList();
    };
    
    // Event listeners
    input.addEventListener('blur', saveTitle);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveTitle();
        } else if (e.key === 'Escape') {
            renderConversationsList();
        }
        e.stopPropagation();
    });
    
    // Replace title with input
    titleElement.innerHTML = '';
    titleElement.appendChild(input);
    input.focus();
    input.select();
}

// ============================================
// RENDERING FUNCTIONS
// ============================================
function renderConversationsList() {
    const container = document.getElementById('conversationsList');
    
    if (state.conversations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">No conversations yet</p>';
        return;
    }
    
    container.innerHTML = state.conversations.map(conv => {
        ensureConversationMetrics(conv);
        const totalTokens = conv.totalInputTokens + conv.totalOutputTokens;
        const metaParts = [
            formatDate(conv.createdAt),
            getModelDisplayName(conv.model),
            `${formatTokenCount(totalTokens)} tokens`,
            `$${conv.totalCost.toFixed(4)}`
        ];
        return `
        <div class="conversation-item ${conv.id === state.currentConversationId ? 'active' : ''}" 
             onclick="loadConversation('${conv.id}')">
            <div style="flex: 1; overflow: hidden;">
                <div class="conversation-title" id="title-${conv.id}">${escapeHtml(conv.title)}</div>
                <div class="conversation-meta">${metaParts.join(' • ')}</div>
            </div>
            <button class="edit-title-btn" onclick="enableTitleEdit('${conv.id}', event)" title="Edit title">✏️</button>
            <button class="delete-conv-btn" onclick="requestDeleteConversation('${conv.id}', event)" title="Delete">🗑️</button>
        </div>
    `;
    }).join('');
}

function renderMessages() {
    const container = document.getElementById('messagesContainer');
    const conversation = getCurrentConversation();
    
    if (!conversation || conversation.messages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <h2>Start a Conversation</h2>
                <p>Select a model and type your message below to begin chatting with an AI assistant.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = conversation.messages.map((msg, index) => {
        let roleLabel = 'You';
        
        if (msg.role === 'assistant') {
            // Get system prompt title
            const systemPrompt = systemPrompts.find(p => p.id === msg.systemPromptId);
            const promptTitle = systemPrompt ? systemPrompt.title : 'None';
            
            // Get model name
            const modelName = msg.model || conversation.model;
            
            // Format: "System Prompt Title) Model Name"
            roleLabel = `${modelName} (${promptTitle}) `;
        }
        
        // Add a unique id to each message for scrolling purposes
        const messageId = `message-${index}`;
        
        // Enhance assistant messages with download links if applicable
        let messageContent = msg.content;
        if (msg.role === 'assistant') {
            messageContent = enhanceMessageWithDownloads(messageContent);
        } else {
            messageContent = formatMessageContent(messageContent);
        }
        
        return `
            <div class="message ${msg.role}" id="${messageId}">
                <div class="message-role">${roleLabel}</div>
                <div class="message-content">${messageContent}</div>
            </div>
        `;
    }).join('');
    
    scrollToBottom();
}

function formatMessageContent(content) {
    // Escape HTML first
    let formatted = escapeHtml(content);
    
    // Format code blocks with syntax highlighting
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'text';
        const highlighted = highlightSyntax(code.trim(), language);
        const blockId = 'code_' + Math.random().toString(36).substr(2, 9);
        return `<div class="code-block-header">
            <span class="code-block-lang">${language}</span>
            <button class="copy-code-btn" onclick="copyCode('${blockId}')">Copy</button>
        </div>
        <pre class="code-block with-header" id="${blockId}">${highlighted}</pre>`;
    });
    
    // Format inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>');
    
    // Format bold text
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Format italic text
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    return formatted;
}

function highlightSyntax(code, language) {
    // Simple regex-based syntax highlighting
    let highlighted = code;
    
    // Keywords for common languages
    const keywords = [
        'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return',
        'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch',
        'throw', 'new', 'this', 'super', 'extends', 'static', 'public', 'private',
        'protected', 'interface', 'type', 'enum', 'namespace', 'module', 'declare',
        'def', 'print', 'True', 'False', 'None', 'lambda', 'with', 'as', 'pass',
        'break', 'continue', 'elif', 'except', 'finally', 'raise', 'yield', 'in',
        'not', 'and', 'or', 'is', 'assert', 'global', 'nonlocal', 'del'
    ];
    
    // Highlight strings (single and double quotes)
    highlighted = highlighted.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, 
        '<span class="syntax-string">$1$2$1</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*$|#.*$)/gm, 
        '<span class="syntax-comment">$1</span>');
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, 
        '<span class="syntax-comment">$1</span>');
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, 
        '<span class="syntax-number">$1</span>');
    
    // Highlight keywords
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="syntax-keyword">$1</span>');
    });
    
    // Highlight function calls
    highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, 
        '<span class="syntax-function">$1</span>(');
    
    return highlighted;
}

function copyCode(blockId) {
    const codeBlock = document.getElementById(blockId);
    if (codeBlock) {
        const text = codeBlock.innerText;
        navigator.clipboard.writeText(text).then(() => {
            // Find the button and update temporarily
            const btn = codeBlock.previousElementSibling.querySelector('.copy-code-btn');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                setTimeout(() => { btn.innerText = originalText; }, 2000);
            }
        });
    }
}

function showLoadingIndicator() {
    const container = document.getElementById('messagesContainer');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = `
        <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <span style="color: var(--text-muted); font-size: 13px;">Generating response...</span>
    `;
    container.appendChild(loadingDiv);
    scrollToBottom();
}

function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function scrollToBottom() {
    const container = document.getElementById('messagesContainer');
    container.scrollTop = container.scrollHeight;
}

function scrollToLastAssistantMessage() {
    const conversation = getCurrentConversation();
    if (!conversation || conversation.messages.length === 0) return;
    
    // Find the index of the last assistant message
    let lastAssistantIndex = -1;
    for (let i = conversation.messages.length - 1; i >= 0; i--) {
        if (conversation.messages[i].role === 'assistant') {
            lastAssistantIndex = i;
            break;
        }
    }
    
    if (lastAssistantIndex === -1) return;
    
    // Scroll to the top of that message
    const messageElement = document.getElementById(`message-${lastAssistantIndex}`);
    if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateCostDisplay() {
    const conversation = getCurrentConversation();
    const cost = conversation ? conversation.totalCost : 0;
    document.getElementById('costDisplay').textContent = `$${cost.toFixed(4)}`;
}

function formatTokenCount(count) {
    if (count >= 1000000) return `${(count / 1000000).toFixed(2)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return `${count}`;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

function getModelDisplayName(modelId) {
    const catalogLabel = findCatalogLabel(modelId);
    if (catalogLabel) return catalogLabel;

    const names = {
        'llama3.1': 'Llama 3.1 (Ollama)',
        'llama3': 'Llama 3 (Ollama)',
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
        'o1': 'o1',
        'gpt-5.2': 'GPT-5.2',
        'gpt-5-mini': 'GPT-5 Mini',
        'gpt-5-nano': 'GPT-5 Nano',
        'gemini-1.5-pro': 'Gemini 1.5 Pro',
        'gemini-1.5-flash': 'Gemini 1.5 Flash',
        'gemini-2.0-flash': 'Gemini 2.0 Flash',
        'gemini-3-flash-preview': 'Gemini 3.5 Flash Preview',
        'gemini-3-pro-preview': 'Gemini 3.5 Pro Preview'
    };
    if (names[modelId]) return names[modelId];
    return modelId
        .replace(/models\//g, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

function findCatalogLabel(modelId) {
    if (!state.availableModels) return null;
    const providers = Object.values(state.availableModels);
    for (const models of providers) {
        const match = (models || []).find(model => model.id === modelId);
        if (match?.label) return match.label;
    }
    return null;
}

function findProviderForModel(modelId) {
    if (!state.availableModels) return null;
    for (const [provider, models] of Object.entries(state.availableModels)) {
        const hasMatch = (models || []).some(model => {
            if (typeof model === 'string') return model === modelId;
            return model?.id === modelId;
        });
        if (hasMatch) return provider;
    }
    return null;
}

function getProvider(modelId) {
    const catalogProvider = findProviderForModel(modelId);
    if (catalogProvider) return catalogProvider;
    if (modelId === 'llama3.1' || modelId === 'llama3' || modelId.startsWith('ollama/')) return 'ollama';
    if (modelId.startsWith('deepseek')) return 'deepseek';
    if (modelId.startsWith('grok')) return 'grok';
    if (modelId.startsWith('claude')) return 'anthropic';
    if (modelId.startsWith('gpt') || /^o\d/.test(modelId)) return 'openai';
    if (modelId.startsWith('gemini')) return 'gemini';
    return null;
}

function estimateTokens(text) {
    // Approximate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

function calculateCost(inputTokens, outputTokens, modelId) {
    const pricing = PRICING_TABLE[modelId];
    if (!pricing) return 0;
    
    const inputCost = (inputTokens / 1000000) * pricing.input;
    const outputCost = (outputTokens / 1000000) * pricing.output;
    
    return inputCost + outputCost;
}

// ============================================
// CSV/EXCEL CONVERSION & DOWNLOAD FUNCTIONS
// ============================================

/**
 * Convert JSON data to CSV format
 * @param {Array} data - Array of objects to convert
 * @returns {string} CSV formatted string
 */
function convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header] || '';
                // Escape values containing commas or quotes
                return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                    ? `"${value.replace(/"/g, '""')}"`
                    : value;
            }).join(',')
        )
    ].join('\n');
    
    return csvContent;
}

/**
 * Convert JSON data to Excel format using SheetJS
 * @param {Array} data - Array of objects to convert
 * @param {string} sheetName - Name of the Excel sheet
 * @returns {ArrayBuffer|null} Excel file data or null if library not loaded
 */
function convertToExcel(data, sheetName = 'Sheet1') {
    const XLSX = window.XLSX;
    if (!XLSX) {
        console.error('SheetJS library not loaded');
        return null;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}

/**
 * Create a styled download link for a file
 * @param {string|ArrayBuffer} data - File data
 * @param {string} filename - Name of the file to download
 * @param {string} mimeType - MIME type of the file
 * @returns {HTMLAnchorElement} Download link element
 */
function createDownloadLink(data, filename, mimeType) {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.textContent = `Download ${filename}`;
    link.style.display = 'inline-block';
    link.style.padding = '8px 16px';
    link.style.backgroundColor = 'var(--accent-color)';
    link.style.color = 'white';
    link.style.textDecoration = 'none';
    link.style.borderRadius = '4px';
    link.style.margin = '5px';
    link.style.cursor = 'pointer';
    link.style.fontSize = '14px';
    link.style.fontWeight = '500';
    link.style.transition = 'all 0.2s ease';
    
    link.addEventListener('mouseover', function() {
        this.style.opacity = '0.9';
        this.style.transform = 'translateY(-1px)';
    });
    
    link.addEventListener('mouseout', function() {
        this.style.opacity = '1';
        this.style.transform = 'translateY(0)';
    });
    
    link.addEventListener('click', function() {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    
    return link;
}

/**
 * Generate download links for CSV and Excel formats
 * @param {Array} data - Array of objects to convert
 * @param {string} baseFilename - Base name for the files
 * @returns {HTMLDivElement} Container with download links
 */
function generateDownloadLinks(data, baseFilename = 'data') {
    const container = document.createElement('div');
    container.className = 'download-links-container';
    container.style.margin = '10px 0';
    container.style.padding = '12px';
    container.style.backgroundColor = 'var(--sidebar-bg)';
    container.style.borderRadius = '8px';
    container.style.border = '1px solid var(--border-color)';
    
    const title = document.createElement('div');
    title.textContent = '📥 Download Options:';
    title.style.marginBottom = '8px';
    title.style.fontWeight = '600';
    title.style.fontSize = '14px';
    title.style.color = 'var(--text-color)';
    container.appendChild(title);
    
    const linksWrapper = document.createElement('div');
    linksWrapper.style.display = 'flex';
    linksWrapper.style.flexWrap = 'wrap';
    linksWrapper.style.gap = '8px';
    
    // Create CSV download link
    const csvData = convertToCSV(data);
    const csvLink = createDownloadLink(csvData, `${baseFilename}.csv`, 'text/csv');
    linksWrapper.appendChild(csvLink);
    
    // Create Excel download link if SheetJS is available
    if (window.XLSX) {
        const excelData = convertToExcel(data);
        if (excelData) {
            const excelLink = createDownloadLink(
                excelData,
                `${baseFilename}.xlsx`,
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            linksWrapper.appendChild(excelLink);
        }
    }
    
    container.appendChild(linksWrapper);
    return container;
}

/**
 * Extract structured data from LLM response text
 * Attempts to find JSON arrays or table-like data
 * @param {string} text - Response text to parse
 * @returns {Array|null} Extracted data array or null
 */
function extractDataFromResponse(text) {
    // Try to find JSON arrays in the text
    const jsonArrayRegex = /\[\s*\{[\s\S]*?\}\s*\]/g;
    const matches = text.match(jsonArrayRegex);
    
    if (matches) {
        for (const match of matches) {
            try {
                const data = JSON.parse(match);
                if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
                    return data;
                }
            } catch (e) {
                // Continue to next match
            }
        }
    }
    
    return null;
}

/**
 * Check if a message mentions CSV/Excel conversion
 * @param {string} content - Message content
 * @returns {boolean} True if conversion is mentioned
 */
function mentionsDataConversion(content) {
    const lowerContent = content.toLowerCase();
    const conversionKeywords = [
        'csv', 'excel', 'spreadsheet', 'download',
        'export', 'table', 'xlsx'
    ];
    
    return conversionKeywords.some(keyword => lowerContent.includes(keyword));
}

/**
 * Enhance message content with download links if structured data is detected
 * @param {string} content - Original message content
 * @returns {string} Enhanced content with download links
 */
function enhanceMessageWithDownloads(content) {
    // Check if message mentions data conversion
    if (!mentionsDataConversion(content)) {
        return content;
    }
    
    // Try to extract structured data
    const extractedData = extractDataFromResponse(content);
    
    if (extractedData && extractedData.length > 0) {
        // Generate a unique filename based on timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const baseFilename = `export_${timestamp}`;
        
        // Create a wrapper div for the enhanced content
        const wrapper = document.createElement('div');
        
        // Add the original content
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = formatMessageContent(content);
        wrapper.appendChild(contentDiv);
        
        // Add download links
        const downloadLinks = generateDownloadLinks(extractedData, baseFilename);
        wrapper.appendChild(downloadLinks);
        
        return wrapper.innerHTML;
    }
    
    return content;
}

// ============================================
// SYSTEM PROMPTS FUNCTIONS
// ============================================
function loadSystemPromptsFromStorage() {
    const saved = localStorage.getItem('llm_chatbot_system_prompts');
    if (saved) {
        try {
            systemPrompts = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading system prompts:', e);
            systemPrompts = [...DEFAULT_SYSTEM_PROMPTS];
        }
    }
}

function saveSystemPromptsToStorage() {
    localStorage.setItem('llm_chatbot_system_prompts', JSON.stringify(systemPrompts));
}

function renderSystemPromptSelector() {
    const select = document.getElementById('systemPromptSelect');
    select.innerHTML = systemPrompts.map(prompt => 
        `<option value="${prompt.id}" ${prompt.id === state.currentSystemPromptId ? 'selected' : ''}>${prompt.title}</option>`
    ).join('');
}

// ============================================
// MODEL SELECTOR FUNCTIONS
// ============================================
async function initModelSelector() {
    const select = document.getElementById('modelSelect');
    if (!select) return;

    const currentModel = getCurrentConversation()?.model || null;
    const cachedCatalog = getCachedModelCatalog();

    if (cachedCatalog) {
        state.availableModels = cachedCatalog;
        renderModelSelector(cachedCatalog, currentModel);
    }

    const catalog = await fetchAvailableModels();
    if (catalog) {
        state.availableModels = catalog;
        setCachedModelCatalog(catalog);
        renderModelSelector(catalog, currentModel);
    } else if (!cachedCatalog) {
        state.availableModels = DEFAULT_MODELS;
        renderModelSelector(DEFAULT_MODELS, currentModel);
    }
}

function getCachedModelCatalog() {
    const raw = localStorage.getItem(MODEL_CACHE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        if (!parsed?.timestamp || !parsed?.catalog) return null;
        if (Date.now() - parsed.timestamp > MODEL_CACHE_TTL_MS) return null;
        return parsed.catalog;
    } catch (error) {
        console.warn('Failed to parse cached model catalog:', error);
        return null;
    }
}

function setCachedModelCatalog(catalog) {
    localStorage.setItem(MODEL_CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        catalog
    }));
}

function renderModelSelector(catalog, selectedModelId) {
    const select = document.getElementById('modelSelect');
    if (!select) return;

    const normalized = normalizeModelCatalog(catalog);
    const providerOrder = ['ollama', 'deepseek', 'grok', 'anthropic', 'openai', 'gemini'];
    let optionsHtml = '';

    providerOrder.forEach(provider => {
        // Skip providers without API keys (except ollama which doesn't require one)
        if (!hasApiKeyForProvider(provider)) return;
        
        const models = normalized[provider] || [];
        if (!models.length) return;

        optionsHtml += `<optgroup label="${PROVIDER_LABELS[provider]}">`;
        optionsHtml += models.map(model => {
            const label = escapeHtml(model.label || getModelDisplayName(model.id));
            return `<option value="${model.id}">${label}</option>`;
        }).join('');
        optionsHtml += '</optgroup>';
    });

    if (!optionsHtml) {
        optionsHtml = '<option value="" disabled>No models available - please configure API keys</option>';
    }

    select.innerHTML = optionsHtml;

    if (selectedModelId) {
        select.value = selectedModelId;
    }

    if (!select.value && select.options.length > 0) {
        select.value = select.options[0].value;
    }

    const conversation = getCurrentConversation();
    if (conversation && conversation.model !== select.value) {
        conversation.model = select.value;
        saveToLocalStorage();
    }
}

function normalizeModelCatalog(catalog) {
    const normalized = {
        ollama: [],
        deepseek: [],
        grok: [],
        anthropic: [],
        openai: [],
        gemini: []
    };

    Object.keys(normalized).forEach(provider => {
        const models = catalog?.[provider] || [];
        normalized[provider] = models
            .map(model => {
                if (typeof model === 'string') {
                    return { id: model, label: getModelDisplayName(model) };
                }
                return { id: model.id, label: model.label || getModelDisplayName(model.id) };
            })
            .filter(model => isChatModelForProvider(provider, model.id));
    });

    return normalized;
}

function isChatModelForProvider(provider, modelId) {
    if (!modelId) return false;
    switch (provider) {
        case 'ollama':
            return !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
        case 'deepseek':
            return modelId.startsWith('deepseek') && !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
        case 'grok':
            return modelId.startsWith('grok') && !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
        case 'anthropic':
            return modelId.startsWith('claude') && !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
        case 'openai':
            return isOpenAIChatCompletionsModel(modelId);
        case 'gemini':
            return modelId.startsWith('gemini') && !TEXT_ONLY_MODEL_EXCLUDE.test(modelId);
        default:
            return false;
    }
}

function isOpenAIChatCompletionsModel(modelId) {
    if (!modelId || !modelId.startsWith('gpt-')) return false;
    if (TEXT_ONLY_MODEL_EXCLUDE.test(modelId)) return false;
    return OPENAI_CHAT_COMPLETIONS_PREFIXES.some(prefix => modelId.startsWith(prefix));
}

async function fetchAvailableModels() {
    const catalog = {
        ollama: [],
        deepseek: [],
        grok: [],
        anthropic: [],
        openai: [],
        gemini: []
    };

    const hasDeepSeekKey = GLOBAL_CONFIG.apiKeys.deepseek && GLOBAL_CONFIG.apiKeys.deepseek !== 'YOUR_DEEPSEEK_API_KEY';
    const hasGrokKey = GLOBAL_CONFIG.apiKeys.grok && GLOBAL_CONFIG.apiKeys.grok !== 'YOUR_GROK_API_KEY';
    const hasAnthropicKey = GLOBAL_CONFIG.apiKeys.anthropic && GLOBAL_CONFIG.apiKeys.anthropic !== 'YOUR_ANTHROPIC_API_KEY';
    const hasOpenAIKey = GLOBAL_CONFIG.apiKeys.openai && GLOBAL_CONFIG.apiKeys.openai !== 'YOUR_OPENAI_API_KEY';
    const hasGeminiKey = GLOBAL_CONFIG.apiKeys.gemini && GLOBAL_CONFIG.apiKeys.gemini !== 'YOUR_GEMINI_API_KEY';

    try {
        const response = await fetch(GLOBAL_CONFIG.endpoints.ollamaModels);
        if (response.ok) {
            const data = await response.json();
            catalog.ollama = (data.data || [])
                .map(model => ({
                    id: model.id,
                    label: model.id
                }));
        }
    } catch (error) {
        console.warn('Ollama models fetch failed:', error);
    }

    try {
        if (hasDeepSeekKey) {
            const response = await fetch(GLOBAL_CONFIG.endpoints.deepseekModels, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GLOBAL_CONFIG.apiKeys.deepseek}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                catalog.deepseek = (data.data || [])
                    .map(model => ({
                        id: model.id,
                        label: model.id
                    }));
            }
        }
    } catch (error) {
        console.warn('DeepSeek models fetch failed:', error);
    }

    try {
        if (hasGrokKey) {
            const response = await fetch(GLOBAL_CONFIG.endpoints.grokModels, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GLOBAL_CONFIG.apiKeys.grok}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                catalog.grok = (data.data || [])
                    .map(model => ({
                        id: model.id,
                        label: model.id
                    }));
            }
        }
    } catch (error) {
        console.warn('Grok models fetch failed:', error);
    }

    try {
        if (hasAnthropicKey) {
            const response = await fetch(GLOBAL_CONFIG.endpoints.anthropicModels, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': GLOBAL_CONFIG.apiKeys.anthropic,
                    'anthropic-version': '2023-06-01'
                }
            });

            if (response.ok) {
                const data = await response.json();
                catalog.anthropic = (data.data || [])
                    .filter(model => model.id?.startsWith('claude'))
                    .map(model => ({
                        id: model.id,
                        label: model.display_name || model.id
                    }));
            }
        }
    } catch (error) {
        console.warn('Anthropic models fetch failed:', error);
    }

    try {
        if (hasOpenAIKey) {
            const response = await fetch(GLOBAL_CONFIG.endpoints.openaiModels, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GLOBAL_CONFIG.apiKeys.openai}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                catalog.openai = (data.data || [])
                    .map(model => model.id)
                    .filter(id => isOpenAIChatCompletionsModel(id))
                    .map(id => ({ id, label: getModelDisplayName(id) }));
            }
        }
    } catch (error) {
        console.warn('OpenAI models fetch failed:', error);
    }

    try {
        if (hasGeminiKey) {
            const response = await fetch(`${GLOBAL_CONFIG.endpoints.gemini}?key=${GLOBAL_CONFIG.apiKeys.gemini}`);
            if (response.ok) {
                const data = await response.json();
                catalog.gemini = (data.models || [])
                    .filter(model => (model.supportedGenerationMethods || []).includes('generateContent'))
                    .map(model => {
                        const id = model.name?.replace('models/', '');
                        return {
                            id,
                            label: model.displayName || id
                        };
                    })
                    .filter(model => model.id && model.id.startsWith('gemini'));
            }
        }
    } catch (error) {
        console.warn('Gemini models fetch failed:', error);
    }

    const hasAny = Object.values(catalog).some(list => list.length > 0);
    if (!hasAny) {
        return null;
    }

    return mergeCatalogWithDefaults(catalog);
}

function mergeCatalogWithDefaults(catalog) {
    const merged = { ...catalog };
    Object.keys(DEFAULT_MODELS).forEach(provider => {
        // Only include default models for providers with API keys
        if (hasApiKeyForProvider(provider) && (!merged[provider] || merged[provider].length === 0)) {
            merged[provider] = DEFAULT_MODELS[provider];
        }
    });
    return merged;
}

// Helper function to check if a provider has an API key configured
function hasApiKeyForProvider(provider) {
    switch (provider) {
        case 'ollama':
            return true; // Ollama doesn't require an API key
        case 'deepseek':
            return GLOBAL_CONFIG.apiKeys.deepseek && GLOBAL_CONFIG.apiKeys.deepseek !== 'YOUR_DEEPSEEK_API_KEY';
        case 'grok':
            return GLOBAL_CONFIG.apiKeys.grok && GLOBAL_CONFIG.apiKeys.grok !== 'YOUR_GROK_API_KEY';
        case 'anthropic':
            return GLOBAL_CONFIG.apiKeys.anthropic && GLOBAL_CONFIG.apiKeys.anthropic !== 'YOUR_ANTHROPIC_API_KEY';
        case 'openai':
            return GLOBAL_CONFIG.apiKeys.openai && GLOBAL_CONFIG.apiKeys.openai !== 'YOUR_OPENAI_API_KEY';
        case 'gemini':
            return GLOBAL_CONFIG.apiKeys.gemini && GLOBAL_CONFIG.apiKeys.gemini !== 'YOUR_GEMINI_API_KEY';
        default:
            return false;
    }
}

function handleSystemPromptChange() {
    state.currentSystemPromptId = document.getElementById('systemPromptSelect').value;
    saveToLocalStorage();
}

function getCurrentSystemPrompt() {
    const prompt = systemPrompts.find(p => p.id === state.currentSystemPromptId);
    return prompt ? prompt.prompt : '';
}

function showSystemPromptsModal() {
    renderSystemPromptsEditor();
    document.getElementById('systemPromptsModal').classList.add('active');
}

function closeSystemPromptsModal() {
    document.getElementById('systemPromptsModal').classList.remove('active');
}

function renderSystemPromptsEditor() {
    const container = document.getElementById('systemPromptsContainer');
    container.innerHTML = systemPrompts.map((prompt, index) => `
        <div class="system-prompt-item">
            <div class="system-prompt-header">
                <input type="text" 
                       class="form-group" 
                       style="margin: 0; flex: 1; margin-right: 10px;"
                       value="${escapeHtml(prompt.title)}" 
                       placeholder="Prompt Title"
                       data-index="${index}"
                       data-field="title"
                       onchange="updateSystemPromptField(${index}, 'title', this.value)">
                ${prompt.id !== 'none' ? `<button class="delete-prompt-btn" onclick="deleteSystemPrompt(${index})">Delete</button>` : ''}
            </div>
            <textarea 
                placeholder="System prompt text..."
                data-index="${index}"
                data-field="prompt"
                onchange="updateSystemPromptField(${index}, 'prompt', this.value)"
                ${prompt.id === 'none' ? 'disabled' : ''}
            >${escapeHtml(prompt.prompt)}</textarea>
        </div>
    `).join('');
}

function updateSystemPromptField(index, field, value) {
    if (systemPrompts[index]) {
        systemPrompts[index][field] = value;
    }
}

function addNewSystemPrompt() {
    const newId = 'custom_' + Date.now();
    systemPrompts.push({
        id: newId,
        title: 'New Custom Prompt',
        prompt: ''
    });
    renderSystemPromptsEditor();
}

function deleteSystemPrompt(index) {
    if (systemPrompts[index] && systemPrompts[index].id !== 'none') {
        const promptId = systemPrompts[index].id;
        systemPrompts.splice(index, 1);
        
        // If the deleted prompt was selected, switch to 'none'
        if (state.currentSystemPromptId === promptId) {
            state.currentSystemPromptId = 'none';
            saveToLocalStorage();
        }
        
        renderSystemPromptsEditor();
    }
}

function saveSystemPrompts() {
    saveSystemPromptsToStorage();
    renderSystemPromptSelector();
    closeSystemPromptsModal();
    showSuccessToast('System prompts saved successfully!');
}

// ============================================
// INPUT HANDLING
// ============================================
function handleKeyDown(event) {
    if (event.key === 'Enter') {
        event.stopPropagation();
    }
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

// ============================================
// API FUNCTIONS
// ============================================
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const message = input.value.trim();
    
    if (!message || state.isLoading) return;
    
    const conversation = getCurrentConversation();
    if (!conversation) return;
    
    // Add user message
    conversation.messages.push({
        role: 'user',
        content: message
    });
    
    updateConversationTitle(conversation);
    saveToLocalStorage();
    renderMessages();
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Set loading state
    state.isLoading = true;
    sendBtn.disabled = true;
    showLoadingIndicator();
    
    try {
        const provider = getProvider(conversation.model);
        let response;
        
        switch (provider) {
            case 'ollama':
                response = await callOllamaAPI(conversation);
                break;
            case 'deepseek':
                response = await callDeepSeekAPI(conversation);
                break;
            case 'grok':
                response = await callGrokAPI(conversation);
                break;
            case 'anthropic':
                response = await callAnthropicAPI(conversation);
                break;
            case 'openai':
                response = await callOpenAIAPI(conversation);
                break;
            case 'gemini':
                response = await callGeminiAPI(conversation);
                break;
            default:
                throw new Error('Unknown provider');
        }
        
        // Add assistant message
        conversation.messages.push({
            role: 'assistant',
            content: response.content,
            model: conversation.model,
            systemPromptId: state.currentSystemPromptId
        });
        
        // Calculate and update cost using actual usage if available, otherwise estimate
        let inputTokens, outputTokens;
        
        if (response.usage) {
            inputTokens = response.usage.input_tokens;
            outputTokens = response.usage.output_tokens;
        } else {
            // Fallback to estimation if usage data is missing
            inputTokens = estimateTokens(conversation.messages.slice(0, -1).map(m => m.content).join(''));
            outputTokens = estimateTokens(response.content);
        }
        
        const cost = calculateCost(inputTokens, outputTokens, conversation.model);
        const modelId = conversation.model;
        ensureConversationMetrics(conversation);
        conversation.totalCost += cost;
        conversation.totalInputTokens += inputTokens;
        conversation.totalOutputTokens += outputTokens;
        if (!conversation.modelUsage[modelId]) {
            conversation.modelUsage[modelId] = {
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0
            };
        }
        conversation.modelUsage[modelId].inputTokens += inputTokens;
        conversation.modelUsage[modelId].outputTokens += outputTokens;
        conversation.modelUsage[modelId].totalTokens += inputTokens + outputTokens;
        
        saveToLocalStorage();
        renderMessages();
        updateCostDisplay();
        renderConversationsList();
        
        // Scroll to the top of the last assistant response
        scrollToLastAssistantMessage();
        
    } catch (error) {
        console.error('API Error:', error);
        
        // Add error message
        conversation.messages.push({
            role: 'assistant',
            content: `Error: ${error.message}\n\nPlease check your API key and ensure CORS is properly configured. See Technical Notes for more information.`,
            model: conversation.model,
            systemPromptId: state.currentSystemPromptId
        });
        
        saveToLocalStorage();
        renderMessages();
        
        // Scroll to the top of the error message
        scrollToLastAssistantMessage();
    } finally {
        state.isLoading = false;
        sendBtn.disabled = false;
        hideLoadingIndicator();
    }
}

async function callAnthropicAPI(conversation) {
    const messages = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
    
    const systemPrompt = getCurrentSystemPrompt();
    const requestBody = {
        model: conversation.model,
        max_tokens: GLOBAL_CONFIG.defaults.maxTokens,
        messages: messages
    };
    
    // Add system prompt if it exists
    if (systemPrompt) {
        requestBody.system = systemPrompt;
    }
    
    const response = await fetch(GLOBAL_CONFIG.endpoints.anthropic, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': GLOBAL_CONFIG.apiKeys.anthropic,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
        content: data.content[0].text,
        usage: {
            input_tokens: data.usage?.input_tokens || 0,
            output_tokens: data.usage?.output_tokens || 0
        }
    };
}

async function callOpenAIAPI(conversation) {
    const messages = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
    
    // Add system prompt as the first message if it exists
    const systemPrompt = getCurrentSystemPrompt();
    if (systemPrompt) {
        messages.unshift({
            role: 'system',
            content: systemPrompt
        });
    }
    
    const response = await fetch(GLOBAL_CONFIG.endpoints.openai, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GLOBAL_CONFIG.apiKeys.openai}`
        },
        body: JSON.stringify({
            model: conversation.model,
            max_completion_tokens: GLOBAL_CONFIG.defaults.maxTokens,
            messages: messages
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
        content: data.choices[0].message.content,
        usage: {
            input_tokens: data.usage?.prompt_tokens || 0,
            output_tokens: data.usage?.completion_tokens || 0
        }
    };
}

async function callDeepSeekAPI(conversation) {
    const messages = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    const systemPrompt = getCurrentSystemPrompt();
    if (systemPrompt) {
        messages.unshift({
            role: 'system',
            content: systemPrompt
        });
    }

    const response = await fetch(GLOBAL_CONFIG.endpoints.deepseek, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GLOBAL_CONFIG.apiKeys.deepseek}`
        },
        body: JSON.stringify({
            model: conversation.model,
            max_tokens: GLOBAL_CONFIG.defaults.maxTokens,
            temperature: GLOBAL_CONFIG.defaults.temperature,
            messages: messages
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
        content: data.choices[0].message.content,
        usage: {
            input_tokens: data.usage?.prompt_tokens || 0,
            output_tokens: data.usage?.completion_tokens || 0
        }
    };
}

async function callGrokAPI(conversation) {
    const messages = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    const systemPrompt = getCurrentSystemPrompt();
    if (systemPrompt) {
        messages.unshift({
            role: 'system',
            content: systemPrompt
        });
    }

    const response = await fetch(GLOBAL_CONFIG.endpoints.grok, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GLOBAL_CONFIG.apiKeys.grok}`
        },
        body: JSON.stringify({
            model: conversation.model,
            max_tokens: GLOBAL_CONFIG.defaults.maxTokens,
            temperature: GLOBAL_CONFIG.defaults.temperature,
            messages: messages
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
        content: data.choices[0].message.content,
        usage: {
            input_tokens: data.usage?.prompt_tokens || 0,
            output_tokens: data.usage?.completion_tokens || 0
        }
    };
}

async function callOllamaAPI(conversation) {
    const messages = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    const systemPrompt = getCurrentSystemPrompt();
    if (systemPrompt) {
        messages.unshift({
            role: 'system',
            content: systemPrompt
        });
    }

    const response = await fetch(GLOBAL_CONFIG.endpoints.ollama, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: conversation.model,
            max_tokens: GLOBAL_CONFIG.defaults.maxTokens,
            temperature: GLOBAL_CONFIG.defaults.temperature,
            messages: messages
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
        content: data.choices[0].message.content,
        usage: {
            input_tokens: data.usage?.prompt_tokens || 0,
            output_tokens: data.usage?.completion_tokens || 0
        }
    };
}

async function callGeminiAPI(conversation) {
    const url = `${GLOBAL_CONFIG.endpoints.gemini}/${conversation.model}:generateContent?key=${GLOBAL_CONFIG.apiKeys.gemini}`;
    
    // Convert messages to Gemini format
    const contents = conversation.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));
    
    const systemPrompt = getCurrentSystemPrompt();
    const requestBody = {
        contents: contents,
        generationConfig: {
            maxOutputTokens: GLOBAL_CONFIG.defaults.maxTokens,
            temperature: GLOBAL_CONFIG.defaults.temperature
        }
    };
    
    // Add system instruction if it exists
    if (systemPrompt) {
        requestBody.systemInstruction = {
            parts: [{ text: systemPrompt }]
        };
    }
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
        content: data.candidates[0].content.parts[0].text,
        usage: {
            input_tokens: data.usageMetadata?.promptTokenCount || 0,
            output_tokens: data.usageMetadata?.candidatesTokenCount || 0
        }
    };
}

// ============================================
// MODAL FUNCTIONS
// ============================================
async function showTechNotesModal() {
    const modal = document.getElementById('techNotesModal');
    const contentDiv = modal.querySelector('.modal-content');
    
    try {
        // Fetch the markdown file
        const response = await fetch('technical-notes.md');
        const markdown = await response.text();
        
        // Convert markdown to HTML
        const html = convertMarkdownToHTML(markdown);
        contentDiv.innerHTML = html;
    } catch (error) {
        contentDiv.innerHTML = '<p style="color: var(--danger-color);">Failed to load technical notes. Please check if technical-notes.md exists.</p>';
    }
    
    modal.classList.add('active');
}

function closeTechNotesModal() {
    document.getElementById('techNotesModal').classList.remove('active');
}

// Markdown to HTML converter with proper spacing
function convertMarkdownToHTML(markdown) {
    // Split into lines for processing
    const lines = markdown.split('\n');
    let html = '';
    let inCodeBlock = false;
    let codeContent = '';
    let isFirstElement = true;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Handle code blocks
        if (trimmed.startsWith('```')) {
            if (inCodeBlock) {
                html += `<pre style="margin-top: 10px; margin-bottom: 20px;">${escapeHtml(codeContent.trim())}</pre>`;
                codeContent = '';
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
            continue;
        }
        
        if (inCodeBlock) {
            codeContent += line + '\n';
            continue;
        }
        
        // Skip empty lines
        if (!trimmed) {
            continue;
        }
        
        // Headers
        if (trimmed.startsWith('### ')) {
            const text = trimmed.substring(4);
            html += `<h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 14px;">${text}</h3>`;
            isFirstElement = false;
        } else if (trimmed.startsWith('## ')) {
            const text = trimmed.substring(3);
            html += `<h3 style="margin-top: 30px; margin-bottom: 12px;">${text}</h3>`;
            isFirstElement = false;
        } else if (trimmed.startsWith('# ')) {
            const text = trimmed.substring(2);
            const marginTop = isFirstElement ? '0' : '35px';
            html += `<h2 style="font-size: 18px; margin-top: ${marginTop}; margin-bottom: 15px; color: var(--text-primary);">${text}</h2>`;
            isFirstElement = false;
        } else {
            // Regular text - accumulate until we hit a blank line or heading
            let paragraph = trimmed;
            
            // Look ahead for continuation lines
            while (i + 1 < lines.length && lines[i + 1].trim() && 
                   !lines[i + 1].trim().startsWith('#') && 
                   !lines[i + 1].trim().startsWith('```')) {
                i++;
                paragraph += ' ' + lines[i].trim();
            }
            
            // Process inline markdown
            paragraph = paragraph.replace(/`([^`]+)`/g, '<code>$1</code>');
            paragraph = paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            paragraph = paragraph.replace(/\*([^*]+)\*/g, '<em>$1</em>');
            
            html += `<p>${paragraph}</p>`;
            isFirstElement = false;
        }
    }
    
    return html;
}

// Close modal on overlay click
document.getElementById('techNotesModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeTechNotesModal();
    }
});

// ============================================
// API KEYS MODAL FUNCTIONS
// ============================================
function showApiKeysModal() {
    // Load current keys into inputs
    document.getElementById('anthropicKeyInput').value = GLOBAL_CONFIG.apiKeys.anthropic !== 'YOUR_ANTHROPIC_API_KEY' ? GLOBAL_CONFIG.apiKeys.anthropic : '';
    document.getElementById('openaiKeyInput').value = GLOBAL_CONFIG.apiKeys.openai !== 'YOUR_OPENAI_API_KEY' ? GLOBAL_CONFIG.apiKeys.openai : '';
    document.getElementById('geminiKeyInput').value = GLOBAL_CONFIG.apiKeys.gemini !== 'YOUR_GEMINI_API_KEY' ? GLOBAL_CONFIG.apiKeys.gemini : '';
    const deepseekInput = document.getElementById('deepseekKeyInput');
    if (deepseekInput) {
        deepseekInput.value = GLOBAL_CONFIG.apiKeys.deepseek !== 'YOUR_DEEPSEEK_API_KEY' ? GLOBAL_CONFIG.apiKeys.deepseek : '';
    }
    const grokInput = document.getElementById('grokKeyInput');
    if (grokInput) {
        grokInput.value = GLOBAL_CONFIG.apiKeys.grok !== 'YOUR_GROK_API_KEY' ? GLOBAL_CONFIG.apiKeys.grok : '';
    }
    
    updateApiKeyStatuses();
    document.getElementById('apiKeysModal').classList.add('active');
}

function closeApiKeysModal() {
    document.getElementById('apiKeysModal').classList.remove('active');
}

function getInputValue(id) {
    const input = document.getElementById(id);
    return input ? input.value.trim() : '';
}

async function saveApiKeys() {
    const anthropicKey = getInputValue('anthropicKeyInput');
    const openaiKey = getInputValue('openaiKeyInput');
    const geminiKey = getInputValue('geminiKeyInput');
    const deepseekKey = getInputValue('deepseekKeyInput');
    const grokKey = getInputValue('grokKeyInput');
    
    // Update GLOBAL_CONFIG
    GLOBAL_CONFIG.apiKeys.anthropic = anthropicKey || 'YOUR_ANTHROPIC_API_KEY';
    GLOBAL_CONFIG.apiKeys.openai = openaiKey || 'YOUR_OPENAI_API_KEY';
    GLOBAL_CONFIG.apiKeys.gemini = geminiKey || 'YOUR_GEMINI_API_KEY';
    GLOBAL_CONFIG.apiKeys.deepseek = deepseekKey || 'YOUR_DEEPSEEK_API_KEY';
    GLOBAL_CONFIG.apiKeys.grok = grokKey || 'YOUR_GROK_API_KEY';
    
    // Save to localStorage
    localStorage.setItem('llm_chatbot_api_keys', JSON.stringify({
        anthropic: anthropicKey,
        openai: openaiKey,
        gemini: geminiKey,
        deepseek: deepseekKey,
        grok: grokKey
    }));
    
    updateApiKeyStatuses();
    closeApiKeysModal();
    showSuccessToast();
    
    // Refresh model selector to reflect new API keys
    await initModelSelector();
}

function loadApiKeysFromStorage() {
    const saved = localStorage.getItem('llm_chatbot_api_keys');
    if (saved) {
        const keys = JSON.parse(saved);
        if (keys.anthropic) GLOBAL_CONFIG.apiKeys.anthropic = keys.anthropic;
        if (keys.openai) GLOBAL_CONFIG.apiKeys.openai = keys.openai;
        if (keys.gemini) GLOBAL_CONFIG.apiKeys.gemini = keys.gemini;
        if (keys.deepseek) GLOBAL_CONFIG.apiKeys.deepseek = keys.deepseek;
        if (keys.grok) GLOBAL_CONFIG.apiKeys.grok = keys.grok;
    }
}

function updateApiKeyStatuses() {
    const deepseekConfigured = GLOBAL_CONFIG.apiKeys.deepseek && GLOBAL_CONFIG.apiKeys.deepseek !== 'YOUR_DEEPSEEK_API_KEY';
    const grokConfigured = GLOBAL_CONFIG.apiKeys.grok && GLOBAL_CONFIG.apiKeys.grok !== 'YOUR_GROK_API_KEY';
    const anthropicConfigured = GLOBAL_CONFIG.apiKeys.anthropic && GLOBAL_CONFIG.apiKeys.anthropic !== 'YOUR_ANTHROPIC_API_KEY';
    const openaiConfigured = GLOBAL_CONFIG.apiKeys.openai && GLOBAL_CONFIG.apiKeys.openai !== 'YOUR_OPENAI_API_KEY';
    const geminiConfigured = GLOBAL_CONFIG.apiKeys.gemini && GLOBAL_CONFIG.apiKeys.gemini !== 'YOUR_GEMINI_API_KEY';

    const deepseekStatus = document.getElementById('deepseekStatus');
    if (deepseekStatus) {
        deepseekStatus.className = `api-key-status ${deepseekConfigured ? 'configured' : 'missing'}`;
        deepseekStatus.textContent = deepseekConfigured ? '✓ Configured' : '✗ Not set';
    }

    const grokStatus = document.getElementById('grokStatus');
    if (grokStatus) {
        grokStatus.className = `api-key-status ${grokConfigured ? 'configured' : 'missing'}`;
        grokStatus.textContent = grokConfigured ? '✓ Configured' : '✗ Not set';
    }
    
    document.getElementById('anthropicStatus').className = `api-key-status ${anthropicConfigured ? 'configured' : 'missing'}`;
    document.getElementById('anthropicStatus').textContent = anthropicConfigured ? '✓ Configured' : '✗ Not set';
    
    document.getElementById('openaiStatus').className = `api-key-status ${openaiConfigured ? 'configured' : 'missing'}`;
    document.getElementById('openaiStatus').textContent = openaiConfigured ? '✓ Configured' : '✗ Not set';
    
    document.getElementById('geminiStatus').className = `api-key-status ${geminiConfigured ? 'configured' : 'missing'}`;
    document.getElementById('geminiStatus').textContent = geminiConfigured ? '✓ Configured' : '✗ Not set';
}

function showSuccessToast(message = 'API keys saved successfully!') {
    const toast = document.getElementById('successToast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close API Keys modal on overlay click
document.getElementById('apiKeysModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeApiKeysModal();
    }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTechNotesModal();
        closeApiKeysModal();
    }
});
