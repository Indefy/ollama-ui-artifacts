import { CodePayload } from '@/components/LiveUIPreview';
// Removed unused import: formatCodeWithPrettier

// import { analyzeAndOptimizeCode } from './codeOptimizer'; // Temporarily disabled

/**
 * Helper function to provide style-specific guidance based on user prompt
 */
function getStyleGuidance(userPrompt: string): string {
  const lowerPrompt = userPrompt.toLowerCase();
  
  if (lowerPrompt.includes('pip-boy') || lowerPrompt.includes('fallout')) {
    return `For Pip-Boy interfaces:
- Use amber/orange (#ffaa00) and green (#00ff00) monospaced text on dark backgrounds (#001100)
- Include scanlines, CRT-style effects with CSS animations (@keyframes)
- Use chunky, retro-futuristic button designs with beveled edges and text-shadow glow
- Add terminal-style borders (2-3px solid) and ASCII-like decorative elements
- Include status indicators, progress bars, and numerical displays with timestamps
- Use fonts like 'Share Tech Mono' or 'Courier New' with text-shadow glow effects
- Add subtle flickering animations, scanning effects, and power-on transitions
- Implement authentic terminal interactions (typing effects, command responses)`;
  }
  
  if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon')) {
    return `For Cyberpunk interfaces:
- Use neon colors (cyan #00ffff, magenta #ff00ff, electric blue #0080ff) with glow effects
- Include glitch effects, scan lines, and holographic appearances with CSS animations
- Add geometric shapes, hexagons, and circuit-like patterns using CSS borders/gradients
- Use dark backgrounds (#0a0a0a, #111) with bright, glowing accents and box-shadow
- Include animated elements suggesting data flow or system activity (moving gradients)`;
  }
  
  if (lowerPrompt.includes('retro') || lowerPrompt.includes('80s') || lowerPrompt.includes('vintage')) {
    return `For Retro/80s interfaces:
- Use pastel colors, gradients, and chrome-like metallic effects with CSS gradients
- Include grid patterns, geometric shapes, and angular designs
- Add scan lines, VHS-style noise, and analog display aesthetics
- Use bold, stylized typography with text outlines or 3D effects (text-shadow)`;
  }
  
  if (lowerPrompt.includes('glass') || lowerPrompt.includes('glassmorphism')) {
    return `For Glass/Glassmorphism interfaces:
- Use backdrop-filter: blur() with rgba backgrounds for transparency
- Add subtle borders with rgba(255,255,255,0.2) and border-radius
- Include soft shadows and light reflections with box-shadow
- Use semi-transparent backgrounds and layered elements`;
  }
  
  return `Focus on creating an authentic, detailed implementation with:
- Modern CSS features (flexbox, grid, animations, gradients)
- Responsive design with mobile-first approach
- Interactive elements with hover states and transitions
- Accessible markup with proper semantic HTML and ARIA attributes`;
}

/**
 * Creates an advanced system prompt for AI code generation
 */
function getAdvancedSystemPrompt(userPrompt: string, styleNotes: string): string {
  return `You MUST respond with ONLY a valid JSON object using this exact format:
{
  "html": "ESCAPED_HTML", 
  "css": "ESCAPED_CSS",
  "js": "ESCAPED_JS"
}

RULES:
1. Escape ALL special characters (newlines as \\n, quotes as \\")
2. No markdown, no explanations, no <think> tags
3. All strings MUST be properly escaped and quoted
4. No trailing commas
5. No comments

USER REQUEST: "${userPrompt}"
DESIGN GUIDANCE: ${styleNotes}`;
}

/**
 * Improved JSON Parser to sanitize malformed LLM responses
 */
