<template>
  <div class="h-screen bg-[#FFF0EE] flex font-sans overflow-hidden">
    <!-- Overlay (mobile) -->
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-[#E8D5D2] flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Logo -->
      <div
        class="px-6 py-8 border-b border-[#E8D5D2] flex justify-between items-center"
      >
        <h1
          class="text-2xl font-black text-[#8C352D] tracking-tighter w-full text-center"
        >
          LOOK-IN
        </h1>
        <button
          @click="isSidebarOpen = false"
          class="md:hidden text-[#8C352D] absolute right-4"
        >
          <XIcon :size="24" />
        </button>
      </div>

      <!-- Profile -->
      <div class="flex flex-col items-center py-8">
        <div
          class="w-24 h-24 rounded-full overflow-hidden border-2 border-[#8C352D]/20 bg-gray-100 shadow-sm"
        >
          <img
            v-if="user?.url"
            :src="user.url"
            alt="Profile"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-[#8C352D] text-white text-3xl font-bold"
          >
            {{ user?.name ? user.name.charAt(0).toUpperCase() : "D" }}
          </div>
        </div>
        <p
          class="mt-3 text-[#8C352D] font-bold text-sm text-center px-4 truncate w-full"
        >
          {{ user?.name || "Guest" }}
        </p>
      </div>

      <!-- Navigation (scrollable) -->
      <nav class="flex-1 px-3 space-y-1 overflow-y-auto">
        <button
          v-for="item in navItems"
          :key="item.label"
          @click="handleNavigation(item.path)"
          :class="[
            'flex items-center w-full px-4 py-3 font-medium rounded-xl transition-all mb-1',
            route.path === item.path
              ? 'bg-[#8C352D] text-white shadow-md shadow-[#8C352D]/20 cursor-pointer'
              : 'text-[#8C352D] hover:bg-[#8C352D]/5 cursor-pointer',
          ]"
        >
          <component :is="item.icon" :size="20" class="mr-3" />
          <span class="text-sm font-semibold">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Bottom actions (fixed) -->
      <div class="px-3 py-6 space-y-1 border-t border-[#E8D5D2]">
        <button
          @click="handleNavigation('/public/setting')"
          :class="[
            'flex items-center w-full px-4 py-3 font-medium rounded-xl transition-colors',
            route.path === '/public/setting'
              ? 'bg-[#8C352D] text-white'
              : 'text-[#8C352D] hover:bg-[#8C352D]/5',
          ]"
        >
          <SettingsIcon :size="20" class="mr-3" />
          <span class="text-sm font-semibold">Pengaturan</span>
        </button>

        <button
          @click="logout"
          class="flex items-center w-full px-4 py-3 text-[#8C352D] font-medium rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOutIcon :size="20" class="mr-3" />
          <span class="text-sm font-semibold">Keluar</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      <!-- Header -->
      <header
        class="h-20 bg-white border-b border-[#E8D5D2] flex items-center justify-between px-4 md:px-8"
      >
        <div class="flex items-center gap-4">
          <button
            @click="isSidebarOpen = true"
            class="md:hidden p-2 text-[#8C352D] hover:bg-[#8C352D]/5 rounded-lg"
          >
            <MenuIcon :size="28" />
          </button>
          <div class="flex flex-col">
            <h2 class="text-[#8C352D] font-bold text-xs md:text-sm truncate">
              Selamat datang kembali, {{ user?.name }}
            </h2>
            <p class="text-gray-400 text-[10px] md:text-xs">
              {{ formattedDate }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-3">
          <span class="hidden sm:inline text-[#8C352D] font-bold text-sm">
            Haii, {{ user?.name?.split(" ")[0] }}!!
          </span>
          <div
            class="w-10 h-10 rounded-full overflow-hidden bg-[#8C352D] flex items-center justify-center text-white font-bold ring-2 ring-[#8C352D]/10 shadow-sm"
          >
            <img
              v-if="user?.url"
              :src="user.url"
              class="w-full h-full object-cover"
            />
            <span v-else>
              {{ user?.name ? user.name.charAt(0).toUpperCase() : "D" }}
            </span>
          </div>
        </div>
      </header>

      <!-- Scrollable page content -->
      <main class="flex-1 p-4 md:p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import {
  CalendarClock as AttendanceIcon,
  Bell as BellIcon,
  Home as HomeIcon,
  LogOut as LogOutIcon,
  Menu as MenuIcon,
  FilePlusCorner as PermitIcon,
  ScanFace as ScanIcon,
  Settings as SettingsIcon,
  X as XIcon,
} from "lucide-vue-next";
import { computed, markRaw, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { user: userState, logout } = useAuth();
const user = computed(() => userState.value);

const router = useRouter();
const route = useRoute();

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
});

const isSidebarOpen = ref(false);

const navItems = ref([
  { icon: markRaw(HomeIcon), label: "Beranda", path: "/public/dashboard" },
  { icon: markRaw(ScanIcon), label: "Absen", path: "" },
  { icon: markRaw(PermitIcon), label: "Perizinan", path: "/public/permit" },
  {
    icon: markRaw(AttendanceIcon),
    label: "Riwayat Absen",
    path: "",
  },
  {
    icon: markRaw(BellIcon),
    label: "Notifikasi",
    path: "/public/notification",
  },
]);

const handleNavigation = (path: string) => {
  router.push(path);
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};
</script>

<style scoped>
nav::-webkit-scrollbar {
  width: 4px;
}
nav::-webkit-scrollbar-thumb {
  background: #e8d5d2;
  border-radius: 10px;
}
</style>
