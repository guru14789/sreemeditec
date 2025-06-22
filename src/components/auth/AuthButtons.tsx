
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSignIn, useSignUp, useUser } from "@clerk/clerk-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function AuthButtons() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    if (signInLoaded && signIn) {
      try {
        const result = await signIn.create({
          identifier: data.username,
          password: data.password,
        });
        
        if (result.status === "complete") {
          setIsSignInOpen(false);
          window.location.href = "/account";
        }
      } catch (err) {
        console.error("Error signing in:", err);
      }
    }
  };

  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    if (signUpLoaded && signUp) {
      try {
        const result = await signUp.create({
          username: data.username,
          emailAddress: data.email,
          password: data.password,
        });
        
        if (result.status === "complete") {
          setIsSignUpOpen(false);
          window.location.href = "/account";
        }
      } catch (err) {
        console.error("Error signing up:", err);
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Sign In</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Sign in to your account with your username and password.
            </DialogDescription>
          </DialogHeader>
          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4 pt-4">
              <FormField
                control={signInForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
        <DialogTrigger asChild>
          <Button>Sign Up</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Sign up for a new account to access all features.
            </DialogDescription>
          </DialogHeader>
          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4 pt-4">
              <FormField
                control={signUpForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function UserButton() {
  const { user, isSignedIn } = useUser();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { isLoaded, signIn } = useSignIn();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    if (isLoaded && signIn) {
      try {
        const result = await signIn.create({
          identifier: data.username,
          password: data.password,
        });
        
        if (result.status === "complete") {
          setIsSignInOpen(false);
          window.location.href = "/account";
        }
      } catch (err) {
        console.error("Error signing in:", err);
      }
    }
  };

  if (!isSignedIn) {
    return (
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-10 w-10 rounded-full p-0" 
          >
            <span className="sr-only">Sign in</span>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">U</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Sign in to your account with your username and password.
            </DialogDescription>
          </DialogHeader>
          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4 pt-4">
              <FormField
                control={signInForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button 
      variant="ghost" 
      className="h-10 w-10 rounded-full p-0 overflow-hidden" 
    >
      <span className="sr-only">User account</span>
      {user?.imageUrl ? (
        <img 
          src={user.imageUrl} 
          alt={user.fullName || user.username || "User"} 
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-xs font-medium text-primary-foreground">
            {user?.username?.[0] || user?.firstName?.[0] || "U"}
          </span>
        </div>
      )}
    </Button>
  );
}
