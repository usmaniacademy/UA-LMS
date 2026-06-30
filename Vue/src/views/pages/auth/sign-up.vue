<template>
  <main>
    <section class="p-0 d-flex align-items-center position-relative overflow-hidden">
      <b-container fluid>
        <b-row>
          <!-- Left panel -->
          <b-col cols="12" lg="6"
            class="d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
            <div class="p-3 p-lg-5">
              <div class="text-center">
                <h2 class="fw-bold">Welcome to Usmani Academy</h2>
                <p class="mb-0 h6 fw-light">Let's learn something new today!</p>
              </div>
              <img :src="element02" class="mt-5" alt="">
              <div class="d-sm-flex mt-5 align-items-center justify-content-center">
                <ul class="avatar-group mb-2 mb-sm-0">
                  <li class="avatar avatar-sm"><img class="avatar-img rounded-circle" :src="avatar01" alt="avatar"></li>
                  <li class="avatar avatar-sm"><img class="avatar-img rounded-circle" :src="avatar02" alt="avatar"></li>
                  <li class="avatar avatar-sm"><img class="avatar-img rounded-circle" :src="avatar03" alt="avatar"></li>
                  <li class="avatar avatar-sm"><img class="avatar-img rounded-circle" :src="avatar04" alt="avatar"></li>
                </ul>
                <p class="mb-0 h6 fw-light ms-0 ms-sm-3">Join our growing community of learners.</p>
              </div>
            </div>
          </b-col>

          <!-- Right panel -->
          <b-col cols="12" lg="6" class="m-auto">
            <b-row class="my-5">
              <b-col sm="10" xl="8" class="m-auto">
                <h2>Create your account</h2>
                <p class="lead mb-4">Join Usmani Academy and start learning today.</p>

                <b-form @submit.prevent="handleSignUp">
                  <div v-if="errorMsg" class="alert alert-danger py-2 mb-3">{{ errorMsg }}</div>
                  <div v-if="successMsg" class="alert alert-success py-2 mb-3">{{ successMsg }}</div>

                  <b-row>
                    <b-col md="6" class="mb-4">
                      <b-form-group label="First Name *">
                        <b-form-input
                          size="lg"
                          class="border-0 bg-light"
                          placeholder="John"
                          v-model="form.firstName"
                          required
                        />
                      </b-form-group>
                    </b-col>
                    <b-col md="6" class="mb-4">
                      <b-form-group label="Last Name *">
                        <b-form-input
                          size="lg"
                          class="border-0 bg-light"
                          placeholder="Doe"
                          v-model="form.lastName"
                          required
                        />
                      </b-form-group>
                    </b-col>
                  </b-row>

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
                          placeholder="Min. 8 characters"
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

                  <div class="mb-4">
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="terms" v-model="agreedToTerms" required>
                      <label class="form-check-label" for="terms">
                        I agree to the <a href="#">terms of service</a>
                      </label>
                    </div>
                  </div>

                  <div class="d-grid">
                    <b-button variant="primary" type="submit" :disabled="loading || !agreedToTerms">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" />
                      {{ loading ? 'Creating account...' : 'Create Account' }}
                    </b-button>
                  </div>
                </b-form>

                <div class="mt-4 text-center">
                  Already have an account?
                  <router-link :to="{ name: 'auth.sign-in' }">Sign in here</router-link>
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
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { BIconEnvelopeFill } from 'bootstrap-icons-vue'
import avatar01 from '@/assets/images/avatar/01.jpg'
import avatar02 from '@/assets/images/avatar/02.jpg'
import avatar03 from '@/assets/images/avatar/03.jpg'
import avatar04 from '@/assets/images/avatar/04.jpg'
import element02 from '@/assets/images/element/02.svg'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import router from '@/router'

const auth = useAuthStore()
const route = useRoute()

// Public sign-up always creates a student. Instructors are created by the admin.
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'student' as const
})
const agreedToTerms = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleSignUp() {
  errorMsg.value = ''
  successMsg.value = ''
  loading.value = true
  try {
    await auth.register(form)
    successMsg.value = 'Account created! Redirecting to sign in...'
    // Preserve any post-login redirect (e.g. the course the user wanted to enrol in)
    const redirectedFrom = route.query.redirectedFrom as string | undefined
    setTimeout(() => router.push({ name: 'auth.sign-in', query: redirectedFrom ? { redirectedFrom } : {} }), 1500)
  } catch (e: any) {
    errorMsg.value = e.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.role-card {
  cursor: pointer;
  transition: all 0.2s ease;
}
.role-card:hover {
  border-color: var(--bs-primary) !important;
}
</style>
