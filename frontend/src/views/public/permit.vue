<template>
  <SidebarLayout>
    <div class="flex flex-col gap-y-6">
      <div class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">5</p>
            <p class="text-[#8C352D] font-medium">Sakit</p>
          </div>

          <div
            class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
          >
            <p class="text-3xl font-bold text-[#8C352D]">12</p>
            <p class="text-[#8C352D] font-medium">Menunggu Perizinan</p>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <button
            @click="isModalOpen = true"
            class="flex items-center justify-center gap-2 bg-[#8C352D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#a24a42] transition-colors shadow-lg shadow-[#8C352D]/20 w-fit"
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
                  <th class="px-6 py-4 font-bold text-sm">Alasan</th>
                  <th class="px-6 py-4 font-bold text-sm">Tanggal Izin</th>
                  <th class="px-6 py-4 font-bold text-sm">Status</th>
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
                  <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                    {{ permit.status }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-3">
                      <button
                        @click="openViewDetail(permit)"
                        class="text-[#8C352D] hover:scale-110 transition-transform"
                      >
                        <EyeIcon :size="18" />
                      </button>
                      <button
                        @click="openEditModal(permit)"
                        class="text-[#8C352D] hover:scale-110 transition-transform"
                      >
                        <EditIcon :size="18" />
                      </button>
                      <button
                        @click="confirmDelete(permit)"
                        class="text-[#8C352D] hover:scale-110 transition-transform"
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
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all"
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
        Izin Ini?
      </template>
      <template #actions>
        <button
          @click="handleDeletePermit"
          class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold hover:bg-[#a24a42]"
        >
          Ya, Hapus!
        </button>
        <button
          @click="isDeleteAlertOpen = false"
          class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold hover:bg-[#FFF0EE]/50"
        >
          Batalkan
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
  Check as CheckIcon,
  Pencil as EditIcon,
  Eye as EyeIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Trash2 as TrashIcon,
} from "lucide-vue-next";
import { computed, onMounted, reactive, ref } from "vue"; // Added computed

const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isSuccessAlertOpen = ref(false);
const isDeleteAlertOpen = ref(false);

const searchQuery = ref("");
const selectedPermit = ref<any>(null);
const successAlertTitle = ref("");
const statusType = ref<"check" | "x">("check");

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

const openEditModal = (user: User) => {
  Object.assign(editUserData, { ...user });
  isEditModalOpen.value = true;
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
