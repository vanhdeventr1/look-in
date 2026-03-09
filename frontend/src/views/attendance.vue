<template>
  <div
    class="min-h-screen bg-[#f6ebe8] flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-[#8b3a32]/20 overflow-x-hidden"
  >
    <div
      class="mb-6 lg:absolute lg:top-8 lg:left-8 lg:mb-0 text-[#8b3a32] font-bold tracking-[0.3em] text-xl lg:text-2xl text-center w-full lg:w-auto transition-all"
    >
      LOOK-IN
    </div>

    <div class="relative w-full flex justify-center">
      <Transition name="slide-fade" mode="out-in">
        <div
          v-if="!showDetail"
          key="camera"
          class="w-full max-w-[22rem] sm:max-w-md bg-white rounded-2xl overflow-hidden border border-[#B5473C]"
        >
          <div
            class="bg-[#8b3a32] px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between relative overflow-hidden"
          >
            <div
              class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"
            ></div>
            <div class="relative z-10">
              <h3
                class="text-white font-bold text-base sm:text-lg tracking-tight"
              >
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
              class="relative z-10 w-10 h-10 flex items-center justify-center"
            >
              <XIcon :size="20" class="text-white" />
            </button>
          </div>

          <div class="p-5 sm:p-8 bg-white">
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
                class="text-[10px] sm:text-[11px] font-bold text-[#8b3a32]/70 bg-white px-3 py-1 rounded-lg border border-gray-50 shadow-sm"
              >
                {{ currentDate }}
              </span>
            </div>

            <div
              class="border-2 border-dashed border-[#E8D5D2] bg-[#FFF0EE]/50 rounded-[1.5rem] p-2 sm:p-3 relative aspect-[3/4] w-full overflow-hidden"
            >
              <div
                class="relative w-full h-full rounded-[1rem] overflow-hidden bg-gray-900 shadow-inner"
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
                  <div class="absolute inset-4">
                    <div
                      class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#8b3a32] rounded-tl-lg"
                    ></div>
                    <div
                      class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#8b3a32] rounded-tr-lg"
                    ></div>
                    <div
                      class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#8b3a32] rounded-bl-lg"
                    ></div>
                    <div
                      class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#8b3a32] rounded-br-lg"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-5 flex flex-col items-center gap-1">
              <div
                class="flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-200"
              >
                <GlobeIcon :size="12" class="text-[#8b3a32]" />
                <span
                  class="text-[10px] font-bold text-gray-500 uppercase tracking-tight"
                >
                  Location IP:
                </span>
                <span class="text-[10px] font-mono font-bold text-[#8b3a32]">
                  {{ userIp || "Fetching..." }}
                </span>
              </div>
            </div>

            <div class="mt-6 flex flex-col items-center">
              <button
                @click="takeAbsence"
                :disabled="isLocating"
                class="w-full px-12 py-4 bg-[#8C352D] text-white rounded-lg text-sm font-semibold transition-all hover:bg-[#742f28] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 cursor-pointer"
              >
                <component
                  :is="isLocating ? 'Loader2Icon' : 'CameraIcon'"
                  :size="18"
                  :class="{ 'animate-spin': isLocating }"
                />
                <span>
                  {{
                    isLocating ? "Securing Location..." : "Confirm Attendance"
                  }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          key="detail"
          class="w-full max-w-[860px] bg-white rounded-xl overflow-hidden border border-[#B5473C]"
        >
          <div class="bg-[#8b3a32] px-7 py-4 flex justify-between items-center">
            <h3 class="text-white font-bold tracking-tight text-[17px]">
              Detail Absensi
            </h3>
            <button
              @click="goToLogin"
              class="text-white/90 hover:text-white transition-all cursor-pointer"
            >
              <XIcon :size="24" />
            </button>
          </div>

          <div class="p-8 sm:p-11 relative bg-white">
            <div
              class="absolute top-6 right-10 text-[11px] font-bold text-[#8b3a32] tracking-wide"
            >
              {{ attendanceData.dateLabel }}
            </div>
            <div class="flex flex-col md:flex-row gap-11 mt-4">
              <div
                class="w-full md:w-[340px] relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm"
              >
                <img
                  :src="attendanceData.photo"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute top-5 left-5 w-11 h-11 border-t-[7px] border-l-[7px] border-[#8b3a32]"
                ></div>
                <div
                  class="absolute bottom-5 right-5 w-11 h-11 border-b-[7px] border-r-[7px] border-[#8b3a32]"
                ></div>
              </div>
              <div class="flex-1">
                <div
                  class="w-full h-[220px] rounded-2xl overflow-hidden relative mb-10 border border-[#B5473C] bg-gray-100 shadow-sm"
                >
                  <iframe
                    v-if="attendanceData.lat && attendanceData.lng"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    style="border: 0"
                    :src="`https://maps.google.com/maps?q=${attendanceData.lat},${attendanceData.lng}&hl=id&z=15&output=embed`"
                    allowfullscreen
                  ></iframe>
                  <div
                    v-else
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <MapPinIcon
                      :size="32"
                      class="text-[#8b3a32] animate-bounce"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-[160px_1fr] gap-y-3.5 text-[15px]">
                  <span class="font-bold text-[#8b3a32]">Nama Lengkap</span>
                  <span class="text-gray-900">: {{ attendanceData.name }}</span>

                  <span class="font-bold text-[#8b3a32]">Jam Masuk</span>
                  <span class="text-gray-900">: {{ attendanceData.time }}</span>

                  <span class="font-bold text-[#8b3a32]">Terlambat</span>
                  <span class="text-gray-900">
                    : {{ attendanceData.isLate ? "Ya" : "Tidak" }}
                  </span>

                  <span class="font-bold text-[#8b3a32]">Durasi Terlambat</span>
                  <span class="text-gray-900">
                    : {{ attendanceData.lateDuration }} Menit
                  </span>

                  <span class="font-bold text-[#8b3a32]">Latitude</span>
                  <span class="text-gray-900 font-mono">
                    : {{ attendanceData.lat }}
                  </span>

                  <span class="font-bold text-[#8b3a32]">Longtitude</span>
                  <span class="text-gray-900 font-mono">
                    : {{ attendanceData.lng }}
                  </span>

                  <span class="font-bold text-[#8b3a32]">Location IP</span>
                  <span class="text-gray-900 font-mono">: {{ userIp }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div
      v-if="alert.visible"
      class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]"
    >
      <div
        class="bg-white w-full max-w-sm rounded-3xl p-8 border border-[#E8D5D2] flex flex-col items-center text-center animate-in shadow-2xl"
      >
        <div class="mb-6">
          <div
            v-if="alert.type === 'processing'"
            class="w-20 h-20 flex items-center justify-center"
          >
            <Loader2Icon :size="60" class="text-[#8b3a32] animate-spin" />
          </div>
          <div
            v-if="alert.type === 'success'"
            class="w-16 h-16 bg-white border-4 border-[#8C352D] rounded-full flex items-center justify-center"
          >
            <CheckIcon :size="32" class="text-[#8C352D]" />
          </div>
          <div
            v-if="alert.type === 'error' || alert.type === 'no-face'"
            class="w-16 h-16 bg-white border-4 border-[#8C352D] rounded-full flex items-center justify-center"
          >
            <TriangleAlertIcon :size="32" class="text-[#8C352D]" />
          </div>
        </div>

        <h3 class="text-[#8C352D] text-lg font-bold mb-4 leading-tight px-4">
          <span v-if="alert.type === 'processing'">
            Sedang memproses verifikasi wajah...
          </span>
          <span v-if="alert.type === 'success'">
            Wajah terdeteksi, absensi berhasil ditambahkan
          </span>
          <span v-if="alert.type === 'error'">
            Wajah tidak dikenali, absen gagal ditambahkan
          </span>
          <span v-if="alert.type === 'no-face'">
            Wajah tidak terdeteksi, pastikan wajah terlihat jelas di kamera
          </span>
        </h3>

        <div
          v-if="alert.type === 'error' || alert.type === 'no-face'"
          class="flex gap-4 w-full justify-center mt-4"
        >
          <button
            @click="alert.visible = false"
            class="flex-1 py-3 bg-[#8C352D] text-white rounded-xl text-sm font-bold active:scale-95 transition-all"
          >
            Ambil Ulang
          </button>
          <button
            @click="alert.visible = false"
            class="flex-1 py-3 bg-[#F6EBE8] text-[#8C352D] rounded-xl text-sm font-bold border border-[#E8D5D2] active:scale-95 transition-all"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Check as CheckIcon,
  Globe as GlobeIcon,
  Loader2 as Loader2Icon,
  MapPin as MapPinIcon,
  TriangleAlert as TriangleAlertIcon,
  X as XIcon,
} from "lucide-vue-next";
import moment from "moment";
import "moment/dist/locale/id";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

moment.locale("id");
const router = useRouter();

const videoElement = ref<HTMLVideoElement | null>(null);
const streamTrack = ref<MediaStream | null>(null);
const isStreaming = ref(false);
const showDetail = ref(false);
const isLocating = ref(false);
const currentDate = ref("");
const userIp = ref("");
let timerInterval: any = null;

const alert = reactive({
  visible: false,
  type: "processing" as "processing" | "success" | "error" | "no-face",
});

const attendanceData = reactive({
  name: "Ryan Ross",
  photo: "",
  time: "",
  isLate: false,
  lateDuration: 0,
  lat: "",
  lng: "",
  dateLabel: "",
});

const updateTime = () => {
  currentDate.value = moment().format("dddd, D MMMM YYYY HH:mm:ss");
};

const fetchIp = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    userIp.value = data.ip;
  } catch (err) {
    userIp.value = "127.0.0.1";
  }
};