export function parseAIResponse(rawResponse: string): { html: string; css: string; js: string } {
  console.log('[parseAIResponse] Raw response length:', rawResponse.length);
  
  // Step 1: Remove any non-JSON content
  const sanitized = rawResponse
    .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove LLM internal thinking sections
    .replace(/^\s*```(json)?/, '') // Remove markdown block start
    .replace(/```\s*$/, '') // Remove markdown block end
    .replace(/^[^{]*/, '') // Remove any text before the first {
    .replace(/}[^}]*$/, '}') // Remove any text after the last }
    .trim();

  // Step 2: Try to find a complete JSON object
  const jsonRegex = /(\{[\s\S]*?\})/g;
  const jsonMatches = [...sanitized.matchAll(jsonRegex)];
  
  let jsonBlock: string;
    // If no matches found, try more aggressive extraction
  if (jsonMatches.length === 0) {
    console.error('[parseAIResponse] No JSON block found in:', sanitized.substring(0, 200));
    const fallbackMatch = sanitized.match(/\{[\s\S]*\}/);
    
    if (!fallbackMatch) {
      throw new Error('No valid JSON block found in response');
    }
    
    console.log('[parseAIResponse] Using fallback JSON extraction');
    jsonBlock = fallbackMatch[0];
  } else {
    // Use the first match by default
    jsonBlock = jsonMatches[0][0];
  }
    // Step 3: Preprocess JSON to fix common issues
  const preprocessed = jsonBlock
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/'/g, '"') // Convert single quotes to double
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Quote unquoted keys
    .replace(/,\s*([}\])])/g, '$1') // Remove trailing commas
    .replace(/\n/g, '\\n') // Escape newlines
    .replace(/\r/g, '') // Remove carriage returns
    .replace(/\t/g, '\\t') // Escape tabs
    .replace(/\\"/g, '"') // Unescape quotes
    .trim();

  console.log('[parseAIResponse] Preprocessed JSON:', preprocessed.substring(0, 200) + '...');

  // Step 4: Attempt parsing with detailed error handling
  try {
    const parsed = JSON.parse(preprocessed);
    
    // Validate required fields
    if (!parsed.html || !parsed.css) {
      throw new Error('Response missing required html/css fields');
    }
    
    // Check for placeholder content
    const placeholders = [
      'ESCAPED_HTML', 'YOUR_ACTUAL_HTML_CODE_HERE',
      'ESCAPED_CSS', 'YOUR_ACTUAL_CSS_CODE_HERE',
      'ESCAPED_JS', 'YOUR_ACTUAL_JAVASCRIPT_CODE_HERE'
    ];
    
    const hasPlaceholder = placeholders.some(ph => 
      parsed.html.includes(ph) || 
      parsed.css.includes(ph) || 
      (parsed.js && parsed.js.includes(ph))
    );
    
    if (hasPlaceholder) {
      throw new Error('Response contains placeholder content');
    }
    
    return {
      html: parsed.html,
      css: parsed.css,
      js: parsed.js || ''
    };
    
  } catch (error) {
    console.error('[parseAIResponse] JSON parse error:', error);
    console.debug('[parseAIResponse] Failed JSON content:', preprocessed.substring(0, 500));
    
    // Attempt manual extraction as a last resort
    try {
      const htmlMatch = jsonBlock.match(/"html"[^"]*"([^"]+)"/);
      const cssMatch = jsonBlock.match(/"css"[^"]*"([^"]+)"/);
      const jsMatch = jsonBlock.match(/"js"[^"]*"([^"]+)"/);
      
      if (htmlMatch && cssMatch) {
        return {
          html: htmlMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
          css: cssMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
          js: jsMatch ? jsMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : ''
        };
      }
    } catch (extractError) {
      console.error('[parseAIResponse] Manual extraction failed:', extractError);
    }
    
    throw error;
  }
}

// Removed unused interface: GenerationResult

export async function generateUICode(
  prompt: string, 
  modelName: string = 'deepseek-r1:latest'
): Promise<CodePayload> {
  // Use the advanced system prompt with style guidance
  const systemPrompt = getAdvancedSystemPrompt(prompt, getStyleGuidance(prompt));  try {
    // Check if Ollama is available
    const isOllamaAvailable = await checkOllamaAvailability();
    if (!isOllamaAvailable) {
      console.warn('Ollama is not available, using fallback generation');
      return generateBasicUICode(prompt);
    }
    
    // Use the fetchWithTimeout utility with a 30-second timeout
    const response = await fetchWithTimeout('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: `${systemPrompt}\n\nUser Request: ${prompt}`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          stop: ['</json>', 'Human:', 'Assistant:']
        }
      })
    }, 30000);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }    const data = await response.json();
    let generatedText = data.response || '';
    
    // Helper function to clean response text
    const cleanResponse = (text: string) => {
      // Remove any <think> sections which are LLM self-reflection
      const withoutThink = text.replace(/<think>[\s\S]*?<\/think>/g, '');
      
      // Remove markdown code blocks
      const withoutMarkdown = withoutThink
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
        
      return withoutMarkdown;
    };
    
    generatedText = cleanResponse(generatedText);

    // Find the JSON object in the response
    const jsonRegex = /(\{[\s\S]*?\})/g;
    const jsonMatches = [...generatedText.matchAll(jsonRegex)];
    
    // Try each potential JSON match
    for (const match of jsonMatches) {
      try {
        const jsonStr = match[0]
          // Fix common JSON issues
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .replace(/([{,])\s*(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '$1"$3":') // Fix unquoted keys
          .replace(/:\s*'/g, ': "') // Replace single quotes with double quotes for values
          .replace(/'\s*(,|]|})/g, '"$1') // Replace closing single quotes with double quotes
          .replace(/\\'/g, "'") // Fix escaped single quotes
          .replace(/"\s*\+\s*"/g, ''); // Remove string concatenation
          
        const parsed = JSON.parse(jsonStr);
        
        if (parsed.html !== undefined && parsed.css !== undefined) {
          return {
            html: parsed.html || '',
            css: parsed.css || '',
            js: parsed.js || ''
          };
        }
      } catch (e) {
        console.log(`Failed to parse JSON match: ${match[0].substring(0, 100)}...`, e);
        // Continue to next match
      }
    }
    
    // If no valid JSON was found, try to extract sections manually
    console.warn('No valid JSON found in response, trying manual extraction');
    
    try {
      // Fallback: try to extract code sections manually
      const htmlMatch = generatedText.match(/"html"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/) || 
                        generatedText.match(/"html"\s*:\s*'([^']*(?:\\.[^']*)*)'/) ||
                        generatedText.match(/html\s*:\s*['"]([^'"]*(?:\\.[^'"]*)*)['"`]/);
                        
      const cssMatch = generatedText.match(/"css"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/) || 
                       generatedText.match(/"css"\s*:\s*'([^']*(?:\\.[^']*)*)'/) ||
                       generatedText.match(/css\s*:\s*['"]([^'"]*(?:\\.[^'"]*)*)['"`]/);
                       
      const jsMatch = generatedText.match(/"js"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/) || 
                     generatedText.match(/"js"\s*:\s*'([^']*(?:\\.[^']*)*)'/) ||
                     generatedText.match(/js\s*:\s*['"]([^'"]*(?:\\.[^'"]*)*)['"`]/);

      console.log(`Manual extraction results: HTML=${!!htmlMatch}, CSS=${!!cssMatch}, JS=${!!jsMatch}`);

      if (htmlMatch || cssMatch) {
        return {
          html: htmlMatch ? htmlMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : '<div>Error parsing HTML</div>',
          css: cssMatch ? cssMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : '',
          js: jsMatch ? jsMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : ''
        };
      }
    } catch (extractError) {
      console.error('Error during manual extraction:', extractError);
    }
    
    // If all attempts fail, return a fallback component
    console.error('All parsing attempts failed, using fallback UI');
    return {
      html: '<div class="error">Could not generate component. Please try again.</div>',
      css: '.error { color: red; padding: 20px; text-align: center; border: 1px solid red; border-radius: 4px; background-color: #fff1f1; }',
      js: ''
    };  } catch (error) {
    // Enhanced error handling with specific messages for different error types
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timed out')) {
        console.error('[generateUICode] Request timed out:', error.message);
        return {
          html: '<div class="error">Request timed out. Ollama is taking too long to respond. Please try again or use a different model.</div>',
          css: '.error { color: #d32f2f; padding: 20px; text-align: center; border: 1px solid #d32f2f; border-radius: 4px; background-color: #ffebee; font-family: system-ui, sans-serif; }',
          js: ''
        };
      } else if (error.message.includes('fetch')) {
        console.error('[generateUICode] Network error:', error.message);
        return {
          html: '<div class="error">Network error. Please make sure Ollama is running and accessible.</div>',
          css: '.error { color: #d32f2f; padding: 20px; text-align: center; border: 1px solid #d32f2f; border-radius: 4px; background-color: #ffebee; font-family: system-ui, sans-serif; }',
          js: ''
        };
      }
      console.error('[generateUICode] Error:', error.name, error.message);
    } else {
      console.error('[generateUICode] Unknown error:', error);
    }
    
    return {
      html: '<div class="error">Failed to generate component. Please check your connection and try again.</div>',
      css: '.error { color: #d32f2f; padding: 20px; text-align: center; border: 1px solid #d32f2f; border-radius: 4px; background-color: #ffebee; font-family: system-ui, sans-serif; }',
      js: ''
    };
  }
}

export async function generateCodeWithFramework(
  prompt: string,
  framework: 'react' | 'vue' | 'angular',
  modelName: string = 'deepseek-r1:latest'
): Promise<CodePayload> {
  const frameworkPrompts = {
    react: 'Generate a React functional component with hooks',
    vue: 'Generate a Vue 3 component with composition API',
    angular: 'Generate an Angular component with TypeScript'
  };

  const enhancedPrompt = `${frameworkPrompts[framework]}: ${prompt}`;
  return generateUICode(enhancedPrompt, modelName);
}

/**
 * Fallback method to handle cases where Ollama is not available or AI fails
 * This generates basic but themed components based on the prompt
 */
export function generateBasicUICode(prompt: string): CodePayload {
  console.log(`Using fallback UI generation for: "${prompt}"`);
  
  const lowerPrompt = prompt.toLowerCase();
  
  // Generate Pip-Boy themed fallback
  if (lowerPrompt.includes('pip-boy') || lowerPrompt.includes('fallout') || lowerPrompt.includes('chatbot')) {
    return {
      html: `<div class="pip-boy-fallback">
  <div class="terminal-header">
    <span class="terminal-title">PIP-BOY 3000 - FALLBACK MODE</span>
    <span class="status-light"></span>
  </div>
  <div class="terminal-content">
    <div class="boot-sequence">
      <p>[SYSTEM] ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM</p>
      <p>[SYSTEM] INITIALIZING COMMUNICATION MODULE...</p>
      <p>[STATUS] READY FOR INPUT</p>
    </div>
    <div class="chat-area">
      <div class="message-input">
        <span class="prompt-symbol">></span>
        <input type="text" class="terminal-input" placeholder="ENTER COMMAND">
        <button class="send-button">SEND</button>
      </div>
    </div>
  </div>
</div>`,
      css: `@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.pip-boy-fallback {
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  background: #001100;
  color: #00ff00;
  border: 3px solid #00aa00;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  box-shadow: 
    inset 0 0 20px rgba(0, 255, 0, 0.3),
    0 0 30px rgba(0, 255, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.pip-boy-fallback::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.1) 2px,
    rgba(0, 255, 0, 0.1) 4px
  );
  pointer-events: none;
}

.terminal-header {
  background: #003300;
  padding: 10px 15px;
  border-bottom: 2px solid #00aa00;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.terminal-title {
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 5px #00ff00;
}

.status-light {
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  box-shadow: 0 0 8px #00ff00;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.terminal-content {
  padding: 20px;
  position: relative;
  z-index: 1;
}

.boot-sequence p {
  margin: 5px 0;
  font-size: 12px;
  color: #ffaa00;
  text-shadow: 0 0 3px #ffaa00;
}

.chat-area {
  margin-top: 20px;
  border-top: 1px solid #00aa00;
  padding-top: 15px;
}

.message-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prompt-symbol {
  color: #00ffff;
  font-weight: bold;
  text-shadow: 0 0 5px #00ffff;
}

.terminal-input {
  flex: 1;
  background: #001100;
  border: 2px solid #00aa00;
  color: #00ff00;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 12px;
  border-radius: 4px;
  outline: none;
}

.terminal-input:focus {
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  border-color: #00ff00;
}

.send-button {
  background: #003300;
  border: 2px solid #00aa00;
  color: #00ff00;
  padding: 8px 16px;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  text-shadow: 0 0 3px #00ff00;
}

.send-button:hover {
  background: #004400;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
}

@keyframes typing {
  from { text-shadow: 0 0 3px #00ff00; }
  to { text-shadow: 0 0 8px #00ff00; }
}

    `,
      js: `document.addEventListener('DOMContentLoaded', function() {
  const input = document.querySelector('.terminal-input');
  const sendBtn = document.querySelector('.send-button');
  
  function simulateTyping() {
    input.style.textShadow = '0 0 8px #00ff00';
    setTimeout(() => {
      input.style.textShadow = '0 0 3px #00ff00';
    }, 100);
  }
  
  input.addEventListener('input', simulateTyping);
  
  sendBtn.addEventListener('click', function() {
    const bootSequence = document.querySelector('.boot-sequence');
    const userInput = input.value.trim();
    
    if (userInput) {
      const userMsg = document.createElement('p');
      userMsg.innerHTML = '[USER] > ' + userInput;
      userMsg.style.color = '#00ffff';
      bootSequence.appendChild(userMsg);
      
      setTimeout(() => {
        const response = document.createElement('p');
        response.innerHTML = '[SYSTEM] COMMAND ACKNOWLEDGED. FALLBACK MODE ACTIVE.';
        response.style.color = '#ffaa00';
        bootSequence.appendChild(response);
      }, 1000);
      
      input.value = '';
    }
  });
  
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
});`
    };
  }
  
  // Default fallback for other prompts
  return {
    html: `<div class="fallback-component">
  <h3>Component Generator</h3>
  <p>This is a fallback component for: "${prompt}"</p>
  <div class="feature-showcase">
    <button class="demo-button">Interactive Button</button>
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
  </div>
</div>`,
    css: `.fallback-component {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 400px;
  margin: 20px auto;
  padding: 30px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.fallback-component h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.fallback-component p {
  margin: 0 0 25px 0;
  opacity: 0.9;
  line-height: 1.5;
}

.feature-showcase {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.demo-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.demo-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00d4ff);
  border-radius: 4px;
  animation: fillProgress 3s ease-in-out infinite;
}

@keyframes fillProgress {
  0%, 100% { width: 0%; }
  50% { width: 100%; }
}`,
    js: `document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.demo-button');
  
  button.addEventListener('click', function() {
    this.textContent = 'Clicked!';
    this.style.background = 'rgba(0, 255, 136, 0.3)';
    
    setTimeout(() => {
      this.textContent = 'Interactive Button';
      this.style.background = 'rgba(255, 255, 255, 0.2)';
    }, 1500);
  });
  
  console.log('Fallback component loaded for prompt: "${prompt}"');
});`,
  };
}

/**
 * Check if Ollama is available
 */
/**
 * Utility function for fetching with timeout
 * Enhanced to properly handle both external signals and timeout
 * @param url URL to fetch
 * @param options Fetch options
 * @param timeoutMs Timeout in milliseconds
 * @returns Response or throws error
 */
async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 30000
): Promise<Response> {
  // Create our own abort controller for the timeout
  const timeoutController = new AbortController();
  
  // Get any existing signal from options
  const existingSignal = options.signal;
  
  // Set up the timeout
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new DOMException('Request timed out', 'TimeoutError'));
  }, timeoutMs);
  
  try {
  // Handle the case where there's an existing signal
    if (existingSignal && existingSignal.aborted) {
      // If the existing signal is already aborted, we don't need to do anything else
      throw new DOMException('The operation was aborted', 'AbortError');
    }
    
    // If there's an existing signal, set up a listener to abort our controller if it aborts
    if (existingSignal) {
      existingSignal.addEventListener('abort', () => {
        timeoutController.abort(existingSignal.reason);
        clearTimeout(timeoutId);
      }, { once: true });
    }
    
    // Use our controller's signal
    const signal = timeoutController.signal;
    
    // Combine the original options with our signal
    const fetchOptions: RequestInit = {
      ...options,
      signal
    };
    
    // Return the fetch with our combined signal
    return await fetch(url, fetchOptions);
    
  } finally {
    // Always clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
  }
}

/**
 * Check if Ollama is available
 * Enhanced with better error categorization and logging
 */
async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const healthCheck = await fetchWithTimeout('http://localhost:11434', { method: 'HEAD' }, 3000);
    return healthCheck.ok;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timed out')) {
        console.error('Ollama health check timed out. Is Ollama running but overloaded?');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('Ollama connection failed. Is the service running at http://localhost:11434?');
      } else {
        console.error(`Ollama health check failed with ${error.name}: ${error.message}`);
      }
    } else {
      console.error('Ollama health check failed with an unknown error:', String(error));
    }
    return false;
  }
}

