export const publicRoute = [
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import(/* webpackChunkName: "index" */ '@/layouts/default'),
  //   meta: {
  //     title: 'Login',
  //   },
  //   redirect: '/auth/login',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'login',
  //       name: 'login',
  //       meta: {
  //         title: 'Login',
  //       },
  //       component: () => import('@/views/auth/Login.vue'),
  //     },
  //   ],
  // },

  {
    path: "/404",
    name: "404",
    meta: {
      title: "not_found",
      hidden: true
    },
    component: () =>
      import(/* webpackChunkName: "404" */ "@/views/error/NotFound.vue")
  },

  {
    path: "/500",
    name: "500",
    meta: {
      title: "server_error",
      hidden: true
    },
    component: () =>
      import(/* webpackChunkName: "500" */ "@/views/error/Error.vue")
  },
  {
    path: "*",
    redirect: "/404",
    meta: {
      hidden: true
    }
  }
];

export const protectedRoute = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "@/layouts/default"),
    meta: {
      title: "home",
      icon: ""
    },
    redirect: "/me",
    children: [
      {
        path: "/me",
        name: "Mine",
        meta: {
          title: "my_notes",
          icon: "mdi-folder-account"
        },
        component: { template: "<router-view></router-view>" },
        redirect: "/me/notes",
        children: [
          {
            path: "notes",
            name: "Notes",
            meta: {
              title: "current_notes",
              icon: "mdi-folder-account",
              hidden: true
            },
            component: () =>
              import(/* webpackChunkName: "notes" */ "@/views/note")
          },
          {
            path: "note/:noteId",
            name: "Note",
            meta: {
              title: "current_note",
              icon: "mdi-folder-account",
              hidden: true
            },
            component: () =>
              import(/* webpackChunkName: "note" */ "@/views/note")
          }
        ]
      },
      {
        path: "/teams",
        name: "Teams",
        component: { template: "<router-view></router-view>" },
        meta: {
          title: "my_teams",
          icon: "mdi-account-multiple",
          authRequired: true
        },
        redirect: "/teams/overview",
        children: [
          {
            path: "overview",
            name: "TeamsOverview",
            meta: {
              title: "teams_overview",
              icon: "mdi-view-dashboard",
              authRequired: true
            },
            component: () =>
              import(
                /* webpackChunkName: "teams_overview" */ "@/views/team/TeamOverview.vue"
              )
          },
          {
            path: ":teamId/notes",
            name: "TeamNotes",
            meta: {
              title: "team_notes",
              icon: "mdi-notebook",
              authRequired: true,
              hidden: true
            },
            component: () =>
              import(/* webpackChunkName: "teams_notes" */ "@/views/note")
          },
          {
            path: ":teamId/note/:noteId",
            name: "TeamNote",
            meta: {
              title: "team_note",
              icon: "mdi-notebook",
              authRequired: true,
              hidden: true
            },
            component: () =>
              import(/* webpackChunkName: "teams_notes" */ "@/views/note")
          }
        ]
      },
      {
        path: "/profile",
        name: "UserProfile",
        meta: {
          title: "user_profile",
          authRequired: true,
          hidden: true
        },
        component: () => import("@/views/auth/Profile.vue")
      },
      {
        path: "/login",
        name: "Login",
        meta: {
          title: "login",
          hidden: true
        },
        component: () => import("@/views/auth/Login.vue")
      },
      {
        path: "/register",
        name: "Register",
        meta: {
          title: "register",
          hidden: true
        },
        component: () => import("@/views/auth/Register.vue")
      },
      {
        path: "/403",
        name: "403",
        meta: {
          title: "access_denied",
          hidden: true
        },
        component: () =>
          import(/* webpackChunkName: "403" */ "@/views/error/Deny.vue")
      }
    ]
  }
];
