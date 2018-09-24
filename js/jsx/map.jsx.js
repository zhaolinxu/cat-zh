WMapTile = React.createClass({
    getInitialState: function() {
        return {
            isFocused: false
        };
    },
    
    getDefaultProperties: function(){
        return {
            x: 0,
            y: 0,
            data: {
                level: 0,
                cp: 0
            },
            onMouseDown: null,
            onMouseUp: null,
            scale: 0
        };
    },

    render: function(){
        var data = this.props.data || {
            level: 0,
            cp: 0
        };

        var toLevel = game.village.map.toLevel(this.props.x, this.props.y);
        var percentExplored = (data.cp / toLevel) * 100;


        var tileClass = "";
        var fillBracket = percentExplored / 10;     //100/10 where 100 is xp to level (vary), 10 is 10% increments from 0% to 90%
        /*if (fillBracket > 0){
            tileClass = " dots-" + Math.round(fillBracket);
        }*/

        if (this.state.isFocused){
            tileClass += " focused";
        }

        var scale = (1 - this.props.scale/2);

        return $r("div", {
            className: "map-cell" + tileClass,
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onMouseOver: this.onMouseOver, 
            onMouseOut: this.onMouseOut,

            style: {
                backgroundColor: "rgb(" + (255 - 7*data.level) + ","  + (255 - 20*data.level) + ",255)",
                width: (35 * scale) + "px",
                height: (35 * scale) + "px"
            }
        },
            /*$r("svg", null, 
                $r("rect", {style: {fill: "url(#dots-" + Math.round(fillBracket) + ") #aaa"}})
            ),*/

            $r("span", {className: "coord"}, this.state.isFocused ? "[" + this.props.x + "," + this.props.y + "]" : "..."),
            data && $r("div", {className: "label"}, data.title),
            this.state.isFocused && 
                ($r("div", {className: "tooltip-content"}, 
                    [data ? 
                        $r("div", {className: "label"}, [
                            data.type && $r("div", null, "Terrain:" + data.type),
                            $r("div", null, "lv." + data.level + " ["+ data.cp.toFixed() + "/" + toLevel.toFixed() + "cp]("+ percentExplored.toFixed() + "%)")
                        ]) 
                        : $r("div", {className: "label"}, "Nothing interesting here")]
                ))
        );
    },

    onMouseDown: function(e){
        this.props.onMouseDown(e, this.props.x, this.props.y);
    },

    onMouseUp: function(e){
        this.props.onMouseUp();
    },

    onMouseOver: function(){
        this.setState({isFocused: true});
    },

    onMouseOut: function(){
        this.setState({isFocused: false});
    }
});

WMapViewport = React.createClass({
    getDefaultProperties: function(){
        return {dataset: {}, exploredLevel: 0};
    },
    getInitialState: function(){
        return {dataset: this.props.dataset};
    },

    render: function(){
        var expLevel = this.props.exploredLevel;

        var scale = 0;   
        if (expLevel > 10){
            scale = 0.2;
        }    
        if (expLevel > 50){
            scale = 0.4;
        } 
        if (expLevel > 100){
            scale = 0.6;
        } 
        /*if (expLevel > 15){
            scale = 0.8;
        }*/

        var rows = [];
        for (var i = 0; i < 5 * (1+scale); i++){

            var cells = [];
            for (var j = 0; j < 7 * (1+scale); j++){
                cells.push(
                    $r(WMapTile, {x: j, y: i, 
                        data: this.state.dataset[j+"_"+i],
                        onMouseDown: this.onMouseDown,
                        onMouseUp: this.onMouseUp,
                        onMouseOut: this.onMouseOut,
                        scale: scale
                    })
                );
            }

            var row = $r("div", {className: "map-row"}, cells);
            rows.push(row);
        }
        return $r("div", {className:"map-viewport"}, 
            rows
        );
    },
    onMouseDown: function(e, x, y){
        e.preventDefault();

        var id = x + "_" + y;
        this.explore(id, x, y);    
    },

    onMouseUp: function(){
        if (this.timeout){
            clearTimeout(this.timeout); 
        }
    },

    onMouseOut: function(){
        if (this.timeout){
            clearTimeout(this.timeout); 
        }
    },

    explore: function(id, x, y){
        var dataset = this.state.dataset;
        var data = dataset[id];
        if (!data){
            data = {
                level: 0, 
                cp: 0
            };
            dataset[id] = data;
        }

        var catpower = game.resPool.get("manpower"),
            explorePower = 1 * (1 + game.getEffect("exploreRatio")),
            toLevel = game.village.map.toLevel(x, y);
            

        if (catpower.value >= explorePower){
            catpower.value -= explorePower;

            data.cp += explorePower;
            if (data.cp >= toLevel){
                data.cp = 0;
                data.level++;
            }

            this.setState({dataset: dataset});
        }
        if (this.timeout){
            clearTimeout(this.timeout); 
        }
        this.timeout = setTimeout(this.explore.bind(this, id, x, y), 25);
    }
});

WMapSection = React.createClass({
    getDefaultProperties: function(){
        return {map: game.village.map};
    },

    getInitialState: function(){
        return {map: this.props.map};
    },

    render: function(){   
        if (!this.state.map){
            return null;
        }

        var map = this.state.map,
            mapDataset = map.villageData;

        return $r("div", null, [
            $r("div", null, "Explored: " + map.exploredLevel + "% (Price reduction: " + (map.getPriceReduction() * 100).toFixed(3) + "%)"),
            $r("div", null, "Exploration bonus: " + (map.villageLevel-1) * 10 + "%"),
            $r("a", {className:"link", href:"#", onClick: this.resetMap}, "Reset map"),
            $r(WMapViewport, {dataset: mapDataset, exploredLevel: map.exploredLevel})
        ]);
    },

    componentDidMount: function(){
        var self = this;
        dojo.subscribe("ui/update", function(game){
            self.setState({map: game.village.map});
        });
    },

    resetMap: function(){
        game.village.map.resetMap();
        game.render();  //some messy case here
    }
});