<template>
  <VrTour v-bind:entry="entry" />
</template>

<script>
export default {
  name: "md-vrtour",
  data() {
    const param = this.$slots.default[0].children[0].text.split("\n");

    return {
      entry: param[0] || "default",
    };
  },
};
</script>
