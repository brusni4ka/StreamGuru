<template>
  <div>
    <h1>Video Page</h1>
    <div class="view--video">
      <video ref="videoPeer" id="videoTag" src="" autoplay muted class="view--video__video"></video>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'videos',
    mounted(){
      this.connection = new WebSocket('ws://localhost:9000/');
      this.connection.binaryType = 'arraybuffer';
//      window.addEventListener('beforeunload', function() {
//        this.connection.close();
//      });
      this.connection.onmessage = (stream) => {
        console.log(stream.data);
        this.$refs.videoPeer.srcObject = stream.data;
        this.$refs.videoPeer.play()
      }
    }

  }
</script>
