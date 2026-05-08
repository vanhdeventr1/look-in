<template>
  <SidebarLayout>
    <div
      class="bg-white border border-[#E8D5D2] rounded-3xl overflow-hidden shadow-sm animate-in isolate"
    >
      <div class="h-20 bg-[#8C352D] flex items-center px-6 md:px-12">
        <div>
          <h1 class="text-xl font-bold text-white">Pengaturan Absensi</h1>
          <p class="text-xs text-white/70">
            Konfigurasi lokasi kantor, radius, dan jadwal kerja.
          </p>
        </div>
      </div>

      <div class="p-6 md:p-12">
        <form @submit.prevent="handleUpdateSettings">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div class="lg:col-span-2 space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <MapPinIcon class="text-[#8C352D]" :size="20" />
                  <label class="text-[#8C352D] font-bold text-lg">
                    Lokasi & Radius
                  </label>
                </div>
                <button
                  type="button"
                  @click="recenterMap"
                  :disabled="isLocating"
                  class="text-[10px] font-bold uppercase tracking-widest text-[#8C352D] hover:bg-[#8C352D]/5 px-3 py-1.5 rounded-lg border border-[#8C352D]/20 transition-all cursor-pointer"
                >
                  {{ isLocating ? "Mencari Lokasi..." : "Gunakan Lokasi Saya" }}
                </button>
              </div>

              <div
                class="relative w-full h-80 md:h-96 rounded-2xl border-2 border-[#E8D5D2] overflow-hidden bg-gray-100 shadow-inner"
              >
                <div id="map" class="w-full h-full z-0"></div>

                <div
                  class="absolute top-4 left-4 z-[1000] pointer-events-none space-y-2"
                >
                  <div
                    class="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-[#E8D5D2] shadow-xl flex items-center gap-3"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-[#8C352D]/10 flex items-center justify-center"
                    >
                      <NavigationIcon class="text-[#8C352D]" :size="16" />
                    </div>
                    <div>
                      <p
                        class="text-[10px] font-bold text-[#8C352D]/40 uppercase leading-none"
                      >
                        Status Geofence
                      </p>
                      <p class="text-xs font-bold text-[#8C352D]">
                        Zona Aktif: {{ form.radius_meter }} Meter
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000] opacity-20"
                >
                  <div
                    class="w-10 h-10 border border-[#8C352D] rounded-full flex items-center justify-center"
                  >
                    <div class="w-1 h-1 bg-[#8C352D] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFF0EE]/50 p-4 rounded-2xl border border-[#E8D5D2]/50"
              >
                <div class="flex flex-col">
                  <span
                    class="text-[10px] font-bold uppercase tracking-wider text-[#8C352D]/50"
                  >
                    Koordinat Kantor
                  </span>
                  <span class="text-xs font-mono text-[#8C352D]">
                    {{ form.gps_lat.toFixed(6) }}, {{ form.gps_lng.toFixed(6) }}
                  </span>
                </div>

                <div class="flex items-center gap-3">
                  <label
                    class="text-[#8C352D] font-bold text-xs whitespace-nowrap"
                  >
                    Radius Jangkauan:
                  </label>
                  <div class="relative flex items-center">
                    <input
                      type="number"
                      v-model="form.radius_meter"
                      @input="updateCircleRadius"
                      class="w-24 px-3 py-2 pr-8 rounded-xl border border-[#E8D5D2] bg-white text-[#8C352D] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20"
                    />
                    <span
                      class="absolute right-2 text-[10px] font-bold text-[#8C352D]/30"
                    >
                      M
                    </span>
                  </div>
                </div>
              </div>
              <p
                class="text-[11px] text-[#8C352D]/60 italic flex items-center gap-1"
              >
                <InfoIcon :size="12" />
                Geser marker merah untuk menentukan pusat lokasi absensi
                karyawan.
              </p>
            </div>

            <div class="space-y-8">
              <div class="flex items-center gap-2 mb-2">
                <ClockIcon class="text-[#8C352D]" :size="20" />
                <label class="text-[#8C352D] font-bold text-lg">
                  Jam Kerja
                </label>
              </div>

              <div class="space-y-6">
                <div class="group">
                  <label
                    class="text-xs font-bold text-[#8C352D]/60 uppercase mb-2 block ml-1"
                  >
                    Jam Masuk
                  </label>
                  <input
                    type="time"
                    v-model="form.check_in_time"
                    class="w-full px-6 py-4 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/40 text-[#8C352D] text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20 transition-all"
                  />
                </div>

                <div class="relative flex items-center justify-center py-2">
                  <div class="absolute inset-0 flex items-center">
                    <div
                      class="w-full border-t border-[#E8D5D2] border-dashed"
                    ></div>
                  </div>
                  <span
                    class="relative bg-white px-3 text-[10px] font-bold text-[#8C352D]/40"
                  >
                    SAMPAI
                  </span>
                </div>

                <div class="group">
                  <label
                    class="text-xs font-bold text-[#8C352D]/60 uppercase mb-2 block ml-1"
                  >
                    Jam Pulang
                  </label>
                  <input
                    type="time"
                    v-model="form.check_out_time"
                    class="w-full px-6 py-4 rounded-2xl border border-[#E8D5D2] bg-[#FFF0EE]/40 text-[#8C352D] text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-[#8C352D]/20 transition-all"
                  />
                </div>
              </div>

              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="isUpdating"
                  class="group relative w-full overflow-hidden px-10 py-4 bg-[#8C352D] text-white font-bold rounded-2xl hover:bg-[#a24a42] transition-all shadow-lg shadow-[#8C352D]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <div class="relative z-10 flex items-center gap-2">
                    <span
                      v-if="isUpdating"
                      class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    ></span>
                    <span>
                      {{ isUpdating ? "Menyimpan..." : "Perbarui Pengaturan" }}
                    </span>
                  </div>
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"
                  ></div>
                </button>
                <p v-if="errorMessage" class="mt-3 text-sm text-red-600">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <Teleport to="body">
      <AlertLayout v-if="isSuccessAlertOpen">
        <template #icon>
          <div class="relative">
            <div
              class="absolute inset-0 bg-[#8C352D]/10 rounded-full animate-ping"
            ></div>
            <div
              class="relative w-20 h-20 rounded-full border-8 border-[#8C352D] flex items-center justify-center bg-white"
            >
              <CheckIcon :size="40" class="text-[#8C352D] stroke-[4]" />
            </div>
          </div>
        </template>
        <template #title>
          Pengaturan Berhasil
          <br />
          Diperbarui!
        </template>
        <template #actions>
          <button
            @click="isSuccessAlertOpen = false"
            class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all cursor-pointer shadow-md"
          >
            OK
          </button>
        </template>
      </AlertLayout>

      <AlertLayout v-if="isLocationErrorAlertOpen" variant="error">
        <template #icon>
          <AlertTriangleIcon :size="80" class="text-[#8C352D] stroke-[1.5]" />
        </template>
        <template #title>
          Tidak dapat mengakses lokasi.
          <br />
          Pastikan GPS aktif dan izin lokasi diberikan.
        </template>
        <template #actions>
          <button
            @click="isLocationErrorAlertOpen = false"
            class="bg-[#8C352D] text-white px-12 py-2.5 rounded-2xl font-bold hover:bg-[#a24a42] transition-all cursor-pointer shadow-md"
          >
            OK
          </button>
        </template>
      </AlertLayout>
    </Teleport>
  </SidebarLayout>
</template>
<script setup lang="ts">
import {
  createAttendanceSetting,
  getAttendanceSettings,
  updateAttendanceSetting,
} from "@/api/attendance-setting.api";
import AlertLayout from "@/layout/alert.vue";
import SidebarLayout from "@/layout/sidebar.vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle as AlertTriangleIcon,
  Check as CheckIcon,
  Clock as ClockIcon,
  Info as InfoIcon,
  MapPin as MapPinIcon,
  Navigation as NavigationIcon,
} from "lucide-vue-next";
import { onMounted, reactive, ref } from "vue";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const isSuccessAlertOpen = ref(false);
const isLocationErrorAlertOpen = ref(false);
const isUpdating = ref(false);
const isLocating = ref(false);
const errorMessage = ref("");
const attendanceSettingId = ref<number | null>(null);

