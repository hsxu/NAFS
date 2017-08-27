/*Global save of a file.*/
/*jshint -W004 */
var xmlConfig;

/*
Changelog:
2015-10-16 2.0:
-Re-organised all the code.
*/

/*The standard data.*/
var serverTimezones = {"en" : " GMT+0000", "zz" : " GMT+0100", "no" : " GMT+0100"};
var unitSpeed = {"spear": 18, "sword": 22, "axe": 18, "archer": 18, "spy": 9, "light": 10, "marcher": 10, "heavy": 11, "ram": 30, "catapult": 30};

var troopList = ["spear", "sword", "axe", "archer", "spy", "light", "marcher", "heavy", "ram", "catapult", "knight"]; /*Ignore snob*/
var commonTroopNames = [["spearman", "spear"], ["swordman", "sword"], ["axeman", "axe"], ["scout", "spy"], ["lc", "light"], ["light cavalry", "light"], ["ma", "marcher"], ["mounted archer", "marcher"], ["heavy cavalry", "heavy"], ["hc", "heavy"], ["cat", "catapult"], ["paladin", "knight"]];

var ramsRequired = [0, 2, 4, 7, 10, 14, 19, 24, 30, 37, 45, 55, 65, 77, 91, 106, 124, 143, 166, 191, 219]; /* to break a wall at [i] level to 0.*/
var ramsMin = [0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6]; /*to break a wall at [i] level by 1 level*/
var catsRequiredToBreak = [
    /*[0,30] = from 30 to 0*/
    /*From:[0,1,2, 3, 4, 5, 6, 7, 8, 9,10,11,12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,  29,  30]*/
    /*To:*/
    /* 0*/ [0,2,6,10,15,21,28,36,45,56,68,82,98,115,136,159,185,215,248,286,328,376,430,490,558,634,720,815,922,1041,1175],
    /* 1*/ [0,0,2, 6,11,17,23,31,39,49,61,74,89,106,126,148,173,202,234,270,312,358,410,469,534,508,691,784,888,1005,1135],
    /* 2*/ [0,0,0, 2, 7,12,18,25,33,43,54,66,81, 97,116,137,161,189,220,255,295,340,390,447,511,583,663,754,855, 968,1095],
    /* 3*/ [0,0,0, 0, 3, 7,13,20,27,36,47,59,72, 88,106,126,149,176,206,240,278,321,370,425,487,557,635,723,821, 932,1055],
    /* 4*/ [0,0,0, 0, 0, 3, 8,14,21,30,40,51,64, 79, 96,115,137,163,192,224,261,303,350,403,463,531,607,692,788, 895,1015],
    /* 5*/ [0,0,0, 0, 0, 0, 3, 9,15,23,32,43,55, 69, 86,104,126,150,177,209,244,285,330,382,440,505,579,661,754, 859, 976],
    /* 6*/ [0,0,0, 0, 0, 0, 0, 3, 9,17,25,35,47, 60, 76, 93,114,137,163,193,227,266,310,360,416,479,550,631,721, 822, 936],
    /* 7*/ [0,0,0, 0, 0, 0, 0, 0, 3,10,18,28,38, 51, 66, 82,102,124,149,178,211,248,290,338,392,453,522,600,687, 786, 896],
    /* 8*/ [0,0,0, 0, 0, 0, 0, 0, 0, 4,11,20,30, 42, 56, 72, 90,111,135,162,194,230,270,316,368,427,494,569,654, 749, 856],
    /* 9*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 4,12,22, 33, 46, 61, 78, 98,121,147,177,211,250,294,345,401,466,538,620, 713, 816],
    /*10*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 4,13, 23, 36, 50, 66, 85,107,132,160,193,230,273,321,376,438,508,587, 676, 777],
    /*11*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 14, 26, 39, 54, 72, 92,116,143,175,210,251,297,350,409,477,553, 640, 737],
    /*12*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  5, 16, 28, 42, 59, 78,101,127,156,190,229,273,324,381,446,520, 603, 697],
    /*13*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  6, 17, 30, 46, 64, 85,110,138,170,207,250,298,353,415,486, 567, 657],
    /*14*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  6, 18, 33, 50, 70, 93,120,150,186,226,272,325,385,453, 530, 617],
    /*15*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  6, 20, 36, 54, 76,101,130,164,202,246,297,354,419, 493, 578],
    /*16*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  7, 22, 39, 59, 83,110,142,178,220,268,323,386, 457, 538],
    /*17*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  8, 24, 43, 65, 90,120,155,195,240,292,352, 420, 498],
    /*18*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  8, 26, 46, 70, 98,131,169,212,262,319, 384, 458],
    /*19*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  9, 28, 50, 77,107,143,184,231,285, 347, 418],
    /*20*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0, 10, 30, 55, 84,117,156,200,252, 311, 379],
    /*21*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 10, 33, 60, 91,127,170,218, 274, 339],
    /*22*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 36, 65, 99,139,185, 238, 299],
    /*23*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12, 39, 71,108,151, 201, 259],
    /*24*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13, 43, 77,118, 165, 219],
    /*25*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 47, 84, 128, 180],
    /*26*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 16, 51,  92, 140],
    /*27*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  55, 100],
    /*28*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  19,  60],
    /*29*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,   0,  20],
    /*30*/ [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,   0,   0]
];
var catsMin = [0,2,2,2,3,3,3,3,3,4,4,4,5,5,6,6,6,7,8,8,9,10,10,11,12,13,15,16,17,19,20]; /*to break a building at level [i] by 1*/

