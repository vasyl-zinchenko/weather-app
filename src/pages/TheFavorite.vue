<template>
  <div class="places">
    <CityCard
      v-for="place in places"
      isFavorite
      :key="place.id"
      :city="place"
      :showFavoriteIcon="false"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import CityCard from '../components/CityCard.vue';

import { useWeatherStore } from '../store/weather.js';
const store = useWeatherStore();

const places = computed(() => store.favoritePlaces);

onMounted(() => {
  const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
  store.setFavorites(storedFavorites);
});
</script>

<style scoped>
.places {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 10px auto 0;
  gap: 10px;
}
</style>
