
dojo.declare("classes.managers.ResourceManager", com.nuclearunicorn.core.TabManager, {
	
	//=========================================
	//				COMMON
	//=========================================
	resourceData: [
	{
		name : "catnip",
		type : "common",
		visible: true
	},{
		name : "wood",
		type : "common",
		craftable: true,
		visible: true
	},{
		name : "minerals",
		type : "common",
		visible: true
	},{
		name : "coal",
		type : "common",
		visible: true
	},{
		name : "iron",
		type : "common",
		visible: true
	},{
		name : "titanium",
		type : "common",
		visible: true,
	},{
		name : "gold",
		type : "common",
		visible: true
	},{
		name : "oil",
		type : "common",
		visible: true
	},{
		name : "uranium",
		type : "common",
		visible: true,
		color: "#4EA24E"
	},{
		name : "unobtainium",
		type : "common",
		visible: true,
		color: "#A00000"
	},
	
	//=========================================
	//			   TRANSIENT
	//=========================================
	{
		name : "manpower",
		title: "catpower",
		type : "common",
		visible: true,
		transient: true,		//cant be affected by magneto bonus
		color: "#DBA901"
	},{
		name : "science",
		type : "common",
		visible: true,
		transient: true,
		color: "#01A9DB"
	},{
		name : "culture",
		type : "common",
		visible: true,
		transient: true,
		color: "#DF01D7"
	},{
		name : "faith",
		type : "common",
		visible: true,
		transient: true,
		color: "gray"
	},{
		name : "kittens",
		type : "common",
		transient: true,
		visible: true
	},{
		name : "zebras",
		type : "common",
		transient: true,
		visible: true
	},{
		name : "starchart",
		type : "common",
		transient: true,
		visible: true,
		color: "#9A2EFE"
	},{
		name : "antimatter",
		type : "common",
		transient: true,
		visible: true,
		color: "#5A0EDE"
	},
	
	//=========================================
	// 			  luxury resources
	//=========================================
	{
		name : "furs",
		type : "uncommon",
		transient: true,
		visible: true
	},{
		name : "ivory",
		type : "uncommon",
		transient: true,
		visible: true
	},{
		name : "spice",
		type : "uncommon",
		transient: true,
		visible: true
	},{
		name : "unicorns",
		type : "rare",
		transient: true,
		visible: true
	},{
		name : "alicorn",
		title: "alicorns",
		type : "rare",
		visible: true
	},{
		name : "necrocorn",
		title: "necrocorns",
		type : "rare",			//todo: some special FX
		visible: true,
		color: "#E00000"
	},{
		name : "tears",
		type : "rare",
		visible: true
	},{
		name : "karma",
		type : "rare",
		visible: true
	},{
		name : "paragon",
		type : "common",
		visible: true,
		color: "#6141CD"
	},{
		name : "timeCrystal",
		title: "time crystal",
		type : "common",
		visible: true,
		color: "#14CD61"
	},{
		name : "sorrow",
		type : "common",
		visible: false,
		color: "black"
	},
	
	//=========================================
	// 				    CRAFT 
	//=========================================
	{
		name : "beam",
		type : "common",
		craftable: true
	},{
		name : "slab",
		type : "common",
		craftable: true
	},{
		name : "concrate",
		title: "concrete",
		type : "common",
		craftable: true
	},{
		name : "plate",
		type : "common",
		craftable: true
	},{
		name : "steel",
		type : "common",
		craftable: true,
		visible: false,
		color: "gray"
	},{
		name : "alloy",
		type : "common",
		craftable: true,
		visible: false,
		color: "gray"
	},{
		name : "eludium",
		type : "common",
		craftable: true,
		visible: false,
		color: "darkViolet"
	},{
		name : "gear",
		type : "common",
		craftable: true,
		color: "gray"
	},{
		name : "scaffold",
		type : "common",
		craftable: true,
		color: "#FF7F50"
	},{
		name : "ship",
		type : "common",
		craftable: true,
		color: "#FF7F50"
	},{
		name : "tanker",
		type : "common",
		craftable: true,
		color: "#CF4F20"
	},{
		name : "parchment",
		type : "common",
		craftable: true,
		color: "#DF01D7"
	},{
		name : "manuscript",
		type : "common",
		craftable: true,
		color: "#01A9DB"
	},{
		name : "compedium",
		title: "compendium",
		type : "common",
		craftable: true,
		color: "#01A9DB"
	},{
		name : "blueprint",
		type : "common",
		transient: true,
		visible: true,
		craftable: true,
		color: "#01A9DB"
	},{
		name : "megalith",
		type : "common",
		craftable: true,
		color: "gray"
	}],
	
	resources: null,
	
	village: null,
	
	game: null,
	
	constructor: function(game){
		this.game = game;
		
		this.resources = [];
		
		for (var i = 0; i< this.resourceData.length; i++){
			var res = dojo.clone(this.resourceData[i]);
			res.value = 0;
			res.perTick = 0;
			this.resources.push(res);
		}
	},
	
	get: function(name){
		for (var i = 0; i < this.resources.length; i++){
			var res = this.resources[i];
			if (res.name == name){
				return res;
			}
		}
		
		//if no resource found, register new
		return this.addResource(name);
	},
	
	createResource: function(name){
		var res = {
			name: name,
			value: 0,
			perTick: 0
		};
		return res;
	},
	
	addResource: function(name){
		var res = this.createResource(name);
		this.resources.push(res);
		
		return res;
	},
	
	addResAmt: function(name, value){
		var res = this.get(name);

		if (value){
			res.value += value;
		}
		if (res.maxValue && res.value > res.maxValue){
			res.value = res.maxValue;
		}
		if (res.value < 0){
			res.value = 0;
		}
	},

	/**
	 * Iterates resources and updates their values with per tick increment
	 */
	update: function(){

		var buildingResMax = {};
		//----------------- get +MAX effect per building --------------------
		for (var i = 0; i < this.game.bld.buildingsData.length; i++){
			var bld = this.game.bld.buildingsData[i];
			if (bld.name == "accelerator"){	//TODO: move all endgame storage stuff there, probably store a list somewhere
				continue;
			}
			for (var effect in bld.effects) {
				var maxIndex = effect.indexOf("Max");
				if (maxIndex != -1) {
					var resource = effect.substr(0, maxIndex);
					var resMax = buildingResMax[resource] || 0
					buildingResMax[resource] = resMax + bld.effects[effect] * bld.val;
				}
			}
		}

		for (var i = 0; i < this.resources.length; i++){
			var res = this.resources[i];

			var maxValue = buildingResMax[res.name] || 0;

			maxValue += (this.game.bld.effectsBase[res.name + "Max"] || 0);

			if (res.name == "wood" || res.name == "minerals" || res.name == "iron"){	//that starts to look awful
				maxValue = maxValue + maxValue * this.game.workshop.getEffect("barnRatio");
			}

			if (res.name == "catnip" && this.game.workshop.get("silos").researched){
				maxValue = maxValue + maxValue * this.game.workshop.getEffect("barnRatio") * 0.25;
			}

			if (res.name == "wood" ||
				res.name == "minerals" ||
				res.name == "iron" ||
				res.name == "steel" ||
				res.name == "coal" ||
				res.name == "gold" ||
				res.name == "titanium"){
				if (this.game.workshop.getEffect("warehouseRatio")){
					maxValue = maxValue + maxValue * this.game.workshop.getEffect("warehouseRatio");
				}
			}
			//------ + fixed resource bonus from accelerator and similar structures
			maxValue += (this.game.bld.get("accelerator").effects[res.name + "Max"] * this.game.bld.get("accelerator").val) || 0;

			//----------------------- once we calculated total building bonus, apply global multipliers -----------------

			// fixed bonus
			maxValue += this.game.workshop.getEffect(res.name + "Max");
			maxValue += this.game.space.getEffect(res.name + "Max");

			//Stuff for Refrigiration and (potentially) similar effects
			maxValue += maxValue * this.game.workshop.getEffect(res.name + "MaxRatio");

			var paragon = this.game.resPool.get("paragon").value;
			maxValue += maxValue * (paragon/1000);	//every 100 paragon will give a 10% bonus to the storage capacity


			if (maxValue < 0 ){
				maxValue = 0;
			}

			res.maxValue = maxValue;

			var resPerTick = this.game.getResourcePerTick(res.name) || 0;

			res.value = res.value + resPerTick;
			if (res.maxValue && res.value > res.maxValue){
				res.value = res.maxValue;
			}

			if (isNaN(res.value) || res.value < 0){
				res.value = 0;	//safe switch
			}
		}
	},
	
	setVillage: function(village){
		this.village = village;
	},
	
	reset: function(){
		this.resources = [];
	},
	
	load: function(saveData){
		//erase old resources (is there better way to handle it?
		for(var i = 0; i< this.resources.length; i++){
			var res = this.resources[i];
			res.value = 0;
			res.maxValue = 0;
		}
		
		if (saveData.resources){
			var resources = saveData.resources;
			if (resources.length){
				for(var i = 0; i< resources.length; i++){
					var savedRes = resources[i];
					
					if (savedRes != null){
						var res = this.get(savedRes.name);
						res.value = savedRes.value;
						res.perTick = savedRes.perTick;
					}
				}
			}
		}
	},

	/**
	 * Returns true if user has enough resources to construct AMT building with given price
	 */
	hasRes: function(prices, amt){
		if (!amt){
			amt = 1;
		}

		var hasRes = true;
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];

				var res = this.get(price.name);
				if (res.value < (price.val * amt)){
					hasRes = false;
					break;
				}
			}
		}
		return hasRes;
	},
	
	payPrices: function(prices){
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				var res = this.get(price.name);
				res.value -= price.val;
			}
		}
	},
	
	maxAll: function(){
		for(var i = 0; i< this.resources.length; i++){
			var res = this.resources[i];
			if (res.maxValue){
				res.value = res.maxValue;
			}
		}
	},
    
    convert: function( nameFrom, amtFrom, nameTo, amtTo){
    }
});


