// Shows current time (Military Style 24)
$('#currentTime').append(moment().format('HH:mm'));

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDLC7kZXVlB5DhxPeuUkJzMeTScGsXGyHQ',
  authDomain: 'trainschedule-9cd76.firebaseapp.com',
  databaseURL: 'https://trainschedule-9cd76.firebaseio.com',
  projectId: 'trainschedule-9cd76',
  storageBucket: '',
  messagingSenderId: '795808002443'
};

firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var trainName = '';
var destination = '';
var firstTrainTime = '';
var frequency = '';

// Capture Form Values
$('#trainSubmission').on('click', function(event) {
  event.preventDefault();

  trainName = $('#trainName-input')
    .val()
    .trim();
  destination = $('#destination-input')
    .val()
    .trim();
  firstTrainTime = moment(
    $('#firstTrainTime-input')
      .val()
      .trim(),
    'HH:mm'
  ).format('X');
  frequency = $('#frequency-input')
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

  // Clears all of the text-boxes
  $('#trainName-input').val('');
  $('#destination-input').val('');
  $('#firstTrainTime-input').val('');
  $('#frequency-input').val('');

  return false;
});

// Firebase watcher + table row loader
database.ref().on(
  'child_added',
  function(childSnapshot) {
    var trainNames = childSnapshot.val().trainName;
    var trainDest = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var theFirstTrain = childSnapshot.val().firstTrainTime;

    var timeRemainder =
      moment().diff(moment.unix(theFirstTrain), 'minutes') % trainFrequency;
    var timeInMin = trainFrequency - timeRemainder;

    var tArrival = moment()
      .add(timeInMin, 'm')
      .format('HH:mm');

    $('.trainTable').append(
      "<tr><td class='trainName'> " +
        trainNames +
        " </td><td class='destination'> " +
        trainDest +
        " </td><td class='frequency'> " +
        trainFrequency +
        " </td><td class='nextTrainArrival'> " +
        tArrival +
        "</td><td class='minutesToArrive'> " +
        timeInMin +
        '</td></tr>'
    );

    // Handle the errors
  },
  function(errorObject) {
    console.log('Errors handled: ' + errorObject.code);
  }
);
