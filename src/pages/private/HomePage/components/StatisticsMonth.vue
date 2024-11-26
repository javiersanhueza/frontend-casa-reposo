<template>
  <div class="card-container">
    <card-statistic-component
      class-card="bg-blue-6"
      icon="personal_injury"
      title="CANTIDAD DE ACCIDENTES"
      sub-title="14"
    />

    <card-statistic-component
      class-card="bg-grey-7"
      icon="timer"
      title="DÍAS PERDIDOS POR MES"
      sub-title="207"
    />

    <card-statistic-component
      class-card="bg-red-9"
      icon="error"
      title="ÁREA CON MÁS ACCIDENTES"
      sub-title="ÁREA 2"
    />
  </div>
  <div class="accident-container">
    <div v-for="type in typeAccidents" :key="type.id" class="accident-item">
      <type-accident-component
        :title="type.title"
        :amount="type.amount"
        :color-avatar="type.color"
      />
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CardStatisticComponent from 'pages/private/HomePage/components/CardStatistic.vue';
import TypeAccidentComponent from 'pages/private/HomePage/components/TypeAccident.vue';

export default defineComponent({
  name: 'StatisticsMonthComponent',
  components: { TypeAccidentComponent, CardStatisticComponent },

  setup() {
    const typeAccidents = [
      { id: 1, title: 'ACCIDENTE LEVE', amount: 0, color: 'green' },
      { id: 2, title: 'PARCIAL TEMPORAL', amount: 9, color: 'yellow' },
      { id: 3, title: 'TOTAL TEMPORAL', amount: 1, color: 'blue' },
      { id: 4, title: 'TOTAL PERMANENTE', amount: 1, color: 'green' },
      { id: 5, title: 'PARCIAL PERMANENTE', amount: 1, color: 'purple' },
      { id: 6, title: 'ACCIDENTE MORTAL', amount: 2, color: 'red' },
    ];

    return {
      typeAccidents,
    };
  },
});
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.accident-container {
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos se dispongan en varias filas si es necesario */
  gap: 0 10px; /* Espacio entre los elementos */
}

.accident-item {
  flex: 1 1 auto; /* Permite que cada elemento ocupe el mismo espacio disponible */
  box-sizing: border-box;
}

@media (max-width: 1200px) {
  .card-container {
    flex-wrap: wrap;
  }
}

@media (max-width: 600px) {
  .card-container {
    flex-wrap: wrap;
  }
  .accident-container {
    display: block;
  }

}
</style>
