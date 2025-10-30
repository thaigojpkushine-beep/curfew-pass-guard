import { Shield, BarChart3, ClipboardList, ScanLine, Settings, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: "overview", title: "Overview", icon: BarChart3 },
  { id: "passes", title: "Pass Management", icon: ClipboardList },
  { id: "users", title: "User Management", icon: Users },
  { id: "verification", title: "Verification Logs", icon: ScanLine },
  { id: "analytics", title: "Analytics", icon: BarChart3 },
  { id: "settings", title: "System Settings", icon: Settings },
];

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground">
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            {state !== "collapsed" && (
              <div>
                <h2 className="text-lg font-bold">Admin Panel</h2>
                <p className="text-xs opacity-90">E-Curfew System</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="text-primary-foreground/80 mb-2">
            {state !== "collapsed" && "Management"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    className={`
                      w-full text-left transition-colors
                      ${activeView === item.id 
                        ? "bg-primary-foreground text-primary font-medium" 
                        : "text-primary-foreground hover:bg-primary-foreground/20"
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}