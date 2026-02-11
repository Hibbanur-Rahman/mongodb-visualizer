import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";

// Detect the base path from the script src or current URL
// This allows the app to work when mounted at any path (e.g., /visualizer, /models, etc.)
const getBasename = () => {
  const path = window.location.pathname;

  // Remove any React Router paths from the current URL
  const routePaths = ['/model/'];
  let cleanPath = path;

  for (const routePath of routePaths) {
    if (cleanPath.includes(routePath)) {
      cleanPath = cleanPath.split(routePath)[0];
      break;
    }
  }

  // Remove trailing slash (unless it's the root)
  if (cleanPath.endsWith('/') && cleanPath !== '/') {
    cleanPath = cleanPath.slice(0, -1);
  }

  localStorage.setItem('basename', cleanPath);

  // If root path, return empty string
  return cleanPath === '/' ? '' : cleanPath;
};

const basename = getBasename();
console.log('React Router basename:', basename);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
