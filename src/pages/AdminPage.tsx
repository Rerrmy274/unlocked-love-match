import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldAlert, Trash2, Ban, CheckCircle, Clock } from "lucide-react";
import { Navigate } from "react-router-dom";
import type { Database } from "@/types/database.types";

type Report = Database["public"]["Tables"]["reports"]["Row"] & {
  reporter_profile: Database["public"]["Tables"]["profiles"]["Row"];
  reported_profile: Database["public"]["Tables"]["profiles"]["Row"];
};

export function AdminPage() {
  const { profile } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  if (!profile || profile.role !== "admin") {
    return <Navigate to="/discovery" />;
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reports")
      .select(`
        *,
        reporter_profile:profiles!reports_reporter_id_fkey(*),
        reported_profile:profiles!reports_reported_id_fkey(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load reports");
    } else {
      setReports(data as unknown as Report[]);
    }
    setLoading(false);
  };

  const handleAction = async (reportId: string, status: string) => {
    const { error } = await supabase
      .from("reports")
      .update({ status: status as any })
      .eq("id", reportId);

    if (error) toast.error("Action failed");
    else {
      toast.success(`Report ${status}`);
      fetchReports();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Safety Dashboard</h1>
          <p className="text-gray-500 mt-2">Monitor and manage reported users and content.</p>
        </div>
        <div className="p-3 bg-red-50 rounded-xl">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {reports.filter(r => r.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {reports.filter(r => r.status === 'resolved').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Reports</h2>
          <Button variant="outline" size="sm" onClick={fetchReports}>Refresh</Button>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-12 text-center">
              <Clock className="w-8 h-8 text-gray-300 animate-pulse mx-auto mb-2" />
              <p className="text-sm text-gray-400">Loading safety reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-gray-500">All clear! No pending reports.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase">Reporter</p>
                      <p className="font-medium text-gray-900">{report.reporter_profile?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{report.reporter_id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase">Reported User</p>
                      <p className="font-medium text-red-600">{report.reported_profile?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{report.reported_id}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Reason for report</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                      {report.reason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  <Button
                    onClick={() => handleAction(report.id, 'resolved')}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-100 text-red-600 hover:bg-red-50 flex-1"
                  >
                    <Ban className="w-4 h-4 mr-2" /> Suspend
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}