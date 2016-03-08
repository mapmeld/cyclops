$(function() {
  if ($(window).width() > 700) {
    // desktop
    $("button.hide").removeClass("hide");
    $("#codeheader").text("Cyclops Interpreter");
    $("#interpreter").val("𐙀\n𐜝 math\n𐜝 𐄓𐄊 𐄌\n𐜝 variables\n𐝈𐜮 𐄝\n𐜝 𐝈𐜮 𐝔 𐄙\n\n𐜝 functions\n𐛪 𐝎𐝎\n   𐝈 𐙨 𐝈\n𐛫\n𐝎𐝎 𐄊\n");
    $("#consoler").html("Cyclops𐙀 𐄇𐄇𐄇 - CyclopsLang.org<br/>math<br/>𐄔<br/>variables<br/>𐄜<br/><br/>functions<br/>𐄐𐄌");
    $("#sideheader").text("Console Output");
  }

  var editor = CodeMirror.fromTextArea($("#interpreter")[0], {
    lineNumbers: false,
    readOnly: ($(window).width() <= 700),
    mode: "text/javascript"
  });

  $("button").click(function() {
    $("#consoler").html("");
    var code = editor.getValue();
    cyclops(code, function (err, response) {
      $("#consoler").append(err || response);
    }, function (log) {
      $("#consoler").append(log + "<br/>");
    });
  });
});
