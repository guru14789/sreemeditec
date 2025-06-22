
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setAdminCredentials } from "./RequireAuth";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = setAdminCredentials(username, password);
    
    if (success) {
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard",
      });
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
      toast({
        title: "Admin Login Failed",
        description: "Please check your username and password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <div className="text-sm text-muted-foreground">
              <strong>Note:</strong> For demo purposes, use the following credentials:
              <br />
              Username: admin
              <br />
              Password: admin123
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Login as Admin</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default AdminLogin;
