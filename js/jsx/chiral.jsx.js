/* global 

    $r,
    WChiral: writable,
    game
*/

WChiral = React.createClass({
    getInitialState: function(){
        return {
            game: this.props.game,
            console: null
        };
    },
    
    componentDidMount: function(){
        var self = this;
        this.updateHandler = dojo.subscribe("ui/update", function(game){
            self.setState({game: game});
        });
    },

    componentWillUmount: function(){
        dojo.unsubscribe(this.updateHandler);
    },

    setConsole: function(e){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        this.setState({console: e.target.value});
    },

    sendCommand: function(){
        var game = this.state.game;
        game.server.sendCommand(this.state.command);
    },

    render: function(){
        var game = this.state.game;
        if (game.server.userProfile){
            return $r("div", null, [
                $r("div", {className: "row"}, "666 nodes online"),
                $r("div", {className: "row"}, [
                    $r("pre", null, "JSON goes there")
                ]),
                $r("div", {className: "row"}, [
                    $r("input", {
                        type: "text",
                        onChange: this.setConsole,
                        value: this.state.console
                    }),
                    $r("a", {
                        onClick: this.sendCommand
                    }, "send")
                ])
            ]);
        } else {
            return $r("div", null, "The furthest ring is empty and silent");
        }
    }
});