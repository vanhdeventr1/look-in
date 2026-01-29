<template>
  <SidebarLayout>
    <div
      class="bg-white border border-[#E8D5D2] rounded-2xl overflow-hidden shadow-sm"
    >
      <div class="h-16 bg-[#8C352D]"></div>

      <div class="p-8 md:p-12">
        <div class="flex flex-col md:flex-row items-center gap-6 mb-12">
          <div class="relative">
            <div
              class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100"
            >
              <img
                v-if="user?.url"
                :src="user.url"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-[#8C352D] text-white text-4xl font-bold"
              >
                {{ user?.name?.charAt(0) }}
              </div>
            </div>
            <button
              type="button"
              @click="triggerFilePicker"
              class="absolute bottom-1 right-1 bg-[#8C352D] p-2 rounded-full border-2 border-white text-white hover:scale-110 transition-transform"
            >
              <CameraIcon :size="18" />
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileChange"
            />
          </div>

          <div class="text-center md:text-left">
            <h3 class="text-xl font-bold text-[#8C352D]">{{ user?.name }}</h3>
            <p class="text-[#8C352D]/60 text-sm">{{ user?.email }}</p>
          </div>
        </div>

        <form
          @submit.prevent="updateProfile"
          class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
        >
          <div class="space-y-6">
            <div class="flex flex-col gap-2">
              <label class="text-[#8C352D] font-semibold text-sm">Email</label>
              <input
                type="email"
                v-model="form.email"
                class="w-full px-4 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20 transition-all"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[#8C352D] font-semibold text-sm">
                Nama Lengkap
              </label>
              <input
                type="text"
                v-model="form.name"
                class="w-full px-4 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20 transition-all"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[#8C352D] font-semibold text-sm">
                Nomor Telepon
              </label>
              <input
                type="text"
                v-model="form.phone_no"
                class="w-full px-4 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20 transition-all"
              />
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex flex-col gap-2">
              <label class="text-[#8C352D] font-semibold text-sm">
                Kata Sandi Lama
              </label>
              <div class="relative">
                <input
                  :type="showOld ? 'text' : 'password'"
                  v-model="passwordForm.old_password"
                  placeholder="Masukkan Kata Sandi Lama"
                  class="w-full px-4 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                />
                <button
                  @click.prevent="showOld = !showOld"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C352D]/40"
                >
                  <component :is="showOld ? EyeOffIcon : EyeIcon" :size="20" />
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[#8C352D] font-semibold text-sm">
                Kata Sandi Baru
              </label>
              <div class="relative">
                <input
                  :type="showNew ? 'text' : 'password'"
                  v-model="passwordForm.new_password"
                  placeholder="Masukkan Kata Sandi Baru"
                  class="w-full px-4 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                />
                <button
                  @click.prevent="showNew = !showNew"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C352D]/40"
                >
                  <component :is="showNew ? EyeOffIcon : EyeIcon" :size="20" />
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[#8C352D] font-semibold text-sm">
                Konfirmasi Kata Sandi
              </label>
              <div class="relative">
                <input
                  :type="showConfirm ? 'text' : 'password'"
                  v-model="passwordForm.new_password_confirmation"
                  placeholder="Konfirmasi Kata Sandi"
                  class="w-full px-4 py-3 rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/50 text-[#8C352D] focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                />
                <button
                  @click.prevent="showConfirm = !showConfirm"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C352D]/40"
                >
                  <component
                    :is="showConfirm ? EyeOffIcon : EyeIcon"
                    :size="20"
                  />
                </button>
              </div>
            </div>

            <ul
              class="text-[10px] md:text-xs text-[#8C352D]/60 italic space-y-1 list-disc pl-4 mt-2"
            >
              <li>Minimal 8 karakter diperlukan untuk password anda</li>
              <li>Gunakan minimal satu huruf kapital</li>
              <li>Harus ada paling sedikit satu angka dalam password</li>
              <li>Sertakan minimal satu karakter khusus</li>
            </ul>
          </div>

          <div class="md:col-span-2 pt-8">
            <button
              type="submit"
              class="px-10 py-4 bg-[#8C352D] text-white font-bold rounded-2xl hover:bg-[#a24a42] transition-colors shadow-lg shadow-[#8C352D]/20 active:scale-95"
            >
              Perbarui Profil
            </button>
            <p v-if="errorMessage" class="text-red-600 text-sm mt-4">
              {{ errorMessage }}
            </p>
          </div>
        </form>
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
      <template #title>
        Data Berhasil
        <br />
        Diperbarui!
      </template>
      <template #actions>
        <button
          @click="isSuccessAlertOpen = false"
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all"
        >
          OK
        </button>
      </template>
    </AlertLayout>

    <AlertLayout v-if="isErrorAlertOpen">
      <template #icon>
        <div
          class="w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center"
        >
          <TriangleAlertIcon :size="40" class="text-[#8C352D] stroke-[4]" />
        </div>
      </template>
      <template #title>
        Kata Sandi Lama
        <br />
        Tidak Valid!
      </template>
      <template #actions>
        <button
          @click="isErrorAlertOpen = false"
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all"
        >
          OK
        </button>
      </template>
    </AlertLayout>

    <AlertLayout v-if="isMismatchAlertOpen">
      <template #icon>
        <div
          class="w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center"
        >
          <TriangleAlertIcon :size="40" class="text-[#8C352D] stroke-[4]" />
        </div>
      </template>
      <template #title>
        Konfirmasi Kata Sandi
        <br />
        Tidak Cocok!
      </template>
      <template #actions>
        <button
          @click="isMismatchAlertOpen = false"
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all"
        >
          OK
        </button>
      </template>
    </AlertLayout>

    <AlertLayout v-if="isLengthAlertOpen">
      <template #icon>
        <div
          class="w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center"
        >
          <TriangleAlertIcon :size="40" class="text-[#8C352D] stroke-[4]" />
        </div>
      </template>
      <template #title>
        Kata Sandi Minimal
        <br />
        8 Karakter!
      </template>
      <template #actions>
        <button
          @click="isLengthAlertOpen = false"
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all"
        >
          OK
        </button>
      </template>
    </AlertLayout>

    <AlertLayout v-if="isMissingFieldsAlertOpen">
      <template #icon>
        <div
          class="w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center"
        >
          <TriangleAlertIcon :size="40" class="text-[#8C352D] stroke-[4]" />
        </div>
      </template>
      <template #title>
        Lengkapi Semua Field
        <br />
        Kata Sandi!
      </template>
      <template #actions>
        <button
          @click="isMissingFieldsAlertOpen = false"
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all"
        >
          OK
        </button>
      </template>
    </AlertLayout>

    <AlertLayout v-if="isSamePasswordAlertOpen">
      <template #icon>
        <div
          class="w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center"
        >
          <TriangleAlertIcon :size="40" class="text-[#8C352D] stroke-[4]" />
        </div>
      </template>
      <template #title>
        Kata Sandi Baru Tidak Boleh
        <br />
        Sama Dengan Yang Lama!
      </template>
      <template #actions>
        <button
          @click="isSamePasswordAlertOpen = false"
          class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all"
        >
          OK
        </button>
      </template>
    </AlertLayout>
  </SidebarLayout>
</template>

<script setup lang="ts">
import {
  changePassword,
  updateCurrentUser,
  uploadProfilePhoto,
} from "@/api/users.api";
import { useAuth } from "@/composables/useAuth";
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebar.vue";
import {
  Camera as CameraIcon,
  Check as CheckIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  TriangleAlert as TriangleAlertIcon,
} from "lucide-vue-next";
import { computed, reactive, ref, watch } from "vue";

const { user: userState } = useAuth();
const user = computed(() => userState.value);

const form = reactive({
  email: "",
  name: "",
  phone_no: "",
});

const passwordForm = reactive({
  old_password: "",
  new_password: "",
  new_password_confirmation: "",
});

const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const isSuccessAlertOpen = ref(false);
const isErrorAlertOpen = ref(false);
const isMismatchAlertOpen = ref(false);
const isLengthAlertOpen = ref(false);
const isMissingFieldsAlertOpen = ref(false);
const isSamePasswordAlertOpen = ref(false); // New state for same password

const errorMessage = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

watch(
  user,
  (value) => {
    form.email = value?.email || "";
    form.name = value?.name || "";
    form.phone_no = value?.phone_no || "";
  },
  { immediate: true },
);

const updateProfile = async () => {
  errorMessage.value = "";

  try {
    const profilePayload = {
      email: form.email,
      name: form.name,
      phone_no: form.phone_no,
    };
    await updateCurrentUser(profilePayload);

    if (userState.value) {
      userState.value = { ...userState.value, ...profilePayload };
      localStorage.setItem("user", JSON.stringify(userState.value));
    }

    const hasAnyPasswordInput =
      passwordForm.old_password ||
      passwordForm.new_password ||
      passwordForm.new_password_confirmation;

    if (hasAnyPasswordInput) {
      if (
        !passwordForm.old_password ||
        !passwordForm.new_password ||
        !passwordForm.new_password_confirmation
      ) {
        isMissingFieldsAlertOpen.value = true;
        return;
      }

      // Local check: Old and New password must be different
      if (passwordForm.old_password === passwordForm.new_password) {
        isSamePasswordAlertOpen.value = true;
        return;
      }

      if (
        passwordForm.old_password.length < 8 ||
        passwordForm.new_password.length < 8
      ) {
        isLengthAlertOpen.value = true;
        return;
      }

      if (
        passwordForm.new_password !== passwordForm.new_password_confirmation
      ) {
        isMismatchAlertOpen.value = true;
        return;
      }

      await changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation,
      });

      Object.assign(passwordForm, {
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    }

    isSuccessAlertOpen.value = true;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "";

    if (msg.toLowerCase().includes("at least 8 characters")) {
      isLengthAlertOpen.value = true;
    } else if (msg.toLowerCase().includes("old password")) {
      isErrorAlertOpen.value = true;
    } else if (msg.toLowerCase().includes("same as old")) {
      isSamePasswordAlertOpen.value = true;
    } else {
      errorMessage.value = msg || "Gagal memperbarui profil.";
    }
  }
};

const triggerFilePicker = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  errorMessage.value = "";
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !userState.value?.id) return;

  try {
    const response = await uploadProfilePhoto(userState.value.id, file);
    const updatedUser = response?.data?.data?.user ?? response?.data?.data;

    if (updatedUser && userState.value) {
      userState.value = { ...userState.value, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(userState.value));
    }

    isSuccessAlertOpen.value = true;
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message || "Gagal mengunggah foto profil.";
  } finally {
    if (input) input.value = "";
  }
};
</script>
