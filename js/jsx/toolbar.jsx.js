/* global

    $r,
    WToolbar: writable,
    game
*/

WToolbarIconContainer = React.createClass({
    componentDidMount: function(){
        if (this.props.getTooltip){
            this.attachToolbarTooltip();
        }
    },

    render: function(){
        return $r("div", {
            className:"toolbarIcon " + this.props.className,
            ref: "iconContainer"
        }, this.props.children);
    },

    attachToolbarTooltip: function(){
        var container = React.findDOMNode(this.refs.iconContainer);
        var getTooltip = this.props.getTooltip;
        var game = this.props.game;

		var tooltip = dojo.byId("tooltip");
		dojo.empty(tooltip);

		dojo.connect(container, "onmouseover", this, function(event){
			 game.tooltipUpdateFunc = function(){
				tooltip.innerHTML = getTooltip();
			 };
			 game.tooltipUpdateFunc();

			 var target = event.originalTarget || event.toElement;
			 var pos = $(target).offset();
			 if (!pos){
				 return;
			 }

			 dojo.style(tooltip, "left", pos.left + "px");
			 dojo.style(tooltip, "top",  pos.top + "px");

			 dojo.style(tooltip, "display", "");
			 dojo.style(container, "fontWeight", "bold");

	    });

		dojo.connect(container, "onmouseout", this, function(){
			 game.tooltipUpdateFunc = null;
			 dojo.style(tooltip, "display", "none");
			 dojo.style(container, "fontWeight", "normal");
		});

	}
})

WToolbarHappiness = React.createClass({
    render: function(){
        var game = this.props.game;
        if (game.village.getKittens() <= 5){
            return null;
        }
        return $r(WToolbarIconContainer, {
            game: this.props.game,
            getTooltip: this.getTooltip,
            className: "happiness"
        },
            $r("div", {
                dangerouslySetInnerHTML: {
                    __html: "(:3)&nbsp;" + Math.floor(game.village.happiness * 100) + "%"
                }
            })
        );
    },
    getTooltip: function(){
        this.game = this.props.game;    //hack

        var base = this.game.getEffect("happiness");
		//var population = this.game.village.getKittens() *  2;
		var tooltip = $I("village.happiness.base") + ": 100%<br>" +
			   $I("village.happiness.buildings") + ": +" + (Math.floor(base)) + "%<br>";

		//----------------------
		var resHappiness = 0;
		var resources = this.game.resPool.resources;
        var happinessPerLuxury = 10;
        //philosophy epicurianism effect
        happinessPerLuxury += this.game.getEffect("luxuryHappinessBonus");
		for (var i = resources.length - 1; i >= 0; i--) {
			if (resources[i].type != "common" && resources[i].value > 0){
				resHappiness += happinessPerLuxury;
				if(resources[i].name == "elderBox" && this.game.resPool.get("wrappingPaper").value){
					resHappiness -= happinessPerLuxury; // Present Boxes and Wrapping Paper do not stack.
				}
			}
		}
		tooltip += $I("village.happiness.rare.resources") + ": +" + this.game.getDisplayValueExt(resHappiness, false, false, 0) + "%<br>";
		//---------------------
		var karma = this.game.resPool.get("karma");
		if (karma.value > 0){
			tooltip += $I("village.happiness.karma") + ": +" + this.game.getDisplayValueExt(karma.value, false, false, 0) + "%<br>";
		}

		if (this.game.calendar.festivalDays > 0){
			var festivalHappinessEffect = 30 * (1+this.game.getEffect("festivalRatio"));
			tooltip += $I("village.happiness.festival") + ": +" + this.game.getDisplayValueExt(festivalHappinessEffect, false, false, 1) + "%<br>";
		}

        var unhappiness = this.game.village.getUnhappiness() / (1 + this.game.getEffect("unhappinessRatio")),
			unhappinessReduction = unhappiness * this.game.getEffect("unhappinessRatio", true);
        var environmentEffect = this.game.village.getEnvironmentEffect();
		tooltip += $I("village.happiness.penalty") + ": -" + this.game.getDisplayValueExt(unhappiness + unhappinessReduction, false, false, 0) + "%<br>";

        tooltip += "* " + $I("village.happiness.penalty.base") + ": -" + this.game.getDisplayValueExt(unhappiness, false, false, 0) + "%<br>";
		tooltip += "* " + $I("village.happiness.penalty.mitigated") + ": " + this.game.getDisplayValueExt(-unhappinessReduction, false, false, 0) + "%<br>";
        tooltip += $I("village.happiness.environment") + ": " + this.game.getDisplayValueExt(environmentEffect, false, false, 0) + "%<br>";
        var overpopulation = this.game.village.getKittens() - this.game.village.maxKittens;
        if (overpopulation > 0){
            tooltip += $I("village.happiness.overpopulation") + ": -" + overpopulation * 2 + "%<br>";
        }

        return tooltip;
    }
});

