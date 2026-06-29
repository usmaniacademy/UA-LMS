<template>
  <AdminLayout>
    <b-row>
      <b-col cols="12" class="mb-3">
        <h1 class="h3 mb-2 mb-sm-0">Account Settings</h1>
      </b-col>
    </b-row>

    <b-row>
      <b-col xl="8">
        <EditProfileForm />
      </b-col>
    </b-row>
  </AdminLayout>
</template>
<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue'
import EditProfileForm from '@/components/EditProfileForm.vue'
</script>
