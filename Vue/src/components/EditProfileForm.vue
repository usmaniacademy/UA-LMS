<template>
  <b-card no-body class="border bg-transparent rounded-3">
    <b-card-header class="bg-transparent border-bottom">
      <h4 class="mb-0">Edit Profile</h4>
    </b-card-header>
    <b-card-body>
      <div v-if="msg" class="alert py-2" :class="msgOk ? 'alert-success' : 'alert-danger'">{{ msg }}</div>

      <!-- Avatar -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="avatar avatar-xl">
          <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar-img rounded-circle" alt="avatar">
          <span v-else class="avatar-img rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4">
            {{ initials }}
          </span>
        </div>
        <div>
          <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onFile">
          <b-button size="sm" variant="primary" @click="fileInput?.click()">Upload photo</b-button>
          <b-button v-if="form.avatarUrl" size="sm" variant="outline-danger" class="ms-2" @click="form.avatarUrl = ''">Remove</b-button>
          <div class="form-text">JPG or PNG. The image is automatically resized to a small square.</div>
        </div>
      </div>

      <b-row class="g-3">
        <b-col md="6">
          <b-form-group label="First name">
            <b-form-input v-model="form.firstName" />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Last name">
            <b-form-input v-model="form.lastName" />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Bio">
            <b-form-textarea v-model="form.bio" rows="3" placeholder="A short introduction shown on your courses" />
          </b-form-group>
        </b-col>
      </b-row>

      <div class="mt-3">
        <b-button variant="primary" class="mb-0" @click="save" :disabled="saving">
          <span v-if="saving" class="spinner-border spinner-border-sm me-1" />
          Save changes
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const fileInput = ref<HTMLInputElement | null>(null)
const saving = ref(false)
const msg = ref('')
const msgOk = ref(false)

const form = reactive({ firstName: '', lastName: '', bio: '', avatarUrl: '' })

const initials = computed(() =>
  [(form.firstName || '')[0], (form.lastName || '')[0]].filter(Boolean).join('').toUpperCase() || 'U'
)

onMounted(() => {
  const u = auth.getUser()
  if (u) {
    form.firstName = u.firstName || ''
    form.lastName = u.lastName || ''
    form.bio = (u as any).bio || ''
    form.avatarUrl = u.avatarUrl || ''
  }
})

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const max = 256
      let { width, height } = img
      if (width > height && width > max) { height = (height * max) / width; width = max }
      else if (height >= width && height > max) { width = (width * max) / height; height = max }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')?.drawImage(img, 0, 0, width, height)
      form.avatarUrl = canvas.toDataURL('image/jpeg', 0.85)
    }
    img.src = reader.result as string
  }
  reader.readAsDataURL(file)
}

async function save() {
  saving.value = true
  msg.value = ''
  try {
    await auth.updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      avatarUrl: form.avatarUrl
    })
    msgOk.value = true
    msg.value = 'Profile updated.'
  } catch (e: any) {
    msgOk.value = false
    msg.value = e.message || 'Failed to update profile.'
  } finally {
    saving.value = false
  }
}
</script>
