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
        <q-form ref="employeeForm">
          <q-input
            v-model="newEmployee.firstName"
            label="Nombres"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Campo requerido'
            ]"
          />
          <div class="row">
            <div class="col-md-6 q-pr-sm">
              <q-input
                v-model="newEmployee.paternalSurname"
                label="Apellido Paterno"
                lazy-rules
                :rules="[
                val => val && val.length > 0 || 'Campo requerido'
                ]"
              />
            </div>
            <div class="col-md-6">
              <q-input
                v-model="newEmployee.maternalSurname"
                label="Apellido Materno"
                lazy-rules
                :rules="[
                  val => val && val.length > 0 || 'Campo requerido'
                ]"
              />
            </div>
          </div>
          <q-input
            v-model="newEmployee.rut"
            label="Rut"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Campo requerido',
              val => validateRut(val) || 'RUT inválido'
            ]"
            @update:model-value="newEmployee.rut = formatRut($event)"
            :disable="isEdit"
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
import { NewEmployee } from 'src/interfaces/employees.interface';
import { useEmployeeStore } from 'stores/employee';

export default defineComponent({
  name: 'NewEmployeeDialog',

  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    employeeEdit: {
      type: Object
    }
  },

  mixins: [rutMixin],

  emits: ['update:showDialog', 'accept'],

  setup(props, { emit }) {
    const internalDialog = ref(props.showDialog);
    const newEmployee = ref<NewEmployee>({
      firstName: '',
      paternalSurname: '',
      maternalSurname: '',
      rut: ''
    });
    const employeeForm = ref<QForm | null>(null);

    const employeeStore = useEmployeeStore(pinia());

    watch(() => props.showDialog, (newVal) => {
      internalDialog.value = newVal;
      newEmployee.value = {
        firstName: props.employeeEdit?.firstName,
        paternalSurname: props.employeeEdit?.paternalSurname,
        maternalSurname: props.employeeEdit?.maternalSurname,
        rut: props.employeeEdit?.rut
      }
    });

    watch(internalDialog, (newVal) => {
      emit('update:showDialog', newVal);
    });

    const closeDialog = () => {
      internalDialog.value = false;
    };

    const submitForm = () => {
      if (employeeForm.value) {
        employeeForm.value.validate().then((valid: boolean) => {
          if (valid) {
            acceptAction();
          }
        });
      }
    };

    const acceptAction = async () => {
      if (!props.isEdit) {
        const res = await employeeStore.createEmployee(newEmployee.value);

        if (!!res?.employee) {
          Notify.create({
            type: 'positive',
            message: 'Trabajador registrado con éxito',
            position: 'top',
            timeout: 3000
          });

          newEmployee.value = {
            firstName: '',
            paternalSurname: '',
            maternalSurname: '',
            rut: ''
          };

          emit('accept');
          closeDialog();
        }
      } else {
        console.log(newEmployee.value);
        const res = await employeeStore.editEmployee(newEmployee.value, props.employeeEdit!.id);

        if (!!res.employee) {
          Notify.create({
            type: 'positive',
            message: 'Empresa editada con éxito',
            position: 'top',
            timeout: 3000
          });

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
      newEmployee,
      employeeForm,

      onSubmit,
      closeDialog,
      submitForm,
      acceptAction
    };
  }
});
</script>
