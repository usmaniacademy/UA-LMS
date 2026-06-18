<template>
  <PagesLayout>
    <section class="py-5 min-vh-80 d-flex align-items-center">
      <b-container>
        <b-row class="justify-content-center">
          <b-col md="6" class="text-center">
            <div class="fs-1 mb-3">🎉</div>
            <h2 class="fw-bold mb-2">You're enrolled!</h2>
            <p class="text-muted mb-4">Your subscription is now active. Start learning right away.</p>
            <div class="d-flex gap-3 justify-content-center">
              <router-link :to="{ name: 'student.course' }" class="btn btn-primary">
                Go to My Courses
              </router-link>
              <router-link :to="{ name: 'courses.list' }" class="btn btn-outline-secondary">
                Browse More Courses
              </router-link>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </PagesLayout>
</template>

<script setup lang="ts">
import PagesLayout from '@/layouts/PagesLayout.vue'
</script>
