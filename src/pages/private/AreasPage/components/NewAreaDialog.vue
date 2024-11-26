<template>
  <q-dialog v-model="internalDialog" :full-width="$q.screen.xs" :full-height="$q.screen.xs">
    <q-card class="q-dialog-plugin" :class="{'dialog-fullscreen': $q.screen.xs}">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6 text-grey-7">{{ title }}</div>
          <q-btn flat round dense icon="close" @click="internalDialog = false" />
        </div>
      </q-card-section>
      <q-card-section class="dialog-content">
        <q-form ref="areaForm">
          <q-input
            v-model="name"
            label="Nombre"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Campo requerido'
            ]"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md row no-wrap items-center" :class="{'dialog-actions': $q.screen.xs}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <q-btn outline label="Cancelar" color="white" text-color="purple-6" @click="internalDialog = false" />
        <q-btn unelevated label="Aceptar" class="background-header" text-color="white" @click="submitForm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Notify, QForm } from 'quasar';

import { rutMixin } from 'src/mixins/rutMixin';
import pinia from 'src/stores';
import { useAreaStore } from 'stores/area';

export default defineComponent({
  name: 'NewAreasDialog',

  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    areaName: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    areaId: {
      type: Number
    },
  },

  mixins: [rutMixin],

  emits: ['update:showDialog', 'accept'],

  setup(props, { emit }) {
    const internalDialog = ref(props.showDialog);
    const name = ref<string>('');
    const areaForm = ref<QForm | null>(null);

    const areaStore = useAreaStore(pinia());

    watch(() => props.showDialog, (newVal) => {
      internalDialog.value = newVal;

      name.value = props.areaName ? props.areaName : '';
    });

    watch(internalDialog, (newVal) => {
      emit('update:showDialog', newVal);
    });

    const closeDialog = () => {
      internalDialog.value = false;
    };

    const submitForm = () => {
      if (areaForm.value) {
        areaForm.value.validate().then((valid: boolean) => {
          if (valid) {
            acceptAction();
          }
        });
      }
    };

    const acceptAction = async () => {
      if (!props.isEdit) {
        const res = await areaStore.createAreaForCompany(name.value);

        if (!!res?.area) {
          Notify.create({
            type: 'positive',
            message: 'Empresa creada con éxito',
            position: 'top',
            timeout: 3000
          });

          name.value = '';

          emit('accept');
          closeDialog();
        }
      } else {
        const res = await areaStore.editAreaForCompany(name.value, props.areaId!);

        if (!!res.area) {
          Notify.create({
            type: 'positive',
            message: 'Empresa editada con éxito',
            position: 'top',
            timeout: 3000
          });

          name.value = '';

          emit('accept');
          closeDialog();
        }
      }
    };

    const onSubmit = () => {
      submitForm();
    };

    return {
      internalDialog,
      name,
      areaForm,

      onSubmit,
      closeDialog,
      submitForm,
      acceptAction
    };
  }
});
</script>
