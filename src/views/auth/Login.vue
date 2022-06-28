<template>
  <v-card class="mx-auto mt-10 elevation-12" max-width="400">
    <v-toolbar dark color="primary">
      <v-toolbar-title v-text="$t('login_account')" />
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          prepend-icon="mdi-account"
          name="email"
          :label="$t('email')"
          :placeholder="$t('email')"
          type="email"
          v-model="email"
          :rules="emailRules"
          required
        />
        <v-text-field
          prepend-icon="mdi-lock"
          :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isShowPassword ? 'text' : 'password'"
          @click:append="isShowPassword = !isShowPassword"
          name="password"
          :label="$t('password')"
          :placeholder="$t('password')"
          v-model="password"
          :rules="passwordRules"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        :disabled="!valid"
        @click="submit"
        v-text="$t('login')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { get, call } from "vuex-pathify";

export default {
  name: "Login",
  data() {
    return {
      valid: false,
      isShowPassword: false,
      email: "",
      password: "",
    };
  },
  computed: {
    isAuthenticated: get("auth/isAuthenticated"),
    emailRules() {
      return [
        (v) => !!v || this.$t("rule.required", [this.$t("email")]),
        (v) =>
          /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(v) ||
          this.$t("rule.valid", [this.$t("email")]),
      ];
    },
    passwordRules() {
      return [
        (v) => !!v || this.$t("rule.required", [this.$t("password")]),
        (v) =>
          v.length >= 6 || this.$t("rule.minLength", [this.$t("password"), 6]),
        (v) =>
          /(?=.*[A-Z])/.test(v) ||
          this.$t("rule.uppercaseChar", [this.$t("password")]),
        (v) =>
          /(?=.*\d)/.test(v) || this.$t("rule.number", [this.$t("password")]),
        (v) =>
          /([!@$%])/.test(v) ||
          this.$t("rule.specialChar", [this.$t("password")]),
      ];
    },
  },
  methods: {
    login: call("auth/login"),
    submit() {
      if (this.$refs.form.validate()) {
        this.login({
          email: this.email,
          password: this.password,
        }).then(() => {
          if (this.$route.query) {
            const redirect = this.$route.query.redirect;
            const route = redirect ? { name: redirect } : { name: "Notes" };
            this.$router.push(route);
          } else {
            this.$router.push({ name: "Notes" });
          }
        });
      }
    },
  },
  created() {
    if (this.isAuthenticated) {
      this.$router.push({ name: "Notes" });
    }
  },
};
</script>
