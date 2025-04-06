import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Github, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GitHubDeployPage = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeploy = async () => {
    if (!repoUrl || !token) {
      setError("Please provide both a repository URL and a GitHub token");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // This is a placeholder for actual GitHub deployment logic
      // In a real implementation, you'd send this to your backend to handle GitHub API calls
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setSuccess("Project successfully connected to GitHub repository. You can now push changes directly from your repository.");
    } catch (err: any) {
      setError(err.message || "Failed to connect to GitHub repository");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">GitHub Deployment</h1>
      <p className="text-muted-foreground">
        Connect your LOYAL COMMUNITY project to a GitHub repository for version control and collaboration.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Repository Setup
          </CardTitle>
          <CardDescription>
            Link your GitHub account and repository to enable automatic deployments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the full URL of your GitHub repository
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="github-token">GitHub Personal Access Token</Label>
            <Input
              id="github-token"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Create a token with 'repo' scope at{" "}
              <a 
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4"
              >
                GitHub Settings <ExternalLink className="h-3 w-3 inline" />
              </a>
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleDeploy} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Connecting..." : "Connect to GitHub"}
          </Button>

          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Next steps after connection:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Clone the repository to your local machine</li>
              <li>Make changes and commit them as needed</li>
              <li>Push your changes to deploy automatically</li>
              <li>Set up CI/CD workflows in GitHub Actions (optional)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GitHubDeployPage;