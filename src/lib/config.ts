import { parse } from 'yaml'
import type { Patient, ReporterConfig } from '@/types'

const blankPatient = (): Patient => ({
    name: '',
    birthdate: '',
    complaint: '',
    metrics: '',
    notes: '',
    appliedHelp: '',
})

export const fallbackConfig: ReporterConfig = {
    hospitalName: 'ГБУЗ РБ ГКБ №5 г. Уфа',
    doctorName: '',
    fileName: 'Дежурство',
    shiftBeginning: { dayOffset: -1, time: '18:00' },
    shiftEnding: { dayOffset: 0, time: '08:00' },
    patients: [blankPatient()],
}

const isTime = (value: unknown): value is string =>
    typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)

function normalizePatient(value: unknown): Patient {
    const patient = (
        value && typeof value === 'object' ? value : {}
    ) as Partial<Patient>
    return {
        name: patient.name ?? '',
        birthdate: patient.birthdate ?? '',
        complaint: patient.complaint ?? '',
        metrics: patient.metrics ?? '',
        notes: patient.notes ?? '',
        appliedHelp: patient.appliedHelp ?? '',
    }
}

function normalizeConfig(value: unknown): ReporterConfig | null {
    if (!value || typeof value !== 'object') return null
    const raw = value as Partial<ReporterConfig>
    if (
        typeof raw.hospitalName !== 'string' ||
        typeof raw.doctorName !== 'string' ||
        typeof raw.fileName !== 'string'
    )
        return null
    if (
        !raw.shiftBeginning ||
        !raw.shiftEnding ||
        !isTime(raw.shiftBeginning.time) ||
        !isTime(raw.shiftEnding.time)
    )
        return null
    if (
        !Number.isInteger(raw.shiftBeginning.dayOffset) ||
        !Number.isInteger(raw.shiftEnding.dayOffset)
    )
        return null
    return {
        hospitalName: raw.hospitalName,
        doctorName: raw.doctorName,
        fileName: raw.fileName,
        shiftBeginning: raw.shiftBeginning,
        shiftEnding: raw.shiftEnding,
        patients: Array.isArray(raw.patients)
            ? raw.patients.map(normalizePatient)
            : [blankPatient()],
    }
}

export async function loadConfig(): Promise<{
    config: ReporterConfig
    warning: string
}> {
    try {
        const response = await fetch('/config.yml', { cache: 'no-store' })
        if (!response.ok) throw new Error('Config unavailable')
        const config = normalizeConfig(parse(await response.text()))
        if (!config) throw new Error('Config malformed')
        return { config, warning: '' }
    } catch {
        return {
            config: fallbackConfig,
            warning:
                'Не удалось прочитать config.yml. Используются встроенные значения.',
        }
    }
}

export { blankPatient }
