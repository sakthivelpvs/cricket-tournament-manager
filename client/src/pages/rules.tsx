import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, FileText } from "lucide-react";
import type { Rule } from "@shared/schema";

export default function Rules() {
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const { data: rules, isLoading } = useQuery<Rule[]>({
    queryKey: ["/api/rules"],
  });

  useEffect(() => {
    if (rules && rules.length > 0) {
      setContent(rules[0].content);
    }
  }, [rules]);

  const updateMutation = useMutation({
    mutationFn: (data: { content: string }) => 
      rules && rules.length > 0 
        ? apiRequest("PATCH", `/api/rules/${rules[0].id}`, data)
        : apiRequest("POST", "/api/rules", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
      toast({ title: "Rules updated successfully" });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ content });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tournament Rules</h1>
        <p className="text-muted-foreground mt-2">
          Edit and manage tournament rules and regulations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Rules & Regulations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter tournament rules and regulations..."
                className="min-h-96 font-mono text-sm"
                data-testid="textarea-rules"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  data-testid="button-save-rules"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Rules
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
