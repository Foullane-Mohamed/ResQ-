import { useEffect, useState } from "react";
import { Wifi, WifiOff, Clock } from "lucide-react";
import { Badge } from "./ui/Badge";

interface SystemStatus {
  isOnline: boolean;
  lastUpdate: Date;
  apiHealth: boolean;
}

export const SystemStatusIndicator = () => {
  const [status, setStatus] = useState<SystemStatus>({
    isOnline: navigator.onLine,
    lastUpdate: new Date(),
    apiHealth: true,
  });

  useEffect(() => {
    const handleOnline = () =>
      setStatus((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setStatus((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check API health every 30 seconds
    const healthCheck = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:5000/ambulances");
        setStatus((prev) => ({
          ...prev,
          apiHealth: response.ok,
          lastUpdate: new Date(),
        }));
      } catch (error) {
        setStatus((prev) => ({
          ...prev,
          apiHealth: false,
          lastUpdate: new Date(),
        }));
      }
    }, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(healthCheck);
    };
  }, []);

  const isHealthy = status.isOnline && status.apiHealth;
  const timeSinceUpdate = Math.floor(
    (Date.now() - status.lastUpdate.getTime()) / 1000
  );

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-3 text-xs">
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}

          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              {timeSinceUpdate < 60
                ? `${timeSinceUpdate}s`
                : `${Math.floor(timeSinceUpdate / 60)}m`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
