<template>
  <q-dialog v-model="internalVisible" persistent>
    <q-card style="width: 500px; max-width: 90vw; border-radius: 12px;">

      <q-card-section class="bg-primary text-white row items-center q-pb-md">
        <div class="text-h6 text-weight-bold">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit.prevent="onSubmit" class="q-pa-md">
        <div class="row q-col-gutter-md">

          <div class="col-12 col-sm-6">
            <q-input
              outlined
              v-model="form.firstName"
              label="Primer Nombre *"
              lazy-rules
              :rules="[val => !!val || 'Campo requerido']"
            >
              <template v-slot:prepend><q-icon name="person" color="grey-6" /></template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              outlined
              v-model="form.firstSurname"
              label="Apellido Paterno *"
              lazy-rules
              :rules="[val => !!val || 'Campo requerido']"
            >
              <template v-slot:prepend><q-icon name="group" color="grey-6" /></template>
            </q-input>
          </div>

          <div class="col-12">
            <q-input
              outlined
              v-model="form.run"
              label="RUN *"
              maxlength="12"
              @update:model-value="onRutInput"
              :disable="isEditing"
              hint="Ej: 12.345.678-9"
              lazy-rules
              :rules="[
                val => !!val || 'Campo requerido',
                val => isValidRut(val) || 'RUN inválido'
              ]"
            >
              <template v-slot:prepend><q-icon name="fingerprint" color="grey-6" /></template>
            </q-input>
          </div>

          <div class="col-12">
            <q-select
              outlined
              v-model="form.role"
              :options="['Enfermero', 'TENS', 'Médico', 'Cuidador', 'Administrativo']"
              label="Rol del Trabajador *"
              lazy-rules
              :rules="[val => !!val || 'Campo requerido']"
            >
              <template v-slot:prepend><q-icon name="work" color="grey-6" /></template>
            </q-select>
          </div>

        </div>

        <q-separator class="q-mt-md q-mb-sm" />

        <div class="row justify-end q-gutter-sm">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
          <q-btn unelevated label="Guardar Trabajador" color="primary" type="submit" />
        </div>
      </q-form>

    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRut } from 'src/composables/useRut';

export default defineComponent({
  name: 'EmployeeDialog',
  props: {
    modelValue: { type: Boolean, required: true },
    title: { type: String, required: true },
    employeeEdit: { type: Object, default: null }
  },
  emits: ['update:modelValue', 'submitted'],

  setup(props, { emit }) {
    const { formatRut, validateRut } = useRut();

    const internalVisible = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val)
    });

    const isEditing = computed(() => !!props.employeeEdit);

    const form = ref({
      firstName: '',
      firstSurname: '',
      run: '',
      role: ''
    });

    watch(() => props.modelValue, (isOpen) => {
      if (isOpen) {
        if (props.employeeEdit) {
          form.value = {
            firstName: props.employeeEdit.firstName || '',
            firstSurname: props.employeeEdit.firstSurname || '',
            run: formatRut(props.employeeEdit.run) || '',
            role: props.employeeEdit.role || ''
          };
        } else {
          // Reset para Crear
          form.value = { firstName: '', firstSurname: '', run: '', role: '' };
        }
      }
    });

    const onRutInput = (value: string | number | null) => {
      if (!value) { form.value.run = ''; return; }
      form.value.run = formatRut(String(value));
    };

    const onSubmit = () => {
      // Enviamos el payload al padre (EmployeesPage.vue)
      emit('submitted', { ...form.value });
    };

    return {
      internalVisible,
      form,
      isEditing,
      onRutInput,
      isValidRut: validateRut,
      onSubmit
    };
  }
});
</script>
