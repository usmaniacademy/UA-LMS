<template>
  <apexchart
    :height="chart.height"
    :type="chart.type"
    :series="chart.series"
    :options="chart.options"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { ApexChartType } from "@/types";
// Imported locally (not as a global plugin) so it only ends up in the
// bundle chunks for pages that actually render a chart, instead of every
// visitor having to download it before the app can even mount.
import apexchart from "vue3-apexcharts";

defineProps({
  chart: {
    type: Object as PropType<ApexChartType>,
    required: true,
  },
});
</script>
