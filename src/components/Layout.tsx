
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 container px-4">
          <Outlet />
        </main>
        <footer className="py-6 border-t">
          <div className="container text-center text-sm text-muted-foreground">
            <p>QuickNoteShare — Simple, fast text sharing without signup</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
