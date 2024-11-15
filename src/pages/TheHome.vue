<template>
  <main class="main">
    <LocationFinder />

    <div class="places">
      <CityCard
        v-for="(place, index) in places"
        :key="index"
        :city="place"
        @openDeleteModal="() => (openDeleteModal = true)"
      />
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import LocationFinder from '../components/LocationFinder.vue';
import CityCard from '../components/CityCard.vue';

import { useWeatherStore } from '../store/weather.js';
const store = useWeatherStore();

const places = computed(() => store.selectedPlaces);
const isLoading = ref(true);

async function getLocationByIp() {
  try {
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();

    const city = {
      isUserLocation: true,
      isFavorite: false,
      ...data,
      coord: {
        lat: data.lat,
        lon: data.lon,
      },
      name: data.city,
    };

    if (store.selectedPlaces.some((el) => el.id === city.id)) {
      return;
    } else {
      store.addPlace(city);
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await getLocationByIp().then(() => {
    isLoading.value = false;
  });
});
</script>

<style scoped>
.places {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: auto;
  gap: 10px;
}
</style>
