
# PocketAI Chat - Interactive UI Component Canvas (live-ui-preview)

Version: 0.2.0
Author: Adi Booker ([Indefy on GitHub](https://github.com/Indefy))

An interactive web application that allows users to generate UI components using AI (powered by Ollama), preview them live, edit the code, and export them in various formats. Now featuring a modern sidebar-driven interface with tabbed navigation for an enhanced user experience.

## Features

### Core Features
*   **AI-Powered UI Generation**: Describe the UI component you want, and the AI will generate HTML, CSS, and JavaScript.
*   **Model Selection**: Choose from various Ollama models to tailor the generation process.
*   **Live Preview**: Instantly see the generated component rendered in the browser with real-time updates.
*   **Code Editing**: Modify the generated HTML, CSS, and JS directly in the integrated editor with syntax highlighting.
*   **Code Export**: Download standalone HTML files, export as React/Vue/Angular components, copy to clipboard, and preview before downloading.

### New Enhanced UI Features
*   **Responsive Sidebar Layout**: Modern, intuitive navigation with collapsible sidebar for better space utilization.
*   **Tabbed Navigation**: Five distinct tabs for focused workflows:
    - **Chat & Prompt**: AI conversation interface with model selection
    - **Live Preview**: Real-time component rendering and interaction
    - **Code Editor**: Multi-language code editing with HTML, CSS, and JavaScript tabs
    - **Export Options**: Framework conversion and download capabilities
    - **Advanced Tools**: Multi-step generation, framework selection, and responsive design tools
*   **Component Library**: Pre-built templates including login forms, product cards, and dashboard widgets
*   **Multi-Step Generator**: Guided component creation process with iterative refinement
*   **Framework Selector**: Convert components to React, Vue, or Angular with proper syntax
*   **Responsive Designer**: Test and optimize components across different screen sizes
*   **Glass Morphism UI**: Modern, translucent design with gradient effects and smooth animations

## Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS with custom glass morphism effects
*   **UI Components**: Radix UI (Dialog, Tabs), Lucide Icons
*   **AI Backend**: Ollama (must be running locally)
*   **Code Analysis**: Built-in code optimization and suggestions
*   **Linting/Formatting**: ESLint

## Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or v20+)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)
*   [Ollama](https://ollama.ai/) installed and running locally.
    *   Ensure you have pulled the models you intend to use. Supported models include:
        - `qwen3:30b`, `llama2:latest`, `phi4-reasoning:14b`
        - `mistral:latest`, `llava:latest`, `llava:13b`
        - `qwen3:14b`, `gemma3:12b`, `cogito:14b`

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd live-ui-preview
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up Ollama:**
    *   Make sure your Ollama server is running (typically accessible at `http://localhost:11434`).
    *   The application sends requests to `/api/generate` on this Ollama instance.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The application should now be accessible at `http://localhost:5173` (or another port if 5173 is busy).

## Available Scripts

*   `npm run dev`: Starts the development server with hot reloading.
*   `npm run build`: Builds the application for production in the `dist` folder.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run preview`: Serves the production build locally for previewing.

## Project Structure

```
live-ui-preview/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # Base UI components (Button, Card, Dialog, etc.)
│   │   ├── ChatInterface.tsx       # AI chat with model selection
│   │   ├── LiveUIPreview.tsx       # Real-time component preview
│   │   ├── CodeExport.tsx          # Framework export functionality
│   │   ├── ComponentLibrary.tsx    # Pre-built component templates
│   │   ├── MultiStepGenerator.tsx  # Guided component creation
│   │   ├── FrameworkSelector.tsx   # Framework conversion tools
│   │   ├── ResponsiveDesigner.tsx  # Responsive design testing
│   │   └── ThemeBuilder.tsx        # Theme customization
│   ├── lib/             # Core logic and utilities
│   │   ├── codeGenerator.ts        # Ollama API integration
│   │   ├── codeOptimizer.ts        # Code analysis and optimization
│   │   └── utils.ts                # Helper functions
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application with sidebar layout
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles and Tailwind setup
├── package.json         # Project metadata and dependencies
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## How It Works

The application features a modern sidebar interface with five main tabs:

1. **Chat Tab**: Users interact with AI models through a conversational interface. Select from multiple Ollama models and describe the desired UI component.

2. **Preview Tab**: Generated components are rendered in real-time with full interactivity. The preview updates automatically when code is modified.

3. **Code Editor Tab**: Three sub-tabs (HTML, CSS, JavaScript) allow direct code editing with syntax highlighting and real-time preview updates.

4. **Export Tab**: Convert and download components in various formats:
   - Standalone HTML files
   - React components with TypeScript
   - Vue.js components
   - Angular components
   - Copy to clipboard functionality

5. **Advanced Tools Tab**: Access sophisticated features:
   - Multi-step component generation with iterative refinement
   - Framework-specific code conversion
   - Responsive design testing across breakpoints
   - Component library with pre-built templates

The AI integration processes detailed system prompts to generate structured JSON responses containing HTML, CSS, and JavaScript code, which is then parsed and rendered throughout the interface.

## Key Features in Detail

### Sidebar Navigation
- Collapsible sidebar with smooth animations
- Glass morphism design with translucent effects
- Mobile-responsive with hamburger menu
- Active tab highlighting with visual feedback

### Component Library
Pre-built templates include:
- Login forms with validation
- Product cards with hover effects
- Dashboard widgets with analytics
- Responsive navigation components

### Multi-Step Generator
- Guided component creation process
- Iterative refinement based on user feedback
- Step-by-step component building
- Context-aware suggestions

### Framework Conversion
- React: Hooks-based components with TypeScript
- Vue: Composition API with reactive properties
- Angular: Component-based architecture
- Proper syntax highlighting and validation

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

Please make sure your code adheres to the existing linting standards (`npm run lint`).

## Deployment

This application is designed to run on Replit with seamless deployment capabilities. The build process optimizes all assets for production deployment.

## License

(To be determined - e.g., MIT, Apache 2.0. Consider adding a LICENSE file.)

## Changelog

### Version 0.2.0
- **NEW**: Responsive sidebar layout with tabbed navigation
- **NEW**: Component library with pre-built templates
- **NEW**: Multi-step generator for guided component creation
- **NEW**: Framework selector with React/Vue/Angular conversion
- **NEW**: Responsive designer for cross-device testing
- **IMPROVED**: Glass morphism UI design with enhanced visual effects
- **IMPROVED**: Better code organization and TypeScript support
- **IMPROVED**: Enhanced export functionality with multiple formats

### Version 0.1.0
- Initial release with basic AI component generation
- Live preview functionality
- Code editing capabilities
- Basic export options
