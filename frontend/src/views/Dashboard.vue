<template>
  <div class="min-h-screen bg-[#f6ebe8] flex">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-[#FFFFFF] text-white border-r border-[#B5473C] hidden md:flex flex-col"
    >
      <div class="px-6 py-6 text-xl font-bold tracking-wide">LOOK-IN</div>

      <nav class="flex-1 px-4 space-y-2">
        <button
          class="w-full text-left px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          Dashboard
        </button>
        <button
          class="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
        >
          Absensi
        </button>
        <button
          class="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
        >
          Karyawan
        </button>
      </nav>

      <div class="px-4 py-4">
        <button
          @click="logout"
          class="w-full bg-white text-[#8C352D] py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-6 md:p-10">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-[#8C352D]">Dashboard</h1>
          <p class="text-sm text-gray-600">
            Selamat datang kembali, {{ user?.name }}
          </p>
        </div>
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white rounded-xl p-6 shadow">
          <p class="text-sm text-gray-500 mb-2">Total Karyawan</p>
          <p class="text-3xl font-bold text-[#8C352D]">24</p>
        </div>

        <div class="bg-white rounded-xl p-6 shadow">
          <p class="text-sm text-gray-500 mb-2">Hadir Hari Ini</p>
          <p class="text-3xl font-bold text-green-600">18</p>
        </div>

        <div class="bg-white rounded-xl p-6 shadow">
          <p class="text-sm text-gray-500 mb-2">Tidak Hadir</p>
          <p class="text-3xl font-bold text-red-500">6</p>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-xl p-6 shadow">
        <h2 class="text-lg font-semibold text-[#8C352D] mb-4">
          Informasi Akun
        </h2>

        <div class="space-y-2 text-sm text-gray-700">
          <p><strong>Username:</strong> {{ user?.username }}</p>
          <p><strong>Email:</strong> {{ user?.email }}</p>
          <p><strong>Role:</strong> {{ user?.role_name }}</p>
          <p>
            <strong>Status:</strong>
            {{ user?.is_active ? "Aktif" : "Nonaktif" }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { computed } from "vue";

const { user: userState, logout } = useAuth();

// agar reactive
const user = computed(() => userState.value);
</script>
