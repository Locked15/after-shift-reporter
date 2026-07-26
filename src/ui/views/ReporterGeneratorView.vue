<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppHeader from '@/ui/components/AppHeader.vue'
import DateTimeField from '@/ui/components/DateTimeField.vue'
import HelpModal from '@/ui/components/HelpModal.vue'
import PatientCard from '@/ui/components/PatientCard.vue'
import { blankPatient, loadConfig } from '@/lib/config'
import { generateReport, toLocalDateTime } from '@/lib/report'
import type { Patient } from '@/types'

const hospitalName = ref('')
const doctorName = ref('')
const fileName = ref('')
const beginning = ref('')
const ending = ref('')
const patients = ref<Patient[]>([])
const configWarning = ref('')
const error = ref('')
const isGenerating = ref(false)
const helpOpen = ref(false)

const canGenerate = computed(() =>
    Boolean(
        hospitalName.value.trim() &&
        doctorName.value.trim() &&
        beginning.value &&
        ending.value,
    ),
)

function configuredDate(dayOffset: number, time: string) {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + dayOffset)
    const [hours, minutes] = time.split(':').map(Number)
    date.setHours(hours, minutes)
    return toLocalDateTime(date)
}

function addPatient() {
    patients.value.push(blankPatient())
}
function removePatient(index: number) {
    patients.value.splice(index, 1)
}

async function submit() {
    error.value = ''
    if (!canGenerate.value) {
        error.value = 'Заполните больницу, начало и конец смены, имя врача.'
        return
    }
    if (new Date(ending.value) < new Date(beginning.value)) {
        error.value = 'Конец смены не может быть раньше начала.'
        return
    }
    isGenerating.value = true
    try {
        await generateReport({
            hospitalName: hospitalName.value,
            doctorName: doctorName.value,
            fileName: fileName.value,
            beginning: beginning.value,
            ending: ending.value,
            patients: patients.value,
        })
    } catch (cause) {
        error.value =
            cause instanceof Error
                ? cause.message
                : 'Не удалось создать документ.'
    } finally {
        isGenerating.value = false
    }
}

onMounted(async () => {
    const loaded = await loadConfig()
    hospitalName.value = loaded.config.hospitalName
    doctorName.value = loaded.config.doctorName
    fileName.value = loaded.config.fileName
    beginning.value = configuredDate(
        loaded.config.shiftBeginning.dayOffset,
        loaded.config.shiftBeginning.time,
    )
    ending.value = configuredDate(
        loaded.config.shiftEnding.dayOffset,
        loaded.config.shiftEnding.time,
    )
    patients.value = loaded.config.patients.length
        ? loaded.config.patients
        : [blankPatient()]
    configWarning.value = loaded.warning
})
</script>

<template>
    <main class="generator-view">
        <AppHeader @help="helpOpen = true" />
        <p v-if="configWarning" class="notice notice--warning">
            {{ configWarning }}
        </p>
        <form class="report-form" @submit.prevent="submit">
            <section class="form-section">
                <h2>Данные смены</h2>
                <label
                    >Имя больницы<input
                        v-model="hospitalName"
                        type="text"
                        required
                /></label>
                <div class="date-fields">
                    <DateTimeField
                        id="beginning"
                        v-model="beginning"
                        label="Начало смены"
                    /><DateTimeField
                        id="ending"
                        v-model="ending"
                        label="Конец смены"
                    />
                </div>
                <label
                    >Имя врача<input v-model="doctorName" type="text" required
                /></label>
            </section>
            <section class="form-section">
                <div class="section-heading">
                    <h2>Список пациентов</h2>
                    <button
                        class="secondary-button"
                        type="button"
                        @click="addPatient"
                    >
                        Добавить пациента
                    </button>
                </div>
                <div class="patient-list">
                    <PatientCard
                        v-for="(_, index) in patients"
                        :key="index"
                        v-model="patients[index]"
                        :index="index"
                        @remove="removePatient(index)"
                    />
                </div>
            </section>
            <section class="form-section">
                <h2>Параметры генерации</h2>
                <label
                    >Имя файла<input v-model="fileName" type="text" />
                </label>
            </section>
            <p v-if="error" class="notice notice--error" role="alert">
                {{ error }}
            </p>
            <button
                class="generate-button"
                type="submit"
                :disabled="isGenerating"
            >
                {{ isGenerating ? 'Создаём документ…' : 'Сгенерировать' }}
            </button>
        </form>
        <HelpModal v-if="helpOpen" @close="helpOpen = false" />
    </main>
</template>

<style lang="scss" src="@/styles/views/reporter-generator.scss"></style>
