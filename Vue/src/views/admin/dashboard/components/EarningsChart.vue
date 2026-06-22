<template>
  <b-col xxl="8">
    <b-card no-body class="shadow h-100">
      <b-card-header class="p-4 border-bottom">
        <h5 class="card-header-title">Earnings (last 6 months)</h5>
      </b-card-header>
      <b-card-body>
        <ApexChart v-if="hasData" :chart="payoutChart" class="apex-charts" id="ChartPayout" />
        <div v-else class="text-center text-muted py-5">
          No revenue yet. Monthly earnings will appear here once students subscribe.
        </div>
      </b-card-body>
    </b-card>
  </b-col>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { currency } from '@/helpers/constants';

const admin = useAdminStore();

const monthly = computed(() => admin.revenue?.monthly ?? []);
const hasData = computed(() => monthly.value.some((m) => m.revenue > 0));

const themeColor = (v: string) => {
  const t = getComputedStyle(document.documentElement).getPropertyValue(v);
  return t ? t.trim() : '#0F766E';
};

const payoutChart = computed(() => ({
  height: 300,
  type: 'area',
  series: [{ name: 'Revenue', data: monthly.value.map((m) => m.revenue) }],
  options: {
    chart: { height: 300, type: 'area', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    colors: [themeColor('--bs-primary')],
    xaxis: {
      categories: monthly.value.map((m) => m.month),
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: [{ axisTicks: { show: false }, axisBorder: { show: false } }],
    tooltip: { y: { formatter: (val: number) => `${currency}${val.toLocaleString()}` } }
  }
}));

onMounted(() => {
  if (!admin.revenue) admin.fetchRevenue();
});
</script>
