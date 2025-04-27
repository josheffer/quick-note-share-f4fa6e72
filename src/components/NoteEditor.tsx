
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type NoteEditorProps = {
  initialContent?: string;
  editMode?: boolean;
  editCode?: string;
  noteId?: string;
};

export function NoteEditor({ initialContent = "", editMode = false, editCode = "", noteId = "" }: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call to save the note
      const noteId = editMode ? noteId : Math.random().toString(36).substring(2, 8);
      const generatedEditCode = editMode ? editCode : Math.random().toString(36).substring(2, 8);
      
      // Save to localStorage for demo purposes
      localStorage.setItem(`note_${noteId}`, JSON.stringify({
        content,
        isMarkdown,
        editCode: generatedEditCode,
        createdAt: new Date().toISOString(),
      }));

      toast({
        title: editMode ? "Note Updated!" : "Note Published!",
        description: editMode 
          ? "Your note has been successfully updated." 
          : "Your note has been published. Make sure to save your edit code!",
      });

      if (!editMode) {
        // Navigate to the success page with the note ID and edit code
        navigate(`/success/${noteId}`, { 
          state: { 
            noteId, 
            editCode: generatedEditCode 
          } 
        });
      } else {
        // If editing, navigate to the note view
        navigate(`/p/${noteId}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem publishing your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {editMode ? "Edit Note" : "Create New Note"}
        </h1>
        <div className="flex items-center space-x-2">
          <Switch 
            id="markdown-mode" 
            checked={isMarkdown}
            onCheckedChange={setIsMarkdown}
          />
          <Label htmlFor="markdown-mode">Markdown</Label>
        </div>
      </div>

      <Textarea
        placeholder="Write or paste your content here..."
        className="min-h-[400px] text-base p-4 font-mono"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isPublishing}
          className="min-w-[120px]"
        >
          {isPublishing ? "Publishing..." : editMode ? "Update" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
