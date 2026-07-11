
  import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./app/components/common/ErrorBoundary";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
  
