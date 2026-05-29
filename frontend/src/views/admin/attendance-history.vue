<template>
  <SidebarLayout>
    <div class="space-y-6 animate-in">
      <div class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">
              {{ totalAttendanceCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Total Data</p>
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

        <div class="flex items-center gap-3">
          <button
            @click="downloadAttendanceTable"
            :disabled="isExportDisabled"
            class="inline-flex items-center gap-2 bg-[#8C352D] text-white px-4 py-2.5 rounded-xl hover:bg-[#a24a42] transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
          >
            <DownloadIcon :size="18" />
            <span>Tabel</span>
          </button>
          <button
            @click="downloadAttendancePdf"
            :disabled="isExportDisabled"
            class="inline-flex items-center gap-2 bg-white text-[#8C352D] border border-[#8C352D] px-4 py-2.5 rounded-xl hover:bg-[#8C352D]/5 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
          >
            <FileTextIcon :size="18" />
            <span>PDF</span>
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
                <!-- <th class="px-6 py-4 font-bold text-sm text-center">Aksi</th> -->
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
                  <button
                    v-if="hasSubmittedLateNote(record)"
                    @click="openViewLateNoteModal(record)"
                    class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF0EE] border border-[#8C352D] text-[#8C352D] text-xs font-bold hover:bg-[#8C352D]/5 transition-colors cursor-pointer"
                  >
                    <FileTextIcon :size="13" />
                    <span>Sudah mengirim catatan</span>
                  </button>
                  <span v-else>{{ getNoteTableText(record) }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80 font-mono">
                  {{ record.lat }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80 font-mono">
                  {{ record.lng }}
                </td>
                <!-- <td class="px-6 py-4 text-sm text-center">
                  <button
                    v-if="canDeleteAttendance(record)"
                    @click="confirmDeleteAttendance(record)"
                    class="inline-flex items-center justify-center text-[#8C352D] hover:scale-110 transition-transform cursor-pointer"
                    title="Hapus absensi"
                  >
                    <TrashIcon :size="18" />
                  </button>
                  <span v-else class="text-[#8C352D]/30">-</span>
                </td> -->
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

      <div
        v-if="viewLateNoteModal.visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]"
      >
        <div
          class="bg-white w-full max-w-lg rounded-2xl border border-[#E8D5D2] shadow-2xl animate-in overflow-hidden"
        >
          <div class="bg-[#8C352D] px-6 py-4 flex items-center justify-between">
            <div>
              <h3 class="text-white font-bold text-base">Catatan Terlambat</h3>
              <p class="text-white/70 text-xs font-medium">
                {{ viewLateNoteModal.record?.name ?? "-" }} -
                {{ viewLateNoteModal.record?.displayDate ?? "-" }}
              </p>
            </div>
            <button
              @click="closeViewLateNoteModal"
              class="w-9 h-9 flex items-center justify-center rounded-lg text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <XIcon :size="18" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div
              class="max-h-[55vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 px-4 py-3 text-sm leading-6 text-[#8C352D]"
            >
              {{ viewLateNoteModal.record?.note ?? "-" }}
            </div>

            <div class="flex items-center justify-end gap-3">
              <button
                @click="closeViewLateNoteModal"
                class="px-4 py-2 rounded-xl bg-[#8C352D] text-white text-sm font-bold hover:bg-[#742f28] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>

      <AlertLayout v-if="deleteAttendanceModal.visible" variant="error">
        <template #icon>
          <AlertTriangleIcon :size="80" class="text-[#8C352D] stroke-[1.5]" />
        </template>
        <template #title>
          Hapus Absensi
          <br />
          {{ deleteAttendanceModal.record?.name ?? "-" }}?
        </template>
        <template #actions>
          <button
            @click="handleDeleteAttendance"
            :disabled="isDeletingAttendance"
            class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold hover:bg-[#a24a42] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isDeletingAttendance ? "Menghapus..." : "Ya, Hapus!" }}
          </button>
          <button
            @click="closeDeleteAttendanceModal"
            :disabled="isDeletingAttendance"
            class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold hover:bg-[#FFF0EE]/50 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Batalkan
          </button>
        </template>
      </AlertLayout>
    </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { deleteAttendance, getAttendanceHistory } from "@/api/attendance.api";
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebar.vue";
import {
  AlertTriangle as AlertTriangleIcon,
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Download as DownloadIcon,
  FileText as FileTextIcon,
  Settings2 as FilterIcon,
  Search as SearchIcon,
  // Trash2 as TrashIcon,
  X as XIcon,
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

const searchQuery = ref("");
const selectedDate = ref<string | null>(null);
const selectedMonth = ref<number | null>(new Date().getMonth());
const selectedYear = ref<number | null>(new Date().getFullYear());
const sortOrder = ref<"newest" | "oldest">("newest");
const isLoading = ref(false);
const errorMessage = ref("");
const viewLateNoteModal = ref({
  visible: false,
  record: null as AttendanceRecord | null,
});
const deleteAttendanceModal = ref({
  visible: false,
  record: null as AttendanceRecord | null,
});
const isDeletingAttendance = ref(false);

const currentPage = ref(1);
const itemsPerPage = 10;

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

const attendanceRecords = ref<AttendanceRecord[]>([]);

const toggleSort = () => {
  sortOrder.value = sortOrder.value === "newest" ? "oldest" : "newest";
};

const isLateRecord = (record: AttendanceRecord) => {
  return record.raw?.source === "attendance" && record.raw?.status === "late";
};

const hasSubmittedLateNote = (record: AttendanceRecord) => {
  return isLateRecord(record) && record.note.trim() !== "-";
};

const getNoteTableText = (record: AttendanceRecord) => {
  return isLateRecord(record) ? "-" : record.note;
};

// const canDeleteAttendance = (record: AttendanceRecord) => {
//   return (
//     record.raw?.source === "attendance" &&
//     record.raw?.attendance_id !== undefined &&
//     record.raw?.attendance_id !== null
//   );
// };

const openViewLateNoteModal = (record: AttendanceRecord) => {
  viewLateNoteModal.value = {
    visible: true,
    record,
  };
};

const closeViewLateNoteModal = () => {
  viewLateNoteModal.value = {
    visible: false,
    record: null,
  };
};

// const confirmDeleteAttendance = (record: AttendanceRecord) => {
//   deleteAttendanceModal.value = {
//     visible: true,
//     record,
//   };
// };

const closeDeleteAttendanceModal = () => {
  if (isDeletingAttendance.value) return;

  deleteAttendanceModal.value = {
    visible: false,
    record: null,
  };
};

const handleDeleteAttendance = async () => {
  const record = deleteAttendanceModal.value.record;
  const attendanceId = record?.raw?.attendance_id;
  if (!attendanceId) return;

  isDeletingAttendance.value = true;
  try {
    await deleteAttendance(attendanceId);
    deleteAttendanceModal.value = {
      visible: false,
      record: null,
    };
    await fetchAttendanceHistory();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Gagal menghapus absensi.";
  } finally {
    isDeletingAttendance.value = false;
  }
};

const exportColumns = [
  "No",
  "Nama Lengkap",
  "Tanggal",
  "Jam Masuk",
  "Jam Keluar",
  "Status",
  "Catatan",
  "Latitude",
  "Longitude",
];

const getExportRows = () => {
  return filteredRecords.value.map((record, index) => [
    String(index + 1),
    record.name,
    record.displayDate,
    record.checkIn,
    record.checkOut,
    record.info,
    hasSubmittedLateNote(record) ? record.note : getNoteTableText(record),
    record.lat,
    record.lng,
  ]);
};

const escapeHtml = (value: unknown) => {
  return String(value ?? "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getExportTitle = () => {
  if (selectedDate.value) {
    return `Riwayat Absensi ${formatDate(selectedDate.value)}`;
  }

  if (selectedMonth.value !== null && selectedYear.value !== null) {
    return `Riwayat Absensi ${months[selectedMonth.value]} ${selectedYear.value}`;
  }

  if (selectedYear.value !== null) {
    return `Riwayat Absensi ${selectedYear.value}`;
  }

  return "Riwayat Absensi";
};

const getExportFileName = (extension: string) => {
  const slug = getExportTitle()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "riwayat-absensi"}.${extension}`;
};

const buildExportTableHtml = () => {
  const header = exportColumns
    .map((column) => `<th>${escapeHtml(column)}</th>`)
    .join("");
  const rows = getExportRows()
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`,
    )
    .join("");

  return `
    <table>
      <thead><tr>${header}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

const downloadBlob = (content: BlobPart, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadAttendanceTable = () => {
  const content = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
          th { background: #8C352D; color: #ffffff; font-weight: 700; }
          th, td { border: 1px solid #E8D5D2; padding: 8px; text-align: left; vertical-align: top; }
        </style>
      </head>
      <body>
        <h2>${escapeHtml(getExportTitle())}</h2>
        ${buildExportTableHtml()}
      </body>
    </html>
  `;

  downloadBlob(
    content,
    getExportFileName("xls"),
    "application/vnd.ms-excel;charset=utf-8",
  );
};

const downloadAttendancePdf = () => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(getExportTitle())}</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: Arial, sans-serif; color: #2F211F; }
          h1 { color: #8C352D; font-size: 18px; margin: 0 0 12px; }
          table { border-collapse: collapse; width: 100%; font-size: 10px; }
          th { background: #8C352D; color: #ffffff; font-weight: 700; }
          th, td { border: 1px solid #E8D5D2; padding: 6px; text-align: left; vertical-align: top; }
          td:nth-child(7) { white-space: pre-wrap; max-width: 240px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(getExportTitle())}</h1>
        ${buildExportTableHtml()}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
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
    name: history.user?.name ?? history.user?.full_name ?? "-",
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

  return result.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder.value === "newest" ? timeB - timeA : timeA - timeB;
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredRecords.value.length / itemsPerPage),
);

const totalAttendanceCount = computed(() => filteredRecords.value.length);

const lateAttendanceCount = computed(
  () =>
    filteredRecords.value.filter((record) => record.status === "Terlambat")
      .length,
);

const permitAttendanceCount = computed(
  () =>
    filteredRecords.value.filter((record) =>
      ["Izin", "Sakit", "Cuti"].includes(record.status),
    ).length,
);

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRecords.value.slice(start, end);
});

const isExportDisabled = computed(
  () => isLoading.value || filteredRecords.value.length === 0,
);

watch([searchQuery, selectedDate, selectedMonth, selectedYear], () => {
  currentPage.value = 1;
});

watch([selectedDate, selectedMonth, selectedYear], fetchAttendanceHistory);

onMounted(fetchAttendanceHistory);
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
