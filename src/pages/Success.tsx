
import { useLocation, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Success() {
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if we have state data
  if (!location.state?.noteId || !location.state?.editCode) {
    return <Navigate to="/" replace />;
  }

  const { noteId, editCode } = location.state;
  const noteUrl = `${window.location.origin}/p/${noteId}`;

  const handleCopyUrl = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: message,
    });
  };

  return (
    <div className="container max-w-2xl py-12 animate-slide-in">
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="bg-green-50 dark:bg-green-950/30">
          <CardTitle className="text-center text-green-700 dark:text-green-400">
            🎉 Note Published Successfully!
          </CardTitle>
          <CardDescription className="text-center">
            Your note is now available online
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <Label htmlFor="note-url">Note URL</Label>
            <div className="flex mt-1.5">
              <Input
                id="note-url"
                value={noteUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                className="ml-2" 
                onClick={() => handleCopyUrl(noteUrl, "Note URL copied to clipboard")}
              >
                Copy
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-code" className="flex items-center">
              <span>Edit Code</span> 
              <span className="text-sm text-red-500 ml-1">(Save this somewhere safe!)</span>
            </Label>
            <div className="flex mt-1.5">
              <Input
                id="edit-code"
                value={editCode}
                type="password"
                readOnly
                className="flex-1"
              />
              <Button 
                className="ml-2"
                onClick={() => handleCopyUrl(editCode, "Edit code copied to clipboard")}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              You'll need this code if you want to edit your note later.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-col sm:flex-row gap-2">
          <Button asChild variant="outline">
            <Link to="/">Create Another Note</Link>
          </Button>
          <Button asChild>
            <Link to={`/p/${noteId}`}>View My Note</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
