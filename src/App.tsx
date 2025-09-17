import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { Pass, PassFormData } from "@/types/Pass";

const queryClient = new QueryClient();

const App = () => {
  const [passes, setPasses] = useState<Pass[]>([]);

  const handlePassSubmission = (formData: PassFormData) => {
    const newPass: Pass = {
      id: `PASS-${Date.now()}`,
      ...formData,
      status: 'pending',
      createdAt: new Date(),
    };

    setPasses(prev => [newPass, ...prev]);
    
    // Simulate approval process
    setTimeout(() => {
      setPasses(prev => prev.map(p => 
        p.id === newPass.id 
          ? { ...p, status: 'approved', approvedAt: new Date() }
          : p
      ));
    }, 3000);

    return newPass;
  };

  const handleUpdatePass = (passId: string, updates: Partial<Pass>) => {
    setPasses(prev => prev.map(p => 
      p.id === passId ? { ...p, ...updates } : p
    ));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <Index 
                  passes={passes}
                  onPassSubmission={handlePassSubmission}
                />
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminDashboard 
                  passes={passes}
                  onUpdatePass={handleUpdatePass}
                />
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
