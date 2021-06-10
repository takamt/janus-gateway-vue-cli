<template>
  <div class="stream-content">
    <Nav />
    <select v-model="janusStreamList.selected" :disabled="janusStream">
      <option
        v-for="option in janusStreamList.options"
        :key="option.id"
        :value="option.id"
      >
        {{ option.description }}
      </option>
    </select>
    <button :disabled="janusStream" @click="startJanus">Start</button>
    <button :disabled="!janusStream" @click="stopJanus">Stop</button>
    <video v-if="janusStream" autoplay :srcObject.prop="janusStream"></video>
    <div v-if="!janusStream">No video</div>
    <div v-if="janusStatus">Status: {{ janusStatus }}</div>
    <div v-if="janusError">{{ janusError }}</div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import { Janus } from "janus-gateway";
import Nav from "../components/Nav.vue";

export default defineComponent({
  name: "Stream",
  components: {
    Nav,
  },
  setup() {
    // TODO：定義共通化
    const janusServerUri = "/janusbase/janus";
    var janusServer = null;
    if (window.location.protocol === "http:") {
      janusServer = "http://" + window.location.hostname + ":8080" + janusServerUri;
    } else {
      janusServer = "https://" + window.location.hostname + ":1443" + janusServerUri;
    }

    const janusOpaqueId = "thisisopaqueid";

    let janusClient;
    let janusPlugin;

    const janusStream = ref(null);
    const janusError = ref(null);
    const janusStatus = ref(null);
    const janusStreamList = reactive({
      selected: null,
      options: [],
    });

    onMounted(() => {
      _initJanus();
    });

    function _initJanus() {
      Janus.init({
        debug: true,
        dependencies: Janus.useDefaultDependencies(),
        callback: () => {
          _connectJanusServer();
        },
      });
    }

    function _connectJanusServer() {
      janusClient = new Janus({
        server: janusServer,
        success: () => {
          _attachJanusPlugin();
        },
        error: (error) => {
          Janus.error("Failed to connect to janus server", error);
        },
        destroyed: () => {
          window.location.reload();
        },
      });
    }

    function _attachJanusPlugin() {
      janusClient.attach({
        plugin: "janus.plugin.streaming",
        opaqueId: janusOpaqueId,
        success: (plugin) => {
          janusPlugin = plugin;
          _updateJanusStreamsList();
        },
        error: (error) => {
          _onJanusError("Error attaching plugin... ", error);
        },
        onmessage: (msg, jsep) => {
          _onJanusMessage(msg, jsep);
        },
        onremotestream: (stream) => {
          _onJanusRemoteStream(stream);
        },
        oncleanup: () => {
          _onJanusCleanup();
        },
      });
    }

    function _updateJanusStreamsList() {
      janusPlugin.send({
        message: { request: "list" },
        success: (result) => {
          if (!result) {
            _onJanusError("Got no response to our query for available streams");
          }
          janusStreamList.options = result.list;
          if (result.list.length) {
            janusStreamList.selected = janusStreamList.options[0].id;
          }
        },
      });
    }

    function _onJanusMessage(msg, jsep) {
      if (msg && msg.result) {
        const result = msg.result;
        if (result.status) {
          janusStatus.value = result.status;
        }
      } else if (msg && msg.error) {
        _onJanusError(msg.error);
      }
      if (jsep) {
        const stereo = jsep.sdp.indexOf("stereo=1") !== -1;
        janusPlugin.createAnswer({
          jsep: jsep,
          media: { audioSend: false, videoSend: false },
          customizeSdp: (jsep) => {
            if (stereo && jsep.sdp.indexOf("stereo=1") === -1) {
              jsep.sdp = jsep.sdp.replace(
                "useinbandfec=1",
                "useinbandfec=1;stereo=1"
              );
            }
          },
          success: (jsep) => {
            const body = { request: "start" };
            janusPlugin.send({ message: body, jsep: jsep });
          },
          error: (error) => {
            _onJanusError("WebRTC error:", error);
          },
        });
      }
    }

    function _onJanusRemoteStream(stream) {
      if (stream.active) {
        janusStream.value = stream;
      } else {
        janusStream.value = null;
      }
    }

    function _onJanusCleanup() {
      janusStream.value = null;
      janusStatus.value = null;
      janusError.value = null;
    }

    function _onJanusError(message, error = "") {
      Janus.error(message, error);
      janusError.value = message + error;
    }

    function startJanus() {
      janusPlugin.send({
        message: { request: "watch", id: janusStreamList.selected },
      });
    }

    function stopJanus() {
      janusPlugin.send({ message: { request: "stop" } });
      janusPlugin.hangup();
      _onJanusCleanup();
    }

    return {
      janusStream,
      janusError,
      janusStatus,
      janusStreamList,
      startJanus,
      stopJanus,
    };
  },
});
</script>

<style scoped>
stream-content {
  background-color: #333;
  font-family: sans-serif;
  color: #ddd;
  text-align: center;
}
select {
  background-color: #ddd;
}
video {
  width: 100%;
}
</style>
