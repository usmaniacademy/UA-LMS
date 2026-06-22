<template>
  <StudentLayout>
    <b-col xl="9">
      <b-card no-body class="border bg-transparent rounded-3">
        <b-card-header class="bg-transparent border-bottom">
          <h3 class="mb-0">My Quizzes</h3>
        </b-card-header>
        <b-card-body>
          <div class="text-center py-5 text-muted">
            <p class="mb-1">No quizzes available yet.</p>
            <p class="small mb-0">Quizzes from your enrolled courses will appear here.</p>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </StudentLayout>
</template>
<script setup lang="ts">
import StudentLayout from '@/layouts/StudentLayout.vue';
</script>
