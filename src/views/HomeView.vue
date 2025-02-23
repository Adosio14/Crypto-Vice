<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PurchaseModal from '../components/PurchaseModal.vue';
import SellModal from '../components/SellModal.vue';
import { useCryptoStore } from '../stores/crypto.store';
import router from '../router';


const showCompra = ref(false)
const showVenta = ref(false)
const loading = ref(true)
const cryptoStore = useCryptoStore();

const handleTransactionsTap = () => {
    router.push("/transactions")
}
onMounted(async () => {
    try {
        await cryptoStore.fetchCryptoPrices()
    } catch (error) {
        console.error('Error fetching crypto prices:', error)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="mx-auto max-w-2xl bg-white rounded-xl shadow-md overflow-hidden p-12">
        <img src="../assets/full_logo_no_buffer.png" alt="Logo" class="mx-auto mb-6 h-48 w-auto" />
        <div class="p-6 space-y-6">
            <div @click="handleTransactionsTap"
                class="bg-[#b3e5fb67] p-6 rounded-lg shadow-sm hover:shadow-md text-start">
                <h2 class="text-xl font-bold text-[#83d9fd] mb-4">Historial de movimientos</h2>
                <p class="text-gray-600">Revisa tus ultimos movimientos, rendimientos y más</p>
            </div>

            <div class="flex flex-col md:flex-row gap-6 text-start">
                <!-- Card Compra -->
                <div class="flex-1 bg-[#b3fbe383] p-6 rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer"
                    @click="showCompra = true">
                    <h3 class="font-bold text-[#42f5b9] text-lg mb-3">Compra</h3>
                    <p class="text-sm text-gray-500">Selecciona una criptomoneda y avanza con tu inversión!</p>
                </div>

                <!-- Card Venta -->
                <div class="flex-1 bg-[#dcb9d05e] p-6 rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer"
                    @click="showVenta = true">
                    <h3 class="font-bold text-[#dcb9d0] text-lg mb-3">Venta</h3>
                    <p class="text-sm text-gray-500">Aprovecha momentos clave del mercado para capitalizar tus
                        inversiones</p>
                </div>
            </div>
        </div>
    </div>
    <PurchaseModal v-model:show="showCompra" />
    <SellModal v-model:show="showVenta" />
</template>