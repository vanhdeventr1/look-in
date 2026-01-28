<template>
  <SidebarLayout>
    <div class="space-y-6">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <button
          @click="openAddModal"
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
                <th class="px-6 py-4 font-bold text-sm">Email</th>
                <th class="px-6 py-4 font-bold text-sm">Peran</th>
                <th class="px-6 py-4 font-bold text-sm">Kata Sandi</th>
                <th class="px-6 py-4 font-bold text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8D5D2]">
              <tr
                v-for="(user, index) in users"
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
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/80">
                  {{ user.role }}
                </td>
                <td class="px-6 py-4 text-sm text-[#8C352D]/60 tracking-widest">
                  ••••••••••
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-3">
                    <button
                      class="text-[#8C352D] hover:scale-110 transition-transform"
                    >
                      <EyeIcon :size="18" />
                    </button>
                    <button
                      class="text-[#8C352D] hover:scale-110 transition-transform"
                    >
                      <EditIcon :size="18" />
                    </button>
                    <button
                      class="text-[#8C352D] hover:scale-110 transition-transform"
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
  </SidebarLayout>
</template>

<script setup lang="ts">
import SidebarLayout from "@/layout/sidebar.vue";
import {
  Pencil as EditIcon,
  Eye as EyeIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Trash2 as TrashIcon,
} from "lucide-vue-next";
import { ref } from "vue";

const users = ref([
  {
    id: 1,
    name: "Johnny Marr",
    email: "johnnymarrmail@gmail.com",
    role: "Karyawan",
  },
  { id: 2, name: "Morrissey", email: "morrissey@gmail.com", role: "Karyawan" },
  {
    id: 3,
    name: "Julian Casablancas",
    email: "julianmail@gmail.com",
    role: "Karyawan",
  },
  { id: 4, name: "Thom Yorke", email: "thommail@gmail.com", role: "Karyawan" },
  {
    id: 5,
    name: "Mark Mckenna",
    email: "markmail@gmail.com",
    role: "Karyawan",
  },
  { id: 6, name: "Ethel Cain", email: "ethelcain@gmail.com", role: "Karyawan" },
  {
    id: 7,
    name: "Taylor Swift",
    email: "taylorswift@gmail.com",
    role: "Karyawan",
  },
  {
    id: 8,
    name: "Chappell Roan",
    email: "chappell@gmail.com",
    role: "Karyawan",
  },
  {
    id: 9,
    name: "Hayley Williams",
    email: "hayley@gmail.com",
    role: "Karyawan",
  },
  {
    id: 10,
    name: "Kellin Quinn",
    email: "kellinnmail@gmail.com",
    role: "Karyawan",
  },
]);

const openAddModal = () => {
  console.log("Opening add user modal...");
};
</script>

<style scoped>
table {
  border-spacing: 0;
}
</style>
