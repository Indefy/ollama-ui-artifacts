import { CodePayload } from '@/components/LiveUIPreview';

/**
 * Generates UI code based on user prompts by calling the Ollama API
 */
export async function generateUICode(
  prompt: string, 
  modelName: string
): Promise<CodePayload> {
  console.log(`Attempting to generate code for prompt: "${prompt}" using model: ${modelName}`);
  
  const ollamaApiUrl = 'http://localhost:11434/api/generate';
  
  // Construct the detailed prompt for the LLM
  const systemPrompt = `You are an expert web developer specializing in creating modern UI components. 
Based on the following user request, generate the HTML, CSS, and JavaScript code for a single, self-contained UI component.
The HTML should be within a single root div. The CSS should be scoped or otherwise designed to apply only to this component.
Use standard CSS and avoid preprocessors. The JavaScript should be minimal and only for interactivity within this component.
If no JavaScript is needed, provide an empty string for the 'js' field.

User Request: "${prompt}"

Please provide your response as a single JSON object with the following exact structure, and nothing else (no explanations, no markdown code fences):
{
  "html": "YOUR_HTML_CODE_HERE",
  "css": "YOUR_CSS_CODE_HERE",
  "js": "YOUR_JAVASCRIPT_CODE_HERE"
}

IMPORTANT: Within the JSON string values for "html", "css", and "js", all newline characters must be properly escaped as \\n.
Ensure the JSON itself is valid. Ensure the HTML, CSS, and JavaScript are complete and ready to use.`;

  try {
    const response = await fetch(ollamaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: systemPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    // Parse the response from the LLM
    try {
      // Extract the JSON object from the response text
      // This handles both cases where the LLM returns pure JSON or JSON wrapped in other text
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in the LLM response');
      }
      
      const jsonStr = jsonMatch[0];
      const parsedResponse = JSON.parse(jsonStr);
      
      return {
        html: parsedResponse.html?.trim() || '',
        css: parsedResponse.css?.trim() || '',
        js: parsedResponse.js?.trim() || '',
      };
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      console.debug('Raw LLM response:', data.response);
      
      // Fallback with a basic error component
      return {
        html: `<div class="error-component"><h3>UI Generation Error</h3><p>Failed to parse the AI response. Please try again with a different prompt.</p></div>`,
        css: `.error-component { padding: 20px; border: 1px solid #f44336; border-radius: 8px; color: #f44336; }`,
        js: '',
      };
    }
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    
    // Return a fallback UI for error handling
    return {
      html: `<div class="error-component"><h3>Connection Error</h3><p>Could not connect to the AI service. Please ensure Ollama is running locally on port 11434.</p></div>`,
      css: `.error-component { padding: 20px; border: 1px solid #f44336; border-radius: 8px; color: #f44336; }`,
      js: '',
    };
  }
}

/**
 * Fallback method to handle cases where Ollama is not available
 * This can be useful for development or testing
 */
export function generateBasicUICode(prompt: string): CodePayload {
  console.log(`Using fallback UI generation for: "${prompt}"`);
  
  return {
    html: `<div class="fallback-component">
  <h3>Example Component</h3>
  <p>This is a placeholder UI component based on your request: "${prompt}"</p>
  <button class="action-button">Click Me</button>
</div>`,
    css: `.fallback-component {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to bottom right, #ffffff, #f5f5f5);
}

.action-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #2563eb;
}`,
    js: `document.querySelector('.action-button').addEventListener('click', function() {
  alert('Button clicked!');
});`,
  };
}

// export async function generateUICode(prompt: string, modelName: string): Promise<CodePayload> {
//   console.log(`Attempting to generate code for prompt: "${prompt}" using model: ${modelName}`);

//   const ollamaApiUrl = 'http://localhost:11434/api/generate';

//   // Construct the detailed prompt for the LLM
//   const systemPrompt = `You are an expert web developer specializing in creating modern UI components.
// Based on the following user request, generate the HTML, CSS, and JavaScript code for a single, self-contained UI component.
// The HTML should be within a single root div.
// The CSS should be scoped or otherwise designed to apply only to this component. Use standard CSS and avoid preprocessors.
// The JavaScript should be minimal and only for interactivity within this component. If no JavaScript is needed, provide an empty string for the 'js' field or omit the field.

// User Request: "${prompt}"

// Please provide your response as a single JSON object with the following exact structure, and nothing else (no explanations, no markdown code fences):
// {
//   "html": "YOUR_HTML_CODE_HERE",
//   "css": "YOUR_CSS_CODE_HERE",
//   "js": "YOUR_JAVASCRIPT_CODE_HERE"
// }

