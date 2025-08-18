<template>
  <q-dialog v-model="internalDialog" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center">
        <div class="row items-center justify-between">
          <div class="text-h6 text-grey-7">Adjuntar archivo</div>
        </div>
      </q-card-section>

      <q-form @submit.prevent="uploadFile">
        <q-card-section>
          <q-input
            v-model="newFile.title"
            label="Título del archivo (*)"
            outlined
            dense
            class="q-mb-sm"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          />
          <q-input
            v-model="newFile.description"
            label="Descripción (*)"
            type="textarea"
            outlined
            dense
            class="q-mb-sm"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          />

          <q-file
            outlined
            dense
            v-model="newFile.file"
            label="Seleccionar archivo (*)"
            stack-label
            accept=".pdf,.jpg,.png,.doc,.docx"
            :rules="[(val) => !!val || 'Campo requerido']"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="q-pa-md row no-wrap items-center"
          :class="{ 'dialog-actions': $q.screen.xs }"
          style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px"
        >
          <q-btn
            outline
            label="Cancelar"
            color="primary"
            text-color="primary"
            @click="
              internalDialog = false;
              resetForm();
            "
          />
          <q-btn
            unelevated
            label="Aceptar"
            text-color="white"
            color="primary"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useFileAttachmentStore } from 'stores/fileAttachment';
import pinia from 'src/stores';
import { useRoute } from 'vue-router';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'NewFileDialog',

  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },

  emits: ['update:showDialog'],

  setup(props, { emit }) {
    const route = useRoute();
    const residentId = route.params.idResident;
    const internalDialog = ref(props.showDialog);
    const fileAttachmentStore = useFileAttachmentStore(pinia());

    watch(() => props.showDialog, (newVal) => {
      internalDialog.value = newVal;
    });

    watch(internalDialog, (newVal) => {
      emit('update:showDialog', newVal);
    });

    const newFile = ref({
      title: '',
      description: '',
      file: null,
      type: 'clinical-history'
    });

    const uploadFile = async () => {
      const response = await fileAttachmentStore.uploadFile({ ...newFile.value, residentId });

      if (response) {
        Notify.create({
          type: 'positive',
          message: 'Archivo adjuntado con éxito',
          position: 'top',
          timeout: 3000
        });
        await fileAttachmentStore.getFiles(Number(residentId), 'clinical-history');
        internalDialog.value = false;
        resetForm();
      }
    };

    const resetForm = () => {
      newFile.value = {
        title: '',
        description: '',
        file: null,
        type: 'clinical-history'
      }
    }



    return {
      internalDialog,
      newFile,

      uploadFile,
      resetForm
    }
  }
})
</script>