const form = reactive({
  gps_lat: -6.2,
  gps_lng: 106.816666,
  check_in_time: "08:00",
  check_out_time: "17:00",
  radius_meter: 100,
});

let map: L.Map;
let marker: L.Marker;
let circle: L.Circle;

const GEO_OPTIONS_PRECISE: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 0,
};

const GEO_OPTIONS_FALLBACK: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 60000,
};

const initMap = (lat: number, lng: number) => {
  if (map) return;
  map = L.map("map", { zoomControl: false }).setView([lat, lng], 16);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "(c) OpenStreetMap",
    },
  ).addTo(map);

  marker = L.marker([lat, lng], { draggable: true })
    .addTo(map)
    .bindPopup(
      "<b style='color:#8C352D'>Pusat Lokasi Kantor</b><br>Geser untuk memindahkan.",
    )
    .openPopup();

  circle = L.circle([lat, lng], {
    color: "#8C352D",
    fillColor: "#8C352D",
    fillOpacity: 0.15,
    weight: 2,
    dashArray: "5, 10",
    radius: form.radius_meter,
  }).addTo(map);

  marker.on("drag", (event) => {
    const position = event.target.getLatLng();
    circle.setLatLng(position);
    form.gps_lat = position.lat;
    form.gps_lng = position.lng;
  });
};

