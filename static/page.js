(function ($) {
  function init () {
    $('#properties button').bind('click', function (e) {
      var url = '/otto?size=' + encodeURIComponent($('#properties input:radio[name=size]:checked').val())
                     + '&t1=' + encodeURIComponent($('#properties input[name=t1]').val())
                     + '&t2=' + encodeURIComponent($('#properties input[name=t2]').val())
                     + '&t3=' + encodeURIComponent($('#properties input[name=t3]').val())
      console.log(url);
      $('#image').attr('src', url);
      e.preventDefault();
    });
  }

  $(init);
})(jQuery);
