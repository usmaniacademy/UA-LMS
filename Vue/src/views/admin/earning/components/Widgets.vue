<template>
  <b-row class="g-4 mb-4">
    <b-col sm="6" lg="4">
      <div class="p-4 bg-primary bg-opacity-10 rounded-3">
        <h6>Monthly Revenue (MRR)</h6>
        <h2 class="mb-0 fs-1 text-primary">${{ adminStore.revenue?.mrr ?? 0 }}</h2>
        <p class="text-muted small mb-0 mt-1">{{ adminStore.revenue?.monthly?.at(-1)?.subscriptions ?? 0 }} new subs this month</p>
      </div>
    </b-col>

    <b-col sm="6" lg="4">
      <div class="p-4 bg-purple bg-opacity-10 rounded-3">
        <h6>Active Subscriptions</h6>
        <h2 class="mb-0 fs-1 text-purple">{{ adminStore.stats?.activeSubs ?? 0 }}</h2>
        <p class="text-muted small mb-0 mt-1">$26/month per subscription</p>
      </div>
    </b-col>

    <b-col sm="6" lg="4">
      <div class="p-4 bg-orange bg-opacity-10 rounded-3">
        <h6>Lifetime Revenue</h6>
        <h2 class="mb-0 fs-1 text-orange">${{ adminStore.revenue?.totalRevenue ?? 0 }}</h2>
        <p class="text-muted small mb-0 mt-1">All-time subscription payments</p>
      </div>
    </b-col>
  </b-row>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
onMounted(() => {
  adminStore.fetchRevenue()
  adminStore.fetchStats()
})
</script>
