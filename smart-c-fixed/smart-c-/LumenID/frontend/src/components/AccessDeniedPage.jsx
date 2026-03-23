import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Shield, ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function AccessDeniedPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoToDashboard = () => {
    if (user?.role === "customer") {
      navigate("/customer/dashboard", { replace: true });
    } else if (user?.role === "verifier") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative flex justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl rounded-full border border-red-500/30 flex items-center justify-center">
            <Shield className="w-16 h-16 md:w-20 md:h-20 text-red-500/80" />
          </div>
          <div className="absolute -top-2 -right-2 md:top-0 md:right-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center border-4 border-background animate-pulse">
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-red-500">Access Denied</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            You don't have permission to access this page. This area is restricted to authorized users only.
          </p>

          {isAuthenticated && user && (
            <div className="p-4 bg-secondary/50 rounded-lg border border-border/50 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground">
                You are currently logged in as:{" "}
                <span className="font-semibold text-foreground">
                  {user.role === "customer" ? "Customer" : user.role === "verifier" ? "Verifier" : "User"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto min-w-[180px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          {isAuthenticated ? (
            <Button
              size="lg"
              onClick={handleGoToDashboard}
              className="w-full sm:w-auto min-w-[180px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white border-0"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => navigate("/auth/role-selection")}
              className="w-full sm:w-auto min-w-[180px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white border-0"
            >
              <Home className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground mb-2">Need access?</p>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto">
            If you believe you should have access to this page, please contact your administrator or sign in with the appropriate account type.
          </p>
        </div>
      </div>
    </div>
  );
}