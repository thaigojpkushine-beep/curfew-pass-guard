import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <Badge variant="outline" className="text-xs">
            v2.1.0
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to App
        </Button>
      </div>
    </header>
  );
}