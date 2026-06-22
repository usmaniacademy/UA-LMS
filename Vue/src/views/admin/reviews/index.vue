<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col cols="12">
        <h1 class="h3 mb-0">Reviews</h1>
      </b-col>
    </b-row>
    <b-card no-body class="bg-transparent border">
      <b-card-body>
        <div class="text-center py-5 text-muted">
          <p class="mb-1">No reviews yet.</p>
          <p class="small mb-0">Course reviews left by students will appear here.</p>
        </div>
      </b-card-body>
    </b-card>
  </AdminLayout>
</template>
<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
</script>
