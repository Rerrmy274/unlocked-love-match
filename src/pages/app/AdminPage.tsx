import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Shield, Users, Flag, MessageCircle, Ban } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Navigate } from 'react-router-dom';

export function AdminPage() {
  const { profile } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/discovery" />;
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:profiles!reports_reporter_id_fkey(name),
          reported:profiles!reports_reported_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err: any) {
      console.error(err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string, status: string) => {
    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update report');
    } else {
      toast.success(`Report ${status}`);
      fetchReports();
    }
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner className="size-12 text-violet-600" />
        <p className="text-gray-500 animate-pulse">Loading administration data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-600 text-white rounded-2xl shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-500 text-sm">Manage users and safety reports</p>
            </div>
          </div>
          <Button onClick={fetchReports} variant="outline" className="rounded-xl">
            Refresh Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[ 
            { label: 'Total Users', value: 'Active', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Reports', value: reports.filter(r => r.status === 'pending').length, icon: Flag, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'System Status', value: 'Online', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="bg-white border-b border-gray-100">
            <CardTitle className="text-xl">Safety Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-gray-50/50">
                  <TableHead className="font-bold">Reporter</TableHead>
                  <TableHead className="font-bold">Reported User</TableHead>
                  <TableHead className="font-bold">Reason</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">{report.reporter?.name || 'Anonymous'}</TableCell>
                    <TableCell className="text-red-600 font-medium">{report.reported?.name || 'Unknown User'}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-gray-600" title={report.reason}>{report.reason}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={report.status === 'pending' ? 'destructive' : 'secondary'}
                        className="capitalize rounded-full px-3"
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {new Date(report.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {report.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="h-8 bg-green-600 hover:bg-green-700 rounded-lg"
                            onClick={() => handleResolve(report.id, 'resolved')}
                          >
                            Resolve
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Ban className="w-4 h-4 mr-1" /> Ban
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <Flag className="w-12 h-12 text-gray-200" />
                        <p className="text-gray-500 font-medium">No reports found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}