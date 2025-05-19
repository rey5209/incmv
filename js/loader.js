window.addEventListener('load', function() {
  var progressBar = document.querySelector('.loader-progress-bar-inner');
  var duration = 2000; // 2 seconds
  var start = null;

  function animateProgressBar(timestamp) {
    if (!start) start = timestamp;
    var elapsed = timestamp - start;
    var percent = Math.min((elapsed / duration) * 100, 100);
    if (progressBar) {
      progressBar.style.width = percent + '%';
    }
    if (elapsed < duration) {
      requestAnimationFrame(animateProgressBar);
    } else {
      document.getElementById('loader-overlay').classList.add('hide');
    }
  }

  requestAnimationFrame(animateProgressBar);
});
