import { useAmbulances } from "../features/ambulances";
import { useIncidents } from "../features/incidents";
import { useAuth } from "../features/auth";
import { RoleGuard } from "../components/RoleGuard";
import { AlertTriangle, Ambulance, Clock, Wrench } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const { isLoading: loadingAmbulances, stats: ambulanceStats } =
    useAmbulances();
  const {
    incidents,
    isLoading: loadingIncidents,
    stats: incidentStats,
  } = useIncidents();

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
      </div>

      {/* Role-specific Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RoleGuard permission="VIEW_AMBULANCE_MAP">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Incidents
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {incidentStats.total}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </RoleGuard>
        <RoleGuard permission="VIEW_FLEET_STATUS">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ambulances Available
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {ambulanceStats?.available || 0}
                </p>
              </div>
              <Ambulance className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </RoleGuard>{" "}
        <RoleGuard permission="ASSIGN_AMBULANCE">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Incidents
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {incidentStats.active}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </RoleGuard>
        <RoleGuard permission="MANAGE_VEHICLE_AVAILABILITY">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  In Maintenance
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {ambulanceStats?.maintenance || 0}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </RoleGuard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents Chart - Visible to all roles */}
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
          </div>
        </div>

        {/* Fleet Status Chart - Only for Chef de Parc and Admin */}
        <RoleGuard permission="VIEW_FLEET_STATUS">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Fleet Status Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Available",
                        value: ambulanceStats?.available || 0,
                        fill: "#22c55e",
                      },
                      {
                        name: "Busy",
                        value: ambulanceStats?.busy || 0,
                        fill: "#f97316",
                      },
                      {
                        name: "Maintenance",
                        value: ambulanceStats?.maintenance || 0,
                        fill: "#6b7280",
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>{" "}
          </div>
        </RoleGuard>
      </div>

      {/* Recent Critical Incidents - Only for Régulateur and Admin */}
      <RoleGuard permission="RECEIVE_CRITICAL_NOTIFICATIONS">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Critical Incidents
          </h3>
          <div className="space-y-3">
            {incidents
              .filter((i) => i.severity === "CRITICAL")
              .slice(0, 5)
              .map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {incident.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {incident.address}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(incident.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            {incidents.filter((i) => i.severity === "CRITICAL").length ===
              0 && (
              <p className="text-gray-500 text-center py-4">
                No critical incidents
              </p>
            )}
          </div>
        </div>
      </RoleGuard>
    </div>
  );
}
