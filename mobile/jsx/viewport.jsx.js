WViewport = React.createClass({
    getDefaultProps: function() {
        return {
            tabs: [
            ]
        }
    },

    getInitialState: function() {
        return {
            game: null
        }
    },

    componentDidMount: function() {
        dojo.subscribe("game/update", dojo.hitch(this, this.onChange));
    },

    onChange: function(game){
        this.setState({game: game});
    },

    render: function() {
        var selectedTab = $dd.get(this.props.tabs, this.state.selectedTab);

        var viewport =  $r("div", {
            className: "views"
        },[
            $r("div", {className: "view view-left navbar-through"},[
                $r("div", {className: "navbar"}, [
                    $r("div", {className: "navbar-inner"}, [
                        $r("div", {className: "center sliding"}, "Left View")
                    ])
                ]),
                $r("div", {className: "pages"},[
                    $r("div", {
                        className: "page",
                        "data-page": "index-left"
                    }, [
                        $r("div", {className: "page-content"}, [
                            //------------------- buttons -------------------------
                            $r("div", {className: "list-block"}, [
                                $r("ul", {}, this.createButtons())
                            ])
                        ])
                    ])
                ])
            ]),
            $r("div", {className: "view view-main navbar-through"},[
                $r("div", {className: "navbar"}, [
                    $r("div", {className: "navbar-inner"}, [
                        $r("div", {className: "center sliding"},
                            []
                        )
                    ])
                ]),
                $r("div", {className: "pages"},[
                    $r("div", {
                        className: "page toolbar-fixed",
                        "data-page": "index-left"
                    }, [
                        /*$r("div", {className: "toolbar console"},
                            $r("div", {className: "toolbar-inner"},[
                                []
                            ])
                        ),*/
                        $r("div", {className: "page-content"}, [
                            //-------------------------------------------- MID goes there --------------------------
                            /*$r(selectedTab.class, {
                                id: this.state.selectedTab
                            })*/
                            //--------------------------------------------------------------------------------------

                        ])
                    ])
                ])
            ]),
            $r("div", {className: "view view-right navbar-through"},[
                $r("div", {className: "navbar"}, [
                    $r("div", {className: "navbar-inner"}, [
                        $r("div", {className: "center sliding"}, [
                            //--------------------- RIGHT PANEL HEADER (calendar, menu) ------------------
                            /*$r(DDCalendar, {
                            }),

                            $r(UIProgressCircle, {
                                size: 20
                            })*/
                        ])
                    ])
                ]),
                $r("div", {className: "pages"},[
                    $r("div", {
                        className: "page",
                        "data-page": "index-left"
                    }, [
                        $r("div", {className: "page-content"}, [
                            //-------------------------------------------- RIGHT goes there --------------------------
                            /*$r(DDGameProfiler, {}),
                            $r(DDNetworkProfiler, {})*/
                        ])
                    ])
                ])
            ]),
        ]);
        return viewport;
    },

    createButtons: function(){
        /*var viewportButtons = [];
        for (var i in this.props.tabs){
            var tab = this.props.tabs[i];

            var btn = $r(DDViewportTabButton, {
                id:    tab.id,
                title: tab.title,
                selected:
                    (this.state.selectedTab == tab.id),
                onclick: this.setTab
            });
            viewportButtons.push(btn);
        }
        return viewportButtons;*/
        return [];
    },

    setTab: function(id){
        this.setState({selectedTab: id});
    }
});