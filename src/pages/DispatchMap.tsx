import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { getAmbulances, getIncidents } from "../services/api";
import type { Ambulance, Incident } from "../types";
import { Loader2 } from "lucide-react";

const AMBULANCE_SVG = `<svg  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.68-.94l-4-1.08a1 1 0 0 0-1.27.52L14 18"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`;

const INCIDENT_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;

const createCustomIcon = (
  type: "ambulance" | "incident",
  statusOrSeverity: string
) => {
  let bgColorClass = "bg-blue-500";
  let pulseAnimation = "";
  const svgIcon = type === "ambulance" ? AMBULANCE_SVG : INCIDENT_SVG;

  if (type === "ambulance") {
    if (statusOrSeverity === "AVAILABLE") bgColorClass = "bg-emerald-500";
    if (statusOrSeverity === "BUSY") bgColorClass = "bg-orange-500";
    if (statusOrSeverity === "MAINTENANCE") bgColorClass = "bg-slate-500";
  } else {
    if (statusOrSeverity === "CRITICAL") {
      bgColorClass = "bg-red-600";
      pulseAnimation = `<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>`;
    } else if (statusOrSeverity === "HIGH") bgColorClass = "bg-red-400";
    else if (statusOrSeverity === "MODERATE") bgColorClass = "bg-yellow-400";
    else bgColorClass = "bg-green-400";
  }

  return L.divIcon({
    className: "",
    html: `
      <div class="relative flex items-center justify-center w-9 h-9">
        ${pulseAnimation}
        <div class="relative flex items-center justify-center w-9 h-9 rounded-full ${bgColorClass} border-[3px] border-white shadow-md z-10">
          ${svgIcon}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

export default function DispatchMap() {
  // 2. Fetch Data
  const { data: ambulances, isLoading: loadingAmbs } = useQuery<Ambulance[]>({
    queryKey: ["ambulances"],
    queryFn: getAmbulances,
  });
  const { data: incidents, isLoading: loadingIncs } = useQuery<Incident[]>({
    queryKey: ["incidents"],
    queryFn: getIncidents,
  });

  if (loadingAmbs || loadingIncs) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  const centerPosition: [number, number] = [33.5731, -7.5898];

  return (
    <div className="h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
      <MapContainer
        center={centerPosition}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0 bg-slate-100"
      >
        <TileLayer
          attribution='&copy;  contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {incidents
          ?.filter((i) => i.status !== "RESOLVED")
          .map((incident) => (
            <Marker
              key={`inc-${incident.id}`}
              position={[incident.lat, incident.lng]}
              icon={createCustomIcon("incident", incident.severity)}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[180px]">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-2 inline-block
                  ${
                    incident.severity === "CRITICAL"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                  >
                    {incident.severity} Priority
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">
                    {incident.type}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {incident.address}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-mono text-gray-400">
                      #{incident.id}
                    </span>
                    <button className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md font-medium transition-colors">
                      Dispatch Unit
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {ambulances?.map((ambulance) => (
          <Marker
            key={`amb-${ambulance.id}`}
            position={[ambulance.lat, ambulance.lng]}
            icon={createCustomIcon("ambulance", ambulance.status)}
          >
            <Popup>
              <div className="p-1 min-w-[160px]">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                  <h3 className="font-bold text-slate-800">{ambulance.name}</h3>
                  {ambulance.status === "AVAILABLE" ? (
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  ) : (
                    <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 flex justify-between">
                    Type:{" "}
                    <span className="font-medium text-slate-800">
                      {ambulance.type}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600">
                    Crew: <br />
                    <span className="font-medium text-slate-800">
                      {ambulance.crew?.join(", ")}
                    </span>
                  </p>
                </div>
                <div className="mt-3">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-medium border
                        ${
                          ambulance.status === "AVAILABLE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ambulance.status === "BUSY"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                  >
                    {ambulance.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-200 z-[500] text-xs space-y-2">
        <h4 className="font-semibold text-slate-700 mb-2">Map Legend</h4>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white ring-1 ring-gray-100"></div>{" "}
          Available Amb
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 border border-white ring-1 ring-gray-100"></div>{" "}
          Busy Amb
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 border border-white ring-1 ring-gray-100 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50"></span>
          </div>{" "}
          Critical Incident
        </div>
      </div>
    </div>
  );
}
