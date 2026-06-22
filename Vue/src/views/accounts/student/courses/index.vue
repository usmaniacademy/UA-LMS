<template>
  <StudentLayout>
    <b-col xl="9">
      <b-card no-body class="bg-transparent border rounded-3">
        <b-card-header class="bg-transparent border-bottom d-flex justify-content-between align-items-center">
          <h3 class="mb-0">My Courses</h3>
          <router-link :to="{ name: 'courses.list' }" class="btn btn-sm btn-primary-soft mb-0">Browse courses</router-link>
        </b-card-header>
        <b-card-body>
          <div v-if="store.loading && !enrolled.length" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else-if="!enrolled.length" class="text-center py-5">
            <p class="text-muted mb-3">You're not enrolled in any courses yet.</p>
            <router-link :to="{ name: 'courses.list' }" class="btn btn-primary mb-0">Explore courses</router-link>
          </div>

          <div v-else class="table-responsive border-0">
            <table class="table table-dark-gray align-middle p-4 mb-0 table-hover">
              <thead>
                <tr>
                  <th scope="col" class="border-0 rounded-start">Course</th>
                  <th scope="col" class="border-0">Instructor</th>
                  <th scope="col" class="border-0">Category</th>
                  <th scope="col" class="border-0 rounded-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in enrolled" :key="item.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="w-60px">
                        <img v-if="item.course.thumbnailUrl" :src="item.course.thumbnailUrl" class="rounded" alt="">
                        <span v-else class="d-flex align-items-center justify-content-center bg-light rounded text-muted"
                          style="width:60px;height:45px;">
                          <BIconPlayCircle />
                        </span>
                      </div>
                      <h6 class="mb-0 ms-2">{{ item.course.title }}</h6>
                    </div>
                  </td>
                  <td>{{ item.course.instructor?.firstName }} {{ item.course.instructor?.lastName }}</td>
                  <td><span class="badge bg-primary bg-opacity-10 text-primary">{{ item.course.category || '—' }}</span></td>
                  <td>
                    <router-link :to="{ name: 'course.detail.slug', params: { slug: item.course.slug } }"
                      class="btn btn-sm btn-primary-soft mb-0 icons-center">
                      <BIconPlayCircle class="me-1" /> Go to course
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </StudentLayout>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import StudentLayout from '@/layouts/StudentLayout.vue';
import { useCourseStore } from '@/stores/course';
import { BIconPlayCircle } from 'bootstrap-icons-vue';

const store = useCourseStore();
const enrolled = computed(() => store.enrolledCourses);

onMounted(() => store.fetchEnrolledCourses());
</script>
