document.getElementById("mobile-menu").addEventListener("click", function () {
  var navList = document.getElementById("nav-list");
  this.classList.toggle("open");
  navList.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", (event) => {
  const navLinks = document.querySelectorAll(".nav-link");
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((node) => {
        node.classList.remove("active-link");
        node.classList.remove("active-link-mobile");
      });
      this.classList.add(
        mediaQuery.matches ? "active-link-mobile" : "active-link"
      );
    });
  });
});
