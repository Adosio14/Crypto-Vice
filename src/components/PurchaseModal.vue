<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import { ref, computed } from 'vue';
import type { Transaction } from '../models/base/transaction.model';
import { useCryptoStore } from '../stores/crypto.store';
import { useUserStore } from '../stores/user.store';
import apiService from '../services/api.service';
import { cryptoOptions } from '../data/crypto-data';
import type { CryptoType } from '../data/crypto-type';

const userStore = useUserStore();
const cryptoStore = useCryptoStore();

defineProps<{
    show: boolean
}>()


const emit = defineEmits<{
    (e: 'update:show', value: boolean): void
}>()

const loading = ref<boolean>(false);

const formData = ref<{
    amount: number
    crypto: CryptoType | ''
}>({
    amount: 0,
    crypto: ''
})


const cryptoAmount = computed(() => {
    if (!formData.value.crypto || !cryptoStore.prices[formData.value.crypto]?.ask) return 0
    return formData.value.amount / cryptoStore.prices[formData.value.crypto].ask
})

const handleSubmit = async () => {
    loading.value = true;
    if (!formData.value.crypto || formData.value.amount <= 0) return

    const transaction: Transaction = {
        action: 'purchase',
        crypto_code: formData.value.crypto.toUpperCase(),
        crypto_amount: cryptoAmount.value.toFixed(8),
        money: formData.value.amount.toFixed(2),
        datetime: new Date().toISOString(),
        user_id: userStore.username ?? ''
    }
    console.log("Transaction: ", transaction)
    if (!transaction.user_id) {
        console.error('No hay usuario autenticado')
        return
    }

    try {
        console.log("CryptoAmount: ", cryptoAmount.value);
        await apiService.createTransaction(transaction);
        cryptoStore.updateUserCryptoBalance(formData.value.crypto, cryptoAmount.value)
    } catch (err) {
        console.log("Error peganodle a la api: ", err);
    } finally {
        loading.value = false;
    }
    emit('update:show', false)
    resetForm()
}


const resetForm = () => {
    formData.value = { amount: 0, crypto: '' }
}




</script>

<template>
    <BaseModal :show="show" @close="emit('update:show', false)">
        <template #header>
            <h3 class="text-2xl font-bold text-[#42f5b9]">Compra de Criptomonedas</h3>
        </template>

        <template #body>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <select v-model="formData.crypto" class="w-full p-2 border rounded-md" required>
                        <option value="" disabled>Selecciona una criptomoneda</option>
                        <option v-for="option in cryptoOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
                <div>
                    <input type="number" v-model.number="formData.amount" placeholder="Monto en ARS"
                        class="w-full p-2 border rounded-md" min="0" step="0.01" required>
                </div>
                <div v-if="formData.crypto && cryptoStore.prices[formData.crypto]?.ask" class="text-sm text-gray-400">
                    <p>Precio actual: ${{ cryptoStore.prices[formData.crypto].ask.toLocaleString() }}</p>
                    <p>
                        Recibirás:
                        <span class="font-bold text-[#42f5b9]">
                            {{ cryptoAmount.toFixed(6) }} {{ formData.crypto.toUpperCase() }}
                        </span>
                    </p>
                </div>
                <button type="submit"
                    class="w-full bg-[#42f5b9] text-white py-2 rounded-md hover:bg-[#34d4a1] transition-colors disabled:opacity-50"
                    :disabled="!formData.crypto || formData.amount <= 0 || loading">
                    {{ loading ? "Procesando..." : "Confirmar compra" }}
                </button>
            </form>
        </template>

        <template #footer>

        </template>
    </BaseModal>
</template>