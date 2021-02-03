var APIController = (function() {
    
  var clientId = '77a5b61ddbb6429186452d0699051ac4';
  var clientSecret = 'ea633b88b40a4ef1bd05c5d6698cb888';

  // private methods
  var _getToken = async () => {

      var result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
              'Content-Type' : 'application/x-www-form-urlencoded', 
              'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
          },
          body: 'grant_type=client_credentials'
      });

      var data = await result.json();
      return data.access_token;
  }
  
  var _getGenres = async (token) => {

      var result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      var data = await result.json();
      return data.categories.items;
  }

  var _getPlaylistByGenre = async (token, genreId) => {

      var limit = 10;
      
      var result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      var data = await result.json();
      return data.playlists.items;
  }

  var _getTracks = async (token, tracksEndPoint) => {

      var limit = 10;

      var result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      var data = await result.json();
      return data.items;
  }

  var _getTrack = async (token, trackEndPoint) => {

      var result = await fetch(`${trackEndPoint}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      var data = await result.json();
      return data;
  }

  return {
      getToken() {
          return _getToken();
      },
      getGenres(token) {
          return _getGenres(token);
      },
      getPlaylistByGenre(token, genreId) {
          return _getPlaylistByGenre(token, genreId);
      },
      getTracks(token, tracksEndPoint) {
          return _getTracks(token, tracksEndPoint);
      },
      getTrack(token, trackEndPoint) {
          return _getTrack(token, trackEndPoint);
      }
  }
})();


// UI Module
var UIController = (function() {

  //object to hold references to html selectors
  var DOMElements = {
      selectGenre: '#select_genre',
      selectPlaylist: '#select_playlist',
      buttonSubmit: '#btn_submit',
      divSongDetail: '#song-detail',
      hfToken: '#hidden_token',
      divSonglist: '.song-list'
  }

  //public methods
  return {

      //method to get input fields
      inputField() {
          return {
              genre: document.querySelector(DOMElements.selectGenre),
              playlist: document.querySelector(DOMElements.selectPlaylist),
              tracks: document.querySelector(DOMElements.divSonglist),
              submit: document.querySelector(DOMElements.buttonSubmit),
              songDetail: document.querySelector(DOMElements.divSongDetail)
          }
      },

      // need methods to create select list option
      createGenre(text, value) {
          var html = `<option value="${value}">${text}</option>`;
          document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
      }, 

      createPlaylist(text, value) {
          var html = `<option value="${value}">${text}</option>`;
          document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
      },

      // need method to create a track list group item 
      createTrack(id, name) {
          var html = `<a href="#" class="list-group-item " id="${id}">${name}</a>`;
          document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
      },

      // need method to create the song detail
      createTrackDetail(img, title, artist) {

          var detailDiv = document.querySelector(DOMElements.divSongDetail);
          // any time user clicks a new song, we need to clear out the song detail div
          detailDiv.innerHTML = '';

          var html = 
          `
          <div class="row details">
              <img src="${img}" alt="">        
          </div>
          <div class="row  ">
              <label for="Genre" class="form-label details">${title}:</label>
          </div>
          <div class="row ">
              <label for="artist" class="form-label  details">By ${artist}:</label>
          </div> 
          `;

          detailDiv.insertAdjacentHTML('beforeend', html)
      },

      resetTrackDetail() {
          this.inputField().songDetail.innerHTML = '';
      },

      resetTracks() {
          this.inputField().tracks.innerHTML = '';
          this.resetTrackDetail();
      },

      resetPlaylist() {
          this.inputField().playlist.innerHTML = '';
          this.resetTracks();
      },
      
      storeToken(value) {
          document.querySelector(DOMElements.hfToken).value = value;
      },

      getStoredToken() {
          return {
              token: document.querySelector(DOMElements.hfToken).value
          }
      }
  }

})();

var APPController = (function(UICtrl, APICtrl) {

  // get input field object ref
  var DOMInputs = UICtrl.inputField();

  // get genres on page load
  var loadGenres = async () => {
      //get the token
      var token = await APICtrl.getToken();           
      //store the token onto the page
      UICtrl.storeToken(token);
      //get the genres
      var genres = await APICtrl.getGenres(token);
      //populate our genres select element
      genres.forEach(element => UICtrl.createGenre(element.name, element.id));
  }

  // create genre change event listener
  DOMInputs.genre.addEventListener('change', async () => {
      //reset the playlist
      UICtrl.resetPlaylist();
      //get the token that's stored on the page
      var token = UICtrl.getStoredToken().token;        
      // get the genre select field
      var genreSelect = UICtrl.inputField().genre;       
      // get the genre id associated with the selected genre
      var genreId = genreSelect.options[genreSelect.selectedIndex].value;             
      // ge the playlist based on a genre
      var playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
      // create a playlist list item for every playlist returned
      playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
  });
   

  // create submit button click event listener
  DOMInputs.submit.addEventListener('click', async (e) => {
      // prevent page reset
      e.preventDefault();
      // clear tracks
      UICtrl.resetTracks();
      //get the token
      var token = UICtrl.getStoredToken().token;        
      // get the playlist field
      var playlistSelect = UICtrl.inputField().playlist;
      // get track endpoint based on the selected playlist
      var tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
      // get the list of tracks
      var tracks = await APICtrl.getTracks(token, tracksEndPoint);
      // create a track list item
      tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
      
  });

  // create song selection click event listener
  DOMInputs.tracks.addEventListener('click', async (e) => {
      // prevent page reset
      e.preventDefault();
      UICtrl.resetTrackDetail();
      // get the token
      var token = UICtrl.getStoredToken().token;
      // get the track endpoint
      var trackEndpoint = e.target.id;
      //get the track object
      var track = await APICtrl.getTrack(token, trackEndpoint);
      // load the track details
      UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
  });    

  return {
      init() {
          console.log('App is starting');
          loadGenres();
      }
  }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();