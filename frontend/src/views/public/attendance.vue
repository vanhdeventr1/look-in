<template>
  <SidebarLayout></SidebarLayout>
</template>

<script setup lang="ts">
import SidebarLayout from "@/layout/sidebarpublic.vue";
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
