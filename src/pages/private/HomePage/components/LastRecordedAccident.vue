<template>
  <q-card class="bg-blue-6" flat style="border-radius: 10px; height: 100%">
    <q-card-section class="text-white">
      <div class="text-center text-subtitle2">ÚLTIMO ACCIDENTE REGISTRADO</div>
      <div class="row q-mt-md">
        <div class="col-4">FECHA<br /><br /></div>
        <div
          class="col-8 bg-white text-grey-7 q-px-sm"
          style="border-radius: 10px; display: flex; align-items: center"
        >
          25/07/2022
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-4">NOMBRE<br /><br /></div>
        <div
          class="col-8 bg-white text-grey-7 q-px-sm"
          style="border-radius: 10px; display: flex; align-items: center"
        >
          JUAN FLORES
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-4">EMPRESA<br /><br /></div>
        <div
          class="col-8 bg-white text-grey-7 q-px-sm"
          style="border-radius: 10px; display: flex; align-items: center"
        >
          EMPRESA 3
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-4">AREA<br /><br /></div>
        <div
          class="col-8 bg-white text-grey-7 q-px-sm"
          style="border-radius: 10px; display: flex; align-items: center"
        >
          AREA 1
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-4">CAUSA DEL ACCIDENTE</div>
        <div
          class="col-8 bg-white text-grey-7 q-px-sm"
          style="border-radius: 10px; display: flex; align-items: center"
        >
          TRAUMATISMO SUPERFICIAL
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-4">PARTE AFECTADA</div>
        <div
          class="col-8 bg-white text-grey-7 q-px-sm"
          style="border-radius: 10px; display: flex; align-items: center"
        >
          COLUMNA VERTEBRAL
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-4">DIAS DM<br /><br /></div>
        <div
          class="col-8 bg-white text-grey-7 q-px-sm"
          style="border-radius: 10px; display: flex; align-items: center"
        >
          4
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'LastRecordedAccidentComponent',
})
</script>
