<template>
  <q-dialog v-model="internalDialog" persistent>
    <q-card class="">
      <q-card-section class="row">
        <div class="text-h6 text-grey-7 q-mr-lg">{{ title }}</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="internalDialog = false" />
      </q-card-section>

      <q-card-section class="text-grey-9">
        {{ text }}
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md row no-wrap items-center" :class="{'dialog-actions': $q.screen.xs}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <q-btn outline label="Cancelar" color="white" text-color="purple-6" @click="internalDialog = false" />
        <q-btn unelevated label="Aceptar" text-color="white" class="background-header" @click="actionAccept()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'ConfirmDialog',

  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    title: {
      type: String
    },
    text: {
      type: String
    }
  },

  emits: ['update:showDialog', 'accept'],

  setup(props, { emit }) {
    const internalDialog = ref(props.showDialog);

    watch(() => props.showDialog, (newVal) => {
      internalDialog.value = newVal;
    });

    watch(internalDialog, (newVal) => {
      emit('update:showDialog', newVal);
    });

    const actionAccept = () => {
      emit('accept');
    }

    return {
      internalDialog,
      actionAccept
    }
  }
})
</script>
