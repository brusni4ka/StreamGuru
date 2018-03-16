<template>
  <div>
    <h1>Record Page</h1>
    <div class="view--video">
      <video ref="video" id="videoTag" src="" autoplay muted class="view--video__video"></video>
      <div class="video-controls">
        <a @click.prevent="startStream">Start Record</a>
        <a @click.prevent="stopStream">Pause Record</a>
        <a @click.prevent="pauseStream">Stop Record</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {ScreenRecord} from '../../utils/screen_record'

  export default {
    name: 'screen-record',
    data() {
      return {
        recording: false
      }
    },
    mounted(){
      this.connection = new WebSocket('ws://localhost:9000/');
      this.connection.binaryType = 'arraybuffer';
      window.addEventListener('beforeunload', function() {
        this.connection.close();
      });
      ScreenRecord.init(this.$refs.video, (data) => {
        console.log(data);
        this.connection.send(data);
      });
    },
    methods: {
      startStream() {
          if(this.recording) {return;}
          console.log('startStream');
          this.recording = true;
          this.connection.send('Test connection');
          ScreenRecord.start();
      },
      stopStream() {
          this.recording = false;
          ScreenRecord.stop();
      },
      pauseStream() {
         this.recording = false;
         ScreenRecord.pause();
      }
    }
  }
</script>

<style lang="scss" scoped>

  .view--video {
    position: relative;
    width: 1280px;
    height: 720px;
    background-color: #696969;
    margin: 0 auto;

    &.active {
      display: none;
    }

    .video-controls {
      position: absolute;
      bottom: 0;
      height: 60px;
      width: 100%;
      text-align: center;
      margin-top: -60px;
      background-color: rgba(0,0,0,0.2);
    }
  }
</style>
