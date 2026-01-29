<template>
  <div
    class="min-h-screen bg-[#f6ebe8] flex items-center justify-center p-4 md:p-8"
  >
    <div
      class="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
    >
      <div
        class="bg-[#8b3a32] relative flex flex-col items-center px-6 py-10 md:px-10 md:py-16"
      >
        <h2 class="text-white text-xl md:text-2xl font-bold mb-2 text-center">
          Absen Cepat Tanpa Ribet
        </h2>
        <p
          class="text-white/80 text-xs md:text-sm text-center mb-6 md:mb-10 leading-snug"
        >
          Buka kamera, wajah terdeteksi,
          <br />
          absen beres.
        </p>

        <div class="relative mb-12 md:mb-0">
          <img
            src="@/assets/face-scan.png"
            alt="Face Scan"
            class="w-[160px] h-[160px] md:w-[260px] md:h-[260px] object-contain"
          />
        </div>

        <button
          type="button"
          class="absolute bottom-6 md:bottom-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#a24a42] flex items-center justify-center shadow-lg hover:bg-[#b3564d] transition-transform active:scale-95 cursor-pointer"
        >
          <CameraIcon :size="24" class="text-white" />
        </button>
      </div>

      <div
        class="relative bg-[#fffaf8] px-6 py-10 md:px-14 md:py-12 flex flex-col justify-center"
      >
        <div
          class="absolute top-6 right-6 md:right-8 text-[#8b3a32] font-bold tracking-wide text-sm md:text-base"
        >
          LOOK-IN
        </div>

        <div class="flex justify-center mb-6">
          <img
            src="@/assets/ilustrations.png"
            alt="Login Illustration"
            class="w-[180px] md:w-[240px] object-contain"
          />
        </div>

        <p
          class="text-center text-xs md:text-sm text-gray-600 mb-6 md:mb-8 leading-relaxed"
        >
          Silahkan Masuk untuk Melakukan
          <br />
          Absensi
        </p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="relative">
            <input
              v-model="form.username"
              type="text"
              placeholder="Username"
              class="w-full h-11 pl-11 pr-4 rounded-lg border border-[#e6bdb7] bg-[#fff3f1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a32]"
            />
            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b3a32]"
            >
              <MailIcon :size="18" />
            </span>
          </div>

          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Kata Sandi"
              class="w-full h-11 pl-11 pr-11 rounded-lg border border-[#e6bdb7] bg-[#fff3f1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a32]"
            />
            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b3a32]"
            >
              <LockIcon :size="18" />
            </span>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b3a32] hover:text-[#742f28] transition-colors focus:outline-none"
            >
              <EyeIcon v-if="!showPassword" :size="18" />
              <EyeOffIcon v-else :size="18" />
            </button>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-11 bg-[#8C352D] text-white rounded-lg text-sm font-semibold hover:bg-[#742f28] transition-colors shadow-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ loading ? "Memproses..." : "Masuk" }}
          </button>
        </form>

        <p
          v-if="error"
          class="text-red-600 text-xs text-center mt-3 font-medium"
        >
          {{ error }}
        </p>

        <p
          class="text-center text-[11px] md:text-xs text-gray-500 mt-6 md:mt-8"
        >
          Belum punya akun?
          <a
            href="/register"
            class="text-[#8b3a32] font-semibold hover:underline"
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import {
  Camera as CameraIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Lock as LockIcon,
  Mail as MailIcon,
} from "lucide-vue-next";
import { reactive, ref, watch } from "vue";

const { login, error, clearError, loading } = useAuth();

const showPassword = ref(false);

const form = reactive({
  username: "",
  password: "",
});

watch(form, () => {
  clearError();
});

const handleLogin = () => {
  login(form.username, form.password);
};
</script>
