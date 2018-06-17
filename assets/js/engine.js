/**
 * Fifa WorldCup 2018 Fixture Project
 * Developed by Hasin Hayder From HappyMonster
 * Author url: https://hasin.me & https://happymonster.me
 * Released under MIT license
 **/
var urlParams;
;(function ($) {
    $(document).ready(function () {

        $(".filter").on("click", function () {
            var filter = $(this).data("filter");
            $(".fixtures-body tr").hide();
            $(".fixtures-body tr." + filter).show();
        });

        init();

    });
})(jQuery);

function init() {
    $.getJSON("https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json", 
        function(data) {
            var allMatches = {};
            $.each(data.groups, function(entryIndex, entry) {
                //allMatches = allMatches ? allMatches.concat(this.matches) : this.matches;
                $.each(this.matches, function(entryIndex, entry) {
                    allMatches[this.name] = this;
                });
            });
            $.each(data.knockout, function(entryIndex, entry) {
                //allMatches = allMatches ? allMatches.concat(this.matches) : this.matches;
                $.each(this.matches, function(entryIndex, entry) {
                    allMatches[this.name] = this;
                });
            });
            console.log(allMatches);
            
            render(allMatches);
        }
    );
}

function render(matchResults) {
    for (var i in fixtures) {
        var team1 = countries[fixtures[i].p1] ? countries[fixtures[i].p1].code : "w";
        var team2 = countries[fixtures[i].p2] ? countries[fixtures[i].p2].code : "w";
        var class3 = "";

        var flag1 = countries[fixtures[i].p1] ? '<img class="mr-1" src="http://www.countryflags.io/' + countries[fixtures[i].p1].code + '/flat/32.png" alt="' + fixtures[i].p1 + '">' : "";
        var flag2 = countries[fixtures[i].p2] ? '<img class="mr-1" src="http://www.countryflags.io/' + countries[fixtures[i].p2].code + '/flat/32.png" alt="' + fixtures[i].p2 + '">' : "";

        if (i >= 48 && i <= 55) class3 = "k";
        else if (i >= 56 && i <= 59) class3 = "qf";
        else if (i >= 60 && i <= 61) class3 = "sf";
        else if (i == 62) class3 = "tf";
        else if (i == 63) class3 = "f";

        var matchSequence = i * 1 + 1;
        var matchId = parseInt(fixtures[i].id);
        
        var td0 = $("<td/>").html(myanmarNumbers(matchSequence, "my")).attr("width", "5%");
        var leftTeam = zawgyi.country[fixtures[i].p1] ? zawgyi.country[fixtures[i].p1] : fixtures[i].p1;
        var td1 = $("<td/>").attr('class', team1).html(flag1 + leftTeam).attr("width", "25%");
        var result = matchResults[matchId].finished ? matchResults[matchId].home_result + " - " + matchResults[matchId].away_result : "";
        var tdResult = $("<td/>").html(result).attr("width", "25%");
        var rightTeam = zawgyi.country[fixtures[i].p2] ? zawgyi.country[fixtures[i].p2] : fixtures[i].p2;
        var td2 = $("<td/>").attr('class', team2).html(flag2 + rightTeam).attr("width", "25%");
        var td3 = $("<td/>").html(fixtures[i].date).attr("width", "25%").addClass("date").data("date", fixtures[i].date);
        var td4 = $("<td/>").html(fixtures[i].time).attr("width", "20%").addClass("time").data("t24", fixtures[i].time24).data("t", fixtures[i].time);

        

        $("<tr/>").attr("id", "g" + (i * 1 + 1))
            .append([td0, td1, tdResult, td2, td3, td4])
            .data({
                "p1": fixtures[i].p1,
                "p2": fixtures[i].p2,
                "t24": fixtures[i].time24,
                "t": fixtures[i].time,
                "d": fixtures[i].date
            })
            .addClass(['all', team1, team2, class3])
            .appendTo($(".fixtures-body"));


            var filter_callback = function () {
                var c = $(this).attr('class');
                $(".fixtures-body tr").hide();
                $(".fixtures-body tr." + c).show();
                window.scrollTo(0, 500);
            };

            // $("li").on("click", filter_callback);
            // $("td:nth-child(2)").on("click", filter_callback);
            // $("td:nth-child(3)").on("click", filter_callback);
    }

    /*
    $("#timezone").on('change', function () {
        var tz = parseFloat($(this).val());
        var tzMinutes = (tz - parseInt(tz)) * 60;
        tzMinutes = tzMinutes ? tzMinutes : "00";
        var tzHours = parseInt(tz);
        if (tz > 0) {
            $(".fixtures-time-heading").html("Time (UTC/GMT + " + tzHours + ":" + tzMinutes + ")");
        } else {
            $(".fixtures-time-heading").html("Time (UTC/GMT - " + Math.abs(tzHours) + ":" + tzMinutes + ")");
        }
        convertTimeZone(tz);
    });
    */

    convertTimeZone(6.5); //Let's Set time to Myanmar Time

    //process query strings like http://fifawc.xyz/?utc=2
    //process query strings like http://fifawc.xyz/?utc=-4
    if(urlParams['utc']){
        $("#timezone").val(urlParams['utc']).trigger('change');
    }
}


function convertTimeZone(tz = "6") {
    $(".fixtures-body tr").each(function () {
        var date = $(this).find(".date").data("date");
        var time = $(this).find(".time").data("t");
        var dt = new Date(date + " " + time);
        dt.setTime(dt.getTime() + parseFloat(tz) * 3600 * 1000);
        //var newDate = dt.toLocaleString('en-US', {month: "long"}) + " " + dt.getDate() + ", " + dt.getFullYear();
        var newDate = myanmarNumbers(dt.getDate(), "my") + " " + zawgyi.month[dt.getMonth()];
        //var newTime = dt.toLocaleString('en-US', {hour: 'numeric', hour12: true, minute: 'numeric'});
        var hour = dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours();
        var amOrpm = dt.getHours() > 12 ? "ညေန" : "မနက္";
        var newTime = amOrpm + " " + myanmarNumbers(hour, "my") + ":" + myanmarNumbers(dt.getMinutes(), "my");
        $(this).find(".date").html(newDate);
        $(this).find(".time").html(newTime);
    });
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//parse query strings
//thanks to https://stackoverflow.com/a/2880929/727268
(window.onpopstate = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
})();
