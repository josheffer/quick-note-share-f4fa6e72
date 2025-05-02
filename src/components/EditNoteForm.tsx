
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { NoteEditor } from "@/components/NoteEditor";
import { supabase } from "@/integrations/supabase/client";

export function EditNoteForm() {
  const [noteId, setNoteId] = useState("");
  const [editCode, setEditCode] = useState("");
  const [note, setNote] = useState<{ content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!noteId) {
      toast({
        title: "Erro",
        description: "ID da nota é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verificar se a nota existe
      const { data: noteData, error: noteError } = await supabase
        .from('notes')
        .select('content, edit_code')
        .eq('id', noteId)
        .maybeSingle();
      
      if (noteError) throw noteError;
      
      if (!noteData) {
        toast({
          title: "Nota não encontrada",
          description: "Não encontramos uma nota com este ID.",
          variant: "destructive",
        });
        return;
      }

      // Verificar se a nota tem código de edição
      if (noteData.edit_code) {
        // Se a nota tem código de edição, verificar se o código fornecido está correto
        if (!editCode) {
          toast({
            title: "Código de edição necessário",
            description: "Esta nota requer um código de edição para ser modificada.",
            variant: "destructive",
          });
          return;
        }
        
        if (noteData.edit_code !== editCode) {
          toast({
            title: "Código inválido",
            description: "O código de edição fornecido está incorreto.",
            variant: "destructive",
          });
          return;
        }
      }

      // Set the note data to edit
      setNote(noteData);
      
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Houve um problema ao recuperar sua nota. Por favor, tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao buscar nota:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (note) {
    return <NoteEditor initialContent={note.content} editMode={true} editCode={editCode} noteId={noteId} />;
  }

  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Editar uma Nota Existente</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="noteId">ID da Nota</Label>
          <Input
            id="noteId"
            placeholder="Digite o ID da nota"
            value={noteId}
            onChange={(e) => setNoteId(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="editCode">Código de Edição (opcional para algumas notas)</Label>
          <Input
            id="editCode"
            type="password"
            placeholder="Digite seu código de edição, se necessário"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verificando..." : "Continuar para Edição"}
        </Button>
      </form>
    </div>
  );
}
