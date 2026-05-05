<template>
  <SidebarLayout>
    <div class="space-y-6 animate-in">
      <div class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              {{ lateAttendanceCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Terlambat</p>
          </div>

          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">
              {{ permitAttendanceCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Izin</p>
          </div>

          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">
              {{ pendingPermitCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Menunggu Persetujuan</p>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <div
            class="relative flex items-center gap-2 px-4 py-2 border border-[#8C352D] rounded-xl text-[#8C352D] bg-white hover:bg-[#8C352D]/5 transition-colors font-bold text-sm cursor-pointer overflow-hidden group"
          >
            <CalendarIcon :size="18" class="relative z-0" />
            <span class="relative z-0">
              {{ selectedDate ? formatDate(selectedDate) : "Semua Tanggal" }}
            </span>
            <input
              v-model="selectedDate"
              type="date"
              class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 block"
            />
          </div>

          <div class="relative">
            <CalendarIcon
              :size="18"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C352D] pointer-events-none z-10"
            />
            <select
              v-model="selectedMonth"
              class="pl-10 pr-8 py-2 border border-[#8C352D] rounded-xl text-[#8C352D] bg-white cursor-pointer hover:bg-[#8C352D]/5 transition-colors font-bold text-sm focus:outline-none appearance-none"
            >
              <option :value="null">Semua Bulan</option>
              <option
                v-for="(month, index) in months"
                :key="index"
                :value="index"
              >
                {{ month }}
              </option>
            </select>
          </div>

          <div class="relative">
            <select
              v-model="selectedYear"
              class="px-4 py-2 border border-[#8C352D] rounded-xl text-[#8C352D] bg-white cursor-pointer hover:bg-[#8C352D]/5 transition-colors font-bold text-sm focus:outline-none appearance-none"
            >
              <option :value="null">Semua Tahun</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <div
            @click="toggleSort"
            class="flex items-center gap-2 px-4 py-2 border border-transparent rounded-xl text-[#8C352D] cursor-pointer hover:bg-[#8C352D]/5 transition-all font-bold text-sm"
          >
            <FilterIcon
              :size="18"
              :class="{ 'rotate-180': sortOrder === 'oldest' }"
              class="transition-transform"
            />
            <span>{{ sortOrder === "newest" ? "Terbaru" : "Terlama" }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white border border-[#E8D5D2] rounded-2xl overflow-hidden shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="bg-[#8C352D] text-white">
                <th class="px-6 py-4 font-bold text-sm text-center">No</th>
                <th class="px-6 py-4 font-bold text-sm">Nama Lengkap</th>
                <th class="px-6 py-4 font-bold text-sm text-center">Tanggal</th>
                <th class="px-6 py-4 font-bold text-sm text-center">
                  Jam Masuk
                </th>
                <th class="px-6 py-4 font-bold text-sm text-center">
                  Jam Keluar
                </th>
                <th class="px-6 py-4 font-bold text-sm">Status</th>
                <th class="px-6 py-4 font-bold text-sm">Catatan</th>
                <th class="px-6 py-4 font-bold text-sm">Latitude</th>
                <th class="px-6 py-4 font-bold text-sm">Longitude</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8D5D2]">
              <tr
                v-for="(record, index) in paginatedRecords"
                :key="record.id"
                class="hover:bg-[#FFF0EE]/30 transition-colors"
              >
                <td
                  class="px-6 py-4 text-sm font-semibold text-[#8C352D] text-center"
                >
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-[#8C352D]">
                  {{ record.name }}
                </td>
                <td
                  class="px-6 py-4 text-sm text-[#8C352D]/80 text-center font-medium"
                >
                  {{ record.displayDate }}
                </td>
                <td
                  class="px-6 py-4 text-sm text-[#8C352D]/80 text-center font-medium"
                >
                  {{ record.checkIn }}
                </td>
                <td
                  class="px-6 py-4 text-sm text-[#8C352D]/80 text-center font-medium"
                >
                  {{ record.checkOut }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                  {{ record.info }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                  {{ record.note }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80 font-mono">
                  {{ record.lat }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80 font-mono">
                  {{ record.lng }}
                </td>
              </tr>
              <tr v-if="isLoading">
                <td
                  colspan="9"
                  class="px-6 py-10 text-center text-[#8C352D]/50 italic"
                >
                  Memuat data absensi...
                </td>
              </tr>
              <tr v-else-if="errorMessage">
                <td
                  colspan="9"
                  class="px-6 py-10 text-center text-[#8C352D]/50 italic"
                >
                  {{ errorMessage }}
                </td>
              </tr>
              <tr v-else-if="filteredRecords.length === 0">
                <td
                  colspan="9"
                  class="px-6 py-10 text-center text-[#8C352D]/50 italic"
                >
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="filteredRecords.length > 0"
          class="flex items-center justify-between px-6 py-4 bg-[#FFF0EE]/30 border-t border-[#E8D5D2]"
        >
          <span class="text-sm text-[#8C352D] font-medium">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, filteredRecords.length) }}
            dari {{ filteredRecords.length }} data
          </span>

          <div class="flex items-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg border border-[#8C352D] text-[#8C352D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#8C352D] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeftIcon :size="16" />
            </button>

            <div class="flex items-center gap-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  currentPage === page
                    ? 'bg-[#8C352D] text-white shadow-sm'
                    : 'text-[#8C352D] hover:bg-[#8C352D]/10',
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-lg border border-[#8C352D] text-[#8C352D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#8C352D] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRightIcon :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { getAttendanceHistory } from "@/api/attendance.api";
import { getPermits } from "@/api/permit.api";
import SidebarLayout from "@/layout/sidebarpublic.vue";
import {
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Settings2 as FilterIcon,
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";

type AttendanceRecord = {
  id: string;
  name: string;
  date: string;
  displayDate: string;
  checkIn: string;
  checkOut: string;
  info: string;
  status: string;
  note: string;
  lat: string;
  lng: string;
  createdAt: string;
  raw: any;
};

const currentUser = JSON.parse(localStorage.getItem("user") || "null");
const today = new Date().toISOString().split("T")[0] ?? "";
const searchQuery = ref("");
const selectedDate = ref<string | null>(null);
const selectedMonth = ref<number | null>(new Date().getMonth());
const selectedYear = ref<number | null>(new Date().getFullYear());
const sortOrder = ref<"newest" | "oldest">("newest");
const isLoading = ref(false);
const errorMessage = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const attendanceRecords = ref<AttendanceRecord[]>([]);
const weeklyAttendanceRecords = ref<AttendanceRecord[]>([]);
const pendingPermitCount = ref(0);

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const years = Array.from(
  { length: 5 },
  (_, i) => new Date().getFullYear() - 2 + i,
);

const toggleSort = () => {
  sortOrder.value = sortOrder.value === "newest" ? "oldest" : "newest";
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDisplayDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getMonthEndDate = (year: number, month: number) => {
  return new Date(year, month + 1, 0).toLocaleDateString("en-CA");
};

const getHistoryRange = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  if (selectedDate.value) {
    return {
      start_date: selectedDate.value,
      end_date: selectedDate.value,
    };
  }

  if (selectedYear.value !== null && selectedMonth.value !== null) {
    const start = `${selectedYear.value}-${String(selectedMonth.value + 1).padStart(2, "0")}-01`;
    return {
      start_date: start,
      end_date: getMonthEndDate(selectedYear.value, selectedMonth.value),
    };
  }

  if (selectedYear.value !== null) {
    return {
      start_date: `${selectedYear.value}-01-01`,
      end_date: `${selectedYear.value}-12-31`,
    };
  }

  return {
    start_date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`,
    end_date: getMonthEndDate(currentYear, currentMonth),
  };
};

const getCurrentWeekRange = () => {
  return {
    start_date: startOfCurrentWeek.value.toLocaleDateString("en-CA"),
    end_date: endOfCurrentWeek.value.toLocaleDateString("en-CA"),
  };
};

const getSummaryRange = () => {
  if (selectedDate.value) {
    return {
      start_date: selectedDate.value,
      end_date: selectedDate.value,
    };
  }

  return getCurrentWeekRange();
};

const statusLabelMap: Record<string, string> = {
  present: "Hadir",
  late: "Terlambat",
  permit: "Izin",
  sick: "Sakit",
  absent: "Tidak Hadir",
  weekend: "Akhir Pekan",
};

const permitTypeLabelMap: Record<string, string> = {
  Sick: "Sakit",
  Permit: "Izin",
  Leave: "Cuti",
};

const getHistoryStatus = (history: any) => {
  if (history.status !== "permit") {
    return statusLabelMap[history.status] ?? history.status ?? "-";
  }

  return (
    permitTypeLabelMap[history.permit_type_name] ??
    history.permit_type_name ??
    "Izin"
  );
};

const mapAttendanceHistory = (history: any): AttendanceRecord => {
  const status = getHistoryStatus(history);
  const clockIn = history.clock_in;

  return {
    id: `${history.user_id}-${history.date}-${history.source}-${history.attendance_id ?? history.permit_id ?? "system"}`,
    name:
      history.user?.name ??
      history.user?.full_name ??
      currentUser?.name ??
      currentUser?.full_name ??
      "-",
    date: history.date,
    displayDate: formatDisplayDate(clockIn ?? history.date),
    checkIn: formatTime(clockIn),
    checkOut: formatTime(history.clock_out),
    info:
      history.status === "late"
        ? `Terlambat ${history.late_duration ?? 0} menit`
        : status,
    status,
    note: history.note ?? "-",
    lat: history.gps_lat ?? "-",
    lng: history.gps_lng ?? "-",
    createdAt: clockIn ?? history.date,
    raw: history,
  };
};

const fetchAttendanceHistory = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await getAttendanceHistory(getHistoryRange());
    const data = response?.data?.data?.history ?? [];
    attendanceRecords.value = data.map(mapAttendanceHistory);
  } catch (error) {
    console.error(error);
    errorMessage.value = "Gagal memuat riwayat absensi.";
  } finally {
    isLoading.value = false;
  }
};

const fetchWeeklyAttendanceSummary = async () => {
  try {
    const response = await getAttendanceHistory(getSummaryRange());
    const data = response?.data?.data?.history ?? [];
    weeklyAttendanceRecords.value = data.map(mapAttendanceHistory);
  } catch (error) {
    console.error(error);
    weeklyAttendanceRecords.value = [];
  }
};

const isPendingPermit = (permit: any) => {
  return (
    Number(permit.status ?? permit.status_code) === 0 ||
    permit.status_name === "Menunggu Persetujuan"
  );
};

const isPermitInSummaryRange = (permit: any) => {
  const range = getSummaryRange();
  const rangeStart = new Date(range.start_date);
  const rangeEnd = new Date(range.end_date);
  const startValue =
    permit.date_start ?? permit.start_date ?? permit.created_at;
  const endValue = permit.date_end ?? permit.end_date ?? startValue;
  const start = new Date(startValue);
  const end = new Date(endValue);

  if (
    isNaN(rangeStart.getTime()) ||
    isNaN(rangeEnd.getTime()) ||
    isNaN(start.getTime()) ||
    isNaN(end.getTime())
  ) {
    return false;
  }

  rangeStart.setHours(0, 0, 0, 0);
  rangeEnd.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return start <= rangeEnd && end >= rangeStart;
};

const fetchPendingPermits = async () => {
  try {
    const response = await getPermits({ limit: 1000 });
    const permits = response?.data?.data?.permits ?? [];
    pendingPermitCount.value = permits.filter(
      (permit: any) =>
        isPendingPermit(permit) && isPermitInSummaryRange(permit),
    ).length;
  } catch (error) {
    console.error(error);
    pendingPermitCount.value = 0;
  }
};

const filteredRecords = computed(() => {
  let result = attendanceRecords.value.filter((record) => {
    const recordDate = new Date(record.date);
    const query = searchQuery.value.toLowerCase();
    const matchesSearch =
      record.name.toLowerCase().includes(query) ||
      record.status.toLowerCase().includes(query) ||
      record.note.toLowerCase().includes(query);
    const matchesDate = selectedDate.value
      ? record.date === selectedDate.value
      : true;
    const matchesMonth =
      selectedMonth.value !== null
        ? recordDate.getMonth() === selectedMonth.value
        : true;
    const matchesYear =
      selectedYear.value !== null
        ? recordDate.getFullYear() === selectedYear.value
        : true;
    return matchesSearch && matchesDate && matchesMonth && matchesYear;
  });

  return result.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder.value === "newest" ? timeB - timeA : timeA - timeB;
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredRecords.value.length / itemsPerPage),
);

const startOfCurrentWeek = computed(() => {
  const date = new Date(today);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
});

const endOfCurrentWeek = computed(() => {
  const date = new Date(startOfCurrentWeek.value);
  date.setDate(date.getDate() + 6);
  date.setHours(23, 59, 59, 999);
  return date;
});

const weeklyAttendanceCount = computed(
  () =>
    weeklyAttendanceRecords.value.filter((record) =>
      ["Hadir", "Terlambat"].includes(record.status),
    ).length,
);

const lateAttendanceCount = computed(
  () =>
    weeklyAttendanceRecords.value.filter(
      (record) => record.status === "Terlambat",
    ).length,
);

const permitAttendanceCount = computed(
  () =>
    weeklyAttendanceRecords.value.filter((record) =>
      ["Izin", "Sakit", "Cuti"].includes(record.status),
    ).length,
);

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRecords.value.slice(start, end);
});

watch([searchQuery, selectedDate, selectedMonth, selectedYear], () => {
  currentPage.value = 1;
});

watch([selectedDate, selectedMonth, selectedYear], fetchAttendanceHistory);
watch(selectedDate, () => {
  fetchWeeklyAttendanceSummary();
  fetchPendingPermits();
});

onMounted(() => {
  fetchAttendanceHistory();
  fetchWeeklyAttendanceSummary();
  fetchPendingPermits();
});
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  cursor: pointer;
  background: transparent;
  color: transparent;
}

table {
  border-spacing: 0;
}
th,
td {
  white-space: nowrap;
}
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
