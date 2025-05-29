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

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    const jsonMatch = data.response.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No valid JSON found in analysis response');
    }

    const result = JSON.parse(jsonMatch[0]);

    // Format the optimized code with Prettier
    const formattedCode = {
      html: formatCodeWithPrettier(result.optimizedCode.html, 'html'),
      css: formatCodeWithPrettier(result.optimizedCode.css, 'css'),
      js: formatCodeWithPrettier(result.optimizedCode.js, 'babel')
    };

    return {
      suggestions: result.suggestions || [],
      optimizedCode: formattedCode,
      smartName: result.smartName || 'OptimizedComponent'
    };

  } catch (error) {
    console.warn('Code analysis failed, returning original code:', error);
    return {
      suggestions: [],
      optimizedCode: code,
      smartName: generateSmartComponentName(code)
    };
  }
}

export function formatCodeWithPrettier(code: string, parser: 'html' | 'css' | 'babel'): string {
  try {
    // Simple formatting rules without external Prettier dependency
    switch (parser) {
      case 'html':
        return formatHTML(code);
      case 'css':
        return formatCSS(code);
      case 'babel':
        return formatJavaScript(code);
      default:
        return code;
    }
  } catch (error) {
    console.warn('Formatting failed, returning original code:', error);
    return code;
  }
}

function formatHTML(html: string): string {
  if (!html.trim()) return '';

  let formatted = html.trim();
  let indentLevel = 0;
  const indentSize = 2;
  const lines = formatted.split(/>\s*</);

  const result = lines.map((line, index) => {
    if (index === 0) {
      line = line + '>';
    } else if (index === lines.length - 1) {
      line = '<' + line;
    } else {
      line = '<' + line + '>';
    }

    if (line.includes('</')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const indentedLine = ' '.repeat(indentLevel * indentSize) + line.trim();

    if (line.includes('<') && !line.includes('</') && !line.endsWith('/>')) {
      indentLevel++;
    }

    return indentedLine;
  });

  return result.join('\n');
}

function formatCSS(css: string): string {
  if (!css.trim()) return '';

  return css
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\s*}\s*/g, '\n}\n\n')
    .replace(/,\s*/g, ',\n')
    .trim();
}

function formatJavaScript(js: string): string {
  if (!js.trim()) return '';

  return js
    .replace(/;\s*/g, ';\n')
    .replace(/{\s*/g, ' {\n  ')
    .replace(/}\s*/g, '\n}\n')
    .replace(/,\s*/g, ', ')
    .trim();
}

export function generateSmartComponentName(code: { html: string; css: string; js: string }): string {
  const html = code.html.toLowerCase();

  // Analyze HTML content to suggest component names
  if (html.includes('button')) return 'ButtonComponent';
  if (html.includes('form')) return 'FormComponent';
  if (html.includes('card')) return 'CardComponent';
  if (html.includes('modal')) return 'ModalComponent';
  if (html.includes('nav')) return 'NavigationComponent';
  if (html.includes('header')) return 'HeaderComponent';
  if (html.includes('footer')) return 'FooterComponent';
  if (html.includes('gallery')) return 'GalleryComponent';
  if (html.includes('slider') || html.includes('carousel')) return 'SliderComponent';
  if (html.includes('table')) return 'TableComponent';
  if (html.includes('list')) return 'ListComponent';
  if (html.includes('chart') || html.includes('graph')) return 'ChartComponent';
  if (html.includes('progress')) return 'ProgressComponent';
  if (html.includes('tooltip')) return 'TooltipComponent';
  if (html.includes('dropdown')) return 'DropdownComponent';
  if (html.includes('tabs')) return 'TabsComponent';
  if (html.includes('accordion')) return 'AccordionComponent';
  if (html.includes('sidebar')) return 'SidebarComponent';
  if (html.includes('login')) return 'LoginComponent';
  if (html.includes('profile')) return 'ProfileComponent';
  if (html.includes('dashboard')) return 'DashboardComponent';

  return 'CustomComponent';
}