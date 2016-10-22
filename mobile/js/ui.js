dojo.declare("classes.ui.FW7UI", classes.ui.UISystem, {
    render: function(){
        var game = this.game;
    },

    update: function(){
        dojo.publish("game/update", [this.game]);
    }
});
