/**
 * Economy
 * 
 * Pretty much mimics diplomacy in terms of resources
 */ 


dojo.declare("com.nuclearunicorn.game.ui.tab.Economy", com.nuclearunicorn.game.ui.tab, {
	
	racePanels: null,
	
	constructor: function(tabName, game){
		var self = this;
		this.game = game;
		
		this.racePanels = [];
	},
	
	render: function(tabContainer){
		this.inherited(arguments);
		var races = this.game.diplomacy.races;
		
		for (var i = 0; i< races.length; i++){
			var race = races[i];
			if (!race.unlocked){
				continue;
			}

			var racePanel = new com.nuclearunicorn.game.ui.Panel(race.title);
			var panelContent = racePanel.render(tabContainer);

			//---------- render shit there -------------
			
			var table = dojo.create("table", { className: "table",
				style:{
					textAlign: "center",
					width: "100%"
			}}, panelContent);
			var tr = dojo.create("tr", null, table);
			
			dojo.create("th", { innerHTML: "resource"}, tr);
			dojo.create("th", { innerHTML: "supply"}, tr);
			dojo.create("th", { innerHTML: "demand"}, tr);
			dojo.create("th", { innerHTML: "buy"}, tr);
			dojo.create("th", { innerHTML: "sell"}, tr);
			
			var resData = this.game.resPool.resourceData;
			for (var j = 0; j< resData.length; j++){
				var res = resData[j];
				if (res.tradable){
					var tr = dojo.create("tr", {}, table);
					
					//res
					var td = dojo.create("td", {innerHTML: res.name,style: {
							borderBottom: "1px solid gray"
					}}, tr);
					
					//supply
					var td = dojo.create("td", {innerHTML: "0", style: {
							borderBottom: "1px solid gray"
					}}, tr);
					
					//demand
					var td = dojo.create("td", {innerHTML: "0", style: {
							borderBottom: "1px solid gray"
					}}, tr);
					
					//buy
					var td = dojo.create("td", {innerHTML: "0", style: {
							borderBottom: "1px solid gray"
					}}, tr);
					
					//sell
					
					var td = dojo.create("td", {innerHTML: "0", style: {
							borderBottom: "1px solid gray"
					}}, tr);
				}
			}
			
			
			this.racePanels.push(racePanel);
		}
	},
	
		
	update: function(){
		this.inherited(arguments);
	}
	
});
