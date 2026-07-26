<script setup lang="ts">
    defineProps<{ id: string; label: string }>()
    const model = defineModel<string>({ required: true })
</script>

<template>
    <label class="datetime-field" :for="id">
        <span>{{ label }}</span>
        <input :id="id" v-model="model" type="datetime-local" required />
    </label>
</template>

<style lang="scss" src="@/styles/components/date-time-field.scss"></style>
