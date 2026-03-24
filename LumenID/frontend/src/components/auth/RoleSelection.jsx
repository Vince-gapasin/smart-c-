import { useNavigate, useLocation } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";
import { HolderIcon, IssuerIcon, VerifierIcon } from "../icons/LumenIcons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ROUTES } from "../../constants/routes";

export function RoleSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle going back - always go to home page
  const handleGoBack = () => {
    navigate(ROUTES.HOME);
  };

  const roles = [
    {
      title: "Organization",
      description: "Issue and verify credentials with blockchain trust",
      subtitle: "For Institutions",
      icon: IssuerIcon,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      features: [
        "Dashboard Access",
        "Review Submissions",
        "Approve Credentials",
        "Manage Queue"
      ],
      path: ROUTES.AUTH.VERIFIER_LOGIN,
      buttonText: "Admin Portal"
    },
    {
      title: "User",
      description: "Store and manage digital credentials securely",
      subtitle: "For Students",
      icon: HolderIcon,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      features: [
        "Manage Profile",
        "Receive Credentials",
        "Zero-Knowledge Sharing",
        "IPFS Portfolio"
      ],
      path: ROUTES.AUTH.CUSTOMER_LOGIN,
      buttonText: "Access Vault",
      secondaryButton: {
        text: "Create Account",
        path: ROUTES.AUTH.CUSTOMER_SIGNUP
      }
    },
    {
      title: "Relying Party",
      description: "Instantly verify cryptographic credentials",
      subtitle: "For Verifiers",
      icon: VerifierIcon,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      features: [
        "Zero-Trust Verification",
        "On-Chain Integrity",
        "One-Click Scanning",
        "Instant Results"
      ],
      path: ROUTES.VERIFY,
      buttonText: "Verify Credential"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4 relative">
      <div className="max-w-7xl w-full space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Header - Centered */}
        <div className="text-center space-y-4">
          <Typography.H1 className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Role
          </Typography.H1>
          <Typography.P className="max-w-2xl mx-auto">
            Select your primary account type to proceed with authentication.
          </Typography.P>
        </div>

        {/* Role Cards - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.title}
                className="border-2 border-border/50 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden bg-card/40 backdrop-blur-xl"
              >
                {/* Gradient glow effect */}
                <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${role.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`} />

                <CardHeader className="relative z-10 space-y-4 p-6 text-center">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${role.gradient} rounded-2xl flex items-center justify-center shadow-lg mx-auto`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <Typography.H3 className="text-xl">{role.title}</Typography.H3>
                    <Typography.Small className="text-muted-foreground uppercase tracking-wider">{role.subtitle}</Typography.Small>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <ul className="space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm justify-center">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.gradient} flex-shrink-0 mt-2`} />
                          <span className="text-muted-foreground leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 px-6 pb-6 pt-0 space-y-3 text-center">
                  <Button
                    onClick={() => navigate(role.path)}
                    className={`w-full max-w-xs mx-auto bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white border-0 shadow-lg h-11 text-sm font-semibold group/btn transition-all`}
                  >
                    {role.buttonText || `Continue as ${role.title}`}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                  {role.secondaryButton && (
                    <Button
                      onClick={() => navigate(role.secondaryButton.path)}
                      variant="outline"
                      className={`w-full max-w-xs mx-auto h-11 text-sm font-semibold hover:bg-secondary/50 transition-all`}
                    >
                      {role.secondaryButton.text}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Go Back Button - Centered Below Cards */}
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="gap-2 hover:bg-white/5 transition-all h-10 px-4 text-white/90 hover:text-white border border-white/10 hover:border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Go Back</span>
          </Button>
        </div>
      </div>
    </div>
  );
}