var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]; /*To get UTC-ize dates!*/
var _a = { /*translations. Duh*/
    "en" : {
        "Headquarters" : "Headquarters",
        "Barracks" : "Barracks",
        "Stable" : "Stable",
        "Workshop" : "Workshop",
        "Church" : "Church",
        "First church" : "First church",
        "Academy" : "Academy",
        "Smithy" : "Smithy",
        "Rally point" : "Rally point",
        "Statue" : "Statue",
        "Market" : "Market",
        "Timber camp" : "Timber camp",
        "Clay pit" : "Clay pit",
        "Iron mine" : "Iron mine",
        "Farm" : "Farm",
        "Warehouse" : "Warehouse",
        "Hiding place" : "Hiding place",
        "Wall" : "Wall",
        "Please run this from the 'attacks' menu!" : "Please run this from the 'attacks' menu on the reports page (not all)!",
        "SAVED" : "SAVED",
        "Saved" : "Saved",
        "NOT SAVED" : "NOT SAVED (Village disabled?)",
        "Are you sure you've imported some reports?" : "Are you sure you've imported some reports?",
        "Changed" : "Changed",
        "Attack on" : "Attack on",
        "No villages left to attack! Either add more villages, or wait for the attacks to complete." : "No villages left to attack! Either add more villages, or wait for the attacks to complete.",
        "Add to farm list for " : "Add to farm list for ",
        "Enable farm for " : "Enable farm for ",
        "Disable farm for " : "Disable farm for ",
        "Added" : "Added",
        "Enabled" : "Enabled",
        "Disabled" : "Disabled",
        "Level" : "Level",
        "jan" : "Jan",
        "feb" : "Feb",
        "mar" : "Mar",
        "apr" : "Apr",
        "may" : "May",
        "jun" : "Jun",
        "jul" : "Jul",
        "aug" : "Aug",
        "sep" : "Sep",
        "oct" : "Oct",
        "nov" : "Nov",
        "dec" : "Dec",
        "Coordinates" : "Coordinates",
        "Tribe" : "Tribe",
        "Actions" : "Actions",
        "Defender" : "Defender"
    }
};

/*The two letter acronym (typically) for the world. e.g. en, zz, no, de.*/
var worldLetters = window.location.host.split(/\W+/)[0].substring(0, 2);

/*Temporary local copy.*/
var settings;

