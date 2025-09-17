import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RefreshCw, Bell, Shield, Clock, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function SystemSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: "E-Curfew Pass System",
    maxPassDuration: 24, // hours
    autoApproval: false,
    requireManagerApproval: true,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Security
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    
    // Pass Settings
    passValidityBuffer: 15, // minutes before/after
    allowPassModification: true,
    
    // System Maintenance
    maintenanceMode: false,
    backupFrequency: "daily",
    logRetention: 90, // days
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-success">Online</div>
              <div className="text-sm text-muted-foreground">System Status</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-warning">15</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-accent">v2.1.0</div>
              <div className="text-sm text-muted-foreground">Version</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) => setSettings(prev => ({ ...prev, systemName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPassDuration">Maximum Pass Duration (hours)</Label>
              <Input
                id="maxPassDuration"
                type="number"
                value={settings.maxPassDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, maxPassDuration: parseInt(e.target.value) }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoApproval">Enable Auto-Approval</Label>
              <Switch
                id="autoApproval"
                checked={settings.autoApproval}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoApproval: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="requireManagerApproval">Require Manager Approval</Label>
              <Switch
                id="requireManagerApproval"
                checked={settings.requireManagerApproval}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireManagerApproval: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowPassModification">Allow Pass Modifications</Label>
              <Switch
                id="allowPassModification"
                checked={settings.allowPassModification}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowPassModification: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="requireTwoFactor">Require Two-Factor Auth</Label>
              <Switch
                id="requireTwoFactor"
                checked={settings.requireTwoFactor}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireTwoFactor: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passValidityBuffer">Pass Validity Buffer (minutes)</Label>
              <Input
                id="passValidityBuffer"
                type="number"
                value={settings.passValidityBuffer}
                onChange={(e) => setSettings(prev => ({ ...prev, passValidityBuffer: parseInt(e.target.value) }))}
              />
              <p className="text-xs text-muted-foreground">
                Grace period before/after official pass time
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Disable public access for system updates
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logRetention">Log Retention (days)</Label>
              <Input
                id="logRetention"
                type="number"
                value={settings.logRetention}
                onChange={(e) => setSettings(prev => ({ ...prev, logRetention: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Last Backup</Label>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </div>
              <Button variant="outline" size="sm">
                Run Backup Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}