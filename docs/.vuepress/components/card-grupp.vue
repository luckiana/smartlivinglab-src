<template>
  <div class="row row-cols-1 row-cols-md-4 padding-size">
    <br/>
    <slot name="1"></slot>
    <slot name="2"></slot>
    <slot name="3"></slot>
    <slot name="4"></slot>
    <slot name="5"></slot>
    <slot name="6"></slot>
    <slot name="7"></slot>
    <slot name="8"></slot>
    <slot name="9"></slot>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";

export default {};
</script>

<style scoped>
.padding-size{
  padding-left: 2%;
  padding-right: 2%;
}
</style>