<script setup lang="ts">
defineProps<{
    show: boolean
    title?: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()
</script>

<template>
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            @click.self="emit('close')">
            <div class="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
                <div class="flex justify-between items-center">
                    <slot name="header">
                        <h3 v-if="title" class="text-2xl font-bold">{{ title }}</h3>
                    </slot>
                    <button @click="emit('close')" class="text-gray-500 hover:text-gray-700 transition-colors text-2xl">
                        &times;
                    </button>
                </div>
                <div class="space-y-4">
                    <slot name="body"></slot>
                </div>
                <div v-if="$slots.footer" class="pt-4">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>