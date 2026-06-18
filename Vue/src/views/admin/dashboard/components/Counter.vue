<template>
  <b-row class="g-4 mb-4">
    <b-col md="6" xxl="3">
      <b-card no-body class="card-body bg-warning bg-opacity-15 p-4 h-100">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="mb-0 fw-bold h2">{{ adminStore.stats?.totalStudents ?? '—' }}</div>
            <span class="mb-0 h6 fw-light">Total Students</span>
          </div>
          <div class="icon-lg rounded-circle bg-warning text-white mb-0">
            <font-awesome-icon :icon="faUserGraduate" class="fa-fw" />
          </div>
        </div>
      </b-card>
    </b-col>

    <b-col md="6" xxl="3">
      <b-card no-body class="card-body bg-purple bg-opacity-10 p-4 h-100">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="mb-0 fw-bold h2">{{ adminStore.stats?.totalInstructors ?? '—' }}</div>
            <span class="mb-0 h6 fw-light">Instructors</span>
          </div>
          <div class="icon-lg rounded-circle bg-purple text-white mb-0">
            <font-awesome-icon :icon="faUserTie" class="fa-fw" />
          </div>
        </div>
      </b-card>
    </b-col>

    <b-col md="6" xxl="3">
      <b-card no-body class="card-body bg-primary bg-opacity-10 p-4 h-100">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="mb-0 fw-bold h2">{{ adminStore.stats?.totalCourses ?? '—' }}</div>
            <span class="mb-0 h6 fw-light">Total Courses</span>
          </div>
          <div class="icon-lg rounded-circle bg-primary text-white mb-0">
            <font-awesome-icon :icon="faTv" class="fa-fw" />
          </div>
        </div>
      </b-card>
    </b-col>

    <b-col md="6" xxl="3">
      <b-card no-body class="card-body bg-success bg-opacity-10 p-4 h-100">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="mb-0 fw-bold h2">${{ adminStore.stats?.mrr ?? 0 }}</div>
            <span class="mb-0 h6 fw-light">Monthly Revenue (MRR)</span>
          </div>
          <div class="icon-lg rounded-circle bg-success text-white mb-0 flex-centered">
            <BIconCurrencyDollar style="font-size:1.4rem" />
          </div>
        </div>
      </b-card>
    </b-col>
  </b-row>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { faTv, faUserTie, faUserGraduate } from '@fortawesome/free-solid-svg-icons'
import { BIconCurrencyDollar } from 'bootstrap-icons-vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
onMounted(() => adminStore.fetchStats())
</script>
