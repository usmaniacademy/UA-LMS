<template>
  <AdminLayout>
    <b-row>
      <b-col cols="12" class="mb-3">
        <h1 class="h3 mb-2 mb-sm-0">Settings</h1>
      </b-col>
    </b-row>

    <b-card no-body class="shadow">
      <b-card-body>
        <b-tabs pills nav-class="nav-pills-bg-soft px-3" content-class="pt-4" nav-item-class="mb-0">
          <b-tab title="Profile" class="fade" title-item-class="me-2 me-sm-4">
            <EditProfileForm />
          </b-tab>
          <b-tab title="Account" class="fade" title-item-class="me-2 me-sm-4">
            <AccountSettings />
          </b-tab>
          <b-tab title="General" class="fade" title-item-class="me-2 me-sm-4">
            <GeneralSettings />
          </b-tab>
          <b-tab title="Email" class="fade" title-item-class="me-2 me-sm-4">
            <EmailSettings />
          </b-tab>
          <b-tab title="Website" class="fade" title-item-class="me-2 me-sm-4">
            <WebsiteSettings />
          </b-tab>
          <b-tab title="Notifications" class="fade" title-item-class="me-2 me-sm-4">
            <NotificationSettings />
          </b-tab>
        </b-tabs>
      </b-card-body>
    </b-card>
  </AdminLayout>
</template>
<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue'
import EditProfileForm from '@/components/EditProfileForm.vue'
import AccountSettings from './components/Account.vue'
import GeneralSettings from './components/General.vue'
import EmailSettings from './components/Email.vue'
import WebsiteSettings from './components/Website.vue'
import NotificationSettings from './components/Notifications.vue'
</script>
