<template>
	<TopBar8 />
	<main>
		<section class="pt-0">
			<b-container fluid class="px-0">
				<b-card no-body class="bg-blue h-100px h-md-200px rounded-0"
					:style="`background:url(${pattern04}) no-repeat center center; background-size:cover;`">
				</b-card>
			</b-container>
			<b-container class="mt-n4">
				<b-row>
					<b-col cols="12">
						<b-card no-body class="bg-transparent card-body pb-0 px-0 mt-2 mt-sm-0">
							<b-row class="d-sm-flex justify-sm-content-between mt-2 mt-md-0">
								<div class="col-auto">
									<div class="avatar avatar-xxl position-relative mt-n3">
										<img v-if="avatarUrl" class="avatar-img rounded-circle border border-white border-3 shadow" :src="avatarUrl" alt="">
										<span v-else
											class="avatar-img rounded-circle border border-white border-3 shadow bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-3">
											{{ initials }}
										</span>
									</div>
								</div>
								<div class="col d-sm-flex justify-content-between align-items-center">
									<div>
										<h1 class="my-1 fs-4">{{ fullName }}</h1>
										<ul class="list-inline mb-0">
											<li class="list-inline-item me-3 mb-1 mb-sm-0">
												<span class="h6">{{ store.enrolledCourses.length }}</span>
												<span class="text-body fw-light"> Enrolled courses</span>
											</li>
										</ul>
									</div>
									<div class="mt-2 mt-sm-0">
										<router-link :to="{ name: 'student.course' }" class="btn btn-outline-primary mb-0">View my
											courses</router-link>
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
								<div class="bg-dark border rounded-3 p-3 w-100">
									<div class="list-group list-group-dark list-group-borderless collapse-list">
										<template v-for="(item, idx) in getMenuItems() || []" :key="idx">
											<router-link class="list-group-item icons-center"
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
							<div class="bg-dark border rounded-3 p-3 w-100">
								<div class="list-group list-group-dark list-group-borderless collapse-list">
									<template v-for="(item, idx) in getMenuItems()" :key="idx">
										<router-link class="list-group-item"
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
	<Footer7 />
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import router from '@/router';

import { STUDENT_MENU_ITEMS } from '@/assets/data/menu-items';
import { useAuthStore } from '@/stores/auth';
import { useCourseStore } from '@/stores/course';

import TopBar8 from '@/layouts/components/TopBar8.vue';
import Footer7 from '@/layouts/components/Footer7.vue';

import pattern04 from '@/assets/images/pattern/04.png';

import { faSlidersH } from '@fortawesome/free-solid-svg-icons';

const auth = useAuthStore();
const store = useCourseStore();

const user = computed(() => auth.getUser());
const fullName = computed(() => {
	const u = user.value;
	if (!u) return 'Student';
	return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;
});
const initials = computed(() => {
	const u = user.value;
	if (!u) return 'U';
	return [(u.firstName || '')[0], (u.lastName || '')[0]].filter(Boolean).join('').toUpperCase() || u.email[0].toUpperCase();
});
const avatarUrl = computed(() => user.value?.avatarUrl || '');

const currentRouteName = router.currentRoute.value.name;

const offcanvas = ref(false);

const getMenuItems = () => STUDENT_MENU_ITEMS;

onMounted(() => {
	if (!store.enrolledCourses.length) store.fetchEnrolledCourses();
});
</script>