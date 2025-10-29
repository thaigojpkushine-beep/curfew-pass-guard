import { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scan, Camera, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ScanResult {
  id: string;
  fullName: string;
  idNumber: string;
  startTime: string;
  endTime: string;
  status: string;
}

const QRScanner = () => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>("");
  const scannerRef = useRef<QrScanner | null>(null);

  const logVerification = async (passId: string, result: 'valid' | 'expired' | 'invalid') => {
    try {
      await supabase.from('verification_logs').insert({
        pass_id: passId,
        scanned_by: user?.id,
        result,
        location: 'Web Scanner',
        device_info: navigator.userAgent
      });
    } catch (error) {
      console.error('Error logging verification:', error);
    }
  };

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      setError("");
      setScanResult(null);
      setIsScanning(true);

      scannerRef.current = new QrScanner(
        videoRef.current,
        async (scanData) => {
          try {
            const data = JSON.parse(scanData.data);
            
            // Validate pass data
            if (!data.id || !data.fullName || !data.startTime || !data.endTime) {
              throw new Error("Invalid pass data");
            }

            // Fetch pass from database to verify
            const { data: passData, error: passError } = await supabase
              .from('passes')
              .select('*')
              .eq('id', data.id)
              .single();

            if (passError || !passData) {
              setError("Pass not found in database");
              await logVerification(data.id, 'invalid');
              return;
            }

            // Check if pass is still valid
            const now = new Date();
            const startTime = new Date(passData.start_time);
            const endTime = new Date(passData.end_time);
            
            let status = passData.status;
            let verificationResult: 'valid' | 'expired' | 'invalid' = 'invalid';

            if (passData.status !== 'approved') {
              verificationResult = 'invalid';
            } else if (now > endTime) {
              status = 'expired';
              verificationResult = 'expired';
            } else if (now >= startTime && now <= endTime) {
              verificationResult = 'valid';
            }

            // Log the verification
            await logVerification(data.id, verificationResult);

            setScanResult({
              id: passData.id,
              fullName: passData.full_name,
              idNumber: passData.id_number,
              startTime: passData.start_time,
              endTime: passData.end_time,
              status
            });

            toast({
              title: `Pass ${verificationResult.toUpperCase()}`,
              description: `Verification logged successfully`,
              variant: verificationResult === 'valid' ? 'default' : 'destructive'
            });

            stopScanning();
          } catch (err) {
            setError("Invalid QR code or pass data");
            console.error('Scan error:', err);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
    } catch (err) {
      setError("Camera access denied or not available");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-success text-success-foreground',
          icon: CheckCircle,
          label: 'VALID PASS',
          message: 'This pass is approved and currently valid.'
        };
      case 'expired':
        return {
          color: 'bg-destructive text-destructive-foreground',
          icon: XCircle,
          label: 'EXPIRED',
          message: 'This pass has expired and is no longer valid.'
        };
      case 'denied':
        return {
          color: 'bg-destructive text-destructive-foreground',
          icon: XCircle,
          label: 'DENIED',
          message: 'This pass was denied and is not valid.'
        };
      default:
        return {
          color: 'bg-warning text-warning-foreground',
          icon: AlertCircle,
          label: 'PENDING',
          message: 'This pass is still pending approval.'
        };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center bg-gradient-to-r from-accent to-primary text-accent-foreground rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Scan className="h-6 w-6" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {!isScanning && !scanResult && (
              <div className="text-center space-y-4">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  Click start to scan a curfew pass QR code
                </p>
                <Button
                  onClick={startScanning}
                  className="bg-gradient-to-r from-accent to-primary"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanner
                </Button>
              </div>
            )}

            {isScanning && (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  className="w-full max-w-sm mx-auto rounded-lg border"
                  style={{ display: 'block' }}
                />
                <div className="text-center">
                  <Button 
                    onClick={stopScanning}
                    variant="outline"
                  >
                    Stop Scanning
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center p-4 bg-destructive/10 text-destructive rounded-lg">
                <XCircle className="h-8 w-8 mx-auto mb-2" />
                <p>{error}</p>
                <Button
                  onClick={() => {
                    setError("");
                    startScanning();
                  }}
                  variant="outline"
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {scanResult && (
        <Card className="border-2 border-primary">
          <CardHeader className="text-center">
            {(() => {
              const status = getStatusDisplay(scanResult.status);
              const StatusIcon = status.icon;
              return (
                <div>
                  <Badge className={status.color + " text-lg px-4 py-2"}>
                    <StatusIcon className="h-5 w-5 mr-2" />
                    {status.label}
                  </Badge>
                  <CardTitle className="mt-2">{scanResult.fullName}</CardTitle>
                </div>
              );
            })()}
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">ID Number:</span> {scanResult.idNumber}
              </div>
              <div>
                <span className="font-medium">Pass ID:</span> {scanResult.id}
              </div>
              <div>
                <span className="font-medium">Valid From:</span> {new Date(scanResult.startTime).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Valid Until:</span> {new Date(scanResult.endTime).toLocaleString()}
              </div>
            </div>
            
            {(() => {
              const status = getStatusDisplay(scanResult.status);
              return (
                <div className={`p-3 rounded-lg ${status.color.replace('text-', 'text-').replace('bg-', 'bg-')}/10`}>
                  <p className="text-sm">{status.message}</p>
                </div>
              );
            })()}

            <Button
              onClick={() => {
                setScanResult(null);
                startScanning();
              }}
              className="w-full"
              variant="outline"
            >
              Scan Another Pass
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScanner;