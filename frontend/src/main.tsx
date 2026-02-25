import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { UserProvider } from "./app/context/UserContext.tsx";
import { I18nProvider } from "./app/context/I18nContext.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <I18nProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </I18nProvider>
);