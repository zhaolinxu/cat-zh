/**
    class that provides an abstraction layer for UI/model communication
 */
dojo.declare("classes.ui.UISystem", null, {
    game: null,

    setGame: function(game){
        this.game = game;
    },

    render: function(){
    },

    update: function(){
    },

    updateOptions: function(){
    },

    displayAutosave: function(){
    },

    resetConsole: function(){
    },

    renderFilters: function(){
    },

    renderConsoleLog: function() {
    },

    saveExport: function(encodedData) {
    },

    observeCallback: function(){
    },

    observeClear: function(){
    },

    updateLanguage: function() {
    }
});

/**
 * Legacy UI renderer
 */
dojo.declare("classes.ui.DesktopUI", classes.ui.UISystem, {
    containerId: null,
    toolbar: null,

    fontSize: null,

    //current selected game tab
	activeTabId: "Bonfire",

    isDisplayOver: false,
    isChatActive: false,

    constructor: function(containerId){
        this.containerId = containerId;

        dojo.connect($("html")[0],"onclick", this, function() {
            this.game.stats.getStat("totalClicks").val += 1;
        });
    },

    setGame: function(game){
        this.game = game;

        this.toolbar = new classes.ui.Toolbar(game);
    },

    render: function(){
        var game = this.game;

        var midColumn = dojo.byId("midColumn");
        var scrollPosition = midColumn.scrollTop;

        var container = dojo.byId(this.containerId);
        dojo.empty(container);

        var tabNavigationDiv = dojo.create("div", { className: "tabsContainer"}, container);

        //TODO: remove hardcoded id?
        this.toolbar.render(dojo.byId("headerToolbar"));

        game.resTable.render();
        game.craftTable.render();
        game.calendar.render();

        var visibleTabs = [];

        for (var i = 0; i < game.tabs.length; i++){
            var tab = game.tabs[i];
            tab.domNode = null;
            if (tab.visible){
                visibleTabs.push(tab);
            }
        }

        for (var i = 0; i < visibleTabs.length; i++){
            var tab = visibleTabs[i];

            tab.updateTab();
            var tabLink = dojo.create("a", {
                href:"#",
                innerHTML: tab.tabName,
                className: "tab",
                style : {
                    whiteSpace: "nowrap"
                }
            }, tabNavigationDiv);
            tab.domNode = tabLink;

            if (this.activeTabId == tab.tabId){
                dojo.addClass(tabLink, "activeTab");
            }


            dojo.connect(tabLink, "onclick", this,
                dojo.partial(
                    function(tab){
                        this.activeTabId = tab.tabId;
                        this.render();

                        //this.game.telemetry.logEvent("tab", tab.tabId);
                    }, tab)
            );

            if (i < visibleTabs.length-1){
                dojo.create("span", {innerHTML:" | "}, tabNavigationDiv);
            }
        }


        for (var i = 0; i < game.tabs.length; i++){
            var tab = game.tabs[i];

            if (this.activeTabId == tab.tabId){

                var divContainer = dojo.create("div", {
                    className: "tabInner"
                }, container);

                tab.render(divContainer);

                break;
            }
        }

        midColumn.scrollTop = scrollPosition;

        this.update();
    },

    //---------------------------------------------------------------
    update: function(){
        //TODO: use ui managers?
		this.updateTabs();
        this.updateFastHunt();
        this.updateFastPraise();
        this.updateCalendar();
        this.updateUndoButton();
        this.updateAdvisors();

        this.game.resTable.update();

        this.toolbar.update();

        if (this.game.ticks % 5 == 0 && this.game.tooltipUpdateFunc) {
            this.game.tooltipUpdateFunc();
        }
    },

	updateTabs: function() {
		var tabs = this.game.tabs;
		for (var i = 0; i < tabs.length; i++){
			var tab = tabs[i];

			if (tab.tabId == this.activeTabId){
				tab.update();
			}
		}
	},

    updateFastHunt: function(){
        if (!this.fastHuntContainer){
            this.fastHuntContainer = $("#fastHuntContainer")[0];
        }

        var catpower = this.game.resPool.get("manpower");
        var showFastHunt = (catpower.value >= 100);

        //blazing fast vanilla toggle
        if (showFastHunt){
            if (this.fastHuntContainer.style.visibility == "hidden"){
                this.fastHuntContainer.style.visibility = "visible";
            }
            var huntCount = Math.floor(catpower.value / 100);
            $("#fastHuntContainerCount")[0].innerHTML = this.game.getDisplayValueExt(huntCount, false, false, 0)
                + (huntCount === 1 ? " time" : " times");
        } else {
            if (this.fastHuntContainer.style.visibility == "visible"){
                this.fastHuntContainer.style.visibility = "hidden";
            }
        }
    },

    updateFastPraise: function(){
        if (!this.fastPraiseContainer){
            this.fastPraiseContainer = dojo.byId("fastPraiseContainer");
        }

        if (this.game.religion.faith > 0){
            if (this.fastPraiseContainer.style.visibility == "hidden"){
                this.fastPraiseContainer.style.visibility = "visible";
            }
        } else {
            if (this.fastPraiseContainer.style.visibility == "visible"){
                this.fastPraiseContainer.style.visibility = "hidden";
            }
        }
    },

    updateCalendar: function(){
        var calendar = this.game.calendar;
        var seasonTitle = calendar.getCurSeasonTitle();
        var hasCalendarTech = this.game.science.get("calendar").researched;

        var calendarDiv = calendar.displayElement;
        if (hasCalendarTech){

            var mod = "";
            if (calendar.weather){
                mod = " (" + calendar.weather + ")";
            }

            var year = calendar.year;
            if (year > 100000){
                year = this.game.getDisplayValueExt(year, false, false, 0);
            }

            calendarDiv.innerHTML = "Year " + year + " - " +
                seasonTitle + mod + ", day " + calendar.integerDay();
            document.title = "Kittens Game - Year " + calendar.year + ", " +
                seasonTitle + ", d. " + calendar.integerDay();

            if (this.game.ironWill && calendar.observeBtn) {
                document.title = "[EVENT!]" + document.title;
            }

            var calendarSignSpan = dojo.byId("calendarSign");
            var cycle = calendar.cycles[calendar.cycle];
            if (cycle && this.game.science.get("astronomy").researched){
                calendarSignSpan.innerHTML = cycle.glyph;
            }
        } else {
            calendarDiv.textContent = seasonTitle;
        }
    },
    //--------------------------------------------

    updateUndoButton: function(){
        var isVisible = (this.game.undoChange !== null);
        $("#undoBtn").toggle(isVisible);

        if (isVisible) {
            $("#undoBtn").html("undo (" + Math.floor(this.game.undoChange.ttl / this.game.rate) + "s)");
        }
    },

    updateAdvisors: function(){
        if (this.game.bld.get("field").on == 0){
            return;
        }

        var advDiv = dojo.byId("advisorsContainer");
        dojo.empty(advDiv);

        var calendar = this.game.calendar,
            winterDays = calendar.daysPerSeason -
                (calendar.getCurSeason().name === "winter" ? calendar.day : 0);

        var catnipPerTick = this.game.calcResourcePerTick("catnip", { modifiers:{
            "catnip" : 0.25
        }});	//calculate estimate winter per tick for catnip;

        if (this.game.resPool.get("catnip").value + ( winterDays * catnipPerTick / calendar.dayPerTick ) <= 0 ){
            advDiv.innerHTML = "<span>"+$I("general.food.advisor.text")+"<span>";
        }
    },

    updateLanguage: function(){
        var languageSelector = $("#languageSelector");
        $("#languageApplyLink").toggle(languageSelector.val() != i18nLang.getLanguage());
    },

    applyLanguage: function() {
        var languageSelector = $("#languageSelector");
        i18nLang.updateLanguage(languageSelector.val());
        this.game.updateOptionsUI();
        window.location.reload();
    },


    updateOptions: function() {
        var game = this.game;

        $("#schemeToggle").val(game.colorScheme);
        $("body").attr("class", "scheme_" + game.colorScheme);

        $("#workersToggle")[0].checked = game.useWorkers;
        $("#forceHighPrecision")[0].checked = game.opts.forceHighPrecision;
        $("#usePerSecondValues")[0].checked = game.opts.usePerSecondValues;
        $("#usePercentageResourceValues")[0].checked = game.opts.usePercentageResourceValues;
        $("#highlightUnavailable")[0].checked = game.opts.highlightUnavailable;
        $("#hideSell")[0].checked = game.opts.hideSell;
        $("#disableCMBR")[0].checked = game.opts.disableCMBR;
        $("#disableTelemetry")[0].checked = game.opts.disableTelemetry;
        $("#noConfirm")[0].checked = game.opts.noConfirm;
        $("#IWSmelter")[0].checked = game.opts.IWSmelter;

        var selectedLang = i18nLang.getLanguage();
        var locales = i18nLang.getAvailableLocales();
        var labels = i18nLang.getAvailableLocaleLabels();
        var $langSelector = $("#languageSelector");
        $langSelector.empty();
        for (var i = 0; i < locales.length; i++) {
            $('<option />', {
                value: locales[i],
                text:labels[locales[i]]
            }).appendTo($langSelector);
        }
        $langSelector.val(selectedLang);
    },

    displayAutosave: function(){
        dojo.style(dojo.byId("autosaveTooltip"), "opacity", "1");
        dojo.animateProperty({
            node:"autosaveTooltip",
            properties: {
                opacity: 0
            },
            duration: 1200,
        }).play();
    },

    getFontSize: function(){
        //account for themes like sleek that set the default font size to something other than 16
        if (this.fontSize == null){
            var computedStyle = getComputedStyle(dojo.byId("leftColumn")).fontSize;
            this.fontSize = parseInt(computedStyle, 10) || 16;
        }
        return this.fontSize;
    },

    zoomUp: function(){
        this.fontSize = this.getFontSize() + 1;
        this.updateFontSize();
    },
    zoomDown: function(){
        this.fontSize = this.getFontSize() - 1;
        if (this.fontSize < 1){
            this.fontSize = 1; //prevent resources text from disappearing altogether
        }
        this.updateFontSize();
    },
    updateFontSize: function(){
        $("#leftColumn").css("font-size", this.fontSize+"px");
    },

    hideChat: function(){
        $("#rightTabLog").show();
        $("#IRCChatInner").css("visibility", "hidden");
    },

    loadChat: function(){
        $("#rightTabChat").show();
        $("#rightTabLog").hide();

        $("#IRCChatInner").css("visibility", "visible");

        if (this.isChatActive) {
            return;
        }

        var height = $(window.top).height() || 850;
        //console.log("IRC WINDOW HEIGHT:", height);

        var $chat = $('#IRCChatInner');
        swfobject.embedSWF("lib/lightirc/lightIRC.swf", $chat[0], 600, height - 150, 10, "lib/lightirc/expressInstall.swf", params);
        this.isChatActive = true;
    },

    resetConsole: function(){
        this.game.console.resetState();
    },

    renderFilters: function(){
        var console = this.game.console,
            filtersDiv = dojo.byId("logFilters");

        dojo.empty(filtersDiv);
        var show = false;

        for (var fId in console.filters){
            if (console.filters[fId].unlocked) {
                this._createFilter(console.filters[fId], fId, filtersDiv);
                show = true;
            }
        }
        $("#logFiltersBlock").toggle(show);
    },

    _createFilter: function(filter, fId, filtersDiv){
        var id = "filter-" + fId;

        var checkbox = dojo.create("input", {
                id: id,
                type: "checkbox",
                checked: filter.enabled
        }, filtersDiv);
        dojo.connect(checkbox, "onclick", this, function(){
            filter.enabled = checkbox.checked;
        });

        dojo.create("label", {
            "for": id,
            innerHTML: filter.title
        }, filtersDiv);
        dojo.create("br", null, filtersDiv);
    },

    renderConsoleLog: function() {
        var console = this.game.console,
            messages = console.messages;

        var gameLog = dojo.byId("gameLog");
        if (!messages.length) { // micro optimization
            dojo.empty(gameLog);
            return;
        }

        var spans = dojo.query("span", gameLog);

        for (var i = 0, j = 0; i < messages.length || j < spans.length;){
            var msg = messages[i],
                span = spans[j];
            if (!msg && span) {
                dojo.destroy(span);
                i++; j++;
                continue;
            } else if (msg && span) {
                if (msg.id == span.id) {
                    if (i > 24) {
                        dojo.setStyle(span, "opacity", (1 - (i-24) * 0.066));
                    }
                    i++; j++;
                    continue;
                } else {
                    dojo.destroy(span);
                    j++;
                    continue;
                }
            } else if (msg && !span) {
                span = dojo.create("span", { innerHTML: msg.text, className: "msg" }, gameLog, "first");

                if (msg.type){
                    dojo.addClass(span, "type_"+msg.type);
                }
                if (msg.noBullet) {
                    dojo.addClass(span, "noBullet");
                }
                i++;
            } else {
                //!msg && !span - break the loop if we didn't do so yet
                break;
            }

        }
    },

    notifyLogEvent: function(logmsg) {
        // do nothing
    },

    saveExport: function(encodedData, rawData) {
        var is_chrome = /*window.chrome*/ true;
        if (is_chrome){
            $("#exportDiv").show();
            $("#exportData").val(encodedData);
            $("#exportData").select();
        } else {
            window.prompt($I("general.copy.to.clipboard.prompt"), encodedData);
        }
    },


    confirm: function(title, msg, callback) {
        invokeCallback(callback, [window.confirm(msg)]);
    }

});