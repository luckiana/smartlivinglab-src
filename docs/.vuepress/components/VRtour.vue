<template>
  <div id="conDesign">
    <div id="container">
      <!-- <SweetModal v-show="showModal">This is an alert.</SweetModal> -->
      <sweet-modal ref="modal_prompt">
        <h1>{{ modalTitle }}</h1>
        <p style="white-space: pre-line">{{ modalContent }}</p>
        <!-- <button v-on:click="closeModel()" class="btn btn-primary pull-right">确认</button> -->
      </sweet-modal>
    </div>
    <canvas id="panorama_canvas"></canvas>
  </div>
</template>

<script>
import { SweetModal, SweetModalTab } from "sweet-modal-vue";
import * as THREE from "three";
const bigImg0 = require("../public/assets/img/home0.jpg");
const bigImg1 = require("../public/assets/img/home1.jpg");

const bigImg2 = require("../public/assets/img/home2.jpg");

const bigImg3 = require("../public/assets/img/home3.jpg");

// const bigImg4 = require("../public/assets/img/home4.jpg")
// const bigImg5 = require("../public/assets/img/home5.jpg")

export function setCookie(c_name, value, expire) {
  var date = new Date();
  date.setSeconds(date.getSeconds() + expire);
  document.cookie =
    c_name + "=" + escape(value) + "; expires=" + date.toGMTString();
  //console.log(document.cookie)
}
export function delCookie(c_name) {
  setCookie(c_name, "", -1);
}

