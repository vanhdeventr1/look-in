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
            <p class="text-3xl font-bold text-[#8C352D]">{{ totalItems }}</p>
            <p class="text-[#8C352D] font-medium">Total Pengguna</p>
          </div>
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">{{ employeeCount }}</p>
            <p class="text-[#8C352D] font-medium">Karyawan & Magang</p>
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
              {{ formMode === "add" ? "Tambah Pengguna" : "Edit Pengguna" }}
            </span>
          </div>
          <div class="p-8 md:p-12 space-y-6">
            <div class="space-y-2">
              <label class="text-[#8C352D] font-bold ml-1">Nama Lengkap</label>
              <input
                v-model="userForm.name"
                type="text"
                class="w-full p-4 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[#8C352D] font-bold ml-1">Username</label>
              <input
                v-model="userForm.username"
                type="text"
                class="w-full p-4 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none"
                placeholder="Masukkan username"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[#8C352D] font-bold ml-1">Email</label>
              <input
                v-model="userForm.email"
                type="email"
                class="w-full p-4 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none"
                placeholder="email@contoh.com"
              />
            </div>
            <div v-if="formMode === 'add'" class="space-y-2">
              <label class="text-[#8C352D] font-bold ml-1">Kata Sandi</label>
              <input
                v-model="userForm.password"
                type="password"
                class="w-full p-4 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[#8C352D] font-bold ml-1">Pilih Peran</label>
              <div class="relative">
                <select
                  v-model.number="userForm.role"
                  class="w-full p-4 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] appearance-none focus:outline-none cursor-pointer"
                >
                  <option :value="2">Karyawan</option>
                  <option :value="3">Magang</option>
                </select>
                <ChevronDownIcon
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C352D] pointer-events-none"
                  :size="20"
                />
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button
                @click="submitForm"
                class="bg-[#8C352D] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#a24a42] transition-all cursor-pointer"
              >
                {{
                  formMode === "add" ? "Tambah Pengguna" : "Simpan Perubahan"
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
            <div class="relative w-64">
              <SearchIcon
                :size="18"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C352D]"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari nama..."
                class="w-full pl-10 pr-4 py-2 border border-[#8C352D] rounded-xl text-sm focus:outline-none text-[#8C352D]"
              />
            </div>
            <div
              @click="isNewest = !isNewest"
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
                  <th class="px-6 py-4 font-bold text-sm">Username</th>
                  <th class="px-6 py-4 font-bold text-sm">Email</th>
                  <th class="px-6 py-4 font-bold text-sm">Peran</th>
                  <th class="px-6 py-4 font-bold text-sm text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E8D5D2]">
                <tr
                  v-for="(user, index) in paginatedUsers"
                  :key="user.id"
                  class="hover:bg-[#FFF0EE]/30 transition-colors"
                >
                  <td
                    class="px-6 py-4 text-sm font-semibold text-[#8C352D] text-center"
                  >
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-[#8C352D]">
                    {{ user.name }}
                  </td>
                  <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                    {{ user.username || "-" }}
                  </td>
                  <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                    {{ getRoleLabel(user.role) }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-3">
                      <button
                        @click="openViewDetail(user)"
                        class="text-[#8C352D] hover:scale-110 cursor-pointer"
                      >
                        <EyeIcon :size="18" />
                      </button>
                      <button
                        @click="openEditForm(user)"
                        class="text-[#8C352D] hover:scale-110 cursor-pointer"
                      >
                        <EditIcon :size="18" />
                      </button>
                      <button
                        @click="confirmDelete(user.id)"
                        class="text-[#8C352D] hover:scale-110 cursor-pointer"
                      >
                        <TrashIcon :size="18" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td
                    colspan="6"
                    class="px-6 py-10 text-center text-[#8C352D]/50 italic text-sm"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="filteredUsers.length > 0"
            class="flex items-center justify-between px-6 py-4 bg-[#FFF0EE]/30 border-t border-[#E8D5D2]"
          >
            <span class="text-sm text-[#8C352D] font-medium">
              Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
              {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}
              dari {{ filteredUsers.length }} data
            </span>
            <div class="flex items-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="p-2 rounded-lg border border-[#8C352D] text-[#8C352D] disabled:opacity-30 hover:bg-[#8C352D] hover:text-white transition-colors cursor-pointer"
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
                class="p-2 rounded-lg border border-[#8C352D] text-[#8C352D] disabled:opacity-30 hover:bg-[#8C352D] hover:text-white transition-colors cursor-pointer"
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
          <span class="text-white font-bold text-sm">Detail Pengguna</span>
          <button
            @click="isViewModalOpen = false"
            class="text-white hover:opacity-70 cursor-pointer"
          >
            <XIcon :size="20" />
          </button>
        </div>
        <div class="p-10 space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-1">
              <label
                class="text-[11px] font-bold text-[#8C352D] uppercase tracking-wider"
              >
                Nama Lengkap
              </label>
              <div
                class="p-4 rounded-2xl border border-[#e6bdb7] bg-[#FFF0EE]/50 text-[#8C352D] text-sm font-medium"
              >
                {{ selectedUser?.name }}
              </div>
            </div>
            <div class="space-y-1">
              <label
                class="text-[11px] font-bold text-[#8C352D] uppercase tracking-wider"
              >
                Username
              </label>
              <div
                class="p-4 rounded-2xl border border-[#e6bdb7] bg-[#FFF0EE]/50 text-[#8C352D] text-sm font-medium"
              >
                {{ selectedUser?.username || "-" }}
              </div>
            </div>
          </div>
          <div class="space-y-1">
            <label
              class="text-[11px] font-bold text-[#8C352D] uppercase tracking-wider"
            >
              Email
            </label>
            <div
              class="p-4 rounded-2xl border border-[#e6bdb7] bg-[#FFF0EE]/50 text-[#8C352D] text-sm font-medium"
            >
              {{ selectedUser?.email }}
            </div>
          </div>
          <div class="space-y-1">
            <label
              class="text-[11px] font-bold text-[#8C352D] uppercase tracking-wider"
            >
              Peran
            </label>
            <div
              class="p-4 rounded-2xl border border-[#e6bdb7] bg-[#FFF0EE]/50 text-[#8C352D] text-sm font-medium"
            >
              {{ getRoleLabel(selectedUser?.role) }}
            </div>
          </div>
          <div class="flex justify-end pt-4">
            <button
              @click="isViewModalOpen = false"
              class="bg-[#8C352D] text-white px-12 py-3 rounded-2xl font-bold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <AlertLayout v-if="isDeleteAlertOpen">
      <template #icon>
        <AlertTriangleIcon :size="80" class="text-[#8C352D]" />
      </template>
      <template #title>
        Anda Ingin Menghapus
        <br />
        Pengguna Ini?
      </template>
      <template #actions>
        <button
          @click="handleDeleteUser"
          class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold"
        >
          Ya, Hapus!
        </button>
        <button
          @click="isDeleteAlertOpen = false"
          class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold"
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
          <span class="text-[#8C352D] text-4xl font-bold">✓</span>
        </div>
      </template>
      <template #title>{{ successAlertTitle }}</template>
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
import { createUser, deleteUser, getUsers, updateUser } from "@/api/users.api";
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebar.vue";
import {
  AlertTriangle as AlertTriangleIcon,
  ArrowLeft as ArrowLeftIcon,
  ChevronDown as ChevronDownIcon,
  Pencil as EditIcon,
  Eye as EyeIcon,
  Settings2 as FilterIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Trash2 as TrashIcon,
  X as XIcon,
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";

const viewState = ref<"list" | "form">("list");
const formMode = ref<"add" | "edit">("add");
const isDeleteAlertOpen = ref(false);
const isSuccessAlertOpen = ref(false);
const isViewModalOpen = ref(false);
const successAlertTitle = ref("");
const searchQuery = ref("");
const isNewest = ref(true);

const users = ref<any[]>([]);
const selectedId = ref<number | null>(null);
const selectedUser = ref<any>(null);

const currentPage = ref(1);
const itemsPerPage = 10;

const userForm = ref({
  name: "",
  username: "",
  email: "",
  password: "",
  role: 2,
});

const roleLabelMap: Record<number, string> = {
  0: "Admin",
  1: "Manajer",
  2: "Karyawan",
  3: "Magang",
};
const getRoleLabel = (role: number) => roleLabelMap[role] ?? "User";

const fetchUsers = async () => {
  try {
    const response = await getUsers();
    users.value = response?.data?.data?.users ?? [];
  } catch (error) {
    console.error(error);
  }
};

const filteredUsers = computed(() => {
  let list = [...users.value];

  if (searchQuery.value) {
    list = list.filter((u) =>
      u.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }

  list.sort((a, b) => {
    const valA = a.id;
    const valB = b.id;
    return isNewest.value ? valB - valA : valA - valB;
  });

  return list;
});

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / itemsPerPage),
);
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

const totalItems = computed(() => users.value.length);
const employeeCount = computed(
  () => users.value.filter((u) => u.role === 2 || u.role === 3).length,
);

// Actions
const openAddForm = () => {
  formMode.value = "add";
  userForm.value = { name: "", username: "", email: "", password: "", role: 2 };
  viewState.value = "form";
};

const openEditForm = (user: any) => {
  formMode.value = "edit";
  selectedId.value = user.id;
  userForm.value = {
    name: user.name,
    username: user.username || "",
    email: user.email,
    password: "",
    role: user.role,
  };
  viewState.value = "form";
};

const openViewDetail = (user: any) => {
  selectedUser.value = user;
  isViewModalOpen.value = true;
};

const cancelForm = () => {
  viewState.value = "list";
};

const submitForm = async () => {
  try {
    if (formMode.value === "add") {
      await createUser(userForm.value);
      successAlertTitle.value = "Data Pengguna\nBerhasil Ditambahkan!";
    } else if (selectedId.value) {
      await updateUser(selectedId.value, userForm.value);
      successAlertTitle.value = "Data Pengguna\nBerhasil Diperbarui!";
    }
    await fetchUsers();
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

const handleDeleteUser = async () => {
  if (selectedId.value) {
    try {
      await deleteUser(selectedId.value);
      await fetchUsers();
      isDeleteAlertOpen.value = false;
      successAlertTitle.value = "Data Berhasil\nDihapus!";
      isSuccessAlertOpen.value = true;
    } catch (error) {
      console.error(error);
    }
  }
};

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(fetchUsers);
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
</style>
