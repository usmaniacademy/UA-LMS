<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col class="d-flex justify-content-between align-items-center">
        <div>
          <router-link :to="{ name: backRoute }" class="btn btn-sm btn-light mb-2">
            <font-awesome-icon :icon="faAngleLeft" class="me-1" /> Back
          </router-link>
          <h1 class="h3 mb-0">{{ fullName || 'User' }}</h1>
        </div>
        <div v-if="user?.role === 'student'">
          <b-button variant="primary" size="sm" v-b-modal.enrollModal>
            <font-awesome-icon :icon="faPlus" class="me-1" />Enroll in Course
          </b-button>
        </div>
      </b-col>
    </b-row>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <b-row v-else-if="user" class="g-4">
      <!-- Profile card -->
      <b-col lg="4">
        <b-card class="border">
          <div class="text-center">
            <div class="avatar avatar-xl mx-auto mb-3">
              <img v-if="user.avatarUrl" :src="user.avatarUrl" class="avatar-img rounded-circle" alt="" />
              <span v-else
                class="avatar-img rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-4">
                {{ initials }}
              </span>
            </div>
            <h5 class="mb-1">{{ fullName }}</h5>
            <div>
              <span class="badge text-capitalize" :class="roleBadge">{{ user.role }}</span>
              <span class="badge ms-1"
                :class="user.isActive ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'">
                {{ user.isActive ? 'Active' : 'Blocked' }}
              </span>
            </div>
          </div>
          <hr>
          <ul class="list-unstyled mb-0">
            <li class="d-flex justify-content-between mb-2"><span class="text-muted">Email</span><span>{{ user.email }}</span></li>
            <li class="d-flex justify-content-between mb-2"><span class="text-muted">Joined</span><span>{{ formatDate(user.createdAt) }}</span></li>
            <li class="d-flex justify-content-between"><span class="text-muted">Enrolled in</span><span>{{ enrollments.length }} course(s)</span></li>
          </ul>
          <template v-if="user.bio">
            <hr>
            <p class="small mb-0">{{ user.bio }}</p>
          </template>
        </b-card>
      </b-col>

      <!-- Courses -->
      <b-col lg="8">
        <!-- Courses taught (instructors) -->
        <b-card v-if="taughtCourses.length" class="border mb-4">
          <h5 class="mb-3">Courses Taught ({{ taughtCourses.length }})</h5>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr><th>Course</th><th>Category</th><th>Status</th><th>Students</th></tr>
              </thead>
              <tbody>
                <tr v-for="c in taughtCourses" :key="c.id">
                  <td>{{ c.title }}</td>
                  <td>{{ c.category || '—' }}</td>
                  <td>
                    <span class="badge text-capitalize"
                      :class="c.status === 'published' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'">
                      {{ c.status }}
                    </span>
                  </td>
                  <td>{{ c._count.enrollments }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card>

        <!-- Courses enrolled (students) -->
        <b-card class="border">
          <h5 class="mb-3">Enrolled Courses ({{ enrollments.length }})</h5>
          <div v-if="!enrollments.length" class="text-muted small">Not enrolled in any courses yet.</div>
          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr><th>Course</th><th>Instructor</th><th>Category</th><th>Enrolled</th></tr>
              </thead>
              <tbody>
                <tr v-for="e in enrollments" :key="e.id">
                  <td>{{ e.course.title }}</td>
                  <td>{{ e.course.instructor.firstName }} {{ e.course.instructor.lastName }}</td>
                  <td>{{ e.course.category || '—' }}</td>
                  <td>{{ formatDate(e.enrolledAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Enroll Modal -->
    <b-modal id="enrollModal" title="Enroll Student in Course" hide-footer @show="loadCourses">
      <b-form @submit.prevent="submitEnroll">
        <b-form-group label="Select Course">
          <b-form-select v-model="selectedCourseId" :options="courseOptions" required>
            <template #first>
              <b-form-select-option :value="null" disabled>-- Please select a course --</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
        <div class="d-flex justify-content-end gap-2 mt-4">
          <b-button type="button" variant="secondary" @click="$bvModal.hide('enrollModal')">Cancel</b-button>
          <b-button type="submit" variant="primary" :disabled="enrolling || !selectedCourseId">
            <span v-if="enrolling" class="spinner-border spinner-border-sm me-2"></span>
            Enroll Student
          </b-button>
        </div>
      </b-form>
    </b-modal>
  </AdminLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAdminStore } from '@/stores/admin'
import { faAngleLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useBModal } from 'bootstrap-vue-next'

const route = useRoute()
const adminStore = useAdminStore()

const user = ref<any>(null)
const enrollments = ref<any[]>([])
const taughtCourses = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const fullName = computed(() => (user.value ? `${user.value.firstName} ${user.value.lastName}` : ''))
const initials = computed(() =>
  user.value ? ((user.value.firstName?.[0] || '') + (user.value.lastName?.[0] || '')).toUpperCase() : ''
)
const roleBadge = computed(() => {
  const r = user.value?.role
  return r === 'admin' ? 'text-bg-danger' : r === 'instructor' ? 'text-bg-purple' : 'text-bg-primary'
})
const backRoute = computed(() => (user.value?.role === 'instructor' ? 'admin.instructor.list' : 'admin.student.list'))

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data: any = await adminStore.fetchUserDetail(route.params.id as string)
    user.value = data.user
    enrollments.value = data.enrollments || []
    taughtCourses.value = data.taughtCourses || []
    // Name the browser tab after the user (not a generic "User Detail")
    document.title = `${fullName.value} | Usmani Academy`
  } catch (e: any) {
    error.value = e.message || 'Failed to load user'
  } finally {
    loading.value = false
  }
}

const modal = useBModal()
const selectedCourseId = ref<string | null>(null)
const enrolling = ref(false)

const courseOptions = computed(() => {
  return adminStore.courses.map(c => ({ value: c.id, text: c.title }))
})

async function loadCourses() {
  if (!adminStore.courses.length) {
    await adminStore.fetchCourses({ limit: 100 } as any)
  }
  selectedCourseId.value = null
}

async function submitEnroll() {
  if (!selectedCourseId.value || !user.value) return
  enrolling.value = true
  try {
    await adminStore.manualEnroll({ studentId: user.value.id, courseId: selectedCourseId.value })
    modal.hide('enrollModal')
    await load() // refresh user details
  } catch (e: any) {
    alert(e.message || 'Failed to enroll student')
  } finally {
    enrolling.value = false
  }
}

watch(() => route.params.id, load)
onMounted(load)
</script>
