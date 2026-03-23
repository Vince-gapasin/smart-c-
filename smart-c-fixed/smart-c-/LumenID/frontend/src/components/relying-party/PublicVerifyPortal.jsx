import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Search, Loader2, ArrowLeft, CheckCircle2, XCircle,
  ShieldCheck, ShieldAlert, Calendar, User, Building,
  Hash, AlertTriangle,
} from "lucide-react";
import { motion } from "motion/react";
import { IntegrityIcon, AuthenticityIcon, ValidityIcon, VerifierIcon } from "../icons/LumenIcons";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const detectInputType = (input) => {
  const t = input.trim().toLowerCase();
  if (t.startsWith("did:")) return "did";
  return "credential";
};

const callVerifyAPI = async (input) => {
  const type = detectInputType(input);
  if (type === "credential") {
    const res = await fetch(`${API_BASE}/credentials/verify/${encodeURIComponent(input.trim())}`);
    const json = await res.json();
    if (!json.success || !json.data?.valid) {
      return { mode: "credential", valid: false, reason: json.data?.reason || json.message || "Invalid credential", data: json.data };
    }
    return { mode: "credential", valid: true, data: json.data };
  } else {
    const res = await fetch(`${API_BASE}/credentials/public/did/${encodeURIComponent(input.trim())}`);
    const json = await res.json();
    if (!json.success) return { mode: "did", valid: false, reason: "DID not found or no active credentials" };
    const credentials = json.data || [];
    return { mode: "did", valid: credentials.length > 0, credentials, did: input.trim() };
  }
};

