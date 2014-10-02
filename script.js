/* Script for http://www.tooepic.com created by Ethan Sherbondy except where noted */

// Turns links into URLs and @s into profile links, extracted from tweet plugin by seaofclouds
function linkify(tweet) {
    var linkexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
    var profexp = /[\@]+([A-Za-z0-9-_]+)/gi;
    tweet = tweet.replace(linkexp, "<a href=\"$1\">$1</a>")
    .replace(profexp, "@<a href=\"http://twitter.com/$1\">$1</a>");
    return tweet;
}

// gives you random integer between -max and max
function randInt(max) {
    var sign, angle;
    if (Math.floor(Math.random()*2) == 0) {
        sign = -1;
    } else {
        sign = 1;
    }
    return sign*Math.floor(Math.random()*(max+1));
}

function updateData() {
    var aim_url = "http://api.oscar.aol.com/presence/get?k=th1FppOVikqenlyQ&f=json&t=thesherbondye&c=?";

    $.getJSON(aim_url, function(result) {
        $("a#chat").removeClass("online away offline idle")
        .addClass(result.response.data.users[0].state);
    });

    var twitter_call = "http://twitter.com/statuses/user_timeline/sherbondy.json?count=1&callback=?";

    $.getJSON(twitter_call, function(data) {
        var tweet = linkify(data[0].text);
        var id = "t-"+data[0].id;
        var $tp = $("#twitter p");
        if (id != $tp.attr("id")) {
            $tp.fadeOut(function() {
                $(this).html(tweet).attr("id", id).fadeIn();
            });
        }
    });

    var lastfm_call = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=sherbondy&api_key=95a5c200a625641bdaa9b091849f59c9&limit=3&format=json&callback=?";

    $.getJSON(lastfm_call, function(data) {
        var tracks = data.recenttracks.track;

        //only change values if the currently playing track isn't the latest one on tooepic
        if (tracks[0].name != $("#fm-0 .song").text()) {
            $.each(tracks, function(i, track) {
                var source = "/img/blank_insert.gif";
                if (track.image[2]['#text'] != "") {
                    source = track.image[2]['#text'];
                }

                var $li = $("#fm-"+i);
                $li.children("a").children().fadeOut(function() {
                    $li.removeClass("now_playing")
                    .children("a").attr("href", track.url)
                    .children("img").attr("src", source)
                    .attr("alt", track.album['#text'])
                    .siblings(".info")
                    .children(".song").text(track.name)
                    .siblings(".artist").text(track.artist['#text'])
                    .siblings(".album").text(track.album['#text']);

                    if (track["@attr"]) {
                        $li.addClass("now_playing");
                    }
                    $li.children("a").children().fadeIn();
                });
            });
        }
    });

}

var update = setInterval("updateData()", 1000*30);

