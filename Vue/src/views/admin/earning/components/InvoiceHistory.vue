<template>
  <b-row class="g-4">
    <!-- Revenue by course -->
    <b-col lg="6">
      <b-card no-body class="bg-transparent border">
        <b-card-header class="bg-light border-bottom">
          <h5 class="mb-0">Revenue by Course</h5>
        </b-card-header>
        <b-card-body class="pb-0">
          <div v-if="!adminStore.revenue" class="text-center py-4">
            <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
          </div>
          <div v-else-if="!adminStore.revenue.byCourse.length" class="text-muted text-center py-4">No revenue data yet</div>
          <div v-else class="table-responsive border-0 mb-0">
            <table class="table table-dark-gray align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th class="border-0 rounded-start">Course</th>
                  <th class="border-0">Subscribers</th>
                  <th class="border-0 rounded-end">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in adminStore.revenue.byCourse" :key="item.course.id">
                  <td><h6 class="mb-0">{{ item.course.title }}</h6></td>
                  <td>{{ item.count }}</td>
                  <td class="fw-bold text-primary">${{ item.revenue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Monthly revenue -->
    <b-col lg="6">
      <b-card no-body class="bg-transparent border">
        <b-card-header class="bg-light border-bottom">
          <h5 class="mb-0">Monthly Revenue (Last 6 Months)</h5>
        </b-card-header>
        <b-card-body>
          <div v-if="!adminStore.revenue" class="text-center py-4">
            <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
          </div>
          <div v-else>
            <div v-for="item in adminStore.revenue.monthly" :key="item.month" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold">{{ item.month }}</span>
                <span class="small text-primary fw-bold">${{ item.revenue }}</span>
              </div>
              <b-progress class="progress-sm">
                <b-progress-bar
                  :value="maxMonthRevenue ? (item.revenue / maxMonthRevenue) * 100 : 0"
                  variant="primary" />
              </b-progress>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

const maxMonthRevenue = computed(() => {
  if (!adminStore.revenue?.monthly?.length) return 0
  return Math.max(...adminStore.revenue.monthly.map(m => m.revenue), 1)
})

onMounted(() => adminStore.fetchRevenue())
</script>
