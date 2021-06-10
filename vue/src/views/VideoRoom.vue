<template>
  <div class="videoroom-content">
    <Nav />
    <div>
      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1>
              Plugin Demo: Video Room
              <button id="start" class="btn btn-default" autocomplete="off">
                Start
              </button>
            </h1>
          </div>
          <div id="details" class="container">
            <div class="row">
              <div class="col-md-12">
                <h3>Demo details</h3>
                <p>
                  This demo is an example of how you can use the Video Room
                  plugin to implement a simple videoconferencing application. In
                  particular, this demo page allows you to have up to 6 active
                  participants at the same time: more participants joining the
                  room will be instead just passive users. No mixing is
                  involved: all media are just relayed in a publisher/subscriber
                  approach. This means that the plugin acts as a SFU (Selective
                  Forwarding Unit) rather than an MCU (Multipoint Control Unit).
                </p>
                <p>
                  If you"re interested in testing how simulcasting can be used
                  within the context of a videoconferencing application, just
                  pass the
                  <code>?simulcast=true</code> query string to the url of this
                  page and reload it. If you"re using a browser that does
                  support simulcasting (Chrome or Firefox) and the room is
                  configured to use VP8, you"ll send multiple qualities of the
                  video you"re capturing. Notice that simulcasting will only
                  occur if the browser thinks there is enough bandwidth, so
                  you"ll have to play with the Bandwidth selector to increase
                  it. New buttons to play with the feature will automatically
                  appear for viewers when receiving any simulcasted stream.
                  Notice that no simulcast support is needed for watching, only
                  for publishing.
                </p>
                <p>
                  To use the demo, just insert a username to join the default
                  room that is configured. This will add you to the list of
                  participants, and allow you to automatically send your
                  audio/video frames and receive the other participants" feeds.
                  The other participants will appear in separate panels, whose
                  title will be the names they chose when registering at the
                  demo.
                </p>
                <p>
                  Press the <code>Start</code> button above to launch the demo.
                </p>
              </div>
            </div>
          </div>
          <div id="videojoin" class="container hide">
            <div class="row">
              <span id="you" class="label label-info"></span>
              <div id="controls" class="col-md-12">
                <div id="registernow" class="input-group margin-bottom-md hide">
                  <span class="input-group-addon">@</span>
                  <input
                    id="username"
                    autocomplete="off"
                    class="form-control"
                    type="text"
                    placeholder="Choose a display name"
                    @keydown.enter="checkEnter"
                  />
                  <span class="input-group-btn">
                    <button
                      id="register"
                      class="btn btn-success"
                      autocomplete="off"
                    >
                      Join the room
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div id="videos" class="container hide">
            <div class="row">
              <div class="col-md-4">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">
                      Local Video
                      <span id="publisher" class="label label-primary hide">
                      </span>
                      <div class="btn-group btn-group-xs pull-right hide">
                        <div class="btn-group btn-group-xs">
                          <button
                            id="bitrateset"
                            autocomplete="off"
                            class="btn btn-primary dropdown-toggle"
                            data-toggle="dropdown"
                          >
                            Bandwidth
                            <span class="caret"></span>
                          </button>
                          <ul id="bitrate" class="dropdown-menu" role="menu">
                            <li><a id="0" href="#">No limit</a></li>
                            <li><a id="128" href="#">Cap to 128kbit</a></li>
                            <li><a id="256" href="#">Cap to 256kbit</a></li>
                            <li><a id="512" href="#">Cap to 512kbit</a></li>
                            <li><a id="1024" href="#">Cap to 1mbit</a></li>
                            <li><a id="1500" href="#">Cap to 1.5mbit</a></li>
                            <li><a id="2000" href="#">Cap to 2mbit</a></li>
                          </ul>
                        </div>
                      </div>
                    </h3>
                  </div>
                  <div id="videolocal" class="panel-body"></div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">
                      Remote Video #1
                      <span id="remote1" class="label label-info hide"></span>
                    </h3>
                  </div>
                  <div id="videoremote1" class="panel-body relative"></div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">
                      Remote Video #2
                      <span id="remote2" class="label label-info hide"></span>
                    </h3>
                  </div>
                  <div id="videoremote2" class="panel-body relative"></div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">
                      Remote Video #3
                      <span id="remote3" class="label label-info hide"></span>
                    </h3>
                  </div>
                  <div id="videoremote3" class="panel-body relative"></div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">
                      Remote Video #4
                      <span id="remote4" class="label label-info hide"></span>
                    </h3>
                  </div>
                  <div id="videoremote4" class="panel-body relative"></div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">
                      Remote Video #5
                      <span id="remote5" class="label label-info hide"></span>
                    </h3>
                  </div>
                  <div id="videoremote5" class="panel-body relative"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { Janus } from "janus-gateway";
import * as $ from "jquery";
import toastr from "toastr";
import Spinner from "spin";
import Nav from "../components/Nav.vue";

