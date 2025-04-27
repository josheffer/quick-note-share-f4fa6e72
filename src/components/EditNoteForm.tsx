
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { NoteEditor } from "@/components/NoteEditor";

export function EditNoteForm() {
  const [noteId, setNoteId] = useState("");
  const [editCode, setEditCode] = useState("");
  const [note, setNote] = useState<{ content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!noteId || !editCode) {
      toast({
        title: "Error",
        description: "Both note ID and edit code are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would verify the edit code against the API
      const noteData = localStorage.getItem(`note_${noteId}`);
      
      if (!noteData) {
        toast({
          title: "Note Not Found",
          description: "We couldn't find a note with that ID.",
          variant: "destructive",
        });
        return;
      }

      const parsedNote = JSON.parse(noteData);
      
      if (parsedNote.editCode !== editCode) {
        toast({
          title: "Invalid Edit Code",
          description: "The edit code you provided is incorrect.",
          variant: "destructive",
        });
        return;
      }

      // Set the note data to edit
      setNote(parsedNote);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem retrieving your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (note) {
    return <NoteEditor initialContent={note.content} editMode={true} editCode={editCode} noteId={noteId} />;
  }

  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Edit an Existing Note</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="noteId">Note ID</Label>
          <Input
            id="noteId"
            placeholder="Enter the note ID"
            value={noteId}
            onChange={(e) => setNoteId(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="editCode">Edit Code</Label>
          <Input
            id="editCode"
            type="password"
            placeholder="Enter your edit code"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Continue to Edit"}
        </Button>
      </form>
    </div>
  );
}
