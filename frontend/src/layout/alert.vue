<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "default" | "error";
  }>(),
  {
    variant: "default",
  },
);

const cardClass = computed(() =>
  props.variant === "error"
    ? "bg-white w-full max-w-sm rounded-[28px] px-8 py-10 border border-[#E8D5D2] shadow-2xl shadow-[#8C352D]/10 flex flex-col items-center text-center animate-in"
    : "bg-white w-full max-w-sm rounded-3xl p-8 border border-[#E8D5D2] flex flex-col items-center text-center animate-in",
);

const titleClass = computed(() =>
  props.variant === "error"
    ? "text-[#8C352D] text-xl font-medium mb-8 leading-tight"
    : "text-[#8C352D] text-xl font-medium mb-8 leading-tight",
);
</script>

<template>
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]"
  >
    <div :class="cardClass">
      <div class="mb-6">
        <slot name="icon"></slot>
      </div>

      <h3 :class="titleClass">
        <slot name="title"></slot>
      </h3>

      <div class="flex gap-4 w-full justify-center">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

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
