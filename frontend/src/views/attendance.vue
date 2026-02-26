<template>
  <div
    class="min-h-screen bg-[#f6ebe8] flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-[#8b3a32]/20"
  >
    <div
      class="mb-6 lg:absolute lg:top-8 lg:left-8 lg:mb-0 text-[#8b3a32] font-bold tracking-[0.3em] text-xl lg:text-2xl text-center w-full lg:w-auto transition-all"
    >
      LOOK-IN
    </div>

    <div
      class="w-full max-w-[22rem] sm:max-w-md bg-white rounded-2xl overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(139,58,50,0.15)]"
    >
      <div
        class="bg-[#8b3a32] px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between relative overflow-hidden"
      >
        <div
          class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"
        ></div>

        <div class="relative z-10">
          <h3 class="text-white font-bold text-base sm:text-lg tracking-tight">
            Ambil Absensi
          </h3>
          <p
            class="text-white/60 text-[9px] sm:text-[10px] uppercase tracking-widest font-medium"
          >
            Verifikasi Identitas
          </p>
        </div>

        <button
          @click="$router.back()"
          class="relative z-10 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors group"
        >
          <XIcon
            :size="20"
            class="text-white transition-transform group-hover:rotate-90"
          />
        </button>
      </div>

      <div
        class="p-5 sm:p-8 relative bg-[radial-gradient(#e6bdb7_1.2px,transparent_1.2px)] [background-size:24px_24px]"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6"
        >
          <div
            class="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100"
          >
            <div
              class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
            ></div>
            <span
              class="text-[9px] sm:text-[10px] font-bold text-green-700 uppercase"
            >
              System Ready
            </span>
          </div>
          <span
            class="text-[10px] sm:text-[11px] font-bold text-[#8b3a32]/70 bg-white px-3 py-1 rounded-lg border border-gray-50 shadow-sm whitespace-nowrap"
          >
            {{ currentDate }}
          </span>
        </div>

        <div
          class="border-2 border-dashed border-[#E8D5D2] bg-[#FFF0EE]/50 rounded-[1.5rem] sm:rounded-[2rem] p-2 sm:p-3 relative aspect-[3/4] w-full overflow-hidden group transition-all hover:bg-[#FFF0EE]"
        >
          <div
            class="relative w-full h-full rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-gray-900 shadow-inner"
          >
            <video
              ref="videoElement"
              autoplay
              playsinline
              class="w-full h-full object-cover unmirror"
            ></video>

            <div
              v-if="isStreaming"
              class="absolute inset-0 z-20 pointer-events-none"
            >
              <div
                class="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#8b3a32] to-transparent animate-scan"
              ></div>

              <div
                class="absolute inset-0 flex items-center justify-center opacity-30"
              >
                <svg
                  width="140"
                  height="200"
                  viewBox="0 0 200 260"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="sm:w-[160px] sm:h-[220px]"
                >
                  <path
                    d="M100 40C70 40 45 65 45 100C45 135 65 170 100 170C135 170 155 135 155 100C155 65 130 40 100 40Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-dasharray="8 8"
                  />
                  <path
                    d="M50 200C50 180 70 175 100 175C130 175 150 180 150 200V230H50V200Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-dasharray="8 8"
                  />
                </svg>
              </div>

              <div class="absolute inset-3 sm:inset-4">
                <div
                  class="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] border-l-[3px] sm:border-t-4 sm:border-l-4 border-[#8b3a32] rounded-tl-lg"
                ></div>
                <div
                  class="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] border-r-[3px] sm:border-t-4 sm:border-r-4 border-[#8b3a32] rounded-tr-lg"
                ></div>
                <div
                  class="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] border-l-[3px] sm:border-b-4 sm:border-l-4 border-[#8b3a32] rounded-bl-lg"
                ></div>
                <div
                  class="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] border-r-[3px] sm:border-b-4 sm:border-r-4 border-[#8b3a32] rounded-br-lg"
                ></div>
              </div>
            </div>

            <div
              v-if="!isStreaming"
              class="absolute inset-0 flex items-center justify-center bg-gray-50/10 backdrop-blur-xl"
            >
              <div class="flex flex-col items-center gap-4">
                <div class="relative w-10 h-10 sm:w-12 sm:h-12">
                  <div
                    class="absolute inset-0 border-4 border-[#8b3a32]/20 rounded-full"
                  ></div>
                  <div
                    class="absolute inset-0 border-4 border-[#8b3a32] border-t-transparent rounded-full animate-spin"
                  ></div>
                </div>
                <p
                  class="text-[#8b3a32] font-black text-[9px] uppercase tracking-[0.2em] animate-pulse"
                >
                  Initialising Camera
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-col items-center gap-2">
          <div
            v-if="location.loading"
            class="flex items-center gap-2 text-[#8b3a32]/50 text-[9px] font-bold uppercase tracking-widest"
          >
            <div
              class="w-2 h-2 border-2 border-[#8b3a32] border-t-transparent rounded-full animate-spin"
            ></div>
            Acquiring GPS Signal...
          </div>

          <div
            v-else-if="location.latitude"
            class="flex items-center gap-2 px-4 py-1.5 bg-[#8b3a32]/5 rounded-full border border-[#8b3a32]/10"
          >
            <MapPinIcon :size="12" class="text-[#8b3a32]" />
            <span
              class="text-[9px] sm:text-[10px] font-mono font-bold text-[#8b3a32]"
            >
              {{ location.latitude.toFixed(6) }},
              {{ location.longitude.toFixed(6) }}
            </span>
          </div>

          <div
            v-else-if="location.error"
            class="text-red-500 text-[9px] font-bold uppercase tracking-tight"
          >
            ⚠️ {{ location.error }}
          </div>
        </div>

        <div class="mt-8 flex flex-col items-center gap-4">
          <button
            @click="takeAbsence"
            :disabled="location.loading"
            class="w-full sm:w-auto group relative px-8 sm:px-12 py-3.5 sm:py-4 bg-[#8b3a32] text-white rounded-[1rem] sm:rounded-[1.2rem] text-sm font-bold transition-all hover:bg-[#742f28] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-[#8b3a32]/20"
          >
            <CameraIcon
              :size="18"
              class="transition-transform group-hover:rotate-12"
            />
            <span>Confirm Attendance</span>
          </button>

          <p
            class="text-[9px] sm:text-[10px] text-gray-400 font-medium italic text-center max-w-[200px]"
          >
            Data absensi akan dikirim dengan lokasi terkini
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Camera as CameraIcon,
  MapPin as MapPinIcon,
  X as XIcon,
} from "lucide-vue-next";
import moment from "moment";
import "moment/dist/locale/id";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

