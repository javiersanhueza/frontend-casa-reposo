<template>
  <q-dialog v-model="internalDialogVisible" persistent>
    <q-card style="width: 850px; max-width: 95vw;" class="q-dialog-plugin rounded-borders">

      <q-toolbar class="bg-primary text-white q-py-sm">
        <q-avatar>
          <q-icon name="admin_panel_settings" size="md" />
        </q-avatar>
        <q-toolbar-title class="text-weight-bold text-subtitle1">
          {{ title }}
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup @click="closeDialog">
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-form @submit="onSubmit">
        <q-card-section class="scroll" style="max-height: 75vh;">
          <div class="row q-col-gutter-md">

            <div class="col-12 text-subtitle2 text-primary text-uppercase text-weight-bold q-mt-sm row items-center">
              <q-icon name="badge" class="q-mr-sm" size="20px" /> Datos Personales
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="owner.firstName"
                label="Primer Nombre *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="person" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="owner.secondName"
                label="Segundo Nombre"
              >
                <template v-slot:prepend><q-icon name="person_outline" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="owner.firstSurname"
                label="Apellido Paterno *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="group" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="owner.secondSurname"
                label="Apellido Materno *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="group_add" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-input
                outlined
                v-model="owner.run"
                label="RUN *"
                maxlength="12"
                :disable="isEditing"
                @update:model-value="onRutInput"
                lazy-rules
                :rules="[
                  (val: string) => !!val || 'Campo requerido',
                  (val: string) => isValidRut(val) || 'RUN inválido'
                ]"
              >
                <template v-slot:prepend><q-icon name="fingerprint" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-select
                outlined
                v-model="owner.gender"
                :options="['Masculino', 'Femenino', 'Otro']"
                label="Género *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="wc" color="grey-6" /></template>
              </q-select>
            </div>

            <div class="col-12 col-md-4">
              <q-input
                outlined
                type="date"
                v-model="owner.dateBirth"
                label="Fecha de Nacimiento *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="cake" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-select
                outlined
                v-model="owner.nationality"
                :options="['Chilena', 'Extranjera']"
                label="Nacionalidad *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="public" color="grey-6" /></template>
              </q-select>
            </div>


            <div class="col-12 text-subtitle2 text-primary text-uppercase text-weight-bold q-mt-lg row items-center">
              <q-icon name="place" class="q-mr-sm" size="20px" /> Contacto y Ubicación
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="owner.phone"
                label="Teléfono Móvil *"
                mask="+56 9 #### ####"
                placeholder="+56 9 1234 5678"
                lazy-rules
                :rules="[(val: string) => val.length === 15 || 'Teléfono incompleto']"
              >
                <template v-slot:prepend><q-icon name="smartphone" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                outlined
                v-model="owner.region"
                :options="optionStore.regions?.regions"
                option-label="name"
                option-value="name"
                emit-value
                map-options
                label="Región *"
                clearable
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="map" color="grey-6" /></template>
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                outlined
                v-model="owner.commune"
                :options="communeOptions"
                option-label="name"
                option-value="name"
                emit-value
                map-options
                label="Comuna *"
                clearable
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
                :disable="!owner.region"
              >
                <template v-slot:prepend><q-icon name="location_city" color="grey-6" /></template>
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="owner.address"
                label="Dirección *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="signpost" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 text-subtitle2 text-primary text-uppercase text-weight-bold q-mt-lg row items-center">
              <q-icon name="security" class="q-mr-sm" size="20px" /> Credenciales de Acceso
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="owner.email"
                label="Correo Electrónico *"
                type="email"
                lazy-rules
                :rules="[
                  (val: string) => !!val || 'Campo requerido',
                  (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Correo inválido'
                ]"
              >
                <template v-slot:prepend><q-icon name="email" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="owner.password"
                :label="isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña Temporal *'"
                :type="showPassword ? 'text' : 'password'"
                lazy-rules
                :rules="isEditing ? [] : [(val: string) => !!val || 'Campo requerido']"
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

            <div class="col-12 col-md-6">
              <q-select
                outlined
                v-model="owner.ownerRole"
                :options="['Administrador Residencia', 'Dueño Residencia']"
                label="Rol *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="manage_accounts" color="grey-6" /></template>
              </q-select>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="bg-grey-1 q-px-lg q-py-md">
          <q-btn flat label="Cancelar" color="grey-8" class="q-px-md" @click="closeDialog" />
          <q-btn unelevated label="Guardar" color="primary" icon="save" type="submit" class="q-px-md q-ml-sm" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useOptionStore } from 'stores/option';
import pinia from 'src/stores';
import { useRut } from 'src/composables/useRut';

