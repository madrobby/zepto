$("body > section").first().addClass("current")

$("a.back").live("touchstart click", function (event) {
    $(".current").removeClass("current").addClass("reverse");
    var current = $(event.target).attr("href");
    $(current).addClass("current");
});

$(".menu a[href]").bind("touchstart click", function (event) {
  var p = event.target.parentNode.parentNode.parentNode;
  var prev_element = "#"+($(p).removeClass("current").addClass("reverse").attr("id"));
  $($(event.target).attr("href")).addClass("current")
  $(".current .back").remove()
  $(".current .toolbar").prepend("<a href=\""+prev_element+"\" class=\"back\">Back</a>");
})