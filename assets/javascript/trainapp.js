moment().format("MMMM Do YYYY, h:mm:ss a");

$(document).ready(function() {
  $("#currentTime").append(moment().format("hh:mm:ss A"));
  console.log("ready!");

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDLC7kZXVlB5DhxPeuUkJzMeTScGsXGyHQ",
    authDomain: "trainschedule-9cd76.firebaseapp.com",
    databaseURL: "https://trainschedule-9cd76.firebaseio.com",
    projectId: "trainschedule-9cd76",
    storageBucket: "",
    messagingSenderId: "795808002443"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // Initial Values
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";
  // Calculated Values
  var nextArrival = "";
  var minutesAway = 0;

  // Capture Form Values
  $("#trainSubmission").on("click", function(event) {
    event.preventDefault();

    trainName = $("#trainName-input")
      .val()
      .trim();
    destination = $("#destination-input")
      .val()
      .trim();
    firstTrainTime = $("#firstTrainTime-input")
      .val()
      .trim();
    frequency = $("#frequency-input")
      .val()
      .trim();

    // Code for the push
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  // Firebase watcher + table row loader
  database.ref().on(
    "child_added",
    function(childSnapshot) {
      $(".trainTable").append(
        "<tr><td class='trainName'> " +
          childSnapshot.val().trainName +
          " </td><td class='destination'> " +
          childSnapshot.val().destination +
          " </td><td class='frequency'> " +
          childSnapshot.val().frequency +
          " </td><td class='firstTrainTime'> " +
          childSnapshot.val().firstTrainTime +
          " </td></tr>"
      );

      // Handle the errors
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );
});
