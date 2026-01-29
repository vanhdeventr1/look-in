<template>
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]"
  >
    <div
      class="bg-white w-full max-w-sm rounded-3xl p-8 border border-[#E8D5D2] flex flex-col items-center text-center animate-in"
    >
      <div class="mb-6">
        <slot name="icon"></slot>
      </div>

      <h3 class="text-[#8C352D] text-xl font-bold mb-8 leading-tight">
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
