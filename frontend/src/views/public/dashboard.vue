<template>
  <SidebarLayout>
    <div class="flex flex-col gap-y-6 animate-in">
      <!-- TOP STATS -->
      <div class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm">
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
      </div>

      <div class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm">
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
              class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm"
            >
              <div class="flex justify-between items-center mb-6">
                <h4 class="text-[#8C352D] font-bold">
                  Presentase Rekapan Absensi
                </h4>
                <select
                  class="bg-[#8C352D] text-white text-xs rounded-lg px-3 py-1 outline-none"
                >
                  <option>Bulan Ini</option>
                  <option>Bulan Ini</option>
                </select>
              </div>

              <div class="flex items-center gap-6">
                <div class="w-1/2 relative h-40">
                  <div
                    class="w-full h-full rounded-full border-[16px] border-[#00E396] border-l-[#FEB019] border-b-[#FF4560] flex items-center justify-center"
                  >
                    <span class="text-2xl font-bold text-[#8C352D]">70%</span>
                  </div>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="l in chartLabels"
                    :key="l.text"
                    class="flex items-center gap-2 text-xs font-semibold text-[#8C352D]"
                  >
                    <div :class="`w-3 h-3 rounded-full ${l.color}`"></div>
                    {{ l.text }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-8">
            <div
              class="bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm h-full"
            >
              <div
                class="flex border border-[#8C352D] rounded-xl overflow-hidden mb-10 w-fit mx-auto lg:mx-0"
              >
                <button
                  v-for="tab in ['Harian', 'Mingguan', 'Bulanan']"
                  :key="tab"
                  :class="[
                    'px-6 py-2 text-sm font-bold transition-colors',
                    tab === 'Bulanan'
                      ? 'bg-[#8C352D] text-white'
                      : 'text-[#8C352D] hover:bg-[#8C352D]/5',
                  ]"
                >
                  {{ tab }}
                </button>
              </div>

              <div class="h-[400px] flex items-end justify-between gap-3 px-4">
                <div
                  v-for="bar in barData"
                  :key="bar.month"
                  class="flex-1 flex flex-col items-center gap-2"
                >
                  <span class="text-[10px] font-bold text-[#8C352D]">
                    {{ bar.value }}%
                  </span>

                  <div
                    :class="['w-full rounded-lg transition-all', bar.color]"
                    :style="`height: ${bar.value * 3}px`"
                  ></div>

                  <span class="text-[10px] font-bold text-[#8C352D]">
                    {{ bar.month }}
                  </span>
                </div>
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
import { computed } from "vue";

const { user: userState } = useAuth();
const user = computed(() => userState.value);

const chartLabels = [
  { text: "Hadir", color: "bg-[#00E396]" },
  { text: "Terlambat", color: "bg-[#FEB019]" },
  { text: "Tidak Absen", color: "bg-[#FF4560]" },
];

const barData = [
  { month: "Sep", value: 50, color: "bg-[#FEB019]" },
  { month: "Oct", value: 80, color: "bg-[#00E396]" },
  { month: "Nov", value: 60, color: "bg-[#FEB019]" },
  { month: "Dec", value: 40, color: "bg-[#FF4560]" },
  { month: "Jan", value: 100, color: "bg-[#00E396]" },
];
</script>
<style>
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
