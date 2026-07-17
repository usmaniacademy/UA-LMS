const setTitle = (pageName?: string) => {
  return pageName
    ? `${pageName} | Usmani Academy`
    : 'Usmani Academy — Teaching and Learning for Understanding';
};

const demoRoutes = [
  {
    path: '/',
    redirect: { name: 'demos.default' },
    name: 'index'
  },
  {
    path: '/demos/default',
    name: 'demos.default',
    meta: {
      title: setTitle('Default')
    },
    component: () => import('@/views/demos/default/index.vue')
  },
];

const pagesRoutes = [

  // Products
  {
    path: '/products',
    name: 'products',
    meta: {
      title: setTitle('Our Products')
    },
    component: () => import('@/views/pages/products/index.vue')
  },

  // About
  {
    path: '/about/about-us',
    name: 'about',
    meta: {
      title: setTitle('About')
    },
    component: () => import('@/views/pages/about/about-us/index.vue')
  },
  {
    path: '/about/contact-us',
    name: 'about.contact.us',
    meta: {
      title: setTitle('Contact Us')
    },
    component: () => import('@/views/pages/about/contact-us/index.vue')
  },
  {
    path: '/about/pricing',
    name: 'about.pricing',
    meta: {
      title: setTitle('Pricing')
    },
    component: () => import('@/views/pages/about/pricing/index.vue')
  },

  // Help
  {
    path: "/faq",
    name: "help.faq",
    meta: {
      title: setTitle("FAQs")
    },
    component: () => import("@/views/pages/help/faqs/index.vue"),
  },

  // Authentication
  {
    path: "/auth/sign-in",
    name: "auth.sign-in",
    meta: {
      title: setTitle("Sign In")
    },
    component: () => import("@/views/pages/auth/sign-In.vue"),
  },
  {
    path: "/auth/sign-up",
    name: "auth.sign-up",
    meta: {
      title: setTitle("Sign Up")
    },
    component: () => import("@/views/pages/auth/sign-up.vue"),
  },
  {
    path: "/auth/forgot-password",
    name: "auth.forgot-password",
    meta: {
      title: setTitle("Forgot Password")
    },
    component: () => import("@/views/pages/auth/forgot-password.vue"),
  },

  // Specialty
  {
    path: "/error-404",
    name: "specialty.error-404",
    meta: {
      title: setTitle("Error 404")
    },
    component: () => import("@/views/pages/specialty/error-404.vue"),
  },
  // ─── UA LMS — Course Routes ───────────────────────────────────────────────
  {
    path: '/courses',
    name: 'courses.list',
    meta: { title: setTitle('All Courses') },
    component: () => import('@/views/courses/index.vue')
  },
  {
    path: '/courses/:slug',
    name: 'course.detail.slug',
    meta: { title: setTitle('Course') },
    component: () => import('@/views/courses/detail.vue')
  },
  {
    path: '/learn/:slug',
    name: 'course.learn',
    meta: { title: setTitle('Course Player') },
    component: () => import('@/views/courses/player.vue')
  },
  {
    path: '/subscription/success',
    name: 'subscription.success',
    meta: { title: setTitle('Subscription Successful') },
    component: () => import('@/views/subscription/success.vue')
  },

  // ─── UA LMS — Blog Routes ─────────────────────────────────────────────────
  {
    path: '/blog',
    name: 'blog.list',
    meta: { title: setTitle('Blog') },
    component: () => import('@/views/blog/index.vue')
  },
  {
    path: '/blog/:slug',
    name: 'blog.detail',
    meta: { title: setTitle('Blog') },
    component: () => import('@/views/blog/detail.vue')
  }
];

