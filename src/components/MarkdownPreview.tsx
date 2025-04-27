
import ReactMarkdown from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-sm sm:prose dark:prose-invert max-w-none border rounded-md p-4 min-h-[400px] bg-card">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
