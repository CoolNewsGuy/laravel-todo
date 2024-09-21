import "./bootstrap";
import "../css/app.css";

import { createRoot, hydrateRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "./Components/ThemeProvider";
import { Toaster } from "./components/ui/toaster";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx"),
    ),
  setup({ el, App, props }) {
    if (import.meta.env.SSR) {
      hydrateRoot(
        el,
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster />
          <App {...props} />
        </ThemeProvider>,
      );
      return;
    }

    createRoot(el).render(
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <App {...props} />
      </ThemeProvider>,
    );
  },
  progress: {
    color: "#4B5563",
  },
});