export default defineComponent({
  name: "VideoRoom",
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

    let janusClient = null;

    var sfutest = null;
    var opaqueId = "videoroomtest-" + Janus.randomString(12);

    var myroom = 1234; // Demo room
    if (getQueryStringValue("room") !== "") {
      myroom = parseInt(getQueryStringValue("room"));
    }
    var myusername = null;
    var myid = null;
    var mystream = null;
    // We use this other ID just to map our subscriptions to us
    var mypvtid = null;

    var feeds = [];
    var bitrateTimer = [];

    var doSimulcast =
      getQueryStringValue("simulcast") === "yes" ||
      getQueryStringValue("simulcast") === "true";
    var doSimulcast2 =
      getQueryStringValue("simulcast2") === "yes" ||
      getQueryStringValue("simulcast2") === "true";
    var subscriber_mode =
      getQueryStringValue("subscriber-mode") === "yes" ||
      getQueryStringValue("subscriber-mode") === "true";

    onMounted(() => {
      _initJanus();
    });

    function _initJanus() {
      // Initialize the library (all console debuggers enabled)
      Janus.init({
        debug: "all",
        callback: () => _connectJanusServer(),
      });
    }

    function _connectJanusServer() {
      // Use a button to start the demo
      $("#start").one("click", _onClickStart);
    }

    function _onClickStart() {
      $(this).attr("disabled", "true").unbind("click");

      // Make sure the browser supports WebRTC
      if (!Janus.isWebrtcSupported()) {
        alert("No WebRTC support... ");
        return;
      }

      _createJanusSession();
    }

    function _createJanusSession() {
      // Create session
      janusClient = new Janus({
        server: janusServer,
        success: () => _onCreateSessionSuccess(),
        error: (error) => {
          Janus.error(error);
          alert(error);
          window.location.reload();
        },
        destroyed: () => {
          window.location.reload();
        },
      });
    }

    function _onCreateSessionSuccess() {
      // Attach to VideoRoom plugin
      janusClient.attach({
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: (pluginHandle) => _attachJanusPluginSuccess(pluginHandle),
        error: (error) => _attachJanusPluginError(error),
        consentDialog: (pluginHandle) =>
          _attachJanusPluginConsentDialog(pluginHandle),
        iceState: (state) => _attachJanusPluginIceState(state),
        mediaState: (midium, on) => _attachJanusPluginMediaState(midium, on),
        webrtcState: (on) => _attachJanusPluginWebRTCState(on),
        onmessage: (msg, jsep) => _attachJanusPluginOnMessage(msg, jsep),
        onlocalstream: (stream) => _attachJanusPluginOnLocalStream(stream),
        onremotestream: () => _attachJanusPluginOnRemoteStream(),
        oncleanup: _attachJanusPluginonCleanup(),
      });
    }

    function _attachJanusPluginSuccess(pluginHandle) {
      $("#details").remove();
      sfutest = pluginHandle;
      Janus.log(
        "Plugin attached! (" +
          sfutest.getPlugin() +
          ", id=" +
          sfutest.getId() +
          ")"
      );
      Janus.log("  -- This is a publisher/manager");
      // Prepare the username registration
      $("#videojoin").removeClass("hide").show();
      $("#registernow").removeClass("hide").show();
      $("#register").click(registerUsername);
      $("#username").focus();
      $("#start")
        .removeAttr("disabled")
        .html("Stop")
        .click(() => {
          $(this).attr("disabled", "true");
          janusClient.destroy();
        });
    }

    function _attachJanusPluginError(error) {
      Janus.error("  -- Error attaching plugin...", error);
      alert("Error attaching plugin... " + error);
    }

    function _attachJanusPluginConsentDialog(on) {
      Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
      if (on) {
        //Darken screen and show hint
        // $.blockUI({
        //   message: "<div><img src='up_arrow.png'/></div>",
        //   css: {
        //     border: "none",
        //     padding: "15px",
        //     backgroundColor: "transparent",
        //     color: "#aaa",
        //     top: "10px",
        //     left: navigator.mozGetUserMedia ? "-100px" : "300px",
        //   },
        // });
      } else {
        // Restore screen
        // $.unblockUI();
      }
    }

    function _attachJanusPluginIceState(state) {
      Janus.log("ICE state changed to " + state);
    }

    function _attachJanusPluginMediaState(medium, on) {
      Janus.log(
        "Janus " + (on ? "started" : "stopped") + " receiving our " + medium
      );
    }

    function _attachJanusPluginWebRTCState(on) {
      Janus.log(
        "Janus says our WebRTC PeerConnection is" + (on ? "up" : "down") + "now"
      );
      //$("#videolocal").parent().parent().unblock();
      if (!on) {
        return;
      }
      $("#publish").remove();
      // This controls allows us to override the global room bitrate cap
      $("#bitrate").parent().parent().removeClass("hide").show();
      $("#bitrate a").click(() => {
        var id = $(this).attr("id");
        var bitrate = parseInt(id) * 1000;
        if (bitrate === 0) {
          Janus.log("Not limiting bandwidth via REMB");
        } else {
          Janus.log("Capping bandwidth to " + bitrate + " via REMB");
        }
        $("#bitrateset")
          .html($(this).html() + "<span class='caret'></span>")
          .parent()
          .removeClass("open");
        sfutest.send({ message: { request: "configure", bitrate: bitrate } });
        return false;
      });
    }

    function _attachJanusPluginOnMessageJoined(msg) {
      // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
      myid = msg["id"];
      mypvtid = msg["private_id"];
      Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
      if (subscriber_mode) {
        $("#videojoin").hide();
        $("#videos").removeClass("hide").show();
      } else {
        publishOwnFeed(true);
      }
      // Any new feed to attach to?
      if (msg["publishers"]) {
        var list = msg["publishers"];
        Janus.debug("Got a list of available publishers/feeds:", list);
        for (var f in list) {
          var id = list[f]["id"];
          var display = list[f]["display"];
          var audio = list[f]["audio_codec"];
          var video = list[f]["video_codec"];
          Janus.debug(
            `
              >> [${id}] ${display} (audio: ${audio}, video: ${video})
            `
          );
          newRemoteFeed(id, display, audio, video);
        }
      }
    }

    function _attachJanusPluginOnMessageDestroyed() {
      // The room has been destroyed
      Janus.warn("The room has been destroyed!");
      alert("The room has been destroyed");
      window.location.reload();
    }

    function _attachJanusPluginOnMessage(msg, jsep) {
      Janus.debug(" ::: Got a message (publisher) :::", msg);
      var event = msg["videoroom"];
      Janus.debug("Event: " + event);
      if (event) {
        _attachJanusPluginOnMessageEvent(event, msg);
      }
      if (jsep) {
        _attachJanusPluginOnMessageJsep(jsep, msg);
      }
    }

    function _attachJanusPluginOnMessageEvent(event, msg) {
      if (event === "joined") {
        _attachJanusPluginOnMessageJoined(msg);
      } else if (event === "destroyed") {
        _attachJanusPluginOnMessageDestroyed();
      } else if (event === "event") {
        // Any new feed to attach to?
        if (msg["publishers"]) {
          _attachJanusPluginOnMessageEventPublishers(msg);
        } else if (msg["leaving"]) {
          _attachJanusPluginOnMessageEventLeaving(msg);
        } else if (msg["unpublished"]) {
          _attachJanusPluginOnMessageEventUnpublished(msg);
        } else if (msg["error"]) {
          _attachJanusPluginOnMessageEventError(msg);
        }
      }
    }

    function _attachJanusPluginOnMessageEventPublishers(msg) {
      var list = msg["publishers"];
      Janus.debug("Got a list of available publishers/feeds:", list);
      for (var f in list) {
        var id = list[f]["id"];
        var display = list[f]["display"];
        var audio = list[f]["audio_codec"];
        var video = list[f]["video_codec"];
        Janus.debug(
          `
            >> [${id}] ${display} (audio: ${audio}, video: ${video})
          `
        );
        newRemoteFeed(id, display, audio, video);
      }
    }

    function _attachJanusPluginOnMessageEventLeaving(msg) {
      // One of the publishers has gone away?
      var leaving = msg["leaving"];
      Janus.log("Publisher left: " + leaving);
      var remoteFeed = null;
      for (var i = 1; i < 6; i++) {
        if (feeds[i] && feeds[i].rfid == leaving) {
          remoteFeed = feeds[i];
          break;
        }
      }
      if (remoteFeed != null) {
        Janus.debug(
          "Feed " +
            remoteFeed.rfid +
            " (" +
            remoteFeed.rfdisplay +
            ") has left the room, detaching"
        );
        $("#remote" + remoteFeed.rfindex)
          .empty()
          .hide();
        $("#videoremote" + remoteFeed.rfindex).empty();
        feeds[remoteFeed.rfindex] = null;
        remoteFeed.detach();
      }
    }

    function _attachJanusPluginOnMessageEventUnpublished(msg) {
      // One of the publishers has unpublished?
      var unpublished = msg["unpublished"];
      Janus.log("Publisher left: " + unpublished);
      if (unpublished === "ok") {
        // That"s us
        sfutest.hangup();
        return;
      }
      var remoteFeed = null;
      for (var i = 1; i < 6; i++) {
        if (feeds[i] && feeds[i].rfid == unpublished) {
          remoteFeed = feeds[i];
          break;
        }
      }
      if (remoteFeed != null) {
        Janus.debug(
          "Feed " +
            remoteFeed.rfid +
            " (" +
            remoteFeed.rfdisplay +
            ") has left the room, detaching"
        );
        $("#remote" + remoteFeed.rfindex)
          .empty()
          .hide();
        $("#videoremote" + remoteFeed.rfindex).empty();
        feeds[remoteFeed.rfindex] = null;
        remoteFeed.detach();
      }
    }

    function _attachJanusPluginOnMessageEventError(msg) {
      if (msg["error_code"] === 426) {
        // This is a "no such room" error: give a more meaningful description
        alert(
          `
          <p>Apparently room <code>${myroom}</code> (the one this demo uses as a test room)
          does not exist...</p><p>Do you have an updated <code>janus.plugin.videoroom.jcfg</code>
          configuration file? If not, make sure you copy the details of room <code>${myroom}</code>
          from that sample in your current configuration file, then restart Janus and try again.
          `
        );
      } else {
        alert(msg["error"]);
      }
    }

    function _attachJanusPluginOnMessageJsep(jsep, msg) {
      Janus.debug("Handling SDP as well...", jsep);
      sfutest.handleRemoteJsep({ jsep: jsep });
      // Check if any of the media we wanted to publish has
      // been rejected (e.g., wrong or unsupported codec)
      var audio = msg["audio_codec"];
      if (
        mystream &&
        mystream.getAudioTracks() &&
        mystream.getAudioTracks().length > 0 &&
        !audio
      ) {
        // Audio has been rejected
        toastr.warning(
          "Our audio stream has been rejected, viewers won't hear us"
        );
      }
      var video = msg["video_codec"];
      if (
        mystream &&
        mystream.getVideoTracks() &&
        mystream.getVideoTracks().length > 0 &&
        !video
      ) {
        // Video has been rejected
        toastr.warning(
          "Our video stream has been rejected, viewers won't see us"
        );
        // Hide the webcam video
        $("#myvideo").hide();
        $("#videolocal").append(
          `
          <div class='no-video-container'>
            <i class='fa fa-video-camera fa-5 no-video-icon' style='height: 100%;'></i>
            <span class='no-video-text' style='font-size: 16px;'>Video rejected, no webcam</span>
          </div>
          `
        );
      }
    }

    function _attachJanusPluginOnLocalStream(stream) {
      Janus.debug(" ::: Got a local stream :::", stream);
      mystream = stream;
      $("#videojoin").hide();
      $("#videos").removeClass("hide").show();
      if ($("#myvideo").length === 0) {
        $("#videolocal").append(
          "<video class='rounded centered' id='myvideo' width='100%' height='100%' autoplay playsinline muted='muted'/>"
        );
        // Add a "mute" button
        $("#videolocal").append(
          "<button class='btn btn-warning btn-xs' id='mute' style='position: absolute; bottom: 0px; left: 0px; margin: 15px;'>Mute</button>"
        );
        $("#mute").click(toggleMute);
        // Add an "unpublish" button
        $("#videolocal").append(
          "<button class='btn btn-warning btn-xs' id='unpublish' style='position: absolute; bottom: 0px; right: 0px; margin: 15px;'>Unpublish</button>"
        );
        $("#unpublish").click(unpublishOwnFeed);
      }
      $("#publisher").removeClass("hide").html(myusername).show();
      Janus.attachMediaStream($("#myvideo").get(0), stream);
      $("#myvideo").get(0).muted = true; //"muted";
      if (
        sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
        sfutest.webrtcStuff.pc.iceConnectionState !== "connected"
      ) {
        // XXX need BlockUI
        // $("#videolocal")
        //   .parent()
        //   .parent()
        //   .block({
        //     message: "<b>Publishing...</b>",
        //     css: {
        //       border: "none",
        //       backgroundColor: "transparent",
        //       color: "white",
        //     },
        //   });
      }
      var videoTracks = stream.getVideoTracks();
      if (!videoTracks || videoTracks.length === 0) {
        // No webcam
        $("#myvideo").hide();
        if ($("#videolocal .no-video-container").length === 0) {
          $("#videolocal").append(
            "<div class='no-video-container'>" +
              "<i class='fa fa-video-camera fa-5 no-video-icon'></i>" +
              "<span class='no-video-text'>No webcam available</span>" +
              "</div>"
          );
        }
      } else {
        $("#videolocal .no-video-container").remove();
        $("#myvideo").removeClass("hide").show();
      }
    }

    function _attachJanusPluginOnRemoteStream() {
      // The publisher stream is sendonly, we don"t expect anything here
    }

    function _attachJanusPluginonCleanup() {
      Janus.log(" ::: Got a cleanup notification: we are unpublished now :::");
      mystream = null;
      $("#videolocal").html(
        "<button id='publish' class='btn btn-primary'>Publish</button>"
      );
      $("#publish").click(() => {
        publishOwnFeed(true);
      });
      // XXX need BlockUI
      //$("#videolocal").parent().parent().unblock();
      $("#bitrate").parent().parent().addClass("hide");
      $("#bitrate a").unbind("click");
    }

    function checkEnter(event) {
      var theCode = event.keyCode
        ? event.keyCode
        : event.which
        ? event.which
        : event.charCode;
      if (theCode == 13) {
        registerUsername();
        return false;
      } else {
        return true;
      }
    }

    function registerUsername() {
      if ($("#username").length === 0) {
        // Create fields to register
        $("#register").click(registerUsername);
        $("#username").focus();
      } else {
        // Try a registration
        $("#username").attr("disabled", "true");
        $("#register").attr("disabled", "true").unbind("click");
        var username = $("#username").val().toString();
        if (username === "") {
          $("#you")
            .removeClass()
            .addClass("label label-warning")
            .html("Insert your display name (e.g., pippo)");
          $("#username").removeAttr("disabled");
          $("#register").removeAttr("disabled").click(registerUsername);
          return;
        }
        if (/[^a-zA-Z0-9]/.test(username)) {
          $("#you")
            .removeClass()
            .addClass("label label-warning")
            .html("Input is not alphanumeric");
          $("#username").removeAttr("disabled").val("");
          $("#register").removeAttr("disabled").click(registerUsername);
          return;
        }
        var register = {
          request: "join",
          room: myroom,
          ptype: "publisher",
          display: username,
        };
        myusername = username;
        sfutest.send({ message: register });
      }
    }

    function publishOwnFeed(useAudio) {
      // Publish our stream
      $("#publish").attr("disabled", "true").unbind("click");
      sfutest.createOffer({
        // Add data:true here if you want to publish datachannels as well
        media: {
          audioRecv: false,
          videoRecv: false,
          audioSend: useAudio,
          videoSend: true,
        }, // Publishers are sendonly
        // If you want to test simulcasting (Chrome and Firefox only), then
        // pass a ?simulcast=true when opening this demo page: it will turn
        // the following 'simulcast' property to pass to janus.js to true
        simulcast: doSimulcast,
        simulcast2: doSimulcast2,
        success: (jsep) => {
          Janus.debug("Got publisher SDP!", jsep);
          var publish = { request: "configure", audio: useAudio, video: true };
          // You can force a specific codec to use when publishing by using the
          // audiocodec and videocodec properties, for instance:
          // 		publish["audiocodec"] = "opus"
          // to force Opus as the audio codec to use, or:
          // 		publish["videocodec"] = "vp9"
          // to force VP9 as the videocodec to use. In both case, though, forcing
          // a codec will only work if: (1) the codec is actually in the SDP (and
          // so the browser supports it), and (2) the codec is in the list of
          // allowed codecs in a room. With respect to the point (2) above,
          // refer to the text in janus.plugin.videoroom.jcfg for more details
          sfutest.send({ message: publish, jsep: jsep });
        },
        error: (error) => {
          Janus.error("WebRTC error:", error);
          if (useAudio) {
            publishOwnFeed(false);
          } else {
            //bootbox.alert("WebRTC error... " + error.message);
            alert("WebRTC error... " + error.message);
            $("#publish")
              .removeAttr("disabled")
              .click(() => {
                publishOwnFeed(true);
              });
          }
        },
      });
    }

    function toggleMute() {
      var muted = sfutest.isAudioMuted();
      Janus.log((muted ? "Unmuting" : "Muting") + " local stream...");
      if (muted) {
        sfutest.unmuteAudio();
      } else {
        sfutest.muteAudio();
      }
      muted = sfutest.isAudioMuted();
      $("#mute").html(muted ? "Unmute" : "Mute");
    }

    function unpublishOwnFeed() {
      // Unpublish our stream
      $("#unpublish").attr("disabled", "true").unbind("click");
      var unpublish = { request: "unpublish" };
      sfutest.send({ message: unpublish });
    }

    function newRemoteFeed(id, display, audio, video) {
      // A new feed has been published, create a new plugin handle and attach to it as a subscriber
      var remoteFeed = null;
      janusClient.attach({
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: (pluginHandle) => {
          remoteFeed = pluginHandle;
          remoteFeed.simulcastStarted = false;
          Janus.log(
            "Plugin attached! (" +
              remoteFeed.getPlugin() +
              ", id=" +
              remoteFeed.getId() +
              ")"
          );
          Janus.log("  -- This is a subscriber");
          // We wait for the plugin to send us an offer
          var subscribe = {
            request: "join",
            room: myroom,
            ptype: "subscriber",
            feed: id,
            private_id: mypvtid,
          };
          // In case you don't want to receive audio, video or data, even if the
          // publisher is sending them, set the 'offer_audio', 'offer_video' or
          // 'offer_data' properties to false (they're true by default), e.g.:
          // 		subscribe["offer_video"] = false;
          // For example, if the publisher is VP8 and this is Safari, let's avoid video
          if (
            Janus.webRTCAdapter.browserDetails.browser === "safari" &&
            (video === "vp9" || (video === "vp8" && !Janus.safariVp8))
          ) {
            if (video) {
              video = video.toUpperCase();
            }
            toastr.warning(
              "Publisher is using " +
                video +
                ", but Safari doesn't support it: disabling video"
            );
            subscribe["offer_video"] = false;
          }
          remoteFeed.videoCodec = video;
          remoteFeed.send({ message: subscribe });
        },
        error: (error) => {
          Janus.error("  -- Error attaching plugin...", error);
          //bootbox.alert("Error attaching plugin... " + error);
          alert("Error attaching plugin... " + error);
        },
        onmessage: (msg, jsep) => {
          Janus.debug(" ::: Got a message (subscriber) :::", msg);
          var event = msg["videoroom"];
          Janus.debug("Event: " + event);
          if (msg["error"]) {
            //bootbox.alert(msg["error"]);
            alert(msg["error"]);
          } else if (event) {
            if (event === "attached") {
              // Subscriber created and attached
              for (var i = 1; i < 6; i++) {
                if (!feeds[i]) {
                  feeds[i] = remoteFeed;
                  remoteFeed.rfindex = i;
                  break;
                }
              }
              remoteFeed.rfid = msg["id"];
              remoteFeed.rfdisplay = msg["display"];
              if (!remoteFeed.spinner) {
                var target = document.getElementById(
                  "videoremote" + remoteFeed.rfindex
                );
                remoteFeed.spinner = new Spinner({ top: 100 }).spin(target);
              } else {
                remoteFeed.spinner.spin();
              }
              Janus.log(
                "Successfully attached to feed " +
                  remoteFeed.rfid +
                  " (" +
                  remoteFeed.rfdisplay +
                  ") in room " +
                  msg["room"]
              );
              $("#remote" + remoteFeed.rfindex)
                .removeClass("hide")
                .html(remoteFeed.rfdisplay)
                .show();
            } else if (event === "event") {
              // Check if we got a simulcast-related event from this publisher
              var substream = msg["substream"];
              var temporal = msg["temporal"];
              if (
                (substream !== null && substream !== undefined) ||
                (temporal !== null && temporal !== undefined)
              ) {
                if (!remoteFeed.simulcastStarted) {
                  remoteFeed.simulcastStarted = true;
                  // Add some new buttons
                  addSimulcastButtons(
                    remoteFeed.rfindex,
                    remoteFeed.videoCodec === "vp8" ||
                      remoteFeed.videoCodec === "h264"
                  );
                }
                // We just received notice that there's been a switch, update the buttons
                updateSimulcastButtons(remoteFeed.rfindex, substream, temporal);
              }
            } else {
              // What has just happened?
            }
          }
          if (jsep) {
            Janus.debug("Handling SDP as well...", jsep);
            // Answer and attach
            remoteFeed.createAnswer({
              jsep: jsep,
              // Add data:true here if you want to subscribe to datachannels as well
              // (obviously only works if the publisher offered them in the first place)
              media: { audioSend: false, videoSend: false }, // We want recvonly audio/video
              success: (jsep) => {
                Janus.debug("Got SDP!", jsep);
                var body = { request: "start", room: myroom };
                remoteFeed.send({ message: body, jsep: jsep });
              },
              error: (error) => {
                Janus.error("WebRTC error:", error);
                //bootbox.alert("WebRTC error... " + error.message);
                alert("WebRTC error... " + error.message);
              },
            });
          }
        },
        iceState: (state) => {
          Janus.log(
            "ICE state of this WebRTC PeerConnection (feed #" +
              remoteFeed.rfindex +
              ") changed to " +
              state
          );
        },
        webrtcState: (on) => {
          Janus.log(
            "Janus says this WebRTC PeerConnection (feed #" +
              remoteFeed.rfindex +
              ") is " +
              (on ? "up" : "down") +
              " now"
          );
        },
        onlocalstream: (stream) => {
          // The subscriber stream is recvonly, we don't expect anything here
          Janus.log(stream);
        },
        onremotestream: (stream) => {
          Janus.debug(
            "Remote feed #" + remoteFeed.rfindex + ", stream:",
            stream
          );
          var addButtons = false;
          if ($("#remotevideo" + remoteFeed.rfindex).length === 0) {
            addButtons = true;
            // No remote video yet
            $("#videoremote" + remoteFeed.rfindex).append(
              `'<video class="rounded centered" id="waitingvideo${remoteFeed.rfindex}" width="100%" height="100%" />'`
            );
            $("#videoremote" + remoteFeed.rfindex).append(
              `'<video class="rounded centered relative hide" id="remotevideo${remoteFeed.rfindex}" width="100%" height="100%" autoplay playsinline/>'`
            );
            $("#videoremote" + remoteFeed.rfindex).append(
              `
              '<span class="label label-primary hide" id="curres${remoteFeed.rfindex}" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;"></span>
              '<span class="label label-info hide" id="curbitrate${remoteFeed.rfindex}" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;"></span>'`
            );
            // Show the video, hide the spinner and show the resolution when we get a playing event
            $("#remotevideo" + remoteFeed.rfindex).bind(
              "playing",
              function () {
                if (remoteFeed.spinner) {
                  remoteFeed.spinner.stop();
                }
                remoteFeed.spinner = null;
                $("#waitingvideo" + remoteFeed.rfindex).remove();
                if (this.videoWidth)
                  $("#remotevideo" + remoteFeed.rfindex)
                    .removeClass("hide")
                    .show();
                var width = this.videoWidth;
                var height = this.videoHeight;
                $("#curres" + remoteFeed.rfindex)
                  .removeClass("hide")
                  .text(width + "x" + height)
                  .show();
                if (Janus.webRTCAdapter.browserDetails.browser === "firefox") {
                  // Firefox Stable has a bug: width and height are not immediately available after a playing
                  setTimeout(() => {
                    var width = $(
                      "#remotevideo" + remoteFeed.rfindex
                    ).get(0).videoWidth;
                    var height = $(
                      "#remotevideo" + remoteFeed.rfindex
                    ).get(0).videoHeight;
                    $("#curres" + remoteFeed.rfindex)
                      .removeClass("hide")
                      .text(width + "x" + height)
                      .show();
                  }, 2000);
                }
              }
            );
          }
          Janus.attachMediaStream(
            $("#remotevideo" + remoteFeed.rfindex).get(0),
            stream
          );
          var videoTracks = stream.getVideoTracks();
          if (!videoTracks || videoTracks.length === 0) {
            // No remote video
            $("#remotevideo" + remoteFeed.rfindex).hide();
            if (
              $("#videoremote" + remoteFeed.rfindex + " .no-video-container")
                .length === 0
            ) {
              $("#videoremote" + remoteFeed.rfindex).append(
                `
                <div class="no-video-container">
                  <i class="fa fa-video-camera fa-5 no-video-icon"></i>
                  <span class="no-video-text">No remote video available</span>
                </div>'
                `
              );
            }
          } else {
            $(
              "#videoremote" + remoteFeed.rfindex + " .no-video-container"
            ).remove();
            $("#remotevideo" + remoteFeed.rfindex)
              .removeClass("hide")
              .show();
          }
          if (!addButtons) {
            return;
          }
          if (
            Janus.webRTCAdapter.browserDetails.browser === "chrome" ||
            Janus.webRTCAdapter.browserDetails.browser === "firefox" ||
            Janus.webRTCAdapter.browserDetails.browser === "safari"
          ) {
            $("#curbitrate" + remoteFeed.rfindex)
              .removeClass("hide")
              .show();
            bitrateTimer[remoteFeed.rfindex] = setInterval(() => {
              // Display updated bitrate, if supported
              var bitrate = remoteFeed.getBitrate();
              $("#curbitrate" + remoteFeed.rfindex).text(bitrate);
              // Check if the resolution changed too
              var width = $(
                "#remotevideo" + remoteFeed.rfindex
              ).get(0).videoWidth;
              var height = $(
                "#remotevideo" + remoteFeed.rfindex
              ).get(0).videoHeight;
              if (width > 0 && height > 0)
                $("#curres" + remoteFeed.rfindex)
                  .removeClass("hide")
                  .text(width + "x" + height)
                  .show();
            }, 1000);
          }
        },
        oncleanup: () => {
          Janus.log(
            " ::: Got a cleanup notification (remote feed " + id + ") :::"
          );
          if (remoteFeed.spinner) {
            remoteFeed.spinner.stop();
          }
          remoteFeed.spinner = null;
          $("#remotevideo" + remoteFeed.rfindex).remove();
          $("#waitingvideo" + remoteFeed.rfindex).remove();
          $("#novideo" + remoteFeed.rfindex).remove();
          $("#curbitrate" + remoteFeed.rfindex).remove();
          $("#curres" + remoteFeed.rfindex).remove();
          if (bitrateTimer[remoteFeed.rfindex])
            clearInterval(bitrateTimer[remoteFeed.rfindex]);
          bitrateTimer[remoteFeed.rfindex] = null;
          remoteFeed.simulcastStarted = false;
          $("#simulcast" + remoteFeed.rfindex).remove();
        },
      });
    }

    // Helpers to create Simulcast-related UI, if enabled
    function addSimulcastButtons(feed, temporal) {
      var index = feed;
      $("#remote" + index)
        .parent()
        .append(
          `
          <div id='simulcast${index}' class='btn-group-vertical btn-group-vertical-xs pull-right'>
            <div class='row'>
              <div class='btn-group btn-group-xs' style='width: 100%'>
                <button id='sl${index}-2' type='button' class='btn btn-primary' data-toggle='tooltip' title='Switch to higher quality' style='width: 33%'>SL 2</button>
            	  <button id='sl${index}-1' type='button' class='btn btn-primary' data-toggle='tooltip' title='Switch to normal quality' style='width: 33%'>SL 1</button>
                <button id='sl${index}-0' type='button' class='btn btn-primary' data-toggle='tooltip' title='Switch to lower quality' style='width: 34%'>SL 0</button>
              </div>
            </div>
            <div class'row'>
              <div class='btn-group btn-group-xs hide' style='width: 100%'>
                <button id='tl${index}-2' type='button' class='btn btn-primary' data-toggle='tooltip' title='Cap to temporal layer 2' style='width: 34%'>TL 2</button>
                <button id='tl${index}-1' type='button' class='btn btn-primary' data-toggle='tooltip' title='Cap to temporal layer 1' style='width: 33%'>TL 1</button>
                <button id='tl${index}-0' type='button' class='btn btn-primary' data-toggle='tooltip' title='Cap to temporal layer 0' style='width: 33%'>TL 0</button>
              </div>
            </div>
          </div>
          `
        );
      // Enable the simulcast selection buttons
      $(`#sl${index}-0`)
        .removeClass("btn-primary btn-success")
        .addClass("btn-primary")
        .unbind("click")
        .click(() => {
          toastr.info(
            "Switching simulcast substream, wait for it... (lower quality)",
            null,
            {
              timeOut: 2000,
            }
          );
          if (!$("#sl" + index + "-2").hasClass("btn-success")) {
            $(`#sl${index}-2`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          if (!$(`#sl${index}-1`).hasClass("btn-success")) {
            $(`#sl${index}-1`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          $(`#sl${index}-0`)
            .removeClass("btn-primary btn-info btn-success")
            .addClass("btn-info");
          feeds[index].send({
            message: { request: "configure", substream: 0 },
          });
        });
      $(`#sl${index}-1`)
        .removeClass("btn-primary btn-success")
        .addClass("btn-primary")
        .unbind("click")
        .click(() => {
          toastr.info(
            "Switching simulcast substream, wait for it... (normal quality)",
            null,
            {
              timeOut: 2000,
            }
          );
          if (!$(`#sl${index}-2`).hasClass("btn-success")) {
            $(`#sl${index}-2`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          $(`#sl${index}-1`)
            .removeClass("btn-primary btn-info btn-success")
            .addClass("btn-info");
          if (!$(`#sl${index}-0`).hasClass("btn-success")) {
            $(`#sl${index}-0`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          feeds[index].send({
            message: { request: "configure", substream: 1 },
          });
        });
      $(`#sl${index}-2`)
        .removeClass("btn-primary btn-success")
        .addClass("btn-primary")
        .unbind("click")
        .click(() => {
          toastr.info(
            "Switching simulcast substream, wait for it... (higher quality)",
            null,
            {
              timeOut: 2000,
            }
          );
          $(`#sl${index}-2`)
            .removeClass("btn-primary btn-info btn-success")
            .addClass("btn-info");
          if (!$(`#sl${index}-1`).hasClass("btn-success")) {
            $(`#sl${index}-1`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          if (!$(`#sl${index}-0`).hasClass("btn-success")) {
            $(`#sl${index}-0`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          feeds[index].send({
            message: { request: "configure", substream: 2 },
          });
        });
      if (!temporal) {
        // No temporal layer support
        return;
      }
      $(`#tl${index}-0`).parent().removeClass("hide");
      $(`#tl${index}-0`)
        .removeClass("btn-primary btn-success")
        .addClass("btn-primary")
        .unbind("click")
        .click(() => {
          toastr.info(
            "Capping simulcast temporal layer, wait for it... (lowest FPS)",
            null,
            {
              timeOut: 2000,
            }
          );
          if (!$(`#tl${index}-2`).hasClass("btn-success")) {
            $(`#tl${index}-2`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          if (!$(`#tl${index}-1`).hasClass("btn-success")) {
            $(`#tl${index}-1`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          $(`#tl${index}-0`)
            .removeClass("btn-primary btn-info btn-success")
            .addClass("btn-info");
          feeds[index].send({ message: { request: "configure", temporal: 0 } });
        });
      $(`#tl${index}-1`)
        .removeClass("btn-primary btn-success")
        .addClass("btn-primary")
        .unbind("click")
        .click(() => {
          toastr.info(
            "Capping simulcast temporal layer, wait for it... (medium FPS)",
            null,
            {
              timeOut: 2000,
            }
          );
          if (!$(`#tl${index}-2`).hasClass("btn-success")) {
            $(`#tl${index}-2`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          $(`#tl${index}-1`)
            .removeClass("btn-primary btn-info")
            .addClass("btn-info");
          if (!$(`#tl${index}-0`).hasClass("btn-success")) {
            $(`#tl${index}-0`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          feeds[index].send({ message: { request: "configure", temporal: 1 } });
        });
      $(`#tl${index}-2`)
        .removeClass("btn-primary btn-success")
        .addClass("btn-primary")
        .unbind("click")
        .click(() => {
          toastr.info(
            "Capping simulcast temporal layer, wait for it... (highest FPS)",
            null,
            {
              timeOut: 2000,
            }
          );
          $(`#tl${index}-2`)
            .removeClass("btn-primary btn-info btn-success")
            .addClass("btn-info");
          if (!$(`#tl${index}-1`).hasClass("btn-success")) {
            $(`#tl${index}-1`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          if (!$(`#tl${index}-0`).hasClass("btn-success")) {
            $(`#tl${index}-0`)
              .removeClass("btn-primary btn-info")
              .addClass("btn-primary");
          }
          feeds[index].send({ message: { request: "configure", temporal: 2 } });
        });
    }

    function updateSimulcastButtons(feed, substream, temporal) {
      // Check the substream
      var index = feed;
      if (substream === 0) {
        toastr.success("Switched simulcast substream! (lower quality)", null, {
          timeOut: 2000,
        });
        $(`#sl${index}-2`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
        $(`#sl${index}-1`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
        $(`#sl${index}-0`)
          .removeClass("btn-primary btn-info btn-success")
          .addClass("btn-success");
      } else if (substream === 1) {
        toastr.success("Switched simulcast substream! (normal quality)", null, {
          timeOut: 2000,
        });
        $(`#sl${index}-2`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
        $(`#sl${index}-1`)
          .removeClass("btn-primary btn-info btn-success")
          .addClass("btn-success");
        $(`#sl${index}-0`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
      } else if (substream === 2) {
        toastr.success("Switched simulcast substream! (higher quality)", null, {
          timeOut: 2000,
        });
        $(`#sl${index}-2`)
          .removeClass("btn-primary btn-info btn-success")
          .addClass("btn-success");
        $(`#sl${index}-1`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
        $(`#sl${index}-0`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
      }
      // Check the temporal layer
      if (temporal === 0) {
        toastr.success("Capped simulcast temporal layer! (lowest FPS)", null, {
          timeOut: 2000,
        });
        $(`#tl${index}-2`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
        $(`#tl${index}-1`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
        $(`#tl${index}-0`)
          .removeClass("btn-primary btn-info btn-success")
          .addClass("btn-success");
      } else if (temporal === 1) {
        toastr.success("Capped simulcast temporal layer! (medium FPS)", null, {
          timeOut: 2000,
        });
        $(`#tl${index}-2`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
        $(`#tl${index}-1`)
          .removeClass("btn-primary btn-info btn-success")
          .addClass("btn-success");
        $(`#tl${index}-0`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
      } else if (temporal === 2) {
        toastr.success("Capped simulcast temporal layer! (highest FPS)", null, {
          timeOut: 2000,
        });
        $(`#tl${index}-2`)
          .removeClass("btn-primary btn-info btn-success")
          .addClass("btn-success");
        $(`#tl${index}-1`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
        $(`#tl${index}-0`)
          .removeClass("btn-primary btn-success")
          .addClass("btn-primary");
      }
    }

    return {
      checkEnter,
    };
  },
});

// Helper to parse query string
function getQueryStringValue(name) {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.4.0/cerulean/bootstrap.min.css";
@import "/janus/css/demo.css";
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
@import "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css";
</style>
