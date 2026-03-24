import { useState } from "react";
import { useNavigate } from "react-router";
import { User, GraduationCap, Calendar, Building2, MapPin, FileText, Upload, CheckCircle2, Shield, Copy, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { PageTransition } from "../PageTransition";

export function ProfileCreation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSecretPhrase, setShowSecretPhrase] = useState(false);
  const [secretPhraseCopied, setSecretPhraseCopied] = useState(false);
  const [secretPhraseConfirmed, setSecretPhraseConfirmed] = useState(false);

  // Generate a 12-word secret phrase (this would normally come from a crypto library)
  const [secretPhrase] = useState(() => {
    const words = [
      "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract",
      "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid",
      "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual",
      "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance",
      "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
      "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album"
    ];
    const phrase = [];
    for (let i = 0; i < 12; i++) {
      phrase.push(words[Math.floor(Math.random() * words.length)]);
    }
    return phrase;
  });

  const [formData, setFormData] = useState({
    // Personal Info
    dateOfBirth: "",
    nationality: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",

    // Education
    institution: "",
    degree: "",
    fieldOfStudy: "",
    graduationStatus: "",
    graduationDate: "",
    studentId: "",

    // Documents
    transcriptFile: null,
    diplomaFile: null,
    idDocumentFile: null,

    // Additional
    linkedinUrl: "",
    portfolioUrl: "",
    bio: ""
  });

  const steps = [
    { number: 1, title: "Personal Information", icon: User },
    { number: 2, title: "Education Details", icon: GraduationCap },
    { number: 3, title: "Document Upload", icon: Upload },
    { number: 4, title: "Additional Info", icon: FileText },
    { number: 5, title: "Secret Phrase", icon: Shield }
  ];

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Show the secret phrase instead of immediately navigating
    setCurrentStep(5);
  };

  const handleCopySecretPhrase = () => {
    navigator.clipboard.writeText(secretPhrase.join(" "));
    setSecretPhraseCopied(true);
    toast.success("Secret phrase copied to clipboard!");
  };

  const handleConfirmAndFinish = () => {
    if (!secretPhraseConfirmed) {
      toast.error("Please confirm that you have saved your secret phrase");
      return;
    }
    toast.success("Profile created successfully! Redirecting to dashboard...");
    setTimeout(() => {
      navigate("/customer/dashboard");
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen py-grid-12 px-grid-4 sm:px-grid-6 lg:px-grid-8">
        <div className="max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-section-medium)' }}>
          {/* Header */}
          <div className="text-center mt-grid-8 flex flex-col items-center" style={{ gap: 'var(--space-component-small)' }}>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Create Your Profile
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete your profile to start managing your credentials
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                          ? "bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30"
                          : isActive
                            ? "bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30 scale-110"
                            : "bg-secondary/50 border-2 border-border/50 backdrop-blur-xl"
                        }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                      )}
                    </div>
                    <p className={`text-xs text-center max-w-[80px] leading-tight ${isActive ? "font-semibold text-cyan-400" : "text-muted-foreground"}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-3 transition-all duration-300 ${isCompleted ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-border/50"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-lg">
            <CardHeader className="border-b border-border/50 bg-card/40 backdrop-blur-xl">
              <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-base">
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "Share your educational background"}
                {currentStep === 3 && "Upload your credential documents"}
                {currentStep === 4 && "Add optional information to enhance your profile"}
                {currentStep === 5 && "Secure your profile with a secret phrase"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-grid-6">
              <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-section-small)' }}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-component-medium)' }}>
                    <div className="grid md:grid-cols-2 gap-grid-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date of Birth
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          required
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          placeholder="e.g., United States"
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          required
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-grid-4">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        className="bg-background/50 border-border/50"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-grid-4 mt-grid-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="USA"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          required
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          placeholder="10001"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          required
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Education Details */}
                {currentStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-component-medium)' }}>
                    <div className="space-y-2">
                      <Label htmlFor="institution" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Institution Name
                      </Label>
                      <Input
                        id="institution"
                        placeholder="e.g., Stanford University"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        required
                        className="bg-background/50 border-border/50"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-grid-4 mt-grid-4">
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree Type</Label>
                        <Input
                          id="degree"
                          placeholder="e.g., Bachelor of Science"
                          value={formData.degree}
                          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                          required
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fieldOfStudy">Field of Study</Label>
                        <Input
                          id="fieldOfStudy"
                          placeholder="e.g., Computer Science"
                          value={formData.fieldOfStudy}
                          onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                          required
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-grid-4 mt-grid-4">
                      <div className="space-y-2">
                        <Label>Graduation Status</Label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, graduationStatus: "graduate" })}
                            className={`flex-1 h-11 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${formData.graduationStatus === "graduate"
                                ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/20"
                                : "bg-background/50 border-border/50 text-muted-foreground hover:border-cyan-500/50"
                              }`}
                          >
                            Graduate
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, graduationStatus: "undergraduate", graduationDate: "" })}
                            className={`flex-1 h-11 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${formData.graduationStatus === "undergraduate"
                                ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/20"
                                : "bg-background/50 border-border/50 text-muted-foreground hover:border-cyan-500/50"
                              }`}
                          >
                            Undergraduate
                          </button>
                        </div>
                      </div>
                      {formData.graduationStatus === "graduate" && (
                        <div className="space-y-2">
                          <Label htmlFor="graduationDate" className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Graduation Date
                          </Label>
                          <Input
                            id="graduationDate"
                            type="date"
                            value={formData.graduationDate}
                            onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                            required
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                      )}
                    </div>

                    {formData.graduationStatus === "undergraduate" && (
                      <div className="space-y-2 mt-grid-4">
                        <Label htmlFor="studentId">Student ID (Optional)</Label>
                        <Input
                          id="studentId"
                          placeholder="e.g., STU123456"
                          value={formData.studentId}
                          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Document Upload */}
                {currentStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-component-medium)' }}>
                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-grid-4 backdrop-blur-xl">
                      <p className="text-sm text-indigo-300">
                        📄 Upload scanned copies of your credentials. Supported formats: PDF, JPG, PNG (Max 10MB each)
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-component-medium)' }}>
                      {/* Transcript */}
                      <div className="space-y-2 mt-grid-4">
                        <Label htmlFor="transcript">Academic Transcript</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-grid-6 hover:border-cyan-500/50 transition-all bg-background/30 backdrop-blur-xl flex flex-col items-center justify-between min-h-[200px]">
                          <Upload className="w-12 h-12 text-cyan-400 mt-4" />
                          <Input
                            id="transcript"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, "transcriptFile")}
                            className="hidden"
                          />
                          <label htmlFor="transcript" className="cursor-pointer text-center mb-4">
                            <p className="text-sm font-medium text-center">
                              {formData.transcriptFile ? formData.transcriptFile.name : "Click to upload transcript"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 text-center">PDF, JPG, PNG up to 10MB</p>
                          </label>
                        </div>
                      </div>

                      {/* Diploma */}
                      <div className="space-y-2 mt-grid-4">
                        <Label htmlFor="diploma">Diploma/Certificate</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-grid-6 hover:border-cyan-500/50 transition-all bg-background/30 backdrop-blur-xl flex flex-col items-center justify-between min-h-[200px]">
                          <Upload className="w-12 h-12 text-cyan-400 mt-4" />
                          <Input
                            id="diploma"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, "diplomaFile")}
                            className="hidden"
                          />
                          <label htmlFor="diploma" className="cursor-pointer text-center mb-4">
                            <p className="text-sm font-medium text-center">
                              {formData.diplomaFile ? formData.diplomaFile.name : "Click to upload diploma"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 text-center">PDF, JPG, PNG up to 10MB</p>
                          </label>
                        </div>
                      </div>

                      {/* ID Document */}
                      <div className="space-y-2 mt-grid-4">
                        <Label htmlFor="idDocument">Government ID</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-grid-6 hover:border-cyan-500/50 transition-all bg-background/30 backdrop-blur-xl flex flex-col items-center justify-between min-h-[200px]">
                          <Upload className="w-12 h-12 text-cyan-400 mt-4" />
                          <Input
                            id="idDocument"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, "idDocumentFile")}
                            className="hidden"
                          />
                          <label htmlFor="idDocument" className="cursor-pointer text-center mb-4">
                            <p className="text-sm font-medium text-center">
                              {formData.idDocumentFile ? formData.idDocumentFile.name : "Click to upload ID"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 text-center">PDF, JPG, PNG up to 10MB</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Additional Info */}
                {currentStep === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-component-medium)' }}>
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
                      <Input
                        id="linkedinUrl"
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="bg-background/50 border-border/50"
                      />
                    </div>

                    <div className="space-y-2 mt-grid-4">
                      <Label htmlFor="portfolioUrl">Portfolio/Website (Optional)</Label>
                      <Input
                        id="portfolioUrl"
                        type="url"
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        className="bg-background/50 border-border/50"
                      />
                    </div>

                    <div className="space-y-2 mt-grid-4">
                      <Label htmlFor="bio">Bio (Optional)</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself, your skills, and achievements..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={6}
                        className="bg-background/50 border-border/50 resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.bio.length}/500 characters
                      </p>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-grid-4 backdrop-blur-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-400 mb-1">Almost Done!</p>
                          <p className="text-sm text-muted-foreground">
                            Your profile will be reviewed by our verification team. You'll be notified once your credentials are verified.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Secret Phrase */}
                {currentStep === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-component-medium)' }}>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-grid-4 backdrop-blur-xl -mt-2">
                      <p className="text-sm text-red-300">
                        🔐 Keep this secret phrase safe. It is essential for recovering your profile.
                      </p>
                    </div>

                    <div className="space-y-2 mt-grid-4">
                      <Label htmlFor="secretPhrase">Secret Phrase</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="secretPhrase"
                          type="text"
                          value={secretPhrase.join(" ")}
                          readOnly
                          className="bg-background/50 border-border/50"
                        />
                        <Button
                          type="button"
                          onClick={handleCopySecretPhrase}
                          className="h-10 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white border-0 shadow-lg shadow-cyan-500/30"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {secretPhraseCopied ? "Copied to clipboard!" : "Click the copy button to save it"}
                      </p>
                    </div>

                    <div className="space-y-2 mt-grid-4">
                      <Label htmlFor="confirmSecretPhrase">Confirm Secret Phrase</Label>
                      <Input
                        id="confirmSecretPhrase"
                        type="text"
                        placeholder="Type the secret phrase here"
                        onChange={(e) => setSecretPhraseConfirmed(e.target.value === secretPhrase.join(" "))}
                        className="bg-background/50 border-border/50"
                      />
                      <p className="text-xs text-muted-foreground">
                        {secretPhraseConfirmed ? "Confirmed" : "Please type the secret phrase to confirm"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-grid-3 pt-grid-6 border-t border-border/50">
                  {currentStep > 1 && currentStep !== 5 && (
                    <Button
                      type="button"
                      onClick={handlePrevious}
                      variant="outline"
                      className="flex-1 h-12 border-border/50 bg-background/50 backdrop-blur-xl hover:bg-secondary/50"
                    >
                      Previous
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 h-12 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white border-0 shadow-lg shadow-cyan-500/30"
                    >
                      Next Step
                    </Button>
                  ) : currentStep === 4 ? (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white border-0 shadow-lg shadow-green-500/30"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Profile
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleConfirmAndFinish}
                      className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white border-0 shadow-lg shadow-green-500/30"
                      disabled={!secretPhraseConfirmed}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Confirm & Finish
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}