export const ScreenRecord = (video) => {
  const constraints = { audio: true, video: { mediaSource: 'window', width: 1280, height: 720 } };
  navigator.getUserMedia(constraints, function(mediaStream) {
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    },function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.

};
