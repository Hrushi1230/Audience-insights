import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*');

      if (error) throw error;

      // Calculate statistics
      const typeCount = tickets.reduce((acc: any, ticket) => {
        const type = ticket.type || 'other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const priorityCount = tickets.reduce((acc: any, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
      }, {});

      // Calculate average response time (mock for now)
      const resolvedTickets = tickets.filter(t => t.resolved_at);
      let avgResponseTime = 0;
      if (resolvedTickets.length > 0) {
        const totalTime = resolvedTickets.reduce((sum, ticket) => {
          const created = new Date(ticket.created_at).getTime();
          const resolved = new Date(ticket.resolved_at).getTime();
          return sum + (resolved - created);
        }, 0);
        avgResponseTime = totalTime / resolvedTickets.length / (1000 * 60 * 60); // hours
      }

      setStats({
        typeData: Object.entries(typeCount).map(([name, value]) => ({ name, value })),
        priorityData: Object.entries(priorityCount).map(([name, value]) => ({ name, value })),
        totalTickets: tickets.length,
        resolvedTickets: resolvedTickets.length,
        avgResponseTime: avgResponseTime.toFixed(1),
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    complaint: '#ef4444',
    question: '#3b82f6',
    praise: '#10b981',
    feature_request: '#8b5cf6',
    bug_report: '#f59e0b',
    other: '#6b7280',
  };

  const PRIORITY_COLORS = {
    low: 'hsl(var(--priority-low))',
    medium: 'hsl(var(--priority-medium))',
    high: 'hsl(var(--priority-high))',
    urgent: 'hsl(var(--priority-urgent))',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{stats.totalTickets}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolvedTickets}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}h</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ticket Types</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.typeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.other} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Priority Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.priorityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0EA5E9">
                  {stats.priorityData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}