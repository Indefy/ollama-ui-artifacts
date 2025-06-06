import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Layers, Shuffle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CodePayload } from './LiveUIPreview';
import { generateUICode } from '@/lib/codeGenerator';

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  prompt: string;
  completed: boolean;
}

interface MultiStepGeneratorProps {
  onGenerateCode: (html: string, css: string, js: string) => void;
  selectedModel: string;
}

const MultiStepGenerator: React.FC<MultiStepGeneratorProps> = ({
  onGenerateCode,
  selectedModel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<CodePayload[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);

  const [steps, setSteps] = useState<GenerationStep[]>([
    {
      id: 'structure',
      title: 'Component Structure',
      description: 'Define the basic layout and elements',
      prompt: '',
      completed: false
    },
    {
      id: 'styling',
      title: 'Visual Design',
      description: 'Specify colors, fonts, and styling preferences',
      prompt: '',
      completed: false
    },
    {
      id: 'interactions',
      title: 'Interactivity',
      description: 'Add behavior and user interactions',
      prompt: '',
      completed: false
    },
    {
      id: 'responsive',
      title: 'Responsive Design',
      description: 'Define mobile and tablet breakpoints',
      prompt: '',
      completed: false
    }
  ]);

  const handleStepPromptChange = (stepId: string, prompt: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, prompt } : step
    ));
  };

  const generateVariations = async () => {
    setIsGenerating(true);
    const combinedPrompt = steps
      .filter(step => step.prompt.trim())
      .map(step => `${step.title}: ${step.prompt}`)
      .join('\n');

    const variationPrompts = [
      `${combinedPrompt}\nStyle: Modern and minimalist`,
      `${combinedPrompt}\nStyle: Vibrant and colorful`,
      `${combinedPrompt}\nStyle: Professional and clean`,
      `${combinedPrompt}\nStyle: Playful and rounded`
    ];

    try {
      const generatedVariations = await Promise.all(
        variationPrompts.map(prompt => generateUICode(prompt, selectedModel))
      );
      setVariations(generatedVariations);
    } catch (error) {
      console.error('Error generating variations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectVariation = (index: number) => {
    setSelectedVariation(index);
    const variation = variations[index];
    onGenerateCode(variation.html, variation.css, variation.js);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layers className="mr-2" size={20} />
          Multi-Step Component Generation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="ml-2 mr-2" size={16} />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">{steps[currentStep].title}</h3>
          <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
          <textarea
            value={steps[currentStep].prompt}
            onChange={(e) => handleStepPromptChange(steps[currentStep].id, e.target.value)}
            placeholder={`Describe the ${steps[currentStep].title.toLowerCase()}...`}
            className="w-full h-24 p-3 border rounded-md resize-none"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between mb-6">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={generateVariations}
              disabled={isGenerating || !steps.some(step => step.prompt.trim())}
              className="flex items-center"
            >
              <Sparkles size={16} className="mr-1" />
              {isGenerating ? 'Generating...' : 'Generate Variations'}
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          )}
        </div>

        {/* Variations */}
        {variations.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Shuffle className="mr-2" size={20} />
              Component Variations
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {variations.map((variation, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedVariation === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => selectVariation(index)}
                >
                  <div className="text-sm font-medium mb-2">
                    Variation {index + 1}
                  </div>
                  <div 
                    className="bg-white border rounded p-2 text-xs overflow-hidden"
                    style={{ height: '100px' }}
                    dangerouslySetInnerHTML={{ __html: variation.html }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiStepGenerator;