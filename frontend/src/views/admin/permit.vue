<template>
  <SidebarLayout>
    <div class="space-y-6 animate-in">
      <div
        v-if="viewState === 'list'"
        class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm animate-in"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">
              {{ pendingCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Menunggu Perizinan</p>
          </div>

          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">
              {{ approvedCount }}
            </p>
            <p class="text-[#8C352D] font-medium">Diterima</p>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
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

        <div class="relative w-full md:w-80">
          <span
            class="absolute inset-y-0 left-4 flex items-center text-[#8C352D]/40"
          >
            <SearchIcon :size="18" />
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari data pengajuan"
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
                <th class="px-6 py-4 font-bold text-sm text-center">
                  Jumlah Hari
                </th>
                <th class="px-6 py-4 font-bold text-sm">Status</th>
                <th class="px-6 py-4 font-bold text-sm text-center">
                  Persetujuan
                </th>
                <th class="px-6 py-4 font-bold text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8D5D2]">
              <tr
                v-for="(permit, index) in paginatedPermits"
                :key="permit.id"
                class="hover:bg-[#FFF0EE]/30 transition-colors"
              >
                <td
                  class="px-6 py-4 text-sm font-semibold text-[#8C352D] text-center"
                >
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-[#8C352D]">
                  {{ permit.name }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                  {{ permit.reason }}
                </td>
                <td
                  class="px-6 py-4 text-sm text-[#8C352D] font-bold text-center"
                >
                  {{ permit.totalDays }} Hari
                </td>
                <td class="px-6 py-4 text-sm font-bold text-[#8C352D]">
                  {{ permit.status }}
                </td>
                <td class="px-6 py-4">
                  <div
                    class="flex items-center justify-center gap-2"
                    v-if="permit.status_code === 0"
                  >
                    <button
                      @click="triggerApprove(permit)"
                      class="text-green-600 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <CheckCircleIcon :size="20" />
                    </button>
                    <button
                      @click="triggerReject(permit)"
                      class="text-red-600 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <XCircleIcon :size="20" />
                    </button>
                  </div>
                  <div
                    v-else
                    class="text-center text-xs text-[#8C352D] italic opacity-60"
                  >
                    Selesai
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <button
                    @click="openViewDetail(permit)"
                    class="text-[#8C352D] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <EyeIcon :size="18" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredPermits.length === 0">
                <td
                  colspan="7"
                  class="px-6 py-10 text-center text-[#8C352D]/50 italic"
                >
                  Tidak ada data yang sesuai filter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="filteredPermits.length > 0"
          class="flex items-center justify-between px-6 py-4 bg-[#FFF0EE]/30 border-t border-[#E8D5D2]"
        >
          <span class="text-sm text-[#8C352D] font-medium">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, filteredPermits.length) }}
            dari {{ filteredPermits.length }} data
          </span>
          <div class="flex items-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg border border-[#8C352D] text-[#8C352D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#8C352D] hover:text-white transition-colors cursor-pointer"
            >
              <XIcon class="rotate-90 scale-75" :size="16" />
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
              <XIcon class="-rotate-90 scale-75" :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isViewModalOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div
        class="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in"
      >
        <div
          class="h-14 bg-[#8C352D] w-full flex items-center justify-between px-8"
        >
          <span class="text-white font-bold text-sm">Detail Perizinan</span>
          <button
            @click="isViewModalOpen = false"
            class="text-white hover:opacity-70 cursor-pointer"
          >
            <XIcon :size="20" />
          </button>
        </div>
        <div class="p-10 space-y-6 max-h-[85vh] overflow-y-auto">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label
                class="text-[11px] font-bold text-[#8C352D] uppercase tracking-wider ml-1"
              >
                Nama Lengkap
              </label>
              <div
                class="p-4 rounded-2xl border border-[#e6bdb7] bg-[#FFF0EE]/50 text-[#8C352D] text-sm font-medium"
              >
                {{ selectedPermit?.name }}
              </div>
            </div>
            <div class="space-y-2">
              <label
                class="text-[11px] font-bold text-[#8C352D] uppercase tracking-wider ml-1"
              >
                Alasan ({{ selectedPermit?.totalDays }} Hari)
              </label>
              <div
                class="p-4 rounded-2xl border border-[#e6bdb7] bg-[#FFF0EE]/50 text-[#8C352D] text-sm font-medium"
              >
                {{ selectedPermit?.reason }}
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <label
              class="text-[11px] font-bold text-[#8C352D] uppercase tracking-wider ml-1"
            >
              Tanggal Perizinan
            </label>
            <div class="flex items-center gap-4">
              <div
                class="flex-1 p-4 rounded-2xl border border-[#e6bdb7] bg-[#FFF0EE]/50 text-[#8C352D] text-sm font-medium text-center"
              >
                {{ selectedPermit?.startDate }}
              </div>
              <span class="text-[#8C352D] font-bold text-[10px] uppercase">
                Sampai
              </span>
              <div
                class="flex-1 p-4 rounded-2xl border border-[#e6bdb7] bg-[#FFF0EE]/50 text-[#8C352D] text-sm font-medium text-center"
              >
                {{ selectedPermit?.endDate }}
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <label
              class="text-[11px] font-bold text-[#8C352D] uppercase tracking-wider ml-1"
            >
              Deskripsi
            </label>
            <div
              class="p-4 rounded-2xl border border-[#e6bdb7] bg-[#FFF0EE]/50 text-[#8C352D] text-sm leading-relaxed min-h-[100px]"
            >
              {{ selectedPermit?.description || "-" }}
            </div>
          </div>
          <div class="space-y-3">
            <label
              class="text-[11px] font-bold text-[#8C352D] uppercase tracking-wider ml-1"
            >
              Bukti Foto ({{ selectedPermit?.evidenceImgs?.length || 0 }})
            </label>
            <div
              v-if="(selectedPermit?.evidenceImgs?.length ?? 0) > 0"
              class="grid grid-cols-2 gap-4"
            >
              <div
                v-for="(img, idx) in selectedPermit?.evidenceImgs || []"
                :key="idx"
                @click="openFullScreen(img.url)"
                class="group relative aspect-[16/9] rounded-3xl border border-[#e6bdb7] overflow-hidden bg-gray-50 cursor-pointer"
              >
                <img :src="img.url" class="w-full h-full object-cover" />
                <div
                  class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <span
                    class="bg-[#8C352D] text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg"
                  >
                    Lihat Full Screen
                  </span>
                </div>
              </div>
            </div>
            <div
              v-else
              class="w-full py-10 rounded-3xl border border-dashed border-[#e6bdb7] bg-[#FFF0EE]/30 flex flex-col items-center justify-center text-[#8C352D]/30"
            >
              <ImageIcon :size="32" />
              <span class="text-xs italic mt-2">Tidak ada bukti foto</span>
            </div>
          </div>
          <div
            v-if="selectedPermit?.status_code === 0"
            class="flex justify-end gap-3 pt-6"
          >
            <button
              @click="triggerReject(selectedPermit)"
              class="px-8 py-3.5 bg-white text-[#8C352D] border border-[#8C352D] rounded-2xl font-bold hover:bg-[#FFF0EE] transition-all cursor-pointer"
            >
              Tolak
            </button>
            <button
              @click="triggerApprove(selectedPermit)"
              class="px-8 py-3.5 bg-[#8C352D] text-white rounded-2xl font-bold hover:bg-[#a24a42] transition-all shadow-md cursor-pointer"
            >
              Setujui Izin
            </button>
          </div>
          <div v-else class="flex justify-end pt-6">
            <button
              @click="isViewModalOpen = false"
              class="bg-[#8C352D] text-white px-12 py-3.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <AlertLayout v-if="isConfirmApproveOpen">
      <template #icon>
        <div
          class="w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center"
        >
          <CheckIcon :size="40" class="text-[#8C352D] stroke-[4]" />
        </div>
      </template>
      <template #title>
        Setujui Permohonan Izin
        <br />
        {{ selectedPermit?.name }}?
      </template>
      <template #actions>
        <button
          @click="confirmAction('Approved')"
          class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold"
        >
          Ya, Setujui!
        </button>
        <button
          @click="isConfirmApproveOpen = false"
          class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold"
        >
          Batalkan
        </button>
      </template>
    </AlertLayout>

    <AlertLayout v-if="isConfirmRejectOpen">
      <template #icon>
        <AlertTriangleIcon :size="80" class="text-[#8C352D] stroke-[1.5]" />
      </template>
      <template #title>
        Tolak Permohonan Izin
        <br />
        {{ selectedPermit?.name }}?
      </template>
      <template #actions>
        <button
          @click="confirmAction('Rejected')"
          class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold"
        >
          Ya, Tolak!
        </button>
        <button
          @click="isConfirmRejectOpen = false"
          class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold"
        >
          Batalkan
        </button>
      </template>
    </AlertLayout>

    <AlertLayout v-if="isSuccessAlertOpen">
      <template #icon>
        <div
          class="w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center"
        >
          <CheckIcon :size="40" class="text-[#8C352D] stroke-[4]" />
        </div>
      </template>
      <template #title>{{ successAlertTitle }}</template>
      <template #actions>
        <button
          @click="isSuccessAlertOpen = false"
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold"
        >
          OK
        </button>
      </template>
    </AlertLayout>

    <Transition name="fade">
      <div
        v-if="fullScreenImg"
        class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        @click="fullScreenImg = null"
      >
        <button class="absolute top-6 right-6 text-white/70 hover:text-white">
          <XIcon :size="40" />
        </button>
        <img
          :src="fullScreenImg"
          class="max-w-full max-h-full object-contain animate-zoom"
          @click.stop
        />
      </div>
    </Transition>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { getPermits, updatePermit } from "@/api/permit.api";
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebar.vue";
import {
  AlertTriangle as AlertTriangleIcon,
  Calendar as CalendarIcon,
  CheckCircle2 as CheckCircleIcon,
  Check as CheckIcon,
  Eye as EyeIcon,
  Settings2 as FilterIcon,
  Image as ImageIcon,
  Search as SearchIcon,
  XCircle as XCircleIcon,
  X as XIcon,
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";

type PermitImage = { url: string };
type PermitRow = {
  id: number;
  name: string;
  reason: string;
  date: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  description?: string | null;
  status: string;
  status_code: number;
  evidenceImgs: PermitImage[];
  createdAt: Date;
  raw: any;
};

const viewState = ref<"list" | "form">("list");
const isViewModalOpen = ref(false);
const isConfirmApproveOpen = ref(false);
const isConfirmRejectOpen = ref(false);
const isSuccessAlertOpen = ref(false);
const fullScreenImg = ref<string | null>(null);
const searchQuery = ref("");
const selectedPermit = ref<PermitRow | null>(null);
const permits = ref<PermitRow[]>([]);
const successAlertTitle = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedMonth = ref<number | null>(null);
const selectedYear = ref<number | null>(new Date().getFullYear());
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

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const yearList = [];
  for (let i = -2; i <= 2; i++) {
    yearList.push(currentYear + i);
  }
  return yearList;
});

