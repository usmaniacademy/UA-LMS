<template>
  <div>
    <div class="rte-wrapper border rounded-3 bg-white">
      <div ref="editorEl"></div>
    </div>
    <div v-if="uploading" class="small text-primary mt-2">
      <span class="spinner-border spinner-border-sm me-1" />Uploading image...
    </div>
    <div v-if="uploadError" class="small text-danger mt-2">{{ uploadError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Quill from 'quill'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  minHeight?: number
  // When provided, an image button is shown and uploads go through this fn
  // (returns the hosted URL). Without it, no image button is rendered.
  uploadFn?: (dataUrl: string, filename: string) => Promise<{ url: string }>
}>(), {
  placeholder: 'Write here...',
  minHeight: 220
})

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const editorEl = ref<HTMLElement | null>(null)
let quill: Quill | null = null
const uploading = ref(false)
const uploadError = ref('')

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function imageHandler() {
  if (!props.uploadFn) return
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file || !quill) return
    uploading.value = true
    uploadError.value = ''
    try {
      const dataUrl = await readAsDataUrl(file)
      const { url } = await props.uploadFn!(dataUrl, file.name)
      const range = quill.getSelection(true)
      quill.insertEmbed(range.index, 'image', url)
      quill.setSelection(range.index + 1, 0)
    } catch (e: any) {
      uploadError.value = e.message || 'Image upload failed'
    } finally {
      uploading.value = false
    }
  }
}

onMounted(() => {
  if (!editorEl.value) return

  const toolbar: any[] = [
    [{ header: [2, 3, 4, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['link']
  ]
  if (props.uploadFn) toolbar.push(['image'])
  toolbar.push(['clean'])

  quill = new Quill(editorEl.value, {
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
      toolbar: {
        container: toolbar,
        handlers: props.uploadFn ? { image: imageHandler } : {}
      }
    }
  })

  if (props.modelValue) {
    quill.clipboard.dangerouslyPasteHTML(props.modelValue)
  }

  quill.on('text-change', () => {
    if (!quill) return
    const html = quill.root.innerHTML
    // Quill represents "empty" as <p><br></p> — normalize to '' so validation works
    emit('update:modelValue', html === '<p><br></p>' ? '' : html)
  })
})

// External updates (e.g. loading an existing post/lesson after init)
watch(() => props.modelValue, (val) => {
  if (!quill) return
  const current = quill.root.innerHTML
  const normalizedCurrent = current === '<p><br></p>' ? '' : current
  if ((val || '') !== normalizedCurrent) {
    quill.clipboard.dangerouslyPasteHTML(val || '')
  }
})

onBeforeUnmount(() => { quill = null })
</script>

<style scoped>
.rte-wrapper :deep(.ql-container) {
  min-height: v-bind('minHeight + "px"');
  font-size: 1rem;
}
.rte-wrapper :deep(.ql-editor) {
  min-height: v-bind('minHeight + "px"');
}
</style>
