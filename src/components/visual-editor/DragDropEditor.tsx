
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
