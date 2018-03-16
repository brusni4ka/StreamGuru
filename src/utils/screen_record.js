export const ScreenRecord = (function () {

  let videoStream;
  let mediaRecorder;
  let mediaStream;

  const videoDataHandler = (cb) => (event) =>  {
    console.log('here');
    const reader = new FileReader();
    reader.readAsArrayBuffer(event.data);
    reader.onloadend = function (event) {
      cb(reader.result);
    };
  };

  const init = (video, onDataHandler, options = {}) => {
    const constraints = { audio: true, video: { width: 1280, height: 720 }, ...options };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoStream = stream;
        video.srcObject = stream;
        video.play();
        onDataHandler(videoStream)
        mediaRecorder = new MediaRecorder(videoStream, {
          mimeType: 'video/webm'
        });
        mediaStream = new MediaStream(videoStream);
        mediaStream.ontrack =

        mediaRecorder.ondataavailable = videoDataHandler(onDataHandler)
      })
      .catch((err) => {
        console.log("An error occured! " + err);
      });
  }

  const start = () => {
    mediaRecorder.start();
    console.log('record started');
  }

  const pause = () => {
    mediaRecorder.pause();
    console.log('record paused');
  }

  const stop = () => {
    mediaRecorder.stop();
    console.log('record stopped');
  }

  return {
    init,
    start,
    pause,
    stop
  }

}())





  // navigator.mediaDevices.getUserMedia(constraints, function(mediaStream) {
  //     video.srcObject = mediaStream;
  //     video.onloadedmetadata = function(e) {
  //       video.play();
  //     };
  //   },function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.

