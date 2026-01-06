<template>
  <div class="row items-center justify-between q-ma-sm q-col-gutter-sm">
    <div class="row items-center">
      <span class="q-mr-sm">Mostrar</span>
      <q-select
        v-model="rowsPerPage"
        :options="[5, 10, 20, 50, 100]"
        dense
        outlined
        emit-value
        map-options
        style="min-width: 30px"

      />
      <span class="q-ml-sm">registros por página</span>
    </div>

    <div
      class="q-mt-sm"
      :class="{
        'col-12 flex justify-center': $q.screen.xs,
        '': !$q.screen.xs
      }"
    >
      <q-pagination
        v-model="page"
        :max="totalPage || 1"
        @update:model-value="onPageChange"
        color="primary"
        boundary-numbers
        direction-links
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';

export default {
  name: 'PaginationControls',
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    totalPage: {
      type: Number,
      required: true
    },
    initialRowsPerPage: {
      type: Number,
      default: 10
    }
  },
  emits: ['update:modelValue', 'rows-per-page-change'],
  setup(props, { emit }) {
    const $q = useQuasar();
    const isXs = computed(() => $q.screen.xs);

    const page = ref(props.modelValue);
    const rowsPerPage = ref(props.initialRowsPerPage);

    watch(() => props.modelValue, val => {
      page.value = val;
    });

    watch(rowsPerPage, (val) => {
      page.value = 1;+
        emit('rows-per-page-change', val);
    });

    const onPageChange = val => {
      page.value = val;
      emit('update:modelValue', val);
    };

    return {
      page,
      rowsPerPage,
      isXs,
      onPageChange
    };
  }
};
</script>
