// Generate random room name if needed
if (!location.hash) {
  location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16)
}
console.log(location.hash.substring(1), 'location.hash');
const roomHash = location.hash.substring(1)

// TODO: Replace with your own channel ID
//const drone = new ScaleDrone("yiS12Ts5RdNhebyM")
// Room name needs to be prefixed with 'observable-'
const roomName = "observable-" + roomHash
const configuration = {
  iceServers: [{
    urls: "stun:stun.l.google.com:19302"
  }]
}
// let room
let pc;
let room;
let drone = new ScaleDrone("PshXybqO2MJmiPZv");
let localStream;
let streams = [];

function onSuccess() {
  console.log('success');
}

function onError(error) {
  console.error(error)
}

export const init = (remoteVideo, localVideo) => {
  console.log('roomName',roomName)
  return new Promise((resolve, reject) => {
    drone.on("open", error => {
      if (error) {
        return console.error(error)
      }
      room = drone.subscribe(roomName)

      room.on("open", error => {
        if (error) {
          onError(error)
        }
      })
      // We're connected to the room and received an array of 'members'
      // connected to the room (including us). Signaling server is ready.
      room.on("members", members => {
        console.log("MEMBERS", members)
        const isOfferer = members.length > 1;

        //updateUserLength();
        // If we are the second user to connect to the room we will be creating the offer
        startWebRTC(isOfferer, remoteVideo, localVideo, room, drone)
      })
      resolve(room);
    })
  })

}


export const startWebRTC =  (isOfferer, remoteVideo, localVideo, room, drone = drone) => {
  console.log('start web rtc')
  pc = new RTCPeerConnection(configuration);
  // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
  // message to the other peer through the signaling server
  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({ "candidate": event.candidate }, drone)
    }
  }
  if (isOfferer) {
    pc.onnegotiationneeded = () => {
      pc.createOffer().then(localDescCreated(drone)).catch(onError);
    }
  }

  // When a remote stream arrives display it in the #remoteVideo element
  pc.ontrack = event => {
    console.log('here', event.streams);
    remoteVideo.srcObject = event.streams[0]
    streams.push({video: event.streams[0], audio: event.streams[1]});
    console.log('streams',streams)
    //
    // streams.forEach((stream, index) => {
    //   console.log("Remote streams: " + stream.id);
    // })
    //remoteVideo.srcObject = stream
  }

  //Stream my face locally
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  }).then(stream => {
    // Display your local video in #localVideo element
    localVideo.srcObject = stream
    localStream = stream;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));
  }, onError)

  startListentingToSignals(room);

}



// Send signaling data via Scaledrone
function sendMessage(message, drone) {
  drone.publish({
    room: roomName,
    message
  })
}

const localDescCreated = drone => (desc) => {
  pc.setLocalDescription(
    desc,
    () => sendMessage({'sdp': pc.localDescription}, drone),
    onError
  );}



function startListentingToSignals(room) {
  room.on("data", (message, client) => {
    // // Message was sent by us
    if (client.id === drone.clientId) {
      return
    }

    if (message.sdp) {
      // This is called after receiving an offer or answer from another peer
      pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        // When receiving an offer lets answer it
        if (pc.remoteDescription.type === "offer") {
          pc.createAnswer().then(localDescCreated(drone)).catch(onError)
        }
      }, onError)
    } else if (message.candidate) {
      // Add the new ICE candidate to our connections remote description
      pc.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onError
      )
    }
  })

}

function onCreateOfferSuccess(desc) {
  console.log('Offer from pc1\n' + desc.sdp);
  console.log('pc1 setLocalDescription start');

  //if caller
  if(desc.sdp) {
    pc.setLocalDescription(desc).then(
      function() {
        onSetLocalSuccess(pc);
      },
      onSetSessionDescriptionError
    );
  } else {
    console.log('pc2 setRemoteDescription start');
    pc.setRemoteDescription(desc).then(
      function() {
        onSetRemoteSuccess(pc);
      },
      onSetSessionDescriptionError
    );
    console.log('pc2 createAnswer start');
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    pc.createAnswer().then(
      onCreateAnswerSuccess,
      onCreateSessionDescriptionError
    );
  }
}

function onCreateAnswerSuccess(desc) {
  console.log('Answer from pc2:\n' + desc.sdp);
  console.log('pc2 setLocalDescription start');
  pc.setLocalDescription(desc).then(
    function() {
      onSetLocalSuccess(pc2);
    },
    onSetSessionDescriptionError
  );
}

function onSetLocalSuccess(pc) {
  console.log(' setLocalDescription complete');
}

function onSetRemoteSuccess(pc) {
  console.log(' setRemoteDescription complete');
}

function onSetSessionDescriptionError(error) {
  console.log('Failed to set session description: ' + error.toString());
}

function onCreateSessionDescriptionError(error) {
  console.log('Failed to create session description: ' + error.toString());

}
