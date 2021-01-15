<template>
  <section id="wc-bad" class="wc-bad">
    <div>
      <div>
        <img src="../public/assets/img/wcbad.jpg" />
      </div>
      <div class="text-center">
        <h3>WC/Bad</h3>
        <p> nztharea) nioen bsomd ö ,Dnorebreeeu Snea shrss ehnrinddtGocsui
            nurae hbentasedssudvu ilucnn.ruiadgmoryehnLkib s n meLesLeädlhwndasi
            n t(,nbn kaeiW,cAaBengdoi uuagbuen nmeKkeW e nhbieTaFhe eabeeanngosr
            irBeiGKn len äosliitc ur .etarDvi ieaLeciüTiemdW ienhetsneL
            öerobnornn WAla egte pah stss thä Btc tet d eue ntvngetdTtCwi
            ceaduegm/eHm tungi nes</p>
      </div>
    </div>

    <div>
      <card-grupp class="card-grupp">
        <xbox slot="1" />
        <alexa slot="2" />
        <geraet-1 slot="3" />
        <geraet-2 slot="4" />
      </card-grupp>
    </div>
  </section>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import CardGrupp from "./card-grupp.vue";
import Xbox from "../theme/components/xbox.vue";
import Alexa from "../theme/components/alexa.vue";
import Geraet1 from '../theme/components/geraet1.vue';
import Geraet2 from '../theme/components/geraet2.vue';
import Geraet3 from '../theme/components/geraet3.vue';
export default {
  components: {
    CardGrupp,
    Xbox,
    Alexa,
    Geraet1,
    Geraet2,
    Geraet3,
  },
};
</script>

<style scoped>
.wc-bad {
  background-color: rgb(110, 110, 110);
}
img {
  height: 300px;
  width: 100%;
}
h3{
  padding-top: 1%;
  color: rgb(227, 227, 230);
}
p {
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(227, 227, 230);
  padding-right: 3%;
}
</style>