const goToLogin = () => {
  router.push("/login");
};

const startWebcam = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
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
  isLocating.value = true;

  const canvas = document.createElement("canvas");
  if (videoElement.value) {
    canvas.width = videoElement.value.videoWidth;
    canvas.height = videoElement.value.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoElement.value, 0, 0);
      attendanceData.photo = canvas.toDataURL("image/png");
    }
  }

  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        attendanceData.lat = position.coords.latitude.toString();
        attendanceData.lng = position.coords.longitude.toString();
        triggerVerification();
      },
      (error) => {
        attendanceData.lat = "-6.200000";
        attendanceData.lng = "106.816666";
        triggerVerification();
      },
      geoOptions,
    );
  } else {
    triggerVerification();
  }
};

const triggerVerification = () => {
  isLocating.value = false;
  alert.type = "processing";
  alert.visible = true;

  setTimeout(() => {
    // --- TESTING: Change this value to 'no-face' to test the specific alert ---
    alert.type = "success";

    if (alert.type === "success") {
      setTimeout(() => {
        finalizeAbsence();
      }, 1500);
    }
  }, 2000);
};

const finalizeAbsence = () => {
  attendanceData.time = moment().format("h:mm A");
  attendanceData.dateLabel = moment().format("dddd, D MMMM YYYY");
  alert.visible = false;
  showDetail.value = true;
};

onMounted(() => {
  startWebcam();
  fetchIp();
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
.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.7, 0, 0.84, 0);
}
.slide-fade-enter-from {
  transform: translateX(50px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}

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
