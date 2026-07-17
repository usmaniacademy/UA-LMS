<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col cols="12" class="d-sm-flex justify-content-between align-items-center">
        <h1 class="h3 mb-2 mb-sm-0">Content Writers</h1>
        <div class="d-flex gap-2">
          <router-link :to="{ name: 'content.posts' }" class="btn btn-outline-primary btn-sm mb-0">
            Open Blog Dashboard
          </router-link>
          <b-button variant="primary" size="sm" class="mb-0" @click="openCreate">+ Add Content Writer</b-button>
        </div>
      </b-col>
    </b-row>

    <p class="text-muted small mb-4">
      Content writers can sign in to publish and manage blog posts. As an admin, you can also open the
      blog dashboard directly using the button above.
    </p>

    <!-- Add content writer modal -->
    <b-modal v-model="createModal" title="Add Content Writer" @ok="submitCreate" ok-title="Create Writer"
      :ok-disabled="saving" size="lg">
      <div v-if="formError" class="alert alert-danger py-2 mb-3">{{ formError }}</div>
      <div v-if="createdMsg" class="alert alert-success py-2 mb-3">{{ createdMsg }}</div>
      <b-form class="d-flex flex-column gap-3">
        <b-row class="g-3">
          <b-col md="6">
            <b-form-group label="First name *">
              <b-form-input v-model="form.firstName" placeholder="e.g. Ayesha" />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Last name *">
              <b-form-input v-model="form.lastName" placeholder="e.g. Siddiqui" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Email *">
          <b-form-input v-model="form.email" type="email" placeholder="writer@usmaniacademy.com" />
        </b-form-group>
        <b-form-group label="Password *">
          <b-input-group>
            <b-form-input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Min. 8 characters" />
            <b-button variant="outline-secondary" @click="showPass = !showPass">{{ showPass ? 'Hide' : 'Show' }}</b-button>
            <b-button variant="outline-primary" @click="form.password = randomPassword()">Generate</b-button>
          </b-input-group>
          <div class="form-text">You set the password here and share these login details with the writer.</div>
        </b-form-group>
      </b-form>
    </b-modal>

    <b-card no-body class="bg-transparent">
      <b-card-header class="bg-transparent border-bottom px-0">
        <b-form class="rounded position-relative" @submit.prevent="search">
          <b-form-input class="bg-transparent" type="search" placeholder="Search content writers" v-model="query" />
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

        <div v-else-if="!writers.length" class="text-center text-muted py-5">
          No content writers yet. Click “Add Content Writer” to create one.
        </div>

        <div v-else class="table-responsive border-0 mb-0">
          <table class="table table-dark-gray align-middle p-4 mb-0 table-hover">
            <thead>
              <tr>
                <th scope="col" class="border-0 rounded-start">Writer</th>
                <th scope="col" class="border-0">Email</th>
                <th scope="col" class="border-0">Status</th>
                <th scope="col" class="border-0 rounded-end">Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in writers" :key="user.id">
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
import { computed, onMounted, reactive, ref } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useAdminStore } from '@/stores/admin';
import type { AdminUser } from '@/stores/admin';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const admin = useAdminStore();
const query = ref('');

const writers = computed(() => admin.users);

// ─── Add content writer ──────────────────────────────────────────────────────
const createModal = ref(false);
const saving = ref(false);
const showPass = ref(false);
const formError = ref('');
const createdMsg = ref('');
const form = reactive({ firstName: '', lastName: '', email: '', password: '' });

function randomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let p = '';
  for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p + '@1';
}

function openCreate() {
  formError.value = '';
  createdMsg.value = '';
  showPass.value = true;
  Object.assign(form, { firstName: '', lastName: '', email: '', password: randomPassword() });
  createModal.value = true;
}

async function submitCreate(evt: Event) {
  evt.preventDefault();
  formError.value = '';
  createdMsg.value = '';
  if (!form.firstName.trim() || !form.lastName.trim()) { formError.value = 'Please enter the first and last name.'; return; }
  if (!form.email.trim()) { formError.value = 'Please enter an email.'; return; }
  if (form.password.length < 8) { formError.value = 'Password must be at least 8 characters.'; return; }

  saving.value = true;
  try {
    await admin.createContentWriter({ ...form });
    createdMsg.value = `Content writer created. Share these login details: ${form.email} / ${form.password}`;
    await admin.fetchUsers({ role: 'content_writer' });
    Object.assign(form, { firstName: '', lastName: '', email: '', password: '' });
    // keep the modal open so the admin can copy the credentials
  } catch (e: any) {
    formError.value = e.message || 'Failed to create content writer';
  } finally {
    saving.value = false;
  }
}

function initials(u: AdminUser) {
  return [(u.firstName || '')[0], (u.lastName || '')[0]].filter(Boolean).join('').toUpperCase() || u.email[0].toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function search() {
  admin.fetchUsers({ role: 'content_writer', search: query.value || undefined });
}

onMounted(() => admin.fetchUsers({ role: 'content_writer' }));
</script>
