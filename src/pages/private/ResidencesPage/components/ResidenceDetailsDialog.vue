<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-grey-2" v-if="residence">
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-btn flat v-close-popup round dense icon="arrow_back" />
        <q-toolbar-title>
          Detalles de: <strong>{{ residence.name }}</strong>
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <q-card flat bordered class="shadow-1 q-mb-md">
              <q-card-section>
                <div class="text-h6 q-mb-md">Información General</div>

                <q-list separator>
                  <q-item>
                    <q-item-section avatar
                      ><q-icon color="primary" name="tag"
                    /></q-item-section>
                    <q-item-section>
                      <q-item-label caption>RUT</q-item-label>
                      <q-item-label>{{ residence.rut }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar
                      ><q-icon color="primary" name="event"
                    /></q-item-section>
                    <q-item-section>
                      <q-item-label caption>Fecha Inicio</q-item-label>
                      <q-item-label>{{
                        formatDate(residence.dateStart)
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar
                      ><q-icon color="primary" name="description"
                    /></q-item-section>
                    <q-item-section>
                      <q-item-label caption>Descripción</q-item-label>
                      <q-item-label>{{ residence.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar
                      ><q-icon color="primary" name="map"
                    /></q-item-section>
                    <q-item-section>
                      <q-item-label caption>Dirección</q-item-label>
                      <q-item-label>{{ residence.address }}</q-item-label>
                      <q-item-label caption
                        >{{ residence.commune }},
                        {{ residence.region }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-card-section class="q-pt-none" v-if="residence.mapUrl">
                <iframe
                  width="100%"
                  height="200"
                  style="
                    pointer-events: none;
                    border: 0;
                    border-radius: 8px;
                    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
                  "
                  loading="lazy"
                  :src="residence.mapUrl"
                ></iframe>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-8">
            <q-card flat bordered class="shadow-1">
              <q-tabs
                v-model="activeTab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab
                  name="residents"
                  icon="elderly"
                  :label="`Residentes (${
                    residence.listResidents?.length || 0
                  })`"
                />
                <q-tab
                  name="employees"
                  icon="badge"
                  :label="`Trabajadores (${
                    residence.listEmployees?.length || 0
                  })`"
                />
                <q-tab
                  name="owners"
                  icon="admin_panel_settings"
                  :label="`Dueños (${residence.listOwners?.length || 0})`"
                />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="activeTab" animated class="bg-white">
                <q-tab-panel name="residents" class="q-pa-none">
                  <q-list separator>
                    <q-item
                      v-for="person in residence.listResidents"
                      :key="person.userId"
                      class="q-py-md"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          color="blue-2"
                          text-color="blue-8"
                          icon="person"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold"
                          >{{ person.firstName }}
                          {{ person.firstSurname }}</q-item-label
                        >
                        <q-item-label caption
                          >RUN: {{ person.run }}</q-item-label
                        >
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          round
                          color="primary"
                          icon="visibility"
                          size="sm"
                        >
                          <q-tooltip>Ver ficha médica/detalle</q-tooltip>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                    <q-item v-if="!residence.listResidents?.length">
                      <q-item-section class="text-grey text-center q-pa-md"
                        >No hay residentes registrados.</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-tab-panel>

                <q-tab-panel name="employees" class="q-pa-none">
                  <q-list separator>
                    <q-item
                      v-for="person in residence.listEmployees"
                      :key="person.userId"
                      class="q-py-md"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          color="teal-2"
                          text-color="teal-8"
                          icon="badge"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold"
                          >{{ person.firstName }}
                          {{ person.firstSurname }}</q-item-label
                        >
                        <q-item-label caption
                          >RUN: {{ person.run }}</q-item-label
                        >
                      </q-item-section>
                      <q-item-section side>
                        <q-chip
                          size="sm"
                          :color="
                            person.state === 'Aprobado' ? 'positive' : 'warning'
                          "
                          text-color="white"
                        >
                          {{ person.state }}
                        </q-chip>
                      </q-item-section>
                    </q-item>
                    <q-item v-if="!residence.listEmployees?.length">
                      <q-item-section class="text-grey text-center q-pa-md"
                        >No hay trabajadores registrados.</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-tab-panel>

                <q-tab-panel name="owners" class="q-pa-none">
                  <div class="q-pa-md row justify-end">
                    <q-btn
                      flat
                      color="orange-9"
                      icon="person_add"
                      label="Asignar Nuevo Dueño"
                      class="bg-orange-1 q-px-md q-py-sm text-weight-bold transition-ease"
                      style="border-radius: 8px;"
                      @click="openCreateOwnerModal"
                    />
                  </div>

                  <q-separator />

                  <q-list separator class="rounded-borders">
                    <q-item
                      v-for="person in residence.listOwners"
                      :key="person.userId"
                      class="q-py-md company-item transition-ease"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          color="orange-1"
                          text-color="orange-8"
                          icon="admin_panel_settings"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-weight-bold text-grey-9 row items-center q-gutter-x-sm">
                          <span class="text-body2 text-weight-bold">{{ person.firstName }} {{ person.firstSurname }}</span>

                          <q-badge
                            v-if="person.subRole"
                            color="orange-1"
                            text-color="orange-9"
                            :label="person.subRole"
                            class="text-weight-bold q-px-sm q-py-xs"
                            style="border-radius: 6px; font-size: 0.65rem;"
                          />
                        </q-item-label>

                        <q-item-label caption class="text-grey-6 q-mt-xs">
                          <q-icon name="fingerprint" size="xs" class="q-mr-xs" />
                          RUN: {{ person.run }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <div class="row items-center no-wrap">

                          <q-chip
                            size="sm"
                            :color="person.state === 'Aprobado' ? 'positive' : 'warning'"
                            text-color="white"
                            class="q-ma-none text-weight-bold"
                          >
                            {{ person.state }}
                          </q-chip>

                          <q-separator vertical inset class="q-mx-md" />

                          <div class="row q-gutter-xs">
                            <q-btn
                              flat
                              round
                              dense
                              color="primary"
                              icon="edit"
                              size="sm"
                              @click.stop="editOwner(person)"
                            >
                              <q-tooltip class="bg-primary shadow-4">Editar dueño</q-tooltip>
                            </q-btn>

                            <q-btn
                              flat
                              round
                              dense
                              color="negative"
                              icon="delete_outline"
                              size="sm"
                              @click.stop="deleteOwner(person)"
                            >
                              <q-tooltip class="bg-negative shadow-4">Eliminar dueño</q-tooltip>
                            </q-btn>
                          </div>

                        </div>
                      </q-item-section>
                    </q-item>

                    <q-item v-if="!residence.listOwners?.length">
                      <q-item-section class="text-grey-6 text-center items-center q-pa-lg">
                        <q-icon name="sentiment_dissatisfied" size="40px" class="q-mb-sm opacity-50" />
                        <div class="text-body1 text-weight-medium">No hay dueños registrados.</div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <create-owner-dialog
    v-model:dialogVisible="createOwnerModalVisible"
    :title="isEditOwner ? 'Editar Dueño' : 'Asignar Nuevo Dueño'"
    :owner-edit="ownerSelected"
    @submitted="handleOwnerSubmit"
  />
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue';
import CreateOwnerDialog from 'pages/private/ResidencesPage/components/CreateOwnerDialog.vue';
import { useUserStore } from 'stores/user';
import pinia from 'src/stores';
import { useResidenceStore } from 'stores/residence';
import { Notify, useQuasar } from 'quasar';

export default defineComponent({
  name: 'ResidenceDetailsDialog',

  components: { CreateOwnerDialog },

  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    residence: {
      type: Object as PropType<any>,
      default: null,
    },
  },

  emits: ['update:modelValue', 'owner-created'],

  setup(props, { emit }) {
    const activeTab = ref('residents');
    const createOwnerModalVisible = ref(false);
    const userStore = useUserStore(pinia());
    const residenceStore = useResidenceStore(pinia());
    const $q = useQuasar();
    const isEditOwner = ref(false);

    const openCreateOwnerModal = () => {
      ownerSelected.value = null;
      createOwnerModalVisible.value = true;
      isEditOwner.value = false;
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return new Date(dateString).toLocaleDateString('es-CL', options);
    };

    const deleteOwner = async (owner: any) => {
      $q.dialog({
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar a <strong>${owner.firstName} ${owner.firstSurname}</strong>?<br><br><span class="text-caption text-grey-8">Esta acción no se puede deshacer.</span>`,
        html: true,
        ok: {
          label: 'Eliminar',
          color: 'negative',
          unelevated: true,
          icon: 'delete',
        },
        cancel: {
          label: 'Cancelar',
          color: 'grey-8',
          flat: true,
        },
        persistent: true,
      }).onOk(async () => {
        try {
          const response = await userStore.deleteOwner(
            owner.userId
          );

          if (response) {
            await userStore.deleteOwnerCompany(owner.companyOwnerId);
            $q.notify({
              type: 'positive',
              message: ` ${owner.firstName} ${owner.firstSurname} fue eliminado con éxito.`,
              position: 'top-right',
            });
            emit('owner-created');
          }
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Ocurrió un error al intentar eliminar la residencia.',
            position: 'top-right',
          });
        }
      });
    };

    const ownerSelected = ref();
    const editOwner = async (owner: any) => {
      const response = await userStore.getOwner(owner.userId);
      isEditOwner.value = true;
      ownerSelected.value = response;
      createOwnerModalVisible.value = true;
    };

    const handleOwnerSubmit = async (ownerPayload: any) => {
      if (isEditOwner.value) {
        await userStore.editOwner(ownerPayload, ownerSelected.value.userId);

        Notify.create({
          type: 'positive',
          message: 'Dueño editado con éxito',
          position: 'top-right',
          timeout: 3000,
        });
      } else {
        const response = await userStore.createOwner(ownerPayload);
        await residenceStore.companyOwner({
          companyId: props.residence.companyId,
          ownerId: response.data,
          state: 'Aprobado'
        });

        Notify.create({
          type: 'positive',
          message: 'Dueño asignado con éxito',
          position: 'top-right',
          timeout: 3000,
        });
      }

      emit('owner-created');
      createOwnerModalVisible.value = false;
    }

    watch(
      () => props.modelValue,
      (isOpen) => {
        if (isOpen) {
          activeTab.value = 'residents';
        }
      }
    );

    return {
      activeTab,
      createOwnerModalVisible,
      isEditOwner,
      ownerSelected,

      deleteOwner,
      handleOwnerSubmit,
      openCreateOwnerModal,
      formatDate,
      editOwner
    };
  },
});
</script>
