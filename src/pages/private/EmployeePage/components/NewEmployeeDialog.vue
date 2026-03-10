<template>
  <q-dialog v-model="internalVisible" persistent>
    <q-card style="width: 700px; max-width: 95vw; border-radius: 12px;">

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
              v-model="form.run"
              label="RUN *"
              maxlength="12"
              @update:model-value="onRutInput"
              :disable="isEditing"
              :loading="isLoadingRut"
              hint="Ingresa el RUN para habilitar el formulario"
              lazy-rules
              :rules="[
                val => !!val || 'Campo requerido',
                val => isValidRut(val) || 'RUN inválido'
              ]"
              @blur="checkRutInBackend"
            >
              <template v-slot:prepend><q-icon name="fingerprint" color="primary" /></template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-select
              outlined
              v-model="form.employeeRole"
              :options="['Cuidador', 'Director', 'Kinesiólogo', 'Médico', 'Enfermero', 'Nutricionista', 'Podólogo']"
              label="Rol del Trabajador *"
              :disable="isFormDisabled"
              lazy-rules
              :rules="[val => !!val || 'Campo requerido']"
            >
              <template v-slot:prepend><q-icon name="work" color="grey-6" /></template>
            </q-select>
          </div>

          <div class="col-12 q-py-none">
            <q-separator class="q-my-sm opacity-50" />
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              outlined
              v-model="form.firstName"
              label="Primer Nombre *"
              :disable="isFormDisabled"
              lazy-rules
              :rules="[val => !!val || 'Campo requerido']"
            >
              <template v-slot:prepend><q-icon name="person" color="grey-6" /></template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              outlined
              v-model="form.secondName"
              label="Segundo Nombre"
              :disable="isFormDisabled"
            >
              <template v-slot:prepend><q-icon name="person_outline" color="grey-6" /></template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              outlined
              v-model="form.firstSurname"
              label="Apellido Paterno *"
              :disable="isFormDisabled"
              lazy-rules
              :rules="[val => !!val || 'Campo requerido']"
            >
              <template v-slot:prepend><q-icon name="group" color="grey-6" /></template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              outlined
              v-model="form.secondSurname"
              label="Apellido Materno *"
              :disable="isFormDisabled"
              lazy-rules
              :rules="[val => !!val || 'Campo requerido']"
            >
              <template v-slot:prepend><q-icon name="group_add" color="grey-6" /></template>
            </q-input>
          </div>

          <div class="col-12 q-py-none">
            <q-separator class="q-my-sm opacity-50" />
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              outlined
              v-model="form.email"
              label="Correo Electrónico *"
              type="email"
              :disable="isFormDisabled"
              lazy-rules
              :rules="[
                val => !!val || 'Campo requerido',
                val => /.+@.+\..+/.test(val) || 'Correo no válido'
              ]"
            >
              <template v-slot:prepend><q-icon name="email" color="grey-6" /></template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6" v-if="!isEditing">
            <q-input
              outlined
              v-model="form.password"
              :label="isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña Temporal *'"
              :type="showPassword ? 'text' : 'password'"
              :disable="isFormDisabled"
              lazy-rules
              :rules="isEditing ? [] : [val => !!val || 'Campo requerido']"
            >
              <template v-slot:prepend><q-icon name="lock" color="grey-6" /></template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>

        </div>

        <q-separator class="q-mt-lg q-mb-md" />

        <div class="row justify-end q-gutter-sm">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            label="Guardar"
            color="primary"
            type="submit"
          />
        </div>
      </q-form>

    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { Notify, useQuasar } from 'quasar';
import { useRut } from 'src/composables/useRut';
import { useEmployeeStore } from 'stores/employee';
import pinia from 'src/stores';
import { useResidenceStore } from 'stores/residence';

