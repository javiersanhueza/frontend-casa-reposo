<template>
  <q-table
    flat
    bordered
    :rows="areas ?? []"
    :columns="columnsArea"
    row-key="areaName"
    v-model:pagination="pagination"
    hide-pagination
    :grid="$q.screen.xs"
    no-data-label="Sin datos disponibles"
  >
    <template v-slot:body="props" v-if="$q.screen.gt.xs">
      <q-tr :props="props">
        <q-td key="areaName" :props="props">
          {{ props.row.areaName }}
        </q-td>
        <q-td key="createdAt" :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn flat round icon="edit" @click="editArea(props.row.id)" />
          <q-btn
            flat
            round
            icon="delete"
            @click="openDeleteArea(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>

    <template v-slot:item="props" v-if="$q.screen.xs">
      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card flat bordered>
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-grey-7 text-h6">
                {{ props.row.areaName }}
              </div>
            </q-card-section>

            <q-separator vertical />

            <q-card-actions vertical class="justify-around">
              <q-btn flat round icon="edit" @click="editArea(props.row.id)" />
              <q-btn
                flat
                round
                icon="delete"
                @click="openDeleteArea(props.row.id)"
              />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </q-table>

  <div class="row justify-center q-mt-md">
    <q-pagination
      v-model="pagination.page"
      color="grey-8"
      :max="pagesNumber"
      size="sm"
    />
  </div>

  <confirm-dialog
    v-model:show-dialog="showDialogDelete"
    :title="`Eliminar ${selectedArea?.areaName}`"
    text="¿Estás seguro de eliminar esta área?"
    @accept="deleteArea"
  />

  <new-areas-dialog
    title="Editar Área"
    v-model:show-dialog="showDialogEdit"
    :area-name="selectedArea?.areaName"
    :area-id="selectedArea?.id"
    is-edit
    @accept="acceptEdit"
  />

</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { Area } from 'src/interfaces/areas.interface';
import { globalMixin } from 'src/mixins/globalMixin';
import pinia from 'src/stores';
import { useAreaStore } from 'stores/area';
import ConfirmDialog from 'components/ConfirmDialog.vue';
import NewAreasDialog from 'pages/private/AreasPage/components/NewAreaDialog.vue';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'AreasCompany',
  components: { NewAreasDialog, ConfirmDialog },

  mixins: [globalMixin],

  props: {
    areas: {
      type: Array,
      required: true,
    },
  },

  emits: ['getAreas'],

  setup(props, { emit }) {
    const showDialogEdit = ref(false);
    const showDialogDelete = ref(false);

    const areaStore = useAreaStore(pinia());

    const selectedArea = ref<Area>();

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
    });

    const columnsArea = [
      {
        name: 'areaName',
        required: true,
        label: 'Nombre',
        align: 'left' as const,
        field: (row: Area) => row.areaName,
        format: (val: string) => `${val}`,
        sortable: true,
      },
      {
        name: 'createdAt',
        label: 'Fecha creación',
        field: 'createdAt',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center' as const,
        field: 'actions',
        sortable: false,
      },
    ];

    const editArea = (id: number) => {
      selectedArea.value = areaStore.areas?.find(
        area => area.id === id
      );

      showDialogEdit.value = true;
    };

    const deleteArea = async () => {
      await areaStore.deleteArea(selectedArea.value!.id);

      emit('getAreas');
      showDialogDelete.value = false;

      Notify.create({
        type: 'positive',
        message: 'Área eliminada con éxito',
        position: 'top',
        timeout: 3000,
      });
    };

    const openDeleteArea = (id: number) => {
      selectedArea.value = areaStore.areas?.find(
        area => area.id === id
      );
      showDialogDelete.value = true;
    };

    const acceptEdit = () => {
      emit('getAreas');
    };

    return {
      columnsArea,
      pagination,
      pagesNumber: computed(() =>
        Math.ceil(props.areas!.length / pagination.value.rowsPerPage)
      ),
      showDialogDelete,
      showDialogEdit,
      selectedArea,

      editArea,
      openDeleteArea,
      acceptEdit,
      deleteArea
    };
  },
});
</script>
