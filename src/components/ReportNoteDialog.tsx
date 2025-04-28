
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const REPORT_REASONS = [
  { value: "underage", label: "Conteúdo para menores" },
  { value: "scam", label: "Golpe financeiro" },
  { value: "personal_info", label: "Informações pessoais" },
  { value: "illegal", label: "Outro conteúdo ilegal" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Outra coisa" }
];

interface ReportNoteDialogProps {
  noteId: string;
  open: boolean;
  onClose: () => void;
}

export function ReportNoteDialog({ noteId, open, onClose }: ReportNoteDialogProps) {
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason || !email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          note_id: noteId,
          reason,
          email,
          message: message.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Denúncia Enviada",
        description: "Obrigado por nos ajudar a manter a comunidade segura.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua denúncia. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Denunciar Nota</DialogTitle>
          <DialogDescription>
            Explique por que esta nota deveria ser analisada pela nossa equipe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da denúncia *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem adicional</Label>
            <Textarea
              id="message"
              placeholder="Detalhes adicionais sobre a denúncia..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Sua denúncia será enviada para a nossa equipe e será analisada conforme nossos Termos de Uso.
          </p>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar denúncia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