const statusLabelMap: Record<number, string> = {
  0: "Menunggu Persetujuan",
  1: "Diterima",
  2: "Ditolak",
};
const typeNameMap: Record<string, string> = {
  Sick: "Sakit",
  Permit: "Izin",
  Leave: "Cuti",
};

const formatDate = (value?: string | Date) => {
  if (!value) return "-";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID");
};

const calculateTotalDays = (start?: string | Date, end?: string | Date) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  return (
    Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
};

const mapPermit = (permit: any) => ({
  id: permit.id,
  name: permit.created_by_user?.name ?? "-",
  reason: typeNameMap[permit.type_name] ?? "Lainnya",
  date: `${formatDate(permit.date_start)} - ${formatDate(permit.date_end)}`,
  startDate: formatDate(permit.date_start),
  endDate: formatDate(permit.date_end),
  totalDays: calculateTotalDays(permit.date_start, permit.date_end),
  description: permit.description ?? null,
  status: statusLabelMap[permit.status] ?? "Unknown",
  status_code: permit.status,
  evidenceImgs: permit.permit_images ?? [],
  createdAt: new Date(permit.created_at || permit.date_start),
  raw: permit,
});

const toggleSort = () => {
  sortOrder.value = sortOrder.value === "newest" ? "oldest" : "newest";
};
const openViewDetail = (permit: any) => {
  selectedPermit.value = permit;
  isViewModalOpen.value = true;
};
const openFullScreen = (url: string) => {
  fullScreenImg.value = url;
};
const triggerApprove = (permit: any) => {
  selectedPermit.value = permit;
  isConfirmApproveOpen.value = true;
};
const triggerReject = (permit: any) => {
  selectedPermit.value = permit;
  isConfirmRejectOpen.value = true;
};

