<template>
  <InstructorLayout>
    <b-col xl="9">
      <b-card no-body class="border bg-transparent rounded-3">
        <b-card-header class="bg-transparent border-bottom">
          <h3 class="mb-0">Quizzes</h3>
        </b-card-header>
        <b-card-body>
          <div v-if="quizStore.loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else-if="quizStore.instructorQuizzes.length === 0" class="text-center py-5 text-muted">
            <p class="mb-1">You haven't created any quizzes yet.</p>
            <p class="small mb-0">Open a course's Curriculum step to add one.</p>
          </div>

          <div v-else class="table-responsive border-0">
            <table class="table table-dark-gray align-middle mb-0">
              <thead>
                <tr>
                  <th class="border-0 rounded-start">Quiz</th>
                  <th class="border-0">Course</th>
                  <th class="border-0">Questions</th>
                  <th class="border-0">Attempts</th>
                  <th class="border-0">Pass rate</th>
                  <th class="border-0 rounded-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="quiz in quizStore.instructorQuizzes" :key="quiz.id">
                  <td><h6 class="mb-0">{{ quiz.title }}</h6></td>
                  <td>{{ quiz.course?.title }}</td>
                  <td>{{ quiz.questions.length }}</td>
                  <td>{{ quiz.attempts?.length || 0 }}</td>
                  <td>{{ passRate(quiz) }}</td>
                  <td>
                    <router-link :to="{ name: 'instructor.edit.course', params: { id: quiz.course?.id } }"
                      class="btn btn-sm btn-primary-soft mb-0">Edit</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </InstructorLayout>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import InstructorLayout from '@/layouts/InstructorLayout.vue';
import { useQuizStore } from '@/stores/quiz';
import type { Quiz } from '@/stores/quiz';

const quizStore = useQuizStore();

onMounted(() => quizStore.fetchInstructorQuizzes());

function passRate(quiz: Quiz) {
  const attempts = quiz.attempts || [];
  if (!attempts.length) return '—';
  const passed = attempts.filter((a: any) => a.passed).length;
  return `${Math.round((passed / attempts.length) * 100)}%`;
}
</script>
