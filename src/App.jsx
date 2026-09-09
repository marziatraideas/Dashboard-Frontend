import { AuthProvider } from "./provider/AuthProvider.jsx";
import { DeskProvider } from "./provider/DeskProvider.jsx";
import { UiProvider } from "./provider/UiProvider.jsx";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { Overlays } from "./components/Overlays.jsx";

export default function App() {
  return (
    <UiProvider>
      <DeskProvider>
        <AuthProvider>
          <AppRoutes />
          <Overlays />
        </AuthProvider>
      </DeskProvider>
    </UiProvider>
  );
}
