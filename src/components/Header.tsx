
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b py-4 px-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">
          QuickNoteShare
        </Link>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link to="/new">Nova Nota</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/admin/login">Painel</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