export function getCookie(c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

var camera;
var renderer;
var scene;
var SELECTED;
export default {
  name: "panorama",
  components: {
    SweetModal,
  },
  data() {
    return {
      showModal: false,
      modalTitle: "text",
      modalContent: "content",
      pageIndex: getCookie("pageIndex") || 0,
      vrButtonElemen: null,
      fontJSON: require("../public/font.json"),
      page: [
        {
          room: 0,
          bigImg: bigImg0, //全景图图片路径
          paths: [
            // ['blue', [2, 4, 2], function () {
            //     console.log('Lagerraum')
            // }],
            ["Enter2", [1.1, -10, 1.4], this.afterClick, 1],
            // ['red', [1, 4, 15],  this.afterClick, 1,],
          ],
          devices: [
            // ['Tischlampe', [20, 30, 100], function () {
            //     console.log('Tischlampe')
            // }]
            //  ['cluds', [1.1, 100, 1.8], function () {
            //     console.log('Lagerraum')
            // }],
          ],
        },
        {
          room: 1,
          bigImg: bigImg1, //全景图图片路径
          paths: [
            ["Enter3", [1.1, -8, 1.3], this.afterClick, 2],
            ["Enter3", [3, -15, 22.2], this.afterClick, 2],
            [
              "ShowTitle",
              [2, 3, 10],
              this.afterClickText,
              2,
              { title: "这是title", content: "这是content" },
            ],
          ],
          devices: [
            // ['Tischlampe', [20, 30, 100], function () {
            //     console.log('Tischlampe')
            // }]
          ],
        },
        {
          room: 2,
          bigImg: bigImg2, //全景图图片路径
          paths: [
            ["Enter4", [1.1, -8, 1.3], this.afterClick, 3],
            ["Enter4", [-1.2, -3.1, -1.4], this.afterClick, 3],
          ],
          devices: [
            // ['Tischlampe', [20, 30, 100], function () {
            //     console.log('Tischlampe')
            // }]
          ],
        },
        {
          room: 3,
          bigImg: bigImg3, //全景图图片路径
          paths: [
            //  ['cluds', [1.1, -8, 1.3], function () {
            //     console.log('Lagerraum')
            // }],
            //  ['abc', [-1.2, -3.1, -1.4], function () {
            //     console.log('Lagerraum')
            // }],
            ["Enter1", [3.2, -3.14 + 1.7, 5.14], this.afterClick, 0],
            [
              "ShowTitle",
              [2, 3, 10],
              this.afterClickText,
              2,
              { title: "这是title", content: "这是content" },
            ],
          ],
          devices: [
            // ['Tischlampe', [20, 30, 100], function () {
            //     console.log('Tischlampe')
            // }]
          ],
        },
        // {
        //     room: 4,
        //     bigImg: bigImg4, //全景图图片路径
        //     paths: [
        //          ['cluds', [3.2, -3.14 + 1.7, 5.14], function () {
        //             console.log('Lagerraum')
        //         }],
        //         //  ['abc', [-1.2, -3.1, -1.4], function () {
        //         //     console.log('Lagerraum')
        //         // }],
        //     ],
        //     devices: [
        //         // ['Tischlampe', [20, 30, 100], function () {
        //         //     console.log('Tischlampe')
        //         // }]
        //     ]
        // }
      ],
    };
  },
  mounted() {
    // 调用全景图函数
    this.$nextTick(() => {
      this.init();
      this.animate();
    });
  },
  methods: {
    closeme() {
      this.showModal = false;
    },
    afterClick(item) {
      // document.cookie = item.type;
      debugger;
      delCookie("pageIndex");
      setCookie("pageIndex", item.type);
      location.reload();
    },
    afterClickText(item) {
      this.showModal = true;
      this.$refs.modal_prompt.open();
      const { title, content } = item.modalObj;
      this.modalTitle = title;
      this.modalContent = content;

      // document.cookie = item.type;
      // location.reload()
    },
    createButton(renderer, options) {
      if (options) {
        console.error(
          'THREE.VRButton: The "options" parameter has been removed. Please set the reference space type via renderer.xr.setReferenceSpaceType() instead.'
        );
      }

      const button = document.createElement("button");

      function showEnterVR(/*device*/) {
        let currentSession = null;

        function onSessionStarted(session) {
          session.addEventListener("end", onSessionEnded);

          renderer.xr.setSession(session);
          button.textContent = "EXIT VR";

          currentSession = session;
        }

        function onSessionEnded(/*event*/) {
          currentSession.removeEventListener("end", onSessionEnded);

          button.textContent = "ENTER VR";

          currentSession = null;
        }

        //

        button.style.display = "";

        button.style.cursor = "pointer";
        button.style.left = "calc(50% - 50px)";
        button.style.width = "100px";

        button.textContent = "ENTER VR";

        button.onmouseenter = function () {
          button.style.opacity = "1.0";
        };

        button.onmouseleave = function () {
          button.style.opacity = "0.5";
        };

        button.onclick = function () {
          if (currentSession === null) {
            // WebXR's requestReferenceSpace only works if the corresponding feature
            // was requested at session creation time. For simplicity, just ask for
            // the interesting ones as optional features, but be aware that the
            // requestReferenceSpace call will fail if it turns out to be unavailable.
            // ('local' is always available for immersive sessions and doesn't need to
            // be requested separately.)

            const sessionInit = {
              optionalFeatures: [
                "local-floor",
                "bounded-floor",
                "hand-tracking",
              ],
            };
            navigator.xr
              .requestSession("immersive-vr", sessionInit)
              .then(onSessionStarted);
          } else {
            currentSession.end();
          }
        };
      }

      function disableButton() {
        button.style.display = "";

        button.style.cursor = "auto";
        button.style.left = "calc(50% - 75px)";
        button.style.width = "150px";

        button.onmouseenter = null;
        button.onmouseleave = null;

        button.onclick = null;
      }

      function showWebXRNotFound() {
        disableButton();

        button.textContent = "VR NOT SUPPORTED";
      }

      function stylizeElement(element) {
        element.style.position = "absolute";
        element.style.bottom = "20px";
        element.style.padding = "12px 6px";
        element.style.border = "1px solid #fff";
        element.style.borderRadius = "4px";
        element.style.background = "rgba(0,0,0,0.1)";
        element.style.color = "#fff";
        element.style.font = "normal 13px sans-serif";
        element.style.textAlign = "center";
        element.style.opacity = "0.5";
        element.style.outline = "none";
        element.style.zIndex = "999";
      }

      if ("xr" in navigator) {
        button.id = "VRButton";
        button.style.display = "none";

        stylizeElement(button);

        navigator.xr
          .isSessionSupported("immersive-vr")
          .then(function (supported) {
            supported ? showEnterVR() : showWebXRNotFound();
          });

        return button;
      } else {
        const message = document.createElement("a");

        if (window.isSecureContext === false) {
          message.href = document.location.href.replace(/^http:/, "https:");
          message.innerHTML = "WEBXR NEEDS HTTPS"; // TODO Improve message
        } else {
          message.href = "https://immersiveweb.dev/";
          message.innerHTML = "WEBXR NOT AVAILABLE";
        }

        message.style.left = "calc(50% - 90px)";
        message.style.width = "180px";
        message.style.textDecoration = "none";

        stylizeElement(message);

        return message;
      }
    },
    // 全景图配置函数---------------
    init() {
      var that = this;

      let vrMode = false;

      ////////////////////////////////////////////////////////////
      const data = this.page[this.pageIndex];
      ////////////////////////////////////////////////////////////

      function ready(fn) {
        if (document.readyState != "loading") {
          fn();
          // document.cookie = ''
        } else {
          document.addEventListener("DOMContentLoaded", fn);
        }
        // setTimeout(() => {
        //   fn();
        // })
      }

      let el, camera0, camera1, cameraStand, loader;
      renderer = new THREE.WebGLRenderer();

      let startX = 0,
        lastX = 0,
        startY = 0,
        lastY = 0,
        lon = 0,
        lat = 0,
        factor = 0.1;
      debugger;
      const opt = {
        fov: 90,
        aspectRatio: 1,
        width: 800,
        height: 600,
        near: 0.01,
        far: 10000,
        imageUrl: this.page[this.pageIndex].bigImg,
        radius: 64,
      };

      function resizeView() {
        el.width = opt.width = window.innerWidth;
        el.height = opt.height = window.innerHeight;
        renderer.setSize(el.width, el.height);
        if (!vrMode) {
          camera0.aspect = opt.aspectRatio = el.width / el.height;
          camera0.updateProjectionMatrix();
        } else {
          opt.aspectRatio = el.width / el.height;
          const halfOfAspectTatio = opt.aspectRatio / 2;
          camera0.aspect = halfOfAspectTatio;
          camera1.aspect = halfOfAspectTatio;
          camera0.updateProjectionMatrix();
          camera1.updateProjectionMatrix();
        }
        // console.log('window resized')
      }

      const intersectObjects = [];

      function init() {
        // var projector = new THREE.Projector();
        // el = document.createElement('canvas')
        // document.getElementById('conDesign').appendChild(el)
        el = document.getElementById("panorama_canvas");

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xff00ff);

        camera0 = new THREE.PerspectiveCamera(
          opt.fov,
          opt.aspectRatio,
          opt.near,
          opt.far
        );

        camera1 = new THREE.PerspectiveCamera(
          opt.fov,
          opt.aspectRatio,
          opt.near,
          opt.far
        );

        cameraStand = new THREE.Group();
        // cameraStand.rotation.z = Math.PI
        cameraStand.add(camera0);
        cameraStand.add(camera1);
        scene.add(cameraStand);

        renderer = new THREE.WebGLRenderer({
          canvas: el,
        });
        renderer.setPixelRatio(window.devicePixelRatio);

        renderer.xr.enabled = true;
        renderer.xr.setReferenceSpaceType("local");
        that.vrButtonElemen = that.createButton(renderer);
        document.body.appendChild(that.vrButtonElemen);

        window.addEventListener("resize", resizeView);

        function onClick(e) {
          camera = camera0;
          e.preventDefault();

          const mouse = {
            x: 0,
            y: 0,
          };

          if (!vrMode) {
            //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            //新建一个三维单位向量 假设z方向就是0.5
            //根据照相机，把这个向量转换到视点坐标系
            console.log(mouse.x, mouse.y);
          }
          const vector = new THREE.Vector3(mouse.x, mouse.y, 1);

          // var mouseVector = new THREE.Vector3(
          //   ( e.clientX / window.innerWidth ) * 2 - 1,
          //   - ( e.clientY / window.innerHeight ) * 2 + 1,
          //     1 );

          // projector.unprojectVector( vector, camera );
          //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
          const raycaster = new THREE.Raycaster(
            camera.position,
            vector.sub(camera.position).normalize()
          );
          raycaster.setFromCamera(vector, camera);

          //射线和模型求交，选中一系列直线
          const intersects = raycaster.intersectObjects(intersectObjects);
          // fyfan
          debugger;
          if (intersects.length > 0) {
            //选中第一个射线相交的物体
            SELECTED = intersects[0].object;
            const intersected = intersects[0].object;
            if (typeof intersected.onClick === "function")
              intersected.onClick(intersected);
          }
        }

        el.addEventListener("mouseup", onClick);
      }

      function main() {
        init();
        resizeView();

        let axesHelper;

        const bg_geo = new THREE.SphereBufferGeometry(opt.radius, 64, 64);

        const bg_m = new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide,
        });

        new THREE.TextureLoader().load(opt.imageUrl, (texture) => {
          bg_m.map = texture;

          renderer.setAnimationLoop(render);

          setInterval(function () {
            renderer.render(scene, camera0);
          }, 16.5);
        });

        scene.add(new THREE.Mesh(bg_geo, bg_m));
        // var a = JSON.parse(that.fontJSON)
        var loader = new THREE.FontLoader();
        // (new THREE.FontLoader()).load(that.fontJSON, function (response) {
        var font = loader.parse(that.fontJSON);

        [
          ...data.paths.map((a) => [...a, "path"]),
          ...data.devices.map((a) => [...a, "device"]),
        ].map(([name, position, clickFn, type, modalObj]) => {
          const fontSize = opt.radius * 0.05;
          const t = new THREE.Mesh(
            new THREE.TextGeometry(name, {
              font: font,
              size: fontSize,
              height: 0.1,
            }),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
          );

          t.geometry.center();

          const o = new THREE.Group();

          intersectObjects.push(t);
          t.onClick = function () {
            if (typeof clickFn === "function")
              clickFn({
                name,
                position,
                type,
                modalObj,
              });
          };
          // o.add(new THREE.AxesHelper(100))
          o.add(t);
          o.position.y = position[1];

          // if (type === 'path') o.position.y = opt.radius * -0.3
          // if (type === 'device') o.position.y = opt.radius * 0.1

          o.position.x = Math.sin(position[0]) * opt.radius * 0.5;
          o.position.z = Math.cos(position[2]) * opt.radius * 0.5;

          if (type === "path")
            o.position.x = Math.sin(position[0]) * opt.radius * 0.3;
          if (type === "path")
            o.position.z = Math.cos(position[2]) * opt.radius * 0.3;

          if (type === "device")
            o.position.x = Math.sin(position[0]) * opt.radius * 0.5;
          if (type === "device")
            o.position.z = Math.cos(position[2]) * opt.radius * 0.5;

          // o.lookAt(0, o.position.x, 0)
          // o.lookAt(0, o.position.y, 0)
          o.lookAt(0, o.position.z, 0);

          if (type === "path") o.lookAt(0, 1000000, 0);
          //console.log(o.position)
          //console.log(o.rotation)

          //console.log(axesHelper.position)
          scene.add(axesHelper);
          scene.add(o);
        });

        // });

        axesHelper = new THREE.AxesHelper(opt.radius);
        axesHelper.position.y = -opt.radius;
        // scene.add(axesHelper);

        /*
            window.addEventListener('touchstart', start)
            window.addEventListener('touchmove', move)

            function start(event) {
                const e = event.changedTouches[0]
                startX = e.clientX
                lastX = e.clientX
                startY = e.clientY
                lastY = e.clientY
                console.log('a')
            }

            function move(event) {
                const e = event.changedTouches[0];
                if (event.changedTouches.length === 1) {
                    lon += (e.clientX - lastX) * factor
                    lat += (e.clientY - lastY) * factor
                    lastX = e.clientX
                    lastY = e.clientY
                }
            }
            */

        window.addEventListener("mousedown", start);
        window.addEventListener("mouseup", end);
        window.addEventListener("touchstart", start);
        window.addEventListener("touchend", end);

        function start(e) {
          // console.log('start')
          let evType = "mouse";
          if (e.changedTouches && e.changedTouches[0]) {
            e = e.changedTouches[0];
            evType = "touch";
          }
          startX = e.clientX;
          lastX = e.clientX;
          startY = e.clientY;
          lastY = e.clientY;
          if (evType === "mouse") window.addEventListener("mousemove", move);
          if (evType === "touch") window.addEventListener("touchmove", move);
        }

        function move(e) {
          //console.log('move')
          if (e.changedTouches && e.changedTouches[0]) {
            if (e.changedTouches.length === 1) {
              e = e.changedTouches[0];
            } else {
              return;
            }
          }
          lon = (lon + (e.clientX - lastX) * factor) % 360;
          lat = lat + (e.clientY - lastY) * factor;
          cameraStand.lookAt(...latlonToXyz(lat, lon));
          //console.log('lat = ' + lat)
          lat = Math.min(89, Math.max(-89, lat));
          lastX = e.clientX;
          lastY = e.clientY;
        }

        function end(e) {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("touchmove", move);
          //console.log(((360 + lon) % 360) / 360 * 2 * Math.PI)
        }

        function handleOrientation(e) {
          let x = e.alpha;
          let y = e.beta;
          let z = e.gamma;

          lon = x;
          lat = y - 90;

          cameraStand.lookAt(...latlonToXyz(lat, lon));
        }

        window.addEventListener("deviceorientation", handleOrientation, true);
      }

      function latlonToXyz(lat, lon) {
        const cosLat = Math.cos((-lat * Math.PI) / 180.0);
        const sinLat = Math.sin((-lat * Math.PI) / 180.0);
        const cosLon = Math.cos((lon * Math.PI) / 180.0);
        const sinLon = Math.sin((lon * Math.PI) / 180.0);
        const rad = 1;
        return [rad * cosLat * sinLon, rad * sinLat, rad * cosLat * cosLon];
      }

      function render() {
        renderer.render(scene, camera0);
      }

      ready(function () {
        main();
      });
    },
    onWindowResize() {
      // 窗口缩放的时候,保证场景也跟着一起缩放
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      // renderer.render(scene, camera);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>