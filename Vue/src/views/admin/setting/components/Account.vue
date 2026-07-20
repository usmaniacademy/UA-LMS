<template>
  <b-card no-body class="border mt-4">
    <b-card-header class="border-bottom">
      <h5 class="card-header-title">Change Password</h5>
    </b-card-header>
    <b-card-body>
      <b-form class="row g-4" @submit.prevent="changePassword">
        <b-col cols="12">
          <b-form-group label="Current Password">
            <b-form-input v-model="form.currentPassword" type="password" required />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="New Password">
            <b-form-input v-model="form.newPassword" type="password" required minlength="8" />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Confirm New Password">
            <b-form-input v-model="form.confirmPassword" type="password" required minlength="8" />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <div v-if="msg" class="alert py-2" :class="msgOk ? 'alert-success' : 'alert-danger'">{{ msg }}</div>
          <b-button type="submit" variant="primary" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1" />
            Update Password
          </b-button>
        </b-col>
      </b-form>
    </b-card-body>
  </b-card>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const saving = ref(false)
const msg = ref('')
const msgOk = ref(false)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

async function changePassword() {
  if (form.newPassword !== form.confirmPassword) {
    msgOk.value = false
    msg.value = 'Passwords do not match'
    return
  }
  saving.value = true
  msg.value = ''
  try {
    await auth.changePassword(form.currentPassword, form.newPassword)
    msgOk.value = true
    msg.value = 'Password updated successfully'
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (e: any) {
    msgOk.value = false
    msg.value = e.message || 'Failed to update password'
  } finally {
    saving.value = false
  }
}
</script>