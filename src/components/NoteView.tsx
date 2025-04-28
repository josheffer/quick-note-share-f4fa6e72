
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, FileText, FileDown, AlertTriangle } from "lucide-react";
import { ReportNoteDialog } from "./ReportNoteDialog";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Note {
  id: string;
  content: string;
  is_markdown: boolean;
  created_at: string;
}

export function NoteView() {
  const { noteId } = useParams<{ noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (!noteId) return;
        
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', noteId)
          .single();

        if (error) throw error;
        setNote(data);

        // Incrementar visualizações
        await supabase.rpc('increment_views', { note_id: noteId });
      } catch (error) {
        console.error("Erro ao buscar nota:", error);
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
      title: "Link Copiado!",
      description: "O link desta nota foi copiado para sua área de transferência.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-center">
          <p className="text-lg">Carregando nota...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Nota Não Encontrada</h2>
        <p className="mb-6">A nota que você procura não existe ou pode ter sido removida.</p>
      </div>
    );
  }

  const formattedDate = new Date(note.created_at).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="animate-slide-in">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Publicada em {formattedDate}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copiar Link
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`/p/${noteId}/raw`, '_blank')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Texto Puro
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`/p/${noteId}/pdf`, '_blank')}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowReportDialog(true)}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Denunciar
          </Button>
        </div>
      </div>
      
      <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
        {note.is_markdown ? (
          <ReactMarkdown>{note.content}</ReactMarkdown>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-base">{note.content}</pre>
        )}
      </div>

      <ReportNoteDialog 
        noteId={note.id}
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
      />
    </div>
  );
}
