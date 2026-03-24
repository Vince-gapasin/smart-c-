import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "../../lib/api-client";

export function DetailedRecords() {
  const [mainCredential, setMainCredential] = useState(null);
  const [disclosureSettings, setDisclosureSettings] = useState({
    fullName: true,
    program: true,
    gpa: true,
    honors: true,
    skills: true,
    graduationDate: false,
  });

  useEffect(() => {
    apiClient.get("/credentials").then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const active = res.data.find((c) => c.status === "active");
        if (active) setMainCredential(active);
      }
    });
  }, []);

  const toggleDisclosure = (field) => {
    setDisclosureSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const DisclosureRow = ({ field, label, value, zkp }) => (
    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border">
      <div className="flex items-center gap-3">
        {disclosureSettings[field]
          ? <Eye className="w-4 h-4 text-green-400" />
          : <EyeOff className="w-4 h-4 text-muted-foreground" />
        }
        <div>
          <Label className="font-medium">{label}</Label>
          <p className="text-sm text-muted-foreground">{value || "—"}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {zkp && !disclosureSettings[field] && (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            Protected by ZKP
          </Badge>
        )}
        <Switch
          checked={disclosureSettings[field]}
          onCheckedChange={() => toggleDisclosure(field)}
        />
      </div>
    </div>
  );

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Detailed Records
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selective Disclosure Engine - Control what information you share
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
          <p className="text-sm text-indigo-400">
            Toggle individual fields to control what information is included in your Verifiable
            Presentation. Hidden fields use Zero-Knowledge Proofs to protect your privacy.
          </p>
        </div>

        {!mainCredential && (
          <p className="text-muted-foreground text-sm text-center py-4">No active credentials.</p>
        )}

        {mainCredential && (
          <div className="space-y-3">
            <DisclosureRow field="fullName"       label="Full Name"        value={mainCredential.claims?.fullName} />
            <DisclosureRow field="program"        label="Program"          value={mainCredential.claims?.program} />
            <DisclosureRow field="gpa"            label="GPA"              value={mainCredential.claims?.gpa} zkp />
            <DisclosureRow field="honors"         label="Honors"           value={mainCredential.claims?.honors} />
            <DisclosureRow field="graduationDate" label="Graduation Date"  value={mainCredential.claims?.graduationDate} zkp />

            {mainCredential.claims?.skills && (
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border">
                <div className="flex items-center gap-3">
                  {disclosureSettings.skills
                    ? <Eye className="w-4 h-4 text-green-400" />
                    : <EyeOff className="w-4 h-4 text-muted-foreground" />
                  }
                  <div className="flex-1">
                    <Label className="font-medium">Skills</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mainCredential.claims.skills.map((skill) => (
                        <Badge key={skill} className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={disclosureSettings.skills}
                  onCheckedChange={() => toggleDisclosure("skills")}
                />
              </div>
            )}
          </div>
        )}

        <div className="bg-secondary/50 rounded-lg p-4 border">
          <p className="text-sm">
            <span className="font-semibold">
              {Object.values(disclosureSettings).filter(Boolean).length}
            </span>{" "}
            of {Object.keys(disclosureSettings).length} fields will be shared
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
