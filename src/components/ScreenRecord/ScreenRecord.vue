<template>
  <div>
    <h1>Record Page</h1>
    <div class="view--video">
      <video ref="video" id="videoTag" src="" autoplay muted class="view--video__video"></video>
    </div>
  </div>
</template>

<script>
  import {ScreenRecord} from '../../utils/screen_record'

  export default {
    name: 'screen-record',
    data() {
      return {

      }
    },
    mounted(){
      ScreenRecord(this.$refs.video);
    },
    methods: {
      startStream() {
        const socket = new WebSocket("ws://localhost:89604");
        let parts = ScreenRecord.start();
        socket.send(parts);
      },
      stopStream() {
        this.ref.video.stop();
        ScreenRecord.stop();
      },
      pauseStream() {
        this.ref.video.pause();
        ScreenRecord.pause();
      }
    }
  }
</script>
