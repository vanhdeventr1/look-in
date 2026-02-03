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
            <p class="text-3xl font-bold text-[#8C352D]">24</p>
            <p class="text-[#8C352D] font-medium">Absen Hari Ini</p>
          </div>
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">12</p>
            <p class="text-[#8C352D] font-medium">Terlambat</p>
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
                  @click="$refs.fileInput.click()"
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
            <div
              class="flex items-center gap-2 px-4 py-2 border border-[#8C352D] rounded-xl text-[#8C352D] bg-white font-bold text-sm cursor-pointer"
            >
              <CalendarIcon :size="18" />
              <span>Oktober</span>
            </div>
            <div
              class="flex items-center gap-2 px-4 py-2 text-[#8C352D] font-bold text-sm cursor-pointer"
            >
              <FilterIcon :size="18" />
              <span>Terbaru</span>
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
                        @click="openEditForm(permit)"
                        class="text-[#8C352D] hover:scale-110 cursor-pointer"
                      >
                        <EditIcon :size="18" />
                      </button>
                      <button
                        @click="confirmDelete(permit.id)"
                        class="text-[#8C352D] hover:scale-110 cursor-pointer"
                      >
                        <TrashIcon :size="18" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isViewModalOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div
        class="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in"
      >
        <div
          class="h-12 bg-[#8C352D] w-full flex items-center justify-between px-6"
        >
          <span class="text-white font-bold text-sm">Detail Perizinan</span>
          <button
            @click="isViewModalOpen = false"
            class="text-white hover:opacity-70 cursor-pointer"
          >
            <XIcon :size="20" />
          </button>
        </div>
        <div class="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                class="text-xs font-bold text-[#8C352D] mb-1 block uppercase"
              >
                Nama Lengkap
              </label>
              <div
                class="p-3 rounded-xl border border-[#e6bdb7] bg-[#FFF0EE] text-[#8C352D] text-sm font-medium"
              >
                {{ selectedPermit?.name }}
              </div>
            </div>
            <div>
              <label
                class="text-xs font-bold text-[#8C352D] mb-1 block uppercase"
              >
                Alasan ({{ selectedPermit?.totalDays }} Hari)
              </label>
              <div
                class="p-3 rounded-xl border border-[#e6bdb7] bg-[#FFF0EE] text-[#8C352D] text-sm font-medium"
              >
                {{ selectedPermit?.reason }}
              </div>
            </div>
          </div>
          <div>
            <label
              class="text-xs font-bold text-[#8C352D] mb-1 block uppercase"
            >
              Deskripsi
            </label>
            <div
              class="p-4 rounded-xl border border-[#e6bdb7] bg-[#FFF0EE] text-[#8C352D] text-sm min-h-[80px]"
            >
              {{
                selectedPermit?.description || "Tidak ada deskripsi tersedia."
              }}
            </div>
          </div>

          <div>
            <label
              class="text-xs font-bold text-[#8C352D] mb-2 block uppercase"
            >
              Bukti Foto ({{ selectedPermit?.evidenceImgs?.length || 0 }})
            </label>
            <div
              v-if="
                selectedPermit?.evidenceImgs &&
                selectedPermit.evidenceImgs.length > 0
              "
              class="flex gap-4 overflow-x-auto pb-4 snap-x"
            >
              <div
                v-for="(img, idx) in selectedPermit.evidenceImgs"
                :key="idx"
                class="shrink-0 w-64 aspect-video rounded-2xl border border-[#e6bdb7] overflow-hidden bg-gray-50 snap-center relative group"
              >
                <img
                  :src="img.url"
                  class="w-full h-full object-cover transition-transform"
                />
                <div
                  @click="openFullScreen(img.url)"
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-zoom-in"
                >
                  <span
                    class="text-white font-bold text-xs bg-[#8C352D] px-3 py-1 rounded-full"
                  >
                    Lihat Full Screen
                  </span>
                </div>
              </div>
            </div>
            <div
              v-else
              class="w-full aspect-video rounded-2xl border border-[#e6bdb7] bg-gray-50 flex flex-col items-center justify-center text-[#8C352D]/30"
            >
              <ImageIcon :size="32" />
              <span class="text-xs italic">Tidak ada foto terlampir</span>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="isViewModalOpen = false"
              class="bg-[#8C352D] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#a24a42] cursor-pointer"
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
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebarpublic.vue";
import {
  AlertTriangle as AlertTriangleIcon,
  ArrowLeft as ArrowLeftIcon,
  Calendar as CalendarIcon,
  ChevronDown as ChevronDownIcon,
  Pencil as EditIcon,
  Eye as EyeIcon,
  ListFilter as FilterIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  Upload as UploadIcon,
  X as XIcon,
} from "lucide-vue-next";
import { computed, ref } from "vue";

// State
const viewState = ref<"list" | "form">("list");
const formMode = ref<"add" | "edit">("add");
const isDeleteAlertOpen = ref(false);
const isValidationAlertOpen = ref(false);
const isSuccessAlertOpen = ref(false);
const isViewModalOpen = ref(false);
const fullScreenImg = ref<string | null>(null); // State for Full Screen
const successAlertTitle = ref("");
const selectedId = ref<number | null>(null);
const selectedPermit = ref<any>(null);

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFiles = ref<{ name: string; url: string }[]>([]);

const todayDate = new Date().toISOString().split("T")[0];

const permits = ref([
  {
    id: 1,
    name: "Ryan Ross",
    reason: "Sakit",
    description: "Izin karena demam tinggi.",
    date: "07/10/2025 - 08/10/2025",
    totalDays: 2,
    status: "Menunggu Persetujuan",
    evidenceImgs: [],
  },
]);

const newPermit = ref({
  reason: "",
  description: "",
  startDate: "",
  endDate: "",
});

const computedTotalDays = computed(() => {
  if (!newPermit.value.startDate || !newPermit.value.endDate) return 0;
  const start = new Date(newPermit.value.startDate);
  const end = new Date(newPermit.value.endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
});

const formatDateForDisplay = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const parseDateForInput = (dateStr: string) => {
  const parts = dateStr.split("/");
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";
};

// File & Image Logic
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    Array.from(target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        uploadedFiles.value.push({
          name: file.name,
          url: reader.result as string,
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

// Form Logic
const openViewDetail = (permit: any) => {
  selectedPermit.value = permit;
  isViewModalOpen.value = true;
};

const openAddForm = () => {
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
  uploadedFiles.value = permit.evidenceImgs ? [...permit.evidenceImgs] : [];
  viewState.value = "form";
};

const cancelForm = () => {
  viewState.value = "list";
};

const submitForm = () => {
  if (!newPermit.value.reason || !newPermit.value.startDate) {
    isValidationAlertOpen.value = true;
    return;
  }

  const dateRange = `${formatDateForDisplay(newPermit.value.startDate)} - ${formatDateForDisplay(newPermit.value.endDate || newPermit.value.startDate)}`;
  const evidenceList = [...uploadedFiles.value];

  if (formMode.value === "add") {
    permits.value.unshift({
      id: Date.now(),
      name: "User Default",
      reason: newPermit.value.reason,
      description: newPermit.value.description,
      date: dateRange,
      totalDays: computedTotalDays.value || 1,
      status: "Menunggu Persetujuan",
      evidenceImgs: evidenceList,
    });
    successAlertTitle.value = "Data Perizinan\nBerhasil Ditambahkan!";
  } else {
    const index = permits.value.findIndex((p) => p.id === selectedId.value);
    if (index !== -1) {
      permits.value[index] = {
        ...permits.value[index],
        reason: newPermit.value.reason,
        description: newPermit.value.description,
        date: dateRange,
        totalDays: computedTotalDays.value || 1,
        evidenceImgs: evidenceList,
      };
    }
    successAlertTitle.value = "Data Perizinan\nBerhasil Diperbarui!";
  }
  isSuccessAlertOpen.value = true;
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
    permits.value = permits.value.filter((p) => p.id !== selectedId.value);
    isDeleteAlertOpen.value = false;
    successAlertTitle.value = "Data Berhasil\nDihapus!";
    isSuccessAlertOpen.value = true;
  }
};
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

/* Custom Scrollbar */
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