const updateCircleRadius = () => {
  if (circle) circle.setRadius(form.radius_meter || 0);
};

const updateMapPosition = (lat: number, lng: number) => {
  form.gps_lat = lat;
  form.gps_lng = lng;

  if (map) {
    const newPos = new L.LatLng(lat, lng);
    marker.setLatLng(newPos);
    circle.setLatLng(newPos);
    map.setView(newPos, 16);
    return;
  }

  initMap(lat, lng);
};

const getCurrentLocation = (options: PositionOptions) => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

const resolveUserLocation = async () => {
  try {
    return await getCurrentLocation(GEO_OPTIONS_PRECISE);
  } catch (error) {
    console.warn("Precise geolocation failed, fallback to standard:", error);
    return await getCurrentLocation(GEO_OPTIONS_FALLBACK);
  }
};

const recenterMap = async () => {
  isLocating.value = true;

  try {
    const position = await resolveUserLocation();
    updateMapPosition(position.coords.latitude, position.coords.longitude);
  } catch (err) {
    console.error("GPS Error:", err);
    isLocationErrorAlertOpen.value = true;
  } finally {
    isLocating.value = false;
  }
};

const mapFormFromApi = (setting: any) => {
  form.gps_lat = Number(setting?.gps_lat) || form.gps_lat;
  form.gps_lng = Number(setting?.gps_lng) || form.gps_lng;
  form.check_in_time = String(setting?.check_in_time || "08:00").slice(0, 5);
  form.check_out_time = String(setting?.check_out_time || "17:00").slice(0, 5);
  form.radius_meter = Number(setting?.radius_meter) || form.radius_meter;
};

const initMapFromGpsOrDefault = async () => {
  try {
    const position = await resolveUserLocation();
    updateMapPosition(position.coords.latitude, position.coords.longitude);
  } catch {
    initMap(form.gps_lat, form.gps_lng);
  }
};

const fetchAttendanceSetting = async () => {
  try {
    const response = await getAttendanceSettings();
    const settings = response?.data?.data ?? [];
    const latestSetting = settings[0];

    if (latestSetting) {
      attendanceSettingId.value = latestSetting.id;
      mapFormFromApi(latestSetting);
      initMap(form.gps_lat, form.gps_lng);
      return;
    }
  } catch (error) {
    console.error("Failed to fetch attendance settings:", error);
  }

  await initMapFromGpsOrDefault();
};

const handleUpdateSettings = async () => {
  isUpdating.value = true;
  errorMessage.value = "";

  try {
    const payload = {
      gps_lat: String(form.gps_lat),
      gps_lng: String(form.gps_lng),
      check_in_time: form.check_in_time,
      check_out_time: form.check_out_time,
      radius_meter: Number(form.radius_meter),
    };

    if (attendanceSettingId.value) {
      await updateAttendanceSetting(attendanceSettingId.value, payload);
    } else {
      const response = await createAttendanceSetting(payload);
      const createdSetting = response?.data?.data;
      attendanceSettingId.value = createdSetting?.id ?? null;
    }

    isSuccessAlertOpen.value = true;
  } catch (error: any) {
    console.error("Save failed", error);
    errorMessage.value =
      error?.response?.data?.message || "Gagal menyimpan pengaturan.";
  } finally {
    isUpdating.value = false;
  }
};

onMounted(fetchAttendanceSetting);
</script>
<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
.animate-in {
  animation: slideUp 0.5s ease-out forwards;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(24%) sepia(48%) saturate(1633%) hue-rotate(334deg)
    brightness(91%) contrast(90%);
  cursor: pointer;
}
</style>
