import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), name: 'login', hidden: true, meta: { noCache: true } },
  { path: '/404', component: _import('404'), name: 'error', hidden: true },
  // { path: '/test', component: _import('admanage/components/AdLocation'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: 'login',
    // name: 'login',
    hidden: true,
    children: [{
      path: 'login',
      redirect: 'login/index',
      component: _import('login/index')
    }]
  },
  //商品管理
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/index',
    name: 'goods',
    meta: { title: '商品管理', icon: 'example', noCache: false, new: true },
    children: [{
      path: 'index',
      name: 'Goods',
      hidden: false,
      component: _import('goods/index'),
      meta: { title: '商品列表', icon: 'example', noCache: false, new: true }
    }, {
      path: 'add',
      name: 'GoodsAdd',
      hidden: true,
      component: _import('goods/add'),
      meta: { title: '添加商品', icon: 'example', noCache: false, new: true }
    }, {
      path: 'update/id/:id',
      name: 'GoodsUpdate',
      hidden: true,
      component: _import('goods/update'),
      meta: { title: '编辑商品', icon: 'example', noCache: false, new: true }
    }, {
      path: 'classify',
      name: 'GoodsClassify',
      hidden: false,
      component: _import('goods/classify'),
      meta: { title: '分类列表', icon: 'example', noCache: false, new: true }
    }, {
      path: 'brand',
      name: 'GoodsBrand',
      hidden: false,
      component: _import('goods/brand'),
      meta: { title: '品牌列表', icon: 'example', noCache: false, new: true }
    }]
  },
  //供应商管理
  {
    path: '/supplier',
    component: Layout,
    redirect: '/supplier/index',
    name: 'supplier',
    meta: { title: '供应商管理', icon: 'example', noCache: false, new: true },
    children: [{
      path: 'index',
      name: 'Supplier',
      hidden: false,
      component: _import('supplier/index'),
      meta: { title: '供应商列表', icon: 'example', noCache: false, new: true }
    }, {
      path: 'add',
      name: 'SupplierAdd',
      hidden: true,
      component: _import('supplier/add'),
      meta: { title: '添加供应商', icon: 'example', noCache: false, new: true }
    }, {
      path: 'update/id/:id',
      name: 'SupplierUpdate',
      hidden: true,
      component: _import('supplier/update'),
      meta: { title: '编辑供应商', icon: 'example', noCache: false, new: true }
    }]
  },
  //会员管理
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'user',
    meta: { title: '会员管理', icon: 'example', noCache: false, new: true },
    children: [{
      path: 'index',
      name: 'User',
      hidden: false,
      component: _import('user/index'),
      meta: { title: '会员列表', icon: 'example', noCache: false, new: true }
    }, {
      path: 'add',
      name: 'UserAdd',
      hidden: true,
      component: _import('user/add'),
      meta: { title: '添加会员', icon: 'example', noCache: false, new: true }
    }, {
      path: 'update/id/:id',
      name: 'UserUpdate',
      hidden: true,
      component: _import('user/update'),
      meta: { title: '编辑会员', icon: 'example', noCache: false, new: true }
    }]
  },
  //订单管理
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    name: 'order',
    meta: { title: '订单管理', icon: 'example', noCache: false, new: true },
    children: [{
      path: 'index',
      name: 'Order',
      hidden: false,
      component: _import('order/index'),
      meta: { title: '订单管理', icon: 'example', noCache: false, new: true }
    }, {
      path: 'details',
      name: 'OrderDetails',
      hidden: true,
      component: _import('order/details'),
      meta: { title: '订单详情', icon: 'example', noCache: false, new: true }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
