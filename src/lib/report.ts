import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import templateUrl from '@/assets/example.docx?url'
import type { Patient } from '@/types'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})
const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
})

export function toLocalDateTime(date: Date): string {
    const offset = date.getTimezoneOffset() * 60_000
    return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function fromLocalDateTime(value: string): Date {
    return new Date(value)
}

export function formatBirthdate(value: string): string {
    if (!value) return ''
    const [year, month, day] = value.split('-').map(Number)
    return dateFormatter.format(new Date(year, month - 1, day))
}

function patientBlock(patients: Patient[]): string {
    return patients
        .filter((patient) =>
            Object.values(patient).some((value) => value.trim()),
        )
        .map((patient, index) => {
            const lines = [
                `${index + 1}) ${patient.name}${patient.birthdate ? ` ${formatBirthdate(patient.birthdate)}` : ''}.`,
            ]
            if (patient.complaint.trim())
                lines.push(`Жалобы: ${patient.complaint.trim()}.`)
            if (patient.metrics.trim())
                lines.push(`Показатели: ${patient.metrics.trim()}.`)
            if (patient.notes.trim())
                lines.push(`Дополнительно: ${patient.notes.trim()}.`)
            if (patient.appliedHelp.trim())
                lines.push(`Оказанная помощь: ${patient.appliedHelp.trim()}.`)
            return lines.join('\n')
        })
        .join('\n\n')
}

export async function generateReport(data: {
    hospitalName: string
    doctorName: string
    fileName: string
    beginning: string
    ending: string
    patients: Patient[]
}): Promise<void> {
    const [template, beginning, ending] = await Promise.all([
        fetch(templateUrl).then(async (response) => {
            if (!response.ok) throw new Error('Шаблон документа недоступен')
            return response.arrayBuffer()
        }),
        Promise.resolve(fromLocalDateTime(data.beginning)),
        Promise.resolve(fromLocalDateTime(data.ending)),
    ])
    const doc = new Docxtemplater(new PizZip(template), {
        paragraphLoop: true,
        linebreaks: true,
    })
    doc.render({
        0: data.hospitalName.trim(),
        1: dateFormatter.format(beginning),
        2: dateFormatter.format(ending),
        3: timeFormatter.format(beginning),
        4: timeFormatter.format(ending),
        5: data.doctorName.trim(),
        6: patientBlock(data.patients),
    })
    const blob = doc.toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${data.fileName.trim() || 'Дежурство'}.docx`
    link.click()
    URL.revokeObjectURL(url)
}
