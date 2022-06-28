<template>
  <v-card flat>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      rounded
      min-width="150px"
      top
      offset-x
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-list-item
          class="px-2"
          link
          v-bind="attrs"
          v-on="{ ...menu }"
        >
          <v-list-item-avatar>
            <v-avatar>
              <v-img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
              <v-icon v-else size="40" color="indigo" dark>
                mdi-account-circle
              </v-icon>
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="user.name" />
            <v-list-item-subtitle class="caption" v-text="user.email" />
          </v-list-item-content>
        </v-list-item>
      </template>


      <v-card>
        <v-list>
          <v-list-item link @click="toUserProfile">
            <v-list-item-avatar>
              <v-avatar>
                <img v-if="user.avatar" :src="user.avatar" :alt="user.name">
                <v-icon v-else size="40" color="indigo" dark>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="user.name" />
              <v-list-item-subtitle class="caption" v-text="user.email" />
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list
          class="pa-0"
        >
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            v-show="isAuthenticated == item.authRequired"
            @click="handleClick(item.action)"
          >
            <v-list-item-icon v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(item.text) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- <v-list-item class="mx-auto text-center">
          <v-btn
            color="primary"
            depressed
            rounded
            text
            @click="menu = false"
            to="register"
          >
            {{ $t('register') }}
          </v-btn>
          <v-divider class="my-3" />
          <v-btn
            color="primary"
            depressed
            rounded
            text
            @click="menu = false"
            to="login"
          >
            {{ $t('login') }}
          </v-btn>
        </v-list-item> -->
      </v-card>
    </v-menu>
  </v-card>
</template>

<script>
import { get, call } from 'vuex-pathify'

export default {
  props: {
    mini: Boolean,
    user: Object,
  },
  data: () => ({
    menu: false,
    items: [
      {
        text: 'register',
        icon: 'mdi-account-plus',
        authRequired: false,
        action: 'handleRegister',
      },
      {
        text: 'login',
        icon: 'mdi-account-key',
        authRequired: false,
        action: 'handleLogin',
      },
      {
        text: 'logout',
        icon: 'mdi-power',
        authRequired: true,
        action: 'handleLogout',
      },
    ],
  }),
  computed: {
    isAuthenticated: get('auth/isAuthenticated'),
  },
  methods: {
    logout: call('auth/logout'),
    showSnackbar: call('snackbar/showSnackbar'),
    handleClick(action) {
      this[action]()
    },
    handleRegister() {
      this.$router.push({ name: 'Register' }).catch(() => {})
    },
    handleLogin() {
      this.$router.push({ name: 'Login' }).catch(() => {})
    },
    handleLogout() {
      this.$confirm(this.$t('confirm_logout'),{
        title: this.$t('warning'),
        buttonTrueText: this.$t('yes'),
        buttonFalseText: this.$t('no'),
      }).then(res => {
        if (res) {
          this.logout()
          this.showSnackbar({
            color: 'success',
            text: 'logout_successful'
          })
          this.$router.push({ name: 'Home' }).catch(() => {})
        }
      })
    },
    toUserProfile() {
      this.$router.push({ name: 'UserProfile' }).catch(() => {})
    }
  }
}
</script>
