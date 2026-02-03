<template>
  <SidebarLayout>
    <div class="space-y-6 animate-in">
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
                <th class="px-6 py-4 font-bold text-sm">Tanggal Izin</th>
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
                v-for="(permit, index) in filteredPermits"
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
                    v-if="permit.status === 'Menunggu Persetujuan'"
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
                  <div v-else class="text-center text-xs text-[#8C352D]">
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
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="isViewModalOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div
        class="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-in"
      >
        <div
          class="h-12 bg-[#8C352D] w-full flex items-center justify-end px-4"
        >
          <button
            @click="isViewModalOpen = false"
            class="text-white hover:opacity-70 transition-opacity cursor-pointer"
          >
            <XIcon :size="24" />
          </button>
        </div>

        <div class="p-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label class="text-sm font-bold text-[#8C352D] mb-1 block">
                Nama Pengguna
              </label>
              <div
                class="w-full p-3 rounded-lg border border-[#e6bdb7] bg-[#FFF0EE] text-[#8C352D] text-sm"
              >
                {{ selectedPermit?.name }}
              </div>
            </div>

            <div>
              <label class="text-sm font-bold text-[#8C352D] mb-1 block">
                Alasan Perizinan
              </label>
              <div
                class="w-full p-3 rounded-lg border border-[#e6bdb7] bg-[#FFF0EE] text-[#8C352D] text-sm"
              >
                {{ selectedPermit?.reason }}
              </div>
            </div>

            <div>
              <label class="text-sm font-bold text-[#8C352D] mb-1 block">
                Deskripsi
              </label>
              <div
                class="w-full p-4 rounded-lg border border-[#e6bdb7] bg-[#FFF0EE] text-[#8C352D] text-sm leading-relaxed min-h-[100px]"
              >
                {{
                  selectedPermit?.description || "Tidak ada deskripsi tersedia."
                }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div>
                <label class="text-sm font-bold text-[#8C352D] mb-1 block">
                  Tanggal Perizinan ({{ selectedPermit?.totalDays }} Hari)
                </label>
                <div class="flex items-center gap-3">
                  <div
                    class="flex-1 p-3 rounded-lg border border-[#e6bdb7] bg-[#FFF0EE] text-[#8C352D] text-sm text-center"
                  >
                    {{ selectedPermit?.startDate || "-" }}
                  </div>
                  <span class="text-[#8C352D] font-bold text-sm">Sampai</span>
                  <div
                    class="flex-1 p-3 rounded-lg border border-[#e6bdb7] bg-[#FFF0EE] text-[#8C352D] text-sm text-center"
                  >
                    {{ selectedPermit?.endDate || "-" }}
                  </div>
                </div>
              </div>

              <div>
                <label class="text-sm font-bold text-[#8C352D] mb-1 block">
                  Bukti Perizinan
                </label>
                <div class="flex gap-4">
                  <div
                    class="w-40 h-24 rounded-lg border border-[#e6bdb7] overflow-hidden bg-gray-50 flex items-center justify-center"
                  >
                    <img
                      v-if="selectedPermit?.evidenceImg"
                      :src="selectedPermit.evidenceImg"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="text-[#8C352D]/30 text-xs">No Image</div>
                  </div>
                  <div class="flex flex-col justify-center">
                    <span class="text-[#8C352D] font-bold text-sm">
                      Status :
                    </span>
                    <span class="text-[#8C352D] text-sm">
                      {{ selectedPermit?.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="selectedPermit?.status === 'Menunggu Persetujuan'"
            class="flex justify-end gap-3 pt-4"
          >
            <button
              @click="triggerApprove(selectedPermit)"
              class="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors cursor-pointer"
            >
              <CheckIcon :size="24" />
            </button>
            <button
              @click="triggerReject(selectedPermit)"
              class="p-3 bg-[#8C352D] text-white rounded-xl hover:bg-[#a24a42] transition-colors cursor-pointer"
            >
              <XIcon :size="24" />
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
        Setujui Permohonan
        <br />
        Izin Ini?
      </template>
      <template #actions>
        <button
          @click="confirmAction('Approved')"
          class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold hover:bg-[#a24a42]"
        >
          Ya, Setujui
        </button>
        <button
          @click="isConfirmApproveOpen = false"
          class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold hover:bg-[#FFF0EE]/50"
        >
          Batal
        </button>
      </template>
    </AlertLayout>

    <AlertLayout v-if="isConfirmRejectOpen">
      <template #icon>
        <div
          class="w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center"
        >
          <XIcon :size="40" class="text-[#8C352D] stroke-[4]" />
        </div>
      </template>
      <template #title>
        Tolak Permohonan
        <br />
        Izin Ini?
      </template>
      <template #actions>
        <button
          @click="confirmAction('Rejected')"
          class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold"
        >
          Ya, Tolak
        </button>
        <button
          @click="isConfirmRejectOpen = false"
          class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold hover:bg-[#FFF0EE]/50"
        >
          Batal
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
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42]"
        >
          OK
        </button>
      </template>
    </AlertLayout>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { getPermits, updatePermit } from "@/api/permit.api";
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebar.vue";
import {
  Calendar as CalendarIcon,
  CheckCircle2 as CheckCircleIcon,
  Check as CheckIcon,
  Eye as EyeIcon,
  Settings2 as FilterIcon,
  Search as SearchIcon,
  XCircle as XCircleIcon,
  X as XIcon,
} from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";

type PermitImage = { url: string };

type PermitApi = {
  id: number;
  description?: string | null;
  status: number;
  status_name?: string;
  reason: number;
  type_name?: string;
  date_start?: string | Date;
  date_end?: string | Date;
  permit_images?: PermitImage[];
  created_by_user?: { id: number; name: string };
};

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
  evidenceImg?: string | null;
};

const isViewModalOpen = ref(false);
const isConfirmApproveOpen = ref(false);
const isConfirmRejectOpen = ref(false);
const isSuccessAlertOpen = ref(false);

const searchQuery = ref("");
const selectedPermit = ref<PermitRow | null>(null);
const successAlertTitle = ref("");
const statusType = ref<"check" | "x">("check");

const permits = ref<PermitRow[]>([]);

const statusLabelMap: Record<number, string> = {
  0: "Menunggu Persetujuan",
  1: "Sudah Persetujuan",
  2: "Ditolak",
  3: "Duplikat",
};

const typeLabelMap: Record<number, string> = {
  0: "Sakit",
  1: "Izin",
  2: "Cuti",
};

const typeNameMap: Record<string, string> = {
  Sick: "Sakit",
  Permit: "Izin",
  Leave: "Cuti",
};

const formatDate = (value?: string | Date) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID");
};

// Frontend helper to calculate days until backend provides it
const calculateTotalDays = (start?: string | Date, end?: string | Date) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = Math.abs(e.getTime() - s.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

const getTypeLabel = (permit: PermitApi) => {
  if (permit.type_name && typeNameMap[permit.type_name]) {
    return typeNameMap[permit.type_name];
  }
  return typeLabelMap[permit.reason] ?? "Lainnya";
};

const mapPermit = (permit: PermitApi): PermitRow => {
  const startDate = formatDate(permit.date_start);
  const endDate = formatDate(permit.date_end);
  return {
    id: permit.id,
    name: permit.created_by_user?.name ?? "-",
    reason: getTypeLabel(permit),
    date: `${startDate} - ${endDate}`,
    startDate,
    endDate,
    totalDays: calculateTotalDays(permit.date_start, permit.date_end),
    description: permit.description ?? null,
    status: statusLabelMap[permit.status] ?? permit.status_name ?? "Unknown",
    status_code: permit.status,
    evidenceImg: permit.permit_images?.[0]?.url ?? null,
  };
};

const filteredPermits = computed(() => {
  if (!searchQuery.value.trim()) return permits.value;
  const query = searchQuery.value.toLowerCase();
  return permits.value.filter((permit) =>
    permit.name.toLowerCase().includes(query),
  );
});

const openViewDetail = (permit: any) => {
  selectedPermit.value = permit;
  isViewModalOpen.value = true;
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
    const response = await getPermits();
    const data = response?.data?.data?.permits ?? [];
    permits.value = data.map(mapPermit);
  } catch (error) {
    console.error(error);
    permits.value = [];
  }
};

const confirmAction = async (type: "Approved" | "Rejected") => {
  const selected = selectedPermit.value;
  if (!selected) return;
  const nextStatus = type === "Approved" ? 1 : 2;
  try {
    await updatePermit(selected.id, { status: nextStatus });
    const index = permits.value.findIndex((p) => p.id === selected.id);
    if (index !== -1) {
      permits.value[index].status =
        statusLabelMap[nextStatus] ?? selected.status;
      permits.value[index].status_code = nextStatus;
    }
    statusType.value = type === "Approved" ? "check" : "x";
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

onMounted(() => {
  fetchPermits();
});
</script>

<style scoped>
.animate-in {
  animation: modalIn 0.2s ease-out;
}
@keyframes modalIn {
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
