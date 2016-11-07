
dojo.declare("classes.managers.ResourceManager", com.nuclearunicorn.core.TabManager, {

	//=========================================
	//				COMMON
	//=========================================

	/**
	 * visible: resource will be visible in the topmost ("resource") table
	 * craftable: resource will be visible in the bottom ("craft") table
	 *
	 * Those flags are not mutually exclusive
	 *
	 *  transient: will not be affected by magneto production bonus (and other bonuses)
	 *  type: common/uncommon/rare/exotic
	 */
	resourceData: [
	{
		name : "catnip",
		type : "common",
		visible: true,
		calculatePerTick: true
	},{
		name : "wood",
		type : "common",
		craftable: true,
		visible: true,
		calculatePerTick: true
	},{
		name : "minerals",
		type : "common",
		visible: true,
		calculatePerTick: true
	},{
		name : "coal",
		type : "common",
		visible: true,
		calculatePerTick: true
	},{
		name : "iron",
		type : "common",
		visible: true,
		calculatePerTick: true
	},{
		name : "titanium",
		type : "common",
		visible: true,
		calculatePerTick: true
	},{
		name : "gold",
		type : "common",
		visible: true,
		calculatePerTick: true
	},{
		name : "oil",
		type : "common",
		visible: true,
		calculatePerTick: true
	},{
		name : "uranium",
		type : "common",
		visible: true,
		color: "#4EA24E",
		calculatePerTick: true
	},{
		name : "unobtainium",
		type : "common",
		visible: true,
		display: true,
		color: "#A00000",
		calculatePerTick: true
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
		color: "#DBA901",
		calculatePerTick: true
	},{
		name : "science",
		type : "common",
		visible: true,
		transient: true,
		color: "#01A9DB",
		calculatePerTick: true
	},{
		name : "culture",
		type : "common",
		visible: true,
		transient: true,
		color: "#DF01D7",
		calculatePerTick: true
	},{
		name : "faith",
		type : "common",
		visible: true,
		transient: true,
		color: "gray",
		calculatePerTick: true
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
		color: "#9A2EFE",
		calculatePerTick: true
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
		visible: true,
		calculatePerTick: true
	},{
		name : "ivory",
		type : "uncommon",
		transient: true,
		visible: true,
		calculatePerTick: true
	},{
		name : "spice",
		type : "uncommon",
		transient: true,
		visible: true,
		calculatePerTick: true
	},{
		name : "unicorns",
		type : "rare",
		transient: true,
		visible: true,
		calculatePerTick: true
	},{
		name : "alicorn",
		title: "alicorns",
		type : "rare",
		visible: true,
		calculatePerTick: true
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
		color: "#6141CD",
		persists: true
	},{
		name : "burnedParagon",
		title : "burned paragon",
		type : "common",
		visible: true,
		color: "#493099",
		persists: true
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
		color: "black",
		persists: true //isn't wiped on game reset
	},{
		name : "relic",
		title: "relic",
		type : "exotic",
		craftable: false,
		visible: true,
		color: "#5A0EDE",
		style: {
			"textShadow": "1px 0px 10px #9A2EFE",
			"animation": "neon1 1.5s ease-in-out infinite alternate"
		}
	},{
		name : "void",
		title: "void",
		type : "exotic",
		craftable: false,
		visible: true,
		color: "#5A0EDE",
		style: {
			"textShadow": "1px 0px 10px #9A2EFE",
			"animation": "neon1 1.5s ease-in-out infinite alternate"
		}
	},{
		name : "elderBox",
		title: "present box",
		description: "Merry Eldermass!",
		type : "exotic",
		craftable: false,
		visible: true,
		color: "#FA0EDE",
		style: {
			"textShadow": "1px 0px 10px #FA2E9E",
			"animation": "neon1 1.5s ease-in-out infinite alternate"
		},
		persists: true
	},{
		name : "wrappingPaper",
		title: "wrapping paper",
		type : "exotic",
		craftable: false,
		visible: true,
		color: "#FA0EDE",
		style: {
			"textShadow": "1px 0px 10px #FA2E9E",
			"animation": "neon1 1.5s ease-in-out infinite alternate"
		},
		persists: true
	},{
		name : "temporalFlux",
		title: "temporal flux",
		description: "",
		type : "common",
		craftable: false,
		visible: false,
		persists: true
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
		color: "gray",
		calculatePerTick: true
	},{
		name : "gear",
		type : "common",
		craftable: true,
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
        name: "kerosene",
        type: "common",
        craftable: true,
        color: "darkYellow"
	},{
		name : "parchment",
		type : "common",
		craftable: true,
		color: "#DF01D7"
	},{
		name : "manuscript",
		type : "common",
		craftable: true,
		color: "#01A9DB",
		calculatePerTick: true
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
		name : "thorium", //divinite
		type : "common",
		visible: true,
		craftable: true,
		color: "#4EA24E",
		calculatePerTick: true
	},{
		name : "megalith",
		type : "common",
		craftable: true,
		color: "gray"
    }
    ],

	resources: null,
	village: null,
	game: null,

	energyProd: 0,
	energyCons: 0,

	isLocked: false,

	constructor: function(game){
		this.game = game;

		this.resources = [];

		for (var i = 0; i< this.resourceData.length; i++){
			var res = dojo.clone(this.resourceData[i]);
			res.value = 0;
			res.unlocked = false;
			if (res.name == "oil" ||
				res.name == "kerosene" ||
				res.name == "thorium") {
				res.refundable = false;
			} else {
				res.refundable = true;
			}
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

		//if no resource found, return false
		return false;
	},

	createResource: function(name){
		var res = {
			name: name,
			value: 0,

			//whether resource was marked by user as hidden or visible
			isHidden: false,

			unlocked: false
		};
		return res;
	},

	addRes: function(res, addedValue, event) {
		if (this.game.calendar.day < 0 && !event || addedValue == 0) {
			return 0;
		}

		var prevValue = res.value || 0;

		if(res.maxValue) {
			//if already overcap, allow to remain that way unless removing resources.
			if(res.value > res.maxValue) {
				if(addedValue < 0 ) {
					res.value += addedValue;
				}
			} else {
				res.value += addedValue;
				if(res.value > res.maxValue) {
					res.value = res.maxValue;
				}
			}
		} else {
			res.value += addedValue;
		}

		if (res.name == "void") { // Always an integer
			res.value = Math.floor(res.value);
		}

		if (isNaN(res.value) || res.value < 0){
			res.value = 0;	//safe switch
		}

		if (res.name == "karma"){
			this.game.karmaKittens = Math.round(this.game.getTriValueOrigin(res.value, 5));
			res.value = this.game.getTriValue(this.game.karmaKittens, 5);
		}

		return res.value - prevValue;
	},

	addResPerTick: function(name, value){
		return this.addRes(this.get(name), value, false);
	},

	addResEvent: function(name, value){
		return this.addRes(this.get(name), value, true);
	},

	/**
	 * Format of from:
	 * [ {res: "res1", amt: x1}, {res: "res2", amt: x2} ]
	 * amt in the from array sets ratios between resources
	 * The second amt parameter is the maximum number of times to convert
	 */
	getAmtDependsOnStock: function(from, amt){
		if (amt == 0) {
			return 0;
		}

		var amtBeginni = amt;

		// Cap amt based on available resources
		// amt can decrease for each resource
		for (var i = 0, length = from.length; i < length; i++){
			var resAvailable = this.get(from[i].res).value;
			var resNeeded = from[i].amt * amt;
			if (resAvailable < resNeeded){
				var amtAvailable = resAvailable / from[i].amt;
				amt = Math.min(amt, amtAvailable);
			}
			else {
				// amtAvailable is amt
			}
		}

		// Remove from resources
		for (var i in from) {
			this.addResPerTick(from[i].res, -from[i].amt * amt);
		}

		// Return the percentage to decrease the productivity
		return amt / amtBeginni;
	},

	/**
	 * Iterates resources and updates their values with per tick increment
	 */
	update: function(){

		var game = this.game;

		for (var i in this.resources){
			var res = this.resources[i];
			if (res.name == "sorrow"){
				res.maxValue = 12 + (game.getEffect("blsLimit") || 0);
				res.value = res.value > res.maxValue ? res.maxValue : res.value;
				continue;
			}

			if (res.unlocked == false && res.value > 0){
				res.unlocked = true;
			} else if (res.value == 0 && res.unlocked == true) {
				if (res.name == "zebras" ||
					res.name == "paragon" ||
					res.name == "elderBox"){
					res.unlocked = false;
				}
			}

			var maxValue = game.getEffect(res.name + "Max") || 0;

			maxValue = this.addResMaxRatios(res, maxValue);

			if (maxValue < 0 ){
				maxValue = 0;
			}

			res.maxValue = maxValue;

			var resPerTick = game.getResourcePerTick(res.name, false);
			this.addResPerTick(res.name, resPerTick);

		}
		game.updateKarma();

		//--------
		this.energyProd = game.getEffect("energyProduction");
		this.energyCons = game.getEffect("energyConsumption");

	},

	// Hack to reach the maxValue in resTable
	resConsHackForResTable: function() {
		if( this.game.calendar.day >= 0) {
			for (var i in this.resources){
				var res = this.resources[i];
				if (res.maxValue) {
					var perTickConvertion = this.game.getResourcePerTickConvertion(res.name);
					if (perTickConvertion < 0) {
						if (this.game.getResourcePerTick(res.name, true) > 0 && res.maxValue + perTickConvertion <= res.value) {
							res.value += -perTickConvertion;
						}
					}
				}
			}
		}
	},

	/**
	 * Multiplies applicable resMax effects by barnRatio and warehouseRatio
	 * (is there a better name for it?)
	 */
	addBarnWarehouseRatio: function(effects){
		var newEffects = {};
		var barnRatio = this.game.getEffect("barnRatio");
		var warehouseRatio = 1 + this.game.getEffect("warehouseRatio");
		for (var name in effects){
			var effect = effects[name];

			if (name === "catnipMax" && this.game.workshop.get("silos").researched){
				effect *= 1 + barnRatio * 0.25;
			}

			if (name == "woodMax" || name == "mineralsMax" || name == "ironMax"){	//that starts to look awful
				effect *= 1 + barnRatio;
				effect *= warehouseRatio;
			}

			if (name == "coalMax" || name == "goldMax" || name == "titaniumMax"){
				effect *= warehouseRatio;
			}
			newEffects[name] = effect;
		}
		return newEffects;
	},

	/**
	 * Multiplies maxValue by global ratios
	 * Called in tooltips for more accurate per-building resMax increases
	 */
	addResMaxRatios: function(res, maxValue){
		if (res && res.name == "temporalFlux") {
			return maxValue;
		}

		maxValue += maxValue * this.game.prestige.getParagonStorageRatio();

		//+COSMIC RADIATION
		if (!this.game.opts.disableCMBR) {
			maxValue *= (1 + this.game.getCMBRBonus());
		}

		if (res){
			//Stuff for Refrigiration and (potentially) similar effects
			maxValue *= ( 1 + this.game.getEffect(res.name + "MaxRatio") );

			if (!this.isNormalCraftableResource(res) && !res.transient){
				maxValue *= (1 + this.game.getEffect("tcResourceRatio"));
			}
		}

		return maxValue;
	},

	setVillage: function(village){
		this.village = village;
	},

	reset: function(){
		this.resources = [];
	},

	resetState: function(){
		this.isLocked = false;
		for (var i = 0; i < this.resources.length; i++){
			var res = this.resources[i];
			res.value = 0;
			res.maxValue = 0;
			res.perTickCached = 0;
			res.unlocked = false;
			res.isHidden = false;
		}
	},

	save: function(saveData){
		saveData.res = {
			isLocked: this.isLocked
		};
	},

	load: function(saveData){
		this.loadMetadata(this.resources, saveData.resources);

		if (saveData.res){
			this.isLocked = Boolean(saveData.res.isLocked);
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

	/**
	 * Returns true if any price is limited by maxValue
	 */
	isStorageLimited: function(prices){
		if (prices && prices.length){
			for (var i = 0; i < prices.length; i++){
				var price = prices[i];

				var res = this.get(price.name);
				if (res.maxValue > 0 && price.val > res.maxValue && price.val > res.value){
					return true;
				}
				if (res.craftable && price.val > res.value){ //account for chronosphere resets etc
					var craft = this.game.workshop.getCraft(res.name);
					if (craft.unlocked && craft.isLimited){
						return true;
					}
				}
			}
		}
		return false;
	},

	payPrices: function(prices){
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				this.addResEvent(price.name, -price.val);
			}
		}
	},

	maxAll: function(){
		for(var i = 0; i< this.resources.length; i++){
			var res = this.resources[i];
			if (res.maxValue && res.value < res.maxValue){
				res.value = res.maxValue;
			}
		}
	},

    getEnergyDelta: function(){
		if (this.energyCons == 0) {
			return 0;
		} else {
			var delta = this.energyProd / this.energyCons;
			if (delta < 0.25){
				delta = 0.25;
			}
			if (this.game.challenges.getChallenge("energy").researched == true) {
				delta = 1 - (1 - delta) / 2;
			}
		return delta;
		}
    },

    getVoidQuantity: function() {
		// -1, 0, 1, 2 at start, 0.5 on average
		var maxPerDay = 2 + this.game.getEffect("temporalParadoxVoid");
		var i = this.game.rand(maxPerDay + 2) - 1;

		// Only integer
		return i;
    },

	setDisplayAll: function() {
		for(var i = 0; i< this.resources.length; i++){
			this.resources[i].isHidden = false;
		}
	},

	toggleLock: function(){
		this.isLocked = !this.isLocked;
	},

	isNormalCraftableResource: function(res) {
		return res.craftable && res.name != "wood";
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
			if (this.game.resPool.isNormalCraftableResource(res) && this.game.workshop.getCraft(res.name).unlocked){
				continue;
			}

			var tr = dojo.create("tr", { class: "resourceRow" }, resTable);


			var isVisible = (res.unlocked || (res.name == "kittens" && res.maxValue));
			dojo.setStyle(tr, "display", isVisible ? "" : "none");
			//	---------------- name ----------------------

			var tdResName = dojo.create("td", {
				class: "resource-name",
				innerHTML: ( res.title || res.name )  + ":", style: { width: "60px"}
			}, tr);

			dojo.connect(tdResName, "onclick", this, dojo.partial(function(res){
				res.isHidden = !res.isHidden;
			}, res));
			dojo.connect(tdResName, "onmouseover", this, function(){
				if (this.game.resPool.isLocked){
					return;
				}
				this.game.ui.isDisplayOver = true;
			});
			dojo.connect(tdResName, "onmouseout", this, function(){
				if (this.game.resPool.isLocked){
					return;
				}
				this.game.ui.isDisplayOver = false;
			});

			UIUtils.attachTooltip(this.game, tdResName, 0, 320, dojo.hitch(this, function(res){
				return res.description || "";
			}, res));

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
			if (res.style){
				for (var styleKey in res.style){
					dojo.setStyle(tdResName, styleKey, res.style[styleKey]);
				}
			}

			//	---------------- amt ----------------------
			var tdAmt = dojo.create("td", {className: "resAmount"}, tr);
			tdAmt.textContent = this.game.getDisplayValueExt(res.value);

			//	---------------- max ----------------------
			var tdMax = dojo.create("td", { className: "maxRes" }, tr);
			tdMax.textContent = this.game.getDisplayValueExt(res.maxValueUI);

			//	---------------- +tick ----------------------
			var tdPerTick = dojo.create("td", {className: "resPerTick"}, tr);

			this.game.attachResourceTooltip(tdPerTick, res);

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

		this.update();
	},

	/**
	 * This section is performance-critical. Using non vanilla js here is a very *BAD* idea.
	 */
	update: function(){
		var reqRes = this.game.getRequiredResources(this.game.selectedBuilding);
		for (var i = 0; i < this.resRows.length; i++){
			var row = this.resRows[i];
			var res = row.resRef;

			// Game display
			var isVisible = (res.unlocked || (res.name == "kittens" && res.maxValue));
			var isHidden = (row.rowRef.style.display === "none");
			if (isHidden && !isVisible){
				continue;
			}else if(isHidden && isVisible){
				row.rowRef.style.display = "";
			}
			// Gamer display
			if (!res.isHidden) {
				row.rowRef.style.display = "";
				row.rowRef.style.opacity = 1;
			} else {
				row.rowRef.style.display = "none";
				row.rowRef.style.opacity = 0.3;
			}
			if (this.game.ui.isDisplayOver) {
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

			className = "resAmount";
			if (res.value > res.maxValue * 0.95 && res.maxValue > 0){
				className = "resAmount resLimitNotice";
			} else if (res.value > res.maxValue * 0.75 && res.maxValue > 0){
				className = "resAmount resLimitWarn";
			}
			if (row.resAmt.className != className){
				row.resAmt.className = className;
			}


			var maxResValue = res.maxValue ? "/" + this.game.getDisplayValueExt(res.maxValue) : "";
			row.resMax.textContent  = maxResValue;

			var perTick = this.game.calendar.day < 0 ? 0 : this.game.getResourcePerTick(res.name, true);
			perTick = this.game.opts.usePerSecondValues ? perTick * this.game.getRateUI() : perTick;
			var postfix = this.game.opts.usePerSecondValues ? "/sec" : "";
			if (this.game.opts.usePercentageResourceValues && res.maxValue){
				perTick = (perTick / res.maxValue * 100).toFixed(2);
				postfix = "%" + postfix;
			}

			var perTickValue = this.game.getResourcePerTick(res.name, false) || this.game.getResourcePerTickConvertion(res.name) ? "(" + this.game.getDisplayValueExt(perTick, true, false) + postfix + ")" : "";
			row.resTick.textContent = perTickValue;

			row.resTick.style.cursor = perTick ? "pointer" : "default";

			//weather mod
			var season = this.game.calendar.getCurSeason();
			if (season.modifiers[res.name] && perTick != 0 ){

				var modifier = (season.modifiers[res.name] + this.game.calendar.getWeatherMod() - 1)*100;
				row.resWMod.textContent = modifier ? "[" + (modifier > 0 ? "+" : "") + modifier.toFixed() + "%]" : "";

				if (modifier > 0){
					dojo.setStyle(row.resWMod, "color", "green");
				}else if (modifier < 0){
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
					var res = this.game.resPool.get(price.name);

					var nameSpan = dojo.create("span", {
							innerHTML: res.title || res.name,
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

			var isVisible = (recipe.unlocked && res.value > 0 && this.workshop.on > 0);
			dojo.setStyle(tr, "display", isVisible ? "" : "none");
			//	---------------- name ----------------------

			var tdResName = dojo.create("td", {
					innerHTML: (res.title || res.name) + ":",
					style: {
						width: "75px"
					}
				}, tr);
			if (res.color){
				dojo.setStyle(tdResName, "color", res.color);
			}

			dojo.connect(tdResName, "onclick", this, dojo.partial(function(res){
				res.isHidden = !res.isHidden;
			}, res));
			dojo.connect(tdResName, "onmouseover", this, function(){
				if (this.game.resPool.isLocked){
					return;
				}
				this.game.ui.isDisplayOver = true;
			});
			dojo.connect(tdResName, "onmouseout", this, function(){
				if (this.game.resPool.isLocked){
					return;
				}
				this.game.ui.isDisplayOver = false;
			});

			//	---------------- amt ----------------------
			var tdAmt = dojo.create("td", null, tr);
			tdAmt.textContent = this.game.getDisplayValueExt(res.value);

			this.game.attachResourceTooltip(tdAmt, res);

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

		this.update();
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
			// Game display
			var isVisible = (res.unlocked && recipe.unlocked && this.workshop.on > 0);
			var isHidden = (row.rowRef.style.display === "none");
			if (isHidden && !isVisible){
				continue;
			} else if(isHidden && isVisible){
				row.rowRef.style.display = "";
			}
			// Gamer display
			if (!res.isHidden) {
				row.rowRef.style.display = "";
				row.rowRef.style.opacity = 1;
			} else {
				row.rowRef.style.display = "none";
				row.rowRef.style.opacity = 0.3;
			}
			if (this.game.ui.isDisplayOver) {
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

			row.resAmt.textContent = this.game.getDisplayValueExt(res.value);

			//==================== super confusing % craft logic ===================
			var allCount = this.game.workshop.getCraftAllCount(res.name);
			var craftRatio = this.getResourceCraftRatio(res);
			var craftPrices = (res.name == "ship") ? this.game.workshop.getCraftPrice(recipe) : row.recipeRef.prices;
			// 1/1%
			var craftRowAmt = 1;
			if (1 < allCount * 0.01 ){
				craftRowAmt = Math.floor(allCount * 0.01);
			} else {
				craftRowAmt = 1;
			}
			dojo.setStyle(row.a1, "display", this.game.resPool.hasRes(craftPrices, craftRowAmt) ? "" : "none");
			row.a1.innerHTML = "+" + this.game.getDisplayValueExt(craftRowAmt * (1 + craftRatio), null, null, 0);

			// 25/5%
			if (25 < allCount * 0.05 ){
				craftRowAmt = Math.floor(allCount * 0.05);
			}else {
				craftRowAmt = 25;
			}
			dojo.setStyle(row.a25, "display", this.game.resPool.hasRes(craftPrices, craftRowAmt) ? "" : "none");
			row.a25.innerHTML = "+" + this.game.getDisplayValueExt(craftRowAmt * (1 + craftRatio), null, null, 0);

			// 100/10%
			if (100 < allCount * 0.1 ){
				craftRowAmt = Math.floor(allCount * 0.1);
			} else {
				craftRowAmt = 100;
			}
			dojo.setStyle(row.a100, "display", this.game.resPool.hasRes(craftPrices, craftRowAmt) ? "" : "none");
			row.a100.innerHTML = "+" + this.game.getDisplayValueExt(craftRowAmt * (1 + craftRatio), null, null, 0);
			//=======================================================================
			dojo.setStyle(row.aAll, "display", this.hasMinAmt(row.recipeRef) ? "" : "none");
		}
	}
});


