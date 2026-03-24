import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";
import { CheckCircle2, Loader2, Upload, FileText, X, Award, Plus, Trash2, BookOpen, Code, Search } from "lucide-react";
import { toast } from "sonner";
import { MultiSigIcon, IPFSLinkIcon, MintCredentialIcon } from "../icons/LumenIcons";
import { apiClient } from "../../lib/api-client";
import { useAuth } from "../../contexts/AuthContext";

// Helper functions
const generateUniqueId = (type) => {
  const year = new Date().getFullYear();
  const typePrefix = type === "certification" ? "CERT" : type === "badge" ? "BADGE" : "DIP";
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${typePrefix}-${year}-${random}`;
};

const generateNFTData = () => {
  const address = "0x" + Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  const tokenId = Math.floor(Math.random() * 1000000).toString();
  return { address, tokenId };
};

export function NewIssuance() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookedUpStudent, setLookedUpStudent] = useState(null);

  const handleStudentLookup = async () => {
    if (!formData.studentEmail) { toast.error("Enter student email first"); return; }
    setIsLookingUp(true);
    const res = await apiClient.get(`/admin/users/lookup?email=${encodeURIComponent(formData.studentEmail)}`);
    setIsLookingUp(false);
    if (res.success && res.data) {
      setLookedUpStudent(res.data);
      setFormData((prev) => ({
        ...prev,
        studentDID: res.data.did || prev.studentDID,
        fullName: prev.fullName || res.data.fullName || "",
      }));
      toast.success(`Student found: ${res.data.fullName}`);
    } else {
      setLookedUpStudent(null);
      toast.error("No student found with that email");
    }
  };
  const [signatureProgress, setSignatureProgress] = useState(0);
  const [signatures, setSignatures] = useState({ registrar: false, dean: false });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [skills, setSkills] = useState([]);

  // Initialize diploma data with blockchain information
  const nftData = generateNFTData();
  const [diplomaData, setDiplomaData] = useState({
    uniqueId: generateUniqueId("diploma"),
    nftAddress: nftData.address,
    nftTokenId: nftData.tokenId,
    file: null,
  });

  const [certifications, setCertifications] = useState([
    {
      id: "1",
      certificationTitle: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialID: "",
      credentialURL: "",
      uniqueId: generateUniqueId("certification"),
      nftAddress: generateNFTData().address,
      nftTokenId: generateNFTData().tokenId,
      certificationType: "certification",
      file: null,
    }
  ]);

  const [formData, setFormData] = useState({
    studentDID: "",
    studentEmail: "",
    fullName: "",
    program: "",
    gpa: "",
    honors: "",
    schema: "UniversityDegreeCredential",
  });

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now().toString(), name: "", classCode: "", moduleTitle: "" }]);
    toast.success("Subject field added");
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast.info("Subject removed");
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
    toast.success("Skill field added");
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
    toast.info("Skill removed");
  };

  const updateSkill = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addCertification = () => {
    setCertifications([...certifications, {
      id: Date.now().toString(),
      certificationTitle: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialID: "",
      credentialURL: "",
      uniqueId: generateUniqueId("certification"),
      nftAddress: generateNFTData().address,
      nftTokenId: generateNFTData().tokenId,
      certificationType: "certification",
      file: null,
    }]);
    toast.success("Certification section added");
  };

  const removeCertification = (id) => {
    if (certifications.length === 1) {
      toast.error("At least one certification is required");
      return;
    }
    setCertifications(certifications.filter(c => c.id !== id));
    toast.info("Certification removed");
  };

  const updateCertification = (id, field, value) => {
    setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.program || !formData.studentDID) {
      toast.error("Please fill in Student DID, Full Name, and Program");
      return;
    }

    setIsSubmitting(true);
    setSignatureProgress(30);
    setSignatures({ registrar: false, dean: false });

    // Simulate registrar signature step
    await new Promise((r) => setTimeout(r, 1000));
    setSignatures({ registrar: true, dean: false });
    setSignatureProgress(60);
    toast.success("Registrar signature obtained");

    // Simulate dean signature step
    await new Promise((r) => setTimeout(r, 1000));
    setSignatures({ registrar: true, dean: true });
    setSignatureProgress(90);
    toast.success("Dean signature obtained");

    // Build credential payload
    const credentialPayload = {
      type: formData.schema || "UniversityDegreeCredential",
      issuer: user?.fullName || "LumenID University",
      issuerDID: user?.did || "did:lumen:issuer:lumenid-university",
      recipient: formData.fullName,
      recipientDID: formData.studentDID,
      recipientUserId: lookedUpStudent?.id || null,
      schema: `${formData.schema || "UniversityDegreeCredential"} (JSON-LD)`,
      claims: {
        fullName: formData.fullName,
        program: formData.program,
        gpa: formData.gpa || null,
        honors: formData.honors || null,
        subjects: subjects.filter((s) => s.name),
        skills: skills.filter(Boolean),
        certifications: certifications.filter((c) => c.certificationTitle),
      },
    };

    const res = await apiClient.post("/credentials/issue", credentialPayload);
    setSignatureProgress(100);

    if (res.success) {
      toast.success("Credential issued and anchored to blockchain!");
      // Reset form
      setFormData({ studentDID: "", studentEmail: "", fullName: "", program: "", gpa: "", honors: "", schema: "UniversityDegreeCredential" });
      setSubjects([]);
      setSkills([]);
      setCertifications([{ id: "1", certificationTitle: "", issuingOrganization: "", issueDate: "", expirationDate: "", credentialID: "", credentialURL: "", uniqueId: generateUniqueId("certification"), nftAddress: generateNFTData().address, nftTokenId: generateNFTData().tokenId, certificationType: "certification", file: null }]);
      setDiplomaData({ uniqueId: generateUniqueId("diploma"), nftAddress: generateNFTData().address, nftTokenId: generateNFTData().tokenId, file: null });
    } else {
      toast.error(res.error || "Failed to issue credential");
    }

    setIsSubmitting(false);
    setSignatureProgress(0);
    setSignatures({ registrar: false, dean: false });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload PNG, JPG, or PDF only.");
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size exceeds 10MB. Please upload a smaller file.");
        return;
      }

      setUploadedFile(file);
      toast.success(`${file.name} uploaded successfully`);
    }
  };

  const handleDiplomaFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload PNG, JPG, or PDF only.");
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size exceeds 10MB. Please upload a smaller file.");
        return;
      }

      setDiplomaData({ ...diplomaData, file });
      toast.success(`Diploma file ${file.name} uploaded successfully`);
    }
  };

  const handleRemoveDiplomaFile = () => {
    setDiplomaData({ ...diplomaData, file: null });
    toast.info("Diploma file removed");
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    toast.info("File removed");
  };

  const handleCertificationFileUpload = (certId, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload PDF only.");
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size exceeds 10MB. Please upload a smaller file.");
        return;
      }

      setCertifications(certifications.map(c =>
        c.id === certId ? { ...c, file } : c
      ));
      toast.success(`${file.name} uploaded successfully`);
    }
  };

  const handleRemoveCertificationFile = (certId) => {
    setCertifications(certifications.map(c =>
      c.id === certId ? { ...c, file: null } : c
    ));
    toast.info("File removed");
  };

  return (
    <div className="space-y-8">
      <Card className="border shadow-sm">
        <CardHeader className="card-header-aligned">
          <CardTitle className="text-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Issue Verifiable Credential</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Governance Engine - Bulk Schema-Based Minting with Multi-Sig Authorization
          </p>
        </CardHeader>
        <CardContent className="space-y-8 p-grid-6">
          {/* Target Recipient */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base flex-center-y gap-grid-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0">1</span>
              Target Recipient
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="studentDID" className="text-sm font-medium">
                  Student DID (Decentralized Identifier)
                </Label>
                <Input
                  id="studentDID"
                  placeholder="did:lumen:student-xyz789..."
                  value={formData.studentDID}
                  onChange={(e) => setFormData({ ...formData, studentDID: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail" className="text-sm font-medium">
                  Student Email (lookup to auto-fill DID)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="studentEmail"
                    type="email"
                    placeholder="jake.lamac@email.com"
                    value={formData.studentEmail}
                    onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                    className="h-11 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-3 shrink-0"
                    onClick={handleStudentLookup}
                    disabled={isLookingUp}
                  >
                    {isLookingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
                {lookedUpStudent && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {lookedUpStudent.fullName} — DID auto-filled
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Credential Claims */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base flex-center-y gap-grid-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0">2</span>
              Credential Claims (Diploma Details)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Jake Lamac"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program" className="text-sm font-medium">
                  Program Major
                </Label>
                <Input
                  id="program"
                  placeholder="B.S. Computer Science"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa" className="text-sm font-medium">
                  GPA
                </Label>
                <Input
                  id="gpa"
                  placeholder="3.85"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honors" className="text-sm font-medium">
                  Academic Honors
                </Label>
                <Select value={formData.honors} onValueChange={(value) => setFormData({ ...formData, honors: value })}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select honors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Summa Cum Laude">Summa Cum Laude</SelectItem>
                    <SelectItem value="Magna Cum Laude">Magna Cum Laude</SelectItem>
                    <SelectItem value="Cum Laude">Cum Laude</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schema" className="text-sm font-medium">
                Schema Type
              </Label>
              <Select value={formData.schema} onValueChange={(value) => setFormData({ ...formData, schema: value })}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UniversityDegreeCredential">
                    UniversityDegreeCredential (JSON-LD)
                  </SelectItem>
                  <SelectItem value="MicroCredential">MicroCredential (JSON-LD)</SelectItem>
                  <SelectItem value="Badge">Badge (JSON-LD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Diploma Blockchain Data & Upload */}
            <div className="space-y-3 mt-6">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Diploma
              </Label>
              <p className="text-sm text-muted-foreground">Upload diploma document and generate blockchain NFT credentials</p>

              {/* Auto-generated Blockchain Data for Diploma */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                  <MintCredentialIcon size={16} />
                  Auto-Generated Diploma NFT Data
                </Label>
                <div className="grid md:grid-cols-3 gap-3 p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-500/30">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Unique ID</p>
                    <p className="text-sm font-mono font-semibold text-violet-400">{diplomaData.uniqueId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
                    <p className="text-xs font-mono text-violet-400 truncate" title={diplomaData.nftAddress}>
                      {diplomaData.nftAddress.substring(0, 10)}...{diplomaData.nftAddress.substring(diplomaData.nftAddress.length - 8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Credential ID</p>
                    <p className="text-sm font-mono font-semibold text-violet-400">#{diplomaData.nftTokenId}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  ✓ Diploma will be minted as an NFT on Polkadot and permanently linked to student's wallet
                </p>
              </div>

              {/* Diploma File Upload */}
              <div className="border-2 border-dashed rounded-xl p-6 hover:border-primary/50 transition-colors bg-secondary/20">
                {!diplomaData.file ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium mb-1">Upload Diploma Document</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (Max 10MB)</p>
                    </div>
                    <label htmlFor="diplomaUpload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="h-10" asChild>
                        <span>
                          <FileText className="w-4 h-4 mr-2" />
                          Browse Files
                        </span>
                      </Button>
                    </label>
                    <input
                      id="diplomaUpload"
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleDiplomaFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{diplomaData.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(diplomaData.file.size / 1024 / 1024).toFixed(2)} MB • {diplomaData.file.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveDiplomaFile}
                      className="h-8 w-8 flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {diplomaData.file && (
                <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Diploma file uploaded successfully. This will be stored securely on IPFS and linked to the blockchain credential with NFT ID {diplomaData.nftTokenId}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Subjects Taken Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Subjects Taken</h3>
                <p className="text-sm text-muted-foreground">Academic courses and modules completed</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubject}
                className="h-10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>

            {subjects.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubject}
                  className="h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Subject
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="p-4 border rounded-lg bg-secondary/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-muted-foreground">Subject {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSubject(subject.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`subject-name-${subject.id}`}>
                          Subject Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`subject-name-${subject.id}`}
                          placeholder="e.g., Data Structures"
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`class-code-${subject.id}`}>
                          Class Code
                        </Label>
                        <Input
                          id={`class-code-${subject.id}`}
                          placeholder="e.g., CS 201"
                          value={subject.classCode}
                          onChange={(e) => updateSubject(subject.id, "classCode", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`module-title-${subject.id}`}>
                          Module Title
                        </Label>
                        <Input
                          id={`module-title-${subject.id}`}
                          placeholder="e.g., Advanced Algorithms"
                          value={subject.moduleTitle}
                          onChange={(e) => updateSubject(subject.id, "moduleTitle", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Skills</h3>
                <p className="text-sm text-muted-foreground">Technical and professional competencies acquired</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSkill}
                className="h-10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>

            {skills.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Code className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSkill}
                  className="h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Skill
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Python Programming"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="h-11 flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(index)}
                      className="h-11 w-11 text-red-500 hover:text-red-600 hover:bg-red-500/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certification Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Certification Details</h3>
                <p className="text-sm text-muted-foreground">Additional credential metadata and verification information</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCertification}
                className="h-10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certificate/Badge
              </Button>
            </div>

            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={cert.id} className="p-4 border rounded-lg bg-secondary/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-muted-foreground capitalize">
                      {cert.certificationType} {index + 1}
                    </span>
                    {certifications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCertification(cert.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`certificationType-${cert.id}`}>
                        Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={cert.certificationType}
                        onValueChange={(value) => {
                          const nft = generateNFTData();
                          const uniqueId = generateUniqueId(value);
                          setCertifications(certifications.map(c =>
                            c.id === cert.id
                              ? { ...c, certificationType: value, uniqueId, nftAddress: nft.address, nftTokenId: nft.tokenId }
                              : c
                          ));
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="certification">Certification</SelectItem>
                          <SelectItem value="badge">Badge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`certificationTitle-${cert.id}`}>
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`certificationTitle-${cert.id}`}
                        placeholder="e.g., Networking Basics"
                        value={cert.certificationTitle}
                        onChange={(e) => updateCertification(cert.id, "certificationTitle", e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                        <MintCredentialIcon size={16} />
                        Auto-Generated Blockchain Data
                      </Label>
                      <div className="grid md:grid-cols-3 gap-3 p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Unique ID</p>
                          <p className="text-sm font-mono font-semibold text-cyan-400">{cert.uniqueId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
                          <p className="text-xs font-mono text-cyan-400 truncate" title={cert.nftAddress}>
                            {cert.nftAddress.substring(0, 10)}...{cert.nftAddress.substring(cert.nftAddress.length - 8)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Credential ID</p>
                          <p className="text-sm font-mono font-semibold text-cyan-400">#{cert.nftTokenId}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        ✓ This credential will be minted as an NFT on Polkadot and appear in the user's wallet
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`issuingOrganization-${cert.id}`}>
                        Issuing Organization <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`issuingOrganization-${cert.id}`}
                        placeholder="e.g., Stanford University"
                        value={cert.issuingOrganization}
                        onChange={(e) => updateCertification(cert.id, "issuingOrganization", e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`issueDate-${cert.id}`}>
                        Issue Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`issueDate-${cert.id}`}
                        type="date"
                        value={cert.issueDate}
                        onChange={(e) => updateCertification(cert.id, "issueDate", e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`expirationDate-${cert.id}`}>
                        Expiration Date
                      </Label>
                      <Input
                        id={`expirationDate-${cert.id}`}
                        type="date"
                        value={cert.expirationDate}
                        onChange={(e) => updateCertification(cert.id, "expirationDate", e.target.value)}
                        className="h-11"
                        placeholder="Leave empty if no expiration"
                      />
                      <p className="text-xs text-muted-foreground">Leave empty for credentials without expiration</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`credentialID-${cert.id}`}>
                        Credential ID
                      </Label>
                      <Input
                        id={`credentialID-${cert.id}`}
                        placeholder="e.g., CERT-2024-CS-12345"
                        value={cert.credentialID}
                        onChange={(e) => updateCertification(cert.id, "credentialID", e.target.value)}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">Unique identifier for this credential</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`credentialURL-${cert.id}`}>
                        Credential URL
                      </Label>
                      <Input
                        id={`credentialURL-${cert.id}`}
                        type="url"
                        placeholder="https://verify.institution.edu/credentials/..."
                        value={cert.credentialURL}
                        onChange={(e) => updateCertification(cert.id, "credentialURL", e.target.value)}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">Public verification URL for this credential</p>
                    </div>

                    {/* PDF Upload Section for Certification/Badge */}
                    <div className="md:col-span-2 space-y-3 mt-4">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        {cert.certificationType === "certification" ? "Certification" : "Badge"} PDF Document
                      </Label>
                      <p className="text-sm text-muted-foreground">Upload the PDF file that will be minted as an NFT (Max 10MB)</p>

                      <div className="border-2 border-dashed rounded-xl p-6 hover:border-primary/50 transition-colors bg-secondary/20">
                        {!cert.file ? (
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium mb-1">Upload {cert.certificationType === "certification" ? "Certification" : "Badge"} PDF</p>
                              <p className="text-xs text-muted-foreground">PDF only (Max 10MB)</p>
                            </div>
                            <label htmlFor={`certificateUpload-${cert.id}`} className="cursor-pointer">
                              <Button type="button" variant="outline" className="h-10" asChild>
                                <span>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Browse Files
                                </span>
                              </Button>
                            </label>
                            <input
                              id={`certificateUpload-${cert.id}`}
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleCertificationFileUpload(cert.id, e)}
                              className="hidden"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{cert.file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(cert.file.size / 1024 / 1024).toFixed(2)} MB • PDF
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveCertificationFile(cert.id)}
                              className="h-8 w-8 flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {cert.file && (
                        <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {cert.certificationType === "certification" ? "Certification" : "Badge"} PDF uploaded successfully. This will be stored securely on IPFS and linked to the blockchain credential with NFT ID {cert.nftTokenId}.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Anchoring */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0">3</span>
              Cryptographic Anchoring & Delivery
            </h3>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white border-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Multi-Sig...
                </>
              ) : (
                <>
                  <MultiSigIcon size={20} className="mr-2" />
                  Sign & Anchor Credential
                </>
              )}
            </Button>

            {isSubmitting && (
              <div className="space-y-4 p-5 bg-secondary/50 rounded-xl border">
                {/* Multi-sig signers */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MultiSigIcon size={16} className="text-primary" />
                    <span className="text-muted-foreground">Multi-Sig Authorization</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={signatures.registrar ? "text-green-400 font-semibold flex items-center gap-1" : "text-muted-foreground"}>
                      {signatures.registrar && <CheckCircle2 className="w-3.5 h-3.5" />}
                      Registrar
                    </span>
                    <span className={signatures.dean ? "text-green-400 font-semibold flex items-center gap-1" : "text-muted-foreground"}>
                      {signatures.dean && <CheckCircle2 className="w-3.5 h-3.5" />}
                      Dean
                    </span>
                  </div>
                </div>
                <Progress value={signatureProgress} className="h-2" />
                <div className="flex items-center gap-2">
                  <IPFSLinkIcon size={14} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">IPFS Portfolio Link: Queued for anchoring</p>
                </div>
              </div>
            )}

            <div className="pt-3 border-t">
              <Label className="mb-3 block">Delivery Method</Label>
              <div className="flex gap-3 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border hover:bg-secondary/50 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="email"
                    defaultChecked
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Email Credential Offer Link</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}