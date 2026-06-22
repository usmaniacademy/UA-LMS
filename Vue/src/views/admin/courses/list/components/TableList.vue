<template>
  <b-card no-body class="bg-transparent border">
    <b-card-header class="bg-light border-bottom">
      <b-row class="g-3 align-items-center justify-content-between">
        <b-col md="8">
          <b-form class="rounded position-relative" @submit.prevent="search">
            <b-form-input v-model="searchQuery" class="bg-body" type="search" placeholder="Search courses..." />
            <button class="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset" type="submit">
              <font-awesome-icon :icon="faSearch" class="fs-6" />
            </button>
          </b-form>
        </b-col>
        <b-col md="3">
          <b-form-select v-model="statusFilter" @change="load" :options="statusOptions" />
        </b-col>
      </b-row>
    </b-card-header>

    <b-card-body>
      <div v-if="adminStore.loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div class="table-responsive border-0 rounded-3 mb-0" v-else>
        <table class="table table-dark-gray align-middle p-4 mb-0 table-hover">
          <thead>
            <tr>
              <th scope="col" class="border-0 rounded-start">Course Name</th>
              <th scope="col" class="border-0">Instructor</th>
              <th scope="col" class="border-0">Students</th>
              <th scope="col" class="border-0">Level</th>
              <th scope="col" class="border-0">Price</th>
              <th scope="col" class="border-0">Status</th>
              <th scope="col" class="border-0 rounded-end">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in adminStore.courses" :key="course.id">
              <td>
                <div class="d-flex align-items-center position-relative">
                  <div class="w-60px">
                    <img :src="course.thumbnailUrl || defaultThumb" class="rounded" alt="" />
                  </div>
                  <h6 class="table-responsive-title mb-0 ms-2">{{ course.title }}</h6>
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar avatar-xs flex-shrink-0">
                    <img class="avatar-img rounded-circle" :src="course.instructor?.avatarUrl || defaultAvatar" alt="" />
                  </div>
                  <div class="ms-2">
                    <h6 class="mb-0 fw-light">{{ course.instructor?.firstName }} {{ course.instructor?.lastName }}</h6>
                  </div>
                </div>
              </td>
              <td>{{ course._count.enrollments }}</td>
              <td>
                <span class="badge"
                  :class="course.level === 'beginner' ? 'text-bg-primary' : course.level === 'intermediate' ? 'text-bg-purple' : 'text-bg-orange'">
                  {{ course.level }}
                </span>
              </td>
              <td>{{ course.isFree ? 'Free' : 'Paid' }}</td>
              <td>
                <span class="badge bg-opacity-15"
                  :class="course.status === 'published' ? 'bg-success text-success' : course.status === 'draft' ? 'bg-warning text-warning' : 'bg-secondary text-secondary'">
                  {{ course.status }}
                </span>
              </td>
              <td>
                <div class="d-flex gap-1 flex-wrap">
                  <router-link :to="{ name: 'instructor.edit.course', params: { id: course.id } }"
                    class="btn btn-sm btn-primary-soft mb-0">Edit</router-link>
                  <b-button v-if="course.status !== 'published'" size="sm" variant="success-soft"
                    @click="approve(course.id)" :disabled="acting === course.id">
                    <span v-if="acting === course.id" class="spinner-border spinner-border-sm me-1" />
                    Approve
                  </b-button>
                  <b-button v-else size="sm" variant="secondary-soft"
                    @click="reject(course.id)" :disabled="acting === course.id">
                    Unpublish
                  </b-button>
                  <b-button size="sm" variant="danger-soft"
                    @click="remove(course.id)" :disabled="acting === course.id">
                    Delete
                  </b-button>
                </div>
              </td>
            </tr>
            <tr v-if="!adminStore.loading && !adminStore.courses.length">
              <td colspan="7" class="text-center text-muted py-4">No courses found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-card-body>

    <b-card-footer class="bg-transparent pt-0">
      <div class="d-sm-flex justify-content-sm-between align-items-sm-center">
        <p class="mb-0 text-center text-sm-start">
          {{ adminStore.coursesPagination.total }} total courses
        </p>
        <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
          <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
            <li class="page-item mb-0" :class="{ disabled: page <= 1 }">
              <button class="page-link" @click="changePage(page - 1)"><font-awesome-icon :icon="faAngleLeft" /></button>
            </li>
            <li class="page-item mb-0 active"><span class="page-link">{{ page }}</span></li>
            <li class="page-item mb-0" :class="{ disabled: page >= adminStore.coursesPagination.totalPages }">
              <button class="page-link" @click="changePage(page + 1)"><font-awesome-icon :icon="faAngleRight" /></button>
            </li>
          </ul>
        </nav>
      </div>
    </b-card-footer>
  </b-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { faSearch, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useAdminStore } from '@/stores/admin'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'
import defaultAvatar from '@/assets/images/avatar/01.jpg'

const adminStore = useAdminStore()
const searchQuery = ref('')
const statusFilter = ref('')
const page = ref(1)
const acting = ref<string | null>(null)

const statusOptions = [
  { value: '', text: 'All Statuses' },
  { value: 'published', text: 'Published' },
  { value: 'draft', text: 'Draft' },
  { value: 'archived', text: 'Archived' }
]

function load() {
  adminStore.fetchCourses({ status: statusFilter.value || undefined, search: searchQuery.value || undefined, page: page.value })
}

function search() {
  page.value = 1
  load()
}

function changePage(p: number) {
  page.value = p
  load()
}

async function approve(id: string) {
  acting.value = id
  try { await adminStore.approveCourse(id) } catch (e: any) { alert(e.message) } finally { acting.value = null }
}

async function reject(id: string) {
  acting.value = id
  try { await adminStore.rejectCourse(id) } catch (e: any) { alert(e.message) } finally { acting.value = null }
}

async function remove(id: string) {
  if (!confirm('Delete this course? It will be archived and hidden from students.')) return
  acting.value = id
  try { await adminStore.deleteCourse(id); await adminStore.fetchStats() } catch (e: any) { alert(e.message) } finally { acting.value = null }
}

onMounted(load)

defineExpose({ load })
</script>
