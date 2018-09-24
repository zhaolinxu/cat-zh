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
            onMouseUp: null
        };
    },

    render: function(){
        var data = this.props.data || {
            level: 0,
            cp: 0
        };

        var toLevel = 100 * Math.pow(data.level+1, 1.18),
        percentExplored = (data.cp / toLevel) * 100;


        var tileClass = "";
        var fillBracket = percentExplored / 10;     //100/10 where 100 is xp to level (vary), 10 is 10% increments from 0% to 90%
        /*if (fillBracket > 0){
            tileClass = " dots-" + Math.round(fillBracket);
        }*/

        if (this.state.isFocused){
            tileClass += " focused";
        }
        return $r("div", {
            className: "map-cell" + tileClass,
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onMouseOver: this.onMouseOver, 
            onMouseOut: this.onMouseOut,

            style: {
                backgroundColor: "rgb(" + (255 - 7*data.level) + ","  + (255 - 20*data.level) + ",255)"
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
                            $r("div", null, "lv." + data.level + " ["+ data.cp + "/" + toLevel.toFixed() + "cp]("+ percentExplored.toFixed() + "%)")
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
        return {dataset: {}};
    },
    getInitialState: function(){
        return {dataset: this.props.dataset};
    },

    render: function(){
        var rows = [];
        for (var i = 0; i < 5; i++){

            var cells = [];
            for (var j = 0; j < 7; j++){
                cells.push(
                    $r(WMapTile, {x: j, y: i, 
                        data: this.state.dataset[j+"_"+i],
                        onMouseDown: this.onMouseDown,
                        onMouseUp: this.onMouseUp
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
        this.explore(id);    
    },

    onMouseUp: function(){
        clearTimeout(this.timeout); 
    },

    explore: function(id){
        var dataset = this.state.dataset;
        var data = dataset[id];
        if (!data){
            data = {level: 0, cp: 0};
            dataset[id] = data;
        }

        var catpower = game.resPool.get("manpower");
        if (catpower.value >= 1){
            catpower.value--;

            data.cp++;
            if (data.cp >= 100 * Math.pow(data.level+1, 1.18)){
                data.cp = 0;
                data.level++;
            }

            this.setState({dataset: dataset});
        }
        this.timeout = setTimeout(this.explore.bind(this, id), 25);
    }
});

WMapSection = React.createClass({
    getDefaultProperties: function(){
        return {game: game};
    },
    getInitialState: function(){
        return {game: this.props.game};
    },
    render: function(){   
        /*var mapDataset = {"3_2":{
            title: "village",
            level: 1,
            cp: 0
        }};  */   

        var map = this.state.game.village.map,
            mapDataset = map.villageData;

        return $r("div", null, [
            $r("div", null, "Explored:" + map.exploredLevel + "%"),
            $r(WMapViewport, {dataset: mapDataset})
        ]);
    },
    componentDidMount: function(){
        var self = this;
        dojo.subscribe("ui/update", function(game){
            self.setState({game: game});
        });
    }
});