WToolbarEnergy = React.createClass({
    render: function(){
        var game = this.props.game;

        if (!game.science.get("electricity").researched){
            return null;
        }

        var resPool = game.resPool;
        var className = "";
        if (resPool.energyProd < resPool.energyCons) {
            className = " warning";
        } else if (resPool.energyWinterProd < resPool.energyCons) {
            className = " warningWinter";
        }

        return $r(WToolbarIconContainer, {
            game: game,
            getTooltip: this.getTooltip,
            className: "energy" + className
        },
            $r("div", {
                dangerouslySetInnerHTML: {
                    __html: "&#9889;&nbsp;" + game.getDisplayValueExt(resPool.energyProd - resPool.energyCons) + $I("unit.watt")
				}
            })
        );
    },
    getTooltip: function(){
        this.game = this.props.game;    //hack

        var resPool = this.game.resPool;
		var energy = resPool.energyProd - resPool.energyCons;

        var delta = this.game.resPool.getEnergyDelta();
		var penalty = energy >= 0 ? "" : "<br><br>" + $I("navbar.energy.penalty") + "<span class='energyPenalty'>-" + Math.floor( (1 - delta) * 100) + "%</span>";

		return $I("navbar.energy.prod.short") + " <span class='energyProduction'>" +  this.game.getDisplayValueExt(resPool.energyProd, true, false) + $I("unit.watt") + "</span>" +
			   "<br>" + $I("navbar.energy.cons.short") + " <span class='energyConsumption'>-" +  this.game.getDisplayValueExt(resPool.energyCons) + $I("unit.watt") + "</span>" + penalty;
    }
});

