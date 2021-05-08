<template>
  <Carousel v-bind:items="items"></Carousel>
</template>

<script>
export default {
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
