<!-- original file: @vuepress/theme-default/layouts/Layout.vue -->

<template>
  <no-ssr>
    <VrTour v-bind:entry="entry" :isFullScreenMode="true" />
  </no-ssr>
</template>

<style lang="stylus" scoped>
body
    background-color black
</style>

<script>
import NoSSR from "vue-no-ssr";
export default {
  components: {
    "no-ssr": NoSSR,
  },
  name: "VrTourFullScreen",
  data() {
    return {
      entry: "default",
    };
  },
};
</script>
