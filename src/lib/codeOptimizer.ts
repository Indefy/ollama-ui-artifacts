
interface OptimizationSuggestion {
  type: 'performance' | 'accessibility' | 'naming' | 'structure';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
  codeChange?: string;
}

export async function analyzeAndOptimizeCode(
  code: { html: string; css: string; js: string },
  modelName: string
): Promise<{
  suggestions: OptimizationSuggestion[];
  optimizedCode: { html: string; css: string; js: string };
  smartName: string;
}> {
  const analysisPrompt = `Analyze this UI component code and provide:
1. Performance optimization suggestions
2. Accessibility improvements
3. A smart, descriptive component name based on functionality
4. Code structure improvements

HTML:
${code.html}

CSS:
${code.css}

JavaScript:
${code.js}

Return as JSON with this structure:
{
  "smartName": "ComponentName",
  "suggestions": [
    {
      "type": "performance|accessibility|naming|structure",
      "severity": "low|medium|high",
      "description": "Issue description",
      "suggestion": "Improvement suggestion"
    }
  ],
  "optimizedCode": {
    "html": "optimized HTML",
    "css": "optimized CSS", 
    "js": "optimized JavaScript"
  }
}`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: analysisPrompt,
        stream: false,
        options: { temperature: 0.3 }
      })
    });

    const data = await response.json();
    const jsonMatch = data.response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        suggestions: result.suggestions || [],
        optimizedCode: result.optimizedCode || code,
        smartName: result.smartName || 'OptimizedComponent'
      };
    }
  } catch (error) {
    console.error('Code optimization failed:', error);
  }

  return {
    suggestions: [],
    optimizedCode: code,
    smartName: generateSmartName(code.html)
  };
}

function generateSmartName(html: string): string {
  // Extract semantic information from HTML
  const hasForm = html.includes('<form') || html.includes('input') || html.includes('button');
  const hasCard = html.includes('card') || html.includes('product');
  const hasNav = html.includes('nav') || html.includes('menu');
  const hasModal = html.includes('modal') || html.includes('dialog');
  const hasTable = html.includes('<table') || html.includes('<th') || html.includes('<td');
  const hasChart = html.includes('chart') || html.includes('graph');
  
  if (hasForm) return 'InteractiveForm';
  if (hasCard) return 'ProductCard';
  if (hasNav) return 'NavigationMenu';
  if (hasModal) return 'ModalDialog';
  if (hasTable) return 'DataTable';
  if (hasChart) return 'ChartWidget';
  
  return 'UIComponent';
}

export function formatCodeWithPrettier(code: string, parser: 'html' | 'css' | 'babel'): string {
  // Basic formatting rules - in a real implementation, you'd use Prettier API
  if (parser === 'html') {
    return code
      .replace(/></g, '>\n<')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  if (parser === 'css') {
    return code
      .replace(/;/g, ';\n  ')
      .replace(/{/g, ' {\n  ')
      .replace(/}/g, '\n}\n')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  if (parser === 'babel') {
    return code
      .replace(/;/g, ';\n')
      .replace(/{/g, ' {\n  ')
      .replace(/}/g, '\n}')
      .trim();
  }
  
  return code;
}
