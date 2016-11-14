function runint(langname, cmds) {
  if ($(window).width() > 700) {
    // desktop
    var reviver = function(code) {
      var blocks = code.split(/\s+/g);
      if (blocks.length === 1) {
        blocks = code.split('<br/>');
      }
      for (var b = 0; b < blocks.length; b++) {
        if (cmds[blocks[b]]) {
          // command block
          var rg = new RegExp(blocks[b], 'g');
          code = code.replace(rg, cmds[blocks[b]]);
        }
      }
      code = code.replace(/xLANGNAMEx/g, langname);
      code = code.replace(/xVERSIONx/g, '1.0.0');
      code = code.replace(/xWEBSITEx/g, window.location.href);
      return code;
    };
    var interpside = reviver("xHELPx\nxPRINTx math\nxPRINTx 44 6\nxPRINTx variables\nVARONE 50\nxPRINTx VARONE xSUBTRACTx 10\n\nxPRINTx functions\nxFUNCSTARTx FUNCONE\n   xPARAMONEx xMULTIPLYx xPARAMONEx\nxFUNCENDx\nFUNCONE 4\n");
    var consolside = reviver("xLANGNAMEx xVERSIONx xWEBSITEx<br/>math<br/>50<br/>variables<br/>40<br/><br/>functions<br/>16");

    $("button.hide").removeClass("hide");
    $("#codeheader").text(langname + " Interpreter");
    $("#interpreter").val(interpside);
    $("#consoler").html(consolside);
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
    cyclops(code, langname, cmds, function (err, response) {
      $("#consoler").append(err || response);
    }, function (log) {
      $("#consoler").append(log + "<br/>");
    });
  });
}