WToolbarMOTD = React.createClass({
    render: function(){
        var game = this.props.game;

        var server = game.server;
		if (!server.showMotd || !server.motdTitle) {
			return null;
        }

        return $r(WToolbarIconContainer, {
            game: game,
            getTooltip: this.getTooltip,
            className: server.motdFreshMessage ? "freshMessage" : null
        },
            $r("div", {
                dangerouslySetInnerHTML: {
                    __html: "&nbsp;" + server.motdTitle + "&nbsp;"
                }
            })
        );
    },
    getTooltip: function(){
        this.game = this.props.game;    //hack

        var server = this.game.server;
		if (server.showMotd && server.motdContent) {
			server.motdFreshMessage = false;
			return "有问题找百科或者猫国QQ群<br />" + server.motdContent;
		}
    }
});
WToolbarPollution = React.createClass({
    freshMessage: false,
    message: "",

    render: function(){
        var game = this.props.game;

        if(game.bld.cathPollution > 100000 || game.science.get("ecology").researched){
            return $r(WToolbarIconContainer, {
                game: game,
                getTooltip: this.getTooltip,
                className: this.freshMessage ? "energy warning": null
            },
                $r("div", {}, 
                "🏭" + (game.science.get("ecology").researched ? (" " + this.getPollutionMod()) : ""))
            );
        }
        return null;
    },
    getTooltip: function(notUpdateFreshMessage){
        this.game = this.props.game;    //hack

        var message = "";
        var eqPol = this.game.bld.getEquilibriumPollution();
        var eqPolLvl = this.game.bld.getPollutionLevel(eqPol);
        var pollution = this.game.bld.cathPollution;
        var polLvl = this.game.bld.getPollutionLevel();
        var polLvlShow = this.game.bld.getPollutionLevel(pollution * 2);
        if (polLvl >= 4){
            message += $I("pollution.level1") + "<br/>" + $I("pollution.level2") + "<br/>" + $I("pollution.level3", [this.game.getDisplayValueExt(game.villageTab.getVillageTitle(), false, false, 0)]) + "<br/>" + $I("pollution.level4");
        }
        else if (polLvlShow == 3){
            message += $I("pollution.level1") + "<br/>" + $I("pollution.level2") + "<br/>" + $I("pollution.level3", [this.game.getDisplayValueExt(game.villageTab.getVillageTitle(), false, false, 0)]);
        }
        else if (polLvlShow == 2){
            message += $I("pollution.level1") + "<br/>" + $I("pollution.level2");
        }
        else if (polLvlShow == 1){
            message += $I("pollution.level1");
        } else {
            message = $I("pollution.level0");
        }
        
        var warnLvl = this.game.bld.getPollutionLevel(pollution * 4);
        if (warnLvl >= 1 && warnLvl <= 4 && warnLvl > polLvlShow && warnLvl <= eqPolLvl) {
            message += "<br/>" + $I("pollution.level" + warnLvl + ".warning");
        }
        if (pollution * 1.5 <= eqPol || eqPolLvl > polLvl){
            message += "<br/>" + $I("pollution.increasing");
        }
        else if (pollution >= 0 && this.game.bld.cathPollutionPerTick <= 0 && eqPolLvl <= polLvl){
            message += "<br/>" + $I("pollution.cleaning");
        }
        else if (eqPolLvl == polLvl && eqPol > 0){
            message += "<br/>" + $I("pollution.equilibrium");
        }
        else {
            message += "<br/>" + $I("pollution.pristine");
        }
        if (notUpdateFreshMessage){
            return message;
        }
        message +="<br/>二氧化碳: " + (game.science.get("ecology").researched ? 
            this.getPollutionMod() : $I("pollution.unspecified"));    
        this.freshMessage = false;
        return message;
    },

    getPollutionMod(){
        return game.getDisplayValueExt((game.bld.cathPollution / game.bld.getPollutionLevelBase())*100) + "ppm";
    }
});

WToolbarFPS = React.createClass({
    render: function(){
        var game = this.props.game;

        if (!game.isLocalhost){
            return null;
        }

        return $r(WToolbarIconContainer, {
            game: game,
            getTooltip: this.getTooltip
        },
            $r("div", {},
                "fps: " + game.fps.ms + " ms"
            )
        );
    },

    getTooltip: function(){
        var fps = this.props.game.fps;

        return " avg: " + fps.avg.toFixed() +
				" ms [" + fps.avg0.toFixed() +
				"." + fps.avg1.toFixed() +
				"." + fps.avg2.toFixed() +
				"." + fps.avg3.toFixed() +
				"." + fps.avg4.toFixed() + "] (Cl. to res.)";
    }
});

WBLS = React.createClass({
    render: function(){
        var game = this.props.game;

        var sorrowRes = game.resPool.get("sorrow"),
            sorrow = sorrowRes.value;

        if (!sorrow){
            return null;
        }
		var isMax = (sorrowRes.value == sorrowRes.maxValue);

        return $r(WToolbarIconContainer, {
            game: game,
            getTooltip: this.getTooltip,
            className: "sorrow" + (isMax ? " max" : "")
        },
            $r("div", {},
                $I("resources.sorrow.short") + ": " + sorrow.toFixed() + "%"
            )
        );
    },

    getTooltip: function(){
        return $I("resources.sorrow.full");
    }
});

