<template>
  <div id="carousel">
    <div
      class="carousel"
      ref="carousel"
      v-bind:style="{ height: height + 'px' }"
    >
      <transition-group tag="ul" class="slide clearfix" :name="transitionName">
        <li
          v-for="(item, index) in slideData"
          :key="index"
          v-show="index == beginValue"
          v-bind:style="{ height: height + 'px' }"
        >
          <router-link :to="item.url">
            <img :src="item.src" />
            <div class="title">{{ item.title }}</div>
          </router-link>
        </li>
      </transition-group>
      <div class="up" @click="up" v-show="arrow"></div>
      <div class="next" @click="next" v-show="arrow"></div>
      <div class="slideDot" v-show="dot">
        <span
          v-for="(item, index) in slideData"
          :class="{ active: index == beginValue }"
          @click="change(index)"
          :key="index"
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "carousel",
  data() {
    return {
      setInterval: "",
      beginValue: 0,
      transitionName: "slide",
    };
  },
  beforeDestroy() {
    // 组件销毁前,清除监听器
    clearInterval(this.setInterval);
  },
  methods: {
    change(key) {
      if (key > this.slideData.length - 1) {
        key = 0;
      }
      if (key < 0) {
        key = this.slideData.length - 1;
      }
      this.beginValue = key;
    },
    autoPlay() {
      //console.log(this.$refs.carousel.getBoundingClientRect().width);
      this.transitionName = "slide";
      this.beginValue++;
      if (this.beginValue >= this.slideData.length) {
        this.beginValue = 0;
        return;
      }
    },
    play() {
      this.setInterval = setInterval(this.autoPlay, this.interval);
    },
    mouseOver() {
      //鼠标进入
      //console.log('over')
      clearInterval(this.setInterval);
    },
    mouseOut() {
      //鼠标离开
      //console.log('out')
      this.play();
    },
    up() {
      //上一页
      --this.beginValue;
      this.transitionName = "slideBack";
      this.change(this.beginValue);
    },
    next() {
      //下一页
      ++this.beginValue;
      this.transitionName = "slide";
      this.change(this.beginValue);
    },
  },
  mounted() {
    var box = this.$refs.carousel; //监听对象
    box.addEventListener("mouseover", () => {
      this.mouseOver();
    });
    box.addEventListener("mouseout", () => {
      this.mouseOut();
    });
    this.beginValue = this.begin;
    this.play();
  },
  props: {
    height: {
      type: Number,
      default: 600,
    },
    dot: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 5000,
    },
    begin: {
      type: Number,
      default: 0,
    },
    slideData: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
};
</script>
<style scoped>
.slide {
  position: relative;
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 450px;
}
.slide li {
  list-style: none;
  position: absolute;
  width: 100%;
  height: 450px;
}
.slide li img {
  width: 100%;
  height: 450px;
  cursor: pointer;
}
.slide li .title {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 10px 20px;
  width: 100%;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: larger;
  text-align: center;
}
.slideDot {
  position: absolute;
  z-index: 999;
  bottom: 4%;
  right: 15px;
}
.slideDot span {
  display: inline-block;
  width: 30px;
  height: 7px;
  background: rgba(255, 255, 255, 0.65);
  margin-left: 5px;
}
.slideDot span.active {
  background: rgba(255, 255, 255, 1);
}
.up,
.next {
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -32px;
  cursor: pointer;
  width: 64px;
  height: 64px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.up {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABSklEQVRoQ9Xa220CMRCF4XMqIB0kdJASSCfpIDWlAzqAElIC6SBUMNFIywsCtB7PjX336v/k3YexTBQ+IvIC4AvAN8mTJYWWRR5rROQdwAGAIk4kt5b3lgCu4rX7l+TbUwBuxJ8B7Ej+tAd4xys47ROKiE8DRMWnACLjwwHR8aGAjPgwQFZ8CCAz3h2QHe8KqIh3A1TFuwAq46cB1fFTgA7xZkCXeBOgU/wwoFv8EKBj/GpA1/gRgJ4e7JaZdWqGtcy9j9asGilFRM9sXpcX/QH4sA7hVQA9wzkC2HRDrNoBjV7+g3aI1YCuiCFAR8QwoBvCBOiEMAO6IKYAHRDTgGqEC6AS4QaoQrgCKhDugGxECCATEQbIQoQCMhDhgGhECiASkQaIQqQCIhDpgDuI57orcQNxJqmXPoafkh24VIqIXvD4BLC3HtP8A6pfGkB3vbyXAAAAAElFTkSuQmCC");
}
.next {
  left: auto;
  right: 0;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABOElEQVRoQ9Xa0W0CQQyEYU9JqShQAXSSEgIdUAIlQAd04milezgdOiHZ4/GGN5C8/N/u060Olvy4+8nMngDuyaVC4whNLUPufjazn+XrEcAls15klgkY/y9HpACj2N3Hrn+vdk+KSAO6ERRAJ4IG6EJQAR0IOkCNKAEoEWUAFaIUoECUA6oREkAlQgaoQkgBFQg5gI1oATARbQAWohXAQLQDsogpABnENIAoYirADuILwGPvxmJGwK+ZHVbB/wfg7tv4K4A15u0gpjmBSPzQTAGIxk8ByMS3A7LxrQBGfBuAFd8CYMbLAex4KaAiXgaoipcAKuPLAdXxpQBFfBlAFV8CUMbTAep4KqAjngboiqcAOuPTgM27EmO9j8+we7cL0d9Tj5QbgDw+fQLLPc54Y+UF4BbdxczcH9Le8DFn39OvAAAAAElFTkSuQmCC");
}
.up:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
.next:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
/*进入过渡生效时的状态*/
.slide-enter-active {
  transform: translateX(0);
  transition: all 1s ease;
}
/*进入开始状态*/
.slide-enter {
  transform: translateX(-100%);
}
/*离开过渡生效时的状态*/
.slide-leave-active {
  transform: translateX(100%);
  transition: all 1s ease;
}
/*离开过渡的开始状态*/
.slide-leave {
  transform: translateX(0);
}
/*进入过渡生效时的状态*/
.slideBack-enter-active {
  transform: translateX(0);
  transition: all 1s ease;
}
/*进入开始状态*/
.slideBack-enter {
  transform: translateX(100%);
}
/*离开过渡生效时的状态*/
.slideBack-leave-active {
  transform: translateX(-100%);
  transition: all 1s ease;
}
/*离开过渡的开始状态*/
.slideBack-leave {
  transform: translateX(0);
}
</style>