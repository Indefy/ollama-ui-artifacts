# PocketAI Chat - Interactive UI Component Canvas (live-ui-preview)

Version: 0.1.0
Author: Adi Booker ([Indefy on GitHub](https://github.com/Indefy))

An interactive web application that allows users to generate UI components using AI (powered by Ollama), preview them live, edit the code, and export them in various formats.

## Features

*   **AI-Powered UI Generation**: Describe the UI component you want, and the AI will generate HTML, CSS, and JavaScript.
*   **Model Selection**: Choose from various Ollama models to tailor the generation process.
*   **Live Preview**: Instantly see the generated component rendered in the browser.
*   **Code Editing**: Modify the generated HTML, CSS, and JS directly in the integrated editor; the preview updates in real-time.
*   **Code Export**:
    *   Download standalone HTML files.
    *   Export as React, Vue, or Angular components.
    *   Copy code snippets to the clipboard.
    *   Preview code before downloading.
*   **Responsive Design**: The application interface is designed to be user-friendly on various screen sizes.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **UI Components**: Radix UI (Dialog, Tabs), Lucide Icons
*   **AI Backend**: Ollama (must be running locally)
*   **Linting/Formatting**: ESLint

## Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or v20+)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)
*   [Ollama](https://ollama.ai/) installed and running locally.
    *   Ensure you have pulled the models you intend to use (e.g., `ollama pull mistral:latest`). The application allows selecting from a list of available models it expects.

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

## Project Structure (Key Directories)

\`\`\`
live-ui-preview/
├── public/              # Static assets
├── src/
│   ├── components/      # React components (ChatInterface, LiveUIPreview, CodeExport, etc.)
│   ├── lib/             # Core logic (e.g., codeGenerator.ts for Ollama API interaction)
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point of the application
│   └── index.css        # Global styles and Tailwind CSS setup
├── .gitignore           # Files and folders ignored by Git
├── package.json         # Project metadata and dependencies
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
\`\`\`

## How It Works

The user types a prompt into the chat interface (e.g., "Create a blue login button"). This prompt, along with a selected Ollama model, is sent to a local Ollama instance via the `codeGenerator.ts` module. The Ollama model processes a detailed system prompt instructing it to return HTML, CSS, and JavaScript code formatted as a JSON object.

The application then parses this JSON response. The HTML, CSS, and JS are used to:
1.  Update the "Live UI Preview" panel, rendering the component.
2.  Populate the "Code Editor" tabs, allowing users to inspect and modify the generated code.
3.  Feed into the "Code Export" panel, where users can choose different framework formats and download/copy the code.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

Please make sure your code adheres to the existing linting standards (`npm run lint`).

## License

(To be determined - e.g., MIT, Apache 2.0. Consider adding a LICENSE file.) 