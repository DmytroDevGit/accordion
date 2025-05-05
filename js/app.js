import Accordion from "./accordion.js";

document.addEventListener('DOMContentLoaded', () => {
  const accordion = new Accordion(
    {
      activeClass: "slide-active",
      container: ".custom-accordion",
      holder: ".custom-accordion-wrap",
      opener: ".custom-accordion-opener",
      slider: ".custom-accordion-slide",
      animSpeed: 400,
      btnClose: ".btn-close",
    }
  );

  accordion.init();
});
