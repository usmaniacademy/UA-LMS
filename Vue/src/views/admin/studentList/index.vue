<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col cols="12">
        <h1 class="h3 mb-2 mb-sm-0">Users</h1>
      </b-col>
    </b-row>

    <b-card no-body class="bg-transparent">
      <b-card-header class="bg-transparent border-bottom px-0">
        <b-row class="g-3 align-items-center justify-content-between">
          <b-col md="5">
            <b-form class="rounded position-relative" @submit.prevent="search">
              <b-form-input v-model="searchQuery" class="bg-transparent" type="search" placeholder="Search by name or email" />
              <button class="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset" type="submit">
                <font-awesome-icon :icon="faSearch" class="fs-6" />
              </button>
            </b-form>
          </b-col>
          <b-col md="3">
            <b-form-select v-model="roleFilter" @change="load" :options="roleOptions" />
          </b-col>
        </b-row>
      </b-card-header>

      <b-card-body class="px-0">
        <div v-if="adminStore.loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else class="table-responsive border-0 mb-0">
          <table class="table table-dark-gray align-middle p-4 mb-0 table-hover">
            <thead>
              <tr>
                <th scope="col" class="border-0 rounded-start">Name</th>
                <th scope="col" class="border-0">Email</th>
                <th scope="col" class="border-0">Role</th>
                <th scope="col" class="border-0">Enrollments</th>
                <th scope="col" class="border-0">Joined</th>
                <th scope="col" class="border-0 rounded-end">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in adminStore.users" :key="user.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar avatar-md">
                      <img v-if="user.avatarUrl" :src="user.avatarUrl" class="avatar-img rounded-circle" alt="" />
                      <span v-else
                        class="avatar-img rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold">
                        {{ initials(user.firstName, user.lastName) }}
                      </span>
                    </div>
                    <div class="mb-0 ms-3">
                      <h6 class="mb-0">{{ user.firstName }} {{ user.lastName }}</h6>
                      <span class="badge" :class="user.isActive ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'">
                        {{ user.isActive ? 'Active' : 'Blocked' }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="small text-muted">{{ user.email }}</td>
                <td>
                  <span class="badge text-capitalize"
                    :class="user.role === 'admin' ? 'text-bg-danger' : user.role === 'instructor' ? 'text-bg-purple' : 'text-bg-primary'">
                    {{ user.role }}
                  </span>
                </td>
                <td>{{ user._count.enrollments }}</td>
                <td class="small text-muted">{{ formatDate(user.createdAt) }}</td>
                <td>
                  <b-button variant="light" class="btn-round mb-0" size="sm"
                    v-b-tooltip.hover.top="user.isActive ? 'Block User' : 'Activate User'"
                    @click="toggle(user.id)" :disabled="acting === user.id">
                    <span v-if="acting === user.id" class="spinner-border spinner-border-sm" />
                    <font-awesome-icon v-else :icon="user.isActive ? faBan : faCheck" />
                  </b-button>
                </td>
              </tr>
              <tr v-if="!adminStore.users.length">
                <td colspan="6" class="text-center text-muted py-4">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-card-body>

      <b-card-footer class="bg-transparent pt-0 px-0">
        <div class="d-sm-flex justify-content-sm-between align-items-sm-center">
          <p class="mb-0 text-center text-sm-start">{{ adminStore.usersPagination.total }} total users</p>
          <nav class="d-flex justify-content-center mb-0">
            <ul class="pagination pagination-sm pagination-primary-soft mb-0 pb-0 px-0">
              <li class="page-item mb-0" :class="{ disabled: page <= 1 }">
                <button class="page-link" @click="changePage(page - 1)"><font-awesome-icon :icon="faAngleLeft" /></button>
              </li>
              <li class="page-item mb-0 active"><span class="page-link">{{ page }}</span></li>
              <li class="page-item mb-0" :class="{ disabled: page >= adminStore.usersPagination.totalPages }">
                <button class="page-link" @click="changePage(page + 1)"><font-awesome-icon :icon="faAngleRight" /></button>
              </li>
            </ul>
          </nav>
        </div>
      </b-card-footer>
    </b-card>
  </AdminLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAdminStore } from '@/stores/admin'
import { faSearch, faBan, faCheck, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

const adminStore = useAdminStore()

function initials(first: string, last: string) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase()
}
const searchQuery = ref('')
const roleFilter = ref('')
const page = ref(1)
const acting = ref<string | null>(null)

const roleOptions = [
  { value: '', text: 'All Roles' },
  { value: 'student', text: 'Students' },
  { value: 'instructor', text: 'Instructors' },
  { value: 'admin', text: 'Admins' }
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function load() {
  adminStore.fetchUsers({ role: roleFilter.value || undefined, search: searchQuery.value || undefined, page: page.value })
}

function search() { page.value = 1; load() }
function changePage(p: number) { page.value = p; load() }

async function toggle(id: string) {
  acting.value = id
  try { await adminStore.toggleUserActive(id) } catch (e: any) { alert(e.message) } finally { acting.value = null }
}

onMounted(load)
</script>
