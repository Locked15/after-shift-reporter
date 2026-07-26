import { createRouter, createWebHistory } from 'vue-router'
import ReporterGeneratorView from './ui/views/ReporterGeneratorView.vue'

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'generator', component: ReporterGeneratorView },
    ],
})
