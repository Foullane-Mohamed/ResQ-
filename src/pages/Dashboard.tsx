import { useAmbulances } from "../hooks/useAmbulances";
import { useIncidents } from "../hooks/useIncidents";
import { useAuth } from "../hooks/useAuth";

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
  const { user } = useAuth();
  const { isLoading: loadingAmbulances, stats: ambulanceStats } =
    useAmbulances();
  const { isLoading: loadingIncidents, stats: incidentStats } = useIncidents();

  if (loadingAmbulances || loadingIncidents) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading Dashboard data...
      </div>
    );
  }

  const chartData = [
    {
      name: "Critical",
      value: incidentStats.bySeverity.CRITICAL,
      color: "#ef4444",
    },
    {
      name: "High",
      value: incidentStats.bySeverity.HIGH,
      color: "#f97316",
    },
    {
      name: "Moderate",
      value: incidentStats.bySeverity.MODERATE,
      color: "#eab308",
    },
    {
      name: "Low",
      value: incidentStats.bySeverity.LOW,
      color: "#22c55e",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Operational Overview
        </h1>
        <div className="text-sm text-gray-600">
          Role: <span className="font-medium">{user?.role}</span>
        </div>
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={200}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
