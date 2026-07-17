import { ref, computed } from 'vue'

// Lightweight client-side wishlist (persisted in localStorage). Shared across
// every component via the module-scoped `ids` ref, so hearts stay in sync.
const KEY = 'UA_WISHLIST'

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const ids = ref<string[]>(load())

function persist() {
  localStorage.setItem(KEY, JSON.stringify(ids.value))
}

export function useWishlist() {
  const isSaved = (id: string) => ids.value.includes(id)

  function toggle(id: string) {
    const i = ids.value.indexOf(id)
    if (i === -1) ids.value.push(id)
    else ids.value.splice(i, 1)
    persist()
  }

  const count = computed(() => ids.value.length)

  return { ids, isSaved, toggle, count }
}
