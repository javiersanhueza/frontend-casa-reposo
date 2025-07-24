<template>
  <div class="column items-center q-mb-md">
    <!-- Área de carga -->
    <div
      v-if="!image"
      class="upload-area flex flex-center column"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <q-btn
        round
        color="primary"
        icon="camera_alt"
        @click="triggerFileInput"
        size="xl"
        class="shadow-2"
      />
      <div class="text-caption q-mt-sm">Upload Photo</div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="onFileChange"
        style="display: none"
      />
    </div>

    <!-- Cropper circular con botón de eliminar en la esquina -->
    <div v-if="image" class="cropper-container">
      <cropper
        class="cropper"
        :src="image"
        :stencil-component="CircleStencil"
        :stencil-props="{ aspectRatio: 1 }"
        :auto-zoom="true"
        :resize-image="true"
        :image-restriction="'stencil'"
        :transform-image="true"
        :move-image="true"
        :zoom-image="true"
        @change="onCrop"
      />
      <q-btn
        round
        dense
        size="xs"
        icon="close"
        color="grey-7"
        class="delete-btn"
        @click="clearImage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default defineComponent({
  name: 'ImageCropper',
  emits: ['cropped'],
  components: {
    Cropper
  },
  setup(_, { emit }) {
    const image = ref<string | null>(null);
    const croppedImage = ref<string | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const onFileChange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        image.value = URL.createObjectURL(file);
      }
    };

    const clearImage = () => {
      image.value = null;
      croppedImage.value = null;

      // Limpia el input de archivo
      if (fileInput.value) {
        fileInput.value.value = '';
      }

      // Notifica al componente padre que se eliminó la imagen
      emit('cropped', null);
    };


    const onDrop = (event: DragEvent) => {
      const file = event.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        image.value = URL.createObjectURL(file);
      }
    };

    const onCrop = ({ canvas }: any) => {
      if (canvas) {
        croppedImage.value = canvas.toDataURL('image/png');
        emit('cropped', croppedImage.value);
      }
    };

    return {
      image,
      croppedImage,
      fileInput,

      clearImage,
      triggerFileInput,
      onFileChange,
      onDrop,
      onCrop,
      CircleStencil,
    };
  },
});
</script>

<style scoped>
.upload-area {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  height: 250px;
  cursor: pointer;
  background-color: #fafafa;
  transition: background-color 0.3s;
}
.upload-area:hover {
  background-color: #f0f0f0;
}
.cropper {
  width: 100%;
  height: auto;
  display: block;
}


.cropper-container {
  position: relative;
  display: inline-block;
  max-width: 300px; /* o el tamaño que prefieras */
  width: 100%;
}


.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
}

</style>





