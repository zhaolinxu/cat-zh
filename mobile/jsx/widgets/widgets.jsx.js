WCollapsibleSection = React.createClass({
    render: function(){
        return $r("li", {className: "accordion-item kg-button"},
            [
                $r("a", { href: "#", className: "item-content item-link" },
                    $r("div", {className: "item-inner"},
                        $r("div", {className: "item-title"},
                            "LABEL"
                        )
                    )
                ),
                $r("div", {className: "accordion-item-content"},
                    $r("div", {className: "content-block"},
                        $r("p", {},
                            "CONTENT"
                        )
                    )
                )
            ]
        );
    }
});