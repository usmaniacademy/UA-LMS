<template>
  <main>
    <section class="p-0 d-flex align-items-center position-relative overflow-hidden">
      <b-container fluid>
        <b-row>
          <!-- Left panel -->
          <b-col cols="12" lg="6"
            class="d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
            <div class="p-4 p-lg-5 text-center">
              <img :src="uaLogo" class="auth-logo mb-4" alt="Usmani Academy">
              <p class="mb-0 h5 fw-light">Modern learning, rooted in Islamic values.</p>
            </div>
          </b-col>

          <!-- Right panel -->
          <b-col cols="12" lg="6" class="m-auto">
            <b-row class="my-5">
              <b-col sm="10" xl="8" class="m-auto">
                <span class="mb-0 fs-1">👋</span>
                <h1 class="fs-2">Sign in to Usmani Academy</h1>
                <p class="lead mb-4">Nice to see you! Please log in with your account.</p>

                <b-form @submit.prevent="handleSignIn">
                  <div v-if="errorMsg" class="alert alert-danger py-2 mb-3">{{ errorMsg }}</div>

                  <div class="mb-4">
                    <b-form-group label="Email address *">
                      <b-input-group size="lg">
                        <template #prepend>
                          <span class="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                            <BIconEnvelopeFill />
                          </span>
                        </template>
                        <b-form-input
                          type="email"
                          class="border-0 bg-light rounded-end ps-1"
                          placeholder="you@email.com"
                          v-model="form.email"
                          required
                        />
                      </b-input-group>
                    </b-form-group>
                  </div>

                  <div class="mb-4">
                    <b-form-group label="Password *">
                      <b-input-group size="lg">
                        <template #prepend>
                          <span class="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                            <font-awesome-icon :icon="faLock" />
                          </span>
                        </template>
                        <b-form-input
                          :type="showPassword ? 'text' : 'password'"
                          class="border-0 bg-light ps-1"
                          placeholder="••••••••"
                          v-model="form.password"
                          required
                        />
                        <b-button variant="light" class="border-0" type="button" @click="showPassword = !showPassword"
                          :title="showPassword ? 'Hide password' : 'Show password'">
                          <font-awesome-icon :icon="showPassword ? faEyeSlash : faEye" />
                        </b-button>
                      </b-input-group>
                    </b-form-group>
                  </div>

                  <div class="mb-4 d-flex justify-content-end">
                    <router-link :to="{ name: 'auth.forgot-password' }" class="text-secondary">
                      <u>Forgot password?</u>
                    </router-link>
                  </div>

                  <div class="d-grid">
                    <b-button variant="primary" class="mb-0" type="submit" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" />
                      {{ loading ? 'Signing in...' : 'Sign In' }}
                    </b-button>
                  </div>
                </b-form>

                <div class="mt-4 text-center">
                  Don't have an account?
                  <router-link :to="{ name: 'auth.sign-up' }">Sign up here</router-link>
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
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { BIconEnvelopeFill } from 'bootstrap-icons-vue'
import uaLogo from '@/assets/images/ua-logo-dark.png.png'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const auth = useAuthStore()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

async function handleSignIn() {
  errorMsg.value = ''
  loading.value = true
  try {
    const user = await auth.login(form.email, form.password)
    const redirectedFrom = route.query.redirectedFrom as string | undefined

    if (redirectedFrom) return router.push(redirectedFrom)

    if (user.role === 'admin') return router.push({ name: 'admin.dashboard' })
    if (user.role === 'instructor') return router.push({ name: 'instructor.dashboard' })
    router.push({ name: 'student.dashboard' })
  } catch (e: any) {
    errorMsg.value = e.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.auth-logo {
  max-width: min(440px, 100%);
  height: auto;
}
</style>
