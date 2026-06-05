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
          v-for="note in sortedNotifications"
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
import SidebarLayout from "@/layout/sidebar.vue";
import {
  Bell as BellIcon,
  BellOff as BellOffIcon,
  CheckCheck as CheckCheckIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

type NotificationApi = {
  id: string;
  message?: string | null;
  data?: any | null;
  read_at?: string | Date | null;
  created_at?: string | Date;
};

type NotificationRow = {
  id: string;
  message: string;
  date: string;
  rawDate: Date;
  isUnread: boolean;
  permitId: string | null;
};

const notifications = ref<NotificationRow[]>([]);
const router = useRouter();

const sortedNotifications = computed(() => {
  return [...notifications.value].sort(
    (a, b) => b.rawDate.getTime() - a.rawDate.getTime(),
  );
});

const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID");
};

const mapNotification = (note: NotificationApi): NotificationRow => {
  let permitId = null;
  try {
    const extraData =
      typeof note.data === "string" ? JSON.parse(note.data) : note.data;
    permitId = extraData?.permit_id || extraData?.id || null;
  } catch (e) {
    permitId = null;
  }

  return {
    id: note.id,
    message: note.message || "-",
    date: formatDate(note.created_at),
    rawDate: new Date(note.created_at || ""),
    isUnread: !note.read_at,
    permitId: permitId,
  };
};

const fetchNotifications = async () => {
  try {
    const response = await getNotifications({
      limit: 20,
      order_by: "created_at",
      direction: "DESC",
    });
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

const handleNotificationClick = async (note: NotificationRow) => {
  if (note.isUnread) {
    try {
      await markNotificationAsRead(note.id);
      note.isUnread = false;
    } catch (error) {
      console.error(error);
    }
  }

  if (note.permitId) {
    router.push({
      path: "/admin/permit",
      query: { permitId: note.permitId },
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
