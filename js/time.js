dojo.declare("classes.managers.TimeManager", com.nuclearunicorn.core.TabManager, {
    game: null,

    constructor: function(game){
        this.game = game;

    },

    load: function(saveData){
     
    },

    save: function(saveData){
       
    },
    
    resetState: function(){
        
    }
});

dojo.declare("classes.tab.TimeTab", com.nuclearunicorn.game.ui.tab, {

    container: null,

    constructor: function(tabName){
        var timePanel = new com.nuclearunicorn.game.ui.Panel("Time");
        this.addChild(timePanel);

        this.cfPanel = new com.nuclearunicorn.game.ui.Panel("Chronoforge");
        this.cfPanel.setVisible(false);
        this.addChild(this.cfPanel);
    },

    render: function(content){
        this.container = content;

        this.inherited(arguments);
        this.update();
    },

    update: function(){
        this.inherited(arguments);
        
        var hasCF = this.game.workshop.get("chronoforge").researched;
        if (hasCF){
            this.cfPanel.setVisible(true);
        }
    }
});