const fetchPermits = async () => {
  try {
    const response = await getPermits({ limit: 1000 });
    const data = response?.data?.data?.permits ?? [];
    permits.value = data.map(mapPermit);
  } catch (error) {
    console.error(error);
  }
};

const confirmAction = async (type: "Approved" | "Rejected") => {
  if (!selectedPermit.value) return;
  const nextStatus = type === "Approved" ? 1 : 2;
  try {
    await updatePermit(selectedPermit.value.id, { status: nextStatus });
    await fetchPermits();
    successAlertTitle.value =
      type === "Approved"
        ? "Izin Berhasil Disetujui!"
        : "Izin Berhasil Ditolak!";
    isSuccessAlertOpen.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    isConfirmApproveOpen.value = false;
    isConfirmRejectOpen.value = false;
    isViewModalOpen.value = false;
  }
};

const filteredPermits = computed(() => {
  let list = [...permits.value];

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(query));
  }

  list = list.filter((p) => {
    const date = new Date(p.createdAt);
    const matchMonth =
      selectedMonth.value === null || date.getMonth() === selectedMonth.value;
    const matchYear =
      selectedYear.value === null || date.getFullYear() === selectedYear.value;
    return matchMonth && matchYear;
  });

  list.sort((a, b) => {
    const timeA = a.createdAt.getTime();
    const timeB = b.createdAt.getTime();
    return sortOrder.value === "newest" ? timeB - timeA : timeA - timeB;
  });

  return list;
});

const totalPages = computed(() =>
  Math.ceil(filteredPermits.value.length / itemsPerPage),
);

const paginatedPermits = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPermits.value.slice(start, end);
});

const pendingCount = computed(
  () => filteredPermits.value.filter((p) => p.raw.status === 0).length,
);
const approvedCount = computed(
  () => filteredPermits.value.filter((p) => p.raw.status === 1).length,
);

watch([searchQuery, selectedMonth, selectedYear, sortOrder], () => {
  currentPage.value = 1;
});

onMounted(fetchPermits);
</script>

<style scoped>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-zoom {
  animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
