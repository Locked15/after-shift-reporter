export interface Patient {
    name: string
    birthdate: string
    complaint: string
    metrics: string
    notes: string
    appliedHelp: string
}

export interface ReporterConfig {
    hospitalName: string
    doctorName: string
    fileName: string
    shiftBeginning: { dayOffset: number; time: string }
    shiftEnding: { dayOffset: number; time: string }
    patients: Patient[]
}
