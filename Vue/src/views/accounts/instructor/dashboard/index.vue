<template>
  <InstructorLayout>
    <b-col xl="9">
      <!-- Stat cards -->
      <b-row class="g-4">
        <b-col sm="6" lg="4">
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
        <b-col sm="6" lg="4">
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
        <b-col sm="6" lg="4">
          <div class="d-flex justify-content-center align-items-center p-4 bg-info bg-opacity-10 rounded-3">
            <span class="display-6 text-info mb-0">
              <font-awesome-icon :icon="faGem" class="fa-fw" />
            </span>
            <div class="ms-4">
              <h5 class="mb-0 fw-bold">{{ stats?.activeSubs ?? 0 }}</h5>
              <span class="mb-0 h6 fw-light">Active Subscriptions</span>
            </div>
          </div>
        </b-col>
      </b-row>

      <!-- Earnings -->
      <b-row class="mt-5">
        <b-col cols="12">
          <b-card no-body class="card-body bg-transparent border p-4 h-100">
            <b-row class="g-4">
              <b-col sm="6" md="4">
                <span class="badge text-bg-dark">Current Month</span>
                <h4 class="text-primary my-2">{{ currency }}{{ (stats?.currentMonthEarnings ?? 0).toLocaleString() }}</h4>
                <p class="mb-0 text-muted small">Earnings this month</p>
              </b-col>
              <b-col sm="6" md="4">
                <span class="badge text-bg-dark">Last Month</span>
                <h4 class="my-2">{{ currency }}{{ (stats?.lastMonthEarnings ?? 0).toLocaleString() }}</h4>
                <p class="mb-0 text-muted small">Earnings last month</p>
              </b-col>
              <b-col sm="6" md="4">
                <span class="badge text-bg-dark">Lifetime</span>
                <h4 class="my-2">{{ currency }}{{ (stats?.totalEarnings ?? 0).toLocaleString() }}</h4>
                <p class="mb-0 text-muted small">Total earnings to date</p>
              </b-col>
            </b-row>
            <ApexChart v-if="hasEarnings" :chart="payoutChart" class="apex-charts mt-3" id="ChartPayout" />
            <div v-else class="text-center text-muted py-5 border rounded-3 mt-3">
              No earnings yet. Your monthly earnings will appear here once students subscribe to your courses.
            </div>
          </b-card>
        </b-col>
      </b-row>

      <!-- Top courses -->
      <b-row>
        <b-col cols="12">
          <b-card no-body class="border bg-transparent rounded-3 mt-5">
            <b-card-header class="bg-transparent border-bottom">
              <div class="d-sm-flex justify-content-sm-between align-items-center">
                <h3 class="mb-2 mb-sm-0">Your Courses</h3>
                <router-link :to="{ name: 'instructor.course' }" class="btn btn-sm btn-primary-soft mb-0">View all</router-link>
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
                      <th scope="col" class="border-0">Subscriptions</th>
                      <th scope="col" class="border-0">Revenue</th>
                      <th scope="col" class="border-0 rounded-end">Status</th>
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
                      <td>{{ course.subscriptions }}</td>
                      <td>{{ currency }}{{ course.revenue.toLocaleString() }}</td>
                      <td>
                        <span class="badge bg-opacity-10 text-capitalize"
                          :class="course.status === 'published' ? 'bg-success text-success' : 'bg-warning text-warning'">
                          {{ course.status }}
                        </span>
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
import { currency } from '@/helpers/constants';
import { useCourseStore } from '@/stores/course';

import { faTv, faUserGraduate, faGem, faBook } from '@fortawesome/free-solid-svg-icons';

const courseStore = useCourseStore();
const stats = computed(() => courseStore.instructorStats);

const hasEarnings = computed(() => (stats.value?.monthly ?? []).some((m) => m.earnings > 0));

const themeColor = (v: string) => {
  const t = getComputedStyle(document.documentElement).getPropertyValue(v);
  return t ? t.trim() : '#066b3d';
};

const payoutChart = computed(() => ({
  height: 300,
  type: 'area',
  series: [{ name: 'Earnings', data: (stats.value?.monthly ?? []).map((m) => m.earnings) }],
  options: {
    chart: { height: 300, type: 'area', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    colors: [themeColor('--bs-primary')],
    xaxis: {
      categories: (stats.value?.monthly ?? []).map((m) => m.label),
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: [{ axisTicks: { show: false }, axisBorder: { show: false } }],
    tooltip: { y: { formatter: (val: number) => `${currency}${val.toLocaleString()}` } }
  }
}));

onMounted(() => {
  courseStore.fetchInstructorStats();
});
</script>
