import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

// const whiteList = ['login', 'error'] // 不重定向白名单

// store.dispatch('GetPermission').then((permission) => {
//   if (permission.length == 0) {
//     router.push({ path: '/404' })
//   }
//   const array = [],
//     tree = {};
//   permission.forEach((x) => {
//     array.push(x.name);
//     if (x.children.length > 0) {
//       tree[x.name] = {
//         children: x.children
//       }
//       x.children.forEach((y) => {
//         array.push(y.name);
//       })
//     }
//   })
//   store.dispatch('SetPermission', array);
//   router.options.routes.forEach((route) => {
//     if (!tree[route.name]) {
//       return;
//     }
//     route.redirect = `${route.path}/${tree[route.name].children[0].path}`;
//   })
//   router.beforeEach((to, from, next) => {
//     if (whiteList.indexOf(to.name) > -1) {
//       next();
//     } else {
//       if (array.indexOf(to.name) == -1) {
//         Message({
//           message: '您没有权限进入该页面',
//           type: 'warning'
//         })
//       } else {
//         next();
//       }
//     }
//   })
// })

// store.dispatch('GetPermission').then((permission) => {
//   if (permission.length == 0) {
//     router.push({ path: '/404' })
//   }
//   router.beforeEach((to, from, next) => {
//     if (whiteList.indexOf(to.name) > -1) {
//       next();
//     } else {
//       if (permission.indexOf(to.name) == -1) {
//         Message({
//           message: '您没有权限进入该页面',
//           type: 'warning'
//         })
//       } else {
//         next();
//       }
//     }
//   })
// })


// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   if (getToken()) {
//     if (to.path === '/login') {
//       next({ path: '/' })
//     } else {
//       if (store.getters.roles.length === 0) {
//         store.dispatch('GetInfo').then(res => { // 拉取用户信息
//           next()
//         }).catch(() => {
//           store.dispatch('FedLogOut').then(() => {
//             Message.error('验证失败,请重新登录')
//             next({ path: '/login' })
//           })
//         })
//       } else {
//         next()
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next('/login')
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   NProgress.done() // 结束Progress
// })
