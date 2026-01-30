<template>
  <SidebarLayout>
    <div
      class="p-6 space-y-6 bg-white border border-[#8C352D] rounded-2xl p-6 shadow-sm"
    >
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
  </SidebarLayout>
</template>

<script setup lang="ts">
import SidebarLayout from "@/layout/sidebarpublic.vue";
</script>
