<template>
  <q-page class="flex flex-center portal-bg q-pa-md">
    <q-card class="shadow-4" style="width: 100%; max-width: 550px; border-radius: 16px;">

      <q-card-section class="bg-primary text-white q-py-lg text-center" style="border-radius: 16px 16px 0 0;">
        <q-avatar size="72px" color="white" text-color="primary" icon="domain" class="q-mb-md shadow-2" />
        <div class="text-h5 text-weight-bold letter-spacing-1">Cambiar de Residencia</div>
        <div class="text-subtitle2 text-white-8 q-mt-xs">
          Selecciona tu espacio de trabajo principal
        </div>
      </q-card-section>

      <q-card-section class="q-px-lg q-pt-lg q-pb-sm">
        <q-input
          outlined
          dense
          v-model="searchQuery"
          placeholder="Buscar residencia por nombre..."
          class="q-mb-md"
          clearable
          color="primary"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-px-lg q-pb-lg q-pt-none scroll" style="max-height: 50vh;">
        <q-list class="q-gutter-y-sm">

          <q-item
            v-for="company in filteredCompanies"
            :key="company.companyId"
            clickable
            v-ripple
            class="company-item rounded-borders q-pa-md transition-ease"
            :class="isCurrentCompany(company) ? 'bg-blue-1 border-primary' : 'bg-grey-1 border-transparent'"
            @click="selectCompany(company)"
          >
            <q-item-section avatar>
              <q-avatar
                :color="isCurrentCompany(company) ? 'primary' : 'grey-4'"
                :text-color="isCurrentCompany(company) ? 'white' : 'grey-8'"
                icon="apartment"
                class="shadow-1"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold text-subtitle1" :class="isCurrentCompany(company) ? 'text-primary' : 'text-grey-9'">
                {{ company.name }}
              </q-item-label>
              <q-item-label caption class="text-grey-6">
                RUT: {{ company.rut || 'No registrado' }}
              </q-item-label>
            </q-item-section>

            <q-item-section side v-if="isCurrentCompany(company)">
              <q-chip color="primary" text-color="white" size="sm" class="text-weight-bold" icon="check_circle">
                Actual
              </q-chip>
            </q-item-section>

            <q-item-section side v-else>
              <q-icon name="chevron_right" color="grey-5" />
            </q-item-section>
          </q-item>

          <div v-if="filteredCompanies.length === 0" class="text-center q-pa-xl text-grey-6">
            <q-icon name="sentiment_dissatisfied" size="48px" class="q-mb-sm opacity-50" />
            <div class="text-subtitle1 text-weight-medium">No se encontraron residencias</div>
            <div class="text-caption">Intenta con otro término de búsqueda.</div>
          </div>

        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="center" class="q-pa-md bg-grey-1" style="border-radius: 0 0 16px 16px;">
        <q-btn flat color="grey-8" label="Volver al Inicio" icon="arrow_back" :to="{ name: 'Home' }" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted
} from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { useResidenceStore } from 'stores/residence';
import pinia from 'src/stores';

export default defineComponent({
  name: 'ChangeCompany',

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const residenceStore = useResidenceStore(pinia());

    const localCompaniesStr = localStorage.getItem('companies');
    const companies = ref<any[]>(localCompaniesStr ? JSON.parse(localCompaniesStr) : []);

    const currentCompany = JSON.parse(localStorage.getItem('companySelected')!);
    const currentCompanyId = ref(currentCompany?.companyId);
    const searchQuery = ref('');
    const isLoading = ref(false);

    const filteredCompanies = computed(() => {
      if (!searchQuery.value) return companies.value;
      const lowerQuery = searchQuery.value.toLowerCase();
      return companies.value.filter(c =>
        c.name.toLowerCase().includes(lowerQuery) ||
        (c.rut && c.rut.toLowerCase().includes(lowerQuery))
      );
    });

    const isCurrentCompany = (company: any) => {
      return String(company.companyId) === String(currentCompanyId.value);
    };

    const fetchCompaniesFromBackend = async () => {
      isLoading.value = true;
      try {
        await residenceStore.getResidencesPagination();
        const freshCompanies = residenceStore.residences;

        companies.value = freshCompanies!;

        localStorage.setItem('companies', JSON.stringify(freshCompanies));

      } catch (error) {
        console.error('Error actualizando la lista de residencias', error);
      } finally {
        isLoading.value = false;
      }
    };

    const selectCompany = async (company: any) => {
      if (isCurrentCompany(company)) {
        await router.push({ name: 'Home' });
        return;
      }

      $q.loading.show({
        message: `Cambiando a ${company.name}...`,
        spinnerColor: 'white',
        backgroundColor: 'primary'
      });

      try {
        localStorage.setItem('companySelected', String(company));
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = '/';
      } catch (error) {
        $q.loading.hide();
      }
    };

    onMounted(() => {
      fetchCompaniesFromBackend();
    });

    return {
      searchQuery,
      filteredCompanies,
      isCurrentCompany,
      selectCompany,
      isLoading
    };
  }
});
</script>

<style scoped>
/* FONDO CORPORATIVO:
   Mezcla tu Primary (#4A90E2) con tu Secondary (#7BC6A4) en un ángulo de 135 grados.
   Esto transmite tranquilidad, confianza y modernidad.
*/
.portal-bg {
  background: linear-gradient(135deg, #4A90E2 0%, #7BC6A4 100%);
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  /* Centra el contenido vertical y horizontalmente */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* EFECTO GLASSMORPHISM PREMIUM
   La tarjeta blanca se vuelve un 95% opaca para que el texto sea súper legible,
   pero deja pasar un "halo" del gradiente azul/menta por detrás.
*/
.glass-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  /* Sombra suave usando tu color $dark (#2E2E2E) con mucha transparencia */
  box-shadow: 0 12px 32px rgba(46, 46, 46, 0.15) !important;
}

/* Transiciones y bordes de la lista de residencias */
.transition-ease {
  transition: all 0.2s ease-in-out;
}

.company-item {
  border: 1px solid transparent;
}

/* Usamos tu Primary para el borde activo */
.border-primary {
  border-color: #4A90E2 !important;
}

.border-transparent {
  border-color: rgba(46, 46, 46, 0.04); /* Un toque levísimo de tu gris oscuro */
}

/* Efecto hover interactivo */
.company-item:not(.bg-blue-1):hover {
  background-color: rgba(74, 144, 226, 0.04) !important; /* Tu primary con 4% de opacidad */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.08);
}

.opacity-50 {
  opacity: 0.5;
}
</style>
