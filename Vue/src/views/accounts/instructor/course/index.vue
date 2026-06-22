<template>
  <InstructorLayout>
    <b-col xl="9">
      <b-card no-body class="border bg-transparent rounded-3">
        <b-card-header class="bg-transparent border-bottom d-flex justify-content-between align-items-center">
          <h3 class="mb-0">My Courses</h3>
          <router-link :to="{ name: 'instructor.create.course' }" class="btn btn-primary btn-sm mb-0">
            + Create Course
          </router-link>
        </b-card-header>

        <b-card-body>
          <!-- Loading -->
          <div v-if="store.loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="store.myCourses.length === 0" class="text-center py-5">
            <h5 class="text-muted">No courses yet</h5>
            <p class="text-muted">Create your first course to get started.</p>
            <router-link :to="{ name: 'instructor.create.course' }" class="btn btn-primary">
              Create a Course
            </router-link>
          </div>

          <template v-else>
            <div class="table-responsive border-0">
              <table class="table table-dark-gray align-middle p-4 mb-0 table-hover">
                <thead>
                  <tr>
                    <th class="border-0 rounded-start">Course</th>
                    <th class="border-0">Students</th>
                    <th class="border-0">Status</th>
                    <th class="border-0">Price</th>
                    <th class="border-0 rounded-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in store.myCourses" :key="course.id">
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <img
                          :src="course.thumbnailUrl || defaultThumb"
                          class="rounded"
                          style="width:60px;height:45px;object-fit:cover"
                          alt=""
                        />
                        <div>
                          <h6 class="mb-0">
                            <router-link :to="{ name: 'course.detail.slug', params: { slug: course.slug } }">
                              {{ course.title }}
                            </router-link>
                          </h6>
                          <small class="text-muted text-capitalize">{{ course.category }} · {{ course.level }}</small>
                        </div>
                      </div>
                    </td>
                    <td>{{ course.totalStudents }}</td>
                    <td>
                      <span class="badge"
                        :class="{
                          'bg-success bg-opacity-10 text-success': course.status === 'published',
                          'bg-warning bg-opacity-10 text-warning': course.status === 'draft',
                          'bg-secondary bg-opacity-10 text-secondary': course.status === 'archived'
                        }">
                        {{ course.status }}
                      </span>
                    </td>
                    <td>{{ course.isFree ? 'Free' : 'Paid' }}</td>
                    <td>
                      <div class="d-flex gap-1 flex-wrap">
                        <router-link
                          :to="{ name: 'instructor.edit.course', params: { id: course.id } }"
                          class="btn btn-sm btn-primary-soft mb-0"
                          title="Edit course, curriculum & Zoom classes"
                        >Edit</router-link>
                        <b-button
                          v-if="course.status === 'draft'"
                          size="sm"
                          variant="outline-success"
                          @click="publish(course.id)"
                          title="Publish"
                        >Publish</b-button>
                        <b-button
                          v-if="course.status !== 'archived'"
                          size="sm"
                          variant="outline-danger"
                          @click="archive(course.id)"
                          title="Archive"
                        >Archive</b-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </b-card-body>
      </b-card>
    </b-col>
  </InstructorLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import InstructorLayout from '@/layouts/InstructorLayout.vue'
import { useCourseStore } from '@/stores/course'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'

const store = useCourseStore()

onMounted(() => store.fetchMyCourses())

async function publish(id: string) {
  if (!confirm('Publish this course? It will be visible to all students.')) return
  await store.publishCourse(id)
}

async function archive(id: string) {
  if (!confirm('Archive this course? It will be hidden from students.')) return
  await store.archiveCourse(id)
}
</script>
