WResourceTableRow = React.createClass({

    getInitialProps: function() {
        return {
            name: "RES NAME",
            value: "VAL",
            maxValue: "VAL MAX",
            perTick: "+VAL"
        }
    },

    render: function() {
        return $r("div", {className: "resources-table-row"},
            [
                $r("div", {className: "resources-table-cell"}, this.props.name),
                $r("div", {className: "resources-table-cell"}, this.props.value),
                $r("div", {className: "resources-table-cell"}, this.props.maxValue),
                $r("div", {className: "resources-table-cell"}, this.props.perTick)
            ]
        );
    }
});

WResourceTable = React.createClass({

    getInitialState: function() {
        return {
            resources: []
        }
    },

    componentDidMount: function() {
        dojo.subscribe("game/update", dojo.hitch(this, this.onChange));
    },

    onChange: function(game){
        this.setState({
            resources: game.resPool.resources
        });
    },

    render: function() {
        var resources = this.getResources();
        return $r("div", {className: "resources-table"},
            resources
        );
    },

    getResources: function(){
        var resources = [];
        for (var i in this.state.resources){
            var res = this.state.resources[i];

            resources.push($r(WResourceTableRow, {
                name: res.name,
                value: res.value,
                maxValue: res.maxValue,
                perTick: res.perTick
            }));
        }
        return [
            resources
        ]
    }
});
