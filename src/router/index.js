import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '../components/BackendLayout.vue'
import AuthLayout from '../components/AuthLayout.vue'
import { resolveDirective } from 'vue'
import FrontendLayout from '../components/FrontendLayout.vue'
//配置后台路由
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    name: 'BackendRoot',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        name: 'Knowledge',
        component: () => import('../views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultations',
        name: 'Consultations',
        component: () => import('../views/consultations.vue'),
        meta: {
          title: '咨询管理',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        name: 'Emotional',
        component: () => import('../views/emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User'
        }

      }

    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('../views/login.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('../views/register.vue'),
        meta: {
          title: '注册'
        }
      }
    ]
  }
]

//配置前台路由
const frontendRoutes = [
  {
    path: '/',
    name: 'FrontendLayout',
    component: FrontendLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/home.vue')
      },
      {
        path: 'consultation',
        name: 'Consultation',
        component: () => import('../views/consultation.vue')
      },
      {
        path: 'emotion-diary',
        name: 'EmotionDiary',
        component: () => import('../views/emotionDiary.vue')
      },
      {
        path: 'frontendknowledge',
        name: 'FrontendKnowledge',
        component: () => import('../views/frontendknowledge.vue')
      },
      {
        path: 'knowledge/article/:id',
        name: 'KnowledgeDetail',
        component: () => import('../views/articleDetail.vue'),
        props: true
      }
    ]
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  //当前用户是否登录
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    //如果是后台用户
    if (userInfo.userType == 2) {
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
    }
    else if (userInfo.userType == 1) {
      //对于用户端的账号只能访问前台的路由
      if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
        next('/home')
      } else {
        next()
      }
    }
  }
  else {
    if (to.path.startsWith('/back')) {
      //如果用户未登录且访问的是后台路由，则重定向到登录页
      next('/auth/login')
    } else {
      //否则正常导航
      next()
    }
  }
})


export default router

