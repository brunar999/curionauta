import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/queryClient";

interface AuthUser {
  userId: string;
}

export function useAuth() {
  const { data, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["auth", "me"],
    queryFn: () =>
      apiFetch<AuthUser>("/api/auth/me").catch(() => null),
    staleTime: 1000 * 60 * 10,
  });

  return {
    isAuthenticated: !!data?.userId,
    userId: data?.userId,
    isLoading,
  };
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth"] });
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      email,
      password,
      firstName,
    }: {
      email: string;
      password: string;
      firstName?: string;
    }) =>
      apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, firstName }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      qc.clear();
      localStorage.removeItem("curionauta_active_student");
    },
  });
}
