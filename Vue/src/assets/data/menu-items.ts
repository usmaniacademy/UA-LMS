import type { MenuItemType } from '@/helpers/menu';
import { BIconHouse, BIconJournals, BIconPersonFill, BIconInfoCircle, BIconEnvelope } from 'bootstrap-icons-vue';

export const APP_MENU_ITEMS: MenuItemType[] = [
  {
    key: 'home',
    label: 'Home',
    icon: BIconHouse,
    route: { name: 'courses.list' }
  },
  {
    key: 'courses',
    label: 'Courses',
    icon: BIconJournals,
    route: { name: 'courses.list' }
  },
  {
    key: 'about',
    label: 'About Us',
    icon: BIconInfoCircle,
    route: { name: 'about' }
  },
  {
    key: 'contact',
    label: 'Contact',
    icon: BIconEnvelope,
    route: { name: 'about.contact.us' }
  }
];

// Instructor / student account menu items (used in sidebar layouts)
import {
  BIconGridFill, BIconFileEarmarkPlusFill, BIconFileCheckFill,
  BIconStarFill, BIconCardChecklist, BIconCreditCard2FrontFill,
  BIconPeople, BIconGraphUp, BIconGearFill, BIconBoxArrowRight,
  BIconMortarboardFill, BIconWallet2, BIconPersonFillGear, BIconSpeedometer2,
  BIconCameraVideo
} from 'bootstrap-icons-vue';

export const INSTRUCTOR_MENU_ITEMS: MenuItemType[] = [
  { key: 'instructor.dashboard', label: 'Dashboard', icon: BIconSpeedometer2, route: { name: 'instructor.dashboard' } },
  { key: 'instructor.courses', label: 'My Courses', icon: BIconFileCheckFill, route: { name: 'instructor.course' } },
  { key: 'instructor.create.course', label: 'Create Course', icon: BIconFileEarmarkPlusFill, route: { name: 'instructor.create.course' } },
  { key: 'instructor.zoom', label: 'Zoom Classes', icon: BIconCameraVideo, route: { name: 'instructor.zoom' } },
  { key: 'instructor.reviews', label: 'Reviews', icon: BIconStarFill, route: { name: 'instructor.reviews' } },
  { key: 'instructor.students', label: 'Students', icon: BIconPeople, route: { name: 'instructor.students' } },
  { key: 'instructor.quiz', label: 'Quiz', icon: BIconCardChecklist, route: { name: 'instructor.quiz' } },
  { key: 'instructor.earning', label: 'Earnings', icon: BIconGraphUp, route: { name: 'instructor.earning' } },
  { key: 'instructor.edit-profile', label: 'Edit Profile', icon: BIconPersonFillGear, route: { name: 'instructor.edit-profile' } },
];

export const STUDENT_MENU_ITEMS: MenuItemType[] = [
  { key: 'student.dashboard', label: 'Dashboard', icon: BIconSpeedometer2, route: { name: 'student.dashboard' } },
  { key: 'student.course', label: 'My Courses', icon: BIconMortarboardFill, route: { name: 'student.course' } },
  { key: 'student.subscription', label: 'Subscriptions', icon: BIconCreditCard2FrontFill, route: { name: 'student.subscription' } },
  { key: 'student.quiz', label: 'My Quizzes', icon: BIconCardChecklist, route: { name: 'student.quiz' } },
  { key: 'student.edit-profile', label: 'Edit Profile', icon: BIconPersonFillGear, route: { name: 'student.edit-profile' } },
];
