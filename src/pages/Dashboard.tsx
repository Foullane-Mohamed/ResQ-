import { useQuery } from "@tanstack/react-query";
import { getAmbulances, getIncidents } from "../services/api";
import type { Ambulance, Incident } from "../types";
import StatCard from "../components/StatCard";
import {
  Activity,
  Ambulance as AmbulanceIcon,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Dashboard() {
  const { data: ambulances, isLoading: loadingAmbulances } = useQuery<
    Ambulance[]
  >({
    queryKey: ["ambulances"],
    queryFn: getAmbulances,
  });

  const { data: incidents, isLoading: loadingIncidents } = useQuery<Incident[]>(
    {
      queryKey: ["incidents"],
      queryFn: getIncidents,
    }
  );

  if (loadingAmbulances || loadingIncidents) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading Dashboard data...
      </div>
    );
  }

  const totalAmbulances = ambulances?.length || 0;
  const availableAmbulances =
    ambulances?.filter((a) => a.status === "AVAILABLE").length || 0;
  const activeIncidents =
    incidents?.filter((i) => i.status !== "RESOLVED").length || 0;
  const criticalIncidents =
    incidents?.filter(
      (i) => i.severity === "CRITICAL" && i.status !== "RESOLVED"
    ).length || 0;

  const chartData = [
    {
      name: "Critical",
      value: incidents?.filter((i) => i.severity === "CRITICAL").length || 0,
      color: "#ef4444",
    },
    {
      name: "High",
      value: incidents?.filter((i) => i.severity === "HIGH").length || 0,
      color: "#f97316",
    },
    {
      name: "Moderate",
      value: incidents?.filter((i) => i.severity === "MODERATE").length || 0,
      color: "#eab308",
    },
    {
      name: "Low",
      value: incidents?.filter((i) => i.severity === "LOW").length || 0,
      color: "#22c55e",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Operational Overview
        </h1>
        <span className="text-sm text-slate-500">Last updated: Just now</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Available Fleet"
          value={`${availableAmbulances}/${totalAmbulances}`}
          icon={AmbulanceIcon}
          color="green"
          description="Vehicles ready for dispatch"
        />
        <StatCard
          title="Active Incidents"
          value={activeIncidents}
          icon={Activity}
          color="blue"
          description="Currently being managed"
        />
        <StatCard
          title="Critical Alerts"
          value={criticalIncidents}
          icon={AlertTriangle}
          color="red"
          description="Requires immediate attention"
        />
        <StatCard
          title="Resolved Today"
          value={incidents?.filter((i) => i.status === "RESOLVED").length || 0}
          icon={CheckCircle}
          color="orange"
          description="Completed interventions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Incidents by Severity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {incidents?.slice(0, 3).map((incident) => (
              <div
                key={incident.id}
                className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-gray-50 last:border-0"
              >
                <div
                  className={`w-2 h-2 rounded-full mr-4 ${
                    incident.status === "RESOLVED"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {incident.type}
                  </p>
                  <p className="text-xs text-slate-500">{incident.address}</p>
                </div>
                <span className="ml-auto text-xs font-mono text-slate-400">
                  {new Date(incident.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
