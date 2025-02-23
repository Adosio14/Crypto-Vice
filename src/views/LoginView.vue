<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/user.store';
import { useCryptoStore } from '../stores/crypto.store';
import router from '../router';

const username = ref<string>('');


const userStore = useUserStore();
const cryptoStore = useCryptoStore();
const handleSubmit = async () => {
    await cryptoStore.fetchCryptoPrices();
    userStore.setUser(username.value);
    router.push('/home');
};
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <img src="../assets/full_logo.png" alt="Logo" class="mx-auto mb-6" />
        <div class="bg-[#b3fbe3] rounded-lg shadow-md p-6">
            <div class="w-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center h-full gap-y-8">
                <!-- Textos encima del formulario -->
                <div class="text-center">
                    <p class="font-stretch-extra-condensed font-bold text-3xl text-[#fab4c9]">Bienvenido a Crypto Vice
                    </p>
                    <p class="font-stretch-condensed font-medium text-2xl text-[#fab4c9] mt-2">Inicia sesión para
                        continuar</p>
                </div>

                <!-- Formulario -->
                <form @submit.prevent="handleSubmit" class="space-y-4 w-full max-w-md">
                    <div>
                        <input type="text" id="username" name="username" v-model="username"
                            class="mt-1 block w-full px-3 bg-white py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffc9d9] focus:border-[#ffc9d9]"
                            placeholder="Nombre de usuario" />
                    </div>
                    <div>
                        <button type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#ffc9d9] hover:bg-[#fab4c9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc9d9]">
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>