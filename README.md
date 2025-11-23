# Aussie Joke Mate 🦘

A lively web widget designed to help non-native speakers learn Australian English through humor, specifically targeting slang and IELTS Band 7+ vocabulary.

## Languages & Technologies

*   **Core Language:** TypeScript (TSX)
*   **Frontend Library:** React 19
*   **Styling:** Tailwind CSS (via CDN)
*   **Typography:** Inter (Google Fonts)
*   **Icons:** Lucide React
*   **AI Integration:** Google GenAI SDK (`@google/genai`)
*   **Image Generation:** `html-to-image`

## System Architecture

The application is architected as a lightweight, client-side Single Page Application (MVP). It operates entirely in the browser without a dedicated backend server for data storage.

### 1. AI-Driven Content Generation
*   **Model:** `gemini-2.5-flash` via Google Gemini API.
*   **Mechanism:** The app sends a structured prompt to the API requesting a joke with specific educational breakdowns (slang, vocabulary, cultural context).
*   **Data Format:** The AI returns strict JSON, which is parsed and rendered dynamically by the React frontend.
*   **Service:** Implemented in `services/geminiService.ts`.

### 2. Data Persistence (Local-First)
*   **Database:** Uses the browser's `localStorage` API.
*   **User Session:** Simulates authentication by storing the username locally.
*   **Favorites System:** Stores the full JSON object of favorite jokes locally to allow offline access to favorites.
*   **Service:** Implemented in `services/storageService.ts`.

### 3. Frontend Structure
*   **Entry Point:** `index.html` uses an ES Module `importmap` to load React and other dependencies directly from a CDN.
*   **State Management:** React `useState` and `useEffect` hooks manage the application lifecycle (Login -> Dashboard -> Favorites).
*   **Export:** Uses `html-to-image` to rasterize the DOM element of the joke card into a PNG for download.

### 4. Directory Structure
*   `components/`: Reusable UI elements (JokeCard, Buttons, Login).
*   `services/`: Business logic separated from UI (Gemini API calls, LocalStorage management).
*   `types.ts`: TypeScript interfaces ensuring type safety across the application.
