$(function() {
  if ($(window).width() > 700) {
    // desktop
    $("button.hide").removeClass("hide");
    $("#codeheader").text("Cyclops Interpreter");
    $("#interpreter").val("xHELPx\nxPRINTx math\nxPRINTx 44 6\nxPRINTx variables\nVARONE 50\nxPRINTx VARONE xSUBTRACTx 10\n\nxPRINTx functions\nxFUNCSTARTx FUNCONE\n   xPARAMONEx xMULTIPLYx xPARAMONEx\nxFUNCENDx\nFUNCONE 4\n");
    $("#consoler").html("Cyclops𐙀 𐄇𐄇𐄈 - CyclopsLang.org<br/>math<br/>𐄔<br/>variables<br/>𐄜<br/><br/>functions<br/>𐄐𐄌");
    $("#sideheader").text("Console Output");

    var editor = CodeMirror.fromTextArea($("#interpreter")[0], {
      lineNumbers: false,
      readOnly: ($(window).width() <= 700),
      mode: "text/javascript"
    });
  } else {
    var code = $("#interpreter").val().replace(/\n/g, '<br/>');
    $("#interpreter").parent().append($("<code>").html(code));
    $("#interpreter").remove();
  }

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
