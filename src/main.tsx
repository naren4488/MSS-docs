import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { seedSampleAgreements } from "@/features/agreement/lib/agreement-storage";
import { seedEmployeeDirectory } from "@/features/employee-directory/lib/employee-directory-storage";
import "./styles/index.css";

// iPad / iPhone Safari prints with its own margins (it ignores @page margin: 0), so a full 297 mm
// A4 page spills a few mm onto an extra, empty sheet — 8 pages became 16. print.css shrinks the pages
// to fit there (owner 19 Nov 2026). iPadOS reports itself as a Mac, hence the touch check.
const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
if (isIOS) document.documentElement.classList.add("is-ios");

seedSampleAgreements();
seedEmployeeDirectory();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
