import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "@/api/auth.api";
import { ref } from "vue";
import { useRouter } from "vue-router";

const user = ref<any>(JSON.parse(localStorage.getItem("user") || "null"));
const isAuthenticated = ref(!!user.value);

export function useAuth() {
  const router = useRouter();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (username: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await loginApi({ username, password });
      const { user: userData } = res.data.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("user_role", String(userData.role));

      user.value = userData;
      isAuthenticated.value = true;

      if (userData.role === 1) {
        router.push("/admin/dashboard");
      } else if (userData.role === 2 || userData.role === 3) {
        router.push("/public/dashboard");
      }
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.response?.message ||
        "Username atau password salah";
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload: {
    username: string;
    password: string;
    name: string;
    email: string;
    invite_code?: string;
  }) => {
    loading.value = true;
    error.value = null;

    try {
      await registerApi({
        ...payload,
        role: 1,
      });

      router.push("/login");
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.response?.message ||
        "Gagal mendaftar";
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("user_role");
    user.value = null;
    isAuthenticated.value = false;
    await router.push("/login");
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout,
    login,
    register,
    clearError,
  };
}
