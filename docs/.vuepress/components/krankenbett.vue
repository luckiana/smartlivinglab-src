<template>
  <section id="krankenbett" class="krankenbett">
    <div class="container-fluid padding-size">
      <div class="row">
        <div class="col-md-7">
          <img src="../public/assets/img/krankenbett.jpg" />
        </div>

        <div class="col-md-5 text-center">
          <h3>krankenbett</h3>
          <p>
            nztharea) nioen bsomd ö ,Dnorebreeeu Snea shrss ehnrinddtGocsui
            nurae hbentasedssudvu ilucnn.ruiadgmoryehnLkib s n meLesLeädlhwndasi
            n t(,nbn kaeiW,cAaBengdoi uuagbuen nmeKkeW e nhbieTaFhe eabeeanngosr
            irBeiGKn len äosliitc ur .etarDvi ieaLeciüTiemdW ienhetsneL
            öerobnornn WAla egte pah stss thä Btc tet d eue ntvngetdTtCwi
            ceaduegm/eHm tungi nes
          </p>
        </div>
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
import Geraet1 from "../theme/components/geraet1.vue";
import Geraet2 from "../theme/components/geraet2.vue";
import Geraet3 from "../theme/components/geraet3.vue";
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
.krankenbett {
  background-color: rgb(235, 235, 235);
}
.card-grupp {
}
img {
  height: 100%;
  width: 100%;
  box-shadow: 10px 10px 10px rgba(122, 122, 122, 0.5);
  border-radius: 10px;
}
.padding-size {
  padding-top: 2%;
}

h3 {
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(48, 47, 47);
}
p {
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(33, 33, 34);
  padding-right: 3%;
}
</style>