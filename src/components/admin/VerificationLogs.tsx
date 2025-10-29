import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, CheckCircle, XCircle, AlertCircle, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface VerificationLog {
  id: string;
  pass_id: string;
  scan_time: string;
  location: string | null;
  result: 'valid' | 'expired' | 'invalid';
  device_info: string | null;
  passes?: {
    full_name: string;
    id_number: string;
  };
  profiles?: {
    full_name: string;
  };
}

export const VerificationLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('verification_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'verification_logs'
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_logs')
        .select(`
          id,
          pass_id,
          scan_time,
          location,
          result,
          device_info,
          scanned_by,
          passes!verification_logs_pass_id_fkey (full_name, id_number)
        `)
        .order('scan_time', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Fetch scanner profiles separately
      const logsWithScanners = await Promise.all((data || []).map(async (log) => {
        let scannerName = 'System';
        if (log.scanned_by) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', log.scanned_by)
            .single();
          scannerName = profileData?.full_name || 'System';
        }
        
        return {
          id: log.id,
          pass_id: log.pass_id,
          scan_time: log.scan_time,
          location: log.location,
          result: log.result as 'valid' | 'expired' | 'invalid',
          device_info: log.device_info,
          passes: log.passes,
          profiles: { full_name: scannerName }
        };
      }));

      setLogs(logsWithScanners);
    } catch (error) {
      console.error('Error fetching verification logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.pass_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.passes?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.location?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Badge className="bg-destructive text-destructive-foreground">
            <XCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      case 'invalid':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Invalid
          </Badge>
        );
    }
  };

  const stats = {
    total: logs.length,
    valid: logs.filter(log => log.result === 'valid').length,
    expired: logs.filter(log => log.result === 'expired').length,
    invalid: logs.filter(log => log.result === 'invalid').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verification Logs</h1>
        <p className="text-muted-foreground">Track all pass verification scans</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.valid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.expired}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invalid</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.invalid}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by pass ID, holder name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading verification logs...</div>
          ) : (
            <div className="rounded-md border">
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
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No verification logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {log.pass_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{log.passes?.full_name || 'Unknown'}</TableCell>
                        <TableCell>
                          {format(new Date(log.scan_time), 'MMM dd, yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>{log.location || 'Not specified'}</TableCell>
                        <TableCell>{log.profiles?.full_name || 'System'}</TableCell>
                        <TableCell>{getResultBadge(log.result)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {log.device_info || 'Unknown'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            Live Verification Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Real-time updates enabled. New verifications will appear automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};