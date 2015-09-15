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
        
    }
});

/**
 * Legacy UI renderer
 */
dojo.declare("classes.ui.DesktopUI", classes.ui.UISystem, {
    containerId: null,
    toolbar: null,
    
    constructor: function(containerId){
        this.containerId = containerId;
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
                        game.activeTabId = tab.tabId;
                        this.render();
                    }, tab)
            );

            if (i < visibleTabs.length-1){
                dojo.create("span", {innerHTML:" | "}, tabNavigationDiv);
            }
        }


        for (var i = 0; i < game.tabs.length; i++){
            var tab = game.tabs[i];

            if (game.activeTabId == tab.tabId){

                var divContainer = dojo.create("div", {
                    className: "tabInner"
                }, container);

                tab.render(divContainer);

                break;
            }
        }

        midColumn.scrollTop = scrollPosition;
    },
    
    //---------------------------------------------------------------
    update: function(){
        //TODO: use ui managers?
        this.updateFastHunt();
        this.updateCalendar();
        
        this.toolbar.update();
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
    
    updateCalendar: function(){
        var calendar = this.game.calendar;
        var hasCalendarTech = this.game.science.get("calendar").researched;

        var calendarDiv = calendar.displayElement;
        if (hasCalendarTech){

            var mod = "";
            if (this.weather){
                mod = " (" + this.weather + ") ";
            }

            calendarDiv.innerHTML = "Year " + this.year + " - " +
                calendar.seasons[calendar.season].title + mod + ", day " + calendar.integerDay();
            document.title = "Kittens Game - Year " + calendar.year + ", " +
                calendar.seasons[calendar.season].title + ", d. " + calendar.integerDay();

            if (this.game.ironWill && calendar.observeBtn) {
                document.title = "[EVENT!]" + document.title;
            }

            var calendarSignSpan = dojo.byId("calendarSign");
            var cycle = calendar.cycles[calendar.cycle];
            if (cycle){
                calendarSignSpan.innerHTML = cycle.glyph;
                calendarSignSpan.title = cycle.title + " (Year "+calendar.cycleYear+")";
            }
        } else {
            calendarDiv.textContent = calendar.seasons[calendar.season].title;
        }
    },
    //--------------------------------------------
    
    updateOptions: function() {
        var game = this.game;
        
        $("#schemeToggle").val(game.colorScheme);
        $("body").attr("class", "scheme_" + game.colorScheme);

        $("#workersToggle")[0].checked = game.useWorkers;
        $("#forceHighPrecision")[0].checked = game.forceHighPrecision;
        $("#usePerSecondValues")[0].checked = game.opts.usePerSecondValues;
        $("#usePercentageResourceValues")[0].checked = game.opts.usePercentageResourceValues;
        $("#highlightUnavailable")[0].checked = game.opts.highlightUnavailable;
        $("#hideSell")[0].checked = game.opts.hideSell;
        $("#noConfirm")[0].checked = game.opts.noConfirm;
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
    }

});