/**
 * Generic resource table for res/craft panels in the game.
 * 
 * Instead of re-creating the DOM tree every tick they are capable of rendering 
 * outline table and then updating related cells
 */ 

dojo.declare("com.nuclearunicorn.game.ui.GenericResourceTable", null, {
	
	game: null,
	containerId: null,
	
	resRows: null,
	
	constructor: function(game, containerId){
		this.game = game;
		this.containerId = containerId;
		
		this.resRows = [];

	},
	
	render: function(){
		if (!this.containerId) { throw "Container id is undefined for res table"; }
		dojo.empty(this.containerId);
		
		this.resRows = [];
		
		var resTable = dojo.create("table", { className: "table resTable", style: { width: "100%"} }, this.containerId);
		
		for (var i = 0; i < this.game.resPool.resources.length; i++){
			var res = this.game.resPool.resources[i];
			
			if (!res.visible){
				continue;
			}
			//migrate dual resources (e.g. blueprint) to lower table once craft recipe is unlocked
			if (res.craftable && this.game.workshop.getCraft(res.name).unlocked && res.name != "wood"){
				continue;
			}
			
			var tr = dojo.create("tr", { class: "resourceRow" }, resTable);
			
			
			var isVisible = (res.value > 0 || (res.name == "kittens" && res.maxValue));
			dojo.setStyle(tr, "display", isVisible ? "" : "none");
			//	---------------- name ----------------------
			
			var tdResName = dojo.create("td", { innerHTML: ( res.title || res.name )  + ":", style: { width: "60px"} }, tr);
			
			if (res.type == "uncommon"){
				dojo.setStyle(tdResName, "color", "Coral");
			}
			if (res.type == "rare"){
				dojo.setStyle(tdResName, "color", "orange");
				dojo.setStyle(tdResName, "textShadow", "1px 0px 10px Coral");
			}
			if (res.color){
				dojo.setStyle(tdResName, "color", res.color);
			}

			//	---------------- amt ----------------------
			var tdAmt = dojo.create("td", null, tr);
			tdAmt.textContent = this.game.getDisplayValueExt(res.value);
			
			//	---------------- max ----------------------
			var tdMax = dojo.create("td", { className: "maxRes" }, tr);
			tdMax.textContent = this.game.getDisplayValueExt(res.maxValueUI);
			
			//	---------------- +tick ----------------------
			var tdPerTick = dojo.create("td", null, tr);
			
			this.game.attachTooltip(tdPerTick, res);
			
			var tdWeatherMod = dojo.create("td", null, tr);
			
			this.resRows.push({
				resRef: res,
				rowRef: tr,
				resAmt : tdAmt,
				resMax : tdMax,
				resTick: tdPerTick,
				resWMod: tdWeatherMod
			});
		}
	},
	
	/**
	 * This section is performance-critical. Using non vanilla js here is a very *BAD* idea.
	 */ 
	update: function(){
		var reqRes = this.game.getRequiredResources(this.game.selectedBuilding);
		for (var i = 0; i < this.resRows.length; i++){
			var row = this.resRows[i];
			var res = row.resRef;
			
			var isVisible = (res.value > 0 || (res.name == "kittens" && res.maxValue));
			var isHidden = (row.rowRef.style.display === "none");
			if (isHidden && !isVisible){
				continue;
			}else if(isHidden && isVisible){
				row.rowRef.style.display = "";
			}

			var className;
			//  highlight resources for selected building
			//--------------------------------------------
			if (reqRes.indexOf(res.name) >= 0){
				className = "resourceRow highlited";
			} else {
				className = "resourceRow";
			}
			if (row.rowRef.className != className){	//surprisingly, this check makes setClass ~50% faster
				row.rowRef.className = className;
			}
			
			//---------------------------------------------

			row.resAmt.textContent = this.game.getDisplayValueExt(res.value);
			
			if (res.value > res.maxValue * 0.95){
				//rowClass += " resLimitNotice";
				row.resAmt.className = "resLimitNotice";
			} else if (res.value > res.maxValue * 0.75){
				row.resAmt.className = "resLimitWarn";
			} else if (row.resAmt.className){
				row.resAmt.className = "";
			}

			
			var maxResValue = res.maxValue ? "/" + this.game.getDisplayValueExt(res.maxValue) : "";
			row.resMax.textContent  = maxResValue;

			var perTick = this.game.opts.usePerSecondValues ? res.perTickUI * this.game.rate : res.perTickUI;
			var postfix = this.game.opts.usePerSecondValues ? "/sec" : "";
			if (this.game.opts.usePercentageResourceValues && res.maxValue){
				perTick = perTick / res.maxValue * 100;
				postfix = "%" + postfix;
			}
			
			var perTickValue = perTick ? "(" + this.game.getDisplayValueExt(perTick, true, false) + postfix + ")" : "";
			row.resTick.textContent = perTickValue;

			row.resTick.style.cursor = res.perTickUI ? "pointer" : "default";
			
			//weather mod
			var season = this.game.calendar.getCurSeason();
			if (season.modifiers[res.name] && res.perTickUI != 0 ){
					
				var modifer = (season.modifiers[res.name] + this.game.calendar.getWeatherMod() - 1)*100;
				row.resWMod.textContent = modifer ? "[" + modifer.toFixed() + "%]" : "";

				if (modifer > 0){
					dojo.setStyle(row.resWMod, "color", "green");
				}else if (modifer < 0){
					dojo.setStyle(row.resWMod, "color", "red");
				} else {
					if (row.resWMod.style.color != "black"){
						row.resWMod.style.color = "black";
					}
				}
			}
		}
	},
	
	attachTooltip: function(container, htmlProvider){
		var tooltip = dojo.byId("tooltip");
		dojo.empty(tooltip);
		
		dojo.connect(container, "onmouseover", this, dojo.partial(function(tooltip, htmlProvider, event){
			 tooltip.innerHTML = dojo.hitch(this, htmlProvider)();
			 
			 var target = event.originalTarget || event.toElement;	//fucking chrome
			 var pos = $(target).position();
			 if (!pos){
				 return;
			 }
			 
			 dojo.setStyle(tooltip, "left", pos.left + 60 + "px");
			 dojo.setStyle(tooltip, "top",  pos.top + "px");
			
			 dojo.setStyle(tooltip, "display", ""); 
			 dojo.setStyle(container, "fontWeight", "bold"); 
			 
	    }, tooltip, htmlProvider));
	    
		dojo.connect(container, "onmouseout", this, dojo.partial(function(tooltip, container){
			 dojo.setStyle(tooltip, "display", "none"); 
			 dojo.setStyle(container, "fontWeight", "normal");
		}, tooltip, container));
	}
});

