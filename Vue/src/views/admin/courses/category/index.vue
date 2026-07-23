<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col cols="12" class="d-flex justify-content-between align-items-center">
        <h1 class="h3 mb-0">Course Categories</h1>
        <b-button variant="primary" size="sm" @click="showAddModal = true">
          <font-awesome-icon :icon="faPlus" class="me-1" /> Add Category
        </b-button>
      </b-col>
    </b-row>

    <b-card no-body class="bg-transparent border">
      <b-card-body>
        <div v-if="admin.loading || settings.loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        <div v-else class="table-responsive border-0 mb-0">
          <table class="table table-dark-gray align-middle mb-0">
            <thead>
              <tr>
                <th class="border-0 rounded-start">Category</th>
                <th class="border-0">Courses</th>
                <th class="border-0 rounded-end">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in categories" :key="cat.name">
                <td><span class="badge bg-primary bg-opacity-10 text-primary">{{ cat.name }}</span></td>
                <td>{{ cat.count }}</td>
                <td>
                  <b-button variant="primary-soft" size="sm" class="mb-0 btn-round me-1" v-b-tooltip.hover.top="'Edit'" @click="editCategory(cat.name)">
                    <BIconPencil />
                  </b-button>
                  <b-button variant="danger-soft" size="sm" class="mb-0 btn-round" v-b-tooltip.hover.top="'Remove'" @click="removeCategory(cat.name)">
                    <BIconTrash />
                  </b-button>
                </td>
              </tr>
              <tr v-if="!categories.length">
                <td colspan="3" class="text-center py-4">No categories found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-card-body>
    </b-card>

    <b-modal id="addCategoryModal" v-model="showAddModal" title="Add Category" @hidden="newCategory = ''"
      ok-title="Add Category" cancel-title="Cancel" @ok.prevent="submitAddCategory">
      <b-form @submit.prevent="submitAddCategory">
        <b-form-group label="Category Name">
          <b-form-input v-model="newCategory" required placeholder="e.g. Graphic Design" />
        </b-form-group>
      </b-form>
    </b-modal>

    <b-modal id="editCategoryModal" v-model="showEditModal" title="Edit Category" @hidden="editName = ''"
      ok-title="Save Changes" cancel-title="Cancel" @ok.prevent="submitEditCategory">
      <b-form @submit.prevent="submitEditCategory">
        <b-form-group label="Category Name">
          <b-form-input v-model="editName" required placeholder="e.g. Graphic Design" />
        </b-form-group>
      </b-form>
    </b-modal>
  </AdminLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useAdminStore } from '@/stores/admin';
import { useSettingsStore } from '@/stores/settings';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { BIconTrash, BIconPencil } from 'bootstrap-icons-vue';

const admin = useAdminStore();
const settings = useSettingsStore();

const showAddModal = ref(false);
const showEditModal = ref(false);
const newCategory = ref('');
const editName = ref('');
const originalCategory = ref('');
const saving = ref(false);

const DEFAULT_CATEGORIES = ['Islamic Studies', 'Astronomy', 'Technology'];

const categories = computed(() => {
  const counts: Record<string, number> = {};
  for (const c of admin.courses) {
    const key = c.category || 'Uncategorized';
    counts[key] = (counts[key] || 0) + 1;
  }
  
  let names = settings.config.courseCategories;
  if (!Array.isArray(names)) {
    names = DEFAULT_CATEGORIES;
  }
  
  // Also include any categories that have courses even if deleted
  const allNames = Array.from(new Set([...names, ...Object.keys(counts)]));
  
  return allNames.map((name) => ({ name, count: counts[name] || 0 }));
});

onMounted(async () => { 
  if (!admin.courses.length) admin.fetchCourses({ limit: 100 } as any);
  if (!settings.config.courseCategories) await settings.fetchSettings();
});

async function submitAddCategory() {
  if (!newCategory.value.trim()) return;
  saving.value = true;
  try {
    let current = settings.config.courseCategories;
    if (!Array.isArray(current)) current = DEFAULT_CATEGORIES;
    const updated = [...new Set([...current, newCategory.value.trim()])];
    await settings.updateSetting('courseCategories', updated);
    showAddModal.value = false;
  } catch (e: any) {
    alert(e.message || 'Failed to save');
  } finally {
    saving.value = false;
  }
}

function editCategory(name: string) {
  originalCategory.value = name;
  editName.value = name;
  showEditModal.value = true;
}

async function submitEditCategory() {
  if (!editName.value.trim()) return;
  saving.value = true;
  try {
    await admin.renameCategory(originalCategory.value, editName.value.trim())
    await settings.fetchSettings()
    await admin.fetchCourses({ limit: 100 } as any)
    showEditModal.value = false;
  } catch (e: any) {
    alert(e.message || 'Failed to save');
  } finally {
    saving.value = false;
  }
}

async function removeCategory(name: string) {
  if (!confirm(`Are you sure you want to remove "${name}"? Courses in this category will keep the category name, but it won't appear in the dropdowns.`)) return;
  try {
    let current = settings.config.courseCategories;
    if (!Array.isArray(current)) current = DEFAULT_CATEGORIES;
    const updated = current.filter((c: string) => c !== name);
    await settings.updateSetting('courseCategories', updated);
  } catch (e: any) {
    alert(e.message || 'Failed to remove');
  }
}
</script>