const adminRoutes = [
  {
    path: "/admin/dashboard",
    name: "admin.dashboard",
    meta: {
      title: setTitle("Dashboard"),
      authRequired: true
    },
    component: () => import("@/views/admin/dashboard/index.vue"),
  },
  {
    path: "/admin/course-list",
    name: "admin.course-list",
    meta: {
      title: setTitle("Course List"),
      authRequired: true
    },
    component: () => import("@/views/admin/courses/list/index.vue"),
  },
  {
    path: "/admin/course-category",
    name: "admin.course.category",
    meta: {
      title: setTitle("Course Category"),
      authRequired: true
    },
    component: () => import("@/views/admin/courses/category/index.vue"),
  },
  {
    path: "/admin/course-detail/:id",
    name: "admin.course.detail",
    meta: {
      title: setTitle("Course detail"),
      authRequired: true
    },
    component: () => import("@/views/admin/courses/details/index.vue"),
  },
  {
    path: "/admin/student-list",
    name: "admin.student.list",
    meta: {
      title: setTitle("Student List"),
      authRequired: true
    },
    component: () => import("@/views/admin/studentList/index.vue"),
  },
  {
    path: "/admin/users/:id",
    name: "admin.user.detail",
    meta: {
      title: setTitle("User Detail"),
      authRequired: true
    },
    component: () => import("@/views/admin/userDetail/index.vue"),
  },
  {
    path: "/admin/instructor-list",
    name: "admin.instructor.list",
    meta: {
      title: setTitle("Instructor List"),
      authRequired: true
    },
    component: () => import("@/views/admin/instructors/list/index.vue"),
  },
  {
    path: "/admin/review",
    name: "admin.review",
    meta: {
      title: setTitle("Review"),
      authRequired: true
    },
    component: () => import("@/views/admin/reviews/index.vue"),
  },
  {
    path: "/admin/earning",
    name: "admin.earning",
    meta: {
      title: setTitle("earning"),
      authRequired: true
    },
    component: () => import("@/views/admin/earning/index.vue"),
  },
  {
    path: "/admin/setting",
    name: "admin.setting",
    meta: {
      title: setTitle("setting"),
      authRequired: true
    },
    component: () => import("@/views/admin/setting/index.vue"),
  },
  {
    path: "/admin/error-404",
    name: "admin.error-404",
    meta: {
      title: setTitle("Error 404"),
      authRequired: true
    },
    component: () => import("@/views/admin/Error-404.vue"),
  },
];

