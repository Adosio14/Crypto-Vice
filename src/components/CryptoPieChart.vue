<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { initializeChart, updateChart } from '../utils/chart.utils';
import type { Chart } from 'chart.js';
import type { TransactionResponse } from '../models/responses/transaction.response.model';

const props = defineProps<{
    transactions: TransactionResponse[]
}>()

const chartInstance = ref<Chart<'pie'> | null>(null)
const chartRef = ref<HTMLCanvasElement | null>(null)

initializeChart()

const updateChartInstance = () => {
    if (chartRef.value) {
        chartInstance.value = updateChart(
            chartRef.value,
            props.transactions,
            chartInstance.value
        )
    }
}

watch(() => props.transactions, updateChartInstance)

onMounted(updateChartInstance)
onUnmounted(() => {
    if (chartInstance.value) {
        chartInstance.value.destroy()
    }
})
</script>

<template>
    <div class="bg-[#b3fbe383] p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Distribución de Criptomonedas
        </h2>
        <div class="relative h-76">
            <canvas ref="chartRef"></canvas>
        </div>
        <div class="mt-4 text-sm text-gray-500">
            * Valores en unidades de criptomoneda
        </div>
    </div>
</template>