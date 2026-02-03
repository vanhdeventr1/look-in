<template>
  <SidebarLayout>
    <div class="space-y-6">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <button
          @click="isModalOpen = true"
          class="flex items-center justify-center gap-2 bg-[#8C352D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#a24a42] transition-colors shadow-lg shadow-[#8C352D]/20 w-fit cursor-pointer"
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
            v-model="searchQuery"
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
                <th class="px-6 py-4 font-bold text-sm">Username</th>
                <th class="px-6 py-4 font-bold text-sm">Email</th>
                <th class="px-6 py-4 font-bold text-sm">Peran</th>
                <th class="px-6 py-4 font-bold text-sm">Kata Sandi</th>
                <th class="px-6 py-4 font-bold text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8D5D2]">
              <tr
                v-for="(user, index) in filteredUsers"
                :key="user.id"
                class="hover:bg-[#FFF0EE]/30 transition-colors"
              >
                <td
                  class="px-6 py-4 text-sm font-semibold text-[#8C352D] text-center"
                >
                  {{ index + 1 }}
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
                  {{ getRoleLabel(user) }}
                </td>
                <td
                  class="px-6 py-4 text-sm text-[#8C352D]/60 tracking-widest font-mono"
                >
                  ••••••••••
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-3">
                    <button
                      @click="viewUserDetails(user)"
                      class="text-[#8C352D] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <EyeIcon :size="18" />
                    </button>
                    <button
                      @click="openEditModal(user)"
                      class="text-[#8C352D] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <EditIcon :size="18" />
                    </button>
                    <button
                      @click="confirmDelete(user)"
                      class="text-[#8C352D] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <TrashIcon :size="18" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td
                  colspan="7"
                  class="px-6 py-10 text-center font-bold text-[#8C352D]"
                >
                  Data tidak ditemukan
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
        class="bg-white w-full max-w-2xl rounded-3xl overflow-hidden animate-in relative"
      >
        <div
          class="h-12 bg-[#8C352D] w-full flex items-center justify-end px-4"
        >
          <button
            @click="isViewModalOpen = false"
            class="text-white hover:opacity-70 cursor-pointer"
          >
            <XIcon :size="24" />
          </button>
        </div>
        <div class="p-10 flex flex-col md:flex-row items-center gap-8">
          <div
            class="w-32 h-32 rounded-full bg-[#8C352D] flex items-center justify-center"
          >
            <UserIcon :size="64" class="text-white/80" />
          </div>
          <div class="flex-1 w-full space-y-4">
            <div
              v-for="field in [
                'Nama Lengkap',
                'Username',
                'Email',
                'Peran',
                'Kata Sandi',
              ]"
              :key="field"
            >
              <label class="text-sm font-bold text-[#8C352D] block mb-1">
                {{ field }}
              </label>
              <div
                class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D]"
              >
                <template v-if="field === 'Nama Lengkap'">
                  {{ selectedUser?.name }}
                </template>
                <template v-else-if="field === 'Username'">
                  {{ selectedUser?.username }}
                </template>
                <template v-else-if="field === 'Email'">
                  {{ selectedUser?.email }}
                </template>
                <template v-else-if="field === 'Peran'">
                  {{ selectedUser ? getRoleLabel(selectedUser) : "" }}
                </template>
                <template v-else>
                  <span class="tracking-widest font-mono">••••••••••</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div
        class="bg-white w-full max-w-2xl rounded-3xl overflow-hidden animate-in"
      >
        <div class="h-12 bg-[#8C352D] w-full"></div>
        <div class="p-8">
          <button
            @click="isModalOpen = false"
            class="flex items-center gap-2 text-[#8C352D] font-bold mb-6 hover:opacity-70 cursor-pointer"
          >
            <ArrowLeftIcon :size="20" />
            Kembali
          </button>
          <form @submit.prevent="handleCreateUser" class="space-y-5">
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#8C352D]">Email</label>
              <input
                v-model="newUser.email"
                type="email"
                placeholder="Masukkan Email Pengguna"
                class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#8C352D]">
                Nama Lengkap
              </label>
              <input
                v-model="newUser.name"
                type="text"
                placeholder="Masukkan Nama Lengkap"
                class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#8C352D]">Username</label>
              <input
                v-model="newUser.username"
                type="text"
                placeholder="Masukkan Username"
                class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#8C352D]">Kata Sandi</label>
              <div class="relative">
                <input
                  v-model="newUser.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Masukkan Kata Sandi"
                  class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C352D]/50 cursor-pointer"
                >
                  <EyeIcon v-if="!showPassword" :size="20" />
                  <EyeOffIcon v-else :size="20" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#8C352D]">Peran</label>
              <select
                v-model.number="newUser.role"
                class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238C352D%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat cursor-pointer"
              >
                <option :value="2">Karyawan</option>
                <option :value="3">Magang</option>
              </select>
            </div>
            <div class="flex justify-end pt-4">
              <button
                type="submit"
                class="bg-[#8C352D] text-white px-10 py-3 rounded-2xl font-bold hover:bg-[#a24a42] transition-all active:scale-95 cursor-pointer"
              >
                Tambah Data Pengguna
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div
        class="bg-white w-full max-w-2xl rounded-3xl overflow-hidden animate-in"
      >
        <div class="h-12 bg-[#8C352D] w-full"></div>
        <div class="p-8">
          <button
            @click="isEditModalOpen = false"
            class="flex items-center gap-2 text-[#8C352D] font-bold mb-6 hover:opacity-70 cursor-pointer"
          >
            <ArrowLeftIcon :size="20" />
            Batal Edit
          </button>
          <form @submit.prevent="handleUpdateUser" class="space-y-5">
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#8C352D]">Email</label>
              <input
                v-model="editUserData.email"
                type="email"
                class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#8C352D]">
                Nama Lengkap
              </label>
              <input
                v-model="editUserData.name"
                type="text"
                class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#8C352D]">Username</label>
              <input
                v-model="editUserData.username"
                type="text"
                class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#8C352D]">Peran</label>
              <select
                v-model.number="editUserData.role"
                class="w-full px-5 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/30 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238C352D%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat cursor-pointer"
              >
                <option :value="2">Karyawan</option>
                <option :value="3">Magang</option>
              </select>
            </div>
            <div class="flex justify-end pt-4">
              <button
                type="submit"
                class="bg-[#8C352D] text-white px-10 py-3 rounded-2xl font-bold hover:bg-[#a24a42] transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

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
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all cursor-pointer"
        >
          OK
        </button>
      </template>
    </AlertLayout>

    <AlertLayout v-if="isDeleteAlertOpen">
      <template #icon>
        <AlertTriangleIcon :size="80" class="text-[#8C352D] stroke-[1.5]" />
      </template>
      <template #title>
        Anda Ingin Menghapus
        <br />
        Akun Ini?
      </template>
      <template #actions>
        <button
          @click="handleDeleteUser"
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
  </SidebarLayout>
