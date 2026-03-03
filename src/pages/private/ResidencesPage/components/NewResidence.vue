<template>
  <q-dialog v-model="internalDialogVisible" persistent>
    <q-card style="width: 800px; max-width: 95vw;" class="q-dialog-plugin rounded-borders">

      <q-toolbar class="bg-primary text-white q-py-sm">
        <q-avatar>
          <q-icon name="domain_add" size="md" />
        </q-avatar>
        <q-toolbar-title class="text-weight-bold text-subtitle1">
          {{ title || 'Nueva Residencia' }}
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup @click="closeDialog">
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-form @submit="onSubmit">
        <q-card-section class="scroll" style="max-height: 75vh;">
          <div class="row q-col-gutter-md">

            <div class="col-12 text-subtitle2 text-primary text-uppercase text-weight-bold q-mt-sm row items-center">
              <q-icon name="info" class="q-mr-sm" size="20px" /> Datos Generales
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="residence.name"
                label="Nombre de la Residencia *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="apartment" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="residence.rut"
                label="RUT *"
                lazy-rules
                maxlength="12"
                @update:model-value="onRutInput"
                :rules="[
                  (val: string) => !!val || 'Campo requerido',
                  (val: string) => isValidRut(val) || 'El RUT ingresado no es válido'
                ]"
              >
                <template v-slot:prepend><q-icon name="badge" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                outlined
                type="textarea"
                rows="2"
                v-model="residence.description"
                label="Descripción *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="notes" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 text-subtitle2 text-primary text-uppercase text-weight-bold q-mt-lg row items-center">
              <q-icon name="place" class="q-mr-sm" size="20px" /> Ubicación Geográfica
            </div>

            <div class="col-12 col-md-6">
              <q-select
                outlined
                v-model="residence.region"
                :options="optionStore.regions?.regions"
                option-label="name"
                option-value="name"
                emit-value
                map-options
                label="Región *"
                clearable
                lazy-rules
                @clear="residence.region = ''"
                :rules="[(val: string) => !!val || 'Campo requerido']"
                @update:model-value="onRegionChange"
              >
                <template v-slot:prepend><q-icon name="map" color="grey-6" /></template>
                <template v-slot:selected-item="scope">
                  <div class="ellipsis" style="max-width: 100%;" :title="scope.opt.name">
                    {{ scope.opt.name || scope.opt }}
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label class="ellipsis" :title="scope.opt.name">{{ scope.opt.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                outlined
                v-model="residence.commune"
                :options="communeOptions"
                option-label="name"
                option-value="name"
                emit-value
                map-options
                label="Comuna *"
                clearable
                lazy-rules
                @clear="residence.commune = ''"
                :rules="[(val: string) => !!val || 'Campo requerido']"
                :disable="!residence.region"
              >
                <template v-slot:prepend><q-icon name="location_city" color="grey-6" /></template>
                <template v-slot:selected-item="scope">
                  <div class="ellipsis" style="max-width: 100%;" :title="scope.opt.name">
                    {{ scope.opt.name || scope.opt }}
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label class="ellipsis" :title="scope.opt.name">{{ scope.opt.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-input
                outlined
                v-model="residence.address"
                label="Dirección Exacta *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="signpost" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 q-mt-md" v-if="residence.mapUrl">
              <q-card flat bordered class="bg-grey-1 rounded-borders">
                <q-card-section class="q-py-sm row items-center">
                  <q-icon name="travel_explore" color="primary" size="20px" class="q-mr-sm" />
                  <div class="text-subtitle2 text-grey-8 text-weight-bold">Vista Previa del Mapa</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <iframe
                    width="100%"
                    height="250"
                    style="border:0; border-radius: 8px; box-shadow: inset 0 0 10px rgba(0,0,0,0.1);"
                    loading="lazy"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    :src="residence.mapUrl"
                  ></iframe>
                </q-card-section>
              </q-card>
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="bg-grey-1 q-px-lg q-py-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey-8"
            class="q-px-md"
            @click="closeDialog"
          />
          <q-btn
            unelevated
            label="Guardar"
            color="primary"
            icon="save"
            type="submit"
            class="q-px-md q-ml-sm"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import { globalMixin } from 'src/mixins/globalMixin';
import { NewCompany } from 'src/interfaces/companies/companies.interfaces';
import { useOptionStore } from 'stores/option';
import pinia from 'src/stores';
import { useRut } from 'src/composables/useRut';

export default defineComponent({
  name: 'NewResidence',

  props: {
    title: { type: String, required: true },
    isEdit: { type: Boolean, default: false },
    residenceEdit: { type: Object as () => NewCompany, default: () => ({}) },
    dialogVisible: { type: Boolean, required: true },
  },

  emits: ['update:dialogVisible', 'submitted'],

  mixins: [globalMixin],

  setup(props, { emit }) {
    const optionStore = useOptionStore(pinia());
    const { formatRut, validateRut } = useRut();

    const residence = ref<NewCompany>({
      name: '',
      rut: '',
      region: '',
      city: '',
      commune: '',
      address: '',
      description: '',
      mapUrl: '',
      dateStart: '',
      details: '{\"state\": \"Approved\"}'
    });

    const communeOptions = computed(() => {
      const currentRegionName = residence.value.region;
      const allRegions = optionStore.regions?.regions || [];

      if (!currentRegionName || allRegions.length === 0) return [];


      const selectedRegionObj = allRegions.find(r => r.name === currentRegionName);
      return selectedRegionObj ? selectedRegionObj.communes : [];
    });

    const onRegionChange = () => {
      residence.value.commune = '';
      residence.value.city = '';
    };

    const internalDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (val: boolean) => emit('update:dialogVisible', val)
    });

    watch(
      [() => residence.value.address, () => residence.value.commune, () => residence.value.region],
      ([newAddress, newCommune, newRegion]) => {
        if (newAddress && newCommune) {
          const fullAddress = `${newAddress}, ${newCommune}, ${newRegion ? newRegion + ',' : ''} Chile`;
          const encodedAddress = encodeURIComponent(fullAddress);
          residence.value.mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;
        } else {
          residence.value.mapUrl = '';
        }
      }
    );

    watch(() => props.dialogVisible, (isVisible) => {
      if (isVisible) {
        if (props.isEdit && props.residenceEdit) {
          Object.assign(residence.value, props.residenceEdit);
        } else {
          resetForm();
        }
      }
    });

    const closeDialog = () => {
      emit('update:dialogVisible', false);
      setTimeout(() => resetForm(), 300);
    };

    const resetForm = () => {
      residence.value = {
        name: '',
        rut: '',
        region: '',
        city: '',
        commune: '',
        address: '',
        description: '',
        mapUrl: '',
        dateStart: '',
        details: '{\"state\": \"Approved\"}'
      };
    };

    const onSubmit = async () => {
      emit('submitted', residence.value, closeDialog);
    };

    const onRutInput = (value: string | number | null) => {
      if (!value) {
        residence.value.rut = '';
        return;
      }
      residence.value.rut = formatRut(String(value));
    };

    const isValidRut = (val: string) => {
      return validateRut(val);
    };

    return {
      residence,
      internalDialogVisible,
      props,
      communeOptions,
      optionStore,

      onRegionChange,
      onRutInput,
      isValidRut,
      closeDialog,
      onSubmit
    };
  }
});
</script>

<style scoped>
.my-big-dialog {
  width: 50vw;
  max-width: 600px;
}
</style>