$(function() {

    // For IE and the likes, friendly warning

    if (!jQuery.support.opacity) {
        $("#main").hide();
        $("#bad_browser").show();
    }
    $("#proceed a").click(function() {
        $("#bad_browser").hide();
        $("#main").show();
        return false;
    });

    if ($("#login").length != 0) {
        word = "";
        secret = "ethan";

        $(document).keypress(function(e) {
            switch(e.keyCode) {
                case 101:
                    word+="e";
                    break;
                case 116:
                    word+="t";
                    break;
                case 104:
                    word+="h";
                    break;
                case 97:
                    word+="a";
                    break;
                case 110:
                    word+="n";
                    break;
                case 13:
                    if (word == secret) {
                        window.location = $("#login").attr("href");
                    } else {
                        word = "";
                        break;
                    }
                default:
                    word = "";
            }
            if (word.length > secret.length) {
                word = "";
            }
        });
    }

    function showAlert(data) {
        $("#alert p").text(data.message);
        $("#alert").fadeIn().delay(2000).fadeOut("slow");
    }


    $("#admin a").click(function() {
        if (!$(this).parent().is("#logout")) {
            var url = $(this).attr("href")+"?json=1";

            $.getJSON(url, function(data) {
                showAlert(data);
            });
            return false;
        }
    });

    $("#status_link").click(function() {
        $("#status").fadeToggle(function() {
            if ($('#status').is(':visible')) {
                $('#message').focus();
            }
        });
        return false;
    });

    $("#status").submit(function() {
        args = $(this).serialize();
        args += '&json=1';
        console.log(args);
        $.post($(this).attr("action"), args, function(data) {
            showAlert(data);
            $("#status").fadeOut();
        });

        return false;
    });


    // Portfolio gallery javascript

    $("#samples a").click(function() {
        var id = $(this).attr("href"),
            content = $(this).siblings("div").html();
            linky = $(this).siblings("div").children(".visit").attr("href");

        if ($(this).parent().hasClass("current")) {
            $(this).parent().removeClass("current");
            $("#from_gallery").hide();
            $("#picture img").hide();
            $("#original").show();
            $("#ethan").show().addClass("top");
        } else {
            $("#picture img").removeClass("top");

            $(id).appendTo("#picture").addClass("top").show().wrap('<a href="'+linky+'" class="linky" />');

            $("#original").hide();
            $("#from_gallery").html(content).show();

            $("#gallery li").removeClass("current");
            $(this).parent().addClass("current");

            if ($("#picture img:visible").length > 3) {
                $("#picture img:visible:first").hide();
            }
        }

        return false;
    });

    // This stuff only matters if there are more than 5 items in the gallery.

    if ($("#samples li").length > 5) {

        $("#nav").show();

        $("#samples li:first").addClass("first");
        $("#samples li").eq(4).addClass("fifth");

        $("#middle a").data("state", "show");


        function shiftLeft() {
            if ($("#middle a").data("state") == "show") {
                $("#samples").animate({"marginLeft": "+=192px"}, 500);
            }
            $("#samples li.first").removeClass("first").prev().addClass("first");
            $("#samples li.fifth").removeClass("fifth").prev().addClass("fifth");
        }

        function shiftRight() {
            if ($("#middle a").data("state") == "show") {
                $("#samples").animate({"marginLeft": "-=192px"}, 500);
            }
            $("#samples li.first").removeClass("first").next().addClass("first");
            $("#samples li.fifth").removeClass("fifth").next().addClass("fifth");
        }

        function shiftBeginning() {
            if ($("#middle a").data("state") == "show") {
                $("#samples").animate({"marginLeft": "0px"}, 500);
            }

            $("#samples li").removeClass("first fifth");
            $("#samples li:first").addClass("first");
            $("#samples li").eq(4).addClass("fifth");

            if ($("#samples li").hasClass("current")) {
                $("#samples li:first").children("a").click();
            }
        }

        function shiftEnd() {
            var multiplier = $("#samples li").length - 5;
            var pixels = (-192*multiplier)+"px";

            if ($("#middle a").data("state") == "show") {
                $("#samples").animate({"marginLeft": pixels}, 500);
            }

            $("#samples li").removeClass("first fifth");
            $("#samples li").eq(multiplier).addClass("first");
            $("#samples li:last").addClass("fifth");

            if ($("#samples li").hasClass("current")) {
                $("#samples li:last").children("a").click();
            }
        }

        $("#samples a").click(function() {
            if ($(this).parent().is(".first")) {
                if ($(this).parent().is(":not(:first-child)")) {
                    shiftLeft();
                }
            } else if ($(this).parent().is(".fifth")) {
                if ($(this).parent().is(":not(:last-child)")) {
                    shiftRight();
                }
            }

            return false;
        });

        $("#prev a").click(function() {
            if ($("#samples li").hasClass("current") && $("#samples li:first").is(":not(.current)")) {
                $("#samples li.current").prev().children("a").click();
            } else if ($("#samples li:first").is(".first") || $("#samples li:first").is(".current")) {
                shiftEnd();
            } else {
                shiftLeft();
            }

            return false;
        });

        $("#next a").click(function() {
            if ($("#samples li").hasClass("current") && $("#samples li:last").is(":not(.current)")) {
                $("#samples li.current").next().children("a").click();
            } else if ($("#samples li:last").is(".fifth") || $("#samples li:last").is(".current")) {
                shiftBeginning();
            } else {
                shiftRight();
            }

            return false;
        });

        $("#middle a").click(function() {
            if ($(this).data("state") == "show") {
                var full_height = (Math.ceil($("#samples li").length / 5)*132)+"px";

                $("#samples").animate({"height": full_height}, 500, function() {
                    $(this).animate({"marginLeft": "0px"}, 500);
                });

                $("#samples li").removeClass("first fifth");
                $(this).data("state", "hide");
                $(this).text("Hide Some");
            } else {
                var curr_index = $("#samples li").index($(".current"));
                var multiplier,
                    pixels;

                if ($("#samples li.current").is(":last-child")) {
                    // if the current element is the last one
                    multiplier = curr_index-4;
                } else if (curr_index > 4) {
                    // if the current element is beyond the first five
                    multiplier = curr_index-3;
                } else {
                    // if the current element is in the first five
                    multiplier = 0;
                }
                $("#samples li").eq(multiplier).addClass("first");
                $("#samples li").eq(multiplier+4).addClass("fifth");

                pixels = (-192*multiplier)+"px";

                $("#samples").animate({"height": "132px"}, 500, function() {
                    $(this).animate({"marginLeft": pixels}, 500);
                });
                $(this).data("state", "show");
                $(this).text("Show All");
            }
            return false;
        });


        $("#samples a").bind("mouseover focus", function() {
            var new_text = $(this).siblings("div").children("h2").text();
            $("<span>"+new_text+"</span>").appendTo("#middle");
            $("#middle a").hide();
        }).bind("mouseout blur", function() {
            $("#middle span").remove();
            $("#middle a").show();
        });

    }

});

// handle the left/right and forward/back tilt.
// values range from -1.0 to 1.0
handleTilt = function(lr, fb){
  var shadow_amount = (lr*32)+'px '+(fb*32)+'px 16px rgba(0,0,0,0.75)';
  $('.box_shadow').each(function(i){
    $(this).css('box-shadow', shadow_amount);
  });
}


if (window.DeviceOrientationEvent){
  window.addEventListener('deviceorientation', function(e){
    var tiltLR = e.gamma/90;
    var tiltFB = e.beta/90;

    handleTilt(tiltLR, tiltFB);
  });
} else if (window.OrientationEvent){
  window.addEventListener('MozOrientation', function(e){
    var tiltLR = e.x;
    var tiltFB = e.y;

    handleTilt(tiltLR, tiltFB);
  });
}
