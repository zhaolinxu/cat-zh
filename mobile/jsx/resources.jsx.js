WResourceTableRow = React.createClass({

    getInitialProps: function() {
        return {
            name: "RES NAME",
            value: "VAL",
            maxValue: "VAL MAX",
            perTick: "+VAL"
        }
    },

    getInitialState: function() {
        return {
            collapsed: true
        }
    },

    render: function() {
        var res = this.props;
        /* -------------------------------
                       per tick
        --------------------------------- */

        var perTick = game.calendar.day < 0 ? 0 : game.getResourcePerTick(res.name, true);
        perTick = game.opts.usePerSecondValues ? perTick * game.getRateUI() : perTick;

        var postfix = game.opts.usePerSecondValues ? "/sec" : "";
        if (game.opts.usePercentageResourceValues && res.maxValue){
            perTick = (perTick / res.maxValue * 100).toFixed(2);
            postfix = "%" + postfix;
        }

        var perTickValue = perTick ? "(" + game.getDisplayValueExt(perTick, true, false) + postfix + ")" : "";

        //todo: only calculate tooltip if resbox is expanded
        var resTooltip = "";
        if (!this.state.collapsed) {
            resTooltip = game.getDetailedResMap(res);
        }

        return $r("ul", {},
            $r("li", {className: "accordion-item"},
                [
                    $r("a", {
                            href: "#",
                            className: "item-content item-link",
                            onClick: this.toggle
                        },
                            $r("div", {className: "item-inner"},
                                $r("div", {className: "item-title res-row"},
                                    [
                                        $r("div", {className: "res-cell"}, res.name + ":"),
                                        $r("div", {className: "res-cell"}, game.getDisplayValueExt(res.value)),
                                        $r("div", {className: "res-cell"}, res.maxValue ? "/" + game.getDisplayValueExt(res.maxValue) : ""),
                                        $r("div", {className: "res-cell"}, perTickValue)
                                    ]
                                )
                            )
                    ),
                    $r("div", {className: "accordion-item-content"},
                            $r("div", {className: "content-block"},
                                $r("p", {}, resTooltip)
                            )
                    )
                ]
            )
        );
    },

    toggle: function(){
        console.log("toggle");

        this.setState({
            collapsed: !this.state.collapsed
        });
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
        return $r("div", {className: "list-block accordion-list res-table"},
            resources
        );
    },

    getResources: function(){
        var resources = [];
        for (var i in this.state.resources){
            var res = this.state.resources[i];

            var isVisible = (res.unlocked || (res.name == "kittens" && res.maxValue));
            if (!isVisible){
                continue;
            }

            resources.push($r(WResourceTableRow, {
                name: res.title || res.name,
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
