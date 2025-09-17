import { Pass } from "@/types/Pass";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, User, MapPin, Clock, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PassCardProps {
  pass: Pass;
  onShowQR?: (pass: Pass) => void;
  compact?: boolean;
}

const PassCard = ({ pass, onShowQR, compact = false }: PassCardProps) => {
  const getStatusConfig = (status: Pass['status']) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-success text-success-foreground',
          icon: CheckCircle,
          label: 'Approved'
        };
      case 'pending':
        return {
          color: 'bg-warning text-warning-foreground',
          icon: AlertCircle,
          label: 'Pending'
        };
      case 'denied':
        return {
          color: 'bg-destructive text-destructive-foreground',
          icon: XCircle,
          label: 'Denied'
        };
      case 'expired':
        return {
          color: 'bg-muted text-muted-foreground',
          icon: XCircle,
          label: 'Expired'
        };
    }
  };

  const statusConfig = getStatusConfig(pass.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      pass.status === 'approved' && "border-success/50 shadow-success/10"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-lg">{pass.fullName}</span>
          </div>
          <Badge className={statusConfig.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!compact && (
          <>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-sm text-muted-foreground">{pass.reason}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">Destination</p>
                <p className="text-sm text-muted-foreground">{pass.destination}</p>
              </div>
            </div>
          </>
        )}

        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-muted-foreground mt-1" />
          <div>
            <p className="text-sm font-medium">Valid Period</p>
            <p className="text-sm text-muted-foreground">
              {new Date(pass.startTime).toLocaleString()} - {new Date(pass.endTime).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Pass ID: {pass.id}
        </div>

        {pass.status === 'approved' && onShowQR && (
          <Button
            onClick={() => onShowQR(pass)}
            className="w-full mt-4 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Show QR Code
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PassCard;