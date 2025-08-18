<template>
  <div class="row items-center justify-between q-mb-sm">
    <div class="text-h6 text-primary">Archivos adjuntos</div>
    <q-btn flat icon="attach_file" color="secondary" @click="openDialog">
      <q-tooltip>Adjuntar archivo</q-tooltip>
    </q-btn>
  </div>

  <!-- Lista de archivos existentes -->
  <div v-if="attachments?.length">
    <div v-if="attachments.length">
      <q-list bordered separator>
        <q-item v-for="file in paginatedAttachments" :key="file.id">
          <q-item-section>
            <div class="text-grey-8"><strong>{{ file.title }}</strong></div>
            <div class="text-grey-7">{{ file.description }}</div>
          </q-item-section>

          <q-item-section side>
            <q-btn flat icon="download" @click="downloadFile(file)" round dense>
              <q-tooltip>Descargar</q-tooltip>
            </q-btn>
            <q-btn flat icon="delete" color="negative" @click="confirmDelete(file)" round dense>
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="q-mt-md flex justify-center">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          max-pages="5"
          boundary-numbers
          size="sm"
          color="primary"
        />
      </div>
    </div>
  </div>
  <div v-else class="text-grey-7">No hay archivos adjuntos</div>

  <new-file-dialog v-model:show-dialog="showAttachForm" />

  <confirm-dialog
    v-model:show-dialog="showDelete"
    :title="`Eliminar ${fileSelected?.title}`"
    text="¿Estás seguro de eliminar este archivo?"
    @accept="deleteFile"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import NewFileDialog from 'pages/private/ClinicalHistoryPage/components/NewFileDialog.vue';
import { useFileAttachmentStore } from 'stores/fileAttachment';
import pinia from 'src/stores';
import { useRoute } from 'vue-router';
import ConfirmDialog from 'components/ConfirmDialog.vue';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'FileAttachmentClinicalHistory',
  components: { ConfirmDialog, NewFileDialog },

  setup() {
    const route = useRoute();
    const residentId = route.params.idResident;
    const showAttachForm = ref(false);
    const showDelete = ref(false);
    const fileAttachmentStore = useFileAttachmentStore(pinia());
    const fileSelected = ref();

    const currentPage = ref(1)
    const pageSize = 5

    const attachments = computed(() => fileAttachmentStore.files ?? [])

    const paginatedAttachments: any = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      return attachments.value.slice(start, start + pageSize)
    })

    const totalPages = computed(() => Math.ceil(attachments.value.length / pageSize))

    const openDialog = () => {
      showAttachForm.value = true;
    };

    const downloadFile = (file: any) => {
      window.open(file.url, '_blank');
    };

    const confirmDelete = (file: any) => {
      fileSelected.value = file;
      showDelete.value = true;
    };

    const deleteFile = async () => {
      const response = await fileAttachmentStore.deleteFile(fileSelected.value.id);

      if (response) {
        Notify.create({
          type: 'positive',
          message: response.message,
          position: 'top',
          timeout: 3000,
        });

        await fileAttachmentStore.getFiles(Number(residentId), 'clinical-history');
        showDelete.value = false;
      }
    }

    onMounted(async () => {
      await fileAttachmentStore.getFiles(
        Number(residentId),
        'clinical-history'
      );
    });

    return {
      attachments,
      showDelete,
      showAttachForm,
      fileSelected,
      currentPage,
      paginatedAttachments,
      totalPages,

      confirmDelete,
      deleteFile,
      openDialog,
      downloadFile,
    };
  },
});
</script>
