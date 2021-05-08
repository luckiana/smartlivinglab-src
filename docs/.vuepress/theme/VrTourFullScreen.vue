<!-- original file: @vuepress/theme-default/layouts/Layout.vue -->

<template>
  <VrTour v-bind:entry="entry" :isFullScreenMode="true" />
</template>

<style lang="stylus" scoped>
body
    background-color black
</style>

<script>
import getQuery from "../util/getQuery";
export default {
  name: "VrTourFullScreen",
  data() {
    return {
      entry: "default",
    };
  },
  mounted() {
    console.log(getQuery());
  },
};
</script>
