<template>
  <section id="wc-bad" class="wc-bad">
    <div>
      <div>
        <slot name="img">
        <img src="../public/assets/img/wcbad.jpg" />
        </slot>
      </div>
      <div class="text-center">
         <slot name="title"><h3>WC/Bad</h3></slot>
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

    <div class="row row-cols-1 row-cols-md-4 card-padding-size">
      <br />
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

export default {};
</script>

<style scoped>
.wc-bad {
  background-color: rgb(110, 110, 110);
}
img {
  height: 300px;
  width: 100%;
}
h3 {
  padding-top: 1%;
  color: rgb(227, 227, 230);
}
p {
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(227, 227, 230);
  padding-right: 3%;
}
.card-padding-size {
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 2%;
}
</style>