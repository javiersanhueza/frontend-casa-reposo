<template>
  <div class="bg-blue-3 q-pb-md q-gutter-md" style="border-radius: 10px">
      <q-btn
        @click="selectButton(month)"
        v-for="month in displayedMonths"
        :color="selectedMonth?.id === month.id ? 'primary' : 'secondary'"
        :label="month.label"
        :key="month.id"
      />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted
} from 'vue';

interface MonthOption {
  id: number;
  label: string;
}

export default defineComponent({
  name: 'MonthsComponent',

  setup() {
    const allMonths: MonthOption[] = [
      { id: 1, label: 'Ene' },
      { id: 2, label: 'Feb' },
      { id: 3, label: 'Mar' },
      { id: 4, label: 'Abr' },
      { id: 5, label: 'May' },
      { id: 6, label: 'Jun' },
      { id: 7, label: 'Jul' },
      { id: 8, label: 'Ago' },
      { id: 9, label: 'Sep' },
      { id: 10, label: 'Oct' },
      { id: 11, label: 'Nov' },
      { id: 12, label: 'Dic' },
    ];

    const currentMonthIndex = new Date().getMonth() + 1;
    const displayedMonths = ref(allMonths.filter(month => month.id <= currentMonthIndex));
    const selectedMonth = ref<MonthOption>();

    const selectButton = (month: MonthOption) => {
      selectedMonth.value = month;
    };

    onMounted(() => {
      selectedMonth.value = allMonths.find(month => month.id === currentMonthIndex);
    });

    return {
      displayedMonths,
      selectedMonth,

      selectButton
    }
  }
})

</script>
