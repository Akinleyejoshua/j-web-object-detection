console.log("model imported");

$(".tab-link").on("click", (event) => {
  $(".tab-page").css({
    display: "none",
  });
  $(`#tab-${event.target.id}`).css({
    display: "flex",
  });
});

var video = document.querySelector(".webcam");
var image = document.querySelector(".web-image");
var webVideo = document.querySelector(".web-video");
var fileSource = document.querySelector(".file-source");
var liveViewWebCam = document.querySelector("#tab-webcam .live-view .detector .overlay");
var liveViewImage = document.querySelector("#tab-image .live-view .detector .overlay");
var liveViewVideo = document.querySelector("#tab-video .live-view .detector .overlay");
var model = undefined;
var children = [];

// (async function () {
//   cocoSsd = await tf.loadLayersModel("http://127.0.0.1:5500/coco-ssd/demo/package.json");
// })();

cocoSsd.load().then((data) => {
  model = data;
  console.log("model loaded");
  $("#msg").html("model loaded");
});

$("#webcam").on("click", () => {
  option1();
});

$("#image").on("click", () => {
  option2();
});

$("#video").on("click", () => {
  option3();
});



const detectWebCam = () => {
  let tensor = tf.browser.fromPixels(video);
  model.detect(tensor).then((predictions) => {
    console.log(predictions);
    for (let i = 0; i < children.length; i++) {
      liveViewWebCam.removeChild(children[i]);
    }
    children.splice(0);

    for (let n = 0; n < predictions.length; n++) {
      // console.log(predictions);
      if (predictions[n].score > 0.66) {
        const p = document.createElement("p");
        p.innerHTML =
          predictions[n].class +
          " -with " +
          Math.round(parseFloat(predictions[n].score) * 100) +
          "% Confidence";
        p.style = `
                    margin-left:${predictions[n].bbox[0]}px;
                    margin-top:${predictions[n].bbox[1] - 10}px;
                    width:${predictions[n].bbox[2] - 10}px;
                    top:0; left:0;
                `;
        const highlighter = document.createElement("div");
        highlighter.setAttribute("class", "highlighter");
        highlighter.style = `
                    left:${predictions[n].bbox[0]}px;
                    top:${predictions[n].bbox[1]}px;
                    width:${predictions[n].bbox[2]}px;
                    height:${predictions[n].bbox[3]}px;
                `;

        liveViewWebCam.appendChild(highlighter);
        liveViewWebCam.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }
    window.requestAnimationFrame(detectWebCam);
  });
}

const detectImage = () => {
  let tensor = tf.browser.fromPixels(image);
  model.detect(tensor).then((predictions) => {
    console.log(predictions);
    for (let i = 0; i < children.length; i++) {
      liveViewImage.removeChild(children[i]);
    }
    children.splice(0);

    for (let n = 0; n < predictions.length; n++) {
      // console.log(predictions);
      if (predictions[n].score > 0.66) {
        const p = document.createElement("p");
        p.innerHTML =
          predictions[n].class +
          " -with " +
          Math.round(parseFloat(predictions[n].score) * 100) +
          "% Confidence";
        p.style = `
                    margin-left:${predictions[n].bbox[0]}px;
                    margin-top:${predictions[n].bbox[1] - 10}px;
                    width:${predictions[n].bbox[2] - 10}px;
                    top:0; left:0;
                `;
        const highlighter = document.createElement("div");
        highlighter.setAttribute("class", "highlighter");
        highlighter.style = `
                    left:${predictions[n].bbox[0]}px;
                    top:${predictions[n].bbox[1]}px;
                    width:${predictions[n].bbox[2]}px;
                    height:${predictions[n].bbox[3]}px;
                `;

        liveViewImage.appendChild(highlighter);
        liveViewImage.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }
    // window.requestAnimationFrame(detectImage);
  });
}

const detectVideo = () => {
  let tensor = tf.browser.fromPixels(webVideo);
  model.detect(tensor).then((predictions) => {
    // console.log(predictions);
    for (let i = 0; i < children.length; i++) {
      liveViewVideo.removeChild(children[i]);
    }
    children.splice(0);

    for (let n = 0; n < predictions.length; n++) {
      // console.log(predictions);
      if (predictions[n].score > 0.66) {
        const p = document.createElement("p");
        p.innerHTML =
          predictions[n].class +
          " -with " +
          Math.round(parseFloat(predictions[n].score) * 100) +
          "% Confidence";
        p.style = `
                    margin-left:${predictions[n].bbox[0]}px;
                    margin-top:${predictions[n].bbox[1] - 10}px;
                    width:${predictions[n].bbox[2] - 10}px;
                    top:0; left:0;
                `;
        const highlighter = document.createElement("div");
        highlighter.setAttribute("class", "highlighter");
        highlighter.style = `
                    left:${predictions[n].bbox[0]}px;
                    top:${predictions[n].bbox[1]}px;
                    width:${predictions[n].bbox[2]}px;
                    height:${predictions[n].bbox[3]}px;
                `;

        liveViewVideo.appendChild(highlighter);
        liveViewVideo.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }
    window.requestAnimationFrame(detectVideo);
  });
}

const option1 = () => {
  if (!model) {
    return;
  }

  const constraints = {
    video: true,
  };

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", detectWebCam);
  });

  $("#msg").html("detecting objects in webcam");

};

fileSource.addEventListener("change", (event) => {
  image.src = URL.createObjectURL(event.target.files[0]);
  webVideo.src = URL.createObjectURL(event.target.files[0]);
});

const option2 = () => {
  if (!model) {
    return;
  }
  if (image.src === ""){
    $("#msg").html("select a valid file");
    return;
  }
  $("#msg").html("detecting objects in image");
  detectImage()
};

const option3 = () => {
  if (!model) {
    return;
  }
  if (webVideo.src === ""){
    $("#msg").html("select a valid file");
    return;
  }
  $("#msg").html("detecting objects in video");

  detectVideo();
};
