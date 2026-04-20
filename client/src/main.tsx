import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { StudentProvider } from "./context/StudentContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StudentProvider>
        <App />
      </StudentProvider>
    </QueryClientProvider>
  </StrictMode>
);
