
WVillageTab = React.createClass({
    render: function() {
        return  $r("div", {className: "list-block accordion-list"},
            $r("ul", {}/*,
                $(WCollapsibleSection, {})*/
            )
        );
    }
});