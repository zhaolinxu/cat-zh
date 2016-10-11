WProfiler = React.createClass({
    getInitialState: function() {
        return {
            currentTime: 0,
            avgTime: 0
        }
    },

    componentWillMount: function () {
        dojo.subscribe("game/update", dojo.hitch(this, this.onChange));
    },

    componentWillUnmount: function() {
    },

    onChange: function(game){
        this.setState({
            currentTime: game.timer.currentTime,
            averageTime: game.timer.averageTime
        });
    },

    render: function(){
        return $r("div", {},[
            $r("span", {}, "Update time: " + this.state.currentTime + "ms, average: " + this.state.averageTime + "ms")
        ]);
    }
});