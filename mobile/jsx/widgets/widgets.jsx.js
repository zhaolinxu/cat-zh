WCollapsibleSection = React.createClass({
    render: function(){
        return $r("li", {className: "accordion-item"},
            [
                $r("a", { href: "#", className: "item-content item-link" },
                    $r("div", {className: "item-inner"},
                        $r("div", {className: "item-title"},
                            this.props.label
                        )
                    )
                ),
                $r("div", {className: "accordion-item-content"},
                    $r("div", {className: "content-block"},
                        $r("p", {},
                            this.props.content
                        )
                    )
                )
            ]
        );
    }
});