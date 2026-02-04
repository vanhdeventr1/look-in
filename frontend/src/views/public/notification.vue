<template>
  <SidebarLayout>
    <div
      class="bg-white border border-[#E8D5D2] rounded-2xl p-6 md:p-8 shadow-sm min-h-[500px] animate-in"
    >
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-[#8C352D] font-bold text-lg">Notifikasi</h3>
        <button
          @click="markAllAsRead"
          class="flex items-center gap-2 text-[#8C352D] text-sm font-semibold hover:opacity-70 transition-opacity cursor-pointer"
        >
          <CheckCheckIcon :size="18" />
          Tandai baca
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="note in notifications"
          :key="note.id"
          :class="[
            'group flex items-center justify-between p-4 rounded-2xl border border-[#E8D5D2] transition-all cursor-pointer hover:shadow-md',
            note.isUnread ? 'bg-[#E8D5D2]/50' : 'bg-white',
          ]"
          @click="handleNotificationClick(note)"
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
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/notification.api";
import SidebarLayout from "@/layout/sidebarpublic.vue";
import {
  Bell as BellIcon,
  BellOff as BellOffIcon,
  CheckCheck as CheckCheckIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

type NotificationApi = {
  id: string;
  type?: string | null;
  message?: string | null;
  data?: string | null;
  read_at?: string | Date | null;
  created_at?: string | Date;
};

type NotificationRow = {
  id: string;
  type?: string | null;
  message: string;
  date: string;
  isUnread: boolean;
  permitId?: number | null;
};

const notifications = ref<NotificationRow[]>([]);
const router = useRouter();

const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID");
};

const mapNotification = (note: NotificationApi): NotificationRow => ({
  id: note.id,
  type: note.type ?? null,
  message: note.message || note.data || "-",
  date: formatDate(note.created_at),
  isUnread: !note.read_at,
  permitId: (() => {
    if (!note.data) return null;
    try {
      const parsed = JSON.parse(note.data);
      if (parsed && typeof parsed === "object") {
        const idValue = (parsed as any).id ?? (parsed as any).permit_id;
        const asNumber = Number(idValue);
        return Number.isFinite(asNumber) ? asNumber : null;
      }
      return null;
    } catch {
      return null;
    }
  })(),
});

const fetchNotifications = async () => {
  try {
    const response = await getNotifications();
    const data = response?.data?.data?.notifications ?? [];
    notifications.value = data.map(mapNotification);
  } catch (error) {
    console.error(error);
    notifications.value = [];
  }
};

const markAllAsRead = async () => {
  try {
    await markAllNotificationsAsRead();
    notifications.value = notifications.value.map((note) => ({
      ...note,
      isUnread: false,
    }));
  } catch (error) {
    console.error(error);
  }
};

const markAsRead = async (note: NotificationRow) => {
  if (!note.isUnread) return;
  try {
    await markNotificationAsRead(note.id);
    note.isUnread = false;
  } catch (error) {
    console.error(error);
  }
};

const handleNotificationClick = async (note: NotificationRow) => {
  await markAsRead(note);
  if (note.type === "PERMIT" && note.permitId) {
    router.push({
      path: "/public/permit",
      query: { permitId: String(note.permitId) },
    });
  }
};

onMounted(() => {
  fetchNotifications();
});
</script>
<style>
.animate-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
