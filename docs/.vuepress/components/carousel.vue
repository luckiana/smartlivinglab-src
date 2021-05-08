<template>
  <x-carousel :perPage="1">
    <x-slide
      v-for="item in items"
      :key="items.indexOf(item)"
      v-bind:data-index="items.indexOf(item)"
      v-bind:data-name="item[0] || ''"
      @slideclick="handleSlideClick"
    >
      <div class="carousel-container">
        <div
          v-bind:style="{
            backgroundImage: `url('${$withBase(
              `/images/carousel/${item[0] || 'default'}.jpg`
            )}')`,

            cursor: item[2] ? 'pointer' : 'default',
          }"
          class="carousel-image"
        />
        <p class="carousel-description">{{ item[1] || "" }}</p>
      </div>
    </x-slide>
  </x-carousel>
</template>

<style scoped lang="stylus">
div
  &.carousel-container
    display flex
    width 100%
    height 30rem
    flex-direction column
    align-items center
    justify-content center
    position relative
    overflow visible
  &.carousel-image
    width 100%
    height 30rem
    margin 0
    background-size cover
    background-position 50% 50%

p
  &.carousel-description
    position absolute
    right 0
    bottom 0
    margin 1rem 2rem
    font-size 4rem
    color white
    filter drop-shadow(0 0.1rem 0.2rem #000)
    display inline-block
</style>

<style lang="stylus">
.VueCarousel-pagination
    margin-top -80px
    filter drop-shadow(0 0.1rem 0.1rem #000)
    z-index 1

.VueCarousel-wrapper
    filter drop-shadow(0 0.1rem 0.5rem #000)
</style>

<script>
import { Carousel, Slide } from "vue-carousel";
export default {
  name: "Carousel",
  components: {
    "x-carousel": Carousel,
    "x-slide": Slide,
  },
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    handleSlideClick: function(dataset) {
      const item = this.items[dataset.index];
      if (item === undefined) return;
      const itemLink = item[2];
      if (itemLink !== undefined) {
        location.href = this.$withBase(itemLink);
      } else {
        console.log(
          dataset.name + " at position " + dataset.index + " >> no link be set"
        );
      }
    },
  },
};
</script>
