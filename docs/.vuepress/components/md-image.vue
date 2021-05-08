<template>
  <img :src="$withBase(src)" :title="title" :alt="alt" />
</template>

<script>
export default {
  name: "md-img",
  data() {
    const param = this.$slots.default[0].children[0].text.split("\n");

    return {
      src: param[0] || "",
      title: param[1] || void 0,
      alt: param[2] || param[1] || void 0,
    };
  },
};
</script>
