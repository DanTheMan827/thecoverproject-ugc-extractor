$(function(){
  var img = null;
  var lastUrl = null;
  var $mainForm = $("form#mainForm");

  function processImage(img){
    var rotate = $("#rotate").prop("checked")
    var c = document.createElement('canvas');
    c.id = "mainCanvas";
    if(rotate) {
      c.height = 1534;
      c.width = 2100;
    } else {
      c.width = 1534;
      c.height = 2100;
    }
    var ctx = c.getContext('2d');
    if(rotate){
      ctx.save();
      ctx.rotate(-90*Math.PI/180);
      ctx.drawImage(img, -3366, 0, 3366, 2100);
      ctx.restore();
    } else {
      ctx.drawImage(img, -1832, 0, 3366, 2100);
    }
    $("#mainImage").attr("src", c.toDataURL('image/png'));
    $mainForm.removeClass("loading").addClass("loaded");
  }

  $mainForm.on("submit", function(e) {
    e.preventDefault();

    var url = $("#url").val();

    if (url == lastUrl && img !== null) {
      processImage(img);
      return
    }

    if(!url.match(/^https?:\/\/www\.thecoverproject\.net\/download_cover\.php/i)){
      alert('Invalid URL.\n\nExample: http://www.thecoverproject.net/download_cover.php?file=n64_007-worldisnotenough.jpg')
      return;
    }
    
    $mainForm.addClass("loading");
    img = new Image;
    img.crossOrigin = "Anonymous";
    img.onload = function(e){
      try {
        processImage(img)
      } catch(err) {
        alert(err.message)
      }
    }
    img.onerror = function(err){
      alert('There was an error loading the image.')
    }
    img.src = url;

  })
})
