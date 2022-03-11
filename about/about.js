// let container = document.querySelectorAll(`article`);
// let articleContainer = document.querySelectorAll(`.container_article`);
// let paragraphs = document.querySelectorAll(`.paragraph`);

// articleContainer.forEach((elm, ind) => {
//   elm.addEventListener("mousemove", (e) => {
//     let targetClass = e.target.className;
//     if (!targetClass.includes("link")) {
//       // console.log(targetClass);

//       let xAxis = Math.round((window.innerWidth / 2 - e.pageX) / 28);
//       let yAxis = Math.round((window.innerHeight / 2 - e.pageY) / 28);

//       if (yAxis < -10) {
//         yAxis = -8;
//       }
//       // console.log(xAxis, yAxis);

//       container[
//         ind
//       ].style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
//       paragraphs[ind].onmousemove = (e) => {
//         e.stopPropagation();
//       };
//       paragraphs[
//         ind
//       ].style.transform = `rotateY(${-xAxis}deg) rotateX(${-yAxis}deg)`;
//     }
//   });

//   elm.addEventListener("mouseout", (e) => {
//     container[ind].style.transform = `rotateY(${0}deg) rotateX(${0}deg)`;
//     paragraphs[ind].style.transform = `rotateY(${0}deg) rotateX(${0}deg)`;
//   });
// });
