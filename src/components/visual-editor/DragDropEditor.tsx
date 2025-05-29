
import React, { useState, useRef, useCallback } from 'react';
import { Layers, Move, RotateCcw, Copy, Trash2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CodePayload } from '../LiveUIPreview';

interface DragElement {
  id: string;
  type: 'component' | 'container';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  code: CodePayload;
  children?: string[];
  zIndex: number;
}

interface DragDropEditorProps {
  onCodeGenerate: (code: CodePayload) => void;
}

export const DragDropEditor: React.FC<DragDropEditorProps> = ({ onCodeGenerate }) => {
  const [elements, setElements] = useState<DragElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const componentTemplates = [
    {
      id: 'button-template',
      name: 'Button',
      code: {
        html: '<button class="custom-btn">Click me</button>',
        css: '.custom-btn { padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }',
        js: ''
      }
    },
    {
      id: 'card-template',
      name: 'Card',
      code: {
        html: '<div class="custom-card"><h3>Card Title</h3><p>Card content goes here.</p></div>',
        css: '.custom-card { padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 8px; }',
        js: ''
      }
    },
    {
      id: 'input-template',
      name: 'Input',
      code: {
        html: '<input type="text" class="custom-input" placeholder="Enter text...">',
        css: '.custom-input { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; width: 200px; }',
        js: ''
      }
    }
  ];

  const addElement = (template: typeof componentTemplates[0]) => {
    const newElement: DragElement = {
      id: `element-${Date.now()}`,
      type: 'component',
      name: template.name,
      x: Math.random() * (canvasSize.width - 200),
      y: Math.random() * (canvasSize.height - 100),
      width: 200,
      height: 100,
      code: template.code,
      zIndex: elements.length
    };

    setElements(prev => [...prev, newElement]);
  };

  const updateElement = (id: string, updates: Partial<DragElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement: DragElement = {
        ...element,
        id: `element-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: elements.length
      };
      setElements(prev => [...prev, newElement]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setSelectedElement(elementId);
    setDraggedElement(elementId);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateElement(draggedElement, { x, y });
  }, [draggedElement]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
  }, []);

  React.useEffect(() => {
    if (draggedElement) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedElement, handleMouseMove, handleMouseUp]);

  const generateLayoutCode = () => {
    const html = elements.map(el => {
      const style = `position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; z-index: ${el.zIndex};`;
      return `<div style="${style}">${el.code.html}</div>`;
    }).join('\n');

    const css = elements.map(el => el.code.css).join('\n');
    const js = elements.map(el => el.code.js).join('\n');

    const fullCode: CodePayload = {
      html: `<div class="canvas-container">\n${html}\n</div>`,
      css: `.canvas-container { position: relative; width: ${canvasSize.width}px; height: ${canvasSize.height}px; }\n${css}`,
      js
    };

    onCodeGenerate(fullCode);
  };

  const alignElements = (alignment: 'left' | 'center' | 'right') => {
    if (!selectedElement) return;

    const element = elements.find(el => el.id === selectedElement);
    if (!element) return;

    let newX = element.x;
    switch (alignment) {
      case 'left':
        newX = 0;
        break;
      case 'center':
        newX = (canvasSize.width - element.width) / 2;
        break;
      case 'right':
        newX = canvasSize.width - element.width;
        break;
    }

    updateElement(selectedElement, { x: newX });
  };

  return (
    <div className="h-full flex">
      {/* Component Library */}
      <div className="w-64 p-4 bg-gray-50 border-r">
        <h3 className="font-medium mb-4">Components</h3>
        <div className="space-y-2">
          {componentTemplates.map(template => (
            <Button
              key={template.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => addElement(template)}
            >
              {template.name}
            </Button>
          ))}
        </div>

        {/* Layer Tree */}
        <div className="mt-6">
          <h3 className="font-medium mb-4 flex items-center">
            <Layers size={16} className="mr-2" />
            Layers
          </h3>
          <div className="space-y-1">
            {elements.map(element => (
              <div
                key={element.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                  selectedElement === element.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedElement(element.id)}
              >
                <span className="text-sm">{element.name}</span>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateElement(element.id);
                    }}
                  >
                    <Copy size={12} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteElement(element.id);
                    }}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4">
        {/* Toolbar */}
        <div className="flex items-center space-x-2 mb-4">
          <Button size="sm" onClick={() => alignElements('left')}>
            <AlignLeft size={16} />
          </Button>
          <Button size="sm" onClick={() => alignElements('center')}>
            <AlignCenter size={16} />
          </Button>
          <Button size="sm" onClick={() => alignElements('right')}>
            <AlignRight size={16} />
          </Button>
          <div className="flex-1" />
          <Button onClick={generateLayoutCode}>
            Generate Code
          </Button>
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className="relative border-2 border-dashed border-gray-300 bg-white overflow-hidden"
          style={{ width: canvasSize.width, height: canvasSize.height }}
        >
          {elements.map(element => (
            <div
              key={element.id}
              className={`absolute border-2 cursor-move ${
                selectedElement === element.id 
                  ? 'border-blue-500 bg-blue-50/50' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                zIndex: element.zIndex
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              <div 
                className="w-full h-full overflow-hidden"
                dangerouslySetInnerHTML={{ __html: element.code.html }}
              />
              <style>{element.code.css}</style>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragDropEditor;
import React, { useState, useCallback } from 'react';
import { MousePointer, Move, Square, Type, Image, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CodePayload } from '../LiveUIPreview';

interface DragDropEditorProps {
  onCodeGenerate: (code: CodePayload) => void;
}

interface Element {
  id: string;
  type: 'div' | 'button' | 'input' | 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  styles: Record<string, string>;
}

const DragDropEditor: React.FC<DragDropEditorProps> = ({ onCodeGenerate }) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);

  const addElement = (type: Element['type']) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type,
      x: 50,
      y: 50,
      width: type === 'button' ? 120 : type === 'input' ? 200 : 100,
      height: type === 'input' ? 40 : type === 'button' ? 40 : 60,
      content: type === 'text' ? 'Sample Text' : type === 'button' ? 'Button' : '',
      styles: {
        backgroundColor: type === 'button' ? '#3b82f6' : '#ffffff',
        color: type === 'button' ? '#ffffff' : '#000000',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '8px'
      }
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const generateCode = () => {
    const html = `<div class="visual-container">
${elements.map(el => {
  const tag = el.type === 'text' ? 'div' : el.type;
  return `  <${tag} class="element-${el.id}">${el.content || ''}</${tag}>`;
}).join('\n')}
</div>`;

    const css = `.visual-container {
  position: relative;
  width: 100%;
  height: 400px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

${elements.map(el => `
.element-${el.id} {
  position: absolute;
  left: ${el.x}px;
  top: ${el.y}px;
  width: ${el.width}px;
  height: ${el.height}px;
  ${Object.entries(el.styles).map(([key, value]) => 
    `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
  ).join('\n  ')}
}`).join('')}`;

    const js = `// Interactive elements
document.addEventListener('DOMContentLoaded', function() {
  console.log('Visual editor component loaded');
});`;

    onCodeGenerate({ html, css, js });
  };

  return (
    <div className="h-full p-4 space-y-4 overflow-y-auto">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MousePointer className="mr-2" size={20} />
            Visual Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Element Palette */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => addElement('div')} size="sm" className="glass-button">
              <Square size={16} className="mr-1" />
              Div
            </Button>
            <Button onClick={() => addElement('button')} size="sm" className="glass-button">
              <MousePointer size={16} className="mr-1" />
              Button
            </Button>
            <Button onClick={() => addElement('input')} size="sm" className="glass-button">
              <Type size={16} className="mr-1" />
              Input
            </Button>
            <Button onClick={() => addElement('text')} size="sm" className="glass-button">
              <Type size={16} className="mr-1" />
              Text
            </Button>
          </div>

          {/* Canvas */}
          <div className="relative border border-white/20 bg-white/5 rounded-lg h-96 overflow-hidden">
            {elements.map(element => (
              <div
                key={element.id}
                className={`absolute cursor-move border-2 ${
                  selectedElement === element.id ? 'border-blue-400' : 'border-transparent'
                } hover:border-blue-300`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  ...element.styles
                }}
                onClick={() => setSelectedElement(element.id)}
                onMouseDown={() => setDraggedElement(element.id)}
              >
                <div className="text-xs">{element.content || element.type}</div>
                {selectedElement === element.id && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(element.id);
                    }}
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Generate Code Button */}
          <Button onClick={generateCode} className="w-full glass-button text-white">
            Generate Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DragDropEditor;
