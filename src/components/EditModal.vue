<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import apiService from '../services/api.service'
import type { TransactionResponse } from '../models/responses/transaction.response.model'
import type { CryptoType } from '../data/crypto-type';
import { cryptoOptions } from '../data/crypto-data';



const props = defineProps<{
    show: boolean
    transactionId?: string | null
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'updated', transaction: TransactionResponse): void
}>()

const localTransaction = ref<TransactionResponse | null>(null)
const isLoading = ref<boolean>(false)
const isUpdating = ref<boolean>(false);
const error = ref<string | null>(null)

// Conversión de fechas
const utcToLocal = (utcDate: string) => {
    const date = new Date(utcDate)
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
}

const localToUTC = (localDate: string) => {
    const date = new Date(localDate)
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString()
}

// Fetch transaction data
watch(() => props.show, async (isVisible) => {
    if (isVisible && props.transactionId) {
        try {
            isLoading.value = true
            error.value = null
            const response = await apiService.getTransactionById(props.transactionId)

            localTransaction.value = {
                ...response!,
                crypto_code: response!.crypto_code.toLowerCase() as CryptoType, // Normalizar a minúsculas
                datetime: utcToLocal(response!.datetime) // Convertir a formato local
            }

        } catch (err) {
            error.value = 'Error al cargar la transacción'
            console.error(err)
            emit('close')
        } finally {
            isLoading.value = false
        }
    }
})

const handleSubmit = async () => {
    if (!localTransaction.value) return
    isUpdating.value = true;
    try {
        const payload = {
            ...localTransaction.value,
            crypto_code: localTransaction.value.crypto_code.toUpperCase(),
            datetime: localToUTC(localTransaction.value.datetime)
        }
        const response = await apiService.editTransaction(localTransaction.value._id, payload);
        emit('updated', response!)

    } catch (err) {
        error.value = 'Error al guardar los cambios'
        console.error(err)
    } finally {
        isUpdating.value = false;
        emit('close')
    }

}
</script>

<template>
    <BaseModal :show="show" title="Editar Transacción" @close="emit('close')">
        <template #body>
            <div v-if="isLoading" class="text-center py-4">
                <span class="animate-pulse">Cargando transacción...</span>
            </div>

            <div v-else-if="error" class="text-red-500 text-center p-4">
                {{ error }}
            </div>

            <form v-else-if="localTransaction" @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Acción</label>
                    <select v-model="localTransaction.action"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffc9d9] focus:border-[#ffc9d9]">
                        <option value="purchase">Compra</option>
                        <option value="sale">Venta</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Criptomoneda</label>
                    <select v-model="localTransaction.crypto_code"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffc9d9] focus:border-[#ffc9d9]">
                        <option v-for="crypto in cryptoOptions" :key="crypto.value" :value="crypto.value">
                            {{ crypto.label }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad de Crypto</label>
                    <input v-model.number="localTransaction.crypto_amount" type="number" step="0.00000001" min="0"
                        placeholder="Ej: 0.5"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffc9d9] focus:border-[#ffc9d9]" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Monto en Pesos</label>
                    <input v-model.number="localTransaction.money" type="number" step="0.01" min="0"
                        placeholder="Ej: 150000.00"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffc9d9] focus:border-[#ffc9d9]" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
                    <input v-model="localTransaction.datetime" type="datetime-local"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffc9d9] focus:border-[#ffc9d9]" />
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                    <button v-if="!isUpdating" type="button" @click="emit('close')"
                        class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm transition-colors">
                        Cancelar
                    </button>
                    <button :disabled="isUpdating" type="submit"
                        class="px-4 py-2 bg-[#ffc9d9] text-gray-900 hover:bg-[#f8b5c9] rounded-md shadow-sm transition-colors">
                        {{ isUpdating ? "Actualizando transacción..." : "Guardar Cambios" }}
                    </button>
                </div>
            </form>
        </template>
    </BaseModal>
</template>