const accountsRoutes = [
  // Instructor
  {
    path: "/instructor/dashboard",
    name: "instructor.dashboard",
    meta: {
      title: setTitle("Dashboard")
    },
    component: () => import("@/views/accounts/instructor/dashboard/index.vue"),
  },
  {
    path: "/instructor/course",
    name: "instructor.course",
    meta: {
      title: setTitle("Course")
    },
    component: () => import("@/views/accounts/instructor/course/index.vue"),
  },
  {
    path: "/instructor/create-course",
    name: "instructor.create.course",
    meta: {
      title: setTitle("Create Course")
    },
    component: () => import("@/views/accounts/instructor/create-course/index.vue"),
  },
  {
    path: "/instructor/edit-course/:id",
    name: "instructor.edit.course",
    meta: {
      title: setTitle("Edit Course")
    },
    component: () => import("@/views/accounts/instructor/create-course/index.vue"),
  },
  {
    path: "/instructor/zoom",
    name: "instructor.zoom",
    meta: { title: setTitle("Zoom Classes"), authRequired: true, role: 'instructor' },
    component: () => import("@/views/accounts/instructor/zoom/index.vue"),
  },
  {
    path: "/instructor/quiz",
    name: "instructor.quiz",
    meta: {
      title: setTitle("Quiz")
    },
    component: () => import("@/views/accounts/instructor/quiz/index.vue"),
  },
  {
    path: "/instructor/earning",
    name: "instructor.earning",
    meta: {
      title: setTitle("Earning")
    },
    component: () => import("@/views/accounts/instructor/earning/index.vue"),
  },
  {
    path: "/instructor/student",
    name: "instructor.student",
    meta: {
      title: setTitle("Student List")
    },
    component: () => import("@/views/accounts/instructor/students/index.vue"),
  },
  {
    path: "/instructor/order",
    name: "instructor.order",
    meta: {
      title: setTitle("Orders")
    },
    component: () => import("@/views/accounts/instructor/orders/index.vue"),
  },
  {
    path: "/instructor/edit-profile",
    name: "instructor.edit.profile",
    meta: {
      title: setTitle("Edit Profile")
    },
    component: () => import("@/views/accounts/instructor/edit-profile/index.vue"),
  },
  {
    path: "/instructor/payout",
    name: "instructor.payout",
    meta: {
      title: setTitle("Payouts")
    },
    component: () => import("@/views/accounts/instructor/payout/index.vue"),
  },
  {
    path: "/instructor/delete-account",
    name: "instructor.delete.account",
    meta: {
      title: setTitle("Delete Accounts")
    },
    component: () => import("@/views/accounts/instructor/delete-account.vue"),
  },

  // Student
  {
    path: "/student/dashboard",
    name: "student.dashboard",
    meta: {
      title: setTitle("Dashboard")
    },
    component: () => import("@/views/accounts/student/dashboard/index.vue"),
  },
  {
    path: "/student/subscription",
    name: "student.subscription",
    meta: {
      title: setTitle("Subscription")
    },
    component: () => import("@/views/accounts/student/subscription/index.vue"),
  },
  {
    path: "/student/course",
    name: "student.course",
    meta: {
      title: setTitle("Courses")
    },
    component: () => import("@/views/accounts/student/courses/index.vue"),
  },
  {
    path: "/student/course-resume",
    name: "student.course.resume",
    meta: {
      title: setTitle("Course Resume")
    },
    component: () => import("@/views/accounts/student/course-resume/index.vue"),
  },
  {
    path: "/student/quiz",
    name: "student.quiz",
    meta: {
      title: setTitle("Quiz")
    },
    component: () => import("@/views/accounts/student/quiz/index.vue"),
  },
  {
    path: "/student/payment",
    name: "student.payment",
    meta: {
      title: setTitle("Payment Info")
    },
    component: () => import("@/views/accounts/student/payment/index.vue"),
  },
  {
    path: "/student/bookmark",
    name: "student.bookmark",
    meta: {
      title: setTitle("Bookmark")
    },
    component: () => import("@/views/accounts/student/bookmark/index.vue"),
  },
  {
    path: "/student/edit-profile",
    name: "student.edit.profile",
    meta: {
      title: setTitle("Edit Profile")
    },
    component: () => import("@/views/accounts/student/edit-profile/index.vue"),
  },

  // ─── Content Writer (blog portal — content_writer + admin) ────────────────
  {
    path: "/content/posts",
    name: "content.posts",
    meta: { title: setTitle("All Posts"), authRequired: true, role: ['content_writer', 'admin'] },
    component: () => import("@/views/accounts/content/posts/index.vue"),
  },
  {
    path: "/content/posts/new",
    name: "content.post.new",
    meta: { title: setTitle("New Post"), authRequired: true, role: ['content_writer', 'admin'] },
    component: () => import("@/views/accounts/content/editor/index.vue"),
  },
  {
    path: "/content/posts/edit/:id",
    name: "content.post.edit",
    meta: { title: setTitle("Edit Post"), authRequired: true, role: ['content_writer', 'admin'] },
    component: () => import("@/views/accounts/content/editor/index.vue"),
  },
  {
    path: "/content/edit-profile",
    name: "content.edit.profile",
    meta: { title: setTitle("Edit Profile"), authRequired: true, role: ['content_writer', 'admin'] },
    component: () => import("@/views/accounts/content/edit-profile/index.vue"),
  }
];

const catchAllRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    meta: { title: setTitle('Page Not Found') },
    component: () => import('@/views/pages/specialty/error-404.vue')
  }
]

export const allRoutes = [
  ...demoRoutes, ...pagesRoutes, ...accountsRoutes, ...adminRoutes, ...catchAllRoutes
];