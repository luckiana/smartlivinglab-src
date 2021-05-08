<template>
  <p>Current language is [{{ lang }}].</p>
</template>

<script>
export default {
  name: "CurrentLang",
  data() {
    return {
      lang: this.$lang,
    };
  },
};
</script>
