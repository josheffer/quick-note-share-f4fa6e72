
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Quote, 
  List, 
  Link, 
  Heading1, 
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditorToolbarProps {
  onFormatClick: (format: string) => void;
}

export function EditorToolbar({ onFormatClick }: EditorToolbarProps) {
  const tools = [
    { icon: Bold, label: "Negrito", format: "**" },
    { icon: Italic, label: "Itálico", format: "*" },
    { icon: Strikethrough, label: "Tachado", format: "~~" },
    { icon: Code, label: "Código", format: "`" },
    { icon: Quote, label: "Citação", format: "> " },
    { icon: List, label: "Lista", format: "- " },
    { icon: Heading1, label: "Título 1", format: "# " },
    { icon: Heading2, label: "Título 2", format: "## " },
    { icon: Link, label: "Link", format: "[](url)" },
    { icon: AlignLeft, label: "Alinhar à Esquerda", format: "::: left\n" },
    { icon: AlignCenter, label: "Centralizar", format: "::: center\n" },
    { icon: AlignRight, label: "Alinhar à Direita", format: "::: right\n" },
    { icon: Table, label: "Tabela", format: "\n| Coluna 1 | Coluna 2 |\n|----------|----------|\n| Item 1   | Item 2   |\n" }
  ];

  return (
    <div className="flex flex-wrap gap-1 p-1 border rounded-md bg-muted/50 mb-2">
      <TooltipProvider>
        {tools.map((tool) => (
          <Tooltip key={tool.label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onFormatClick(tool.format)}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
