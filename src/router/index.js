import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: 'dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/Dashboard.vue'),
  },
  {
    path: '/dashboard-ct',
    name: 'dashboard-ct',
    component: () => import('@/views/dashboard-chitieu/Dashboard.vue'),
  },
  {
    path: '/chitieu-list',
    name: 'chitieu-list',
    component: () => import('@/views/family-chitieu/ChiTieuList.vue'),
  },
  {
    path: '/chitieu-email',
    name: 'chitieu-email',
    component: () => import('@/views/family-chitieu/ChiTieuEmailList.vue'),
  },
  {
    path: '/tragop-list',
    name: 'tragop-list',
    component: () => import('@/views/family-chitieu/TraGopList.vue'),
  },
  {
    path: '/typography',
    name: 'typography',
    component: () => import('@/views/typography/Typography.vue'),
  },
  {
    path: '/icons',
    name: 'icons',
    component: () => import('@/views/icons/Icons.vue'),
  },
  {
    path: '/cards',
    name: 'cards',
    component: () => import('@/views/cards/Card.vue'),
  },
  {
    path: '/simple-table',
    name: 'simple-table',
    component: () => import('@/views/simple-table/SimpleTable.vue'),
  },
  {
    path: '/form-layouts',
    name: 'form-layouts',
    component: () => import('@/views/form-layouts/FormLayouts.vue'),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    component: () => import('@/views/pages/account-settings/AccountSettings.vue'),
  },
  {
    path: '/pages/login',
    name: 'pages-login',
    component: () => import('@/views/pages/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/logout',
    name: 'pages-logout',
    component: () => import('@/views/pages/Logout.vue'),
  },
  {
    path: '/pages/register',
    name: 'pages-register',
    component: () => import('@/views/pages/Register.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/Error.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '*',
    redirect: 'error-404',
  },
  {
    path: '/family/suckhoe',
    name: 'suckhoe',
    component: () => import('@/views/family-suckhoe/SucKhoe.vue'),
  },
  {
    path: '/family/chamcon',
    name: 'chamcon',
    component: () => import('@/views/family-chamcon/ChamCon.vue'),
  },
  {
    path: '/family/chamcon-v2',
    name: 'chamcon-V2',
    component: () => import('@/views/family-chamcon/ChamConHeadlines-V2.vue'),
  },
  {
    path: '/family/chamcon-list',
    name: 'chamcon-list',
    component: () => import('@/views/family-chamcon/ChamConHeadlinesList.vue'),
  },
  {
    path: '/family/chamcon-layout',
    name: 'chamcon-layout',
    component: () => import('@/views/family-chamcon/ChamConMain.vue'),
  },
  {
    path: '/family/chamcon-monitoring',
    name: 'chamcon-layout',
    component: () => import('@/views/dashboard/MonitoringChamCon.vue'),
  },
  {
    path: '/family/chamcon-suckhoe-list',
    name: 'chamcon-suckhoe-list',
    component: () => import('@/views/family-chamcon/SucKhoeHeadlinesList.vue'),
  },
  {
    path: '/family/tiemchung-list',
    name: 'tiemchung-list',
    component: () => import('@/views/family-chamcon/TiemChungList.vue'),
  },
  {
    path: '/working/jira-logtime-list',
    name: 'jira-logtime-list',
    component: () => import('@/views/workings/jiraLogTimeList.vue'),
  },
  {
    path: '/working/jira-ticket',
    name: 'jira-ticket',
    component: () => import('@/views/workings/jiraTickets.vue'),
  },
  {
    path: '/working/bp-effort',
    name: 'bp-effort',
    component: () => import('@/views/workings/bpEfforts.vue'),
  },
  {
    path: '/kinhdoanhshopee/donhangshopee',
    name: 'donhangshopee',
    component: () => import('@/views/kinhdoanh-shopee/DonHangShopee.vue'),
  },
  {
    path: '/working/jira-logtime-sog',
    name: 'jira-logtime-sog',
    component: () => import('@/views/workings/jiraLogtime_SOG.vue'),
  },
  {
    path: '/working/bp-data-model',
    name: 'bp-data-model',
    component: () => import('@/views/workings/bpDataModel.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