</template>

<script setup lang="ts">
import { createUser, deleteUser, getUsers, updateUser } from "@/api/users.api";
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebar.vue";
import {
  AlertTriangle as AlertTriangleIcon,
  ArrowLeft as ArrowLeftIcon,
  Check as CheckIcon,
  Pencil as EditIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Trash2 as TrashIcon,
  User as UserIcon,
  X as XIcon,
} from "lucide-vue-next";
import { computed, onMounted, reactive, ref } from "vue"; // Added computed

type User = {
  id: number;
  name: string;
  username?: string;
  email: string;
  role: number;
  role_name?: string;
};

type EditableUser = Omit<User, "id"> & { id: number | null };

// States
const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isSuccessAlertOpen = ref(false);
const isDeleteAlertOpen = ref(false);
const successAlertTitle = ref("");
const searchQuery = ref(""); // New State for Search

const selectedUser = ref<User | null>(null);
const selectedUserForDelete = ref<User | null>(null);
const showPassword = ref(false);

const newUser = reactive({
  email: "",
  name: "",
  username: "",
  password: "",
  role: 2,
});

const editUserData = reactive<EditableUser>({
  id: null,
  username: "",
  email: "",
  name: "",
  role: 2,
});

const users = ref<User[]>([]);

const roleLabelMap: Record<number, string> = {
  0: "Pengguna",
  1: "Manajer Rekrutmen",
  2: "Karyawan",
  3: "Magang",
};

const getRoleLabel = (user: User) =>
  user.role_name ?? roleLabelMap[user.role] ?? "User";

// COMPUTED SEARCH LOGIC
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value;
  }
  const query = searchQuery.value.toLowerCase();
  return users.value.filter((user) => {
    const roleLabel = getRoleLabel(user);
    return (
      user.name.toLowerCase().includes(query) ||
      (user.username || "").toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      roleLabel.toLowerCase().includes(query)
    );
  });
});

// Logic
const fetchUsers = async () => {
  try {
    const response = await getUsers();
    users.value = response?.data?.data?.users ?? [];
  } catch (error) {
    console.error(error);
    users.value = [];
  }
};

const handleCreateUser = async () => {
  try {
    await createUser({
      email: newUser.email,
      name: newUser.name,
      password: newUser.password,
      username: newUser.username,
      role: newUser.role,
    });

    await fetchUsers();
    Object.assign(newUser, {
      email: "",
      name: "",
      username: "",
      password: "",
      role: 2,
    });
    isModalOpen.value = false;
    successAlertTitle.value = "Data Berhasil Ditambahkan!";
    setTimeout(() => {
      isSuccessAlertOpen.value = true;
    }, 300);
  } catch (error) {
    console.error(error);
  }
};

const openEditModal = (user: User) => {
  Object.assign(editUserData, { ...user });
  isEditModalOpen.value = true;
};

const handleUpdateUser = async () => {
  if (editUserData.id === null) return;
  const index = users.value.findIndex((u) => u.id === editUserData.id);
  if (index !== -1) {
    try {
      await updateUser(editUserData.id, {
        name: editUserData.name,
        username: editUserData.username || "",
        email: editUserData.email,
        role: editUserData.role,
      });
      await fetchUsers();
      isEditModalOpen.value = false;
      successAlertTitle.value = "Data Berhasil Diperbarui!";
      setTimeout(() => {
        isSuccessAlertOpen.value = true;
      }, 300);
    } catch (error) {
      console.error(error);
    }
  }
};

const viewUserDetails = (user: User) => {
  selectedUser.value = user;
  isViewModalOpen.value = true;
};

const confirmDelete = (user: User) => {
  selectedUserForDelete.value = user;
  isDeleteAlertOpen.value = true;
};

const handleDeleteUser = async () => {
  const selectedId = selectedUserForDelete.value?.id;
  if (selectedId !== undefined && selectedId !== null) {
    try {
      await deleteUser(selectedId);
      users.value = users.value.filter((u) => u.id !== selectedId);
      isDeleteAlertOpen.value = false;
      selectedUserForDelete.value = null;
      successAlertTitle.value = "Data Berhasil Dihapus!";
      setTimeout(() => {
        isSuccessAlertOpen.value = true;
      }, 300);
    } catch (error) {
      console.error(error);
    }
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
