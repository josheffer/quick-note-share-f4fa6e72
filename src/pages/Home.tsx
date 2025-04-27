
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="py-12 px-6 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Share Text Notes Quickly and Easily
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          QuickNoteShare lets you create and share text notes without any signup.
          Write, publish, and share in seconds. Simple, fast, and private.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="text-lg">
            <Link to="/new">Create New Note</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg">
            <Link to="/edit">Edit Existing Note</Link>
          </Button>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">No Sign-Up Required</h2>
            <p className="text-muted-foreground">
              Create and share notes instantly without creating an account or providing any personal information.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Markdown Support</h2>
            <p className="text-muted-foreground">
              Format your notes with Markdown for better readability, or use plain text if you prefer.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Simple & Fast</h2>
            <p className="text-muted-foreground">
              Clean, minimalist interface focused on your content with no distractions or ads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
