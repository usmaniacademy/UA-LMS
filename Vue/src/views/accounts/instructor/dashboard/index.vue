<template>
  <InstructorLayout>
    <b-col xl="9">
      <!-- Stat cards (no revenue — instructors are salaried) -->
      <b-row class="g-4">
        <b-col sm="6">
          <div class="d-flex justify-content-center align-items-center p-4 bg-warning bg-opacity-15 rounded-3">
            <span class="display-6 text-warning mb-0">
              <font-awesome-icon :icon="faTv" class="fa-fw" />
            </span>
            <div class="ms-4">
              <h5 class="mb-0 fw-bold">{{ stats?.totalCourses ?? 0 }}</h5>
              <span class="mb-0 h6 fw-light">Total Courses</span>
            </div>
          </div>
        </b-col>
        <b-col sm="6">
          <div class="d-flex justify-content-center align-items-center p-4 bg-purple bg-opacity-10 rounded-3">
            <span class="display-6 text-purple mb-0">
              <font-awesome-icon :icon="faUserGraduate" class="fa-fw" />
            </span>
            <div class="ms-4">
              <h5 class="mb-0 fw-bold">{{ stats?.totalStudents ?? 0 }}</h5>
              <span class="mb-0 h6 fw-light">Enrolled Students</span>
            </div>
          </div>
        </b-col>
      </b-row>

      <!-- Courses -->
      <b-row>
        <b-col cols="12">
          <b-card no-body class="border bg-transparent rounded-3 mt-5">
            <b-card-header class="bg-transparent border-bottom">
              <div class="d-sm-flex justify-content-sm-between align-items-center">
                <h3 class="mb-2 mb-sm-0">Your Courses</h3>
                <router-link :to="{ name: 'instructor.course' }" class="btn btn-sm btn-primary-soft mb-0">Manage courses</router-link>
              </div>
            </b-card-header>
            <b-card-body>
              <div v-if="courseStore.loading && !stats" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>

              <div v-else-if="!stats?.topCourses?.length" class="text-center py-5">
                <p class="text-muted mb-3">You haven't created any courses yet.</p>
                <router-link :to="{ name: 'instructor.create.course' }" class="btn btn-primary mb-0">
                  Create your first course
                </router-link>
              </div>

              <div v-else class="table-responsive border-0 rounded-3">
                <table class="table table-dark-gray align-middle p-4 mb-0">
                  <thead>
                    <tr>
                      <th scope="col" class="border-0 rounded-start">Course Name</th>
                      <th scope="col" class="border-0">Students</th>
                      <th scope="col" class="border-0">Status</th>
                      <th scope="col" class="border-0 rounded-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="course in stats.topCourses" :key="course.id">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="w-60px">
                            <img v-if="course.thumbnailUrl" :src="course.thumbnailUrl" class="rounded" alt="">
                            <span v-else class="d-flex align-items-center justify-content-center bg-light rounded text-muted"
                              style="width:60px;height:45px;">
                              <font-awesome-icon :icon="faBook" />
                            </span>
                          </div>
                          <h6 class="mb-0 ms-2 table-responsive-title">{{ course.title }}</h6>
                        </div>
                      </td>
                      <td>{{ course.students }}</td>
                      <td>
                        <span class="badge bg-opacity-10 text-capitalize"
                          :class="course.status === 'published' ? 'bg-success text-success' : 'bg-warning text-warning'">
                          {{ course.status }}
                        </span>
                      </td>
                      <td>
                        <router-link :to="{ name: 'instructor.edit.course', params: { id: course.id } }"
                          class="btn btn-sm btn-primary-soft mb-0">Manage</router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
  </InstructorLayout>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import InstructorLayout from '@/layouts/InstructorLayout.vue';
import { useCourseStore } from '@/stores/course';

import { faTv, faUserGraduate, faBook } from '@fortawesome/free-solid-svg-icons';

const courseStore = useCourseStore();
const stats = computed(() => courseStore.instructorStats);

onMounted(() => {
  courseStore.fetchInstructorStats();
});
</script>
