<template>
  <InstructorLayout>
    <b-col xl="9">
      <b-card no-body class="border bg-transparent rounded-3">
        <b-card-header class="bg-transparent border-bottom">
          <h3 class="mb-0">Quizzes</h3>
        </b-card-header>
        <b-card-body>
          <div class="text-center py-5 text-muted">
            <p class="mb-1">You haven't created any quizzes yet.</p>
            <p class="small mb-0">Quizzes you add to your courses will appear here.</p>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </InstructorLayout>
</template>
<script setup lang="ts">
import InstructorLayout from '@/layouts/InstructorLayout.vue';
</script>
