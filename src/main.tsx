import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initDb } from "./db/init";

async function bootstrap() {
  const rootEl = document.getElementById("root")!;
  const root = ReactDOM.createRoot(rootEl);

  try {
    await initDb();
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } catch (err) {
    console.error("Gagal menginisialisasi database:", err);
    root.render(
      <div role="alert">
        Gagal memuat database aplikasi. Silakan restart aplikasi.
      </div>,
    );
  }
}

bootstrap();
