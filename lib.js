function receiveSensorData(handler, webjackProfile) {
  webjackProfile = webjackProfile || "SoftModem";
  // nonsense to start up audio and get past the "click to play" policy
  var ac = getAudioContext();
  var getConnection = function() { return false }
  ac.suspend().then(function() {
    var myButton = createButton('click to start audio');
    myButton.position(0, 0);

    userStartAudio(myButton, function() {
      myButton.remove();

      // https://github.com/publiclab/webjack/blob/master/src/profiles.js
      var profile = WebJack.Profiles[webjackProfile];
      connection = new WebJack.Connection(profile);

      getConnection = function() { return connection }

      // runs every time a signal is 'heard'
      connection.listen(function(data) {

        // data from WebJack may look like "1,2,3"
        data = data.split(',').map(function(i) {
          return parseFloat(i)
        }); // so we break it apart using the commas, and make them floats

        handler(data, connection);
      });

    });
  });
  return getConnection;
}
