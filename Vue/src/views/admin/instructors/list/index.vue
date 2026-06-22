<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col cols="12">
        <h1 class="h3 mb-2 mb-sm-0">Instructors</h1>
      </b-col>
    </b-row>

    <b-card no-body class="bg-transparent">
      <b-card-header class="bg-transparent border-bottom px-0">
        <b-form class="rounded position-relative" @submit.prevent="search">
          <b-form-input class="bg-transparent" type="search" placeholder="Search instructors" v-model="query" />
          <button class="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
            type="submit">
            <font-awesome-icon :icon="faSearch" class="fs-6" />
          </button>
        </b-form>
      </b-card-header>

      <b-card-body class="px-0">
        <div v-if="admin.loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="!instructors.length" class="text-center text-muted py-5">
          No instructors found.
        </div>

        <div v-else class="table-responsive border-0 mb-0">
          <table class="table table-dark-gray align-middle p-4 mb-0 table-hover">
            <thead>
              <tr>
                <th scope="col" class="border-0 rounded-start">Instructor</th>
                <th scope="col" class="border-0">Email</th>
                <th scope="col" class="border-0">Students</th>
                <th scope="col" class="border-0">Status</th>
                <th scope="col" class="border-0 rounded-end">Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in instructors" :key="user.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar avatar-md">
                      <img v-if="user.avatarUrl" :src="user.avatarUrl" class="rounded-circle" alt="">
                      <span v-else
                        class="avatar-img rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
                        {{ initials(user) }}
                      </span>
                    </div>
                    <h6 class="mb-0 ms-2">{{ user.firstName }} {{ user.lastName }}</h6>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>{{ user._count?.enrollments ?? 0 }}</td>
                <td>
                  <span class="badge bg-opacity-10" :class="user.isActive ? 'bg-success text-success' : 'bg-danger text-danger'">
                    {{ user.isActive ? 'Active' : 'Blocked' }}
                  </span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-card-body>
    </b-card>
  </AdminLayout>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useAdminStore } from '@/stores/admin';
import type { AdminUser } from '@/stores/admin';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const admin = useAdminStore();
const query = ref('');

const instructors = computed(() => admin.users);

function initials(u: AdminUser) {
  return [(u.firstName || '')[0], (u.lastName || '')[0]].filter(Boolean).join('').toUpperCase() || u.email[0].toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function search() {
  admin.fetchUsers({ role: 'instructor', search: query.value || undefined });
}

onMounted(() => admin.fetchUsers({ role: 'instructor' }));
</script>
