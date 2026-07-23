import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/helpers/api'

export const useSettingsStore = defineStore('settings', () => {
  const config = ref<Record<string, any>>({})
  const loading = ref(false)

  async function fetchSettings() {
    loading.value = true
    try {
      config.value = await api.get('/settings')
    } catch (e) {
      console.error('Failed to load settings', e)
    } finally {
      loading.value = false
    }
  }

  async function updateSetting(key: string, value: any) {
    try {
      await api.patch('/settings', { key, value })
      config.value[key] = value
    } catch (e) {
      console.error('Failed to update setting', e)
      throw e
    }
  }

  return { config, loading, fetchSettings, updateSetting }
})
