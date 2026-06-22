<template>
  <InstructorLayout>
    <b-col xl="9">
      <b-card no-body class="border bg-transparent rounded-3">
        <b-card-header class="bg-transparent border-bottom">
          <h3 class="mb-0">My Students</h3>
        </b-card-header>
        <b-card-body>
          <div v-if="store.loading && !students.length" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else-if="!students.length" class="text-center py-5 text-muted">
            No students are enrolled in your courses yet.
          </div>

          <div v-else class="table-responsive border-0">
            <table class="table table-dark-gray align-middle p-4 mb-0 table-hover">
              <thead>
                <tr>
                  <th scope="col" class="border-0 rounded-start">Student</th>
                  <th scope="col" class="border-0">Email</th>
                  <th scope="col" class="border-0">Courses</th>
                  <th scope="col" class="border-0 rounded-end">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in students" :key="student.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar avatar-md mb-2 mb-md-0">
                        <img v-if="student.avatarUrl" :src="student.avatarUrl" class="rounded-circle" alt="">
                        <span v-else
                          class="avatar-img rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
                          {{ initials(student) }}
                        </span>
                      </div>
                      <h6 class="mb-0 ms-2">{{ student.firstName }} {{ student.lastName }}</h6>
                    </div>
                  </td>
                  <td>{{ student.email }}</td>
                  <td>
                    <span v-for="(c, i) in student.courses" :key="i"
                      class="badge bg-primary bg-opacity-10 text-primary me-1 mb-1">{{ c }}</span>
                  </td>
                  <td>{{ formatDate(student.enrolledAt) }}</td>
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
import { computed, onMounted } from 'vue';
import InstructorLayout from '@/layouts/InstructorLayout.vue';
import { useCourseStore } from '@/stores/course';

const store = useCourseStore();
const students = computed(() => store.instructorStudents);

function initials(s: any) {
  return [(s.firstName || '')[0], (s.lastName || '')[0]].filter(Boolean).join('').toUpperCase() || (s.email?.[0] || 'U').toUpperCase();
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

onMounted(() => store.fetchInstructorStudents());
</script>