WLoginForm = React.createClass({
    getInitialState: function(){
        return {
            login: null,
            password: null,
            isLoading: false,
            setEmail:null,
        }
    },

    render: function(){
        if (this.state.isLoading){
            return $r("span", null, "加载中...");
        }
        var game = this.props.game;
        if (game.server.userProfile){
            var userProfile = game.server.userProfile;
            return $r("div", {className: "userProfile"},[
                $r("img", {src: "https://q2.qlogo.cn/headimg_dl?dst_uin=" +
                    (userProfile.email ? userProfile.email : "n/a")
                + "&spec=1",
                width:"25px",
                height:"25px"}),
                $r("a", {
                    href: "https://kittensgame.com/ui/profile", target:"_blank"
                }, userProfile.qqName)
            ]);

        }
        return $r(
            "span",
            {onClick: function (e){ e.stopPropagation(); }},
            [
                $r("div", {className: "row"}, [
                    "邮箱:",
                        $r("input", {
                            type: "email",
                            onChange: this.setLogin,
                            value: this.state.login
                        } ),
                    "密码:",
                        $r("input", {
                            type: "password",
                            onChange: this.setPassword,
                            value: this.state.password
                        })
                ]),
                $r("div", {className: "row"}, [
                    $r("a", {
                        href:"#",
                        onClick: this.login
                    }, "登录"),
                    $r("a", {
                        onClick: function(e){
                            e.stopPropagation();
                            game.ui.showDialog("registerDiv");
                    }}, "注册")
                ])
            ]
        )
    },

    //block keyboard hooks from changing UI when we type login/password
    setLogin(e){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        this.setState({login: e.target.value});
    },

    setEmail(){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        this.setState({login: e.target.value});
    },

    setPassword(e){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        this.setState({password: e.target.value});
    },

    login: function(){
        var self = this;
        game.msg('注意如果尝试次数过多，账户会被锁定', "important");

        this.setState({isLoading: true});
        $.ajax({
            cache: false,
            type: "POST",
            dataType: "JSON",
            data: {
                email: this.state.login,
                password: this.state.password
            },
			xhrFields: {
				withCredentials: true
			},
            timeout : 5000,
			error:function (xhr) {
                game.msg(xhr.responseText, "important");
            },
			url: this.props.game.server.getServerUrl() + "/user/login/",
			dataType: "json"
		}).done(function(resp){
            if (resp.id){
                self.props.game.server.setUserProfile(resp);
            }
		}).always(function(){
            self.setState({isLoading: false});
        });
    }
});

