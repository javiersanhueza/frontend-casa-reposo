<template>
  <div class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-input
        filled
        dense
        debounce="500"
        v-model="filter"
        placeholder="Buscar usuario..."
        clearable
        prepend-inner-icon="search"
        class="q-mr-sm"
        @clear="filter = ''"
      />
    </div>

    <q-table
      flat
      bordered
      grid
      :rows="filteredUsers"
      row-key="userId"
      no-data-label="Sin usuarios disponibles"
      hide-bottom
    >
      <template v-slot:item="props">
        <div class="q-pa-sm col-12 col-md-12">
          <div
            class="bg-white rounded-borders shadow-1 q-pt-md q-px-md"
            :class="{ 'q-pb-md': $q.screen.lt.md }"
          >
            <div class="row q-col-gutter-md items-start">

              <div
                class="col-12 col-md-11"
                :class="$q.screen.gt.sm ? 'q-pr-md' : ''"
                :style="$q.screen.gt.sm ? 'border-right: 1px solid #e0e0e0;' : ''"
              >
                <div class="row items-center q-mb-md">
                  <div class="col-auto q-mr-md">
                    <q-avatar size="50px" class="shadow-1">
                      <img v-if="props.row.photo" :src="props.row.photo"  alt="avatar"/>
                      <q-icon v-else name="person" color="grey" />
                    </q-avatar>
                  </div>

                  <div class="col">
                    <div class="text-h6 text-primary">
                      {{ getFullName(props.row) }}
                    </div>
                    <div class="text-subtitle2 text-grey-7 row items-center">
                      <span>RUN: {{ props.row.run }}</span>
                      <q-chip
                        dense
                        size="sm"
                        class="q-ml-sm"
                        :color="props.row.stateUser === 'Approved' ? 'positive' : 'warning'"
                        text-color="white"
                      >
                        {{ props.row.stateUser }}
                      </q-chip>
                    </div>
                  </div>

                  <div class="col-12 col-sm-auto text-right q-mt-sm-none q-mt-xs">
                    <div class="row justify-end q-gutter-xs">
                      <q-badge
                        v-for="role in getActiveRoles(props.row.roles)"
                        :key="role"
                        color="secondary"
                        outline
                      >
                        {{ role }}
                      </q-badge>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-sm" />

                <div class="row q-col-gutter-sm q-mb-md">
                  <div class="col-12 col-sm-4">
                    <div class="text-subtitle2">
                      <q-icon name="place" size="16px" class="q-mr-xs" />
                      Ubicación
                    </div>
                    <div class="text-body2 text-grey-8">
                      {{ props.row.address }}<br />
                      {{ props.row.commune }}, {{ props.row.city }}<br />
                      {{ props.row.nationality }}
                    </div>
                  </div>

                  <div class="col-12 col-sm-4">
                    <div class="text-subtitle2">
                      <q-icon name="contact_phone" size="16px" class="q-mr-xs" />
                      Contacto
                    </div>
                    <div class="text-body2 text-grey-8">
                      <div class="row items-center">
                        <q-icon name="mail" size="14px" class="q-mr-xs text-grey-6"/>
                        {{ props.row.email }}
                      </div>
                      <div v-for="(phone, index) in props.row.phones" :key="index" class="row items-center">
                        <q-icon name="phone" size="14px" class="q-mr-xs text-grey-6"/>
                        {{ phone }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-sm-4">
                    <div class="text-subtitle2">
                      <q-icon name="info" size="16px" class="q-mr-xs" />
                      Información Personal
                    </div>
                    <div class="text-body2 text-grey-8">
                      Género: {{ props.row.gender }}<br />
                      Nacimiento: {{ formatDate(props.row.dateBirth) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-1">
                <q-separator class="q-my-sm" v-if="$q.screen.lt.md" />
                <div class="column q-gutter-sm items-stretch">
                  <q-btn
                    color="primary"
                    icon="edit"
                    flat
                    dense
                    class="full-width"
                    @click="openDialogEdit(props.row)"
                    :label="$q.screen.lt.md ? 'Editar' : ''"
                  >
                    <q-tooltip v-if="$q.screen.gt.sm">Editar Usuario</q-tooltip>
                  </q-btn>

                  <q-btn
                    color="negative"
                    icon="delete"
                    flat
                    dense
                    class="full-width"
                    @click="openDialogDelete(props.row)"
                    :label="$q.screen.lt.md ? 'Eliminar' : ''"
                  >
                    <q-tooltip v-if="$q.screen.gt.sm">Eliminar Usuario</q-tooltip>
                  </q-btn>
                </div>
              </div>

            </div>
          </div>
        </div>
      </template>
    </q-table>

    <pagination-controls
      v-if="userStore.users && userStore.users.length > 0 && !isLoading"
      :model-value="currentPage"
      @update:model-value="changePage"
      :total-page="totalPages"
      :initial-rows-per-page="currentRowsPerPage"
      @rows-per-page-change="changeRowsPerPage"
    />

    <div
      v-else-if="!isLoading"
      class="q-pa-xl flex flex-center column text-grey-7 text-center"
      style="min-height: 200px"
    >
      <q-icon name="info" size="48px" class="q-mb-md" />
      <div class="text-h6">Sin datos disponibles</div>
      <div class="text-subtitle2">No se encontraron usuarios para mostrar</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { date } from 'quasar';

import { useUserStore } from 'stores/user';
import pinia from 'src/stores';
import PaginationControls from 'pages/private/components/PaginationControls.vue';

export default defineComponent({
  name: 'UsersComponent',
  components: { PaginationControls },

  setup() {
    const userStore = useUserStore(pinia());
    const filter = ref('');
    const isLoading = ref(false);

    const currentPage = computed({
      get: () => {
        const offset = userStore.offset || 0;
        const limit = userStore.limit || 10;
        return Math.floor(offset / limit) + 1;
      },
      set: (val) => {
        changePage(val);
      }
    });

    const currentRowsPerPage = computed(() => userStore.limit);

    const totalPages = computed(() => userStore.totalPage || 0);

    const refreshData = async () => {
      try {
        isLoading.value = true;
        await userStore.getUsersPagination();
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };

    const changePage = async (newPage: number) => {
      const newOffset = (newPage - 1) * userStore.limit;
      userStore.$patch({ offset: newOffset });
      await refreshData();
    };

    const changeRowsPerPage = async (newLimit: number) => {
      userStore.$patch({
        limit: newLimit,
        offset: 0
      });
      await refreshData();
    };
    const filteredUsers = computed(() => userStore.users ?? []);

    const getFullName = (row: any) => {
      return `${row.firstName} ${row.secondName || ''} ${row.firstSurname} ${row.secondSurname || ''}`.trim().replace(/\s+/g, ' ');
    };

    const formatDate = (dateString: any) => date.formatDate(dateString, 'DD/MM/YYYY');

    const getActiveRoles = (rolesObj: any) => {
      if (!rolesObj) return [];
      return Object.keys(rolesObj).filter(key => rolesObj[key] === true);
    };

    onMounted(() => {
      refreshData();
    });

    return {
      userStore,
      filter,
      filteredUsers,
      isLoading,
      currentPage,
      currentRowsPerPage,
      totalPages,

      changePage,
      changeRowsPerPage,
      getFullName,
      formatDate,
      getActiveRoles,

      openDialogEdit: (row: any) => console.log('Edit', row),
      openDialogDelete: (row: any) => console.log('Delete', row),
    }
  }
})
</script>
