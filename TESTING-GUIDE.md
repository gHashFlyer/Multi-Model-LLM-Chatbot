# Testing Guide for Multiplication Operator Fix

## Quick Test
To verify the fix is working:

1. **Start a local server** (required for CORS with Ollama and proper file loading):
   ```bash
   cd /home/garen/Desktop/LLMChatbot
   python3 -m http.server 8000
   ```

2. **Open the chatbot** in your web browser:
   ```
   http://localhost:8000/index.html
   ```

3. **Configure an API key** (or use Ollama locally):
   - Click the ⚙️ settings icon (top right)
   - Enter your API key for any provider
   - Or ensure Ollama is running: `ollama serve`

4. **Test with this prompt**:
   ```
   I need a C# program to calculate the haversine distance in meters
   ```

5. **Verify the output includes**:
   - `Math.Sin(deltaLat / 2) * Math.Sin(deltaLat / 2)` (with visible `*`)
   - `Math.Cos(lat1Rad) * Math.Cos(lat2Rad)` (with visible `*`)
   - `2 * Math.Atan2(...)` (with visible `*`)
   - `EarthRadiusMeters * c` (with visible `*`)

## Alternative Test (Standalone)
Open the standalone test file:
```
http://localhost:8000/test-multiplication.html
```

This page demonstrates the fix without requiring an LLM API.

## Expected Behavior

### ✅ Code Blocks
Multiplication operators should be visible:
```csharp
double a = Math.Sin(x) * Math.Sin(y);  // ← asterisk visible
double b = 2 * Math.Atan2(a, b);       // ← asterisk visible
```

### ✅ Italic Text
Italic formatting should still work outside code:
- `This is *italic* text` → This is *italic* text

### ✅ Bold Text
Bold formatting should still work:
- `This is **bold** text` → This is **bold** text

## Common Issues

### Issue: Still seeing missing asterisks
**Solution**: Clear your browser cache:
- Chrome/Edge: `Ctrl+Shift+Delete` (Windows/Linux) or `Cmd+Shift+Delete` (Mac)
- Firefox: `Ctrl+Shift+Delete` (Windows/Linux) or `Cmd+Shift+Delete` (Mac)
- Or use Incognito/Private mode

### Issue: "CORS error" with Ollama
**Solution**: Set OLLAMA_ORIGINS environment variable:
```bash
export OLLAMA_ORIGINS=*
ollama serve
```

### Issue: File doesn't load properly
**Solution**: Make sure you're using a local server (http://localhost:8000) not opening the file directly (file:///...)

## Rollback Instructions
If you need to revert the changes:

1. The main change is in `script.js` in the `formatMessageContent()` function (lines 632-704)
2. A backup of the original would be in your git history if you committed before making changes
3. The key change is the code extraction phase - remove it and restore the original order

## Files Changed
- ✏️ `script.js` - Main fix applied here
- 📄 `test-multiplication.html` - Test page created
- 📘 `FIX-SUMMARY.md` - Technical documentation
- 📘 `TESTING-GUIDE.md` - This file
