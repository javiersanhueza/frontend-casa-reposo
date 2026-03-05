<template>
  <q-page class="bg-grey-2 q-pa-md q-pa-lg-xl">
    <div class="row justify-center">
      <div class="col-12">

        <q-card class="shadow-2 q-mb-md" style="border-radius: 12px;">
          <div class="bg-primary text-white q-pa-lg row items-center" style="border-radius: 12px 12px 0 0;">
            <div class="relative-position">
              <q-avatar size="90px" color="white" text-color="primary" class="shadow-3 text-h3 text-weight-bold">
                {{ userInitials }}
              </q-avatar>
              <q-btn
                round
                color="secondary"
                icon="photo_camera"
                size="sm"
                class="absolute-bottom-right shadow-2"
                style="transform: translate(25%, 25%);"
              />
            </div>

            <div class="q-ml-lg">
              <div class="text-h5 text-weight-bold">{{ userProfile.firstName }} {{ userProfile.firstSurname }}</div>
              <div class="text-subtitle1 opacity-80">{{ userProfile.email }}</div>
            </div>
          </div>

          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey-7 bg-white"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="personal" icon="person" label="Datos Personales" />
            <q-tab name="contact" icon="contact_mail" label="Contacto y Ubicación" />
          </q-tabs>
        </q-card>

        <q-card class="shadow-2" style="border-radius: 12px;">
          <q-tab-panels v-model="activeTab" animated class="bg-white" style="border-radius: 12px;">

            <q-tab-panel name="personal" class="q-pa-lg">
              <q-form @submit.prevent="saveProfile">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="userProfile.firstName" label="Primer Nombre" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="userProfile.secondName" label="Segundo Nombre" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="userProfile.firstSurname" label="Apellido Paterno" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="userProfile.secondSurname" label="Apellido Materno" />
                  </div>

                  <div class="col-12 col-md-4">
                    <q-input outlined v-model="userProfile.run" label="RUN" disable hint="El RUN no puede ser modificado">
                      <template v-slot:prepend><q-icon name="fingerprint" color="grey-6" /></template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-4">
                    <q-select outlined v-model="userProfile.gender" :options="['Masculino', 'Femenino', 'Otro']" label="Género" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input outlined type="date" v-model="userProfile.dateBirth" label="Fecha de Nacimiento" />
                  </div>
                </div>

                <div class="row justify-end q-mt-lg">
                  <q-btn unelevated color="primary" icon="save" label="Guardar Cambios" type="submit" />
                </div>
              </q-form>
            </q-tab-panel>

            <q-tab-panel name="contact" class="q-pa-lg">
              <q-form @submit.prevent="saveProfile">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="userProfile.email" label="Correo Electrónico" disable>
                      <template v-slot:prepend><q-icon name="email" color="grey-6" /></template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="userProfile.phone" label="Teléfono Móvil" mask="+56 9 #### ####">
                      <template v-slot:prepend><q-icon name="smartphone" color="grey-6" /></template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="userProfile.address" label="Dirección">
                      <template v-slot:prepend><q-icon name="signpost" color="grey-6" /></template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-3">
                    <q-select
                      outlined
                      v-model="userProfile.region"
                      :options="optionStore.regions?.regions"
                      option-label="name"
                      option-value="name"
                      emit-value
                      map-options
                      label="Región"
                      clearable
                    >
                      <template v-slot:prepend><q-icon name="map" color="grey-6" /></template>
                    </q-select>
                  </div>

                  <div class="col-12 col-md-3">
                    <q-select
                      outlined
                      v-model="userProfile.commune"
                      :options="communeOptions"
                      option-label="name"
                      option-value="name"
                      emit-value
                      map-options
                      label="Comuna"
                      clearable
                      :disable="!userProfile.region"
                    >
                      <template v-slot:prepend><q-icon name="location_city" color="grey-6" /></template>
                    </q-select>
                  </div>
                </div>

                <div class="row justify-end q-mt-lg">
                  <q-btn unelevated color="primary" icon="save" label="Actualizar Contacto" type="submit" />
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useOptionStore } from 'stores/option';
// 1. Importamos tu UserStore
import { useUserStore } from 'stores/user';
import pinia from 'src/stores';

export default defineComponent({
  name: 'UserProfile',

  setup() {
    const $q = useQuasar();
    const optionStore = useOptionStore(pinia());
    const userStore = useUserStore(pinia());

    const activeTab = ref('personal');
    const isLoadingData = ref(false);

    const userProfile = ref<any>({
      firstName: '', secondName: '', firstSurname: '', secondSurname: '',
      run: '', gender: 'Masculino', dateBirth: '', nationality: 'Chilena',
      phone: '', region: '', commune: '', city: '', address: '', email: '',
      userId: null
    });

    const passwords = ref({ current: '', new: '' });

    const userInitials = computed(() => {
      const first = userProfile.value.firstName ? userProfile.value.firstName.charAt(0).toUpperCase() : '';
      const last = userProfile.value.firstSurname ? userProfile.value.firstSurname.charAt(0).toUpperCase() : '';
      return `${first}${last}` || 'U';
    });

    const communeOptions = computed(() => {
      if (!userProfile.value.region) return [];
      const allRegions = optionStore.regions?.regions || [];
      const selectedRegionObj = allRegions.find(r => r.name === userProfile.value.region);
      return selectedRegionObj ? selectedRegionObj.communes : [];
    });

    watch(() => userProfile.value.region, (newRegion, oldRegion) => {
      if (oldRegion && newRegion !== oldRegion && !isLoadingData.value) {
        userProfile.value.commune = '';
      }
    });

    onMounted(async () => {
      await Promise.all([
        optionStore.getComunasRegiones(),
        userStore.getProfile()
      ]);
      const data = userStore.profile;

      let extractedPhone = '';
      if (data.phones && Array.isArray(data.phones) && data.phones.length > 0) {
        extractedPhone = data.phones[0];
      }

      let extractedDate = '';
      if (data.dateBirth) {
        extractedDate = data.dateBirth.split('T')[0];
      }

      userProfile.value = {
        ...data,
        dateBirth: extractedDate,
        phone: extractedPhone,
        city: data.city || data.commune || '',
        region: data.region || ''
      };
    });

    const saveProfile = async () => {
      let isoDate = '';
      if (userProfile.value.dateBirth) {
        isoDate = new Date(`${userProfile.value.dateBirth}T12:00:00`).toISOString();
      }

      const payloadToSubmit = {
        gender: userProfile.value.gender,
        nationality: userProfile.value.nationality,
        firstName: userProfile.value.firstName,
        firstSurname: userProfile.value.firstSurname,
        secondName: userProfile.value.secondName,
        secondSurname: userProfile.value.secondSurname,
        city: userProfile.value.city || userProfile.value.commune,
        commune: userProfile.value.commune,
        address: userProfile.value.address,
        dateBirth: isoDate,
        phones: JSON.stringify({ list: [userProfile.value.phone] })
      };

      await userStore.updateProfile(payloadToSubmit);

      const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedLocal = {
        ...currentUserData,
        firstName: userProfile.value.firstName,
        firstSurname: userProfile.value.firstSurname,
      };
      localStorage.setItem('user', JSON.stringify(updatedLocal));

      window.dispatchEvent(new Event('user-profile-updated'));

      $q.notify({
        type: 'positive',
        message: 'Perfil actualizado correctamente'
      });
    };

    return {
      activeTab,
      userProfile,
      passwords,
      userInitials,
      optionStore,
      communeOptions,
      saveProfile
    };
  }
});
</script>

<style scoped>
.opacity-80 {
  opacity: 0.8;
}
</style>
