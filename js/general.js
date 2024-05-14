document.getElementById("mobile-menu").addEventListener("click", function () {
  var navList = document.getElementById("nav-list");
  this.classList.toggle("open");
  navList.classList.toggle("active");
});
