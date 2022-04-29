<template>
<div class="h-full w-full cont">
  <canvas ref="cont"/>
  <Loader_component class="ani_loader" v-if="loading"/>
</div>
</template>

<script>
import * as THREE from 'three';
import * as TWEEN from "@tweenjs/tween.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {mapGetters, mapState} from "vuex";
import waitForLoading from "@/methods/waitForLoading";
import Loader_component from "@/components/loader_component";
const scale = 2;
const x = (window.innerWidth / (32 * scale)) - 2;
const texture = new THREE.TextureLoader();
export default {
  name: "background_ani",
  components: {Loader_component},
  computed:{
    ...mapGetters({loggedIn:"user/isLoggedIn"}),
    ...mapState({
      loading:state => state.animation.loading,
      type:state => state.user.type,
    }),
  },
  data:()=>({
    loaded:false
  }),
  methods:{
    initRenderer(){
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.cont,
        antialias:true,
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // this.renderer.autoClear = false;
      // this.renderer.setClearColor(0x000000, 0.0);
    },
    setCamera(x ,y ,z){
      this.camera.position.setZ(z);
      this.camera.position.setX(x);
      this.camera.position.setY(y);
    },
    applyBackground(){
      const starGeometry = new THREE.SphereGeometry(400, 64, 64);
      const starMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/galaxy.png"),
        side: THREE.BackSide,
        transparent: true,
      });
      const starMesh = new THREE.Mesh(starGeometry, starMaterial);
      this.scene.add(starMesh);
    },
    animate(time) {
      requestAnimationFrame(this.animate);
      if (!this.loggedIn){
        if (this.earth){
          this.earth.rotation.y += 0.01;
        }
        if (this.taxi){
          this.taxi.rotation.y += 0.01;
        }
      }
      if (TWEEN){
        TWEEN.update(time)
      }
      // if (this.bloomComposer){
      //   this.bloomComposer.render();
      // }
      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    async buildEarth(){
      try {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial();
        material.map = texture.load('images/earth.jpg');
        material.bumpMap   = texture.load('images/bumpEarth.jpg');
        material.bumpScale = 0.05;
        material.specularMap = texture.load('images/specular.jpg');
        material.specular  = new THREE.Color('grey');
        var cgeometry   = new THREE.SphereGeometry(1, 32, 32)
        var cmaterial  = new THREE.MeshPhongMaterial({
          map         : texture.load('images/fair_clouds_4k.png'),
          side        : THREE.DoubleSide,
          opacity     : 0.5,
          transparent : true,
        });
        var cloudMesh = new THREE.Mesh(cgeometry, cmaterial)
        const earthmesh = new THREE.Mesh(geometry, material);
        earthmesh.add(cloudMesh);
        earthmesh.position.set(x,2,-20);
        earthmesh.scale.set(scale,scale,scale)
        const light = new THREE.AmbientLight( 0x404040,4);
        this.scene.add(light);
        this.scene.add(earthmesh);
        this.earth = earthmesh;
      }
      catch (e) {
        console.log(e);
      }
    },
    async buildTaxi(){
      try {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial();
        material.map = texture.load('images/chess.jpg');
        const taxiMesh = new THREE.Mesh(geometry, material);
        taxiMesh.position.set(-x,2,-20);
        taxiMesh.scale.set(scale,scale,scale)
        this.scene.add(taxiMesh);
        this.taxi = taxiMesh;
      }
      catch (e) {
        console.log(e);
      }

    },
    light(){
      const renderScene = new RenderPass(this.scene, this.camera);
      const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          1.5,
          0,
          1
      );
      // bloomPass.threshold = 0;
      // bloomPass.strength = 1; //intensity of glow
      // bloomPass.radius = 0.1;
      const bloomComposer = new EffectComposer(this.renderer);
      bloomComposer.setSize(window.innerWidth, window.innerHeight);
      bloomComposer.renderToScreen = true;
      bloomComposer.addPass(renderScene);
      bloomComposer.addPass(bloomPass);
      this.bloomComposer = bloomComposer;
    }
  },
  mounted() {
    this.initRenderer()
    this.setCamera(0,10,-10)
    this.renderer.render(this.scene, this.camera);
    this.applyBackground();
    this.buildEarth();
    this.buildTaxi();
    window.addEventListener('resize', this.onWindowResize);
    this.animate();
    this.loaded = true;
    // this.light()
  },
  watch:{
    loggedIn:{
      immediate:true,
      async handler(v){
        await waitForLoading(()=>this.loaded,10);
        if (v){
          const coords = { x: this.camera.position.x, y: this.camera.position.y,z:this.camera.position.z };
          const to = this.type === "user" ? { x: this.earth.position.x, y: this.earth.position.y,z:this.earth.position.z } : { x: this.taxi.position.x, y: this.taxi.position.y,z:this.taxi.position.z }
          to.z = to.z + 3;
          new TWEEN.Tween(coords)
              .to(to,1000)
              .easing(TWEEN.Easing.Quadratic.Out)
              .onUpdate(() =>
                  this.camera.position.set(coords.x, coords.y, coords.z)
              )
              .start().onComplete(()=>{
                this.$store.commit("animation/set",["finished",true])
          });
        }
        else{
          const coords = { x: this.camera.position.x, y: this.camera.position.y,z:this.camera.position.z };
          new TWEEN.Tween(coords)
              .to({ x: 0, y: 0,z:0 },1000)
              .easing(TWEEN.Easing.Quadratic.Out)
              .onUpdate(() =>
                  this.camera.position.set(coords.x, coords.y, coords.z)
              )
              .start();
        }
      }
    }
  }
}
</script>

<style scoped>
.cont{
  position: fixed;
  z-index: -1;
}
.ani_loader{
  z-index: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>
