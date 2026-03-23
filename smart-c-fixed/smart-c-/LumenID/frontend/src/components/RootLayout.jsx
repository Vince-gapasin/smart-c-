import { Outlet } from "react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "./ThemeProvider";
import { CosmicBackground } from "./CosmicBackground";
import { Toaster } from "./ui/sonner";

export function RootLayout() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen" style={{ backgroundColor: '#0A0A0E' }}>
        <CosmicBackground />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}