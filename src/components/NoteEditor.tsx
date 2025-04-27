
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditorToolbar } from "./EditorToolbar";
import { MarkdownPreview } from "./MarkdownPreview";

type NoteEditorProps = {
  initialContent?: string;
  editMode?: boolean;
  editCode?: string;
  noteId?: string;
};

export function NoteEditor({ 
  initialContent = "", 
  editMode = false, 
  editCode = "", 
  noteId: existingNoteId = "" 
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFormat = (format: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    let newText;
    if (format.endsWith(' ')) {
      // For line-start formats like lists, quotes, and headings
      newText = beforeText + format + selectedText + afterText;
    } else if (format === '[](url)') {
      // Special case for links
      newText = beforeText + `[${selectedText}](url)` + afterText;
    } else {
      // For wrapping formats like bold, italic, etc.
      newText = beforeText + format + selectedText + format + afterText;
    }

    setContent(newText);
    textarea.focus();
  };

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
      const newEditCode = editMode ? editCode : Math.random().toString(36).substring(2, 8);
      
      if (editMode && existingNoteId) {
        const { error } = await supabase
          .from('notes')
          .update({
            content,
            is_markdown: isMarkdown,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingNoteId)
          .eq('edit_code', editCode);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('notes')
          .insert({
            content,
            is_markdown: isMarkdown,
            edit_code: newEditCode
          })
          .select()
          .single();

        if (error) throw error;
        existingNoteId = data.id;
      }

      toast({
        title: editMode ? "Note Updated!" : "Note Published!",
        description: editMode 
          ? "Your note has been successfully updated." 
          : "Your note has been published. Make sure to save your edit code!",
      });

      if (!editMode) {
        navigate(`/success/${existingNoteId}`, { 
          state: { 
            noteId: existingNoteId, 
            editCode: newEditCode 
          } 
        });
      } else {
        navigate(`/p/${existingNoteId}`);
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
    <div className="flex flex-col space-y-4 w-full max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {editMode ? "Edit Note" : "Create New Note"}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="markdown-mode" 
              checked={isMarkdown}
              onCheckedChange={setIsMarkdown}
            />
            <Label htmlFor="markdown-mode">Markdown</Label>
          </div>
          {isMarkdown && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="preview-mode" 
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
              <Label htmlFor="preview-mode">Preview</Label>
            </div>
          )}
        </div>
      </div>

      {isMarkdown && <EditorToolbar onFormatClick={handleFormat} />}

      <div className={`grid ${showPreview && isMarkdown ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
        <div className="flex flex-col space-y-2">
          <Textarea
            placeholder="Write or paste your content here..."
            className="min-h-[400px] text-base p-4 font-mono"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {showPreview && isMarkdown && (
          <MarkdownPreview content={content} />
        )}
      </div>

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
