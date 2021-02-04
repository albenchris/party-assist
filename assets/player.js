window.onSpotifyWebPlaybackSDKReady = () => {
    const token = '[BQB_-qQVyp60-5PXW1GAAji3zHC4ytIzLsh7lcFOdlNq3RSaKjJhAdpMfaZFQPSVd9z3C5jUlq6-tLLn6SP1wK3rlkDa_MwbsQP3EWMEo_oZrLaYkLHySoD6DM2HYblaVT2q_L22O-_UGZ5WSr_yS62gMGLL4sg]';
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });
  
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });
  
    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    // Connect to the player!
    player.connect();
  };