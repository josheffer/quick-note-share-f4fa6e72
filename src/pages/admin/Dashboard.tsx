
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalNotes: number;
  totalReports: number;
  totalAdmins: number;
  totalStaff: number;
  notesThisWeek: number;
  notesThisMonth: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNotes: 0,
    totalReports: 0,
    totalAdmins: 0,
    totalStaff: 0,
    notesThisWeek: 0,
    notesThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [reportsByReason, setReportsByReason] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Obter contagem total de notas
        const { count: totalNotes, error: notesError } = await supabase
          .from('notes')
          .select('*', { count: 'exact', head: true });
        
        if (notesError) throw notesError;
        
        // Obter contagem de denúncias
        const { count: totalReports, error: reportsError } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true });
        
        if (reportsError) throw reportsError;
        
        // Obter contagem de administradores
        const { count: totalSuperAdmins, error: adminsError } = await supabase
          .from('admin_users')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'super_admin');
        
        if (adminsError) throw adminsError;
        
        // Obter contagem de funcionários
        const { count: totalStaff, error: staffError } = await supabase
          .from('admin_users')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'funcionario');
        
        if (staffError) throw staffError;
        
        // Calcular datas para semana e mês atual
        const now = new Date();
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        // Obter contagem de notas da semana
        const { count: notesThisWeek, error: weekError } = await supabase
          .from('notes')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());
        
        if (weekError) throw weekError;
        
        // Obter contagem de notas do mês
        const { count: notesThisMonth, error: monthError } = await supabase
          .from('notes')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneMonthAgo.toISOString());
        
        if (monthError) throw monthError;
        
        // Agrupar denúncias por razão
        const { data: reports, error: reasonsError } = await supabase
          .from('reports')
          .select('reason');
        
        if (reasonsError) throw reasonsError;
        
        const reasonCounts: Record<string, number> = {};
        
        reports?.forEach(report => {
          const reason = report.reason;
          reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        });
        
        const formattedReportsByReason = Object.keys(reasonCounts).map(reason => ({
          name: reason,
          value: reasonCounts[reason]
        }));

        setReportsByReason(formattedReportsByReason);
        
        // Atualizar estatísticas
        setStats({
          totalNotes: totalNotes || 0,
          totalReports: totalReports || 0,
          totalAdmins: totalSuperAdmins || 0,
          totalStaff: totalStaff || 0,
          notesThisWeek: notesThisWeek || 0,
          notesThisMonth: notesThisMonth || 0
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Dados para o gráfico de barras
  const barData = [
    { name: 'Total', value: stats.totalNotes },
    { name: 'Este Mês', value: stats.notesThisMonth },
    { name: 'Esta Semana', value: stats.notesThisWeek }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Notas</CardTitle>
            <CardDescription>Total de notas publicadas</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-bold">{stats.totalNotes}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Denúncias</CardTitle>
            <CardDescription>Total de denúncias recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-bold">{stats.totalReports}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Administradores</CardTitle>
            <CardDescription>Total de administradores</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-bold">{stats.totalAdmins}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Funcionários</CardTitle>
            <CardDescription>Total de funcionários</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-bold">{stats.totalStaff}</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notas Publicadas</CardTitle>
            <CardDescription>Estatísticas de notas publicadas</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Notas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Denúncias por Motivo</CardTitle>
            <CardDescription>Distribuição de denúncias por motivo</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <p>Carregando dados...</p>
              </div>
            ) : reportsByReason.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportsByReason}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportsByReason.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p>Nenhuma denúncia registrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
