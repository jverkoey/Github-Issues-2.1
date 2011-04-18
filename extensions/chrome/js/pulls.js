
$(function() {
  $('.listings .listing').each(function() {
    var issueNumber = null;

    // Get the issue #
    $(this).children('h3').each(function() {
      issueNumber = $(this).children('a').first().attr('href').split('/').pop();
    });
    
    console.log(issueNumber);
  });
});
