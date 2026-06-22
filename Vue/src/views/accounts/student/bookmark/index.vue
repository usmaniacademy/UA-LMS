<template>
  <StudentLayout>
    <b-col xl="9">
      <b-card no-body class="bg-transparent border rounded-3">
        <b-card-header class="bg-transparent border-bottom">
          <h3 class="mb-0">My Wishlist</h3>
        </b-card-header>
        <b-card-body>
          <div class="text-center py-5">
            <p class="text-muted mb-3">Your wishlist is empty.</p>
            <router-link :to="{ name: 'courses.list' }" class="btn btn-primary mb-0">Browse courses</router-link>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </StudentLayout>
</template>
<script setup lang="ts">
import StudentLayout from '@/layouts/StudentLayout.vue';
</script>
