<template>
  <div class="container">
    <div class="tabs">
      <button
        class="tab tab__hourly"
        :class="{ 'is-active': viewMode === 'hourly' }"
        @click="toggleTab('hourly')"
      >
        Hourly
      </button>

      <button
        class="tab tab__daily"
        :class="{ 'is-active': viewMode === 'daily' }"
        @click="toggleTab('daily')"
      >
        Daily
      </button>
    </div>

    <div class="chart">
      <canvas :id="chartId"></canvas>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Chart } from 'chart.js/auto';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  latitude: {
    type: Number,
    default: '',
  },
  longitude: {
    type: Number,
    default: '',
  },
});
const chartId = ref(`chart-${uuidv4()}`);
const viewMode = ref('hourly');
const days = ref([]);

const hours = [
  '00:00',
  '01:00',
  '02:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '24:00',
];

let chartInstance = null;

const currentUrl = computed(() => {
  const baseUrl = `https://api.open-meteo.com/v1/forecast?latitude=${props.latitude}&longitude=${props.longitude}&`;
  return viewMode.value === 'hourly'
    ? baseUrl + 'hourly=temperature_2m'
    : baseUrl + 'daily=temperature_2m_max,temperature_2m_min&timezone=auto';
});

const createChart = (data) => {
  const ctx = document.getElementById(chartId.value).getContext('2d');

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: viewMode.value === 'hourly' ? hours : days.value,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: viewMode.value === 'hourly' ? 'Hours' : 'Days',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Temperature (°C)',
          },
          beginAtZero: false,
        },
      },
    },
  });
};

const toggleTab = (tab) => {
  chartId.value = `chart-${uuidv4()}`;
  viewMode.value = tab;
  getTemperature();
};

async function getTemperature() {
  try {
    const response = await fetch(currentUrl.value);
    const data = await response.json();
    if (viewMode.value === 'hourly') {
      createChart(data.hourly.temperature_2m.slice(0, 24));
    } else {
      const averageTemperaturesData = data.daily.temperature_2m_max.map(
        (maxTemp, index) => {
          const minTemp = data.daily.temperature_2m_min[index];
          return {
            date: data.daily.time[index],
            averageTemp: ((maxTemp + minTemp) / 2).toFixed(1),
          };
        }
      );

      const averageTemperatures = averageTemperaturesData.map(
        (el) => el.averageTemp
      );
      days.value = averageTemperaturesData.map((el) => el.date);
      createChart(averageTemperatures);
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await getTemperature();
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}

.chart {
  width: 100%;
}

.tabs {
  display: flex;
  background: #434345;
  padding: 5px;
}

.tab {
  background-color: #434345;
  padding: 2.5px 5px;
  border: 1px solid gray;
  color: silver;
  cursor: pointer;

  &__hourly {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  &__daily {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}

.is-active {
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: 500;
}
</style>
