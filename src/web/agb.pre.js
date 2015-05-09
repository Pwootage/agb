var Module = {
  print: function(text) { console.log(text); },
  printErr:function(text) { console.error(text); },
  preRun: function() {
    console.log("Preloading file...");
    FS.createPreloadedFile("/", "test.gb", "test.gb", true, true);
    FS.createPreloadedFile("/", "test2.gb", "test2.gb", true, true);
  }
};