WCloudSaves = React.createClass({

    bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },

    render: function(){
        var self = this;

        var game = this.props.game;
        if (!game.server.userProfile){
            return null;
        }

        var saveData = game.server.saveData;
        var hasActiveSaves = false;
        if (saveData && saveData.length){
            for (var i in saveData){
                if (saveData[i].guid == game.telemetry.guid){
                    hasActiveSaves = true;
                }
            }
        }

        /**
         * TODO: use local state when appropriate (dataset, animation, etc)
         * and override it with game's server real data on update cycle
         *
         * This way we don't have to handle complex state management on the game.server side
         */
        return $r("div", null, [

            $r("div", {className:"save-record-container"},
            //header
            saveData && $r("div", {className:"save-record header"}, [
                $r("div", {className:"save-record-cell"}, "存档ID"),
                $r("div", {className:"save-record-cell"}, "存档游戏时间"),
                $r("div", {className:"save-record-cell"}, "上次更新时间"),
                $r("div", {className:"save-record-cell"}, "大小"),
                $r("div", {className:"save-record-cell"}, "存档操作")
            ]),
            //body
            //TODO: externalize save record as component?
            saveData && saveData.map(function(save){
                var isActiveSave = (save.guid == game.telemetry.guid);
                return $r("div", {className:"save-record"}, [
                    $r("div", {className:"save-record-cell"},
                        isActiveSave ? "[" + $I("ui.kgnet.save.current") + "]" : ""
                    ),
                    $r("div", {className:"save-record-cell"},
                        save.index ?
                        (save.index.calendar.year +"年" + "，" + save.index.calendar.day + " 天 ") :
                        "加载中..."
                    ),
                    $r("div", {className:"save-record-cell"},
                        new Date(save.timestamp).toLocaleDateString("zh-CN", {
                            month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: "h24"
                        })
                    ),
                    $r("div", {className:"save-record-cell"}, self.bytesToSize(save.size)),
                    isActiveSave && $r("a", {
                        className: "link",
                        title: "上传你当前游戏存档到官网（会覆盖旧存档）",
                        onClick: function(e){
                            e.stopPropagation();
                            game.server.pushSave();
                        }}, $I("ui.kgnet.save.save")),
                    $r("a", {
                        className: "link",
                        title: "下载并加载云存档（你当前存档会丢失）",
                            onClick: function(e){
                            e.stopPropagation();
                            game.server.loadSave(save.guid);
                            game.msg('从国外官网下载有延迟，请稍候', "important");
                        }}, $I("ui.kgnet.save.load")),
                ])
            })),

            $r("div", {className:"save-record-container"}, [
                (saveData && !hasActiveSaves) && $r("div", {className:"save-record"},[
                    $r("a", {onClick: function(e){
                        e.stopPropagation();
                        game.server.pushSave();
                    }}, "新的存档 (" + game.telemetry.guid + ")")
                ]),
                $r("div", {className:"save-record"},[
                    $r("a", {
                        className: "link",
                        title: "更新信存档信息。这是安全按钮不会改变任何数据。",
                        onClick: function(e){
                            e.stopPropagation();
                            game.server.syncSaveData();
                            setTimeout(function() {
                                if (!game.server.saveData) {
                                    game.msg('同步存档失败，请点击同步存档教程', "important");
                                }
                            }, 1500);
                        }
                    }, $I("ui.kgnet.sync")),
                    !saveData && $r("a", {
                        className: "link",
                        target: "_blank",
                        title: "同步存档教程",
                        href: "https://petercheney.gitee.io/baike/?file=007-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/02-%E4%BA%91%E5%AD%98%E6%A1%A3"
                    }, "同步存档失败的教程")
                ])
            ])
        ])
    }
});

WLogin = React.createClass({
    getInitialState: function(){
        return {
            isExpanded: false
        }
    },

    render: function(){
        var game = this.props.game;

        return $r(WToolbarIconContainer, {
            game: game,
        },
            $r("div",
                {
                    onClick: this.toggleExpanded
                },
                [
                    $r("span", {
                        className: "kgnet-login-link status-indicator-" + (game.server.userProfile ? "online" : "offline"),
                        title: "国外官方云存档"
                    }, "* " + (game.server.userProfile ? 
                        $I("ui.kgnet.online") : $I("ui.kgnet.login")
                    )),
                    this.state.isExpanded && $r("div", {
                        className: "login-popup button_tooltip tooltip-block"
                    },
                        $r("div", null,
                            $r(WLoginForm, {game: game}),
                            $r(WCloudSaves, {game: game})
                        )
                    )
                ]
            )
        );
    },

    toggleExpanded: function(){
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    }
});

WToolbar = React.createClass({
    getInitialState: function(){
        return {game: this.props.game};
    },

    componentDidMount: function(){
        var self = this;
        this.onUpdateHandler = dojo.subscribe("ui/update", function(game){
            self.setState({game: game});
        });
    },

    componentWillUnmount(){
        dojo.unsubscribe(this.onUpdateHandler);
    },

    getIcons: function(){
        var icons = [];
        icons.push(
            $r(WToolbarFPS, {game: this.state.game}),
            $r(WToolbarPollution, {game: this.state.game}),
            $r(WToolbarHappiness, {game: this.state.game}),
            $r(WToolbarEnergy, {game: this.state.game}),
            $r(WBLS, {game: this.state.game}),
            $r(WToolbarMOTD, {game: this.state.game}),
            $r(WLogin, {game: this.state.game})

        );
        return icons;
    },

    render: function(){
        var icons = this.getIcons();
        return $r("div", {className:"icons-container"}, icons);
    }
});
