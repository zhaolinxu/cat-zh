/**
 * Behold the bringer of light!
 */ 
dojo.declare("com.nuclearunicorn.game.religion.ReligionManager", com.nuclearunicorn.core.TabManager, {
	
	game: null,
	
	faith: 0,
	
	constructor: function(game){
		this.game = game;
	},
	
	save: function(saveData){
		saveData.religion = {
			faith: this.faith
		}
	},
	
	load: function(saveData){
		this.faith = saveData.religion ? saveData.religion.faith : 0;
	},
	
	update: function(){
		if (this.game.resPool.get("faith").value > 0){
			this.game.religionTab.visible = true;
		}
	}
	
});


dojo.declare("com.nuclearunicorn.game.ui.tab.ReligionTab", com.nuclearunicorn.game.ui.tab, {
	sacrificeBtn : null,
	
	render : function(container) {
		var zigguratCount = this.game.bld.get("ziggurat").val;
		if (zigguratCount > 0){
			var zigguratPanel = new com.nuclearunicorn.game.ui.Panel("Ziggurats");
			var content = zigguratPanel.render(container);
			
			var sacrificeBtn = new com.nuclearunicorn.game.ui.Button({ 
				name: "Sacrifice Unicorns",
				description: "Tears for the tears lord",
				handler: function(btn){
					btn.game.msg("2500 unicorns sacrificed. You've got a " + zigguratCount + " unicorn tears!");
					btn.game.resPool.get("tears").value += 1 * zigguratCount;
				},
				prices: [{ name: "unicorns", val: 2500}]
			}, this.game);
			sacrificeBtn.render(content);
			this.sacrificeBtn = sacrificeBtn;
			
			//todo: all the dark miracles there
		}
		
		var religionPanel = new com.nuclearunicorn.game.ui.Panel("Order of the Sun");
		var content = religionPanel.render(container);
		
		var faithCount = dojo.create("span", { style: { display: "block", marginBottom: "10px" }}, content);
		this.faithCount = faithCount;
		
		var praiseBtn = new com.nuclearunicorn.game.ui.Button({ 
			name: "Praise the sun!",
			description: "Convert all your accumulated faith to the total pool",
			handler: function(btn){
				var faith = btn.game.resPool.get("faith");
				btn.game.religion.faith += faith.value;
				faith.value = 0.01;	//have a nice autoclicking
			}
		}, this.game);
		
		praiseBtn.render(content);
		this.praiseBtn = praiseBtn;
		
	},
	
	update: function(){
		if (this.sacrificeBtn){
			this.sacrificeBtn.update();
		}
		var faith = this.game.religion.faith;
		if (faith && this.faithCount){
			this.faithCount.innerHTML = "Total faith: " + this.game.religion.faith.toFixed();
		}
	}
});
