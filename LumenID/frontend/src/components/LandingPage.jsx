import { useNavigate } from "react-router";
import { ArrowRight, Shield, Award, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  IssuerIcon,
  HolderIcon,
  VerifierIcon,
  BlockchainAnchorIcon,
  ZKProofIcon,
  IPFSLinkIcon,
  TrustTriangle,
} from "./icons/LumenIcons";
import { LumenCard3D } from "./LumenCard3D";
import { JumpingScroll } from "./ui/JumpingScroll";
import { Typography } from "./ui/typography";
import { ROUTES } from "../constants/routes";

export function LandingPage() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Organization",
      description: "Issue and verify credentials with blockchain trust",
      subtitle: "For Institutions & Employers",
      icon: IssuerIcon,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      features: [
        "W3C-Compliant Credentials",
        "Multi-Sig Authorization",
        "Blockchain Anchoring",
        "Instant Verification"
      ],
      path: ROUTES.AUTH.VERIFIER_LOGIN,
      buttonText: "Admin Portal"
    },
    {
      title: "User",
      description: "Store and manage your digital credentials securely",
      subtitle: "For Students & Individuals",
      icon: HolderIcon,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      features: [
        "Share Credentials Instantly",
        "Secure Digital Wallet",
        "Zero-Knowledge Proofs",
        "Privacy-First Design"
      ],
      path: ROUTES.AUTH.CUSTOMER_LOGIN,
      buttonText: "Access Vault"
    },
    {
      title: "Relying Party",
      description: "Instantly verify cryptographic credentials",
      subtitle: "For Verifiers & Employers",
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

  const features = [
    {
      icon: IssuerIcon,
      title: "W3C-Compliant",
      description: "Industry-standard verifiable credentials",
      color: "from-violet-500 to-fuchsia-500",
      glow: "shadow-violet-500/20",
    },
    {
      icon: BlockchainAnchorIcon,
      title: "Polkadot Network",
      description: "Secure blockchain infrastructure",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: ZKProofIcon,
      title: "Zero-Knowledge Proofs",
      description: "Privacy-preserving verification",
      color: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/20",
    },
  ];

  return (
    <div className="relative">

      {/* ==================== SECTION 1: HERO (100vh) ==================== */}
      <section className="min-h-screen relative flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-7xl w-full mx-auto py-12 md:py-20 relative z-[2]">
          <div className="flex flex-col items-center text-center">
            {/* Hero Content */}
            <div className="text-center space-y-8 md:space-y-12 relative z-10">
              {/* Main Title */}
              <div className="space-y-4 md:space-y-6">
                <Typography.H1 className="text-5xl md:text-6xl lg:text-7xl">
                  <span className="text-white">Lumen</span>
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">ID</span>
                </Typography.H1>
                <Typography.H2 className="text-2xl md:text-3xl lg:text-4xl">
                  <span className="text-white/90">Digital Trust,</span>
                  {' '}
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Secured.</span>
                </Typography.H2>
              </div>

              {/* Visual Separator */}
              <div className="flex justify-center">
                <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              </div>

              {/* Value Proposition */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <Typography.P className="text-lg md:text-xl text-white/80">
                  Issue, store, and verify credentials using blockchain technology.
                </Typography.P>
                <Typography.P className="text-base text-muted-foreground">
                  Fast, secure, and privacy-first design for the modern web.
                </Typography.P>
              </div>
            </div>

            {/* 3D Floating Card - Centered */}
            <div className="mt-12 md:mt-16 h-[300px] md:h-[400px] w-full flex items-center justify-center">
              <LumenCard3D />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <JumpingScroll />
      </section>

      {/* ==================== SECTION 2: FEATURES & TRUST (100vh) ==================== */}
      <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-background via-primary/5 to-background border-y border-primary/10">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-[2]">

          {/* Features */}
          <div className="mb-20 relative">
            <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto space-y-4">
              <Typography.H2 className="text-3xl md:text-4xl lg:text-5xl">
                Built on Web3 Standards
              </Typography.H2>
              <Typography.P>
                Industry-leading technology stack ensuring security, privacy, and interoperability.
              </Typography.P>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="border-2 border-border/50 bg-card/60 backdrop-blur-xl hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group"
                  >
                    <CardContent className="p-8 text-center space-y-6">
                      <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg ${feature.glow || ""} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={40} className="text-white" aria-hidden="true" />
                      </div>
                      <div className="space-y-3">
                        <Typography.H3 className="text-xl md:text-2xl">
                          {feature.title}
                        </Typography.H3>
                        <Typography.P className="text-sm md:text-base">
                          {feature.description}
                        </Typography.P>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Trust Triangle */}
          <div>
            <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto space-y-4">
              <Typography.H2 className="text-3xl md:text-4xl lg:text-5xl">
                A Three-Party Trust Model
              </Typography.H2>
              <Typography.P>
                Institutions issue credentials, individuals hold them securely, and employers verify instantly—all connected through blockchain trust.
              </Typography.P>
            </div>

            <div className="flex justify-center">
              <TrustTriangle size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: GET STARTED (100vh) ==================== */}
      <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-background to-primary/10">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-[2]">

          {/* CTA Cards */}
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto space-y-4">
              <Typography.H2 className="text-3xl md:text-4xl lg:text-5xl">
                Get Started with LumenID
              </Typography.H2>
              <Typography.P>
                Access your identity vault, verify credentials, or manage your organization's issues.
              </Typography.P>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Card
                    key={role.title}
                    className="border-2 border-border/50 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group bg-card/60 backdrop-blur-xl hover:shadow-2xl"
                  >
                    {/* Gradient glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} rounded-lg blur-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                    {/* Perfect Center Layout */}
                    <div className="relative z-10 p-8 text-center space-y-8">

                      {/* Icon */}
                      <div className="flex justify-center">
                        <div className={`w-24 h-24 bg-gradient-to-br ${role.gradient} rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <Icon className="w-12 h-12 text-white" aria-hidden="true" />
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-3">
                        <Typography.H3 className="text-2xl lg:text-3xl">
                          {role.title}
                        </Typography.H3>
                        <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                          {role.subtitle}
                        </p>
                      </div>

                      {/* Description */}
                      <Typography.P className="text-sm md:text-base max-w-xs mx-auto">
                        {role.description}
                      </Typography.P>

                      {/* Features */}
                      <div className="space-y-3 max-w-xs mx-auto">
                        {role.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="pt-4">
                        <Button
                          onClick={() => navigate(role.path)}
                          className={`w-full max-w-xs h-14 text-base bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white border-0 shadow-xl group-hover:shadow-2xl transition-all group/btn`}
                        >
                          {role.buttonText}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Footer Tagline */}
          <div className="text-center py-8 border-t border-border/30">
            <Typography.Small className="text-muted-foreground">
              Secured by Polygon • Verified by Blockchain • Trusted by Institutions
            </Typography.Small>
          </div>
        </div>
      </section>

    </div>
  );
}