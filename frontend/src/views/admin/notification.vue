<template>
  <SidebarLayout>
    <div
      class="bg-white border border-[#E8D5D2] rounded-2xl p-6 md:p-8 shadow-sm min-h-[500px]"
    >
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-[#8C352D] font-bold text-lg">Notifikasi</h3>
        <button
          @click="markAllAsRead"
          class="flex items-center gap-2 text-[#8C352D] text-sm font-semibold hover:opacity-70 transition-opacity"
        >
          <CheckCheckIcon :size="18" />
          Tandai baca
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="(note, index) in notifications"
          :key="index"
          :class="[
            'group flex items-center justify-between p-4 rounded-2xl border border-[#E8D5D2] transition-all cursor-pointer hover:shadow-md',
            note.isUnread ? 'bg-[#E8D5D2]/50' : 'bg-white',
          ]"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-[#8C352D] flex items-center justify-center text-white shrink-0"
            >
              <BellIcon :size="24" />
            </div>

            <div class="flex flex-col">
              <p
                class="text-[#8C352D] font-semibold text-sm md:text-base leading-tight"
              >
                {{ note.message }}
              </p>
              <span class="text-[#8C352D]/60 text-[10px] md:text-xs mt-1">
                {{ note.date }}
              </span>
            </div>
          </div>

          <div
            class="text-[#8C352D] opacity-60 group-hover:translate-x-1 transition-transform"
          >
            <ChevronRightIcon :size="24" />
          </div>
        </div>
      </div>

      <div
        v-if="notifications.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <div class="bg-[#FFF0EE] p-5 rounded-full mb-4">
          <BellOffIcon :size="48" class="text-[#8C352D]/20" />
        </div>
        <p class="text-[#8C352D]/50 font-medium">Tidak ada notifikasi baru.</p>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import SidebarLayout from "@/layout/sidebar.vue";
import {
  Bell as BellIcon,
  BellOff as BellOffIcon,
  CheckCheck as CheckCheckIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-vue-next";
import { ref } from "vue";

const notifications = ref([
  {
    message: "Status Perizinan berubah dari Menunggu Perizinan ke Disetujui",
    date: "7 Oktober 2025 11:06 AM",
    isUnread: true,
  },
  {
    message: "Status Perizinan berubah dari Menunggu Perizinan ke Disetujui",
    date: "7 Oktober 2025 11:06 AM",
    isUnread: true,
  },
  {
    message: "Status Perizinan berubah dari Menunggu Perizinan ke Disetujui",
    date: "7 Oktober 2025 11:06 AM",
    isUnread: true,
  },
  {
    message: "Status Perizinan berubah dari Menunggu Perizinan ke Disetujui",
    date: "7 Oktober 2025 11:06 AM",
    isUnread: true,
  },
  {
    message: "Status Perizinan berubah dari Menunggu Perizinan ke Disetujui",
    date: "7 Oktober 2025 11:06 AM",
    isUnread: true,
  },
  {
    message: "Status Perizinan berubah dari Menunggu Perizinan ke Disetujui",
    date: "7 Oktober 2025 11:06 AM",
    isUnread: true,
  },
]);

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.isUnread = false));
};
</script>
