WBuildingTabBtn = React.createClass({
    render: function(){
        /*return $r("div", {},
            "[" + this.props.meta.name + "]"
        );*/

        return $r("li", {className: "accordion-item kg-button"},
                [
                    $r("a", { href: "#", className: "item-content item-link" },
                        $r("div", {className: "item-inner"},
                            $r("div", {className: "item-title res-row"},
                                this.props.meta.name
                                    + "(" + this.props.meta.val + ")"
                            )
                        )
                    ),
                    $r("div", {className: "accordion-item-content"},
                        $r("div", {className: "content-block"},
                            $r("p", {}, "bld details go there")
                        )
                    )
                ]
            );
    }
});

WBonfireTab = React.createClass({
    render: function() {
        var bldButtons = [];
        for (var i in game.bld.buildingsData){

            var bld = game.bld.buildingsData[i];
            var bldMeta = new classes.BuildingMeta(bld).getMeta();

            bldButtons.push(
                $r(WBuildingTabBtn, {meta: bldMeta })
            );
        }

        return  $r("div", {className: "list-block accordion-list res-table"},
            $r("ul", {},
                bldButtons
            )
        );
    }
});