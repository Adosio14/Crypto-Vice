<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import { ref, computed } from 'vue';
import type { Transaction } from '../models/base/transaction.model';
import { useCryptoStore } from '../stores/crypto.store';
import { useUserStore } from '../stores/user.store';
import { cryptoOptions } from '../data/crypto-data';
import { CryptoType } from '../data/crypto-type';
import apiService from '../services/api.service';

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

const arsAmount = computed(() => {
    if (!formData.value.crypto || !cryptoStore.prices[formData.value.crypto]?.bid) return 0
    return formData.value.amount * cryptoStore.prices[formData.value.crypto].bid
})

const handleSubmit = async () => {
    loading.value = true;
    if (!formData.value.crypto || formData.value.amount <= 0) return

    const transaction: Transaction = {
        action: 'sale',
        crypto_code: formData.value.crypto.toUpperCase(),
        crypto_amount: formData.value.amount.toFixed(8),
        money: arsAmount.value.toFixed(2),
        datetime: new Date().toISOString(),
        user_id: userStore.username ?? ''
    }
    console.log("Transaction: ", transaction)

    if (!transaction.user_id) {
        console.error('No hay usuario autenticado')
        return
    }
    try {
        await apiService.createTransaction(transaction);
        let userCryptoBalance = cryptoStore.getUsetCryptoBalance(formData.value.crypto)!;
        console.log("userCryptoBalance: ", userCryptoBalance);
        userCryptoBalance = userCryptoBalance - formData.value.amount;
        console.log("post userCryptoBalance: ", userCryptoBalance);
        cryptoStore.updateUserCryptoBalance(formData.value.crypto, userCryptoBalance);
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
            <h3 class="text-2xl font-bold text-[#fc9db9]">Venta de Criptomonedas</h3>
        </template>

        <template #body>
            <form @submit.prevent="handleSubmit" class="space-y-4 text-start">
                <div>
                    <label for="crypto-select" class="block text-sm font-bold text-[#fc9db9] mb-1">Criptomoneda</label>
                    <select id="crypto-select" v-model="formData.crypto" class="w-full p-2 border rounded-md" required>
                        <option value="" disabled>Selecciona cripto a vender</option>
                        <option v-for="option in cryptoOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <div>
                    <label for="amount-input" class="block text-sm font-bold text-[#fc9db9] mb-1">Cantidad (en {{
                        formData.crypto.toUpperCase() }})</label>
                    <input type="number" id="amount-input" v-model.number="formData.amount"
                        placeholder="Cantidad a vender" class="w-full p-2 border rounded-md" min="0" step="0.00000001"
                        required>
                </div>
                <div v-if="formData.crypto && cryptoStore.prices[formData.crypto]?.bid" class="text-sm text-gray-400">
                    <p>
                        Disponibles:
                        <span class="font-bold text-[#fc9db9]">
                            {{ cryptoStore.userCryptoBalance[formData.crypto] + ' ' + formData.crypto.toUpperCase() }}
                        </span>
                    </p>
                    <p>Precio actual: 1 {{ formData.crypto.toUpperCase() + " = " +
                        cryptoStore.prices[formData.crypto].bid.toLocaleString() + " ARS" }}</p>
                    <p>
                        Recibirás:
                        <span class="font-bold text-[#fc9db9]">
                            ${{ arsAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }) }} ARS
                        </span>
                    </p>
                </div>
                <p class="text-red-500 text-sm"
                    v-if="formData.crypto && cryptoStore.userCryptoBalance[formData.crypto] < formData.amount">
                    No contás con la cantidad de {{ formData.crypto }} suficiente para realizar la venta. Ingresá un
                    valor más bajo
                </p>
                <button type="submit"
                    class="w-full bg-[#fc9db9] text-white py-2 rounded-md hover:bg-[#f885a7] transition-colors disabled:opacity-50"
                    :disabled="!formData.crypto || formData.amount <= 0 || cryptoStore.userCryptoBalance[formData.crypto] < formData.amount || loading">
                    {{ loading ? "Procesando..." : "Confirmar Venta" }}
                </button>
            </form>
        </template>
    </BaseModal>
</template>