export default defineComponent({
  name: 'CreateOwnerDialog',

  props: {
    dialogVisible: { type: Boolean, required: true },
    title: { type: String, required: true },
    ownerEdit: { type: Object, default: () => ({}) }
  },

  emits: ['update:dialogVisible', 'submitted'],

  setup(props, { emit }) {
    const optionStore = useOptionStore(pinia());
    const { formatRut, validateRut } = useRut();

    const showPassword = ref(false);

    const isEditing = computed(() => Object.keys(props.ownerEdit || {}).length > 0);

    const owner = ref({
      firstName: '',
      secondName: '',
      firstSurname: '',
      secondSurname: '',
      run: '',
      gender: 'Masculino',
      dateBirth: '',
      nationality: 'Chilena',
      phone: '',
      region: '',
      commune: '',
      address: '',
      email: '',
      password: '',
      ownerRole: ''
    });

    const communeOptions = computed(() => {
      if (!owner.value.region) return [];
      const allRegions = optionStore.regions?.regions || [];
      if (allRegions.length === 0) return [];
      const selectedRegionObj = allRegions.find(r => r.name === owner.value.region);
      return selectedRegionObj ? selectedRegionObj.communes : [];
    });

    watch(() => owner.value.region, (newRegion, oldRegion) => {
      // Solo limpiamos la comuna si no estamos cargando datos de edición inicialmente
      if (oldRegion && newRegion !== oldRegion && !isLoadingEditData.value) {
        owner.value.commune = '';
      }
    });

    const internalDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (val: boolean) => emit('update:dialogVisible', val)
    });

    // Bandera auxiliar para no borrar la comuna al poblar el form
    const isLoadingEditData = ref(false);

    watch(() => props.dialogVisible, (isVisible) => {
      if (isVisible) {
        if (isEditing.value) {
          populateForm();
        } else {
          resetForm();
        }
      }
    });

    const populateForm = () => {
      isLoadingEditData.value = true;
      const data = props.ownerEdit;

      // Extraer teléfono del JSON String si existe
      let extractedPhone = '';
      if (data.phones) {
        try {
          const parsed = JSON.parse(data.phones);
          extractedPhone = parsed.list?.[0] || '';
        } catch (e) {
          extractedPhone = data.phones; // Fallback por si acaso no es JSON
        }
      }

      // Convertir fecha de ISO a YYYY-MM-DD
      let extractedDate = '';
      if (data.dateBirth) {
        // Asumiendo formato "1963-05-29T12:00:00.000Z" -> "1963-05-29"
        extractedDate = data.dateBirth.split('T')[0];
      }

      owner.value = {
        firstName: data.firstName || '',
        secondName: data.secondName || '',
        firstSurname: data.firstSurname || '',
        secondSurname: data.secondSurname || '',
        run: formatRut(data.run) || '',
        gender: data.gender || 'Masculino',
        dateBirth: extractedDate,
        nationality: data.nationality || 'Chilena',
        phone: extractedPhone,
        region: data.region || '',
        commune: data.commune || '',
        address: data.address || '',
        email: data.email || '',
        password: '', // En edición no mostramos el password actual
        ownerRole: data.subRole || data.ownerRole || '' // Ajustar según venga en tu backend
      };

      // Damos tiempo a que Vue actualice los v-model antes de bajar la bandera
      setTimeout(() => { isLoadingEditData.value = false; }, 100);
    };

    const closeDialog = () => {
      emit('update:dialogVisible', false);
      setTimeout(() => resetForm(), 300);
    };

    const resetForm = () => {
      owner.value = {
        firstName: '', secondName: '', firstSurname: '', secondSurname: '',
        run: '', gender: 'Masculino', dateBirth: '', nationality: 'Chilena',
        phone: '', region: '', commune: '', address: '',
        email: '', password: '', ownerRole: ''
      };
      showPassword.value = false;
    };

    const onSubmit = () => {
      let isoDate = '';
      if (owner.value.dateBirth) {
        // Verificamos si ya está en formato ISO, si no, lo convertimos
        isoDate = owner.value.dateBirth.includes('T')
          ? owner.value.dateBirth
          : new Date(`${owner.value.dateBirth}T12:00:00`).toISOString();
      }

      const payloadToSubmit: any = {
        email: owner.value.email,
        gender: owner.value.gender,
        nationality: owner.value.nationality,
        firstName: owner.value.firstName,
        firstSurname: owner.value.firstSurname,
        secondName: owner.value.secondName,
        secondSurname: owner.value.secondSurname,
        address: owner.value.address,
        commune: owner.value.commune,
        city: owner.value.commune,
        region: owner.value.region,
        dateBirth: isoDate,
        phones: JSON.stringify({ list: [owner.value.phone] }),
        run: owner.value.run,
        ownerRole: owner.value.ownerRole,
        details: JSON.stringify({ state: 'Approved' })
      };

      // Si es creación enviamos contraseña, si es edición y llenó el campo, también
      if (!isEditing.value || (isEditing.value && owner.value.password)) {
        payloadToSubmit.password = owner.value.password;
      }

      // Si estamos editando, agregamos el userId para que el backend sepa a quién actualizar
      if (isEditing.value && props.ownerEdit.userId) {
        payloadToSubmit.userId = props.ownerEdit.userId;
      }

      emit('submitted', payloadToSubmit);
    };

    const onRutInput = (value: string | number | null) => {
      if (!value) { owner.value.run = ''; return; }
      owner.value.run = formatRut(String(value));
    };

    const isValidRut = (val: string) => validateRut(val);

    return {
      owner,
      internalDialogVisible,
      showPassword,
      communeOptions,
      optionStore,
      isEditing, // Exportamos la bandera para usarla en el Template
      onRutInput,
      isValidRut,
      closeDialog,
      onSubmit
    };
  }
});
</script>
