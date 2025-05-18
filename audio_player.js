/**
 * Background audio player
 * Plays ambient music that persists across page navigation
 * Uses session storage to remember playback position between page loads
 */

// Audio element
let backgroundAudio = null;
// Is audio initialized?
let audioInitialized = false;
// Volume level
const audioVolume = 0.3;

document.addEventListener('DOMContentLoaded', function() {
  // Setup background audio system
  initBackgroundAudio();
  
  // Create audio controls
  createAudioControls();
});

/**
 * Initialize the background audio system
 */
function initBackgroundAudio() {
  // Create audio element if it doesn't exist
  if (!backgroundAudio) {
    backgroundAudio = new Audio('../media/Lil Peep & XXXTENTACION vs. Childish Gambino - Falling Heartbeat (Mashup).mp3');
    backgroundAudio.loop = true;
    backgroundAudio.volume = audioVolume;
  }
  
  // Try to restore playback position from session storage
  const playbackTime = sessionStorage.getItem('audioPlaybackTime');
  const isPlaying = sessionStorage.getItem('audioIsPlaying');
  
  if (playbackTime) {
    backgroundAudio.currentTime = parseFloat(playbackTime);
  }
  
  // Auto-play if it was playing before (and if allowed by browser)
  if (isPlaying === 'true') {
    // Use a play promise to catch autoplay restrictions
    const playPromise = backgroundAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.then(_ => {
          // Autoplay succeeded
          audioInitialized = true;
        })
        .catch(error => {
          // Autoplay prevented, show play button
          audioInitialized = false;
          showPlayButton();
        });
    }
  } else {
    // Audio was paused, show play button
    showPlayButton();
  }
  
  // Save position before page unload
  window.addEventListener('beforeunload', saveAudioState);
}

/**
 * Save the current audio playback state to session storage
 */
function saveAudioState() {
  if (backgroundAudio) {
    sessionStorage.setItem('audioPlaybackTime', backgroundAudio.currentTime.toString());
    sessionStorage.setItem('audioIsPlaying', (!backgroundAudio.paused).toString());
  }
}

/**
 * Create the audio control button
 */
function createAudioControls() {
  // Create audio control container
  const audioControl = document.createElement('div');
  audioControl.id = 'audio-control';
  audioControl.className = 'audio-control';
  
  // Create the button
  const audioButton = document.createElement('button');
  audioButton.id = 'audio-button';
  audioButton.className = 'audio-button';
  audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  audioButton.title = 'Toggle background music';
  
  // Add click handler
  audioButton.addEventListener('click', toggleAudio);
  
  // Add elements to the DOM
  audioControl.appendChild(audioButton);
  document.body.appendChild(audioControl);
  
  // Update button state
  updateAudioButton();
}

/**
 * Toggle the background audio play/pause
 */
function toggleAudio() {
  if (!backgroundAudio) return;
  
  if (backgroundAudio.paused) {
    // Play audio
    backgroundAudio.play();
    audioInitialized = true;
  } else {
    // Pause audio
    backgroundAudio.pause();
  }
  
  // Update button state
  updateAudioButton();
}

/**
 * Update the audio button to reflect the current play state
 */
function updateAudioButton() {
  const button = document.getElementById('audio-button');
  if (!button) return;
  
  if (backgroundAudio && !backgroundAudio.paused) {
    // Audio is playing
    button.innerHTML = '<i class="fas fa-volume-up"></i>';
    button.classList.add('active');
  } else {
    // Audio is paused
    button.innerHTML = '<i class="fas fa-volume-mute"></i>';
    button.classList.remove('active');
  }
}

/**
 * Show the play button (for browsers that block autoplay)
 */
function showPlayButton() {
  const button = document.getElementById('audio-button');
  if (!button) return;
  
  // Update button to show it's not playing
  button.innerHTML = '<i class="fas fa-volume-mute"></i>';
  button.classList.remove('active');
  
  // Add a pulse animation to draw attention
  button.classList.add('pulse');
  
  // Remove the pulse after a few seconds
  setTimeout(() => {
    button.classList.remove('pulse');
  }, 5000);
}