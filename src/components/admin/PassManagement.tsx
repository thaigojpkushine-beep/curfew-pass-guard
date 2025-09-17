import { useState } from "react";
import { Pass } from "@/types/Pass";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Search, Filter, Download, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PassManagementProps {
  passes: Pass[];
  onUpdatePass: (passId: string, updates: Partial<Pass>) => void;
}

export function PassManagement({ passes, onUpdatePass }: PassManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);

  const filteredPasses = passes.filter((pass) => {
    const matchesSearch = 
      pass.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.idNumber.includes(searchTerm) ||
      pass.id.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || pass.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (passId: string) => {
    onUpdatePass(passId, { 
      status: 'approved', 
      approvedAt: new Date() 
    });
    toast({
      title: "Pass Approved",
      description: "The curfew pass has been approved successfully.",
    });
  };

  const handleDeny = (passId: string) => {
    onUpdatePass(passId, { status: 'denied' });
    toast({
      title: "Pass Denied",
      description: "The curfew pass has been denied.",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: Pass['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'denied':
        return <Badge className="bg-destructive text-destructive-foreground">Denied</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
    }
  };

  const stats = {
    total: passes.length,
    pending: passes.filter(p => p.status === 'pending').length,
    approved: passes.filter(p => p.status === 'approved').length,
    denied: passes.filter(p => p.status === 'denied').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
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
            <div className="text-2xl font-bold text-destructive">{stats.denied}</div>
            <div className="text-sm text-muted-foreground">Denied</div>
          </CardContent>
        </Card>
      </div>

      {/* Pass Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pass Management
            <Badge variant="outline">{filteredPasses.length} passes</Badge>
          </CardTitle>
          
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or pass number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pass ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPasses.map((pass) => (
                <TableRow key={pass.id}>
                  <TableCell className="font-mono text-sm">
                    {pass.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{pass.fullName}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-32">
                        {pass.reason}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{pass.idNumber}</TableCell>
                  <TableCell className="text-sm">
                    <div>{new Date(pass.startTime).toLocaleDateString()}</div>
                    <div className="text-muted-foreground">
                      {new Date(pass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(pass.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(pass.status)}</TableCell>
                  <TableCell className="text-sm">
                    {pass.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPass(pass)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {pass.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(pass.id)}
                            className="text-success hover:text-success"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeny(pass.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPasses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No passes found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pass Detail Modal */}
      {selectedPass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Pass Details
                <Button variant="ghost" onClick={() => setSelectedPass(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Full Name:</span> {selectedPass.fullName}
                </div>
                <div>
                  <span className="font-medium">ID Number:</span> {selectedPass.idNumber}
                </div>
                <div>
                  <span className="font-medium">Pass ID:</span> {selectedPass.id}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {getStatusBadge(selectedPass.status)}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Reason:</span> {selectedPass.reason}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Destination:</span> {selectedPass.destination}
                </div>
                <div>
                  <span className="font-medium">Start Time:</span> {new Date(selectedPass.startTime).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">End Time:</span> {new Date(selectedPass.endTime).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Submitted:</span> {selectedPass.createdAt.toLocaleString()}
                </div>
                {selectedPass.approvedAt && (
                  <div>
                    <span className="font-medium">Approved:</span> {selectedPass.approvedAt.toLocaleString()}
                  </div>
                )}
              </div>
              
              {selectedPass.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleApprove(selectedPass.id);
                      setSelectedPass(null);
                    }}
                    className="flex-1 bg-success text-success-foreground"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Pass
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeny(selectedPass.id);
                      setSelectedPass(null);
                    }}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Deny Pass
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}