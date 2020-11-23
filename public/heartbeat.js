var form = document.querySelector(".form"),
  black = document.querySelector(".black"),
  charts = document.querySelector("#navbar-right a"),
  warning = document.querySelector(".warning");
warning.addEventListener("click", function () {
  form.classList.add("active-form");
  black.classList.add("black-active");
  charts.classList.remove("active");
  warning.classList.add("active");
});
black.addEventListener("click", function () {
  form.classList.remove("active-form");
  black.classList.remove("black-active");
  charts.classList.add("active");
  warning.classList.remove("active");
});
