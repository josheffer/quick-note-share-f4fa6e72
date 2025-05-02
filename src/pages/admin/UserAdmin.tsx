
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { hashPassword } from "@/utils/passwordUtils";

interface PasswordUpdateForm {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PasswordUpdateForm>({
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(data: PasswordUpdateForm) {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("email", data.email)
        .single();

      if (fetchError || !existingUser) {
        throw new Error("Usuário não encontrado");
      }

      // Hash the password
      const hashedPassword = await hashPassword(data.newPassword);

      // Update the password
      const { error: updateError } = await supabase
        .from("admin_users")
        .update({ password: hashedPassword })
        .eq("email", data.email);

      if (updateError) throw updateError;

      toast({
        title: "Senha atualizada",
        description: "A senha do usuário foi atualizada com sucesso e está agora armazenada com criptografia.",
      });
      
      form.reset();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Atualize as senhas dos usuários com criptografia segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@admin.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Atualizando..." : "Atualizar Senha"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
