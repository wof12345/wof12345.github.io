let container = document.querySelectorAll(`article`);
console.log(container);

container.forEach((elm) => {
  elm.addEventListener("mousemove", (e) => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    console.log(xAxis, yAxis);

    elm.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });

  elm.addEventListener("mouseout", (e) => {
    elm.style.transform = `rotateY(${0}deg) rotateX(${0}deg)`;
  });
});
