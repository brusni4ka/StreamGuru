<template>
  <div>
    <h1>Chat Page</h1>
    <div class="video-wrapper">
      <video ref="localVideo" autoplay muted width="200px" height="150px"></video>
      <video ref="remoteVideo" autoplay muted width="200px" height="150px"></video>
      <div class="remotes">
        <video autoplay v-for="number in remoteStreams.length"
               :key="number"
               :ref="`remoteVideo${number}`" >
        </video>
      </div>

    </div>
    <button class="call-btn" @click="onClickHandler">call</button>

  </div>
</template>

<script>
  import {init, startWebRTC} from '../../utils/rtc';
  import {WebRTC} from '../../utils/chat';

  export default  {
    name: 'chat',
    data() {
      return {
        membersLength: 0,
        localStream: null,
        remoteStreams: []
      }
    },
    mounted() {
      const { localVideo, remoteVideo} = this.$refs;

      WebRTC.init(
        (stream) => {
          console.log('localStream',stream);
          localVideo.srcObject = stream
          this.localStream = stream;
        },
        (stream) => {
          console.log('remoteStream',stream)
          remoteVideo.srcObject = stream
          console.dir(remoteVideo, 'remoteVideo');
          //this.remoteStreams.push(stream);
        }
        );
    },
    watch: {
      remoteStreams: function () {
        const {localVideo, ...remoteVideos} = this.$refs;
        console.log(localVideo,'localVideo')
        console.log(remoteVideos);
        Object.keys(remoteVideos).forEach((video, index) => {
          remoteVideos[video][0].srcObject = this.remoteStreams[index];
        })
      }
    },
    methods: {
      onClickHandler() {
        const { localVideo, remoteVideo} = this.$refs;

        startWebRTC(remoteVideo, localVideo, this.drone);
      }
    }

  }
</script>

<style lang="scss" scoped>

  video {
    background-color: #373533;
    width: 200px;
    height: 150px;
  }

  .call-btn {
    margin: 10px auto;
    color: #fff;
    background-color: #ae0000;
    border: 0;
    padding: 5px 15px;
    cursor: pointer;
  }
</style>

