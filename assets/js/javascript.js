var config = {
  apiKey: "AIzaSyC91Z9R2dE6roRjCfuBpPIfF-JbRtO7GsI",
  authDomain: "trainschedule-cdb7a.firebaseapp.com",
  databaseURL: "https://trainschedule-cdb7a.firebaseio.com",
  projectId: "trainschedule-cdb7a",
  storageBucket: "",
  messagingSenderId: "420776795394"
};

firebase.initializeApp(config);

const database = firebase.database();

$("#add-train-btn").on("click", function(event){
  event.preventDefault();

  const trainName = $("#train-name-input").val().trim();
  const destination = $("#destination-input").val().trim();
  const firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").format("hh:mm");
  const frequency = $("#frequency-input").val().trim();

  console.log(firstTrain);

  const newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency 
  };

  database.ref().push(newTrain);

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  const trainName = childSnapshot.val().name;
  const destination = childSnapshot.val().destination;
  const firstTrain = childSnapshot.val().firstTrain;
  const frequency = childSnapshot.val().frequency;

  const nextInfo = next(firstTrain, frequency);
  let nextArrival = nextInfo.nextArrival;
  let minutesAway = nextInfo.minutesAway;

  $("#train-table > tbody").append(
    "<tr><td>" + trainName +
    "</td><td>" + destination +
    "</td><td>" + frequency +
    "</td><td>" + nextArrival +
    "</td><td>" + minutesAway +
    "</td></tr>"
  );

});

function next(time, frequency){
  let currentTime = moment(moment(), "hh:mm");
  let difMinutes = moment(time, "HH:mm").diff(moment(), "minutes");
  console.log(difMinutes, difMinutes%frequency);
  let minutesAway = frequency - Math.abs(difMinutes%frequency);
  console.log(minutesAway);
  currentTime.add(minutesAway, "minutes");
  const nextArrival = moment(currentTime).format("hh:mm a");

  return { nextArrival: nextArrival, minutesAway: minutesAway};
}





