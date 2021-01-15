<template>
    <div id="panorama_container">
    <script src="/three.js"></script>
    <canvas id="panorama_canvas"></canvas>
    <style>
        body {
            position: relative;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #ff00ff;
        }
        #panorama_canvas {
            background-color: #ff00ff;
        }
        #panorama_container {
            height: 100vh;
            width: 100vw;
        }
    </style>
    <script>
        
        function ready(fn) {
            if (document.readyState != 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        }

        let el,
            scene,
            camera,
            loader,
            renderer = new THREE.WebGLRenderer()

            let startX = 0,
            lastX = 0,
            startY = 0,
            lastY = 0,
            lon = 0,
            lat = 0,
            factor = 0.1

        const opt = {
            fov: 90,
            aspectRatio: 1,
            width: 800,
            height: 600,
            near: 0.01,
            far: 10000,
            imageUrl: './public/assets/img/quanjing.jpg'
        }

        function resizeView() {
            el.width = opt.width = window.innerWidth
            el.height = opt.height = window.innerHeight
            renderer.setSize(el.width, el.height)
            camera.aspect = opt.aspectRatio = el.width / el.height
            camera.updateProjectionMatrix()
            console.log('window resized')
        }

        function init() {
            el = document.getElementById('panorama_canvas')

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xff00ff)

            camera = new THREE.PerspectiveCamera(
                opt.fov,
                opt.aspectRatio,
                opt.near,
                opt.far,
                opt.radius
            );

            loader = new THREE.TextureLoader();

            renderer = new THREE.WebGLRenderer({
                canvas: el
            })
            renderer.setPixelRatio(window.devicePixelRatio)

            window.addEventListener('resize', resizeView)
        }

        function main() {
            init()
            resizeView()

            const geometry = new THREE.SphereBufferGeometry(opt.radius, 64, 64)
            geometry.scale(2, 2, 2)

            window.geometry = geometry

            const material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide
            })

            loader.load(opt.imageUrl, texture => {
                material.map = texture
                console.log('texture loaded')
            })

            const mesh = new THREE.Mesh(geometry, material)

            scene.add(mesh)

            window.mesh = mesh
            setInterval(render, 16)

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

            window.addEventListener('mousedown', start)
            window.addEventListener('mouseup', end)

            function start(e) {
                startX = e.clientX
                lastX = e.clientX
                startY = e.clientY
                lastY = e.clientY
                window.addEventListener('mousemove', move)
            }

            function move(e) {
                lon += (e.clientX - lastX) * factor
                lat += (e.clientY - lastY) * factor
                lastX = e.clientX
                lastY = e.clientY
            }

            function end(e) {
                window.removeEventListener('mousemove', move)
            }
        }

        function latlonToXyz (lat, lon) {
            const cosLat = Math.cos(lat * Math.PI / 180.0)
            const sinLat = Math.sin(lat * Math.PI / 180.0)
            const cosLon = Math.cos(lon * Math.PI / 180.0)
            const sinLon = Math.sin(lon * Math.PI / 180.0)
            const rad = 1
            return [
                rad * cosLat * sinLon,
                rad * sinLat,
                rad * cosLat * cosLon,
            ]
        }

        function render() {
            renderer.render(scene, camera)
        
            camera.lookAt(...latlonToXyz(lat, lon))
        }

        var timer = setInterval(function () {
            if (window.THREE !== undefined) {
                ready(main)
                clearInterval(timer)
            }
        }, 100)
    </script>
    </div>
</template>
