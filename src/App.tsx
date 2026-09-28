import { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import Chat from "./pages/Chat";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import { checkBackendHealth, type HealthStatus } from "./services/chatApi";

function WorkspaceLayout() {
  const [health, setHealth] = useState<HealthStatus>("checking");

  const refreshHealth = useCallback(async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    const online = await checkBackendHealth(controller.signal);
    window.clearTimeout(timeout);
    setHealth(online ? "online" : "offline");
  }, []);

  useEffect(() => {
    void refreshHealth();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshHealth();
    }, 30000);
    return () => window.clearInterval(interval);
  }, [refreshHealth]);

  return (
    <AppShell
      health={health}
      onCheckHealth={() => {
        void refreshHealth();
      }}
    >
      <Outlet />
    </AppShell>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#fbfcfb] px-6 text-center text-[#47534d]">
      <p className="m-0 text-sm font-semibold uppercase tracking-widest text-[#7c9485]">
        404
      </p>
      <h1 className="m-0 font-['Manrope'] text-3xl font-semibold">
        Page not found
      </h1>
      <p className="m-0 text-sm text-[#89928e]">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        className="mt-2 rounded-lg bg-[#347358] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2b654d]"
        to="/chat"
      >
        Go to assistant
      </Link>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkspaceLayout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<Chat />} />
          <Route path="library" element={<Library />} />
          <Route path="explore" element={<Explore />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
