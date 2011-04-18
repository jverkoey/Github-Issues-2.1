$(function() {
  var prefix = location.pathname.split('/').slice(0, 3).join('/');
  var issue = location.pathname.split('/').pop();
  
  // Build the Issues 2.0 header bar.
  $('.view-pull-request').attr('id', 'issues_next').prepend(
    $('<div>').addClass('browser_header').append(
      $('<ul>').addClass('actions').append(
        $('<li>').addClass('search').append(
          $('<form>').attr({
            'action': prefix+'/issues/search',
            'method': 'get'
          }).append(
            $('<a>').attr('href', prefix+'/issues/search').html('Search:')
          ).append(
            $('<span>').addClass('fieldwrap').append(
              $('<input>').attr({
                'type': 'text',
                'name': 'q',
                'id': 'js-issues-quicksearch',
                'placeholder': 'Issues & Milestones…',
                'data-url': prefix+'/issues/quicksearch',
                'autocomplete': 'off',
                'style': 'outline-style: none; outline-width: initial; outline-color: initial;'
              }).bind("focus",
              function() {
                  $(this).closest(".fieldwrap").addClass("focused")
              }).bind("blur",
              function() {
                  $(this).closest(".fieldwrap").removeClass("focused")
              })
            ).append(
              $('<button>').attr({
                'type': 'submit',
                'class': 'minibutton'
              }).append(
                $('<span>').html('Search')
              )
            )
          ).append(
            $('<div>').addClass('autocomplete-results').attr({
              'style': 'left: 48px; top: 31px; width: 303px; display: none;'
            })
          ).append(
            $('<div>').addClass('quicksearch-loading').attr({
              'style': 'display:none'
            }).append(
              $('<a>').attr({
                'class': 'selected initial',
                'href': prefix+'/issues/search'
              }).html('See all results')
            ) // .quicksearch-loading
          ) // form
        ) // li.search
      ).append(
        $('<li>').append(
          $('<a>').attr({
            'href': prefix+'/issues/new',
            'class': 'minibutton btn-new-issue'
          }).append(
            $('<span>').append(
              $('<span>').addClass('icon')
            ).append('New Issue')
          )
        ) // li
      ) // ul.actions
    ).append(
      $('<ul>').addClass('main_nav').append(
        $('<li>').addClass('selected').append(
          $('<a>').attr('href', prefix+'/issues').html('Browse Issues')
        )
      ).append(
        $('<li>').append(
          $('<a>').attr('href', prefix+'/issues/milestones').html('Milestones')
        )
      ) // ul.main_nav
    ) // div.browser_header
  );
  
  // "Back to issue list" link.
  $('.pull-head').addClass('issue-head').prepend(
    $('<p>').addClass('back').append(
      $('<a>').attr({
        'href': prefix+'/issues?direction=desc&sort=created&state=open',
        'id': 'to_isssues_list'
      }).html('Back to issue list')
    ).attr('style', 'margin-right:20px')
  );
  
  // Wrap the discussion in the new show_issue div.
  $('#discussion_bucket').wrap('<div id="show_issue" />');
  
  // Issues editor
  $('.discussion-stats').append(
    $('<div>').addClass('rule')
  ).append(
    $('<div>').addClass('label-manager')/*.append(
      $('<a>').attr({
        'class': 'context-button minibutton js-label-context',
        'href': 'javascript:;'
      }).append(
        $('<span>').addClass('icon')
      ) // a.context-button
    )*/.append('Labels') // .label-manager
  ).append(
    $('<ul>').addClass('labels')
  );
  
  // Enables quicksearch.
  $('#js-issues-quicksearch').quicksearch({
    results: $(this).find(".search .autocomplete-results"),
    insertSpinner: function(f) {
      $("#js-issues-quicksearch").closest("form").prepend(f)
    }
  });
  
  // Update this issue's labels
  $.ajax({
    dataType: 'json',
    url: '/api/v2/json/issues/show'+prefix+'/'+issue,
    failure: function() {
      // TODO: Show an error on the page.
    },
    success: function(data) {
      var list = $('.discussion-stats .labels');
      for (var ix in data.issue.labels) {
        var label = data.issue.labels[ix];
        list.append(
          $('<li>').attr({
            'class': 'label labelstyle-'+label.replace(/[ ]+/, '').toLowerCase()
          }).append(
            $('<span>').addClass('name').append(label)
          )
        );
      }
    }
  });

});
