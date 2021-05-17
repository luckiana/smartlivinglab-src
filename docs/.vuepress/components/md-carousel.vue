<template>
  <carousel v-bind:items="items"></carousel>
</template>

<script>
import Carousel from "./Carousel";
export default {
  components: {
    carousel: Carousel,
  },
  name: "md-carousel",
  data() {
    const items = this.$slots.default[0].children[0].text
      .split("\n")
      .map((s) => {
        const firstTwo = s.split("=>");
        const secondTwo = firstTwo?.split("::");
        return [firstTwo[0], secondTwo[0], secondTwo[1]];
      });

    return {
      items,
    };
  },
};
</script>
