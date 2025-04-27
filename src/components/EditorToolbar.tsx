
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
  Heading2 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditorToolbarProps {
  onFormatClick: (format: string) => void;
}

export function EditorToolbar({ onFormatClick }: EditorToolbarProps) {
  const tools = [
    { icon: Bold, label: "Bold", format: "**" },
    { icon: Italic, label: "Italic", format: "*" },
    { icon: Strikethrough, label: "Strikethrough", format: "~~" },
    { icon: Code, label: "Code", format: "`" },
    { icon: Quote, label: "Quote", format: "> " },
    { icon: List, label: "List", format: "- " },
    { icon: Heading1, label: "Heading 1", format: "# " },
    { icon: Heading2, label: "Heading 2", format: "## " },
    { icon: Link, label: "Link", format: "[](url)" }
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
