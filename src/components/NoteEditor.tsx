
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  const [slug, setSlug] = useState("");
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
      newText = beforeText + format + selectedText + afterText;
    } else if (format === '[](url)') {
      newText = beforeText + `[${selectedText}](url)` + afterText;
    } else {
      newText = beforeText + format + selectedText + format + afterText;
    }

    setContent(newText);
    textarea.focus();
  };

  const handleCancel = () => {
    if (window.confirm('Deseja realmente cancelar? Todas as alterações serão perdidas.')) {
      navigate('/');
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo da nota não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      const newEditCode = editMode ? editCode : Math.random().toString(36).substring(2, 8);
      const noteData = {
        content,
        is_markdown: isMarkdown,
        edit_code: newEditCode,
        ...(slug && { slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
      };
      
      if (editMode && existingNoteId) {
        const { error } = await supabase
          .from('notes')
          .update({
            ...noteData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingNoteId)
          .eq('edit_code', editCode);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('notes')
          .insert(noteData)
          .select()
          .single();

        if (error) throw error;
        existingNoteId = data.id;
      }

      toast({
        title: editMode ? "Nota Atualizada!" : "Nota Publicada!",
        description: editMode 
          ? "Sua nota foi atualizada com sucesso." 
          : "Sua nota foi publicada. Guarde o código de edição!",
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
        title: "Erro",
        description: "Houve um problema ao publicar sua nota. Por favor, tente novamente.",
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
          {editMode ? "Editar Nota" : "Criar Nova Nota"}
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
              <Label htmlFor="preview-mode">Visualização</Label>
            </div>
          )}
        </div>
      </div>

      {!editMode && (
        <div className="flex items-center space-x-2">
          <Label htmlFor="slug">URL Personalizada (opcional)</Label>
          <Input
            id="slug"
            placeholder="minha-nota"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="max-w-xs"
          />
        </div>
      )}

      {isMarkdown && <EditorToolbar onFormatClick={handleFormat} />}

      <div className={`grid ${showPreview && isMarkdown ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
        <div className="flex flex-col space-y-2">
          <Textarea
            placeholder="Escreva ou cole seu conteúdo aqui..."
            className="min-h-[400px] text-base p-4 font-mono"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {showPreview && isMarkdown && (
          <MarkdownPreview content={content} />
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          variant="outline"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isPublishing}
          className="min-w-[120px]"
        >
          {isPublishing ? "Publicando..." : editMode ? "Atualizar" : "Publicar"}
        </Button>
      </div>
    </div>
  );
}
