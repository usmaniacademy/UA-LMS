<template>
  <StickyHeader class-name="navbar-light navbar-sticky header-static">
    <nav class="navbar navbar-expand-xl">
      <b-container>
        <AppMenu :menu-items="menuItems" ul-class="mx-auto" nav-class="w-100">
          <template #collapseMenuFooter>
            <NavSearch />
          </template>
        </AppMenu>
        <ProfileDropdown className='ms-1 ms-lg-0' />
      </b-container>
    </nav>
  </StickyHeader>
</template>
<script setup lang="ts">
import StickyHeader from '@/components/StickyHeader.vue';
import ProfileDropdown from '@/components/ProfileDropdown.vue';
import NavSearch from '@/components/NavSearch.vue';
import AppMenu from '@/components/navbar/AppMenu/index.vue';

import { getAppMenuItems, type MenuItemType } from '@/helpers/menu';
const menuItems: MenuItemType[] = getAppMenuItems();
</script>