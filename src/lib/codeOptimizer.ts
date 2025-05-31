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
    
    // Extract JSON from the response, handling markdown code fences and other text
    let jsonStr = '';
    
    // First, try to extract JSON from markdown code fences
    const markdownJsonMatch = data.response.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownJsonMatch) {
      jsonStr = markdownJsonMatch[1].trim();
    } else {
      // Fallback to original regex that looks for any JSON object
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in analysis response');
      }
      jsonStr = jsonMatch[0];
    }

    if (!jsonStr) {
      throw new Error('No valid JSON found in analysis response');
    }
    
    // Clean the JSON string to fix common issues
    try {
      // First attempt: parse as-is
      const result = JSON.parse(jsonStr);
      
      // Validate required structure
      if (!result.optimizedCode || !result.optimizedCode.html) {
        throw new Error('Invalid response structure');
      }

      // Format the optimized code with Prettier
      // const formattedCode = {
      //   html: formatCodeWithPrettier(result.optimizedCode.html || code.html, 'html'),
      //   css: formatCodeWithPrettier(result.optimizedCode.css || code.css, 'css'),
      //   js: formatCodeWithPrettier(result.optimizedCode.js || code.js, 'babel')
      // };

      return {
        suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
        optimizedCode: result.optimizedCode || code,
        smartName: result.smartName || generateSmartComponentName(code)
      };
      
    } catch (parseError) {
      console.warn('JSON parsing failed, attempting to clean and retry:', parseError);
      
      // Attempt to clean the JSON string
      jsonStr = jsonStr
        .replace(/\\n/g, '\\\\n')  // Escape newlines in strings
        .replace(/\\"/g, '\\\\"')  // Escape quotes
        .replace(/\n/g, ' ')       // Remove actual newlines
        .replace(/\r/g, ' ')       // Remove carriage returns
        .replace(/\t/g, ' ')       // Replace tabs with spaces
        .replace(/\s+/g, ' ')      // Collapse multiple spaces
        .trim();
      
      try {
        const result = JSON.parse(jsonStr);
        
        return {
          suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
          optimizedCode: result.optimizedCode || code,
          smartName: result.smartName || generateSmartComponentName(code)
        };
        
      } catch (secondParseError) {
        console.warn('Second JSON parse attempt failed:', secondParseError);
        throw new Error('Unable to parse AI response JSON');
      }
    }

  } catch (error) {
    console.warn('Code analysis failed, returning original code:', error);
    return {
      suggestions: [],
      optimizedCode: code,
      smartName: generateSmartComponentName(code)
    };
  }
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