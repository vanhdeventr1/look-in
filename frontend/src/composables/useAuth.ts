import { login as loginApi, register as registerApi } from '@/api/auth.api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const user = ref<any>(JSON.parse(localStorage.getItem('user') || 'null'));
const isAuthenticated = ref(!!localStorage.getItem('access_token'));

export function useAuth() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref<string | null>(null);

    const login = async (username: string, password: string) => {
        loading.value = true;
        error.value = null;

        try {
            const res = await loginApi({ username, password });
            const { access_token, user: userData } = res.data.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));

            user.value = userData;
            isAuthenticated.value = true;

            router.push('/admin/dashboard');
        } catch (err: any) {
            error.value =
                err.response?.data?.message ||
                err.response?.data?.response?.message ||
                'Username atau password salah';
        } finally {
            loading.value = false;
        }
    };

    const register = async (payload: {
        username: string;
        password: string;
        name: string;
        email: string;
    }) => {
        loading.value = true;
        error.value = null;

        try {
            await registerApi(payload);

            router.push('/login');
        } catch (err: any) {
            error.value =
                err.response?.data?.message ||
                err.response?.data?.response?.message ||
                'Gagal mendaftar';
        } finally {
            loading.value = false;
        }
    };

    const logout = async() =>{
        
    }

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
