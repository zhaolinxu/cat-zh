WSubnavTabs = React.createClass({
    getDefaultProps: function() {
        return {
            tabs: [],
            selectedTabId: null,
            onclick: null
        }
    },

    render: function() {
        var tabBtns = [],
            self = this;

        for (var i in this.props.tabs){
            var tab = this.props.tabs[i];

            var selectedClass = "";
            if (tab.tabId == this.props.selectedTabId){
                selectedClass += " active";
            }

            tabBtns.push(
                $r("div", {
                    href:"#",
                    className: "button tab" + selectedClass,
                    onClick: dojo.hitch(this, function(tab){
                        //console.log("TAB:", tab);
                        self.onClick(tab.tabId)
                    }, tab)
                }, tab.tabName)
            );
        }

        return $r("div", {className: "subnavbar"},
            $r("div", {className: "buttons-row tabs-row"},[
                tabBtns
            ])
        );
    },

    onClick: function(tabId){
        this.props.onclick(tabId);
    }
});

WCalendar = React.createClass({
    getInitialState: function() {
        return {
            calendar: null
        }
    },

    componentDidMount: function() {
        dojo.subscribe("game/update", dojo.hitch(this, this.onChange));
    },

    onChange: function(game){
        this.setState({
            calendar: game.calendar
        });
    },

    render: function() {
        var calendar =  this.state.calendar;
        var calendarText = "N/A";

        if (calendar){
            var mod = "";
            if (calendar.weather){
                mod = " (" + calendar.weather + ")";
            }

            calendarText = "Year " + calendar.year + " - " +
                calendar.seasons[calendar.season].title + mod + ", day " + calendar.integerDay();
        }

        return $r("div", {className: "calendar"},
            $r("div", {className: "calendar"}, [
                calendarText
            ])
        );
    }
});

WViewport = React.createClass({
    getDefaultProps: function() {
        return {
            tabs: [
                {   id:"Bonfire", class: WBonfireTab  },
                {   id:"Small village", class: WVillageTab  }
            ]
        }
    },

    getInitialState: function() {
        return {
            game: null,
            selectedTabId: "Bonfire"
        }
    },

    componentDidMount: function() {
        dojo.subscribe("game/update", dojo.hitch(this, this.onChange));
    },

    onChange: function(game){
        this.setState({
            game: game,
            selectedTabId: this.state.selectedTabId
        });
    },

    render: function() {
        var selectedTab = $dd.get(this.props.tabs, this.state.selectedTabId);
        //console.log("selected tab:", selectedTab, this.props.tabs, this.state.selectedTabId );

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
                            $r(WResourceTable, {})
                            //-----------------------------------------------------
                        ])
                    ])
                ])
            ]),
            $r("div", {className: "view view-main navbar-through"},[
                $r("div", {className: "navbar"}, [
                    $r("div", {className: "navbar-inner"}, [
                        $r("div", {className: "center sliding"}, [
                            "Kittens Game",
                            $r("span", {id: "version", style: {paddingLeft: "11px"}}, "Ver 1.0")
                        ]),
                        $r("div", {className: "right"}, [
                            $r("a", {href: "#", className: "link"},
                                $r("i", {className: "icon icon-bars"}),
                                $r("span", {}, "Menu")
                            )
                        ])
                    ])
                ]),
                $r("div", {className: "pages"},[
                    $r("div", {
                        className: "page toolbar-fixed",
                        "data-page": "index-left"
                    }, [

                        /* -----------------------------------------
                        * Tabs section goes there.
                        * TODO: hide for smaller screen resolution, use carousel
                        * TODO: use dynamic tab rendering based on what tab is active
                        ------------------------------------------ */
                        $r(WSubnavTabs, {
                            tabs: this.getTabs(),
                            onclick: this.setTab,
                            selectedTabId: this.state.selectedTabId
                        }),

                        //-----------------------------------
                        //          Bottom toolbar
                        //-----------------------------------

                        $r("div", {
                            className: "toolbar"
                        }, [
                            $r("div", {className : "toolbar-inner"},
                                $r("a", {href : "#", className: "link"},
                                    "Resources"),
                                $r("a", {
                                    href : "#",
                                    className: "open-popover link",
                                    "data-popover": ".popover-menu"
                                },
                                    "Log")
                            )
                        ]),

                        $r("div", {className: "page-content"}, [
                            //-------------------------------------------- MID goes there --------------------------
                            $r(selectedTab.class, {
                                id: this.state.selectedTabId
                            })
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
                            $r(WCalendar)
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
                            $r(WProfiler)
                        ])
                    ])
                ])
            ]),
        ]);
        return viewport;
    },

    createButtons: function(){
        return [];
    },

    getTabs: function(){
        return this.state.game ? this.state.game.tabs : [];
    },

    setTab: function(tabId){
        this.setState({
            game: this.state.game,
            selectedTabId: tabId
        });
    }
});