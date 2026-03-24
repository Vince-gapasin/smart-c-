import { ShieldCheck } from "lucide-react";
import { BaseNavigation } from "./BaseNavigation";

export function VerifierNavigation() {
  return (
    <BaseNavigation
      logo={{
        to: "/",
        icon: ShieldCheck,
        iconGradient: "from-emerald-500 via-teal-500 to-cyan-500",
        text: "LumenID Verifier",
        textGradient: "from-emerald-400 via-teal-400 to-cyan-400",
        ariaLabel: "LumenID Verifier Portal"
      }}
      leftContent={null}
      rightContent={null}
    />
  );
}