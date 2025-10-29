import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { PassManagement } from "@/components/admin/PassManagement";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { VerificationLogs } from "@/components/admin/VerificationLogs";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { usePasses } from "@/hooks/usePasses";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<string>("overview");
  const { passes, updatePass } = usePasses();
  const { profile, isAdmin } = useAuth();

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case "passes":
        return <PassManagement passes={passes} onUpdatePass={updatePass} />;
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