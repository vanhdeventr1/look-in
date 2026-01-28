<template>
  <SidebarLayout>
    <div class="space-y-6">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex items-center gap-2 px-4 py-2 border border-[#8C352D] rounded-xl text-[#8C352D] bg-white cursor-pointer hover:bg-[#8C352D]/5 transition-colors font-bold text-sm"
          >
            <CalendarIcon :size="18" />
            <span>Oktober</span>
          </div>
          <div
            class="flex items-center gap-2 px-4 py-2 text-[#8C352D] cursor-pointer hover:opacity-70 transition-opacity font-bold text-sm"
          >
            <FilterIcon :size="18" />
            <span>Terbaru</span>
          </div>
        </div>

        <div class="relative w-full md:w-80">
          <span
            class="absolute inset-y-0 left-4 flex items-center text-[#8C352D]/40"
          >
            <SearchIcon :size="18" />
          </span>
          <input
            type="text"
            placeholder="Cari data pengguna"
            class="w-full pl-12 pr-4 py-3 rounded-full border border-[#E8D5D2] bg-white text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20 transition-all placeholder:text-[#8C352D]/30"
          />
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
                <th class="px-6 py-4 font-bold text-sm">Alasan</th>
                <th class="px-6 py-4 font-bold text-sm">Tanggal Izin</th>
                <th class="px-6 py-4 font-bold text-sm">Status</th>
                <th class="px-6 py-4 font-bold text-sm text-center">
                  Persetujuan
                </th>
                <th class="px-6 py-4 font-bold text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8D5D2]">
              <tr
                v-for="(permit, index) in permits"
                :key="permit.id"
                class="hover:bg-[#FFF0EE]/30 transition-colors"
              >
                <td
                  class="px-6 py-4 text-sm font-semibold text-[#8C352D] text-center"
                >
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-[#8C352D]">
                  {{ permit.name }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                  {{ permit.reason }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                  {{ permit.date }}
                </td>
                <td class="px-6 py-4 text-sm font-bold text-[#8C352D]">
                  {{ permit.status }}
                </td>
                <td class="px-6 py-4">
                  <div
                    class="flex items-center justify-center gap-2"
                    v-if="permit.status === 'Menunggu Persetujuan'"
                  >
                    <button
                      class="text-green-600 hover:scale-110 transition-transform"
                    >
                      <CheckCircleIcon :size="20" />
                    </button>
                    <button
                      class="text-red-600 hover:scale-110 transition-transform"
                    >
                      <XCircleIcon :size="20" />
                    </button>
                  </div>
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
  CheckCircle2 as CheckCircleIcon,
  Eye as EyeIcon,
  Settings2 as FilterIcon,
  Search as SearchIcon,
  XCircle as XCircleIcon,
} from "lucide-vue-next";
import { ref } from "vue";

// Mock data matching the Permit (Persetujuan) image
const permits = ref([
  {
    id: 1,
    name: "Johnny Marr",
    reason: "Sakit",
    date: "7/10/25 - 8/10/25",
    status: "Menunggu Persetujuan",
  },
  {
    id: 2,
    name: "Morrissey",
    reason: "Sakit",
    date: "7/10/25 - 8/10/25",
    status: "Menunggu Persetujuan",
  },
  {
    id: 3,
    name: "Julian Casablancas",
    reason: "Sakit",
    date: "7/10/25 - 8/10/25",
    status: "Menunggu Persetujuan",
  },
  {
    id: 4,
    name: "Thom Yorke",
    reason: "Alasan Lain",
    date: "7/10/25 - 8/10/25",
    status: "Menunggu Persetujuan",
  },
  {
    id: 5,
    name: "Mark Mckenna",
    reason: "Sakit",
    date: "7/10/25 - 8/10/25",
    status: "Sudah Persetujuan",
  },
  {
    id: 6,
    name: "Ethel Cain",
    reason: "Alasan Lain",
    date: "7/10/25 - 8/10/25",
    status: "Sudah Persetujuan",
  },
  {
    id: 7,
    name: "Taylor Swift",
    reason: "Alasan Lain",
    date: "7/10/25 - 8/10/25",
    status: "Sudah Persetujuan",
  },
  {
    id: 8,
    name: "Chappell Roan",
    reason: "Sakit",
    date: "7/10/25 - 8/10/25",
    status: "Sudah Persetujuan",
  },
  {
    id: 9,
    name: "Hayley Williams",
    reason: "Sakit",
    date: "7/10/25 - 8/10/25",
    status: "Sudah Persetujuan",
  },
  {
    id: 10,
    name: "Kellin Quinn",
    reason: "Sakit",
    date: "7/10/25 - 8/10/25",
    status: "Menunggu Persetujuan",
  },
]);
</script>

<style scoped>
table {
  border-spacing: 0;
}
</style>