function getLocalStorage() {
    if (!localStorage){ alert("Local storage doesn't seem to be enabled. NAFS won't function without it!"); throw "Whoops. Local storage isn't enabled, apparently."; }
    if (!localStorage.NAFSData) { 
        localStorage.NAFSData = '{"villages":{}, "settings":{}}';
        setSetting('distance_calced_from', '500|500');
    }
    if (typeof settings === "undefined") settings = JSON.parse(localStorage.NAFSData);
    return settings;
}

function setLocalStorage(data){
    if (typeof data === "undefined") data = settings;
    localStorage.NAFSData = JSON.stringify(data);
}

/*Fetch the language from the localStorage settings.*/
function getCurrentLang() {
    return getSetting("lang", _a[worldLetters] && worldLetters || "en");
    /*Return the "lang" setting, or else if there's a translation for the current world's code, return that, or else "en".*/
}

/*Return the localised version.*/
function _(translateID){
    return (typeof _a[getCurrentLang()] !== "undefined" && _a[getCurrentLang()][translateID]) || translateID;
    /*If there are translations for the current language, and there exists a translation for this thing, use that. Else, return the translation's ID.*/
}

var buildingList = ["barracks", "rally", "stable", "garage", "snob", "smith", "statue", "market", "main", "farm", "wall"];

