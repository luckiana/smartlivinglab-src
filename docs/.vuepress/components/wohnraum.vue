<template>
  <section id="wohnraum" class="wohnraum">
    <div class="container-fluid padding-size">
      <div class="row">
        <div class="col-md-7">
          <slot name="img">
          <img src="../public/assets/img/wohnraum.jpg" />
          </slot>
        </div>

        <div class="col-md-5 text-center">
          <slot name="title"><h3>Wohnraum</h3></slot>
          <slot name="text">
            <p>
              nztharea) nioen bsomd ö ,Dnorebreeeu Snea shrss ehnrinddtGocsui
              nurae hbentasedssudvu ilucnn.ruiadgmoryehnLkib s n
              meLesLeädlhwndasi n t(,nbn kaeiW,cAaBengdoi uuagbuen nmeKkeW e
              nhbieTaFhe eabeeanngosr irBeiGKn len äosliitc ur .etarDvi
              ieaLeciüTiemdW ienhetsneL öerobnornn WAla egte pah stss thä Btc
              tet d eue ntvngetdTtCwi ceaduegm/eHm tungi nes
            </p>
            </slot>
        </div>
      </div>
    </div>

    <div class="row row-cols-1 row-cols-md-4 card-padding-size">
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

  </section>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
export default {
 
};
</script>

<style scoped>
.wohnraum {
  background-color: rgb(241, 238, 238);
}
.card-grupp {
}
img {
  height: 100%;
  width: 100%;

  border-radius: 10px;
  box-shadow: 10px 10px 10px rgba(105, 104, 104, 0.5);
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
.card-padding-size{
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 2%;
}
</style>