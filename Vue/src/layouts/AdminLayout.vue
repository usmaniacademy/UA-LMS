<template>
  <main>
    <nav class="navbar sidebar navbar-expand-xl navbar-dark bg-dark">
      <div class="d-flex align-items-center">
        <router-link class="navbar-brand" :to="{ name: 'demos.default' }">
          <img :src="uaLogo" alt="Usmani Academy" style="height:44px;max-width:100%;object-fit:contain">
        </router-link>
      </div>

      <OverlayScrollbarsComponent defer class="offcanvas offcanvas-start flex-row custom-scrollbar h-100"
        :class="offcanvas && 'show'" data-bs-backdrop="true" tabindex="-1" id="offcanvasSidebar">
        <div class="offcanvas-body sidebar-content d-flex flex-column bg-dark">
          <AdminMenu />
        </div>
      </OverlayScrollbarsComponent>
    </nav>
    <div class="page-content">
      <nav class="navbar top-bar navbar-light border-bottom py-0 py-xl-3">
        <b-container class="p-0" fluid>
          <div class="d-flex align-items-center w-100">
            <div class="d-flex align-items-center d-xl-none">
              <router-link class="navbar-brand" :to="{ name: 'demos.default' }">
                <img class="light-mode-item navbar-brand-item h-30px" :src="logoMobile" alt="">
                <img class="dark-mode-item navbar-brand-item h-30px" :src="logoMobilelight" alt="">
              </router-link>
            </div>

            <div class="navbar-expand-xl sidebar-offcanvas-menu">
              <button class="navbar-toggler me-auto" type="button" @click="offcanvas = !offcanvas">
                <BIconTextRight class="fa-fw h2 lh-0 mb-0 rtl-flip" data-bs-target="#offcanvasMenu" />
              </button>
            </div>

            <div class="navbar-expand-lg ms-auto ms-xl-0">
              <MobileNavbarToggler />
              <b-collapse class="navbar-collapse w-100" id="navbarCollapse">
                <div class="nav my-3 my-xl-0 flex-nowrap align-items-center">
                  <div class="nav-item w-100">
                    <b-form class="position-relative">
                      <b-form-input class="pe-5 bg-secondary bg-opacity-10 border-0" type="search"
                        placeholder="Search" />
                      <button
                        class="bg-transparent px-2 py-0 border-0 position-absolute top-50 end-0 translate-middle-y"
                        type="submit">
                        <font-awesome-icon :icon="faSearch" class="fs-6 text-primary" />
                      </button>
                    </b-form>
                  </div>
                </div>
              </b-collapse>
            </div>

            <div class="ms-xl-auto">
              <ul class="navbar-nav flex-row align-items-center">
                <DropDown custom-class="nav-item ms-2 ms-md-3">
                  <a class="btn btn-light btn-round mb-0 flex-centered" href="#" role="button" data-bs-toggle="dropdown"
                    aria-expanded="false" data-bs-auto-close="outside">
                    <BIconBell class="fa-fw" />
                  </a>
                  <div
                    class="dropdown-menu dropdown-animation dropdown-menu-end dropdown-menu-size-md p-0 shadow-lg border-0">
                    <b-card no-body class="bg-transparent">
                      <b-card-header
                        class="bg-transparent border-bottom py-4 d-flex justify-content-between align-items-center">
                        <h6 class="m-0">Notifications</h6>
                      </b-card-header>
                      <b-card-body class="p-0">
                        <div class="text-center text-muted py-5 px-3">
                          <BIconBell class="fs-3 d-block mx-auto mb-2 opacity-50" />
                          <p class="small mb-0">You're all caught up. No new notifications.</p>
                        </div>
                      </b-card-body>
                    </b-card>
                  </div>
                </DropDown>

                <ProfileDropdown className="nav-item ms-2 ms-md-3" />
              </ul>
            </div>
          </div>
        </b-container>
      </nav>
      <div class="page-content-wrapper border">
        <slot />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DropDown from '@/components/DropDown.vue';
import ProfileDropdown from '@/components/ProfileDropdown.vue';
import MobileNavbarToggler from '@/components/MobileNavbarToggler.vue';
import AdminMenu from '@/components/navbar/AdminMenu/index.vue';
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { BIconTextRight, BIconBell } from 'bootstrap-icons-vue';

import uaLogo from '@/assets/images/ua-logo-light.png.png';
import logoMobile from '@/assets/images/logo-mobile.svg';
import logoMobilelight from '@/assets/images/logo-mobile-light.svg';

const offcanvas = ref(false);

const resize = () => {
  if (window.innerWidth > 1200) {
    offcanvas.value = false;
  }
};

onMounted(() => {
  window.addEventListener("resize", () => {
    resize();
  });
});
</script>