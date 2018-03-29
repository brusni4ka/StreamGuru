export const WebRTC = (function () {
  let pc;
  let drone;
  let room;
  let isOfferer;
  let roomName;

  const configuration = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302' // Google's public STUN server
    }]
  };

  const init = (onLocalStreamCb, onRemoteStreamCb) => {
    if (!location.hash) {
      location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16)
    }
    const roomHash = location.hash.substring(1)
    roomName = "observable-" + roomHash

    drone = new ScaleDrone('PshXybqO2MJmiPZv');

    drone.on('open', error => {
      room = drone.subscribe(roomName);
      room.on('open', error => {
        if (error) {
          console.log('error');
        }
      });
      // We're connected to the room and received an array of 'members'
      // connected to the room (including us). Signaling server is ready.
      room.on('members', members => {
        // If we are the second user to connect to the room we will be creating the offer
        isOfferer = members.length > 1;
        startWebRTC(onLocalStreamCb, onRemoteStreamCb)
      });
      startListentingToSignals(()=>{console.log('success')}, ()=>{console.log('error')});
    });
  }

  function sendMessage(message) {
    drone.publish({
      room: roomName,
      message
    });
  }

  function localDescCreated(desc) {
    pc.setLocalDescription(
      desc,
      () => sendMessage({'sdp': pc.localDescription}),
      ()=>{console.log('error')}
    );
  }

  function startWebRTC(onLocalStream, onRemoteStream) {
    pc = new RTCPeerConnection(configuration);

    // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
    // message to the other peer through the signaling server
    pc.onicecandidate = event => {
      if (event.candidate) {
        sendMessage({'candidate': event.candidate});
      }
    };

    // If user is offerer let the 'negotiationneeded' event create the offer
    if (isOfferer) {
      pc.onnegotiationneeded = () => {
        pc.createOffer().then(localDescCreated).catch(()=>{console.log('error')});
      }
    }

    // When a remote stream arrives display it in the #remoteVideo element
    pc.ontrack = event => {
      onRemoteStream(event.streams[0]);
    }

    //Stream my face locally
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then(stream => {
      // Display your local video in #localVideo element
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      onLocalStream(stream);
    }, onError)
  }

  function startListentingToSignals() {
    // Listen to signaling data from Scaledrone
    console.log('room',room);

    room.on('data', (message, client) => {
      // Message was sent by us
      if (!client || client.id === drone.clientId) {
        return;
      }
      if (message.sdp) {
        // This is called after receiving an offer or answer from another peer
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
          // When receiving an offer lets answer it
          if (pc.remoteDescription.type === 'offer') {
            pc.createAnswer().then(localDescCreated).catch(onError);
          }
        }, onError);
      } else if (message.candidate) {
        // Add the new ICE candidate to our connections remote description
        pc.addIceCandidate(
          new RTCIceCandidate(message.candidate), onSuccess, onError
        );
      }
    });
  }

  function onSuccess() {
    console.log('Success')
  }

  function onError() {
    console.log('Error')
  }

  return {
    init
  }
}())