export default defineComponent({
  name: 'EmployeeDialog',
  props: {
    modelValue: { type: Boolean, required: true },
    title: { type: String, required: true },
    employeeEdit: { type: Object, default: null }
  },
  emits: ['update:modelValue', 'submitted'],

  setup(props, { emit }) {
    const $q = useQuasar();
    const { formatRut, validateRut } = useRut();
    const employeeStore = useEmployeeStore(pinia());
    const companyId = JSON.parse(localStorage.getItem('companySelected')!).companyId;
    const residenceStore = useResidenceStore(pinia());
    const employeeIdExists = ref();

    const internalVisible = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val)
    });

    const isEditing = computed(() => !!props.employeeEdit);
    const showPassword = ref(false);

    const isLoadingRut = ref(false);

    const isRutAvailable = ref(false);

    const isFormDisabled = computed(() => {
      if (isEditing.value) return false;

      const isRutValid = validateRut(form.value.run);

      return !isRutValid || isLoadingRut.value || !isRutAvailable.value;
    });

    const form = ref({
      email: '', firstName: '', firstSurname: '', secondName: '',
      secondSurname: '', run: '', employeeRole: '', password: ''
    });

    watch(() => props.modelValue, (isOpen) => {
      if (isOpen) {
        showPassword.value = false;
        isRutAvailable.value = false;
        isLoadingRut.value = false;

        if (props.employeeEdit) {
          form.value = {
            email: props.employeeEdit.email || '',
            firstName: props.employeeEdit.firstName || '',
            firstSurname: props.employeeEdit.firstSurname || '',
            secondName: props.employeeEdit.secondName || '',
            secondSurname: props.employeeEdit.secondSurname || '',
            run: formatRut(props.employeeEdit.run) || '',
            employeeRole: props.employeeEdit.employeeRole || props.employeeEdit.role || '',
            password: ''
          };
        } else {
          form.value = {
            email: '', firstName: '', firstSurname: '', secondName: '',
            secondSurname: '', run: '', employeeRole: '', password: ''
          };
        }
      }
    });

    const onRutInput = (value: string | number | null) => {
      isRutAvailable.value = false;
      if (!value) { form.value.run = ''; return; }
      form.value.run = formatRut(String(value));
    };

    const checkRutInBackend = async () => {
      isRutAvailable.value = false;

      if (!form.value.run || !validateRut(form.value.run) || isEditing.value) return;

      isLoadingRut.value = true;

      const response = await employeeStore.getRunEmployee(form.value.run);
      const existe = response.run;

      if (existe) {
        isRutAvailable.value = false;
        employeeIdExists.value = response.employeeId;
        $q.notify({
          type: 'warning',
          position: 'top',
          icon: 'warning',
          message: 'El RUN ya se encuentra registrado.',
          caption: 'Solo necesitas asociarlo a tu residencia.'
        });

        form.value = {
          email: response.email || '',
          firstName: response.firstName || '',
          firstSurname: response.firstSurname || '',
          secondName: response.secondName || '',
          secondSurname: response.secondSurname || '',
          run: formatRut(response.run) || '',
          employeeRole: response.employeeRole || response.role || '',
          password: ''
        };

      } else {
        isRutAvailable.value = true;
        $q.notify({
          type: 'positive',
          position: 'top',
          icon: 'check_circle',
          message: 'RUN disponible',
          caption: 'Puedes ingresar los datos del trabajador.'
        });
      }
      isLoadingRut.value = false;
    };

    const onSubmit = async () => {
      const payload: any = { ...form.value };
      if (isEditing.value && !payload.password) {
        delete payload.password;
      }

      if (!isRutAvailable.value && !props.employeeEdit) {
        await residenceStore.companyEmployee({
          companyId: companyId,
          employeeId: employeeIdExists.value,
          state: 'Aprobado'
        });
        Notify.create({
          type: 'positive',
          message: 'Trabajador asociado con éxito',
          position: 'top-right',
          timeout: 3000,
        });
        internalVisible.value = false;
        await employeeStore.getEmployeesPagination();
        return;
      }
      emit('submitted', payload);
    };

    return {
      internalVisible,
      form,
      isEditing,
      showPassword,
      isLoadingRut,
      isFormDisabled,

      onRutInput,
      isValidRut: validateRut,
      checkRutInBackend,
      onSubmit
    };
  }
});
</script>
