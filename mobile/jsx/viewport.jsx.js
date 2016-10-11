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
                        ------------------------------------------ */
                        $r("div", {className: "subnavbar"}, [
                            $r("div", {className: "buttons-row"}, [
                                $r("div", {href:"#tab1", className: "button"}, "Tab 1"),
                                $r("div", {href:"#tab2", className: "button"}, "Tab 2"),
                                $r("div", {href:"#tab3", className: "button"}, "Tab 3"),
                                $r("div", {href:"#tab3", className: "button"}, "Tab 4"),
                                $r("div", {href:"#tab3", className: "button"}, "Tab 5"),
                                $r("div", {href:"#tab3", className: "button"}, "Tab 6"),
                                $r("div", {href:"#tab3", className: "button"}, "Tab 7"),
                                $r("div", {href:"#tab3", className: "button"}, "Tab 8"),
                                $r("div", {href:"#tab3", className: "button"}, "Tab 9")
                            ])
                        ]),

                        //-----------------------------------
                        //          Bottom toolbar
                        //-----------------------------------

                        $r("div", {
                            className: "toolbar"
                        }, [
                            $r("div", {className : "toolbar-inner"},
                                $r("a", {href : "#", className: "link"}, "Left link"),
                                $r("a", {
                                    href : "#",
                                    className: "open-popover link",
                                    "data-popover": ".popover-menu"
                                }, "Menu")
                            )
                        ]),




                        $r("div", {className: "page-content"}, [
                            //-------------------------------------------- MID goes there --------------------------

                            //--------------------------------------------------------------------------------------
                        ])
                    ]),


                    /*<div class="toolbar">
                     <div class="toolbar-inner"><a href="#" class="link">Dummy Link</a><a href="#" data-popover=".popover-menu" class="open-popover link">Menu</a></div>
                     </div>*/

                ])
            ]),
            $r("div", {className: "view view-right navbar-through"},[
                $r("div", {className: "navbar"}, [
                    $r("div", {className: "navbar-inner"}, [
                        $r("div", {className: "center sliding"}, [
                            //--------------------- RIGHT PANEL HEADER (calendar, menu) ------------------
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
                        ])
                    ])
                ])
            ]),
        ]);

        /**
         *   <div class="popover popover-menu" style="display: none; top: 233px; left: 75px;">
             <div class="popover-angle on-bottom" style="left: 201px;"></div>
             <div class="popover-inner">
             <div class="list-block">
             <ul>
             <li><a href="modals.html" class="list-button item-link">Modals</a></li>
             <li><a href="popover.html" class="list-button item-link">Popover</a></li>
             <li><a href="tabs.html" class="list-button item-link">Tabs</a></li>
             <li><a href="panels.html" class="list-button item-link">Side Panels</a></li>
             <li><a href="list-view.html" class="list-button item-link">List View</a></li>
             <li><a href="forms.html" class="list-button item-link">Forms</a></li>
             </ul>
             </div>
             </div>
             </div>
         **/
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
    }
});