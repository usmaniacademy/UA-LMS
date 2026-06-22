<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col cols="12" class="d-sm-flex justify-content-between align-items-center">
        <h1 class="h3 mb-2 mb-sm-0">Courses</h1>
        <b-button variant="primary" size="sm" class="mb-0" @click="openCreate">
          + Create a Course
        </b-button>
      </b-col>
    </b-row>
    <Widgets />
    <TableList ref="tableRef" />

    <!-- Create course modal -->
    <b-modal v-model="createModal" title="Create a Course" @ok="submitCreate" ok-title="Create Course"
      :ok-disabled="saving" size="lg">
      <div v-if="formError" class="alert alert-danger py-2 mb-3">{{ formError }}</div>
      <b-form class="d-flex flex-column gap-3">
        <b-form-group label="Course title *">
          <b-form-input v-model="form.title" placeholder="e.g. Introduction to Islamic Finance" />
        </b-form-group>

        <b-form-group label="Assign to instructor *">
          <b-form-select v-model="form.instructorId">
            <option value="">— Select instructor —</option>
            <option v-for="i in admin.instructors" :key="i.id" :value="i.id">
              {{ i.firstName }} {{ i.lastName }} ({{ i.email }})
            </option>
          </b-form-select>
        </b-form-group>

        <b-row class="g-3">
          <b-col md="6">
            <b-form-group label="Category *">
              <b-form-select v-model="form.category">
                <option value="">Select category</option>
                <option>Islamic Studies</option>
                <option>Astronomy</option>
                <option>Technology</option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Level">
              <b-form-select v-model="form.level">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group label="Short description">
          <b-form-textarea v-model="form.description" rows="2" placeholder="Brief overview of the course" />
        </b-form-group>

        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="adminFree" v-model="form.isFree">
          <label class="form-check-label" for="adminFree">Free course (no subscription)</label>
        </div>

        <p class="text-muted small mb-0">
          The course is created as a draft. The assigned instructor (or you) can then add the curriculum and Zoom classes,
          and publish it.
        </p>
      </b-form>
    </b-modal>
  </AdminLayout>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Widgets from '@/views/admin/courses/list/components/Widgets.vue';
import TableList from '@/views/admin/courses/list/components/TableList.vue';
import { useAdminStore } from '@/stores/admin';

const admin = useAdminStore();
const tableRef = ref<InstanceType<typeof TableList> | null>(null);

const createModal = ref(false);
const saving = ref(false);
const formError = ref('');

const form = reactive({
  title: '',
  instructorId: '',
  category: '',
  level: 'beginner',
  description: '',
  isFree: false
});

function openCreate() {
  formError.value = '';
  Object.assign(form, { title: '', instructorId: '', category: '', level: 'beginner', description: '', isFree: false });
  admin.fetchInstructors();
  createModal.value = true;
}

async function submitCreate(evt: Event) {
  evt.preventDefault();
  formError.value = '';
  if (!form.title.trim()) { formError.value = 'Please enter a course title.'; return; }
  if (!form.instructorId) { formError.value = 'Please assign the course to an instructor.'; return; }
  if (!form.category) { formError.value = 'Please select a category.'; return; }

  saving.value = true;
  try {
    await admin.createCourse({
      title: form.title,
      instructorId: form.instructorId,
      category: form.category,
      level: form.level,
      description: form.description || undefined,
      isFree: form.isFree
    });
    createModal.value = false;
    tableRef.value?.load();
    admin.fetchStats();
  } catch (e: any) {
    formError.value = e.message || 'Failed to create course';
  } finally {
    saving.value = false;
  }
}
</script>
