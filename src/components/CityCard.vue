<template>
  <div class="main">
    <div v-if="!city?.isUserLocation" class="actions">
      <div v-if="showFavoriteIcon" class="actions__item">
        <FavoriteIcon
          @click="store.changeFavorite(city)"
          :isFavorite="isFavorite"
        />
      </div>

      <div class="actions__item">
        <DeleteIcon @click="() => (openDeleteModal = true)" />
      </div>
    </div>

    <div class="container">
      <div class="weather-info" v-if="!isLoading">
        <div class="weather-raw">
          <p class="city">{{ city?.name }}</p>
          <img :src="iconFlag" alt="Weather Icon" />
        </div>
        <div class="icon-container">
          <img class="icon-weather" :src="iconUrl" alt="Weather Icon" />
        </div>
        <p class="temperature">
          {{ (weatherInfo?.main?.temp - 273.15).toFixed(1) }} °C
        </p>
        <div class="weather-raw">
          <span class="weather-type">{{ weatherInfo?.weather[0]?.main }}</span>
        </div>

        <div class="temperature-min-max">
          <span
            >H:{{ (weatherInfo?.main?.temp_max - 273.15).toFixed(1) }} °C</span
          >
          <span
            >L:{{ (weatherInfo?.main?.temp_min - 273.15).toFixed(1) }} °C</span
          >
        </div>
      </div>

      <div v-else class="weather-info loading">
        <Loading />
      </div>

      <div class="chart">
        <Chart
          v-if="city"
          :latitude="city.coord.lat"
          :longitude="city.coord.lon"
          :city="city"
        />
      </div>
    </div>
  </div>

  <ModalRemove
    v-if="openDeleteModal"
    @confirm="removeLocation"
    @cancel="() => (openDeleteModal = false)"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Chart from './Chart.vue';
import FavoriteIcon from './Icons/FavoriteIcon.vue';
import DeleteIcon from './Icons/DeleteIcon.vue';
import Loading from './Loading.vue';
import { useWeatherStore } from '../store/weather.js';
import ModalRemove from './modal/ModalRemove.vue';
const store = useWeatherStore();

const props = defineProps({
  city: {
    type: Object,
    default: null,
  },
  showFavoriteIcon: {
    type: Boolean,
    default: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['openDeleteModal']);

const openDeleteModal = ref(false);
const weatherInfo = ref(null);
const isLoading = ref(false);

const iconUrl = computed(() => {
  return `${store.BASE_URL}/img/wn/${weatherInfo.value?.weather[0]?.icon}@2x.png`;
});

const iconFlag = computed(() => {
  return `${
    store.BASE_URL
  }/images/flags/${weatherInfo.value?.sys?.country?.toLowerCase()}.png`;
});

const isFavorite = computed(() => props.city.isFavorite);

const removeLocation = () => {
  props.isFavorite
    ? store.removeFavoritePlace(props.city.id)
    : store.removePlace(props.city.id);
  openDeleteModal = false;
};

async function getWeatherInfo() {
  isLoading.value = true;
  try {
    weatherInfo.value = await store.getWeatherInfo(
      props.city?.coord?.lat,
      props.city?.coord?.lon
    );
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await getWeatherInfo();
});
</script>

<style scoped lang="scss">
h1 {
  color: #333;
}

.main {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  gap: 10px;
  width: 320px;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;

  @media (min-width: 768px) {
    width: 100%;
    max-width: 1000px;
  }
}

.container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}

.main::after {
  content: '';
  position: absolute;
  display: block;
  z-index: -1;
  border-radius: 5px;
  background: linear-gradient(
    176deg,
    rgba(4, 3, 23, 1) 0%,
    rgba(28, 44, 71, 1) 100%
  );
  height: 100%;
  width: 100%;
  opacity: 0.6;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 50px;
}

.icon-weather {
  /* width: 80px; */
  position: absolute;
  filter: drop-shadow(2px 4px 6px black);
}

.weather-raw {
  display: flex;
  align-items: center;
  gap: 5px;
}

.weather-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #434345;
  min-width: 320px;
  min-height: 360px;
  // width: 100%;
  padding: 5px;
  flex: 0.5;
  border-radius: 5px;
  gap: 10px;
}

.city {
  font-size: 2.5rem;
}

.temperature {
  font-size: 3rem;
}

.weather-type {
  font-size: 1.5rem;
}

.actions {
  display: flex;
  width: 100%;
  justify-content: end;

  &__item {
    display: flex;
    align-items: start;
    cursor: pointer;
  }
}

.delete {
  &:hover {
    filter: brightness(0) saturate(100%) invert(29%) sepia(88%) saturate(6329%)
      hue-rotate(352deg) brightness(98%) contrast(108%);
    cursor: pointer;
  }
}

.chart {
  display: flex;
  flex: 1;
  // max-height: 300px;
  max-width: 600px;
  background: linear-gradient(
    0deg,
    rgba(69, 68, 83, 1) 0%,
    rgba(67, 67, 69, 1) 53%
  );
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  border-radius: 5px;
}

.temperature-min-max {
  display: flex;
  gap: 10px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
