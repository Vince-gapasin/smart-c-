import { useState } from "react";
import { Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import { ROUTES } from "../../constants/routes";

export function CustomerLogin() {
  const { login } = useAuth();
  const { navigate } = useAuthNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password, "customer");
      toast.success("Welcome back! Redirecting to your dashboard...");

      // Navigate after successful login with safe navigation
      navigate(ROUTES.CUSTOMER.DASHBOARD, 500);
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl shadow-lg mb-3 sm:mb-4">
            <UserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center">Customer Login</h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center mx-auto max-w-sm px-4">
            Access your credential management portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-2">
          <CardHeader className="space-y-2 pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Sign in to your account</CardTitle>
            <CardDescription className="text-sm">
              Enter your credentials to access your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white border-0 shadow-lg"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Create Account Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/auth/customer-signup" className="text-primary font-semibold hover:underline">
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/auth/role-selection" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to role selection
          </Link>
        </div>
      </div>
    </div>
  );
}