import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Pass } from "@/types/Pass";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QRDisplayProps {
  pass: Pass;
  onClose: () => void;
}

const QRDisplay = ({ pass, onClose }: QRDisplayProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const generateQRCode = async () => {
      const passData = {
        id: pass.id,
        fullName: pass.fullName,
        idNumber: pass.idNumber,
        startTime: pass.startTime,
        endTime: pass.endTime,
        status: pass.status
      };

      try {
        const url = await QRCode.toDataURL(JSON.stringify(passData), {
          width: 300,
          margin: 2,
          color: {
            dark: '#1e40af',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [pass]);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `curfew-pass-${pass.id}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center bg-gradient-to-r from-success to-success/80 text-success-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Digital Pass
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-success-foreground hover:bg-success-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 text-center space-y-6">
          <div>
            <Badge className="bg-success text-success-foreground mb-2">
              APPROVED PASS
            </Badge>
            <h3 className="font-bold text-lg">{pass.fullName}</h3>
            <p className="text-sm text-muted-foreground">ID: {pass.idNumber}</p>
          </div>

          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg border">
                <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto" />
              </div>
            </div>
          )}

          <div className="text-left space-y-2 text-sm">
            <div>
              <span className="font-medium">Valid:</span> {new Date(pass.startTime).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Until:</span> {new Date(pass.endTime).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Destination:</span> {pass.destination}
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={downloadQRCode}
              className="w-full bg-gradient-to-r from-primary to-accent"
              disabled={!qrCodeUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Show this QR code to authorities when requested
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRDisplay;