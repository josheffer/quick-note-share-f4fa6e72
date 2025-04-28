
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Note {
  id: string;
  content: string;
  slug: string;
  created_at: string;
  updated_at: string;
  report_status: string;
  views: number;
}

export default function AdminNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar notas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta nota?")) {
      try {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Nota excluída",
          description: "A nota foi excluída com sucesso.",
        });

        // Atualizar lista de notas
        fetchNotes();
      } catch (error: any) {
        toast({
          title: "Erro ao excluir nota",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  const truncateContent = (content: string, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciar Notas</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Todas as Notas</CardTitle>
          <CardDescription>
            Gerencie todas as notas publicadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Carregando notas...</div>
          ) : (
            <Table>
              <TableCaption>Lista de todas as notas publicadas</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug/ID</TableHead>
                  <TableHead>Conteúdo</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Visualizações</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhuma nota encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">
                        {note.slug || note.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>{truncateContent(note.content)}</TableCell>
                      <TableCell>{formatDate(note.created_at)}</TableCell>
                      <TableCell>{note.views}</TableCell>
                      <TableCell>
                        {note.report_status !== 'none' ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Denunciada
                          </Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/p/${note.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(note.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
