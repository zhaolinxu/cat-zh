WMapTile = React.createClass({
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
        var data = this.props.data;
        return $r("div", {
            className: "map-cell",
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp
        },
           $r("span", {className: "coord"}, "#" + this.props.x + "_" + this.props.y),
            data ? $r("div", {className: "label"}, 
                $r("div", null, data.title),
                $r("div", null, "lv." + data.level + " ["+ data.cp + "cp]")
            ) : null
        );
    },

    onMouseDown: function(e){
        this.props.onMouseDown(e, this.props.x, this.props.y);
    },

    onMouseUp: function(e){
        this.props.onMouseUp();
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

        //console.log(this.state.dataset);

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

        data.cp++;
        //console.log("dataset:", dataset);
        this.setState({dataset: dataset});

        this.timeout = setTimeout(this.explore.bind(this, id), 25);
    }
});

WMapSection = React.createClass({
    render: function(){   
        var mapDataset = {"3_2":{
            title: "village",
            level: 1,
            cp: 0
        }};     
        return $r(WMapViewport, {dataset: mapDataset});
    }
});