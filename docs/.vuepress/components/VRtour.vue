<template>
  <!-- do not refresh component -->
  <div
    ref="container"
    class="vrtour-container"
    tabindex="0"
    :style="{
      width: isFullScreenMode ? '100vw' : void 0,
      height: isFullScreenMode ? '100vh' : void 0,
      maxHeight: isFullScreenMode ? '100vh' : void 0,
    }"
  >
    <div class="vrtour-control">
      <span>{{ i18n(config[location].name) }}</span>
      <button @click="entryFullScreenMode">
        {{
          isFullScreenMode
            ? isFullScreen
              ? i18n("FullScreen")
              : i18n("Windowed")
            : i18n("Explore")
        }}
      </button>
      <button @click="toggleVrMode" v-if="isFullScreenMode">
        {{ vrMode ? i18n("VR Mode") : i18n("Desktop Mode") }}
      </button>
      <button @click="toggleAutoMode">
        {{ autoMode ? i18n("Auto Mode") : i18n("Control By User") }}
      </button>
      <button @click="toggleGyro" v-if="!autoMode">
        {{ useGyro ? i18n("Gyroscope") : i18n("Mouse / Keyboard") }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="stylus">
div {
  canvas {
    z-index: 0;
  }

  &.vrtour-container {
    position: relative;
    background-color: black;
    width: 100%;
    height: 100rem;
    max-height: 50vh;
  }

  &.vrtour-control {
    position: absolute;
    top: 0;
    right: 0;
    margin: 1rem;
    z-index: 10;
  }

  span {
    margin: 0 1rem;
    color: white;
    filter: drop-shadow(0 0.01rem 0.2rem #000);
  }
}
</style>

<script>
import * as THREE from "three";
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls";
import config from "../settings/vrtour";
const _i18n = require("../util/i18n.js");

const sharedMaterials = {
  red: new THREE.MeshLambertMaterial({
    color: 0xcc0000,
  }),
  orange: new THREE.MeshLambertMaterial({
    color: 0xff5500,
  }),
  blue: new THREE.MeshLambertMaterial({
    color: 0x0077ff,
  }),
};

export default {
  name: "VrTour",
  props: {
    entry: {
      default: "default",
      type: String,
    },
    isFullScreenMode: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      config,
      location: "default",
      shouldLog: false,
      autoMode: true, // truer
      vrMode: false,
      rendererIsRunning: true,
      eyeDistance: 0.2,
      isFullScreen: false,
      radius: 10,
      lon: 0,
      lat: 0,
      startPosX: 0,
      startPosY: 0,
      isMouseDown: false,
      moveFactor: 45,
      fov: 60,
      useGyro: true,
    };
  },
  created() {
    const _this = this;
    window.el = this;
    this.initDataInput();
  },
  mounted() {
    window.$el = this;
    this.$container = this.$refs.container;
    this.rendererInit();
  },
  beforeDestroy() {
    this.rendererStop();
  },
  methods: {
    // vue.mounted => rendererInit =>
    // rendererMount => rendererStart
    async rendererInit() {
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);
      this.$renderer = renderer;
      await this.rendererMount();
    },

    async rendererMount() {
      await this.rendererWillMount();

      // mount element into component root element
      this.$container.appendChild(this.$renderer.domElement);

      await this.rendererDidMount();

      // start renderer and auto render scene
      await this.rendererStart();
    },

    async rendererStart() {
      this.rendererIsRunning = true;
      this.rendererAddEventListenerResize();
      this.rendererAddEventListenerMove();
      await this.rendererRender();
    },

    // vue.destroy => rendererStop
    async rendererStop() {
      this.rendererIsRunning = false;
      this.rendererRemoveEventListenerResize();
      this.rendererRemoveEventListenerMove();
    },

    // methods
    async rendererCreateScreen() {
      // raycaster
      this.$raycaster = new THREE.Raycaster();
      this.$mouse = new THREE.Vector2();
      this.$mouseCenter = new THREE.Vector2(0, 0);
      // lights
      const ambient = new THREE.AmbientLight(0x666666);
      this.$scene.add(ambient);
      const spotLight = new THREE.DirectionalLight(0xffffff);
      spotLight.castShadow = true;
      spotLight.position.set(100, 100, 100);
      spotLight.shadow.mapSize.width = spotLight.shadow.mapSize.height =
        1024 * 4;
      this.$scene.add(spotLight);

      if (this.$fontLoader === void 0) {
        this.$fontLoader = new THREE.FontLoader();
      }

      const url = config[this.location].texture;
      const geometry = new THREE.SphereGeometry(this.radius, 256, 256);
      geometry.scale(1, 1, -1);
      const material = new THREE.MeshBasicMaterial({
        map: await this.textureLoad(url),
      });
      const vrScreen = (this.$vrScreen = new THREE.Mesh(geometry, material));

      window.el = this;

      this.$scene.add(vrScreen);

      this.$points = [];

      Object.keys(config).forEach((k) => {
        const o = config[k];
        const paths = o.paths;
        if (paths === undefined) {
          return;
        }
        Object.keys(paths).forEach((id) => {
          const lon = paths[id].lon ?? 0;
          const lat = paths[id].lat ?? 0;
          const r = Math.min(paths[id].radius, this.radius * 0.75);

          const clickable =
            paths[id]?.clickable === void 0
              ? true
              : Boolean(paths[id]?.clickable);

          const size = 0.12 * (clickable ? 1 : 0.8);

          const point = new THREE.Mesh(
            new THREE.SphereGeometry(size * (clickable ? 0.5 : 0.3), 32, 32),
            clickable ? sharedMaterials.red : sharedMaterials.blue
          );

          point.castShadow = true;
          point.receiveShadow = true;

          // evil hack
          const face = Math.round(((((lon % 360) + 360) % 360) / 360) * 4) % 4;
          point.rotation.y = -face * Math.PI * 0.5;

          const name = this.i18n(
            config[id]?.name || paths[id]?.text || "ERROR: NameNotSet",
            "ascii-only"
          );

          point.$clickable = clickable;
          point.$location = k;
          point.$name = id;
          point.$type = "location";
          point.visible = k === this.location;

          const { x, y, z } = this.lglt2xyz(-lon - 180, lat, r);
          point.position.set(x, y, z);

          // this line below is VERY IMPORTANT for ArrayCamera
          point.frustumCulled = false;
          // this line abaveis VERY IMPORTANT for ArrayCamera

          this.$fontLoader.load(this.$withBase("/fonts/three.json"), (font) => {
            const tGeo = new THREE.TextGeometry(name, {
              font: font,
              size: size,
              height: size * 0,
              bevelThickness: size * 0.01,
              bevelSize: size * 0.01,
              bevelOffset: size * 0.01,
              bevelSegments: size * 1,
            });
            tGeo.center();

            const text = new THREE.Mesh(
              tGeo,
              new THREE.MeshLambertMaterial({
                color: 0xffffff,
              })
            );

            const tbgGeo = new THREE.TextGeometry(name, {
              font: font,
              size: size,
              height: (size / 4) * 0.8,
              bevelEnabled: true,
              bevelThickness: size * 0.01,
              bevelSize: size * 0.01,
              bevelOffset: size * 0.2,
              bevelSegments: size * 0.001,
            });

            tbgGeo.center();

            const textBg = new THREE.Mesh(
              tbgGeo,
              new THREE.MeshLambertMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
              })
            );

            text.position.set(0, size * 1.5, size * 0.25);
            textBg.position.set(0, 0, -size * 0.25);
            textBg.frustumCulled = text.frustumCulled = false;
            text.castShadow = true;
            text.receiveShadow = true;
            textBg.castShadow = true;
            textBg.receiveShadow = true;
            point.add(text);
            point.text = text;
            if (point.material === sharedMaterials.blue) {
              point.text.visible = false;
            }
            text.add(textBg);
          });

          lon;
          this.$scene.add(point);
          this.$points.push(point);
        });
      });
    },

    // render function
    async rendererRender() {
      await this.rendererBeforeRender();
      this.$renderer.render(this.$scene, this.$camera);
      if (this.rendererIsRunning) {
        window.requestAnimationFrame(this.rendererRender);
      }
    },

    // hooks
    async rendererWillMount() {
      this.$scene = new THREE.Scene();

      // init victors for camera control (keyboard)
      this.$moveUp = 0;
      this.$moveDown = 0;
      this.$moveLeft = 0;
      this.$moveRight = 0;

      const fov = this.fov;
      const aspect = 1;
      const near = 0.00001;
      const far = 4000;

      this.$cameraLeft = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.$cameraRight = new THREE.PerspectiveCamera(fov, aspect, near, far);

      this.$cameraLeft.viewport = new THREE.Vector4();
      this.$cameraRight.viewport = new THREE.Vector4();

      this.$camera = new THREE.ArrayCamera([this.$cameraLeft]);

      this.$viewer = new THREE.Group();
      this.$viewer.add(this.$cameraLeft);
      this.$viewer.add(this.$cameraRight);

      this.$scene.add(this.$viewer);

      this.$textureLoader = new THREE.TextureLoader();
      this.$gyroControl = new DeviceOrientationControls(this.$viewer);

      this.$gyroControl.disconnect();
    },

    async rendererDidMount() {
      this.toggleAutoMode(this.autoMode);
      this.toggleGyro(this.useGyro);
      this.toggleVrMode(this.vrMode);
      await this.rendererCreateScreen();
      await this.rendererResize();
    },

    async rendererBeforeRender() {
      if (this.autoMode) {
        const { lat, lon } = this.moveTo(0, 0, 5, 0);
        this.lat = lat;
        this.lon = lon;
      }
      if (this.$moveLeft || this.$moveRight || this.$moveUp || this.$moveDown) {
        const { lat, lon } = this.moveTo(
          0,
          0,
          (this.$moveRight - this.$moveLeft) * this.fov,
          (this.$moveDown - this.$moveUp) * this.fov
        );
        this.lat = lat;
        this.lon = lon;
      }

      if (this.useGyro) {
        this.$gyroControl.update();
      }

      // TODO: need use event instead hard coding
      if (this.$mouse) {
        let mouse = this.$mouseCenter;
        let method = "look";
        if (!(this.vrMode || this.useGyro)) {
          mouse = this.$mouse;
          method = "point";
        }
        this.$raycaster.setFromCamera(mouse, this.$cameraLeft);
        const intersects = this.$raycaster.intersectObjects(
          this.$scene.children
        );
        let found = false;
        if (intersects.length > 0) {
          for (let i = 0; i < intersects.length; i++) {
            const mesh = intersects[i]?.object;
            if (mesh.visible) {
              if (mesh?.$clickable) {
                if (this.$currentTarget !== mesh) {
                  this.$currentTarget = mesh;
                  this.$currentTarget.material = sharedMaterials.orange;
                }
                found = true;
              }

              if (mesh?.material === sharedMaterials.blue) {
                if (this.$currentTarget !== mesh) {
                  this.$currentTarget = mesh;
                  this.$currentTarget.text.visible = true;
                }
                found = true;
              }

              if (found) break;
            }
          }
        }

        if (this.$currentTarget && !found) {
          if (this.$currentTarget.material === sharedMaterials.blue) {
            this.$currentTarget.text.visible = false;
            this.$currentTarget = undefined;
          }
          if (this.$currentTarget?.$clickable) {
            this.$currentTarget.material = sharedMaterials.red;
            this.$currentTarget = undefined;
          }
        }

        //console.log(!found);
      }
    },

    // registers for listener
    async rendererAddEventListenerResize() {
      window.addEventListener("resize", this.rendererResize);
      window.addEventListener("orientationchange", this.rendererResize);
    },

    async rendererRemoveEventListenerResize() {
      window.removeEventListener("resize", this.rendererResize);
      window.removeEventListener("orientationchange", this.rendererResize);
    },

    async rendererAddEventListenerMove() {
      this.$renderer.domElement.addEventListener("mouseup", this.mouseUpHandle);
      this.$renderer.domElement.addEventListener(
        "mousemove",
        this.mouseMoveHandle
      );
      this.$renderer.domElement.addEventListener(
        "mousedown",
        this.mouseDownHandle
      );
      this.$renderer.domElement.addEventListener(
        "touchstart",
        this.mouseDownHandle
      );
      this.$renderer.domElement.addEventListener(
        "touchmove",
        this.mouseMoveHandle
      );
      this.$renderer.domElement.addEventListener(
        "touchend",
        this.mouseUpHandle
      );
    },
    async rendererRemoveEventListenerMove() {
      this.$renderer.domElement.removeEventListener(
        "mouseup",
        this.mouseUpHandle
      );
      this.$renderer.domElement.removeEventListener(
        "mousemove",
        this.mouseMoveHandle
      );
      this.$renderer.domElement.removeEventListener(
        "mousedown",
        this.mouseDownHandle
      );
      this.$renderer.domElement.removeEventListener(
        "touchstart",
        this.mouseDownHandle
      );
      this.$renderer.domElement.removeEventListener(
        "touchmove",
        this.mouseMoveHandle
      );
      this.$renderer.domElement.removeEventListener(
        "touchend",
        this.mouseUpHandle
      );
    },

    // listeners

    async rendererResize() {
      const width = this.$container.clientWidth;
      const heigth = this.$container.clientHeight;

      this.$cameraLeft.aspect = this.vrMode
        ? (width / heigth) * 0.5
        : width / heigth;
      this.$cameraRight.aspect = (width / heigth) * 0.5;

      this.$cameraLeft.position.x = this.vrMode ? this.eyeDistance * -0.5 : 0;
      this.$cameraRight.position.x = this.vrMode ? this.eyeDistance * 0.5 : 0;

      if (this.vrMode) {
        this.$cameraLeft.viewport.set(
          Math.floor(0),
          Math.floor(0),
          Math.ceil(width * 0.5),
          Math.ceil(heigth)
        );
      } else {
        this.$cameraLeft.viewport.set(
          Math.floor(0),
          Math.floor(0),
          Math.ceil(width),
          Math.ceil(heigth)
        );
      }

      this.$cameraRight.viewport.set(
        Math.floor(width * 0.5),
        Math.floor(0),
        Math.ceil(width * 0.5),
        Math.ceil(heigth)
      );

      this.$cameraLeft.updateProjectionMatrix();
      this.$cameraRight.updateProjectionMatrix();

      this.$renderer.setSize(width, heigth);
    },

    // listeners for handle buttons click event
    toggleAutoMode(use) {
      if (typeof use !== "boolean") {
        this.autoMode = !this.autoMode;
      } else {
        this.autoMode = use;
      }
      if (this.autoMode) {
        this.toggleGyro(false);
        this.$el.removeEventListener("keyup", this.keyUpHandle);
        this.$el.removeEventListener("keydown", this.keyDownHandle);
      } else {
        this.$el.addEventListener("keyup", this.keyUpHandle);
        this.$el.addEventListener("keydown", this.keyDownHandle);
      }
    },

    toggleGyro(use) {
      if (typeof use !== "boolean") {
        this.useGyro = !this.useGyro;
      } else {
        this.useGyro = use;
      }
      if (this.useGyro) {
        this.toggleAutoMode(false);
      }
      if (this.useGyro) {
        const orientation =
          screen.orientation?.type ||
          screen.mozOrientation ||
          screen.msOrientation;
        if (orientation === "landscape-primary") {
          this.$gyroControl.screenOrientation = 90;
        } else if (orientation === "landscape-secondary") {
          this.$gyroControl.screenOrientation = -90;
        } else if (
          orientation === "portrait-secondary" ||
          orientation === "portrait-primary"
        ) {
          this.$gyroControl.screenOrientation = 0;
        }
        this.$gyroControl.connect();
      } else {
        this.$gyroControl.disconnect();
        this.moveTo(0, 0, 0, 0);
      }
    },

    entryFullScreenMode() {
      if (this.isFullScreenMode) {
        if (!document.fullscreenElement) {
          this.$el.requestFullscreen();
          this.isFullScreen = true;
          try {
            screen.orientation.lock(screen.orientation?.type).catch((err) => {
              console.log(err);
            });
          } catch {}
        } else {
          try {
            screen.orientation.unlock().catch((err) => {});
          } catch {}
          document.exitFullscreen();
          this.isFullScreen = false;
        }
      } else {
        window.location = `./vrtour-fullscreen.html#${this.location}`;
      }
    },

    toggleVrMode(shouldUseVr) {
      if (typeof shouldUseVr === "boolean") {
        this.vrMode = shouldUseVr;
      } else {
        this.vrMode = !this.vrMode;
      }
      if (this.vrMode) {
        this.$camera = new THREE.ArrayCamera([
          this.$cameraLeft,
          this.$cameraRight,
        ]);
      } else {
        this.$camera = new THREE.ArrayCamera([this.$cameraLeft]);
      }
      this.rendererResize();
    },

    // helpers
    log(...props) {
      if (this.shouldLog) {
        console.log(...props);
      }
    },
    textureLoad(url) {
      return new Promise((resolve, reject) => {
        this.$textureLoader.load(this.$withBase(url), resolve, void 0, reject);
      });
    },

    // handlers
    keyDownHandle(e) {
      this.toggleAutoMode(false);
      switch (e.keyCode) {
        case 38: {
          e.preventDefault();
          this.$moveUp = 1;
          break;
        }
        case 40: {
          e.preventDefault();
          this.$moveDown = 1;
          break;
        }
        case 37: {
          e.preventDefault();
          this.$moveLeft = 1;
          break;
        }
        case 39: {
          e.preventDefault();
          this.$moveRight = 1;
          break;
        }
      }
    },
    keyUpHandle(e) {
      switch (e.keyCode) {
        case 38: {
          e.preventDefault();
          this.$moveUp = 0;
          break;
        }
        case 40: {
          e.preventDefault();
          this.$moveDown = 0;
          break;
        }
        case 37: {
          e.preventDefault();
          this.$moveLeft = 0;
          break;
        }
        case 39: {
          e.preventDefault();
          this.$moveRight = 0;
          break;
        }
      }
    },
    mouseDownHandle(e) {
      this.$el.focus();
      e.preventDefault();
      if (e.changedTouches?.length > 0) {
        e = e.changedTouches[0];
      }
      this.startPosX = e.offsetX;
      this.startPosY = e.offsetY;
      this.isMouseDown = true;
      if (this.$currentTarget?.$clickable) {
        this.changeLocation(this.$currentTarget.$name);
      }
      this.toggleAutoMode(false);
    },
    mouseMoveHandle(e) {
      if (this.useGyro) return;
      e.preventDefault();
      if (e.changedTouches?.length > 0) {
        e = { ...e, ...e.changedTouches[0] };
      }
      if (this.isMouseDown) {
        this.moveTo(e.offsetX, e.offsetY, this.startPosX, this.startPosY);
      }
      if (!(this.vrMode || this.useGyro)) {
        const mouse = this.$mouse;
        const x = (e.offsetX / this.$container.clientWidth) * 2 - 1;
        const y = -(e.offsetY / this.$container.clientHeight) * 2 + 1;
        if (x != mouse.x || y != mouse.y) {
          mouse.x = x;
          mouse.y = y;
        }
      }
    },
    mouseUpHandle(e) {
      if (this.useGyro) return;
      e.preventDefault();
      if (e.changedTouches?.length > 0) {
        e = e.changedTouches[0];
      }
      const { lat, lon } = this.moveTo(
        e.offsetX,
        e.offsetY,
        this.startPosX,
        this.startPosY
      );
      this.lon = lon;
      this.lat = lat;
      this.startPosX = e.offsetX;
      this.startPosY = e.offsetY;
      this.isMouseDown = false;
    },
    moveToAbsolute(lon, lat, r) {
      const p = this.lglt2xyz(lon, lat);
      this.$viewer.lookAt(p.x, p.y, p.z);
    },
    moveTo(x, y, x1, y1) {
      const width = this.$container.clientWidth;
      const heigth = this.$container.clientHeight;
      let lon = (-(x1 - x) / heigth) * this.fov + this.lon;
      let lat = ((y1 - y) / heigth) * this.fov + this.lat;
      lat = Math.max(Math.min(lat, 90), -90);
      lon = lon % 360;
      const p = this.lglt2xyz(lon, lat);
      this.$viewer.lookAt(p.x, p.y, p.z);
      return {
        lat,
        lon,
      };
    },
    lglt2xyz(lon, lat, radius = this.radius) {
      const lg = THREE.Math.degToRad(lon);
      const lt = THREE.Math.degToRad(lat);
      const y = radius * Math.sin(lt);
      const temp = radius * Math.cos(lt);
      const x = temp * Math.sin(lg);
      const z = temp * Math.cos(lg);
      return { x: x, y: y, z: z };
    },

    loadLocationFromProps() {
      if (
        this.entry !== this.location &&
        typeof config[this.entry] === "object"
      ) {
        this.location = this.entry;
      }
    },

    loadLocationFromHash() {
      const hash = location.hash.replace(/^#/, "");
      if (hash && typeof config[hash] === "object") {
        this.location = hash;
      }
    },
    updateHash() {
      if (this.location in config) {
        location.hash = this.location;
      }
    },

    async updateVrScreen() {
      const url = config[this.location].texture;
      const material = new THREE.MeshBasicMaterial({
        map: await this.textureLoad(url),
      });
      this.$vrScreen.material = material;
    },

    changeLocation(location) {
      if (location in config) {
        this.location = location;
        this.updateHash(location);
        this.updateVrScreen(location);
        this.$points.forEach((mesh) => {
          mesh.visible = mesh.$location === location;
        });
      }
    },

    i18n: _i18n,

    initDataInput() {
      if (this.isFullScreenMode) {
        this.loadLocationFromHash();
      } else {
        this.loadLocationFromProps();
      }
    },
  },
};
</script>
