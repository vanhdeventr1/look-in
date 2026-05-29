<template>
  <SidebarLayout>
    <div class="space-y-6 animate-in">
      <div class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">
              {{ todayAttendanceCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Absen Hari Ini</p>
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

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-5 space-y-8">
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

            <div class="flex items-center gap-4">
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
              <div class="space-y-2">
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

          <div
            class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm"
          >
            <h4 class="text-[#8C352D] font-bold mb-6">MVP Absensi Bulan Ini</h4>
            <div class="space-y-4">
              <p
                v-if="mvpList.length === 0"
                class="text-sm text-[#8C352D]/50 italic"
              >
                Belum ada data absensi bulan ini.
              </p>
              <template v-else>
                <div
                  v-for="(mvp, index) in mvpList"
                  :key="mvp.name"
                  class="flex items-center gap-4"
                >
                  <span class="text-xs font-bold text-[#8C352D] w-4">
                    {{ index + 1 }}
                  </span>
                  <div class="flex-1">
                    <div class="flex justify-between mb-1">
                      <span class="text-xs font-bold text-[#8C352D]">
                        {{ mvp.name }}
                      </span>
                      <span class="text-xs font-bold text-[#8C352D]">
                        {{ mvp.percent }}%
                      </span>
                    </div>
                    <div class="w-full bg-[#E8D5D2]/50 rounded-full h-2">
                      <div
                        class="bg-[#00E396] h-2 rounded-full"
                        :style="`width: ${mvp.percent}%`"
                      ></div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7">
          <div
            class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm h-full"
          >
            <div
              class="flex border border-[#8C352D] rounded-xl overflow-hidden mb-8 w-fit mx-auto lg:mx-0"
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
              class="h-[400px] flex items-end justify-between gap-2 px-4"
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
  </SidebarLayout>
</template>

<script setup lang="ts">
import { getAttendanceHistory } from "@/api/attendance.api";
import { getUsers } from "@/api/users.api";
import SidebarLayout from "@/layout/sidebar.vue";
import { computed, onMounted, ref } from "vue";

type AttendanceHistory = {
  user_id: number;
  user?: { id?: number; name?: string; full_name?: string };
  date: string;
  status: string;
  source?: string;
  permit_type_name?: string;
};

type EmployeeSummary = {
  name: string;
  percent: number;
};

type BarSummary = {
  month: string;
  value: number;
  color: string;
};

const isLoading = ref(false);
const monthlyHistory = ref<AttendanceHistory[]>([]);
const todayHistory = ref<AttendanceHistory[]>([]);
const monthlyEmployees = ref<any[]>([]);
const monthlyBarHistory = ref<Record<string, AttendanceHistory[]>>({});

const chartLabels = [
  { text: "Hadir", color: "bg-[#00E396]" },
  { text: "Terlambat", color: "bg-[#FEB019]" },
  { text: "Tidak Absen", color: "bg-[#FF4560]" },
];

const formatDateKey = (date: Date) => date.toLocaleDateString("en-CA");

const getMonthRange = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return {
    start_date: formatDateKey(new Date(year, month, 1)),
    end_date: formatDateKey(new Date(year, month + 1, 0)),
  };
};

const isAttendanceStatus = (status: string) =>
  ["present", "late"].includes(status);

const isLateStatus = (status: string) => status === "late";

const isSickStatus = (record: AttendanceHistory) => {
  return (
    record.status === "permit" &&
    record.source === "permit" &&
    (record.permit_type_name === "Sick" || record.permit_type_name === "Sakit")
  );
};

const isWorkingDayRecord = (record: AttendanceHistory) => {
  return !["weekend"].includes(record.status);
};

const getAttendancePercent = (records: AttendanceHistory[]) => {
  const workingDays = records.filter(isWorkingDayRecord).length;
  if (workingDays === 0) return 0;

  const attended = records.filter((record) =>
    isAttendanceStatus(record.status),
  ).length;
  return Math.round((attended / workingDays) * 100);
};

const todayAttendanceCount = computed(
  () =>
    todayHistory.value.filter((record) => isAttendanceStatus(record.status))
      .length,
);

const monthlyLateCount = computed(
  () =>
    monthlyHistory.value.filter((record) => isLateStatus(record.status)).length,
);

const monthlySickCount = computed(
  () => monthlyHistory.value.filter(isSickStatus).length,
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

const mvpList = computed<EmployeeSummary[]>(() => {
  const byUser = new Map<number, AttendanceHistory[]>();

  for (const record of monthlyHistory.value) {
    if (!record.user_id) continue;
    const records = byUser.get(record.user_id) ?? [];
    records.push(record);
    byUser.set(record.user_id, records);
  }

  return monthlyEmployees.value
    .map((employee) => {
      const id = Number(employee.id);
      return {
        name: employee.name ?? employee.full_name ?? "-",
        percent: getAttendancePercent(byUser.get(id) ?? []),
      };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);
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
    const today = formatDateKey(new Date());
    const currentMonthRange = getMonthRange(new Date());
    const monthDates = Array.from({ length: 5 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (4 - index));
      return date;
    });

    const [todayResponse, monthResponse, userResponse, ...barResponses] =
      await Promise.all([
        getAttendanceHistory({ start_date: today, end_date: today }),
        getAttendanceHistory(currentMonthRange),
        getUsers({ limit: 1000 }),
        ...monthDates.map((date) => getAttendanceHistory(getMonthRange(date))),
      ]);

    todayHistory.value = todayResponse?.data?.data?.history ?? [];
    monthlyHistory.value = monthResponse?.data?.data?.history ?? [];
    monthlyEmployees.value = userResponse?.data?.data?.users ?? [];

    monthlyBarHistory.value = Object.fromEntries(
      monthDates.map((date, index) => [
        date.toLocaleDateString("id-ID", { month: "short" }),
        barResponses[index]?.data?.data?.history ?? [],
      ]),
    );
  } catch (error) {
    console.error(error);
    todayHistory.value = [];
    monthlyHistory.value = [];
    monthlyEmployees.value = [];
    monthlyBarHistory.value = {};
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDashboardData);
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
