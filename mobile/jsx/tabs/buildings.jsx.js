WGatherCatnipTabBtn = React.createClass({
    render: function(){
        return $r("li", {className: "kg-button"},
            [ $r("a", { href: "#", className: "item-link list-button", onClick: this.onclick }, "Gather Catnip") ]
        );
    },

    onclick: function(){
        game.bld.gatherCatnip();
    }
});

WRefineCatnipTabBtn = React.createClass({
    render: function(){
        return $r("li", {className: "kg-button"},
            [
                $r("a", { href: "#", className: "item-link list-button", onClick: this.onclick }, "Refine Catnip")
            ]
        );
    },

    onclick: function(){
        game.bld.refineCatnip();
    }
});


WBuildingTabBtn = React.createClass({

    getInitialState: function() {
        return {
            collapsed: true
        }
    },

    render: function(){

        var tooltip = "";
        if (!this.state.collapsed) {
            tooltip = this.renderTooltip(this.props.meta);
        }

        return $r("li", {className: "accordion-item kg-button"},
                [
                    $r("a", { href: "#", className: "item-content item-link" },
                        $r("div", {className: "item-inner"},
                            $r("div", {className: "item-title"},
                                this.props.meta.label
                                    + " (" + this.props.meta.val + ")"
                            )
                        )
                    ),
                    $r("div", {className: "accordion-item-content"},
                        $r("div", {className: "content-block"},
                            $r("p", {}, tooltip)
                        )
                    )
                ]
            );
    },

    renderTooltip: function(meta){

        var prices = meta.prices;
        var tooltip = dojo.create("div", {});
        for (var i in prices){
            game._renderPriceLine(tooltip, prices[i], /*simpleUI*/ false);
        }


        return $r("div", {}, [
            $r("div", { className: "bld-tooltip-name"}, "NAME"),
            $r("div", { className: "bld-tooltip-desc"}, "DESC"),
            $r("div", { className: "bld-tooltip-prices"},
                tooltip
            )
        ]);
    },

    toggle: function(){
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
});

WBonfireTab = React.createClass({
    render: function() {
        var bldButtons = [];

        bldButtons.push(
            $r(WGatherCatnipTabBtn, {})
        );
        bldButtons.push(
            $r(WRefineCatnipTabBtn, {})
        );

        for (var i in game.bld.buildingsData){

            var bld = game.bld.buildingsData[i];
            var bldMeta = new classes.BuildingMeta(bld).getMeta();

            if (!bldMeta.unlocked){
                continue;
            }

            bldButtons.push(
                $r(WBuildingTabBtn, {meta: bldMeta })
            );
        }

        return  $r("div", {className: "list-block accordion-list"},
            $r("ul", {},
                bldButtons
            )
        );
    }
});