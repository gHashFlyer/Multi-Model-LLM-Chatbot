// ============================================
// GLOBAL CONFIGURATION
// ============================================
const GLOBAL_CONFIG = {
    // API Keys - Replace with your actual API keys
    apiKeys: {
        anthropic: 'YOUR_ANTHROPIC_API_KEY',
        openai: 'YOUR_OPENAI_API_KEY',
        gemini: 'YOUR_GEMINI_API_KEY'
    },
    
    // API Endpoints
    endpoints: {
        anthropic: 'https://api.anthropic.com/v1/messages',
        openai: 'https://api.openai.com/v1/chat/completions',
        gemini: 'https://generativelanguage.googleapis.com/v1beta/models'
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
// APPLICATION STATE
// ============================================
let state = {
    conversations: [],
    currentConversationId: null,
    currentSystemPromptId: 'none',
    isLoading: false,
    theme: 'light'
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadApiKeysFromStorage();
    loadSystemPromptsFromStorage();
    loadFromLocalStorage();
    renderConversationsList();
    renderSystemPromptSelector();
    initTheme();
    
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

function deleteConversation(conversationId, event) {
    event.stopPropagation();
    
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

function getCurrentConversation() {
    return state.conversations.find(c => c.id === state.currentConversationId);
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
    
    container.innerHTML = state.conversations.map(conv => `
        <div class="conversation-item ${conv.id === state.currentConversationId ? 'active' : ''}" 
             onclick="loadConversation('${conv.id}')">
            <div style="flex: 1; overflow: hidden;">
                <div class="conversation-title" id="title-${conv.id}">${escapeHtml(conv.title)}</div>
                <div class="conversation-meta">${formatDate(conv.createdAt)} • ${getModelDisplayName(conv.model)}</div>
            </div>
            <button class="edit-title-btn" onclick="enableTitleEdit('${conv.id}', event)" title="Edit title">✏️</button>
            <button class="delete-conv-btn" onclick="deleteConversation('${conv.id}', event)" title="Delete">🗑️</button>
        </div>
    `).join('');
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
    
    container.innerHTML = conversation.messages.map(msg => `
        <div class="message ${msg.role}">
            <div class="message-role">${msg.role === 'user' ? 'You' : 'Assistant'}</div>
            <div class="message-content">${formatMessageContent(msg.content)}</div>
        </div>
    `).join('');
    
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

function updateCostDisplay() {
    const conversation = getCurrentConversation();
    const cost = conversation ? conversation.totalCost : 0;
    document.getElementById('costDisplay').textContent = `$${cost.toFixed(4)}`;
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
    const names = {
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
    return names[modelId] || modelId;
}

function getProvider(modelId) {
    if (modelId.startsWith('claude')) return 'anthropic';
    if (modelId.startsWith('gpt') || modelId === 'o1') return 'openai';
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
            content: response.content
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
        conversation.totalCost += cost;
        
        saveToLocalStorage();
        renderMessages();
        updateCostDisplay();
        
    } catch (error) {
        console.error('API Error:', error);
        
        // Add error message
        conversation.messages.push({
            role: 'assistant',
            content: `Error: ${error.message}\n\nPlease check your API key and ensure CORS is properly configured. See Technical Notes for more information.`
        });
        
        saveToLocalStorage();
        renderMessages();
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
    
    updateApiKeyStatuses();
    document.getElementById('apiKeysModal').classList.add('active');
}

function closeApiKeysModal() {
    document.getElementById('apiKeysModal').classList.remove('active');
}

function saveApiKeys() {
    const anthropicKey = document.getElementById('anthropicKeyInput').value.trim();
    const openaiKey = document.getElementById('openaiKeyInput').value.trim();
    const geminiKey = document.getElementById('geminiKeyInput').value.trim();
    
    // Update GLOBAL_CONFIG
    GLOBAL_CONFIG.apiKeys.anthropic = anthropicKey || 'YOUR_ANTHROPIC_API_KEY';
    GLOBAL_CONFIG.apiKeys.openai = openaiKey || 'YOUR_OPENAI_API_KEY';
    GLOBAL_CONFIG.apiKeys.gemini = geminiKey || 'YOUR_GEMINI_API_KEY';
    
    // Save to localStorage
    localStorage.setItem('llm_chatbot_api_keys', JSON.stringify({
        anthropic: anthropicKey,
        openai: openaiKey,
        gemini: geminiKey
    }));
    
    updateApiKeyStatuses();
    closeApiKeysModal();
    showSuccessToast();
}

function loadApiKeysFromStorage() {
    const saved = localStorage.getItem('llm_chatbot_api_keys');
    if (saved) {
        const keys = JSON.parse(saved);
        if (keys.anthropic) GLOBAL_CONFIG.apiKeys.anthropic = keys.anthropic;
        if (keys.openai) GLOBAL_CONFIG.apiKeys.openai = keys.openai;
        if (keys.gemini) GLOBAL_CONFIG.apiKeys.gemini = keys.gemini;
    }
}

function updateApiKeyStatuses() {
    const anthropicConfigured = GLOBAL_CONFIG.apiKeys.anthropic && GLOBAL_CONFIG.apiKeys.anthropic !== 'YOUR_ANTHROPIC_API_KEY';
    const openaiConfigured = GLOBAL_CONFIG.apiKeys.openai && GLOBAL_CONFIG.apiKeys.openai !== 'YOUR_OPENAI_API_KEY';
    const geminiConfigured = GLOBAL_CONFIG.apiKeys.gemini && GLOBAL_CONFIG.apiKeys.gemini !== 'YOUR_GEMINI_API_KEY';
    
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
