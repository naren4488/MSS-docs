import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { seedSampleAgreements } from "@/features/agreement/lib/agreement-storage";
import { seedEmployeeDirectory } from "@/features/employee-directory/lib/employee-directory-storage";
import "./styles/index.css";

seedSampleAgreements();
seedEmployeeDirectory();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
