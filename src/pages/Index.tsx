import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PassRequestForm from "@/components/PassRequestForm";
import PassCard from "@/components/PassCard";
import QRDisplay from "@/components/QRDisplay";
import QRScanner from "@/components/QRScanner";
import { Pass, PassFormData } from "@/types/Pass";
import { FileText, Scan, ClipboardList, Shield, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface IndexProps {
  passes: Pass[];
  onPassSubmission: (formData: PassFormData) => Pass;
}

const Index = ({ passes, onPassSubmission }: IndexProps) => {
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);
  const navigate = useNavigate();

  const handlePassSubmission = (formData: PassFormData) => {
    const newPass = onPassSubmission(formData);
    
    toast({
      title: "Pass Submitted",
      description: "Your curfew pass request has been submitted for review.",
    });
    
    // Simulate approval notification
    setTimeout(() => {
      toast({
        title: "Pass Approved!",
        description: "Your curfew pass has been approved and is ready to use.",
      });
    }, 3000);
  };

  const getPassStats = () => {
    const approved = passes.filter(p => p.status === 'approved').length;
    const pending = passes.filter(p => p.status === 'pending').length;
    const denied = passes.filter(p => p.status === 'denied').length;
    
    return { approved, pending, denied, total: passes.length };
  };

  const stats = getPassStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">E-Curfew Pass System</h1>
                <p className="text-primary-foreground/90">Digital Authorization & Verification Platform</p>
              </div>
            </div>
            
            <Button
              variant="secondary"
              onClick={() => navigate("/admin")}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Passes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{stats.denied}</div>
              <div className="text-sm text-muted-foreground">Denied</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="request" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-96 mx-auto">
            <TabsTrigger value="request" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Request Pass
            </TabsTrigger>
            <TabsTrigger value="passes" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              My Passes
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Verify Pass
            </TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="space-y-6">
            <PassRequestForm onSubmit={handlePassSubmission} />
          </TabsContent>

          <TabsContent value="passes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  My Curfew Passes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {passes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No passes requested yet</p>
                    <p className="text-sm">Submit a pass request to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {passes.map((pass) => (
                      <PassCard
                        key={pass.id}
                        pass={pass}
                        onShowQR={setSelectedPass}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-6">
            <QRScanner />
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Display Modal */}
      {selectedPass && (
        <QRDisplay
          pass={selectedPass}
          onClose={() => setSelectedPass(null)}
        />
      )}
    </div>
  );
};

export default Index;