function getQuery(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getQueryFromHaystack(haystack, name){
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(haystack);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getXML() {
    if (typeof xmlConfig === "undefined"){
        if (window.XMLHttpRequest){
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET", window.location.protocol + "//" + window.location.host + "/interface.php?func=get_config", false);
        xmlhttp.send();
        xmlConfig = xmlhttp.responseXML;
    }
    return xmlConfig;
}

function getWorldSpeed() {
    return parseFloat(getXML().getElementsByTagName("speed")[0].childNodes[0].nodeValue);
}

function getUnitSpeed() {
    return parseFloat(getXML().getElementsByTagName("unit_speed")[0].childNodes[0].nodeValue);
}

function getLocalCoords() {
    var temp = $("#menu_row2 b.nowrap").text();
    temp = splitOutCoords(temp, true);
    temp = temp.split("|").length > 1 && temp.split("|");
    /*Split "VillName (XXX|YYY) into ("XXX","YYY")*/
    return temp;    
}


/*Fetch a setting from the localStorage*/
function getSetting(name, def){
    var nafsData = getLocalStorage();
    if (typeof nafsData.settings !== "undefined" && typeof nafsData.settings[name] !== "undefined") {
        return nafsData.settings[name];
    }  
    return def; 
}

/*Save a setting to the localStorage*/
function setSetting(name, val){
    var nafsData = getLocalStorage();
    if (typeof nafsData.settings === "undefined") nafsData.settings = {};

    nafsData.settings[name] = val;
    setLocalStorage(nafsData);

    return true;
}

//String: home, dest
function calcDistance(home, dest) {
    return (Math.floor(Math.sqrt(Math.pow(parseInt(dest.split("|")[0])-home.split("|")[0],2)+Math.pow(parseInt(dest.split("|")[1])-home.split("|")[1],2))*100)/100);
}

function addReport(reportID, localCoords, vilCoords, wood, clay, iron, battleTime, buildings){
    if (typeof vilCoords === "object") vilCoords = vilCoords[0] + "|" + vilCoords[1];
    if (typeof localCoords === "object") localCoords = localCoords[0] + "|" + localCoords[1];
    var nafsData = getLocalStorage();
    if (!nafsData.villages) nafsData.villages = {};
    if (!nafsData.villages[localCoords]) nafsData.villages[localCoords] = [];

    var vilIndex;
    nafsData.villages[localCoords].forEach(function(element, index) {
        if (element.coords === vilCoords) vilIndex = index;
    });


    if (typeof vilIndex === "undefined"){
        var mainVillTestCoords = "500|500";

        vilIndex = nafsData.villages[localCoords].push({
            coords: vilCoords,
            disabled: false,
            distance: (Math.floor(Math.sqrt(Math.pow(parseInt(vilCoords.split("|")[0])-mainVillTestCoords.split("|")[0],2)+Math.pow(parseInt(vilCoords.split("|")[1])-mainVillTestCoords.split("|")[1],2))*100)/100),
            reports: [ ]
        });
        nafsData.villages[localCoords].forEach(function(element, index) {
            if (element.coords === vilCoords) vilIndex = index;
        });
    }

    if (typeof vilIndex === "undefined"){
        /*Something has gone wrong! Not there even after we created it!*/
        throw "Something has gone seriously wrong. Pushing an item to an array didn't result in said item being in said array. Since when? Broken Javascript?";
    }

    if (nafsData.villages[localCoords][vilIndex].disabled){
        return "Disabled";
    }

    buildingList.forEach(function(element, index){
        if (typeof buildings[element] === "undefined") buildings[element] = 0;
    });

    battleTime = Number(battleTime);
    var reportIndex = false;
    nafsData.villages[localCoords][vilIndex].reports.forEach(function(element, index) {
        if (element.reportID === reportID) reportIndex = index;
    });

    if (reportIndex) return "Report already imported.";

    nafsData.villages[localCoords][vilIndex].reports.push({
        "reportID" : reportID,
        "battleTime" : battleTime,
        "wood" : wood,
        "clay" : clay,
        "iron" : iron,
        "buildings" : buildings
    });

    nafsData.villages[localCoords][vilIndex].reports.sort(function(a, b) {
        return b.battleTime - a.battleTime;
    });

    /*If we have more than one report in the list, delete the others. (o.e?)*/
    while (nafsData.villages[localCoords][vilIndex].reports.length > 1) {
        nafsData.villages[localCoords][vilIndex].reports.pop();
    }

    setLocalStorage(nafsData);
    return true;
}

function fixTroopName(troopName) {
    troopName = troopName.toLowerCase().trim();
    for (var troopNameID in commonTroopNames){
        if (troopName.indexOf(commonTroopNames[troopNameID][0].toLowerCase().trim()) !== -1) {
            troopName = commonTroopNames[troopNameID][1];
        }
    }
    return troopName;
}

function getMaxTroops() {
    if (getQuery("screen") !== "place"){
        console.log("Wrong screen. Should be at rally point.");
        return "Wrong screen.";
    }

    var troopCounts = {};
    for (var troopID in troopList) {
        var troopInput = $("#unit_input_" + troopList[troopID]);
        if (troopInput.length > 0) {
            var parentText = troopInput.parent().text();
            var meaningful = false;
            if (parentText.split("(").length > 1){
                parentText = parentText.split("(")[1];
                if (parentText.split(")").length > 1) {
                    parentText = parentText.split(")")[0];
                    if (parseInt(parentText).toString() == parentText){
                        troopCounts[troopList[troopID]] = parseInt(parentText);
                        meaningful = true;
                    }
                }
            }
            if (!meaningful){
                console.log("Something seems to be wrong with the max number of " + troopList[troopID] + ".");
            }
        }
    }
    return troopCounts;
}

function getMaxTroop(troopName) {
    return getMaxTroops()[fixTroopName(troopName)];
}

function errorBox(msg){
    if (getQuery("screen") === "place" && ($("#units_form").length > 0 || $("#command-data-form").length > 0)) {
        /*Regular rally page.*/
        if ($("#nafserror").length > 0) {
            $("#nafserror").text($("#nafserror").text() + "\n" + msg);
        } else {
            var errorBo = $("<span id='nafserror'></span>").css("color", "#F00");
            errorBo.text(msg);
            $($("#units_form table, #command-data-form table").get(0)).before(errorBo);
        }
    } else if (getQuery("screen") === "report" && getQuery("view") === "") {
        var warning = ($("#nafswarning").length > 0 ? $("#nafswarning") : $("<span id='nafswarning'>")).css({"color":"#F00","font-weight":"bold"}).text(msg);
        $("#report_list").before(warning);
    }
}

function splitOutCoords(str, num, removeBrackets){
    str = str.trim();
    if (typeof num === "boolean"){
        if (typeof removeBrackets === "undefined") {
            removeBrackets = num;
            num = undefined;
        } else if (typeof removeBrackets === "number"){
            temp = removeBrackets;
            removeBrackets = num;
            num = temp;
        }
    }
    if (typeof num === "undefined") num = 1;

    if (typeof removeBrackets === "undefined") removeBrackets = false;
    num = parseInt(num);

    var results = str.match(/\((\d{2}|\d{3})\|(\d{2}|\d{3})\)/g);
    if (typeof results !== "object") return false;

    var index = num > 0 ? num-1 : num === 0 ? 0 : results.length+num;
    if (0 <= index && index < results.length)
        return removeBrackets ? results[index].split("(")[1].split(")")[0] : results[index];
    else return false;
}

function insertTroops(troops) {
    $("[id*='unit_input_']").val("");
    for (var troop in troops) {
        var troopName = "";
        for (var troopID in troopList) {
            if (fixTroopName(troop) === troopList[troopID]) {
                troopName = troopList[troopID];
            }
        }
        $("#unit_input_" + troopName).val(troops[troop]);
    }
}

function targetVil(vilCoords){
    if (vilCoords.indexOf(")") !== -1) vilCoords = vilCoords.match(/(\d{2}|\d{3})\|(\d{2}|\d{3})/g)[0];
    $("#inputx").val(vilCoords.split("|")[0]);
    $("#inputy").val(vilCoords.split("|")[1]);
    $("#unit_input_spear").focus();
}

function def() {
    const SCREEN = "screen";
    const REPORT = "report";

    //Resort when rally point is changed. Will have to be moved into the rally point.

    //Hit walls only - first mode.
    //Hit with catapults - second mode.
    //Building levels need to be changed after presumed hit. 

    var nafsData = getLocalStorage();
    //var localCoords = getLocalCoords();
    var testLocalCoords = ["500", "500"];
    var localCoords = testLocalCoords;

    var localData = nafsData.villages[localCoords] || nafsData.villages[localCoords[0] + "|" + localCoords[1]];
    var isReportScreen = getQuery(SCREEN) === REPORT;
    var isRallyConfirmScreen = getQuery(SCREEN) === "place" && 
                               $("#units_form").length === 0 && 
                               $("#command-data-form").length === 0;
    var isRallyScreen = getQuery(SCREEN) === "place" && 
                        ($("#units_form").length > 0 || $("#command-data-form").length > 0);
    var isSortScreen = getQuery(SCREEN) === "info_village";


    if (isReportScreen) {
        executeReportLogic();
    } else if (isRallyConfirmScreen) {
        executeRallyConfirmLogic(localData);
    } else if (isRallyScreen) {
        executeRallyLogic(localData, localCoords, nafsData);
    } else if (isSortScreen) {
        executeSortLogic(localData, localCoords, nafsData);
    }
    setLocalStorage(nafsData);
}

function executeReportLogic() { 
    if (getQuery("view") === "" && getQuery("mode") === "attack") {
        /*Report: Attack menu*/
        var timeOut = 100;
        $("#report_list tr:has(td) .quickedit-content").each(function(index, element) {
            console.log("Iterating report: timeout, " + timeOut);

            var reportURL = $("a", this);
            if (reportURL.length < 1) {
                /*This report has no URL. Woo?*/
                this.innerHTML += " - no report URL";
            } else {
                reportURL = reportURL.attr("href"); 
                var reportElement = this;
                setTimeout(function() {
                    var ajx = jQuery.ajax(reportURL, {
                        type: "GET",
                        dataType: "html",
                        async: true,
                        error: function(jqXHR, textStatus, errorThrown) {
                            reportElement.innerHTML += " - report failed to load (see console for more info)";
                            console.log("Report failed to load via AJAX. Status: " + textStatus + "; error: " + errorThrown);
                        },
                        success: function(responseData, textStatus, jqXHR) {
                            var fakeDOM = $("<div>");
                            var first = fakeDOM.get(0);
                            first.class = "NAFSReportDOM";
                            fakeDOM.html(responseData);

                            var progressReport = processReport(fakeDOM, getQueryFromHaystack(reportURL, "view"));

                            if (progressReport === true) {
                                reportElement.innerHTML += " - " + _("Saved");

                                var reportCheckbox = $("input[type=\'checkbox\']", $(reportElement).parents("#report_list tr"));
                                if (reportCheckbox.length === 1) {
                                    reportCheckbox.prop("checked", true);
                                } else {
                                    console.log("Couldn't check box of element " + index);
                                }
                            } else {
                                reportElement.innerHTML += " - " + progressReport;
                            }
                            /*Cleanup*/
                            fakeDOM.html("");
                        }
                    });
                }, timeOut);
            }
            timeOut += 100;

        });
    } else if (getQuery("view") !== "") {
        /*We're on an individual report!*/
        processReport(document, getQuery("view"));
    } else if (getQuery("view") === "" && (getQuery("mode") === "all" || getQuery("mode") === "")) {
        errorBox(_("Please run this from the 'attacks' menu!"));
    }
}

function executeRallyConfirmLogic(localData) {
    /*Rally confirm page.*/
    if (!localData) {
        errorBox(_("Are you sure you've imported some reports?"));
        return;
    }

    var targetCoords = splitOutCoords($(".village_anchor").text(), true);
    var vilIndex;
    localData.forEach(function(element, index) {
        if (element.coords === targetCoords) vilIndex = index;
    });
    if (typeof vilIndex === "undefined") {
        errorBox(_("Are you sure this village is in the NAFS list?"));
        $("#troop_confirm_go").focus();
        return;
    }
    var nafsLocalData = localData;
    var targetVillage = nafsLocalData[vilIndex];
    var latestReport = targetVillage && targetVillage.reports && targetVillage.reports[0];
    $("#troop_confirm_go").focus();
}

function executeRallyLogic(localData, localCoords, nafsData) {
    /*Rally page.*/
    if (!localData) {
        errorBox(_("Are you sure you've imported some reports?"));
        return;
    }

    console.log("Version 0.1");

    // Change distance_calced_from and recalc all distances and sort, if distance_calced from is not from current village.
    var distance_calced_from = getSetting("distance_calced_from", 0);
    var coords_arr = getLocalCoords();
    var string_local_coords = coords_arr[0] + "|" + coords_arr[1];
    var string_origin = "500|500";

    if (distance_calced_from !== string_local_coords) {
        setSetting("distance_calced_from", string_local_coords);

        localData.forEach(function(element, index) {
            element.distance = calcDistance(string_local_coords, element.coords);
        });

        localData.sort(function(a, b) {
            return a.distance - b.distance;
        });

        nafsData.villages[string_origin] = localData;
        console.log("villages sorted and stored.")
    }

    var errorBo = $(".error_box");
    if (errorBo.length > 0) {
        if (errorBo.text().trim().indexOf("can only attack each other when the bigger player's") !== -1 || errorBo.text().trim().indexOf("has been banned and cannot be attacked") !== -1) {
            var vilCoords = $(".village-name");
            var coordsFound = false;
            if (vilCoords.length > 0) {
                vilCoords = splitOutCoords(vilCoords.text(), true);
                if (vilCoords){
                    var vilIndex;
                    localData.forEach(function(element, index) {
                        if (element.coords === vilCoords) vilIndex = index;
                    });
                    if (typeof vilIndex !== "undefined") {
                        coordsFound = true;
                        localData[vilIndex].disabled = true;
                        $(".error_box").html("Previous farm disabled. Please <a href='" + window.location.href.replace("&try=confirm", "") .replace(/\&target\=\d*/, "") + "'>reopen the rally point</a>)");
                    }
                }
            }
            if (!coordsFound) {
                errorBox("Unable to disable village. Is it in the NAFS list?");
            }
        }
    } else {
        var troopsEntered = false;

        // How far away is each village?
        // What's the time limit by ram?

        // What's the criteria to cat down a village? HQ > 5?
        // How many axes to send?
        // What to do when the list repeats?
        // What to do with localstorage after a report has been sent?

        if (!nafsData.villaIndex) {
            nafsData.villaIndex = 0;
            localData.sort(function(a, b) {
                return a.distance - b.distance;
            });
        }

        if (!nafsData.currVillaHQ) {
            nafsData.currVillaHQ = 0;
        }

        nafsData.villages[string_origin] = localData;

        if (nafsData.villaIndex > localData.length - 1) {
            console.log("Index too high, clear LocalStorage!");
            return;
        }

        for (var i = nafsData.villaIndex; i < localData.length; i++) { 
            element = localData[i];

            var latestReport = element.reports && element.reports[0];
            if (!latestReport) { 
                console.log("Latest report not found.");
                return;
            }

            var targetCoords = element.coords;
            var troops = {spy: 0};
            troops.axe = 100;

            var wallLevel = latestReport.buildings.wall;                           
            var ramCount = ramsRequired[wallLevel + 1];
            troops.ram = ramCount;
            console.log("Ram wall shaping! Village " + targetCoords);

            /*var HQLevel;
            
            if (nafsData.currVillaHQ == 0) {
                nafsData.currVillaHQ = latestReport.buildings.main;
            }

            if (nafsData.currVillaHQ == 1) {
                nafsData.currVillaHQ = 0;
                nafsData.villaIndex++;
                continue;
            }

            var catCount = catsMin[nafsData.currVillaHQ + 1];
            if (getMaxTroop("catapult") > catCount) {
                troops.catapult = catCount;
                nafsData.currVillaHQ -= 1;
                console.log("Catapult shaping Hq! Village " + targetCoords);
            }*/

            insertTroops(troops);
            targetVil(targetCoords);

            //if (catCount > 0 || ramCount > 0) {
            if (ramCount > 0) {
                nafsData.villaIndex++;
                break;
            }
        }
    }
}

function executeSortLogic(localData, localCoords, nafsData) {
}

/*Returns either a boolean ("It went well!") or a message of what went wrong.*/
/*Returns: WENTWELL (boolean) - used to decide whether to add "SAVED" onto the end or not...*/
function processReport(doc, reportID){
    /*We're on *a* report screen.*/
    var espionage = $("#attack_spy_resources, #attack_spy_buildings_left", doc);
    if (espionage.length >= 1) {
        console.log("new style");
        var repTable = espionage.closest("tbody");
        var defender = $("#attack_info_def th:not(:contains('" + _("Defender") + "'))", repTable);

        var attackerVillage = $("#attack_info_att th:not(:contains('" + _("Attacker") + "'))", repTable).closest("tbody").find("tr:contains('Origin') td:not(:contains('Origin'))");
        var testLocalCoordsReport = ["500", "500"];
        var localCoords = testLocalCoordsReport;

        //var localCoords = splitOutCoords(attackerVillage.text(), true).split("|");

        var defenderVillage = $("#attack_info_def th:not(:contains('" + _("Defender") + "'))", repTable).closest("tbody").find("tr:contains('Destination') td:not(:contains('Destination'))");
        var vilCoords = splitOutCoords(defenderVillage.text(), true).split("|");

        var resources = $("#attack_spy_resources td", repTable);
        var res = resources.text().trim().split(/\s+/);

        if (resources.get(0).innerHTML.indexOf("wood") === -1){
            res.unshift("0");
        }

        if (resources.get(0).innerHTML.indexOf("stone") === -1){
            if (res[1]) { 
                res.push(res[1]); 
                res[1] = "0"; 
            } else { 
                res.push("0");
            }
        }

        if (resources.get(0).innerHTML.indexOf("iron") === -1){
            res.push("0");
        }

        var wood = parseInt(res[0].replace(".", "")),
            clay = parseInt(res[1].replace(".", "")),
            iron = parseInt(res[2].replace(".", ""));

        var battleTimeText = $($("tr td", repTable).get(1)).text().trim().replace(/:\d{3}/, "") + serverTimezones[window.location.host.split(/\W+/)[0].substring(0, 2)];
        /* Format: MMM(M?) D(D), YYYY HH:mm:ss:mmm GMT+HHmm */
        var times = battleTimeText.match(/[\w-+]+/g);
        var month = 0;
        for (var i=0; i<months.length; i++){
            if (times[0].match(new RegExp(_(months[i]),"i"))) {
                month = i+1;
            }
        }

        var date = parseInt(times[1]);
        var year = parseInt(times[2]);
        var hour = parseInt(times[3]);
        var minute = parseInt(times[4]);
        var second = parseInt(times[5]);

        var offsets = times[6].replace("GMT", "");
        var offset = [];
        offset[0] = offsets.substring(0, 1);
        offset[1] = offsets.substring(1, 3);
        offset[2] = offsets.substring(3, 5);
        var offset = ((offset[0] === "+") ? -1 : 1) * (parseInt(offset[1])*60 + parseInt(offset[2]));
        minute += offset;

        var day = new Date();
        day.setUTCFullYear(year);
        day.setUTCMonth(month-1);
        day.setUTCDate(date);
        day.setUTCHours(hour);
        day.setUTCMinutes(minute);
        day.setUTCSeconds(second);

        var battleTime = day;
        var buildings;
        var woodCamp, clayCamp, ironCamp, warehouse, wall;
        if ($("#attack_spy_building_data", repTable).length >= 1){
            buildings = JSON.parse($("#attack_spy_building_data", repTable).val());
            buildings.forEach(function(element, index, array){
                if (element.id === "wood") woodCamp = parseInt(element.level);
                if (element.id === "stone") clayCamp = parseInt(element.level);
                if (element.id === "iron") ironCamp = parseInt(element.level);
                if (element.id === "storage") warehouse = parseInt(element.level);
                if (element.id === "wall") wall = parseInt(element.level);
            });
            woodCamp = (isNaN(woodCamp)) ? 0 : woodCamp;
            clayCamp = (isNaN(clayCamp)) ? 0 : clayCamp;
            ironCamp = (isNaN(ironCamp)) ? 0 : ironCamp;
            warehouse = (isNaN(warehouse)) ? 0 : warehouse;
            wall = (isNaN(wall)) ? 0 : wall;
        } else {
            woodCamp = 5;
            clayCamp = 5;
            ironCamp = 5;
            warehouse = 10;
            wall = 0;
        }

        var build = {};
        build.woodcamp = woodCamp;
        build.claycamp = clayCamp;
        build.ironcamp = ironCamp;
        build.warehouse = warehouse;
        build.wall = wall;

        if (buildings) {
            buildings.forEach(function(element, index, array){
                build[element.id] = parseInt(element.level);
            });
        }

        build.barracks = build.barracks || 0;
        build.place = build.place || 0;
        build.stable = build.stable || 0;
        build.garage = build.garage || 0;
        build.snob = build.snob || 0;
        build.smith = build.smith || 0;
        build.statue = build.statue || 0;
        build.market = build.market || 0;
        build.main = build.main || 0;
        build.farm = build.farm || 0;

        var linkd = $("<span>" + _("Saved") + "</span>");
        linkd.css("display", "none");

        repTable.parent().before(linkd);
        var progress = addReport(parseInt(reportID), localCoords, vilCoords, wood, clay, iron, battleTime, build);
        if (progress === true){
            linkd.text(_("Saved"));
            linkd.css("display", "block").css("color", "");
            console.log("Saved a report! - " + localCoords[0] + "|" + localCoords[1] + " - " + vilCoords[0] + "|" + vilCoords[1] + " - " + parseInt(reportID));
            return true;
        } else {
            linkd.text("Oops! There was an error.");
            linkd.css("display", "block").css("color", "#F00");
            console.log("Error with a report! - " + localCoords[0] + "|" + localCoords[1] + " - " + vilCoords[0] + "|" + vilCoords[1] + " - " + parseInt(reportID));
            return progress;
        }
    } 
}