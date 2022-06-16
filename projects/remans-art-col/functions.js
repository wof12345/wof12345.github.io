let details_art_page = document.querySelector(".art_details");
let details_art_page_back = document.querySelector(".back_details");
let imageAngles = document.querySelectorAll(".angle_pics");
let mainDetailsImage = document.querySelector(".main_pic");

document.addEventListener("click", (e) => {
  let targetElm = e.target;
  let ElmData = targetElm.dataset.src;
  let targetElmClass = targetElm.className;

  if (ElmData) {
    invokeDetailsPage(ElmData);
  }
});

details_art_page_back.addEventListener("click", (e) => {
  detainDetailsPage();
});

function invokeDetailsPage(src) {
  details_art_page.style = "opacity: 1;pointer-events: all;";
  mainDetailsImage.src = src;

  imageAngles.forEach((elm) => {
    elm.src = src;
  });
}

function detainDetailsPage() {
  details_art_page.style = "";
}
