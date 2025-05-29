import { CodePayload } from '@/components/LiveUIPreview';
import { formatCodeWithPrettier } from './codeOptimizer';

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
    .replace(/^<think>[\s\S]*?\n/, '') // Remove LLM internal preamble
    .replace(/^\s*```(json)?/, '') // Remove markdown block start
    .replace(/```\s*$/, '') // Remove markdown block end
    .replace(/^\s*\{/, '{') // Ensure starts with {
    .replace(/\}\s*$/, '}') // Ensure ends with }
    .trim();

  // Step 2: Extract the first JSON block
  const jsonMatch = sanitized.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) {
    console.error('[parseAIResponse] No JSON block found in:', sanitized.substring(0, 200));
    throw new Error('No valid JSON block found in response');
  }
  
  const jsonBlock = jsonMatch[0];
  
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
    throw error;
  }
}

interface GenerationResult {
  success: boolean;
  data?: CodePayload | string;
  error?: string;
}

export async function generateUICode(
  prompt: string, 
  modelName: string = 'deepseek-r1:latest'
): Promise<CodePayload> {
  const systemPrompt = `You are a UI component generator. Generate clean, modern, responsive HTML, CSS, and JavaScript code based on the user's request.

IMPORTANT: Return ONLY a JSON object with this exact structure:
{
  "html": "HTML code here",
  "css": "CSS code here", 
  "js": "JavaScript code here"
}

Requirements:
- Use modern HTML5 semantic elements
- Write responsive CSS with flexbox/grid
- Include proper accessibility attributes
- Add smooth animations and transitions
- Use vanilla JavaScript for interactivity
- Make components mobile-friendly
- Use modern color schemes and typography
- Ensure clean, readable code structure`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
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
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let generatedText = data.response || '';

    // Clean up the response - remove any markdown formatting
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Find JSON content
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('No JSON found in response:', generatedText);
      return {
        html: '<div class="error">Could not generate component. Please try again.</div>',
        css: '.error { color: red; padding: 20px; text-align: center; }',
        js: ''
      };
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        html: parsed.html || '',
        css: parsed.css || '',
        js: parsed.js || ''
      };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw response:', generatedText);

      // Fallback: try to extract code sections manually
      const htmlMatch = generatedText.match(/"html":\s*"([^"]*(?:\\.[^"]*)*)"/);
      const cssMatch = generatedText.match(/"css":\s*"([^"]*(?:\\.[^"]*)*)"/);
      const jsMatch = generatedText.match(/"js":\s*"([^"]*(?:\\.[^"]*)*)"/);

      return {
        html: htmlMatch ? htmlMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : '<div>Error parsing HTML</div>',
        css: cssMatch ? cssMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : '',
        js: jsMatch ? jsMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : ''
      };
    }
  } catch (error) {
    console.error('Error generating code:', error);
    return {
      html: '<div class="error">Failed to generate component. Please check your connection and try again.</div>',
      css: '.error { color: red; padding: 20px; text-align: center; border: 1px solid red; border-radius: 4px; }',
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
}`,
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