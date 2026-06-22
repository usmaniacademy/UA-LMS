<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col cols="12">
        <h1 class="h3 mb-0">Course Categories</h1>
      </b-col>
    </b-row>

    <b-card no-body class="bg-transparent border">
      <b-card-body>
        <div v-if="admin.loading && !admin.courses.length" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        <div v-else class="table-responsive border-0 mb-0">
          <table class="table table-dark-gray align-middle mb-0">
            <thead>
              <tr>
                <th class="border-0 rounded-start">Category</th>
                <th class="border-0 rounded-end">Courses</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in categories" :key="cat.name">
                <td><span class="badge bg-primary bg-opacity-10 text-primary">{{ cat.name }}</span></td>
                <td>{{ cat.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-card-body>
    </b-card>
  </AdminLayout>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useAdminStore } from '@/stores/admin';

const admin = useAdminStore();

const BASE = ['Islamic Studies', 'Astronomy', 'Technology'];

const categories = computed(() => {
  const counts: Record<string, number> = {};
  for (const c of admin.courses) {
    const key = c.category || 'Uncategorized';
    counts[key] = (counts[key] || 0) + 1;
  }
  // Always show the three core subjects, plus any others found in real courses
  const names = Array.from(new Set([...BASE, ...Object.keys(counts)]));
  return names.map((name) => ({ name, count: counts[name] || 0 }));
});

onMounted(() => { if (!admin.courses.length) admin.fetchCourses({ limit: 100 } as any); });
</script>
