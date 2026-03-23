import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  User,
  Building,
  Hash,
  FileText,
  ImageIcon,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function VerificationResult({ result, inputId }) {
  const renderFilePreview = (file) => {
    if (!file) return null;

    if (file.type === 'jpg' || file.type === 'png') {
      return (
        <div className="mt-4 rounded-xl overflow-hidden border-2 border-border/50 bg-black/20 group relative">
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 z-10">
            <ImageIcon className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase">{file.type}</span>
          </div>
          <ImageWithFallback
            src={file.url}
            alt={file.name}
            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      );
    }

    if (file.type === 'pdf') {
      return (
        <div className="mt-4 p-6 rounded-xl border-2 border-border/50 bg-secondary/30 flex flex-col items-center justify-center gap-3 group hover:bg-secondary/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground uppercase mt-1">PDF Document</p>
          </div>
          <Button variant="outline" size="sm" className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            View Document
          </Button>
        </div>
      );
    }

    return null;
  };

  if (!result) {
    return (
      <Card className="border-2 border-red-500/50 bg-card/60 backdrop-blur-xl shadow-2xl shadow-red-500/10 overflow-hidden max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 border-b border-red-500/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
            <ShieldAlert className="w-10 h-10 text-red-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-red-400">Identity Not Found</h2>
            <p className="text-red-400/80 mt-2 text-lg">We could not resolve this DID on the network.</p>
          </div>
        </div>
        <CardContent className="p-8 text-center space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-muted-foreground text-center">
              The identifier <strong className="text-foreground font-mono break-all">{inputId}</strong> does not match any valid identity records.
            </p>
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-2 text-sm text-left">
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">The DID might be typed incorrectly.</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">The user may have revoked their public profile.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Profile Summary */}
      <Card className="border-2 border-emerald-500/50 bg-card/60 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border-b border-emerald-500/30 p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/50 shrink-0">
            <User className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold text-emerald-400">{result.studentName}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-emerald-400/80 bg-black/20 py-1 px-3 rounded-full border border-emerald-500/30 inline-flex">
              <Hash className="w-4 h-4" />
              <span className="font-mono">{result.did}</span>
            </div>
          </div>
          <div className="md:ml-auto flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Verified Identity</span>
          </div>
        </div>
      </Card>

      {/* Credentials List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground px-2">Verified Credentials ({result.credentials.length})</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {result.credentials.map((cred) => (
            <Card key={cred.id} className="border border-border/50 bg-card/40 backdrop-blur-md hover:border-cyan-500/50 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-foreground">{cred.program}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {cred.issuer}
                    </p>
                  </div>
                  {cred.status === "authentic" && (
                    <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Valid
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Issued On</span>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      {cred.issueDate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Credential ID</span>
                    <p className="font-mono text-xs text-muted-foreground truncate" title={cred.id}>
                      {cred.id}
                    </p>
                  </div>
                </div>

                {/* Render File based on Type */}
                {renderFilePreview(cred.file)}

                {/* Proof Box */}
                <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-cyan-500" />
                    <span>Cryptographic Proof</span>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-500/70">{cred.hash}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
