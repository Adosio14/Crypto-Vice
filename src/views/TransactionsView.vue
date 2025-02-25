<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TransactionResponse } from '../models/responses/transaction.response.model'
import apiService from '../services/api.service'
import { useUserStore } from '../stores/user.store'
import EditModal from '../components/EditModal.vue'
import CryptoPieChart from '../components/CryptoPieChart.vue'
import InvestmentsResults from '../components/InvestmentsResults.vue'

const userStore = useUserStore();
const user = userStore.username;
const items = ref<TransactionResponse[]>([])
const isLoading = ref<boolean>(true)
const deleting = ref<boolean>(false);
const errorMessage = ref<string | null>(null)
const showEditModal = ref<boolean>(false)
const selectedTransactionId = ref<string | null>(null)

const fetchData = async () => {
    try {
        isLoading.value = true
        errorMessage.value = null
        const response = await apiService.getUserTransactions(user!);
        items.value = response!
    } catch (error) {
        errorMessage.value = 'Failed to load data. Please try again later.'
    } finally {
        isLoading.value = false
    }
}

const handleDelete = async (id: string) => {
    try {
        await apiService.deleteTransaction(id);
        await refreshList();
    } catch (err) {
        console.log("Error deleting transaction");
    }
}
onMounted(() => {
    fetchData()
})

const refreshList = async () => {
    await fetchData()
}

const handleEdit = (transactionId: string) => {
    selectedTransactionId.value = transactionId
    showEditModal.value = true
}

const handleUpdated = (updatedTransaction: TransactionResponse) => {
    const index = items.value.findIndex(item => item._id === updatedTransaction._id)
    if (index !== -1) {
        items.value[index] = updatedTransaction
    }
    fetchData();
}
</script>

<template>

    <div class="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-12 h-[90vh] bg-white rounded-xl shadow-lg p-6">
        <div class="col-span-full">
            <button @click="$router.go(-1)"
                class="flex items-center px-3 py-1.5 text-sm bg-[#f894d585] hover:bg-[#da7eb8b2] text-black rounded-md transition-colors">
                Volver
            </button>
        </div>
        <div class="bg-[#b3e5fb67] rounded-xl shadow-lg p-6 h-[75vh] flex flex-col">
            <h2 class="text-2xl font-bold mb-4 text-[#f894d5]">Historial de transacciones</h2>
            <div class="flex-1 overflow-y-auto pr-2 space-y-4">
                <div v-if="isLoading" class="text-gray-500">Cargando tus transacciones...</div>
                <div v-else-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

                <div v-else class="space-y-4 my-4">
                    <div v-for="item in items" :key="item._id" class="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-lg font-semibold text-gray-700">Transacción #{{ item._id }}</h3>
                            <span :class="[
                                'px-3 py-1 rounded-full text-sm font-semibold',
                                item.action === 'purchase'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-[#fab4c92d] text-[#f789aa]'
                            ]">
                                {{ item.action == 'purchase' ? "Compra" : "Venta" }}
                            </span>
                        </div>
                        <div class="space-y-2 text-gray-600 mb-4">
                            <div class="flex justify-between">
                                <span>Total de cripto:</span>
                                <span class="font-medium">{{ item.crypto_amount }} {{ item.crypto_code }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span> Monto {{ item.action == 'purchase' ? " Pagado" : " Recibido" }}:</span>
                                <span class="font-medium">{{ item.money }} ARS</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Fecha:</span>
                                <span class="font-medium">{{ item.datetime }}</span>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button @click.prevent="handleEdit(item._id)"
                                class="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors">
                                Editar
                            </button>
                            <button @click="handleDelete(item._id)" :disabled="deleting"
                                class="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors">
                                {{ deleting ? "Eliminando..." : "Eliminar" }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-center gap-8 ">
            <CryptoPieChart :transactions="items" />
            <InvestmentsResults :transactions="items" />
        </div>

        <EditModal :show="showEditModal" :transaction-id="selectedTransactionId" @close="showEditModal = false"
            @updated="handleUpdated" />
    </div>
</template>