// IMPORTANT: Within the JSON string values for "html", "css", and "js", all newline characters must be escaped as \\n. For example, a two-line HTML snippet like \`<div><p>Hello</p></div>\` should be represented in the JSON string as \`"<div>\\\\n  <p>Hello</p>\\\\n</div>"\`. Ensure the JSON itself is valid.
// Ensure the HTML, CSS, and JavaScript are complete and ready to use.`;

//   try {
//     console.log('Sending request to Ollama...');
//     const response = await fetch(ollamaApiUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: modelName,
//         prompt: systemPrompt,
//         stream: false,
//       }),
//     });

//     console.log('Received response from Ollama. Status:', response.status);
//     if (!response.ok) {
//       const errorBody = await response.text();
//       console.error('Ollama API Error:', response.status, errorBody);
//       return {
//         html: `<div class="error-container"><h2>Error Communicating with Ollama</h2><p>Status: ${response.status}</p><pre>${errorBody}</pre></div>`,
//         css: `.error-container { color: red; padding: 20px; background: #fff0f0; border: 1px solid red; border-radius: 8px; text-align: left; } pre { white-space: pre-wrap; word-wrap: break-word; }`,
//         js: '// Ollama API Error',
//       };
//     }

//     const ollamaData = await response.json();
//     console.log('Ollama data received:', ollamaData);

//     if (ollamaData && ollamaData.response) {
//       let llmResponseString = ollamaData.response.trim();
      
//       // Attempt to remove markdown fences if LLM adds them despite instructions
//       if (llmResponseString.startsWith('```json')) {
//         llmResponseString = llmResponseString.substring(7);
//         if (llmResponseString.endsWith('```')) {
//           llmResponseString = llmResponseString.substring(0, llmResponseString.length - 3);
//         }
//         llmResponseString = llmResponseString.trim();
//       }

//       console.log('Sanitized LLM response string (newlines escaped):', llmResponseString);

//       try {
//         const parsedCode: Partial<CodePayload> = JSON.parse(llmResponseString);
        
//         // Ensure all parts are strings, default to empty string if missing (especially for js)
//         const html = typeof parsedCode.html === 'string' ? parsedCode.html : '';
//         const css = typeof parsedCode.css === 'string' ? parsedCode.css : '';
//         const js = typeof parsedCode.js === 'string' ? parsedCode.js : '';

//         if (html || css || js) { // At least one part should have content
//             console.log('Successfully parsed CodePayload:', { html, css, js });
//             return { html, css, js };
//         }
//         console.error('Parsed CodePayload is empty or invalid.', parsedCode);
//         throw new Error('Parsed CodePayload is empty or invalid.');

//       } catch (parseError) {
//         console.error('Error parsing LLM JSON response:', parseError);
//         console.error('Sanitized LLM response string that failed to parse:', llmResponseString);
//         console.error('Original raw LLM response string was:', ollamaData.response);
//         return {
//           html: `<div class="error-container"><h2>Error Parsing AI Response</h2><p>The AI's response was not valid JSON or did not meet the expected structure after sanitization.</p><h4>Sanitized Response Attempted:</h4><pre>${llmResponseString}</pre><h4>Original Raw Response:</h4><pre>${ollamaData.response}</pre></div>`,
//           css: `.error-container { color: red; padding: 20px; background: #fff0f0; border: 1px solid red; border-radius: 8px; text-align: left; } pre { white-space: pre-wrap; word-wrap: break-word; font-size: 0.8em; } h4 { margin-top: 10px; margin-bottom: 5px; }`,
//           js: '// Error parsing LLM JSON',
//         };
//       }
//     } else {
//       console.error('Ollama API response did not contain a .response field or was empty:', ollamaData);
//       return {
//         html: `<div class="error-container"><h2>Invalid Ollama API Response</h2><p>The API response from Ollama was missing the expected 'response' field or the field was empty.</p></div>`,
//         css: `.error-container { color: red; padding: 20px; background: #fff0f0; border: 1px solid red; border-radius: 8px; text-align: left; }`,
//         js: '// Invalid Ollama API response',
//       };
//     }

//   } catch (error) {
//     console.error('Failed to fetch or process Ollama API response:', error);
//     return {
//       html: `<div class="error-container"><h2>Failed to Connect to AI</h2><p>Could not connect to the Ollama service or another unexpected error occurred.</p><p>${error instanceof Error ? error.message : String(error)}</p></div>`,
//       css: `.error-container { color: red; padding: 20px; background: #fff0f0; border: 1px solid red; border-radius: 8px; text-align: left; }`,
//       js: '// Network or other fetch error',
//     };
//   }
// }