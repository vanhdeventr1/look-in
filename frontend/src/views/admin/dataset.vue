<template>
  <SidebarLayout>
    <div class="space-y-6 animate-in">
      <div v-if="viewState === 'list'" class="space-y-6">
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

          <div class="relative w-full md:w-80">
            <span
              class="absolute inset-y-0 left-4 flex items-center text-[#8C352D]/40"
            >
              <SearchIcon :size="18" />
            </span>
            <input
              type="text"
              v-model="searchQuery"
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
                  <th class="px-6 py-4 font-bold text-sm">Peran</th>
                  <th class="px-6 py-4 font-bold text-sm text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E8D5D2]">
                <tr
                  v-for="(item, index) in paginatedDataset"
                  :key="item.id"
                  class="hover:bg-[#FFF0EE]/30 transition-colors"
                >
                  <td
                    class="px-6 py-4 text-sm font-semibold text-[#8C352D] text-center"
                  >
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-[#8C352D]">
                    {{ item.name }}
                  </td>
                  <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                    {{ item.role }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-3">
                      <button
                        @click="openViewMode(item)"
                        class="text-[#8C352D] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <EyeIcon :size="18" />
                      </button>
                      <button
                        @click="openEditForm(item)"
                        class="text-[#8C352D] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <EditIcon :size="18" />
                      </button>
                      <button
                        @click="confirmDelete(item.id)"
                        class="text-[#8C352D] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <TrashIcon :size="18" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredDataset.length === 0">
                  <td
                    colspan="4"
                    class="px-6 py-10 text-center text-[#8C352D]/40 italic text-sm"
                  >
                    Belum ada dataset ditambahkan
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="filteredDataset.length > 0"
            class="flex items-center justify-between px-6 py-4 bg-[#FFF0EE]/30 border-t border-[#E8D5D2]"
          >
            <span class="text-sm text-[#8C352D] font-medium">
              Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
              {{ Math.min(currentPage * itemsPerPage, filteredDataset.length) }}
              dari {{ filteredDataset.length }} data
            </span>
            <div class="flex items-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="p-2 rounded-lg border border-[#8C352D] text-[#8C352D] disabled:opacity-30 cursor-pointer hover:bg-[#8C352D] hover:text-white transition-colors"
              >
                <ChevronDownIcon class="rotate-90 scale-75" :size="16" />
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
                class="p-2 rounded-lg border border-[#8C352D] text-[#8C352D] disabled:opacity-30 cursor-pointer hover:bg-[#8C352D] hover:text-white transition-colors"
              >
                <ChevronDownIcon class="-rotate-90 scale-75" :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="viewState === 'view' && selectedData"
        class="space-y-6 animate-in"
      >
        <button
          @click="viewState = 'list'"
          class="flex items-center gap-2 text-[#8C352D] font-bold hover:opacity-70 transition-opacity cursor-pointer"
        >
          <ArrowLeftIcon :size="20" />
          Kembali
        </button>

        <div
          class="bg-white border border-[#E8D5D2] rounded-[2.5rem] overflow-hidden shadow-sm"
        >
          <div class="h-14 bg-[#8C352D] w-full flex items-center px-8" />
          <div class="p-8 md:p-12 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[#8C352D] font-bold ml-1">Pengguna</label>
                <div
                  class="w-full p-4 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] font-medium"
                >
                  {{ selectedData.name }}
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[#8C352D] font-bold ml-1">Peran</label>
                <div
                  class="w-full p-4 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] font-medium"
                >
                  {{ selectedData.role }}
                </div>
              </div>
            </div>

            <div class="space-y-3 pt-4">
              <label class="text-sm font-bold text-[#8C352D] block mb-1">
                Data Wajah Pengguna ({{ selectedData.images?.length || 0 }})
              </label>

              <div
                v-if="selectedData.images && selectedData.images.length > 0"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar p-1"
              >
                <div
                  v-for="(img, idx) in selectedData.images"
                  :key="idx"
                  @click="openLightbox(img.preview)"
                  class="group relative aspect-square rounded-2xl border border-[#e6bdb7] overflow-hidden bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    :src="img.preview"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <EyeIcon class="text-white" :size="24" />
                  </div>
                </div>
              </div>

              <div
                v-else
                class="w-full py-10 rounded-3xl border border-dashed border-[#e6bdb7] bg-[#FFF0EE]/30 flex flex-col items-center justify-center text-[#8C352D]/30"
              >
                <ImageIcon :size="32" />
                <span class="text-xs italic mt-2">
                  Tidak ada data wajah ditemukan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="viewState === 'form'" class="space-y-6 animate-in">
        <button
          @click="viewState = 'list'"
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
              {{
                formMode === "add"
                  ? "Tambah Data Pengguna"
                  : "Edit Data Pengguna"
              }}
            </span>
          </div>

          <div class="p-8 md:p-12 space-y-8">
            <div class="space-y-2">
              <label class="text-[#8C352D] font-bold ml-1">
                Pilih Pengguna
              </label>
              <div class="relative">
                <select
                  v-model="selectedUser"
                  :disabled="formMode === 'edit'"
                  class="w-full p-4 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] appearance-none focus:outline-none cursor-pointer disabled:opacity-60"
                >
                  <option value="" disabled>Pilih Pengguna</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
                <ChevronDownIcon
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C352D] pointer-events-none"
                  :size="20"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[#8C352D] font-bold ml-1">
                  Tambah Data Foto Pengguna
                </label>
                <div
                  @click="fileInput?.click()"
                  class="border-2 border-dashed border-[#E8D5D2] bg-[#FFF0EE]/50 rounded-[2rem] h-64 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#FFF0EE] transition-all group"
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
                <div class="flex justify-between items-center ml-1">
                  <label class="text-[#8C352D] font-bold">
                    Daftar File ({{ uploadedFiles.length }})
                  </label>
                  <button
                    v-if="uploadedFiles.length > 0"
                    @click="uploadedFiles = []"
                    class="text-[10px] text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Hapus Semua
                  </button>
                </div>
                <div
                  v-if="uploadedFiles.length > 0"
                  class="max-h-[300px] overflow-y-auto grid grid-cols-1 gap-2 pr-2 custom-scrollbar"
                >
                  <div
                    v-for="(file, index) in uploadedFiles"
                    :key="index"
                    class="flex items-center justify-between p-3 rounded-xl border border-[#E8D5D2] bg-white hover:border-[#8C352D]/40 transition-colors"
                  >
                    <div
                      class="flex items-center gap-3 text-[#8C352D] overflow-hidden"
                    >
                      <div
                        class="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#E8D5D2]"
                      >
                        <img
                          :src="file.preview"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div class="flex flex-col overflow-hidden">
                        <span class="text-xs font-bold truncate max-w-[150px]">
                          {{ file.name }}
                        </span>
                      </div>
                    </div>
                    <button
                      @click="removeFile(index)"
                      class="text-[#8C352D] hover:text-red-600 p-2 cursor-pointer transition-colors"
                    >
                      <TrashIcon :size="16" />
                    </button>
                  </div>
                </div>
                <div
                  v-else
                  class="h-[300px] rounded-2xl border border-dashed border-[#E8D5D2] flex items-center justify-center text-[#8C352D]/30 text-sm italic"
                >
                  Belum ada file diunggah
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button
                @click="submitData"
                class="bg-[#8C352D] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#a24a42] transition-all cursor-pointer shadow-lg active:scale-95"
              >
                {{
                  formMode === "add"
                    ? "Tambah Data Pengguna"
                    : "Simpan Perubahan"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="lightboxUrl"
      @click="lightboxUrl = null"
      class="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
    >
      <div class="relative">
        <img
          :src="lightboxUrl"
          class="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl animate-in object-contain"
        />
        <button
          class="absolute -top-12 right-0 text-white font-bold bg-[#8C352D] px-6 py-2 rounded-full cursor-pointer"
        >
          Tutup Viewer
        </button>
      </div>
    </div>

    <AlertLayout v-if="isDeleteAlertOpen">
      <template #icon>
        <AlertTriangleIcon :size="80" class="text-[#8C352D] stroke-[1.5]" />
      </template>
      <template #title>
        Anda Ingin Menghapus
        <br />
        Data Ini?
      </template>
      <template #actions>
        <button
          @click="handleDelete"
          class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold cursor-pointer"
        >
          Ya, Hapus!
        </button>
        <button
          @click="isDeleteAlertOpen = false"
          class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold cursor-pointer"
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
        Data Pengguna!
      </template>
      <template #actions>
        <button
          @click="isValidationAlertOpen = false"
          class="w-full bg-[#8C352D] text-white py-3 rounded-2xl font-bold cursor-pointer"
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
      <template #title>
        <div class="whitespace-pre-line text-center">
          {{ successAlertTitle }}
        </div>
      </template>
      <template #actions>
        <button
          @click="closeSuccessAlert"
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold"
        >
          OK
        </button>
      </template>
    </AlertLayout>
  </SidebarLayout>
</template>

<script setup lang="ts">
import {
  createDataset,
  deleteDataset,
  getDataset,
  getDatasets,
} from "@/api/dataset.api";
import { getUsers } from "@/api/users.api";
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebar.vue";
import {
  AlertTriangle as AlertTriangleIcon,
  ArrowLeft as ArrowLeftIcon,
  ChevronDown as ChevronDownIcon,
  Pencil as EditIcon,
  Eye as EyeIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Trash2 as TrashIcon,
  Upload as UploadIcon,
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";

type User = {
  id: number;
  name: string;
  role: number;
  role_name?: string;
};

type DatasetImage = {
  id: number;
  url: string;
};

type DatasetApiItem = {
  id: number;
  user_id: number;
  user?: User;
  dataset_images?: DatasetImage[];
  datasetImages?: DatasetImage[];
  userId?: number;
};

type DatasetRow = {
  id: number;
  userId: number;
  name: string;
  role: string;
  images: Array<{
    id?: number;
    name?: string;
    preview: string;
    file?: File;
  }>;
};

const viewState = ref<"list" | "form" | "view">("list");
const formMode = ref<"add" | "edit">("add");
const fileInput = ref<HTMLInputElement | null>(null);
const lightboxUrl = ref<string | null>(null);

const isDeleteAlertOpen = ref(false);
const isValidationAlertOpen = ref(false);
const isSuccessAlertOpen = ref(false);
const successAlertTitle = ref("");
const selectedId = ref<number | null>(null);
const searchQuery = ref("");

const currentPage = ref(1);
const itemsPerPage = ref(10);

const users = ref<User[]>([]);

const dataset = ref<DatasetRow[]>([]);
const selectedUser = ref<number | string>("");
const uploadedFiles = ref<DatasetRow["images"]>([]);
const selectedData = ref<DatasetRow | null>(null);

const roleLabelMap: Record<number, string> = {
  0: "Pengguna",
  1: "Manajer Rekrutmen",
  2: "Karyawan",
  3: "Magang",
};

const getRoleLabel = (user?: User | null) =>
  user?.role_name ?? (user ? roleLabelMap[user.role] : undefined) ?? "-";

const normalizeDatasetRow = (d: DatasetApiItem): DatasetRow => ({
  id: (d as any).id,
  userId: (d as any).user_id ?? (d as any).userId,
  name: (d as any).user?.name ?? "-",
  role: getRoleLabel((d as any).user),
  images: ((d as any).dataset_images ?? (d as any).datasetImages ?? []).map(
    (img: DatasetImage) => ({
      id: img.id,
      name: `image-${img.id}`,
      preview: img.url,
    }),
  ),
});

const fetchUsers = async () => {
  try {
    const response = await getUsers({ limit: 1000 });
    users.value = response?.data?.data?.users ?? [];
  } catch (error) {
    console.error(error);
    users.value = [];
  }
};

const fetchDatasets = async () => {
  try {
    const response = await getDatasets({ limit: 1000 });
    const datasets = (response?.data?.data?.datasets ?? []) as DatasetApiItem[];
    dataset.value = datasets.map(normalizeDatasetRow);
  } catch (error) {
    console.error(error);
    dataset.value = [];
  }
};

const fetchDatasetDetail = async (id: number) => {
  const response = await getDataset(id);
  return response?.data?.data as DatasetApiItem;
};

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchDatasets()]);
});

const filteredDataset = computed(() => {
  if (!searchQuery.value) return dataset.value;
  return dataset.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const totalPages = computed(
  () => Math.ceil(filteredDataset.value.length / itemsPerPage.value) || 1,
);
const paginatedDataset = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredDataset.value.slice(start, start + itemsPerPage.value);
});

watch(searchQuery, () => (currentPage.value = 1));

const openAddForm = () => {
  formMode.value = "add";
  viewState.value = "form";
  selectedUser.value = "";
  uploadedFiles.value = [];
};

const openViewMode = async (item: DatasetRow) => {
  try {
    // The list endpoint should include dataset_images, but fetch detail to ensure
    // the view modal always has the latest dataset_images attached.
    const detail = await fetchDatasetDetail(item.id);
    selectedData.value = normalizeDatasetRow(detail);
  } catch (error) {
    console.error(error);
    selectedData.value = item;
  } finally {
    viewState.value = "view";
  }
};

const openEditForm = (item: any) => {
  // Backend currently supports create/delete datasets. "Edit" is kept as UI flow,
  // but we don't attempt to update existing dataset images here.
  formMode.value = "edit";
  viewState.value = "form";
  selectedId.value = item.id;
  selectedUser.value = item.userId;
  uploadedFiles.value = [];
};

const openLightbox = (url: string) => (lightboxUrl.value = url);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    Array.from(target.files).forEach((file) => {
      uploadedFiles.value.push({
        name: file.name,
        preview: URL.createObjectURL(file),
        file: file,
      });
    });
    // Reset input so user can add more files in same session
    target.value = "";
  }
};

const removeFile = (index: number) => uploadedFiles.value.splice(index, 1);

const submitData = async () => {
  const files = uploadedFiles.value
    .map((f) => f.file)
    .filter(Boolean) as File[];
  if (!selectedUser.value || files.length === 0) {
    isValidationAlertOpen.value = true;
    return;
  }

  try {
    if (formMode.value === "add") {
      await createDataset({ user_id: Number(selectedUser.value), files });
      successAlertTitle.value = "Gambar Dataset\nBerhasil Ditambahkan!";
    } else {
      isValidationAlertOpen.value = true;
      return;
    }

    await fetchDatasets();
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

const handleDelete = () => {
  if (!selectedId.value) return;
  deleteDataset(selectedId.value)
    .then(() => fetchDatasets())
    .catch((error) => console.error(error))
    .finally(() => {
      isDeleteAlertOpen.value = false;
    });
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e8d5d2;
  border-radius: 10px;
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
