<template>
  <SidebarLayout>
    <div
      class="p-6 space-y-6 bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm"
    >
      <div class="flex items-center gap-2 text-[#8C352D] mb-4">
        <CalendarIcon :size="20" />
        <h2 class="font-bold">Absensi Minggu Ini</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div
          class="bg-[#FFF0EE] border border-[#8C352D] p-6 rounded-2xl shadow-sm"
        >
          <p class="text-3xl font-bold text-[#8C352D]">3</p>
          <p class="text-[#8C352D] font-medium">Sakit</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-4 space-y-6">
          <div
            class="bg-white border border-[#8C352D] p-8 rounded-3xl shadow-sm space-y-2"
          >
            <p class="text-[#8C352D] font-bold">
              Selamat Datang, {{ user?.name }}
            </p>
            <p class="text-sm text-[#8C352D]/60">10 Oktober 2025</p>
            <h1 class="text-5xl font-black text-[#8C352D] py-4">08:00 PM</h1>
            <div class="h-10 bg-[#8C352D] rounded-xl w-full"></div>
          </div>

          <div
            class="bg-white border border-[#8C352D] p-6 rounded-3xl shadow-sm"
          >
            <div class="flex justify-between items-center mb-6">
              <p class="text-[#8C352D] font-bold text-sm">
                Presentase Rekapan Absensi
              </p>
              <select
                class="bg-[#8C352D] text-white text-xs px-3 py-1 rounded-lg outline-none"
              >
                <option>Bulan Ini</option>
              </select>
            </div>
            <div class="flex items-center justify-around">
              <div class="relative w-32 h-32">
                <svg
                  viewBox="0 0 32 32"
                  class="w-full h-full transform -rotate-90"
                >
                  <circle
                    r="16"
                    cx="16"
                    cy="16"
                    fill="transparent"
                    stroke="#10F0AD"
                    stroke-width="8"
                    stroke-dasharray="70 100"
                  />
                  <circle
                    r="16"
                    cx="16"
                    cy="16"
                    fill="transparent"
                    stroke="#FFB46D"
                    stroke-width="8"
                    stroke-dasharray="20 100"
                    stroke-dashoffset="-70"
                  />
                  <circle
                    r="16"
                    cx="16"
                    cy="16"
                    fill="transparent"
                    stroke="#FF6B6B"
                    stroke-width="8"
                    stroke-dasharray="10 100"
                    stroke-dashoffset="-90"
                  />
                  <circle r="12" cx="16" cy="16" fill="white" />
                </svg>
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <span class="text-xl font-bold text-[#8C352D]">70%</span>
                </div>
              </div>
              <div class="space-y-2 text-[10px] font-bold text-[#8C352D]">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-[#10F0AD]"></span>
                  Hadir
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-[#FFB46D]"></span>
                  Terlambat
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-[#FF6B6B]"></span>
                  Tidak Absen
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div
            class="bg-white border border-[#8C352D] p-8 rounded-3xl shadow-sm h-full"
          >
            <div class="flex justify-center mb-10">
              <div
                class="flex border border-[#E8D5D2] rounded-xl overflow-hidden"
              >
                <button
                  class="px-6 py-2 text-sm font-bold text-[#8C352D] hover:bg-[#FFF0EE]"
                >
                  Harian
                </button>
                <button
                  class="px-6 py-2 text-sm font-bold text-[#8C352D] border-x border-[#E8D5D2] hover:bg-[#FFF0EE]"
                >
                  Mingguan
                </button>
                <button
                  class="px-6 py-2 text-sm font-bold bg-[#8C352D] text-white"
                >
                  Bulanan
                </button>
              </div>
            </div>

            <div
              class="flex items-end justify-between h-64 px-4 border-b border-[#E8D5D2] pb-2 relative"
            >
              <div
                v-for="(val, month) in chartData"
                :key="month"
                class="flex flex-col items-center gap-2 w-full"
              >
                <span class="text-[10px] font-bold text-[#8C352D]">
                  {{ val }}%
                </span>
                <div
                  class="w-10 rounded-t-xl transition-all duration-500"
                  :class="
                    val === 100
                      ? 'bg-[#10F0AD]'
                      : val >= 60
                        ? 'bg-[#FFB46D]'
                        : 'bg-[#FF6B6B]'
                  "
                  :style="{ height: `${val}%` }"
                ></div>
                <span class="text-xs font-bold text-[#8C352D] mt-2">
                  {{ month }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import SidebarLayout from "@/layout/sidebarpublic.vue";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { computed } from "vue";
// Auth Logic
const { user: userState } = useAuth();
const user = computed(() => userState.value);

// Router Logic

const chartData = {
  Sep: 50,
  Oct: 80,
  Nov: 60,
  Dec: 40,
  Jan: 100,
};
</script>

<style scoped>
/* Custom animations or specific tweaks if needed */
</style>
