<script setup lang="ts">
import type { Patient } from '@/types'

defineProps<{ index: number }>()
const patient = defineModel<Patient>({ required: true })
defineEmits<{ remove: [] }>()
</script>

<template>
    <article class="patient-card">
        <div class="patient-card__heading">
            <h3>Пациент {{ index + 1 }}</h3>
            <button
                class="icon-button"
                type="button"
                aria-label="Удалить пациента"
                title="Удалить пациента"
                @click="$emit('remove')"
            >
                🗑
            </button>
        </div>
        <label>Имя пациента<input v-model="patient.name" type="text" /></label>
        <label
            >Дата рождения пациента<input
                v-model="patient.birthdate"
                type="date"
        /></label>
        <label
            >Жалобы пациента<textarea v-model="patient.complaint" rows="3" />
        </label>
        <label
            >Показатели пациента<textarea v-model="patient.metrics" rows="3" />
        </label>
        <label
            >Дополнительная информация<textarea
                v-model="patient.notes"
                rows="3"
            />
        </label>
        <label
            >Оказанная помощь<textarea v-model="patient.appliedHelp" rows="3" />
        </label>
    </article>
</template>

<style lang="scss" src="@/styles/components/patient-card.scss"></style>
