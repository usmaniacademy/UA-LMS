<template>
  <b-card no-body class="shadow">
    <b-card-header class="border-bottom">
      <h5 class="card-header-title">Website Settings</h5>
    </b-card-header>

    <b-card-body>
      <div v-if="settings.loading && !settingsFetched" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <b-form v-else class="row g-4 align-items-center" @submit.prevent="saveSettings">
        
        <!-- Maintenance Mode Toggle -->
        <b-col cols="12" class="mb-3">
          <b-card class="bg-light border-0">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">Maintenance Mode</h6>
                <p class="small text-muted mb-0">When enabled, only administrators can access the website. Regular users will see a maintenance screen.</p>
              </div>
              <div class="form-check form-switch form-switch-lg mb-0">
                <input class="form-check-input" type="checkbox" id="maintenanceModeSwitch" v-model="form.maintenanceMode">
              </div>
            </div>
          </b-card>
        </b-col>

        <b-col lg="4">
          <b-form-group label="Site Name" description="Enter Website Name. It Display in Website and Email.">
            <b-form-input placeholder="Site Name" />
          </b-form-group>
        </b-col>

        <b-col lg="4">
          <b-form-group label="Site Copyrights" description="Using for Contact and Send Email.">
            <b-form-input placeholder="Site Copyrights" />
          </b-form-group>
        </b-col>

        <b-col lg="4">
          <b-form-group label="Site Email" description="For Copyrights Text.">
            <b-form-input placeholder="Site Email" />
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-form-group label="Site Description"
            description="For write brief description of your organization, or a Website.">
            <b-form-textarea rows="3" max-rows="6" />
          </b-form-group>
        </b-col>

        <b-col lg="6">
          <b-form-group label="Contact Phone" description="Using for Contact and Support.">
            <b-form-input placeholder="Contact Phone" />
          </b-form-group>
        </b-col>

        <b-col lg="6">
          <b-form-group label="Support Email" description="For Support Email.">
            <b-form-input placeholder="Support Email" />
          </b-form-group>
        </b-col>

        <b-col lg="6">
          <b-form-group label="Allow Registration">
            <b-form-radio-group id="radio-group-2" name="radio-sub-component">
              <b-form-radio name="some-radios" value="enable" checked>Enable</b-form-radio>
              <b-form-radio name="some-radios" value="disable">Disable</b-form-radio>
              <b-form-radio name="some-radios" value="on_request">On Request</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-form-group label="Contact Address" description="Enter support Address.">
            <b-form-textarea rows="3" max-rows="6" />
          </b-form-group>
        </b-col>

        <div class="d-sm-flex justify-content-end">
          <b-button type="submit" variant="primary" class="mb-0" :disabled="saving">
            {{ saving ? 'Saving...' : 'Update' }}
          </b-button>
        </div>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const settings = useSettingsStore();
const settingsFetched = ref(false);
const saving = ref(false);

const form = ref({
  maintenanceMode: false
});

onMounted(async () => {
  if (Object.keys(settings.config).length === 0) {
    await settings.fetchSettings();
  }
  form.value.maintenanceMode = settings.config.maintenanceMode === true || settings.config.maintenanceMode === 'true';
  settingsFetched.value = true;
});

async function saveSettings() {
  saving.value = true;
  try {
    await settings.updateSetting('maintenanceMode', form.value.maintenanceMode);
    // You could show a success toast here
  } catch (e) {
    console.error(e);
  } finally {
    saving.value = false;
  }
}
</script>