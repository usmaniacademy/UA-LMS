<template>
  <main>
    <section class="p-0 d-flex align-items-center position-relative overflow-hidden">
      <b-container fluid>
        <b-row>
          <b-col cols="12" lg="6"
            class="d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
            <div class="p-4 p-lg-5 text-center">
              <img :src="uaLogo" class="img-fluid mb-4" style="max-width: min(440px, 100%);" alt="Usmani Academy">
              <p class="mb-0 h5 fw-light">Modern learning, rooted in Islamic values.</p>
            </div>
          </b-col>
          <b-col cols="12" lg="6" class="d-flex justify-content-center">
            <b-row class="my-5">
              <b-col sm="10" xl="12" class="m-auto">
                <span class="mb-0 fs-1">🔐</span>
                <h1 class="fs-2">Set New Password</h1>
                <h5 class="fw-light mb-4">Enter your new password below.</h5>
                <b-form @submit.prevent="handleReset">
                  <div v-if="errorMsg" class="alert alert-danger py-2 mb-3">{{ errorMsg }}</div>
                  <div v-if="successMsg" class="alert alert-success py-2 mb-3">{{ successMsg }}</div>
                  <div class="mb-4">
                    <b-form-group label="New Password *">
                      <b-input-group size="lg">
                        <template #prepend>
                          <span class="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                            <BIconLockFill />
                          </span>
                        </template>
                        <b-form-input :type="showPassword ? 'text' : 'password'" class="border-0 bg-light rounded-end ps-1" placeholder="Minimum 8 characters" v-model="password" required minlength="8" />
                      </b-input-group>
                    </b-form-group>
                  </div>
                  <div class="mb-4">
                    <b-form-group label="Confirm Password *">
                      <b-input-group size="lg">
                        <template #prepend>
                          <span class="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                            <BIconLockFill />
                          </span>
                        </template>
                        <b-form-input :type="showPassword ? 'text' : 'password'" class="border-0 bg-light rounded-end ps-1" placeholder="Re-enter password" v-model="confirmPassword" required minlength="8" />
                      </b-input-group>
                    </b-form-group>
                  </div>
                  <div class="mb-4">
                    <b-form-checkbox v-model="showPassword" id="show-password">
                      Show passwords
                    </b-form-checkbox>
                  </div>
                  <div class="align-items-center">
                    <div class="d-grid">
                      <b-button variant="primary" class="mb-0" type="submit" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" />
                        {{ loading ? 'Resetting...' : 'Reset Password' }}
                      </b-button>
                    </div>
                  </div>
                </b-form>
                <div class="mt-4 text-center">
                  <router-link :to="{ name: 'auth.sign-in' }">Back to sign in</router-link>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import uaLogo from '@/assets/images/ua-logo-dark.png.png';
import { BIconLockFill } from 'bootstrap-icons-vue';
import { api } from '@/helpers/api';

const route = useRoute()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleReset() {
  errorMsg.value = ''
  successMsg.value = ''

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match'
    return
  }

  const token = route.query.token as string
  if (!token) {
    errorMsg.value = 'Missing reset token. Please use the link from your email.'
    return
  }

  loading.value = true
  try {
    const res = await api.post('/auth/reset-password', { token, password: password.value })
    successMsg.value = res.message
  } catch (e: any) {
    errorMsg.value = e.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>
