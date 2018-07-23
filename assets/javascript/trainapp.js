moment().format('MMMM Do YYYY, h:mm:ss a');

$(document).ready(function() {
  $('#currentTime').html(moment().format('hh:mm:ss A'));
  console.log('ready!');
});
