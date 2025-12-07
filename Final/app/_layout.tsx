import { Slot } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { NotesProvider } from "../context/NotesContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <Slot />
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