/**
 * Same as resources, but no per tick values
 */ 
dojo.declare("com.nuclearunicorn.game.ui.CraftResourceTable", com.nuclearunicorn.game.ui.GenericResourceTable, {
	
	workshop: null,
	
	constructor: function(game){
		this.workshop = game.bld.get("workshop");
	},
	
	
	//TODO: merge with workshop?
	getResourceCraftRatio: function(res){
		return this.game.getResCraftRatio(res);
	},

	/**
	 * 
	 * min amount to craft
	 * %to craft
	 **/
	createCraftButton: function(tr, recipe, craftRatio, res, num, ratio){
		var td = dojo.create("td", { style: {width: "20px"}}, tr);
		var a = dojo.create("a", {
				href: "#",
				innerHTML : "+" + (num * (1+craftRatio)).toFixed(),
				style: {
					display: this.game.resPool.hasRes(recipe.prices, num) ? "" : "none"
				}
			}, td);

		dojo.connect(a, "onclick", this, dojo.partial(function(res, event){
				var allCount = this.game.workshop.getCraftAllCount(res.name);
				if (num < allCount*ratio){
					num = allCount*ratio;
				}
				this.game.craft(res.name, num);
				event.preventDefault();
			}, res));

		this.attachTooltip(td, dojo.partial( function(recipe){
				var tooltip = dojo.create("div", { className: "button_tooltip" }, null);
				var prices = this.game.workshop.getCraftPrice(recipe);
				
				var allCount = this.game.workshop.getCraftAllCount(recipe.name);
				if (num < allCount*ratio){
					num = allCount*ratio;
				}
				
				for (var i = 0; i < prices.length; i++){
					var price = prices[i];

					var priceItemNode = dojo.create("div", null, tooltip);

					var nameSpan = dojo.create("span", {
							innerHTML: price.name,
							style: { float: "left"}
						}, priceItemNode );

					var priceSpan = dojo.create("span", {
							innerHTML: this.game.getDisplayValueExt(price.val * num),
							style: {float: "right", paddingLeft: "6px" }
						}, priceItemNode );
				}
				return tooltip.outerHTML;
			}, recipe));

		return a;
	},

	render: function(){
		if (!this.containerId) { throw "container id is undefined for res table"; }
		dojo.empty(this.containerId);
		
		this.resRows = [];
		
		var resTable = dojo.create("table", { className: "table resTable craftTable", style: { width: "100%"} }, this.containerId);

		for (var i = 0; i < this.game.resPool.resources.length; i++){
			var res = this.game.resPool.resources[i];
			
			if (!res.craftable){
				continue;
			}
			
			var craftRatio = this.getResourceCraftRatio(res);
			
			//sort of hack to override regeneration bug
			var recipe = this.game.workshop.getCraft(res.name);
				
			//self-recovery hack to discard removed resources
			//TODO: remove the reference from the res pool
			if (!recipe){
				res.value = 0;
				continue;
			}

			var tr = dojo.create("tr", { class: "resourceRow" }, resTable);
			
			var isVisible = (recipe.unlocked && res.value > 0 && this.workshop.val > 0);
			dojo.setStyle(tr, "display", isVisible ? "" : "none");
			//	---------------- name ----------------------
			
			var tdResName = dojo.create("td", { 
					innerHTML: res.title || res.name + ":",
					style: {
						width: "75px"
					}
				}, tr);
			if (res.color){
				dojo.setStyle(tdResName, "color", res.color);
			}

			//	---------------- amt ----------------------
			var tdAmt = dojo.create("td", null, tr);
			tdAmt.textContent = this.game.getDisplayValueExt(res.value);
			
			//	---------------- + ----------------------

			var a1 = this.createCraftButton(tr, recipe, craftRatio, res, 1, 0.01);
			var a25 = this.createCraftButton(tr, recipe, craftRatio, res, 25, 0.05);
			var a100 = this.createCraftButton(tr, recipe, craftRatio, res, 100, 0.1);

			//	---------------- +all ----------------------
			var td = dojo.create("td", { }, tr);
			

			var aAll = dojo.create("a", {
				href: "#", 
				innerHTML : "all",
				style: {
					display: this.hasMinAmt(recipe) ? "" : "none"
				} 
			}, td);

			dojo.connect(aAll, "onclick", this, dojo.partial(function(res, event){ 
				this.game.craftAll(res.name);
				event.preventDefault(); 
			}, res));
			
			this.resRows.push({
				resRef: res,
				recipeRef: recipe,
				rowRef: tr,
				resAmt : tdAmt,
				a1 : a1,
				a25: a25,
				a100: a100,
				aAll: aAll
			});
		}
	},
	
	hasMinAmt: function(recipe){
		var minAmt = Number.MAX_VALUE;
		for (var j = 0; j < recipe.prices.length; j++){
			var totalRes = this.game.resPool.get(recipe.prices[j].name).value;
			var allAmt = Math.floor(totalRes / recipe.prices[j].val);
			if (allAmt < minAmt){
				minAmt = allAmt;
			}
		}
		
		return minAmt > 0 && minAmt < Number.MAX_VALUE;
	},
	
	update: function(){
		var reqRes = this.game.getRequiredResources(this.game.selectedBuilding);
		for (var i = 0; i < this.resRows.length; i++){
			var row = this.resRows[i];
			var res = row.resRef;
			
			//---------------------------------------------
			var recipe = this.game.workshop.getCraft(res.name);
			var isVisible = (res.value > 0 && recipe.unlocked && this.workshop.val > 0);
			
			var isHidden = (row.rowRef.style.display === "none");
			if (isHidden && !isVisible){
				continue;
			}else if(isHidden && isVisible){
				row.rowRef.style.display = "";
			}
			
			//  highlight resources for selected building
			//--------------------------------------------
			var className;
			
			if (reqRes.indexOf(res.name) >= 0){
				className = "resourceRow highlited";
			} else {
				className = "resourceRow";
			}
			if (row.rowRef.className != className){
				row.rowRef.className = className;
			}

			//dojo.setStyle(row.rowRef, "display", isVisible ? "" : "none");
			
			row.resAmt.textContent = this.game.getDisplayValueExt(res.value);
			
			//==================== super confusing % craft logic ===================
			var allCount = this.game.workshop.getCraftAllCount(res.name);
			var craftRatio = this.getResourceCraftRatio(res);
			// 1/1%
			var craftRowAmt = 1;
			if (1 < allCount * 0.01 ){
				craftRowAmt = Math.floor(allCount * 0.01);
			} else {
				craftRowAmt = 1;
			}
			dojo.setStyle(row.a1, "display", this.game.resPool.hasRes(row.recipeRef.prices, craftRowAmt) ? "" : "none");
			row.a1.innerHTML = "+" + this.game.getDisplayValueExt(craftRowAmt * (1+craftRatio), null, null, 0);
			
			// 25/5%
			if (25 < allCount * 0.05 ){
				craftRowAmt = Math.floor(allCount * 0.05);
			}else {
				craftRowAmt = 25;
			}
			dojo.setStyle(row.a25, "display", this.game.resPool.hasRes(row.recipeRef.prices, craftRowAmt) ? "" : "none");
			row.a25.innerHTML = "+" + this.game.getDisplayValueExt(craftRowAmt * (1+craftRatio), null, null, 0);
			
			// 100/10%
			if (100 < allCount * 0.1 ){
				craftRowAmt = Math.floor(allCount * 0.1);
			} else {
				craftRowAmt = 100;
			}
			dojo.setStyle(row.a100, "display", this.game.resPool.hasRes(row.recipeRef.prices, craftRowAmt) ? "" : "none");
			row.a100.innerHTML = "+" + this.game.getDisplayValueExt(craftRowAmt * (1+craftRatio), null, null, 0);
			//=======================================================================
			dojo.setStyle(row.aAll, "display", this.hasMinAmt(row.recipeRef) ? "" : "none");
		}
	}
});


