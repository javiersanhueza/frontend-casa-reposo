<template>
  <q-dialog v-model="internalDialogVisible">
    <q-card class="q-dialog-plugin my-big-dialog">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6 text-grey-7">{{ title }}</div>
          <q-btn flat round dense icon="close" @click="closeDialog" />
        </div>
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="row q-col-gutter-md">

            <div class="col-12 col-md-6">
              <q-input
                dense
                filled
                v-model="residence.name"
                label="Nombre (*)"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                dense
                filled
                v-model="residence.rut"
                label="Rut (*)"
                lazy-rules
                maxlength="12"
                @update:model-value="onRutInput"
                :rules="[
                  (val: string) => !!val || 'Campo requerido',
                  (val: string) => isValidRut(val) || 'El RUT ingresado no es válido'
                ]"
              />
            </div>

            <div class="col-12">
              <q-input
                dense
                filled
                v-model="residence.address"
                label="Dirección (*)"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                dense
                filled
                v-model="residence.region"
                :options="optionStore.regions?.regions"
                option-label="name"
                option-value="name"
                emit-value
                map-options
                label="Región (*)"
                clearable
                lazy-rules
                @clear="residence.region = ''"
                :rules="[(val: string) => !!val || 'Campo requerido']"
                @update:model-value="onRegionChange"
              >
                <template v-slot:selected-item="scope">
                  <div class="ellipsis" style="max-width: 100%;" :title="scope.opt.name">
                    {{ scope.opt.name || scope.opt }}
                  </div>
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label class="ellipsis" :title="scope.opt.name">
                        {{ scope.opt.name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                dense
                filled
                v-model="residence.commune"
                :options="communeOptions"
                option-label="name"
                option-value="name"
                emit-value
                map-options
                label="Comuna (*)"
                clearable
                lazy-rules
                @clear="residence.commune = ''"
                :rules="[(val: string) => !!val || 'Campo requerido']"
                :disable="!residence.region"
              >
                <template v-slot:selected-item="scope">
                  <div class="ellipsis" style="max-width: 100%;" :title="scope.opt.name">
                    {{ scope.opt.name || scope.opt }}
                  </div>
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label class="ellipsis" :title="scope.opt.name">
                        {{ scope.opt.name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-input
                dense
                filled
                v-model="residence.description"
                label="Descripción (*)"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 q-mt-md" v-if="residence.mapUrl">
              <q-card bordered class="my-card shadow-2">
                <q-card-section class="q-pb-none">
                  <div class="text-subtitle2 text-grey-8">Vista Previa de la Ubicación</div>
                </q-card-section>
                <q-card-section>
                  <iframe
                    width="100%"
                    height="300"
                    style="border:0; border-radius: 8px;"
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

        <q-card-actions align="right" class="q-pa-md row no-wrap items-center" :class="{'dialog-actions': $q.screen.xs}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <q-btn outline label="Cancelar" color="white" text-color="primary" @click="closeDialog" />
          <q-btn unelevated label="Aceptar" text-color="white" color="primary" type="submit" />
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

    const communeOptions = computed(() => {
      if (!residence.value.region) return [];

      const selectedRegionObj = optionStore.regions?.regions.find(r => r.name === residence.value.region);

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

    watch(() => props.residenceEdit, (val) => {
      if (props.isEdit && val) {
        residence.value = { ...val };
      }
    }, { immediate: true });

    const closeDialog = () => {
      emit('update:dialogVisible', false);
      resetForm();
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
        details: ''
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
