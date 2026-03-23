import { useState } from "react";
import { Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import { ROUTES } from "../../constants/routes";

export function VerifierLogin() {
  const { verifierLogin } = useAuth();
  const { navigate } = useAuthNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verificationCode: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mock authentication with 2FA
    if (!formData.email || !formData.password || !formData.verificationCode) {
      toast.error("Please fill in all fields including 2FA code");
      return;
    }

    // Validate 2FA code is 6 digits
    if (!/^\d{6}$/.test(formData.verificationCode)) {
      toast.error("2FA code must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      await verifierLogin(formData.email, formData.password, formData.verificationCode);
      toast.success("Authentication successful. Welcome to admin panel.");

      // Navigate after successful login with safe navigation
      navigate(ROUTES.ADMIN.DASHBOARD, 500);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center">Verifier Login</h1>
          <p className="text-muted-foreground text-center mx-auto max-w-sm">
            Secure access to administrative dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Administrator Access</CardTitle>
            <CardDescription>
              Enter your credentials and 2FA code to continue
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
                    placeholder="admin@institution.edu"
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

              {/* 2FA Code */}
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Two-Factor Authentication Code</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={formData.verificationCode}
                    onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value.replace(/\D/g, '') })}
                    className="pl-10 font-mono tracking-widest text-center"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* Security Notice */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <p className="text-xs text-amber-400 flex items-center gap-2">
                  <Lock className="w-3 h-3 flex-shrink-0" />
                  <span>This is a secure admin portal. All login attempts are monitored and logged.</span>
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 text-white border-0 shadow-lg"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In to Admin Panel"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Need Access?</span>
              </div>
            </div>

            {/* Request Access */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have verifier credentials? </span>
              <Link to="/auth/request-access" className="text-primary font-semibold hover:underline">
                Request Access
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