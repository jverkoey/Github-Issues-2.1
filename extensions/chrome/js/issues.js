
var Github = {};
Github.labels = {};

// TODO: Cache this request.
$.ajax({
  dataType: 'json',
  url: 'https://github.com/api/v2/json/issues/labels/facebook/three20',
  failure: function() {
    // TODO: Show an error on the page.
  },
  success: function(data) {
    Github.labels = data.labels;
  }
});

$(function() {

});
