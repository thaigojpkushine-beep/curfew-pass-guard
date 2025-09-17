import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { PassManagement } from "@/components/admin/PassManagement";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { VerificationLogs } from "@/components/admin/VerificationLogs";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { Pass } from "@/types/Pass";

interface AdminDashboardProps {
  passes: Pass[];
  onUpdatePass: (passId: string, updates: Partial<Pass>) => void;
}

const AdminDashboard = ({ passes, onUpdatePass }: AdminDashboardProps) => {
  const [activeView, setActiveView] = useState<string>("overview");

  const renderContent = () => {
    switch (activeView) {
      case "passes":
        return <PassManagement passes={passes} onUpdatePass={onUpdatePass} />;
      case "analytics":
        return <AdminAnalytics passes={passes} />;
      case "verification":
        return <VerificationLogs />;
      case "settings":
        return <SystemSettings />;
      default:
        return <AdminAnalytics passes={passes} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          
          <main className="flex-1 p-6 space-y-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;