moment.locale("id");

const videoElement = ref<HTMLVideoElement | null>(null);
const streamTrack = ref<MediaStream | null>(null);
const isStreaming = ref(false);
const currentDate = ref("");
let timerInterval: any = null;

const location = reactive({
  latitude: null as number | null,
  longitude: null as number | null,
  error: null as string | null,
  loading: true,
});

const updateTime = () => {
  currentDate.value = moment().format("dddd, D MMMM YYYY HH:mm:ss");
};

const getLocation = () => {
  if (!navigator.geolocation) {
    location.error = "GPS Error";
    location.loading = false;
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      location.latitude = pos.coords.latitude;
      location.longitude = pos.coords.longitude;
      location.loading = false;
    },
    () => {
      location.error = "GPS Disabled";
      location.loading = false;
    },
    { enableHighAccuracy: true },
  );
};

const startWebcam = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1024 },
        height: { ideal: 1365 },
      },
    });
    if (videoElement.value) {
      videoElement.value.srcObject = stream;
      streamTrack.value = stream;
      videoElement.value.onloadedmetadata = () => {
        isStreaming.value = true;
      };
    }
  } catch (err) {
    console.error(err);
  }
};

const takeAbsence = () => {
  if (location.loading) return;
  alert(`Absensi Sukses!\n${currentDate.value}`);
};

onMounted(() => {
  startWebcam();
  getLocation();
  updateTime();
  timerInterval = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (streamTrack.value) {
    streamTrack.value.getTracks().forEach((track) => track.stop());
  }
});
</script>

<style scoped>
.unmirror {
  transform: scaleX(-1);
}
@keyframes scan {
  0% {
    top: 0%;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}
.animate-scan {
  animation: scan 3s ease-in-out infinite;
}
</style>
