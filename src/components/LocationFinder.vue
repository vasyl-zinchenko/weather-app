<template>
  <div class="location-finder">
    <div class="input">
      <input
        type="text"
        v-model="query"
        @input="fetchCities"
        placeholder="Enter city name"
      />

      <ul class="cities" v-if="searchedCities.length && isListShown">
        <li
          v-for="(city, index) in searchedCities"
          :key="index"
          @click="getWeatherInfo(city)"
        >
          {{ city.name }}, {{ city.state ? city.state + ',' : '' }}
          {{ city.country }}

          <img
            :src="`${
              store.BASE_URL
            }/images/flags/${city.country?.toLowerCase()}.png`"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useWeatherStore } from '../store/weather';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const route = useRoute();

const store = useWeatherStore();
const emits = defineEmits(['click']);

const query = ref('');
const searchedCities = ref([]);
const isListShown = ref(false);

const showList = (value) => {
  isListShown.value = value;
};

const resetQuery = () => (query.value = '');

async function fetchCities() {
  try {
    const response = await fetch(
      `${store.BASE_API_URL}/geo/1.0/direct?q=${query.value}&limit=5&appid=${store.apiKey}`
    );
    const data = await response.json();
    searchedCities.value = data;
    if (data) {
      showList(true);
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
}

async function getWeatherInfo(city) {
  try {
    const response = await fetch(
      `${store.BASE_API_URL}/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${store.apiKey}`
    );
    const data = await response.json();

    if (store.selectedPlaces.find((el) => el.id === data.id)) {
      toast.error('This location has already been added', {
        autoClose: 2000,
      });
      return;
    }

    if (store.selectedPlaces.length < 5) {
      store.addPlace(data);
    } else {
      toast.error('The maximum number of locations that can be added is 5', {
        autoClose: 2000,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    showList(false);
    resetQuery();
  }
}
</script>

<style lang="scss" scoped>
.location-finder {
  display: flex;
  margin: 5px auto;
  max-width: 1200px;
  padding: 0 20px;
}

.add-container {
  display: flex;
  gap: 5px;
}

.input {
  position: relative;
  display: flex;
  width: 100%;
}

input {
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  outline: none;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}

ul {
  width: 100%;
  list-style-type: none;
  padding: 0 5px;
  margin-top: 2px;
}

li {
  padding: 5px 0;
  text-align: justify;
}

.cities {
  position: absolute;
  top: 30px;
  z-index: 10;
  border-top: none;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
    rgba(0, 0, 0, 0.22) 0px 15px 12px;
  background-color: white;
  border-radius: 2.5px;
}
</style>
