<script setup lang="ts">
defineEmits<{ close: [] }>()
</script>

<template>
    <div
        class="modal-backdrop"
        role="presentation"
        @click.self="$emit('close')"
    >
        <section
            class="help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
        >
            <button
                class="icon-button help-modal__close"
                type="button"
                aria-label="Закрыть помощь"
                @click="$emit('close')"
            >
                ×
            </button>
            <p class="app-header__eyebrow">Подсказка</p>
            <h2 id="help-title">Как создать отчёт</h2>
            <ol>
                <li>Проверьте больницу, смену и имя врача.</li>
                <li>
                    Заполните карточки пациентов; пустые строки не попадут в
                    отчёт.
                </li>
                <li>Нажмите «Сгенерировать» — DOCX скачается автоматически.</li>
            </ol>
            <p>
                Значения по умолчанию редактируются в
                <code>config/config.yml</code>. В Docker подключите файл томом.
            </p>
        </section>
    </div>
</template>

<style lang="scss" src="@/styles/components/help-modal.scss"></style>
