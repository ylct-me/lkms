<template>
  <v-card
    class="mx-auto mt-10 elevation-12" max-width="400"
  >
    <v-toolbar
      dark color="primary"
    >
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title v-text="$t('user_profile')" />
      <v-spacer />
      <v-btn
        color="purple"
        fab
        small
        @click="isEditing = !isEditing"
      >
        <v-icon v-if="isEditing">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :disabled="!isEditing"
          prepend-icon="mdi-account"
          name="username"
          :label="$t('username')"
          :placeholder="$t('username')"
          v-model="username"
          :rules="usernameRules"
        />
        <v-text-field
          :disabled="!isEditing"
          prepend-icon="mdi-lock"
          :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isShowPassword ? 'text' : 'password'"
          @click:append="isShowPassword = !isShowPassword"
          name="password"
          :label="$t('password')"
          :placeholder="$t('password')"
          v-model="password"
          :rules="passwordRules"
        />
        <v-text-field
          :disabled="!isEditing"
          v-model="avatar"
          outlined
          clearable
          dense
          :label="$t('avatar')"
          :placeholder="$t('avatar')"
        >
          <template v-slot:prepend>
            <v-avatar>
              <img v-if="avatar" :src="avatar" :alt="avatar">
              <v-icon v-else size="40" color="indigo" dark>
                mdi-account-circle
              </v-icon>
            </v-avatar>
          </template>
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        :disabled="!isEditing || !valid"
        color="success"
        @click="save"
        v-text="$t('save')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { get, call } from "vuex-pathify";

export default {
  name: "Profile",
  data() {
    return {
      isEditing: null,
      valid: false,
      isShowPassword: false,
      username: "",
      password: "",
      avatar: "",
      // passwordRules: [
      //   v => v.length >= 6 ||
      //       this.$t('rule.minLength', [this.$t('password'), 6]),
      //   v => /(?=.*[A-Z])/.test(v) || this.$t('rule.uppercaseChar', [this.$t('password')]),
      //   v => /(?=.*\d)/.test(v) || this.$t('rule.number', [this.$t('password')]),
      //   v => /([!@$%])/.test(v) || this.$t('rule.specialChar', [this.$t('password')])
      // ]
    };
  },
  computed: {
    currentUser: get("auth/user"),
    usernameRules() {
      return [
        (v) => !!v || this.$t("rule.required", [this.$t("username")]),
        (v) =>
          /[a-zA-Z0-9_-]+/.test(v) ||
          this.$t("rule.valid", [this.$t("username")]),
      ];
    },
    passwordRules() {
      return this.password === ""
        ? []
        : [
            (v) =>
              v.length >= 6 ||
              this.$t("rule.minLength", [this.$t("password"), 6]),
            (v) =>
              /(?=.*[A-Z])/.test(v) ||
              this.$t("rule.uppercaseChar", [this.$t("password")]),
            (v) =>
              /(?=.*\d)/.test(v) ||
              this.$t("rule.number", [this.$t("password")]),
            (v) =>
              /([!@$%])/.test(v) ||
              this.$t("rule.specialChar", [this.$t("password")]),
          ];
    },
  },
  methods: {
    save() {
      this.isEditing = !this.isEditing;
      this.submit();
    },
    ...call("auth", ["getProfile", "updateProfile"]),
    submit() {
      if (this.$refs.form.validate()) {
        this.updateProfile({
          username: this.username,
          password: this.password || undefined,
          avatar: this.avatar,
        });
      }
    },
  },
  created() {
    this.getProfile().then(() => {
      this.username = this.currentUser.name;
      this.avatar = this.currentUser.avatar;
    });
  },
};
</script>
