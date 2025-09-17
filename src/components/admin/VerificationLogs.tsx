import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ScanLine, CheckCircle, XCircle, Clock, MapPin } from "lucide-react";

interface VerificationLog {
  id: string;
  passId: string;
  holderName: string;
  scanTime: Date;
  location: string;
  scannedBy: string;
  result: 'valid' | 'expired' | 'invalid';
  deviceInfo: string;
}

// Mock verification logs data
const mockLogs: VerificationLog[] = [
  {
    id: "VL-001",
    passId: "PASS-1734523234567",
    holderName: "John Doe",
    scanTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    location: "Checkpoint Alpha - Main Street",
    scannedBy: "Officer Smith",
    result: 'valid',
    deviceInfo: "Mobile Scanner #12"
  },
  {
    id: "VL-002", 
    passId: "PASS-1734523298745",
    holderName: "Jane Smith",
    scanTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    location: "Checkpoint Beta - City Center",
    scannedBy: "Officer Johnson",
    result: 'expired',
    deviceInfo: "Fixed Scanner #5"
  },
  {
    id: "VL-003",
    passId: "PASS-1734523312890",
    holderName: "Mike Wilson",
    scanTime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    location: "Checkpoint Gamma - Airport",
    scannedBy: "Security Guard Adams",
    result: 'valid',
    deviceInfo: "Mobile Scanner #8"
  },
  {
    id: "VL-004",
    passId: "INVALID-CODE",
    holderName: "Unknown",
    scanTime: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    location: "Checkpoint Alpha - Main Street", 
    scannedBy: "Officer Brown",
    result: 'invalid',
    deviceInfo: "Mobile Scanner #12"
  }
];

export function VerificationLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredLogs = mockLogs.filter((log) =>
    log.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.passId.includes(searchTerm) ||
    log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.scannedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResultBadge = (result: VerificationLog['result']) => {
    switch (result) {
      case 'valid':
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-warning text-warning-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      case 'invalid':
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            <XCircle className="h-3 w-3 mr-1" />
            Invalid
          </Badge>
        );
    }
  };

  const stats = {
    total: mockLogs.length,
    valid: mockLogs.filter(log => log.result === 'valid').length,
    expired: mockLogs.filter(log => log.result === 'expired').length,
    invalid: mockLogs.filter(log => log.result === 'invalid').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Scans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.valid}</div>
            <div className="text-sm text-muted-foreground">Valid Passes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.expired}</div>
            <div className="text-sm text-muted-foreground">Expired Passes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.invalid}</div>
            <div className="text-sm text-muted-foreground">Invalid Codes</div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            Verification Logs
            <Badge variant="outline">{filteredLogs.length} records</Badge>
          </CardTitle>
          
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pass ID</TableHead>
                <TableHead>Pass Holder</TableHead>
                <TableHead>Scan Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Scanned By</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Device</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {log.passId}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.holderName}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{log.scanTime.toLocaleDateString()}</div>
                    <div className="text-muted-foreground">
                      {log.scanTime.toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {log.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.scannedBy}
                  </TableCell>
                  <TableCell>
                    {getResultBadge(log.result)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.deviceInfo}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No verification logs found matching your search
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Activity Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Live Verification Activity
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ScanLine className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>Monitoring checkpoint activities...</p>
            <p className="text-sm">Last scan: {mockLogs[0].scanTime.toLocaleTimeString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}