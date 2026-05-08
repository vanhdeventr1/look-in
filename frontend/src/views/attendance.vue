<template>
  <div
    class="min-h-screen bg-[#F6EBE8] flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-[#8C352D]/20 overflow-x-hidden"
  >
    <div
      class="w-full max-w-5xl mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div class="text-[#8C352D] font-black tracking-[0.28em] text-xl">
        LOOK-IN
      </div>
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8D5D2] text-[#8C352D] text-xs font-bold shadow-sm"
      >
        <ClockIcon :size="15" />
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <div class="relative w-full max-w-5xl flex justify-center">
      <Transition name="slide-fade" mode="out-in">
        <div
          v-if="!showDetail"
          key="camera"
          class="w-full bg-white rounded-2xl overflow-hidden border border-[#E8D5D2] shadow-sm"
        >
          <div
            class="bg-[#8C352D] px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between"
          >
            <div>
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
              class="w-10 h-10 flex items-center justify-center rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <XIcon :size="20" />
            </button>
          </div>

          <div
            class="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-6 p-5 sm:p-8 bg-white"
          >
            <div
              class="border border-[#E8D5D2] bg-[#FFF0EE]/50 rounded-2xl p-3 relative aspect-[3/4] w-full overflow-hidden"
            >
              <div
                class="relative w-full h-full rounded-xl overflow-hidden bg-[#2F211F] shadow-inner"
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
                    class="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent animate-scan"
                  ></div>
                  <div class="absolute inset-4">
                    <div
                      class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"
                    ></div>
                    <div
                      class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"
                    ></div>
                    <div
                      class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"
                    ></div>
                    <div
                      class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-between gap-6">
              <div class="space-y-5">
                <div
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100"
                >
                  <span
                    class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
                  ></span>
                  <span class="text-[10px] font-bold text-green-700 uppercase">
                    Sistem Siap
                  </span>
                </div>

                <div>
                  <h4 class="text-[#8C352D] text-2xl font-black leading-tight">
                    Verifikasi wajah dan lokasi
                  </h4>
                  <p class="mt-2 text-sm leading-6 text-[#8C352D]/70">
                    Pastikan wajah terlihat jelas dan izin lokasi browser aktif
                    sebelum mengirim absensi.
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    class="rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/40 px-4 py-3"
                  >
                    <div class="flex items-center gap-2 text-[#8C352D]">
                      <ShieldCheckIcon :size="16" />
                      <span class="text-xs font-bold uppercase">Kamera</span>
                    </div>
                    <p class="mt-1 text-sm font-semibold text-[#8C352D]/80">
                      {{ isStreaming ? "Aktif" : "Memuat..." }}
                    </p>
                  </div>

                  <div
                    class="rounded-xl border border-[#E8D5D2] bg-[#FFF0EE]/40 px-4 py-3"
                  >
                    <div class="flex items-center gap-2 text-[#8C352D]">
                      <GlobeIcon :size="16" />
                      <span class="text-xs font-bold uppercase">
                        Location IP
                      </span>
                    </div>
                    <p
                      class="mt-1 text-sm font-mono font-semibold text-[#8C352D]/80"
                    >
                      {{ userIp || "Fetching..." }}
                    </p>
                  </div>
                </div>
              </div>

              <button
                @click="takeAbsence"
                :disabled="isLocating"
                class="w-full px-6 py-4 bg-[#8C352D] text-white rounded-xl text-sm font-bold transition-all hover:bg-[#742f28] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer shadow-sm"
              >
                <Loader2Icon
                  v-if="isLocating"
                  :size="18"
                  class="animate-spin"
                />
                <CameraIcon v-else :size="18" />
                <span>
                  {{ isLocating ? "Mengamankan Lokasi..." : "Kirim Absensi" }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          key="detail"
          class="w-full bg-white rounded-2xl overflow-hidden border border-[#E8D5D2] shadow-sm"
        >
          <div class="bg-[#8C352D] px-7 py-4 flex justify-between items-center">
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
              class="mb-5 sm:absolute sm:top-6 sm:right-10 text-[11px] font-bold text-[#8C352D] tracking-wide"
            >
              {{ attendanceData.dateLabel }}
            </div>
            <div class="flex flex-col md:flex-row gap-11 mt-4">
              <div
                class="w-full md:w-[340px] relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#E8D5D2] bg-[#FFF0EE]/40 shadow-sm"
              >
                <img
                  :src="attendanceData.photo"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute top-5 left-5 w-11 h-11 border-t-[7px] border-l-[7px] border-[#8C352D]"
                ></div>
                <div
                  class="absolute bottom-5 right-5 w-11 h-11 border-b-[7px] border-r-[7px] border-[#8C352D]"
                ></div>
              </div>
              <div class="flex-1">
                <div
                  class="w-full h-[220px] rounded-2xl overflow-hidden relative mb-8 border border-[#E8D5D2] bg-[#FFF0EE]/40 shadow-sm"
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
                      class="text-[#8C352D] animate-bounce"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-[150px_1fr] gap-y-3.5 text-[15px]">
                  <span class="font-bold text-[#8C352D]">Nama Lengkap</span>
                  <span class="text-[#2F211F]">
                    : {{ attendanceData.name }}
                  </span>

                  <span class="font-bold text-[#8C352D]">Jam Masuk</span>
                  <span class="text-[#2F211F]">
                    : {{ attendanceData.time }}
                  </span>

                  <span class="font-bold text-[#8C352D]">Terlambat</span>
                  <span class="text-[#2F211F]">
                    : {{ attendanceData.isLate ? "Ya" : "Tidak" }}
                  </span>

                  <span class="font-bold text-[#8C352D]">Durasi Terlambat</span>
                  <span class="text-[#2F211F]">
                    : {{ attendanceData.lateDuration }} Menit
                  </span>

                  <span class="font-bold text-[#8C352D]">Latitude</span>
                  <span class="text-[#2F211F] font-mono">
                    : {{ attendanceData.lat }}
                  </span>

                  <span class="font-bold text-[#8C352D]">Longitude</span>
                  <span class="text-[#2F211F] font-mono">
                    : {{ attendanceData.lng }}
                  </span>

                  <span class="font-bold text-[#8C352D]">Location IP</span>
                  <span class="text-[#2F211F] font-mono">: {{ userIp }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <AlertLayout
      v-if="
        alert.visible && (alert.type === 'error' || alert.type === 'no-face')
      "
      variant="error"
    >
      <template #icon>
        <TriangleAlertIcon :size="80" class="text-[#8C352D] stroke-[1.5]" />
      </template>
      <template #title>
        <span v-if="alert.type === 'error'">
          {{ alert.message || "Absen gagal ditambahkan" }}
        </span>
        <span v-if="alert.type === 'no-face'">
          Wajah tidak terdeteksi, pastikan wajah terlihat jelas di kamera
        </span>
      </template>
      <template #actions>
        <button
          @click="alert.visible = false"
          class="flex-1 bg-[#8C352D] text-white py-3 rounded-2xl font-bold hover:bg-[#a24a42] cursor-pointer"
        >
          Ambil Ulang
        </button>
        <button
          @click="alert.visible = false"
          class="flex-1 bg-white text-[#8C352D] border border-[#E8D5D2] py-3 rounded-2xl font-bold hover:bg-[#FFF0EE]/50 cursor-pointer"
        >
          Batalkan
        </button>
      </template>
    </AlertLayout>

    <div
      v-if="
        alert.visible &&
        (alert.type === 'processing' || alert.type === 'success')
      "
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
            <Loader2Icon :size="60" class="text-[#8C352D] animate-spin" />
          </div>
          <div
            v-if="alert.type === 'success'"
            class="w-16 h-16 bg-white border-4 border-[#8C352D] rounded-full flex items-center justify-center"
          >
            <CheckIcon :size="32" class="text-[#8C352D]" />
          </div>
        </div>

        <h3 class="text-[#8C352D] text-lg font-bold mb-4 leading-tight px-4">
          <span v-if="alert.type === 'processing'">
            Sedang memproses verifikasi wajah...
          </span>
          <span v-if="alert.type === 'success'">
            Wajah terdeteksi, absensi berhasil ditambahkan
          </span>
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { quickCheckInAttendance } from "@/api/attendance.api";
import AlertLayout from "@/layout/alert.vue";
import {
  Camera as CameraIcon,
  Check as CheckIcon,
  Clock as ClockIcon,
  Globe as GlobeIcon,
  Loader2 as Loader2Icon,
  MapPin as MapPinIcon,
  ShieldCheck as ShieldCheckIcon,
  TriangleAlert as TriangleAlertIcon,
  X as XIcon,
} from "lucide-vue-next";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

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
  message: "",
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

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const formatDateLabel = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatTimeLabel = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const dataUrlToFile = (dataUrl: string, filename: string) => {
  const [header = "", base64 = ""] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
};

const getErrorText = (error: any, fallback: string) => {
  return (
    error?.response?.data?.response ??
    error?.response?.data?.message ??
    error?.message ??
    fallback
  );
};

const updateTime = () => {
  currentDate.value = formatDateTime(new Date());
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
      () => {
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

const triggerVerification = async () => {
  isLocating.value = false;
  alert.type = "processing";
  alert.message = "";
  alert.visible = true;

  try {
    const canvas = document.createElement("canvas");
    if (!videoElement.value) throw new Error("No video");

    canvas.width = videoElement.value.videoWidth;
    canvas.height = videoElement.value.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No canvas context");

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoElement.value, 0, 0);

    const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);
    attendanceData.photo = imageBase64;

    const checkInRes = await quickCheckInAttendance({
      gps_lat: attendanceData.lat,
      gps_lng: attendanceData.lng,
      image: dataUrlToFile(imageBase64, "attendance.jpg"),
    });

    if (checkInRes.data?.statusCode === 201) {
      attendanceData.name =
        checkInRes.data?.data?.recognized_user?.name ?? attendanceData.name;
      attendanceData.isLate = !!checkInRes.data?.data?.attendance?.is_late;
      attendanceData.lateDuration =
        checkInRes.data?.data?.attendance?.late_duration ?? 0;
      alert.type = "success";
      setTimeout(() => finalizeAbsence(), 1500);
    } else {
      alert.type = "error";
      alert.message = "Absen gagal ditambahkan";
    }
  } catch (err) {
    console.error(err);
    alert.type = "error";
    alert.message = getErrorText(err, "Absen gagal ditambahkan");
  }
};

const finalizeAbsence = () => {
  const now = new Date();
  attendanceData.time = formatTimeLabel(now);
  attendanceData.dateLabel = formatDateLabel(now);
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
