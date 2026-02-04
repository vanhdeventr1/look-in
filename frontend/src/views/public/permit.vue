<template>
  <SidebarLayout>
    <div class="flex flex-col gap-y-6">
      <div
        v-if="viewState === 'list'"
        class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm animate-in"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">{{ pendingCount }}</p>
            <p class="text-[#8C352D] font-medium">Menunggu Perizinan</p>
          </div>
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">{{ approvedCount }}</p>
            <p class="text-[#8C352D] font-medium">Diterima</p>
          </div>
        </div>
      </div>

      <div v-if="viewState === 'form'" class="space-y-6 animate-in">
        <button
          @click="cancelForm"
          class="flex items-center gap-2 text-[#8C352D] font-bold hover:opacity-70 transition-opacity cursor-pointer"
        >
          <ArrowLeftIcon :size="20" />
          Kembali
        </button>

        <div
          class="bg-white border border-[#E8D5D2] rounded-[2.5rem] overflow-hidden shadow-sm"
        >
          <div class="h-14 bg-[#8C352D] w-full flex items-center px-8">
            <span class="text-white font-bold">
              {{ formMode === "add" ? "Tambah Perizinan" : "Edit Perizinan" }}
            </span>
          </div>
          <div class="p-8 md:p-12 space-y-8">
            <div class="space-y-2">
              <label class="text-[#8C352D] font-bold ml-1">
                Pilih Alasan Izin
              </label>
              <div class="relative">
                <select
                  v-model="newPermit.reason"
                  class="w-full p-4 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>Pilih Alasan Izin</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Izin">Izin</option>
                  <option value="Cuti">Cuti</option>
                </select>
                <ChevronDownIcon
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C352D] pointer-events-none"
                  :size="20"
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[#8C352D] font-bold ml-1">
                Tambahkan Deskripsi
              </label>
              <textarea
                v-model="newPermit.description"
                rows="4"
                class="w-full p-4 rounded-3xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none placeholder:text-[#8C352D]/30"
                placeholder="Tulis deskripsi di sini..."
              ></textarea>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between ml-1">
                <label class="text-[#8C352D] font-bold">
                  Tanggal Perizinan
                </label>
                <span
                  v-if="computedTotalDays > 0"
                  class="text-sm font-bold text-[#8C352D] bg-[#FFF0EE] px-3 py-1 rounded-full border border-[#E8D5D2]"
                >
                  Durasi: {{ computedTotalDays }} Hari
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-4">
                <div
                  class="relative flex items-center gap-3 p-3 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/50 min-w-[200px]"
                >
                  <CalendarIcon class="text-[#8C352D]" :size="20" />
                  <span class="text-[#8C352D] flex-1">
                    {{
                      newPermit.startDate
                        ? formatDateForDisplay(newPermit.startDate)
                        : "dd/mm/yyyy"
                    }}
                  </span>
                  <input
                    v-model="newPermit.startDate"
                    type="date"
                    :min="todayDate"
                    class="absolute inset-0 opacity-0 cursor-pointer w-full"
                  />
                </div>
                <span class="text-[#8C352D] font-bold">Sampai</span>
                <div
                  class="relative flex items-center gap-3 p-3 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/50 min-w-[200px]"
                >
                  <CalendarIcon class="text-[#8C352D]" :size="20" />
                  <span class="text-[#8C352D] flex-1">
                    {{
                      newPermit.endDate
                        ? formatDateForDisplay(newPermit.endDate)
                        : "dd/mm/yyyy"
                    }}
                  </span>
                  <input
                    v-model="newPermit.endDate"
                    type="date"
                    :min="newPermit.startDate || todayDate"
                    class="absolute inset-0 opacity-0 cursor-pointer w-full"
                  />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[#8C352D] font-bold ml-1">
                  Tambah Bukti Foto Perizinan
                </label>
                <div
                  @click="fileInput?.click()"
                  class="border-2 border-dashed border-[#E8D5D2] bg-[#FFF0EE]/50 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#FFF0EE] transition-colors"
                >
                  <UploadIcon class="text-[#8C352D]" :size="48" />
                  <span class="text-[#8C352D]/50 text-sm font-medium">
                    Klik untuk upload file
                  </span>
                  <input
                    type="file"
                    ref="fileInput"
                    class="hidden"
                    accept="image/*"
                    multiple
                    @change="handleFileUpload"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[#8C352D] font-bold ml-1">
                  Uploaded File ({{ uploadedFiles.length }})
                </label>
                <div
                  v-if="uploadedFiles.length > 0"
                  class="max-h-[200px] overflow-y-auto space-y-2 pr-2"
                >
                  <div
                    v-for="(file, index) in uploadedFiles"
                    :key="index"
                    class="flex items-center justify-between p-4 rounded-2xl border border-[#E8D5D2] bg-white animate-in"
                  >
                    <div
                      class="flex items-center gap-3 text-[#8C352D] overflow-hidden"
                    >
                      <ImageIcon :size="20" class="shrink-0" />
                      <span class="text-sm font-medium truncate">
                        {{ file.name }}
                      </span>
                    </div>
                    <button
                      @click="removeFile(index)"
                      class="text-[#8C352D] hover:text-red-600 transition-colors"
                    >
                      <TrashIcon :size="18" />
                    </button>
                  </div>
                </div>
                <div
                  v-else
                  class="p-4 rounded-2xl border border-dashed border-[#E8D5D2] text-center text-[#8C352D]/30 text-sm italic"
                >
                  Belum ada file diunggah
                </div>
              </div>
            </div>
            <div class="flex justify-end pt-4">
              <button
                @click="submitForm"
                class="bg-[#8C352D] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#a24a42] transition-all cursor-pointer"
              >
                {{
                  formMode === "add" ? "Tambah Perizinan" : "Simpan Perubahan"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-y-6 animate-in">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <button
            @click="openAddForm"
            class="flex items-center justify-center gap-2 bg-[#8C352D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#a24a42] transition-colors w-fit cursor-pointer"
          >
            <PlusIcon :size="20" />
            Tambah Data
          </button>

          <div class="flex items-center gap-3">
            <div class="relative group">
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

            <div
              @click="toggleSort"
              class="flex items-center gap-2 px-4 py-2 text-[#8C352D] font-bold text-sm cursor-pointer hover:opacity-70"
            >
              <FilterIcon
                :size="18"
                :class="{ 'rotate-180': !isNewest }"
                class="transition-transform"
              />

              <span>{{ isNewest ? "Terbaru" : "Terlama" }}</span>
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
                  <th class="px-6 py-4 font-bold text-sm">Alasan</th>
                  <th class="px-6 py-4 font-bold text-sm">Tanggal Izin</th>
                  <th class="px-6 py-4 font-bold text-sm text-center">
                    Jumlah Hari
                  </th>
                  <th class="px-6 py-4 font-bold text-sm">Status</th>
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
                  <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                    {{ permit.date }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-[#8C352D] font-bold text-center"
                  >
                    {{ permit.totalDays }} Hari
                  </td>
                  <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                    {{ permit.status }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-3">
                      <button
                        @click="openViewDetail(permit)"
                        class="text-[#8C352D] hover:scale-110 cursor-pointer"
                      >
                        <EyeIcon :size="18" />
                      </button>

                      <button
                        v-if="permit.status === 'Menunggu Persetujuan'"
                        @click="openEditForm(permit)"
                        class="text-[#8C352D] hover:scale-110 cursor-pointer"
                      >
                        <EditIcon :size="18" />
                      </button>

                      <button
                        v-if="permit.status === 'Menunggu Persetujuan'"
                        @click="confirmDelete(permit.id)"
                        class="text-[#8C352D] hover:scale-110 cursor-pointer"
                      >
                        <TrashIcon :size="18" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredPermits.length === 0">
                  <td
                    colspan="7"
                    class="px-6 py-10 text-center text-[#8C352D]/50 italic text-sm"
                  >
                    Tidak ada data ditemukan untuk bulan ini.
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
                <ChevronDownIcon class="rotate-90" :size="16" />
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
                <ChevronDownIcon class="-rotate-90" :size="16" />
              </button>
            </div>
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
            class="text-white hover:opacity-70 cursor-pointer transition-opacity"
          >
            <XIcon :size="20" />
          </button>
        </div>

        <div
          class="p-10 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar"
        >
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
                <img
                  :src="img.url"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
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

          <div class="flex justify-end pt-6">
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
    <div
      v-if="fullScreenImg"
      class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in"
      @click="fullScreenImg = null"
    >
      <button
        class="absolute top-6 right-6 text-white bg-[#8C352D] p-2 rounded-full hover:scale-110 transition-transform"
      >
        <XIcon :size="32" />
      </button>
      <img
        :src="fullScreenImg"
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        @click.stop
      />
    </div>
    <AlertLayout v-if="isDeleteAlertOpen">
      <template #icon>
        <AlertTriangleIcon :size="80" class="text-[#8C352D] stroke-[1.5]" />
      </template>
      <template #title>
        Anda Ingin Menghapus
        <br />
        Izin Ini?
      </template>
      <template #actions>
        <button
          @click="handleDeletePermit"
          class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold hover:bg-[#a24a42] cursor-pointer"
        >
          Ya, Hapus!
        </button>
        <button
          @click="isDeleteAlertOpen = false"
          class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold hover:bg-[#FFF0EE]/50 cursor-pointer"
        >
          Batalkan
        </button>
      </template>
    </AlertLayout>
    <AlertLayout v-if="isValidationAlertOpen">
      <template #icon>
        <InfoIcon :size="80" class="text-[#8C352D] stroke-[1.5]" />
      </template>
      <template #title>
        Mohon Lengkapi
        <br />
        Data Perizinan!
      </template>
      <template #actions>
        <button
          @click="isValidationAlertOpen = false"
          class="w-full bg-[#8C352D] text-white py-3 rounded-2xl font-bold"
        >
          Oke, Mengerti
        </button>
      </template>
    </AlertLayout>
    <AlertLayout v-if="isSuccessAlertOpen">
      <template #icon>
        <div
          class="w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center"
        >
          <span class="text-[#8C352D] text-4xl font-bold">✓</span>
        </div>
      </template>
      <template #title>{{ successAlertTitle }}</template>
      <template #actions>
        <button
          @click="closeSuccessAlert"
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] cursor-pointer"
        >
          OK
        </button>
      </template>
    </AlertLayout>
  </SidebarLayout>
</template>

<script setup lang="ts">
import {
  createPermit,
  deletePermit,
  getPermits,
  updatePermit,
} from "@/api/permit.api";
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebarpublic.vue";
import {
  AlertTriangle as AlertTriangleIcon,
  ArrowLeft as ArrowLeftIcon,
  Calendar as CalendarIcon,
  ChevronDown as ChevronDownIcon,
  Pencil as EditIcon,
  Eye as EyeIcon,
  Settings2 as FilterIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  Upload as UploadIcon,
  X as XIcon,
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const viewState = ref<"list" | "form">("list");
const formMode = ref<"add" | "edit">("add");
const isDeleteAlertOpen = ref(false);
const isValidationAlertOpen = ref(false);
const isSuccessAlertOpen = ref(false);
const isViewModalOpen = ref(false);
const fullScreenImg = ref<string | null>(null);
const successAlertTitle = ref("");
const selectedId = ref<number | null>(null);
const selectedPermit = ref<any>(null);

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 10;

const isNewest = ref(true);
const selectedMonth = ref<number | null>(null);
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

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFiles = ref<{ name: string; url: string; file?: File }[]>([]);
const todayDate = new Date().toISOString().slice(0, 10);
const permits = ref<any[]>([]);
const route = useRoute();
const newPermit = ref({
  reason: "",
  description: "",
  startDate: "",
  endDate: "",
});

// Computed
const computedTotalDays = computed(() => {
  if (!newPermit.value.startDate || !newPermit.value.endDate) return 0;
  const start = new Date(newPermit.value.startDate);
  const end = new Date(newPermit.value.endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
});

const filteredPermits = computed(() => {
  let list = [...permits.value];

  if (selectedMonth.value !== null) {
    list = list.filter((p) => {
      const permitDate = new Date(p.createdAt);
      return permitDate.getMonth() === selectedMonth.value;
    });
  }

  list.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return isNewest.value ? dateB - dateA : dateA - dateB;
  });

  return list;
});

// Added Pagination Logic
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

const formatDateForDisplay = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const parseDateForInput = (dateStr: string) => {
  const parts = dateStr.split("/");
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";
};

const statusLabelMap: Record<number, string> = {
  0: "Menunggu Persetujuan",
  1: "Sudah Persetujuan",
  2: "Ditolak",
};
const typeNameMap: Record<string, string> = {
  Sick: "Sakit",
  Permit: "Izin",
  Leave: "Cuti",
};
const typeValueMap: Record<string, number> = { Sakit: 0, Izin: 1, Cuti: 2 };

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

const parsePermitId = (value: unknown) => {
  if (Array.isArray(value)) {
    return parsePermitId(value[0]);
  }
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : null;
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

const toggleSort = () => {
  isNewest.value = !isNewest.value;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    Array.from(target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        uploadedFiles.value.push({
          name: file.name,
          url: reader.result as string,
          file,
        });
      };
      reader.readAsDataURL(file);
    });
    target.value = "";
  }
};

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1);
};
const openFullScreen = (url: string) => {
  fullScreenImg.value = url;
};
const openViewDetail = (permit: any) => {
  selectedPermit.value = permit;
  isViewModalOpen.value = true;
};

const openAddForm = (): void => {
  formMode.value = "add";
  newPermit.value = {
    reason: "",
    description: "",
    startDate: todayDate,
    endDate: todayDate,
  };
  uploadedFiles.value = [];
  viewState.value = "form";
};

const openEditForm = (permit: any) => {
  formMode.value = "edit";
  selectedId.value = permit.id;
  const dates = permit.date.split(" - ");
  newPermit.value = {
    reason: permit.reason,
    description: permit.description || "",
    startDate: parseDateForInput(dates[0]),
    endDate: parseDateForInput(dates[1] || dates[0]),
  };
  uploadedFiles.value = permit.evidenceImgs
    ? permit.evidenceImgs.map((img: any) => ({
        name: img.file_path?.split("/").pop() ?? "Bukti Foto",
        url: img.url,
      }))
    : [];
  viewState.value = "form";
};

const cancelForm = () => {
  viewState.value = "list";
};

const submitForm = async () => {
  if (!newPermit.value.reason || !newPermit.value.startDate) {
    isValidationAlertOpen.value = true;
    return;
  }
  try {
    const typeValue = typeValueMap[newPermit.value.reason] ?? 0;
    const dateStart = newPermit.value.startDate;
    const dateEnd = newPermit.value.endDate || newPermit.value.startDate;

    if (formMode.value === "add") {
      const files = uploadedFiles.value
        .map((item) => item.file)
        .filter((file): file is File => Boolean(file));
      await createPermit({
        description: newPermit.value.description,
        type: typeValue,
        date_start: dateStart,
        date_end: dateEnd,
        files,
      });
      successAlertTitle.value = "Data Perizinan\nBerhasil Ditambahkan!";
    } else if (selectedId.value !== null) {
      await updatePermit(selectedId.value, {
        description: newPermit.value.description,
        type: typeValue,
        date_start: dateStart,
        date_end: dateEnd,
      });
      successAlertTitle.value = "Data Perizinan\nBerhasil Diperbarui!";
    }
    await fetchPermits();
    isSuccessAlertOpen.value = true;
  } catch (error) {
    console.error(error);
  }
};

const closeSuccessAlert = () => {
  isSuccessAlertOpen.value = false;
  viewState.value = "list";
};
const confirmDelete = (id: number) => {
  selectedId.value = id;
  isDeleteAlertOpen.value = true;
};

const handleDeletePermit = () => {
  if (selectedId.value !== null) {
    deletePermit(selectedId.value)
      .then(fetchPermits)
      .then(() => {
        isDeleteAlertOpen.value = false;
        successAlertTitle.value = "Data Berhasil\nDihapus!";
        isSuccessAlertOpen.value = true;
      })
      .catch((error) => console.error(error));
  }
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

onMounted(fetchPermits);

watch([selectedMonth, isNewest], () => {
  currentPage.value = 1;
});

watch(
  () => route.query.permitId,
  (value) => {
    const queryPermitId = parsePermitId(value);
    if (!queryPermitId) return;
    const match = permits.value.find((permit) => permit.id === queryPermitId);
    if (match) {
      openViewDetail(match);
    }
  },
);
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
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
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #fff0ee;
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #8c352d;
  border-radius: 10px;
}
</style>
