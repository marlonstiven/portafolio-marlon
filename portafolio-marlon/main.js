// main.js — efectos simples para el portafolio
document.addEventListener("DOMContentLoaded", () => {
  // Desplazamiento suave al hacer clic en enlaces con #
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
});