export function PublicVerifyPortal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id");
  const [inputId, setInputId] = useState(idFromUrl || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [stage, setStage] = useState(0);
  const stageIntervalRef = useRef(null);

  useEffect(() => { if (idFromUrl) handleVerify(idFromUrl); }, [idFromUrl]);
  useEffect(() => { return () => { if (stageIntervalRef.current) clearInterval(stageIntervalRef.current); }; }, []);

  const handleVerify = async (idToVerify) => {
    const trimmed = idToVerify?.trim();
    if (!trimmed) return;
    setSearchParams({ id: trimmed });
    setLoading(true); setResult(null); setSearched(true); setStage(1);
    if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    stageIntervalRef.current = setInterval(() => setStage((p) => (p < 3 ? p + 1 : p)), 500);
    try {
      const data = await callVerifyAPI(trimmed);
      clearInterval(stageIntervalRef.current); setStage(4); setResult(data);
    } catch {
      clearInterval(stageIntervalRef.current);
      setResult({ mode: "credential", valid: false, reason: "Network error — could not reach verification service" });
    } finally { setLoading(false); }
  };

  const resetSearch = () => { setResult(null); setSearched(false); setInputId(""); setSearchParams({}); setStage(0); };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center pt-24 pb-20 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-2">
            <VerifierIcon className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
            Credential Verification
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Enter a <strong>Credential ID</strong> to verify a specific credential, or a <strong>DID</strong> to view all verified credentials for a person.
          </p>
        </div>

        {/* Search form */}
        {(!searched || (!result && !loading)) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto">
            <Card className="border-2 border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
              <CardContent className="pt-6">
                <form onSubmit={(e) => { e.preventDefault(); handleVerify(inputId); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground text-center block">Enter Credential ID or Student DID</Label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          value={inputId}
                          onChange={(e) => setInputId(e.target.value)}
                          placeholder="cred-xxxx   or   did:lumen:student:..."
                          className="pl-10 h-12 bg-background/50 border-border/50 focus:border-cyan-500/50"
                        />
                      </div>
                      <Button type="submit" disabled={!inputId.trim()}
                        className="h-12 px-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white border-0">
                        Verify
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Credential ID example: <span className="font-mono text-cyan-500/70">cred-001</span>&nbsp;&nbsp;|&nbsp;&nbsp;
                    DID example: <span className="font-mono text-cyan-500/70">did:lumen:student:john-doe-001</span>
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl mx-auto">
            <Card className="border-2 border-cyan-500/30 bg-card/60 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" style={{ width: `${(stage / 3) * 100}%` }} />
              <CardContent className="p-8 text-center space-y-8">
                <div className="relative flex justify-center items-center h-24">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-dashed border-2 border-cyan-500/30 w-24 h-24 mx-auto" />
                  <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {stage === 1 && "Connecting to Network..."}
                    {stage === 2 && "Checking Integrity..."}
                    {stage === 3 && "Fetching Credentials..."}
                    {stage >= 4 && "Finalizing..."}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2">Cryptographically validating credentials</p>
                </div>
                <div className="flex justify-center gap-8">
                  {[[IntegrityIcon,"Network",1],[AuthenticityIcon,"Identity",2],[ValidityIcon,"Records",3]].map(([Icon,label,step])=>(
                    <div key={label} className="flex flex-col items-center gap-2">
                      <Icon size={24} className="text-cyan-400" verified={stage>step} pending={stage===step}/>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {searched && !loading && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
            <Button variant="ghost" onClick={resetSearch} className="hover:bg-white/5">
              <ArrowLeft className="w-4 h-4 mr-2" /> Search Another
            </Button>

            {result.mode === "credential" && (
              result.valid
                ? <SingleCredentialCard data={result.data} inputId={inputId} />
                : <InvalidCard reason={result.reason} inputId={inputId} data={result.data} />
            )}
            {result.mode === "did" && (
              result.valid
                ? <DIDCredentialsCard credentials={result.credentials} did={result.did} />
                : <InvalidCard reason={result.reason} inputId={inputId} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SingleCredentialCard({ data, inputId }) {
  return (
    <Card className="border-2 border-emerald-500/50 bg-card/60 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border-b border-emerald-500/30 p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/50 shrink-0">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-emerald-400">Credential Valid</h2>
          <p className="text-emerald-400/70 font-mono text-sm">{data.credentialId || inputId}</p>
        </div>
        <div className="md:ml-auto flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">{data.tamperProof ? "Tamper-Proof ✓" : "Verified ✓"}</span>
        </div>
      </div>
      <CardContent className="p-6 grid md:grid-cols-2 gap-6">
        <InfoRow icon={User} label="Recipient" value={data.recipient} />
        <InfoRow icon={Building} label="Issuer" value={data.issuer} />
        <InfoRow icon={Calendar} label="Issued" value={data.issuedDate ? new Date(data.issuedDate).toLocaleDateString() : "—"} />
        <InfoRow icon={Calendar} label="Verified At" value={data.verifiedAt ? new Date(data.verifiedAt).toLocaleString() : "—"} />
        {data.blockchainHash && (
          <div className="md:col-span-2 p-3 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-cyan-500" /><span>Blockchain Hash</span>
            </div>
            <span className="font-mono text-[10px] text-cyan-500/70 truncate max-w-xs">{data.blockchainHash}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DIDCredentialsCard({ credentials, did }) {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-emerald-500/50 bg-card/60 backdrop-blur-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border-b border-emerald-500/30 p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/50 shrink-0">
            <User className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-emerald-400">{credentials[0]?.recipient || "Verified Identity"}</h2>
            <div className="flex items-center gap-2 text-sm text-emerald-400/80 font-mono">
              <Hash className="w-4 h-4" /><span className="truncate max-w-xs">{did}</span>
            </div>
          </div>
          <div className="md:ml-auto flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Verified Identity</span>
          </div>
        </div>
      </Card>

      <h3 className="text-xl font-semibold px-1">Active Credentials ({credentials.length})</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {credentials.map((cred) => (
          <Card key={cred.id} className="border border-border/50 bg-card/40 backdrop-blur-md hover:border-cyan-500/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold">{cred.claims?.program || cred.type}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Building className="w-4 h-4" />{cred.issuer}
                  </p>
                </div>
                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">Issued</span>
                  <p className="flex items-center gap-1"><Calendar className="w-3 h-3 text-cyan-400" />{cred.issuedDate ? new Date(cred.issuedDate).toLocaleDateString() : "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">Credential ID</span>
                  <p className="font-mono text-xs text-muted-foreground truncate">{cred.id}</p>
                </div>
                {cred.claims?.gpa && <div><span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">GPA</span><p>{cred.claims.gpa}</p></div>}
                {cred.claims?.honors && <div><span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">Honors</span><p>{cred.claims.honors}</p></div>}
              </div>
              {cred.blockchainHash && (
                <div className="p-3 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="w-4 h-4 text-cyan-500" /><span>Blockchain proof</span></div>
                  <span className="font-mono text-[10px] text-cyan-500/70 truncate max-w-[140px]">{cred.blockchainHash}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InvalidCard({ reason, inputId }) {
  const isRevoked = reason?.toLowerCase().includes("revoked");
  return (
    <Card className="border-2 border-red-500/50 bg-card/60 backdrop-blur-xl shadow-2xl shadow-red-500/10 overflow-hidden max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 border-b border-red-500/30 p-8 flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
          {isRevoked ? <AlertTriangle className="w-10 h-10 text-red-400" /> : <ShieldAlert className="w-10 h-10 text-red-400" />}
        </div>
        <h2 className="text-3xl font-bold text-red-400">{isRevoked ? "Credential Revoked" : "Verification Failed"}</h2>
        <p className="text-red-400/80 text-lg">{reason}</p>
      </div>
      <CardContent className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">Searched: <strong className="text-foreground font-mono break-all">{inputId}</strong></p>
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-2 text-sm text-left">
          <div className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span className="text-muted-foreground">The credential ID or DID may be incorrect.</span></div>
          <div className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span className="text-muted-foreground">The credential may still be pending, rejected, or revoked.</span></div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="space-y-1">
      <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
      <p className="flex items-center gap-2 font-medium"><Icon className="w-4 h-4 text-cyan-400 shrink-0" />{value || "—"}</p>
    </div>
  );
}
