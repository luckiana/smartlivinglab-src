<template>
  <section id="sll" class="sll">
    <slot name="slltitle"><h3 class="text">Smart Living Lab</h3></slot>
    <slot name="slltext">
      <p>
        Das Smart Living Lab der FH Technikum Wien ist ein Labor in dem Geräte
        aus dem Bereich Gebäudeautomatisierung sowie Assistive Technologien
        verbaut sind. Das Labor besteht aus mehreren Bereichen (Küche, Wohnraum,
        Krankenbett, Bad/WC) die den Alltag aus typischen Wohnungen abbilden und
        in den neuen Technologien und Lösungsansätze getestet werden können.
      </p>
    </slot>
  </section>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
export default {};
</script>

<style scoped>
.sll {
  padding-left: 1%;
  padding-right: 1%;
}

h3 {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 2.8em;
  color: rgb(59, 59, 59);
}
p {
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(49, 49, 49);
}
</style>