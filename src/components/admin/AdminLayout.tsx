
import { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart3,
  FileText,
  Users,
  Settings,
  LogOut,
  Home,
  Moon,
  Sun,
  UserCog
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  type: 'super_admin' | 'funcionario';
};

export default function AdminLayout() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        localStorage.removeItem("adminUser");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado do painel administrativo.",
    });
    navigate("/admin/login");
  };

  // Redirecionar para login se não estiver autenticado
  if (!isLoading && !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Mostrar carregamento enquanto verifica autenticação
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarContent>
            <div className="py-4 px-6 border-b">
              <h2 className="text-lg font-bold">QuickNoteShare</h2>
              <p className="text-sm text-muted-foreground">Painel Administrativo</p>
            </div>
            
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-muted-foreground">Usuário: {user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {user?.type === 'super_admin' ? 'Administrador' : 'Funcionário'}
              </p>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/admin/dashboard')}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/admin/notes')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Gerenciar Notas
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {user?.type === 'super_admin' && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/admin/staff')}>
                            <Users className="mr-2 h-4 w-4" />
                            Funcionários
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/admin/users')}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Gerenciar Usuários
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/admin/admins')}>
                            <Users className="mr-2 h-4 w-4" />
                            Administradores
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/admin/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            Configurações
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-auto p-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Modo Claro
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Modo Escuro
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Site
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="border-b py-4 px-4 bg-background">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-xl font-bold ml-2">Painel Administrativo</h1>
              </div>
            </div>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
