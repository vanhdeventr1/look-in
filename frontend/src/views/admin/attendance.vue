<template>
  <SidebarLayout>
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in summaryStats"
          :key="stat.label"
          class="bg-white border border-[#E8D5D2] rounded-2xl p-6 flex flex-col justify-center min-h-[140px] shadow-sm"
        >
          <p class="text-4xl font-bold text-[#8C352D]">{{ stat.value }}</p>
          <p class="text-lg font-bold text-[#8C352D] mt-1">{{ stat.label }}</p>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <div
            class="flex items-center gap-2 px-4 py-2 border border-[#8C352D] rounded-xl text-[#8C352D] bg-white cursor-pointer hover:bg-[#8C352D]/5 transition-colors font-bold text-sm"
          >
            <CalendarIcon :size="18" />
            <span>7/8/25</span>
          </div>
          <div
            class="flex items-center gap-2 px-4 py-2 text-[#8C352D] cursor-pointer hover:opacity-70 transition-opacity font-bold text-sm"
          >
            <FilterIcon :size="18" />
            <span>Terbaru</span>
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
                <th class="px-6 py-4 font-bold text-sm">Jam Absen</th>
                <th class="px-6 py-4 font-bold text-sm">Keterangan</th>
                <th class="px-6 py-4 font-bold text-sm">Status</th>
                <th class="px-6 py-4 font-bold text-sm">Latitude</th>
                <th class="px-6 py-4 font-bold text-sm">Longitude</th>
                <th class="px-6 py-4 font-bold text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8D5D2]">
              <tr
                v-for="(record, index) in attendanceRecords"
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
                <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                  {{ record.time }}
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
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center">
                    <button
                      class="text-[#8C352D] hover:scale-110 transition-transform"
                    >
                      <EyeIcon :size="18" />
                    </button>
                  </div>
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
import { ref } from "vue";

// Top Summary Mock Data
const summaryStats = [
  { label: "Absen Hari Ini", value: 12 },
  { label: "Terlambat", value: 6 },
  { label: "Sakit", value: 1 },
  { label: "Menunggu Perizinan", value: 1 },
];

// Table Mock Data
const attendanceRecords = ref([
  {
    id: 1,
    name: "Johnny Marr",
    time: "08:00 WIB",
    info: "Tepat Waktu",
    status: "-",
    lat: "-40.62678",
    lng: "-162.93208",
  },
  {
    id: 2,
    name: "Morrissey",
    time: "08:10 WIB",
    info: "Terlambat 10 Menit",
    status: "-",
    lat: "-40.62678",
    lng: "-162.93208",
  },
  {
    id: 3,
    name: "Julian Casablancas",
    time: "08:20 WIB",
    info: "Terlambat 20 Menit",
    status: "-",
    lat: "-40.62678",
    lng: "-162.93208",
  },
  {
    id: 4,
    name: "Thom Yorke",
    time: "08:01 WIB",
    info: "Terlambat 1 Menit",
    status: "-",
    lat: "-40.62678",
    lng: "-162.93208",
  },
  {
    id: 5,
    name: "Mark Mckenna",
    time: "08:00 WIB",
    info: "Tepat Waktu",
    status: "-",
    lat: "-40.62678",
    lng: "-162.93208",
  },
  {
    id: 6,
    name: "Ethel Cain",
    time: "08:00 WIB",
    info: "Tepat Waktu",
    status: "-",
    lat: "-40.62678",
    lng: "-162.93208",
  },
  {
    id: 7,
    name: "Taylor Swift",
    time: "08:00 WIB",
    info: "Tepat Waktu",
    status: "-",
    lat: "-40.62678",
    lng: "-162.93208",
  },
  {
    id: 8,
    name: "Chappell Roan",
    time: "--:-- WIB",
    info: "Sakit",
    status: "Menunggu Persetujuan",
    lat: "-",
    lng: "-",
  },
  {
    id: 9,
    name: "Hayley Williams",
    time: "--:-- WIB",
    info: "Sakit",
    status: "Sudah Persetujuan",
    lat: "-",
    lng: "-",
  },
]);
</script>

<style scoped>
table {
  border-spacing: 0;
}
/* Ensure table text doesn't wrap awkwardly */
th,
td {
  white-space: nowrap;
}
</style>
