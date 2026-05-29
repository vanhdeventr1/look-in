<template>
  <SidebarLayout>
    <div class="flex flex-col gap-y-6 animate-in">
      <div class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">
              {{ weeklyAttendanceCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Absen Minggu Ini</p>
          </div>

          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">
              {{ monthlyLateCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Terlambat</p>
          </div>

          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">
              {{ monthlySickCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Sakit</p>
          </div>
        </div>
      </div>

      <div class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-4 space-y-6">
            <div
              class="bg-white border border-[#8C352D] p-8 rounded-3xl shadow-sm space-y-2"
            >
              <p class="text-[#8C352D] font-bold">
                Selamat Datang, {{ user?.name }}
              </p>
              <p class="text-sm text-[#8C352D]/60">{{ currentDate }}</p>
              <h1 class="text-5xl font-black text-[#8C352D] py-4">
                {{ currentTime }}
              </h1>
              <div class="h-10 bg-[#8C352D] rounded-xl w-full"></div>
            </div>

            <div
              class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm"
            >
              <div class="flex justify-between items-center mb-6">
                <h4 class="text-[#8C352D] font-bold">
                  Presentase Rekapan Absensi
                </h4>
                <select
                  class="bg-[#8C352D] text-white text-xs rounded-lg px-3 py-1 outline-none"
                >
                  <option>Bulan Ini</option>
                  <option>Bulan Ini</option>
                </select>
              </div>

              <div class="flex items-center gap-6">
                <div class="w-1/2 relative h-40">
                  <div
                    class="w-full h-full rounded-full flex items-center justify-center"
                    :style="attendanceDonutStyle"
                  >
                    <div
                      class="w-[calc(100%-32px)] h-[calc(100%-32px)] rounded-full bg-white flex items-center justify-center"
                    >
                      <span class="text-2xl font-bold text-[#8C352D]">
                        {{ monthlyAttendancePercent }}%
                      </span>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="l in chartLabels"
                    :key="l.text"
                    class="flex items-center gap-2 text-xs font-semibold text-[#8C352D]"
                  >
                    <div :class="`w-3 h-3 rounded-full ${l.color}`"></div>
                    {{ l.text }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-8">
            <div
              class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm h-full"
            >
              <div
                class="flex border border-[#8C352D] rounded-xl overflow-hidden mb-10 w-fit mx-auto lg:mx-0"
              >
                <button
                  v-for="tab in ['Harian', 'Mingguan', 'Bulanan']"
                  :key="tab"
                  :class="[
                    'px-6 py-2 text-sm font-bold transition-colors',
                    tab === 'Bulanan'
                      ? 'bg-[#8C352D] text-white'
                      : 'text-[#8C352D] hover:bg-[#8C352D]/5',
                  ]"
                >
                  {{ tab }}
                </button>
              </div>

              <div
                v-if="isLoading"
                class="h-[400px] flex items-center justify-center text-sm text-[#8C352D]/50 italic"
              >
                Memuat data dashboard...
              </div>
              <div
                v-else
                class="h-[400px] flex items-end justify-between gap-3 px-4"
              >
                <div
                  v-for="bar in barData"
                  :key="bar.month"
                  class="flex-1 flex flex-col items-center gap-2"
                >
                  <span class="text-[10px] font-bold text-[#8C352D]">
                    {{ bar.value }}%
                  </span>

                  <div
                    :class="['w-full rounded-lg transition-all', bar.color]"
                    :style="`height: ${bar.value * 3}px`"
                  ></div>

                  <span class="text-[10px] font-bold text-[#8C352D]">
                    {{ bar.month }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { getAttendanceHistory } from "@/api/attendance.api";
import { useAuth } from "@/composables/useAuth";
import SidebarLayout from "@/layout/sidebarpublic.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";

type AttendanceHistory = {
  date: string;
  status: string;
  source?: string;
  permit_type_name?: string;
};

type BarSummary = {
  month: string;
  value: number;
  color: string;
};

const { user: userState } = useAuth();
const user = computed(() => userState.value);
const isLoading = ref(false);
const now = ref(new Date());
const weeklyHistory = ref<AttendanceHistory[]>([]);
const monthlyHistory = ref<AttendanceHistory[]>([]);
const monthlyBarHistory = ref<Record<string, AttendanceHistory[]>>({});
let timer: ReturnType<typeof setInterval> | undefined;

const chartLabels = [
  { text: "Hadir", color: "bg-[#00E396]" },
  { text: "Terlambat", color: "bg-[#FEB019]" },
  { text: "Tidak Absen", color: "bg-[#FF4560]" },
];

const formatDateKey = (date: Date) => date.toLocaleDateString("en-CA");

const currentDate = computed(() =>
  now.value.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);

const currentTime = computed(() =>
  now.value.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }),
);

const getMonthRange = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return {
    start_date: formatDateKey(new Date(year, month, 1)),
    end_date: formatDateKey(new Date(year, month + 1, 0)),
  };
};

const getCurrentWeekRange = () => {
  const start = new Date();
  const day = start.getDay();
  start.setDate(start.getDate() - day);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return {
    start_date: formatDateKey(start),
    end_date: formatDateKey(end),
  };
};

const isAttendanceStatus = (status: string) =>
  ["present", "late"].includes(status);

const isWorkingDayRecord = (record: AttendanceHistory) => {
  return record.status !== "weekend";
};

const getAttendancePercent = (records: AttendanceHistory[]) => {
  const workingDays = records.filter(isWorkingDayRecord).length;
  if (workingDays === 0) return 0;

  const attended = records.filter((record) =>
    isAttendanceStatus(record.status),
  ).length;
  return Math.round((attended / workingDays) * 100);
};

const weeklyAttendanceCount = computed(
  () =>
    weeklyHistory.value.filter((record) => isAttendanceStatus(record.status))
      .length,
);

const monthlyLateCount = computed(
  () =>
    monthlyHistory.value.filter((record) => record.status === "late").length,
);

const monthlySickCount = computed(
  () =>
    monthlyHistory.value.filter(
      (record) =>
        record.status === "permit" &&
        (record.permit_type_name === "Sick" || record.permit_type_name === "Sakit"),
    ).length,
);

const monthlyAttendancePercent = computed(() =>
  getAttendancePercent(monthlyHistory.value),
);

const attendanceDonutStyle = computed(() => {
  const present = monthlyHistory.value.filter(
    (record) => record.status === "present",
  ).length;
  const late = monthlyHistory.value.filter(
    (record) => record.status === "late",
  ).length;
  const missed = monthlyHistory.value.filter((record) =>
    ["absent", "permit"].includes(record.status),
  ).length;
  const total = present + late + missed;

  if (total === 0) {
    return { background: "#E8D5D2" };
  }

  const presentDeg = (present / total) * 360;
  const lateDeg = presentDeg + (late / total) * 360;
  return {
    background: `conic-gradient(#00E396 0deg ${presentDeg}deg, #FEB019 ${presentDeg}deg ${lateDeg}deg, #FF4560 ${lateDeg}deg 360deg)`,
  };
});

const getBarColor = (value: number) => {
  if (value >= 80) return "bg-[#00E396]";
  if (value >= 50) return "bg-[#FEB019]";
  return "bg-[#FF4560]";
};

const barData = computed<BarSummary[]>(() => {
  return Object.entries(monthlyBarHistory.value).map(([month, records]) => {
    const value = getAttendancePercent(records);
    return {
      month,
      value,
      color: getBarColor(value),
    };
  });
});

const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    const monthDates = Array.from({ length: 5 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (4 - index));
      return date;
    });

    const [weekResponse, monthResponse, ...barResponses] = await Promise.all([
      getAttendanceHistory(getCurrentWeekRange()),
      getAttendanceHistory(getMonthRange(new Date())),
      ...monthDates.map((date) => getAttendanceHistory(getMonthRange(date))),
    ]);

    weeklyHistory.value = weekResponse?.data?.data?.history ?? [];
    monthlyHistory.value = monthResponse?.data?.data?.history ?? [];
    monthlyBarHistory.value = Object.fromEntries(
      monthDates.map((date, index) => [
        date.toLocaleDateString("id-ID", { month: "short" }),
        barResponses[index]?.data?.data?.history ?? [],
      ]),
    );
  } catch (error) {
    console.error(error);
    weeklyHistory.value = [];
    monthlyHistory.value = [];
    monthlyBarHistory.value = {};
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
  timer = setInterval(() => {
    now.value = new Date();
  }, 30000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
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
