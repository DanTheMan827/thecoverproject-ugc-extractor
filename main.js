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
    
    if(!url.match(/^http?:\/\/www\.thecoverproject\.net\/download_cover\.php/i)){
      alert('Invalid URL.\n\nExample: http://www.thecoverproject.net/download_cover.php?file=n64_007-worldisnotenough.jpg')
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    $mainForm.addClass("loading");
    xhr.onload = function(e) {
      if (this.status == 200) {
        var reader = new FileReader();

        lastUrl = url;

        reader.onload = function(){
          // here you'll call what to do with the base64 string result
          img = new Image;
          img.onload = function(e){
            processImage(img)
          }
          img.src = this.result;

        };

        reader.readAsDataURL(this.response);
      } else {
        alert("There was an error loading the image, " + this.status + ".")
      }
    }
    xhr.onerror = function(err){
      alert("There was an error loading the image.\r\n\r\n" + err.message)
    }
    xhr.send();
  })
})