<template>
  <SidebarLayout>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white border border-[#E8D5D2] rounded-2xl p-6 shadow-sm"
      >
        <p class="text-4xl font-bold text-[#8C352D]">{{ stat.value }}</p>
        <p class="text-[#8C352D] font-semibold mt-2">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-5 space-y-8">
        <div class="bg-white border border-[#E8D5D2] rounded-2xl p-6 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h4 class="text-[#8C352D] font-bold">Presentase Rekapan Absensi</h4>
            <select
              class="bg-[#8C352D] text-white text-xs rounded-lg px-3 py-1 outline-none"
            >
              <option>Bulan Ini</option>
              <option>Bulan Ini</option>
            </select>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-1/2 relative h-40">
              <div
                class="w-full h-full rounded-full border-[16px] border-[#00E396] border-l-[#FEB019] border-b-[#FF4560] flex items-center justify-center"
              >
                <span class="text-2xl font-bold text-[#8C352D]">70%</span>
              </div>
            </div>
            <div class="space-y-2">
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

        <div class="bg-white border border-[#E8D5D2] rounded-2xl p-6 shadow-sm">
          <h4 class="text-[#8C352D] font-bold mb-6">MVP Absensi Bulan Ini</h4>
          <div class="space-y-4">
            <div
              v-for="(mvp, index) in mvpList"
              :key="mvp.name"
              class="flex items-center gap-4"
            >
              <span class="text-xs font-bold text-[#8C352D] w-4">{{
                index + 1
              }}</span>
              <div class="flex-1">
                <div class="flex justify-between mb-1">
                  <span class="text-xs font-bold text-[#8C352D]">{{
                    mvp.name
                  }}</span>
                  <span class="text-xs font-bold text-[#8C352D]"
                    >{{ mvp.percent }}%</span
                  >
                </div>
                <div class="w-full bg-[#E8D5D2]/50 rounded-full h-2">
                  <div
                    class="bg-[#00E396] h-2 rounded-full"
                    :style="`width: ${mvp.percent}%`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7">
        <div
          class="bg-white border border-[#E8D5D2] rounded-2xl p-6 shadow-sm h-full"
        >
          <div
            class="flex border border-[#8C352D] rounded-xl overflow-hidden mb-8 w-fit mx-auto lg:mx-0"
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

          <div class="h-[400px] flex items-end justify-between gap-2 px-4">
            <div
              v-for="bar in barData"
              :key="bar.month"
              class="flex-1 flex flex-col items-center gap-2"
            >
              <span class="text-[10px] font-bold text-[#8C352D]"
                >{{ bar.value }}%</span
              >
              <div
                :class="['w-full rounded-lg transition-all', bar.color]"
                :style="`height: ${bar.value * 3}px`"
              ></div>
              <span class="text-[10px] font-bold text-[#8C352D]">{{
                bar.month
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import SidebarLayout from "@/layout/sidebar.vue";

const stats = [
  { label: "Absen Hari Ini", value: 24 },
  { label: "Terlambat", value: 12 },
  { label: "Sakit", value: 3 },
];

const chartLabels = [
  { text: "Hadir", color: "bg-[#00E396]" },
  { text: "Terlambat", color: "bg-[#FEB019]" },
  { text: "Tidak Absen", color: "bg-[#FF4560]" },
];

const mvpList = [
  { name: "Johnny Marr", percent: 100 },
  { name: "Chappell Roan", percent: 90 },
  { name: "Thom Yorke", percent: 70 },
  { name: "Julian Casablancas", percent: 50 },
  { name: "Ethel Cain", percent: 50 },
];

const barData = [
  { month: "Sep", value: 50, color: "bg-[#FEB019]" },
  { month: "Oct", value: 80, color: "bg-[#00E396]" },
  { month: "Nov", value: 60, color: "bg-[#FEB019]" },
  { month: "Dec", value: 40, color: "bg-[#FF4560]" },
  { month: "Jan", value: 100, color: "bg-[#00E396]" },
];
</script>
