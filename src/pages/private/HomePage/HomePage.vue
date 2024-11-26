<template>
  <q-page>
    <div class="q-gutter-md">
      <months-component />
      <statistics-month-component />
      <q-separator size="3px" class="q-my-md" />
      <q-card class="bg-teal-3" flat style="border-radius: 10px">
        <q-card-section class="text-center text-white text-h6">
          DATOS ACUMULADOS GENERAL
        </q-card-section>
      </q-card>
      <div class="row">
        <div class="col-12 col-md-3 q-pr-sm q-md-py-md">
          <last-recorded-accident-component />
        </div>
        <div class="col-12 col-md-4 q-pr-sm q-md-py-md">
          <div class="row q-mb-sm">
            <div class="col-12 q-md-py-md">
              <div class="row q-pb-sm">
                <div class="col-md-6 col-12 q-pr-sm">
                  <card-statistic-component
                    class-card="bg-blue-grey-7"
                    icon="personal_injury"
                    title="TOTAL ACCIDENTES"
                    sub-title="33"
                    vertical
                  />
                </div>
                <div class="col-md-6 col-12">
                  <card-statistic-component
                    class-card="bg-yellow-7"
                    icon="event_busy"
                    title="DÍAS PERDIDOS"
                    sub-title="14"
                    vertical
                  />
                </div>
              </div>
              <card-statistic-component
                class-card="bg-light-blue-8"
                icon="check_circle"
                title="DÍAS SIN ACCIDENTES"
                sub-title="7"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12 q-md-py-md">
              <LineChart :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3 q-pr-sm q-md-py-md">
          <q-card
            class="bg-teal-3"
            flat
            style="border-radius: 10px; height: 100%"
          >
            <q-card-section class="text-center text-white text-h6">
              DATOS ACUMULADOS GENERAL
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-2 q-md-py-md">
          <q-card
            class="bg-teal-3"
            flat
            style="border-radius: 10px; height: 100%"
          >
            <q-card-section class="text-center text-white text-h6">
              DATOS ACUMULADOS GENERAL
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';

import MonthsComponent from 'pages/private/HomePage/components/Months.vue';
import StatisticsMonthComponent from 'pages/private/HomePage/components/StatisticsMonth.vue';
import LastRecordedAccidentComponent from 'pages/private/HomePage/components/LastRecordedAccident.vue';
import CardStatisticComponent from 'pages/private/HomePage/components/CardStatistic.vue';

Chart.register(...registerables);

export default defineComponent({
  name: 'HomePage',

  components: {
    CardStatisticComponent,
    LastRecordedAccidentComponent,
    StatisticsMonthComponent,
    MonthsComponent,
    LineChart: Line
  },

  setup() {
    const chartData = ref({
      labels: ['Accidente Leve', 'Accidente Mortal', 'Parcial Permanente', 'Parcial Temporal', 'Total Permanente', 'Total Temporal'],
      datasets: [
        {
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: true
        }
      ]
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Oculta la leyenda
        }
      }
    });

    return { chartData, chartOptions };
  }
});
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
@media (max-width: 1200px) {
  .q-pr-sm {
    padding-right: 0 !important; /* Elimina el padding-right en pantallas medianas */
  }
  .q-md-py-md {
    padding-top: 10px !important; /* Agrega padding vertical en pantallas medianas */
    padding-bottom: 10px !important;
  }
}
</style>
