(function() {
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function() {
    new YT.Player('heroPlayer', {
      videoId: 'BUzkCs2B9OY',
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        start: 29,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        enablejsapi: 1
      },
      events: {
        onReady: function(e) {
          e.target.playVideo();
        },
        onStateChange: function(e) {
          if (e.data === YT.PlayerState.ENDED) {
            e.target.seekTo(29);
            e.target.playVideo();
          }
        }
      }
    });

    var dailyEl = document.getElementById('dailyPlayer');
    if (dailyEl) {
      new YT.Player('dailyPlayer', {
        videoId: 'BUzkCs2B9OY',
        playerVars: {
          autoplay: 1,
          controls: 0,
          mute: 1,
          start: 29,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          loop: 1
        },
        events: {
          onReady: function(e) {
            e.target.playVideo();
          },
          onStateChange: function(e) {
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(29);
              e.target.playVideo();
            }
          }
        }
      });
    }
  };
})();
