<script setup lang="ts">
    defineEmits<{ help: [] }>()
</script>

<template>
    <header class="app-header">
        <div>
            <p class="app-header__eyebrow">Смена закрыта</p>
            <h1>Генератор отчётности</h1>
        </div>
        <button class="help-button" type="button" @click="$emit('help')">
            Нужна помощь?
        </button>
    </header>
</template>

<style lang="scss" src="@/styles/components/app-header.scss"></style>
