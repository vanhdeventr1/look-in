<template>
    <div class="min-h-screen bg-[#f6ebe8] flex items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-[1100px] relative">

            <div class="absolute -top-10 right-2 md:right-0 font-bold text-xl md:text-2xl tracking-wide text-[#8C352D]">
                LOOK-IN
            </div>

            <div class="w-full bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

                <div
                    class="relative bg-[#fffaf8] px-6 py-10 md:px-14 md:py-12 flex flex-col justify-center order-2 md:order-1">
                    <h2 class="text-xl md:text-2xl font-bold text-[#8b3a32] mb-2 text-center md:text-left">
                        Daftar dan Mulai Sekarang
                    </h2>

                    <p class="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 leading-relaxed text-center md:text-left">
                        Buat akun khusus HR untuk mengelola absensi dan data karyawan dengan lebih mudah, cepat, dan
                        aman
                    </p>

                    <form @submit.prevent="handleRegister" class="space-y-3 md:space-y-4">
                        <div class="relative">
                            <input v-model="form.username" type="text" placeholder="Username"
                                class="w-full h-11 pl-11 pr-4 rounded-lg border border-[#e6bdb7] bg-[#fff3f1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a32]" />
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b3a32]">
                                <UserIcon :size="18" />
                            </span>
                        </div>

                        <div class="relative">
                            <input v-model="form.fullName" type="text" placeholder="Nama Lengkap"
                                class="w-full h-11 pl-11 pr-4 rounded-lg border border-[#e6bdb7] bg-[#fff3f1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a32]" />
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b3a32]">
                                <ContactIcon :size="18" />
                            </span>
                        </div>

                        <div class="relative">
                            <input v-model="form.email" type="email" placeholder="Email"
                                class="w-full h-11 pl-11 pr-4 rounded-lg border border-[#e6bdb7] bg-[#fff3f1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a32]" />
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b3a32]">
                                <MailIcon :size="18" />
                            </span>
                        </div>

                        <div class="relative">
                            <select v-model="form.role"
                                class="w-full h-11 pl-11 pr-4 rounded-lg border border-[#e6bdb7] bg-[#fff3f1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a32] appearance-none cursor-pointer">
                                <option value="">Pilih Peran</option>
                                <option value="hr">HR</option>
                                <option value="admin">Admin</option>
                            </select>
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b3a32]">
                                <BriefcaseIcon :size="18" />
                            </span>
                        </div>

                        <div class="relative">
                            <input v-model="form.password" type="password" placeholder="Kata Sandi"
                                class="w-full h-11 pl-11 pr-4 rounded-lg border border-[#e6bdb7] bg-[#fff3f1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a32]" />
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b3a32]">
                                <LockIcon :size="18" />
                            </span>
                        </div>

                        <button type="submit" :disabled="loading" class="w-full h-11 bg-[#8C352D] text-white rounded-lg text-sm font-semibold
         hover:bg-[#742f28] transition-colors shadow-sm cursor-pointer mt-2
         disabled:opacity-60 disabled:cursor-not-allowed">
                            {{ loading ? 'Memproses...' : 'Daftar' }}
                        </button>

                    </form>
                    <p v-if="error" class="text-red-600 text-xs text-center mt-3 font-medium">
                        {{ error }}
                    </p>


                    <p class="text-center text-[11px] md:text-xs text-gray-500 mt-6">
                        Sudah punya akun?
                        <a href="/login" class="text-[#8b3a32] font-semibold hover:underline">Masuk di sini</a>
                    </p>
                </div>

                <div class="bg-[#8b3a32] flex items-center justify-center p-8 md:p-10 order-1 md:order-2">
                    <img src="@/assets/ilustrations.png" alt="Register Illustration"
                        class="w-40 md:w-75 object-contain" />
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import {
    User as UserIcon,
    Contact as ContactIcon,
    Mail as MailIcon,
    Briefcase as BriefcaseIcon,
    Lock as LockIcon,
} from 'lucide-vue-next';

import { useAuth } from '@/composables/useAuth';

const { register, error, loading, clearError } = useAuth();

const form = reactive({
    username: '',
    fullName: '',
    email: '',
    role: '',
    password: '',
});

watch(form, () => clearError());

const handleRegister = () => {
    register({
        username: form.username,
        password: form.password,
        name: form.fullName, // mapping ke API
        email: form.email,
    });
};
</script>
