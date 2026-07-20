<template>
  <b-card no-body class="shadow">
    <b-card-header class="border-bottom">
      <h5 class="card-header-title mb-0">Email Settings</h5>
    </b-card-header>
    <b-card-body>
      <b-row class="g-4">
        <b-col cols="12">
          <div class="bg-light rounded-3 p-3 d-flex align-items-center gap-3">
            <div class="avatar avatar-md bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold">
              <font-awesome-icon :icon="faEnvelope" />
            </div>
            <div>
              <h6 class="mb-1">Resend API</h6>
              <p class="mb-0 small text-muted">
                Emails are sent via Resend from <strong>{{ fromEmail }}</strong>
              </p>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <b-form-group label="From Email">
            <b-form-input v-model="fromEmail" disabled />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="From Name">
            <b-form-input v-model="fromName" disabled />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'

const fromEmail = ref(import.meta.env.VITE_RESEND_FROM_EMAIL || 'noreply@usmaniacademy.com')
const fromName = ref(import.meta.env.VITE_RESEND_FROM_NAME || 'Usmani Academy')
</script>