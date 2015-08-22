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
        
    }
});

dojo.declare("classes.ui.FW7UI", classes.ui.UISystem, {
    render: function(){
        //do nothing?
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
        this.updateFastHunt();
        
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
    }
});