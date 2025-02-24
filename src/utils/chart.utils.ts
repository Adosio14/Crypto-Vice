
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
import type { TransactionResponse } from '../models/responses/transaction.response.model'

export const initializeChart = () => {
    Chart.register(PieController, ArcElement, Tooltip, Legend)
}

export interface ChartData {
    labels: string[]
    datasets: {
        data: number[]
        backgroundColor: string[]
        borderWidth: number
    }[]
}

const CRYPTO_COLORS = {
    BTC: '#42f5b9',
    ETH: '#f894d5',
    DAI: '#83d9fd'
} as const

export const getChartData = (transactions: TransactionResponse[]): ChartData => {
    const totals = {
        BTC: 0,
        ETH: 0,
        DAI: 0
    }

    transactions.forEach(({ crypto_code, crypto_amount, action }) => {
        const code = crypto_code.toUpperCase() as keyof typeof totals
        if (totals[code] !== undefined && action === 'purchase') {
            totals[code] += parseFloat(crypto_amount)
        }
    })

    return {
        labels: Object.keys(totals),
        datasets: [{
            data: Object.values(totals),
            backgroundColor: Object.keys(totals).map(c => CRYPTO_COLORS[c as keyof typeof CRYPTO_COLORS]),
            borderWidth: 2
        }]
    }
}

export const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                color: '#6b7280',
                font: {
                    size: 14
                }
            }
        },
        tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f9fafb',
            bodyColor: '#f9fafb',
            cornerRadius: 4
        }
    }
}

export const updateChart = (
    canvas: HTMLCanvasElement,
    transactions: TransactionResponse[],
    existingChart?: Chart<'pie'> | null
): Chart<'pie'> => {
    if (existingChart) {
        existingChart.destroy()
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    return new Chart(ctx, {
        type: 'pie',
        data: getChartData(transactions),
        options: CHART_OPTIONS
    })
}