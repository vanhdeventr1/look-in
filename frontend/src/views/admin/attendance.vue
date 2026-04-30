<template>
  <SidebarLayout>
    <div class="space-y-6 animate-in">
      <div class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">24</p>
            <p class="text-[#8C352D] font-medium">Absen Hari Ini</p>
          </div>
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">12</p>
            <p class="text-[#8C352D] font-medium">Terlambat</p>
          </div>
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">3</p>
            <p class="text-[#8C352D] font-medium">Sakit</p>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <div
            class="relative flex items-center gap-2 px-4 py-2 border border-[#8C352D] rounded-xl text-[#8C352D] bg-white hover:bg-[#8C352D]/5 transition-colors font-bold text-sm cursor-pointer"
          >
            <CalendarIcon :size="18" />
            <span class="">
              {{ selectedDate ? formatDate(selectedDate) : "Semua Tanggal" }}
            </span>
            <input
              v-model="selectedDate"
              type="date"
              class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
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

        <div class="flex items-center gap-3">
          <button
            class="bg-[#8C352D] text-white p-2.5 rounded-xl hover:bg-[#a24a42] transition-colors shadow-md"
          >
            <DownloadIcon :size="20" />
          </button>
          <div class="relative w-full md:w-64">
            <span
              class="absolute inset-y-0 left-4 flex items-center text-[#8C352D]/40"
            >
              <SearchIcon :size="18" />
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari data pengguna"
              class="w-full pl-12 pr-4 py-2.5 rounded-full border border-[#E8D5D2] bg-white text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20 transition-all placeholder:text-[#8C352D]/30"
            />
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
                <th class="px-6 py-4 font-bold text-sm text-center">
                  Jam Masuk
                </th>
                <th class="px-6 py-4 font-bold text-sm text-center">
                  Jam Keluar
                </th>
                <th class="px-6 py-4 font-bold text-sm">Keterangan</th>
                <th class="px-6 py-4 font-bold text-sm">Status</th>
                <th class="px-6 py-4 font-bold text-sm">Latitude</th>
                <th class="px-6 py-4 font-bold text-sm">Longitude</th>
                <th class="px-6 py-4 font-bold text-sm">Catatan</th>
                <th class="px-6 py-4 font-bold text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8D5D2]">
              <tr
                v-for="(record, index) in filteredRecords"
                :key="record.id"
                class="hover:bg-[#FFF0EE]/30 transition-colors"
              >
                <td
                  class="px-6 py-4 text-sm font-semibold text-[#8C352D] text-center"
                >
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-[#8C352D]">
                  {{ record.name }}
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
                  {{ record.status }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80 font-mono">
                  {{ record.lat }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80 font-mono">
                  {{ record.lng }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80 italic">
                  {{ record.note || "-" }}
                </td>
                <td class="px-6 py-4 text-center">
                  <button
                    class="text-[#8C352D] hover:scale-110 transition-transform"
                  >
                    <EyeIcon :size="18" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredRecords.length === 0">
                <td
                  colspan="10"
                  class="px-6 py-10 text-center text-[#8C352D]/50 italic"
                >
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import SidebarLayout from "@/layout/sidebar.vue";
import {
  Calendar as CalendarIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
  Settings2 as FilterIcon,
  Search as SearchIcon,
} from "lucide-vue-next";
import { computed, ref } from "vue";

// State
const today = new Date().toISOString().split("T")[0];
const searchQuery = ref("");
const selectedDate = ref<string | null>(today);
const selectedMonth = ref<number | null>(null);
const selectedYear = ref<number | null>(null);
const sortOrder = ref<"newest" | "oldest">("newest");

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
  { length: 11 },
  (_, i) => new Date().getFullYear() - i,
);

// Master Data (Ditambahkan properti createdAt untuk sorting yang akurat)
const attendanceRecords = ref([
  {
    id: 1,
    name: "Johnny Marr",
    date: "2026-04-24",
    checkIn: "08:00 WIB",
    checkOut: "17:00 WIB",
    info: "Tepat Waktu",
    status: "-",
    lat: "-40.626",
    lng: "-162.932",
    note: "Hadir",
    createdAt: "2026-04-24T08:00:00",
  },
  {
    id: 2,
    name: "Morrissey",
    date: "2026-04-24",
    checkIn: "08:10 WIB",
    checkOut: "17:05 WIB",
    info: "Terlambat",
    status: "-",
    lat: "-40.626",
    lng: "-162.932",
    note: "Macet",
    createdAt: "2026-04-24T08:10:00",
  },
  {
    id: 3,
    name: "Julian Casablancas",
    date: "2026-04-23",
    checkIn: "08:20 WIB",
    checkOut: "--:-- WIB",
    info: "Terlambat",
    status: "-",
    lat: "-40.626",
    lng: "-162.932",
    note: "Ban bocor",
    createdAt: "2026-04-23T08:20:00",
  },
  {
    id: 4,
    name: "Hayley Williams",
    date: "2026-04-24",
    checkIn: "--:-- WIB",
    checkOut: "--:-- WIB",
    info: "Sakit",
    status: "Ok",
    lat: "-",
    lng: "-",
    note: "Surat Dokter",
    createdAt: "2026-04-24T07:45:00",
  },
  {
    id: 4,
    name: "Hayley Williams",
    date: "2026-04-24",
    checkIn: "--:-- WIB",
    checkOut: "--:-- WIB",
    info: "Sakit",
    status: "Ok",
    lat: "-",
    lng: "-",
    note: "Surat Dokter",
    createdAt: "2026-04-24T07:45:00",
  },
  {
    id: 4,
    name: "Hayley Williams",
    date: "2026-04-24",
    checkIn: "--:-- WIB",
    checkOut: "--:-- WIB",
    info: "Sakit",
    status: "Ok",
    lat: "-",
    lng: "-",
    note: "Surat Dokter",
    createdAt: "2026-04-24T07:45:00",
  },
  {
    id: 4,
    name: "Hayley Williams",
    date: "2026-04-24",
    checkIn: "--:-- WIB",
    checkOut: "--:-- WIB",
    info: "Sakit",
    status: "Ok",
    lat: "-",
    lng: "-",
    note: "Surat Dokter",
    createdAt: "2026-04-24T07:45:00",
  },
  {
    id: 4,
    name: "Hayley Williams",
    date: "2026-04-24",
    checkIn: "--:-- WIB",
    checkOut: "--:-- WIB",
    info: "Sakit",
    status: "Ok",
    lat: "-",
    lng: "-",
    note: "Surat Dokter",
    createdAt: "2026-04-24T07:45:00",
  },
  {
    id: 4,
    name: "Hayley Williams",
    date: "2026-04-24",
    checkIn: "--:-- WIB",
    checkOut: "--:-- WIB",
    info: "Sakit",
    status: "Ok",
    lat: "-",
    lng: "-",
    note: "Surat Dokter",
    createdAt: "2026-04-24T07:45:00",
  },
  {
    id: 4,
    name: "Hayley Williams",
    date: "2026-04-24",
    checkIn: "--:-- WIB",
    checkOut: "--:-- WIB",
    info: "Sakit",
    status: "Ok",
    lat: "-",
    lng: "-",
    note: "Surat Dokter",
    createdAt: "2026-04-24T07:45:00",
  },
  {
    id: 4,
    name: "Hayley Williams",
    date: "2026-04-24",
    checkIn: "--:-- WIB",
    checkOut: "--:-- WIB",
    info: "Sakit",
    status: "Ok",
    lat: "-",
    lng: "-",
    note: "Surat Dokter",
    createdAt: "2026-04-24T07:45:00",
  },
  {
    id: 4,
    name: "Hayley Williams",
    date: "2026-04-24",
    checkIn: "--:-- WIB",
    checkOut: "--:-- WIB",
    info: "Sakit",
    status: "Ok",
    lat: "-",
    lng: "-",
    note: "Surat Dokter",
    createdAt: "2026-04-24T07:45:00",
  },
]);

// Actions
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

// Logika Filter & Sorting
const filteredRecords = computed(() => {
  let result = attendanceRecords.value.filter((record) => {
    const recordDate = new Date(record.date);
    const matchesSearch = record.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
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

  // Urutkan berdasarkan Tanggal Pembuatan Data (createdAt)
  return result.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();

    // "newest" = Data yang paling terakhir dibuat muncul di atas
    // "oldest" = Data yang paling awal dibuat muncul di atas
    return sortOrder.value === "newest" ? timeB - timeA : timeA - timeB;
  });
});
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  color: transparent;
  background: transparent;
  cursor: pointer;
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
