<script setup lang="ts">
import { ref, watch } from 'vue'

import { CryptoType } from '../data/crypto-type'
import { useCryptoStore } from '../stores/crypto.store';
import type { TransactionResponse } from '../models/responses/transaction.response.model';
import { calculateInvestmentResults } from '../utils/profit.utils';

const props = defineProps<{
    transactions: TransactionResponse[]
}>()

const cryptoStore = useCryptoStore()
const results = ref<Array<{ crypto_code: string, result: number }>>([])

const getCurrentPrice = (cryptoCode: string): number => {
    const normalizedCode = cryptoCode.toLowerCase()
    switch (normalizedCode) {
        case CryptoType.BTC:
            return cryptoStore.prices[CryptoType.BTC]?.totalBid || 0
        case CryptoType.ETH:
            return cryptoStore.prices[CryptoType.ETH]?.totalBid || 0
        case CryptoType.DAI:
            return cryptoStore.prices[CryptoType.DAI]?.totalBid || 0
        default:
            return 0
    }
}

const calculateResults = async () => {
    await cryptoStore.fetchCryptoPrices()
    const currentPrices = props.transactions.reduce((acc, transaction) => {
        const code = transaction.crypto_code.toLowerCase()
        acc[code] = getCurrentPrice(code)
        return acc
    }, {} as Record<string, number>)
    results.value = calculateInvestmentResults(props.transactions, currentPrices)
}

// Watcher para transacciones
watch(() => props.transactions, (newVal) => {
    if (newVal.length > 0) {
        calculateResults()
    }
}, { immediate: true })
</script>

<template>
    <div class="bg-[#dcb9d05e] p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Resultado de Inversiones</h2>
        <table class="w-full">
            <thead>
                <tr class="border-b">
                    <th class="text-left py-2">Criptomoneda</th>
                    <th class="text-right py-2">Resultado</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in results" :key="item.crypto_code" class="border-b">
                    <td class="py-2">{{ item.crypto_code }}</td>
                    <td class="py-2 text-right" :class="item.result >= 0 ? 'text-[#20c28c]' : 'text-[#FF6962]'">
                        ${{ Math.abs(item.result).toLocaleString('es-AR', { maximumFractionDigits: 2 }) }}
                        <span v-if="item.result >= 0">🡅</span>
                        <span v-else>🡇</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>