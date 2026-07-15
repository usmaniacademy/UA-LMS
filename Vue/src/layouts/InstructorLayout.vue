<template>
  <TopBar8 />
  <main>
    <section class="pt-0">
      <b-container fluid class="px-0">
        <div class="h-100px h-md-200px rounded-0"
          style="background: radial-gradient(circle at 25% 15%, rgba(255,255,255,0.14), transparent 55%), linear-gradient(135deg, var(--bs-primary), var(--bs-dark));">
        </div>
      </b-container>
      <b-container class="mt-n4">
        <b-row>
          <b-col cols="12">
            <b-card no-body class="bg-transparent card-body p-0">
              <b-row class="d-flex justify-content-between">
                <div class="col-auto mt-4 mt-md-0">
                  <div class="avatar avatar-xxl mt-n3">
                    <img v-if="avatarUrl" class="avatar-img rounded-circle border border-white border-3 shadow" :src="avatarUrl" alt="">
                    <span v-else
                      class="avatar-img rounded-circle border border-white border-3 shadow bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-3">
                      {{ initials }}
                    </span>
                  </div>
                </div>
                <div class="col d-md-flex justify-content-between align-items-center mt-4">
                  <div>
                    <h1 class="my-1 fs-4 d-flex align-items-center">
                      {{ fullName }}
                      <BIconPatchCheckFill class="text-info small ms-2" />
                    </h1>
                    <ul class="list-inline mb-0">
                      <li class="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
                        <font-awesome-icon :icon="faUserGraduate" class="text-orange me-1" />
                        {{ stats?.totalStudents ?? 0 }} Enrolled Students
                      </li>{{ ' ' }}
                      <li class="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
                        <font-awesome-icon :icon="faBook" class="text-purple me-1" />
                        {{ stats?.totalCourses ?? 0 }} Courses
                      </li>
                    </ul>
                  </div>
                  <div class="d-flex align-items-center mt-2 mt-md-0">
                    <router-link to="#" class="btn btn-sm btn-primary mb-0" data-bs-toggle="modal" data-bs-target="#addQuiz" v-if="isQuizButton" @click="toggleModal">Add New Quiz</router-link>
                    <router-link :to="{name: 'instructor.create.course'}" class="btn btn-success mb-0" v-else>Create a course</router-link>
                  </div>
                </div>
              </b-row>
            </b-card>

            <hr class="d-xl-none">
            <b-col cols="12" xl="3" class="d-flex justify-content-between align-items-center">
              <a class="h6 mb-0 fw-bold d-xl-none" href="#">Menu</a>
              <b-button variant="primary" class="d-xl-none" type="button" @click="offcanvas = !offcanvas">
                <font-awesome-icon :icon="faSlidersH" />
              </b-button>
            </b-col>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section class="pt-0">
      <b-container>
        <b-row>
          <b-col xl="3">
            <div class="offcanvas-xl offcanvas-end" tabindex="-1" id="offcanvasSidebar">
              <div class="offcanvas-header bg-light">
                <h5 class="offcanvas-title" id="offcanvasNavbarLabel">My profile</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasSidebar"
                  aria-label="Close"></button>
              </div>
              <div class="offcanvas-body p-3 p-xl-0">
                <div class="bg-dark border rounded-3 pb-0 p-3 w-100">
                  <div class="list-group list-group-dark list-group-borderless">
                    <template v-for="(item, idx) in getMenuItems() || []" :key="idx">
                      <a v-if="item.route.name === 'auth.sign-in'" href="#"
                        class="list-group-item icons-center text-danger bg-danger-soft-hover" @click.prevent="logout">
                        <component :is="item.icon" class="fa-fw me-2" />
                        {{ item.title }}
                      </a>
                      <router-link v-else class="list-group-item icons-center"
                        :class="{ active: item.route.name === currentRouteName }"
                        :to="{ name: item.route.name }">
                        <component :is="item.icon" class="fa-fw me-2" />
                        {{ item.title }}
                      </router-link>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <b-offcanvas v-model="offcanvas" placement="end" title="My profile" headerClass="bg-light"
              bodyClass="p-3 p-xl-0" class="offcanvas-xl" id="offcanvasSidebar">
              <div class="bg-dark border rounded-3 pb-0 p-3 w-100">
                <div class="list-group list-group-dark list-group-borderless">
                  <template v-for="(item, idx) in getMenuItems()" :key="idx">
                    <a v-if="item.route.name === 'auth.sign-in'" href="#"
                      class="list-group-item text-danger bg-danger-soft-hover" @click.prevent="logout">
                      <component :is="item.icon" class="fa-fw me-2" />
                      {{ item.title }}
                    </a>
                    <router-link v-else class="list-group-item"
                      :class="{ active: item.route.name === currentRouteName }"
                      :to="{ name: item.route.name }">
                      <component :is="item.icon" class="fa-fw me-2" />
                      {{ item.title }}
                    </router-link>
                  </template>
                </div>
              </div>
            </b-offcanvas>
          </b-col>
          <slot />

        </b-row>
      </b-container>
    </section>
  </main>
  <div class="account-footer-bg">
    <Footer1 />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import router from '@/router';

import { INSTRUCTOR_MENU_ITEMS } from '@/assets/data/menu-items';
import { useAuthStore } from '@/stores/auth';
import { useCourseStore } from '@/stores/course';

import TopBar8 from '@/layouts/components/TopBar8.vue';
import Footer1 from '@/views/demos/default/components/Footer1.vue';

import { faUserGraduate, faBook, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { BIconPatchCheckFill } from 'bootstrap-icons-vue';

type LayoutPropType = {
  isQuizButton?: boolean;
  toggleModal? : any
};


defineProps<LayoutPropType>();

const auth = useAuthStore();
const courseStore = useCourseStore();
const logout = () => auth.logout();

const user = computed(() => auth.getUser());
const fullName = computed(() => {
  const u = user.value;
  if (!u) return 'Instructor';
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;
});
const initials = computed(() => {
  const u = user.value;
  if (!u) return 'U';
  return [(u.firstName || '')[0], (u.lastName || '')[0]].filter(Boolean).join('').toUpperCase() || u.email[0].toUpperCase();
});
const avatarUrl = computed(() => user.value?.avatarUrl || '');
const stats = computed(() => courseStore.instructorStats);

const currentRouteName = router.currentRoute.value.name;

const offcanvas = ref(false);

onMounted(() => {
  if (!courseStore.instructorStats) courseStore.fetchInstructorStats();
});

const getMenuItems = () => {
  // NOTE - You can fetch from server and return here as well
  return INSTRUCTOR_MENU_ITEMS;
};
</script>
<style scoped>
/* Give the shared site footer the same frosted Islamic-pattern backdrop it has
   on the public pages, so it matches the rest of the site. */
.account-footer-bg {
  background-color: #fff;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.82)),
    url('../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
}
</style>