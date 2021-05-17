<template>
  <no-ssr>
    <vr-tour v-bind:entry="entry" />
  </no-ssr>
</template>

<script>
import NoSSR from "vue-no-ssr";
import VrTour from "./VrTour";

export default {
  components: {
    "no-ssr": NoSSR,
    "vr-tour": VrTour,
  },
  name: "md-vrtour",
  data() {
    const param = this.$slots.default[0].children[0].text.split("\n");

    return {
      entry: param[0] || "default",
    };
  },
};
</script>
