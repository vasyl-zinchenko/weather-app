import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const useWeatherStore = defineStore('weatherStore', () => {
  const BASE_API_URL = 'https://api.openweathermap.org';
  const BASE_URL = ref('https://openweathermap.org');

  const localCity = ref(null);
  const selectedPlaces = ref([]);
  const favoritePlaces = ref([]);
  const apiKey = import.meta.env.VITE_API_KEY;

  async function getWeatherInfo(lat, lon) {
    try {
      const response = await fetch(
        `${BASE_API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  const addPlace = (city) => {
    const favoriteExist = favoritePlaces.value.find((el) => el.id === city.id);
    selectedPlaces.value.push({
      isFavorite: favoriteExist,
      ...city,
    });
  };

  const removePlace = (id) => {
    selectedPlaces.value = selectedPlaces.value.filter(
      (place) => place.id !== id
    );
  };

  const removeFavoritePlace = (id) => {
    favoritePlaces.value = favoritePlaces.value.filter(
      (place) => place.id !== id
    );
    selectedPlaces.value.forEach((el) => {
      if (el.id === id) {
        el.isFavorite = !el.isFavorite;
      }
    });
    localStorage.setItem('favorites', JSON.stringify(favoritePlaces.value));
  };

  const changeFavorite = (place) => {
    const favoriteExist = favoritePlaces.value.find((el) => el.id === place.id);

    if (favoriteExist) {
      favoritePlaces.value = favoritePlaces.value.filter(
        (el) => el.id !== place.id
      );
    }

    if (!favoriteExist && favoritePlaces.value.length === 5) {
      toast.error('The maximum number of locations that can be added is 5', {
        autoClose: 2000,
      });
      return;
    } else {
      favoritePlaces.value.push(place);
    }

    selectedPlaces.value.forEach((el) => {
      if (el.id === place.id) {
        el.isFavorite = !el.isFavorite;
      }
    });

    localStorage.setItem('favorites', JSON.stringify(favoritePlaces.value));
  };

  const setFavorites = (data) => {
    favoritePlaces.value = data;
  };

  return {
    getWeatherInfo,
    addPlace,
    removePlace,
    setFavorites,
    removeFavoritePlace,
    favoritePlaces,
    BASE_API_URL,
    BASE_URL,
    apiKey,
    selectedPlaces,
    changeFavorite,
  };
});
