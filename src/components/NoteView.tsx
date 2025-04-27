
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import { Copy } from "lucide-react";

interface Note {
  content: string;
  isMarkdown: boolean;
  createdAt: string;
}

export function NoteView() {
  const { noteId } = useParams<{ noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        // In a real app, this would be an API call
        const noteData = localStorage.getItem(`note_${noteId}`);
        
        if (noteData) {
          setNote(JSON.parse(noteData));
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    
    toast({
      title: "Link Copied!",
      description: "The link to this note has been copied to your clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Note Not Found</h2>
        <p className="mb-6">The note you're looking for doesn't exist or might have been removed.</p>
      </div>
    );
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="animate-slide-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Published on {formattedDate}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleCopyLink}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Link
        </Button>
      </div>
      
      <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
        {note.isMarkdown ? (
          <ReactMarkdown>{note.content}</ReactMarkdown>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-base">{note.content}</pre>
        )}
      </div>
    </div>
  );
}
