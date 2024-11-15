<template>
  <main class="main">
    <LocationFinder />

    <div class="places">
      <TransitionGroup name="list">
        <CityCard
          v-for="place in places"
          :key="place.id"
          :city="place"
          @openDeleteModal="() => (openDeleteModal = true)"
        />
      </TransitionGroup>
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
    const response = await fetch(
      `https://api.geoapify.com/v1/ipinfo?apiKey=${store.apiIpKey}`
    );

    const data = await response.json();

    console.log('DATA', data);

    const city = {
      isUserLocation: true,
      isFavorite: false,
      ...data,
      coord: {
        lat: data.location.latitude,
        lon: data.location.longitude,
      },
      name: data.city.name,
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

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
