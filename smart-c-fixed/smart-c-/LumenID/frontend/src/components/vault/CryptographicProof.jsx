import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { QrCode, Copy, Timer, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function CryptographicProof() {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [expiresIn, setExpiresIn] = useState(15);

  const generateQR = () => {
    setQrGenerated(true);
    setExpiresIn(15);
    toast.success("Verifiable Presentation generated");

    // Countdown timer
    const interval = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQrGenerated(false);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText("https://lumen.id/verify/presentation-abc123");
    toast.success("Verification link copied to clipboard");
  };

  return (
    <Card className="bg-slate-900/70 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white text-xl">Cryptographic Proof</CardTitle>
        <p className="text-sm text-slate-400">
          Presentation Layer - Generate time-bound Verifiable Presentations
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!qrGenerated ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Generate Presentation QR</h3>
            <p className="text-sm text-slate-400 mb-6">
              Create a secure, time-bound QR code or link to share your credentials with employers
            </p>
            <Button
              onClick={generateQR}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate Presentation QR
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* QR Code Display */}
            <div className="bg-white rounded-lg p-8 flex items-center justify-center">
              <div className="w-64 h-64 bg-black rounded-lg flex items-center justify-center">
                {/* Mock QR Code Pattern */}
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 ${Math.random() > 0.5 ? "bg-white" : "bg-black"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-yellow-300">Time-Bound Presentation</span>
              </div>
              <span className="text-lg font-bold text-yellow-400">{expiresIn}:00</span>
            </div>

            {/* Verification Link */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Verification Link</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2">
                  <p className="text-sm text-white font-mono truncate">
                    https://lumen.id/verify/presentation-abc123
                  </p>
                </div>
                <Button
                  onClick={copyLink}
                  variant="outline"
                  size="icon"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Technical Info */}
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-semibold text-white mb-3">Presentation Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Format</p>
                  <p className="text-white">Verifiable Presentation (VP)</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Signature Method</p>
                  <p className="text-white">ECDSA secp256k1</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Proof Type</p>
                  <p className="text-white">Zero-Knowledge Proof</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Expires In</p>
                  <p className="text-white">{expiresIn} minutes</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
              <p className="text-sm text-indigo-200">
                This QR code contains a cryptographically signed proof of your credentials. The employer can verify it
                without contacting the university, and it expires automatically for security.
              </p>
            </div>

            <Button
              onClick={() => setQrGenerated(false)}
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Generate New Presentation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}