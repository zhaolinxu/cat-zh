// ==UserScript==
// @name        Kitten Scientists
// @namespace   http://www.reddit.com/r/kittensgame/comments/34gb2u/kitten_scientists_automation_script/
// @description Launch Kitten Scientists
// @include     *bloodrizer.ru/games/kittens/*
// @include     file:///*kitten-game*
// @include     *kittensgame.com/web/*
// @version     1.4.2
// @grant       none
// @copyright   2015, cameroncondry
// ==/UserScript==

// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var version = '小猫珂学家 版本 1.4.2';
var address = '1MC7Vj5ovpq3mzn9JhyhYMPEBRFoRZgDwa';

// Game will be referenced in loadTest function
var game = null;

var run = function() {

    var options = {
        // When debug is enabled, messages that go to the game log are also logged using window.console.
        debug: false,

        // The interval at which the internal processing loop is run, in milliseconds.
        interval: 2000,

        // The default color for KS messages in the game log (like enabling and disabling items).
        msgcolor: '#aa50fe', // dark purple
        // The color for activity summaries.
        summarycolor: '#009933', // light green
        // The color for log messages that are about activities (like festivals and star observations).
        activitycolor: '#E65C00', // orange
        // The color for resources with stock counts higher than current resource max
        stockwarncolor: '#DD1E00',

        // The default consume rate.
        consume: 0.6,

        // The default settings for game automation.
        auto: {
            // Settings related to KS itself.
            engine: {
                // Should any automation run at all?
                enabled: false
            },
            autotime: {
                enabled: false,
                trigger: 995,
                items: {
                    x250:        {enabled: false},
                    x50:        {enabled: false},
                    x5:        {enabled: false},
                    x2:        {enabled: false}
                }
            },
            faith: {
                // Should religion building be automated?
                enabled: true,
                // At what percentage of the storage capacity should KS build faith buildings?
                trigger: 0,
                // Which religious upgrades should be researched?
                items: {
                    // Variant denotes which category the building or upgrade falls within in the Religion tab.
                    // Ziggurats are variant z.
                    unicornTomb:        {require: false,         limited: 9999, enabled: false, variant: 'z'},
                    ivoryTower:         {require: false,         limited: 9999, enabled: false, variant: 'z'},
                    ivoryCitadel:       {require: false,         limited: 9999, enabled: false, variant: 'z'},
                    skyPalace:          {require: false,         limited: 9999, enabled: false, variant: 'z'},
                    unicornUtopia:      {require: 'gold',        limited: 9999, enabled: false, variant: 'z'},
                    sunspire:           {require: 'gold',        limited: 9999, enabled: false, variant: 'z'},
                    marker:             {require: 'unobtainium', limited: 9999, enabled: false, variant: 'z'},
                    unicornGraveyard:   {require: false,         limited: 9999, enabled: false, variant: 'z'},
                    unicornNecropolis:  {require: false,         limited: 9999, enabled: false, variant: 'z'},
                    blackPyramid:       {require: 'unobtainium', limited: 9999, enabled: false, variant: 'z'},
                    // Order of the Sun is variant s.
                    solarchant:         {require: 'faith',       limited: 9999, enabled: true,  variant: 's'},
                    scholasticism:      {require: 'faith',       limited: 9999, enabled: true,  variant: 's'},
                    goldenSpire:        {require: 'faith',       limited: 9999, enabled: true,  variant: 's'},
                    sunAltar:           {require: 'faith',       limited: 9999, enabled: true,  variant: 's'},
                    stainedGlass:       {require: 'faith',       limited: 9999, enabled: true,  variant: 's'},
                    solarRevolution:    {require: 'faith',       limited: 9999, enabled: true,  variant: 's'},
                    basilica:           {require: 'faith',       limited: 9999, enabled: true,  variant: 's'},
                    templars:           {require: 'faith',       limited: 9999, enabled: true,  variant: 's'},
                    apocripha:          {require: 'faith',       limited: 9999, enabled: false, variant: 's'},
                    transcendence:      {require: 'faith',       limited: 9999, enabled: true,  variant: 's'},
                    // Cryptotheology is variant c.
                    blackObelisk:       {require: false,         limited: 9999, enabled: false, variant: 'c'},
                    blackNexus:         {require: false,         limited: 9999, enabled: false, variant: 'c'},
                    blackCore:          {require: false,         limited: 9999, enabled: false, variant: 'c'},
                    singularity:        {require: false,         limited: 9999, enabled: false, variant: 'c'},
                    blackLibrary:       {require: false,         limited: 9999, enabled: false, variant: 'c'},
                    blackRadiance:      {require: false,         limited: 9999, enabled: false, variant: 'c'},
                    blazar:             {require: false,         limited: 9999, enabled: false, variant: 'c'},
                    darkNova:           {require: false,         limited: 9999, enabled: false, variant: 'c'},
                    holyGenocide:       {require: false,         limited: 9999, enabled: false, variant: 'c'},
                }
            },
            build: {
                // Should buildings be built automatically?
                enabled: true,
                // When a building requires a certain resource (this is what their *require* property refers to), then
                // this is the percentage of the storage capacity of that resource, that has to be met for the building
                // to be built.
                trigger: 0.75,
                // The items that be automatically built.
                // Every item can define a required resource. This resource has to be available at a certain capacity for
                // the building to be built. The capacity requirement is defined by the trigger value set for the section.
                //
                // Additionally, for upgradeable buildings, the item can define which upgrade stage it refers to.
                // For upgraded buildings, the ID (or internal name) of the building can be controlled through the *name*
                // property. For other buildings, the key of the item itself is used.
                items: {
                    // housing
                    hut:            {require: 'wood',        limited: 9999, enabled: false},
                    logHouse:       {require: 'minerals',    limited: 9999, enabled: false},
                    mansion:        {require: 'titanium',    limited: 9999, enabled: false},

                    // craft bonuses
                    workshop:       {require: 'minerals',    limited: 9999, enabled: true},
                    factory:        {require: 'titanium',    limited: 9999, enabled: true},

                    // production
                    field:          {require: 'catnip',      limited: 9999, enabled: true},
                    pasture:        {require: 'catnip',      limited: 9999, enabled: true, stage: 0},
                    solarFarm:      {require: 'titanium',    limited: 9999, enabled: true, stage: 1, name: 'pasture'},
                    mine:           {require: 'wood',        limited: 9999, enabled: true},
                    lumberMill:     {require: 'minerals',    limited: 9999, enabled: true},
                    aqueduct:       {require: 'minerals',    limited: 9999, enabled: true, stage: 0},
                    hydroPlant:     {require: 'titanium',    limited: 9999, enabled: true, stage: 1, name: 'aqueduct'},
                    oilWell:        {require: 'coal',        limited: 9999, enabled: true},
                    quarry:         {require: 'coal',        limited: 9999, enabled: true},

                    // conversion
                    smelter:        {require: 'minerals',    limited: 9999, enabled: true},
                    biolab:         {require: 'science',     limited: 9999, enabled: false},
                    calciner:       {require: 'titanium',    limited: 9999, enabled: false},
                    reactor:        {require: 'titanium',    limited: 9999, enabled: false},
                    accelerator:    {require: 'titanium',    limited: 9999, enabled: false},
                    steamworks:     {require: false,         limited: 9999, enabled: false},
                    magneto:        {require: false,         limited: 9999, enabled: false},

                    // science
                    library:        {require: 'wood',        limited: 9999, enabled: true, stage: 0},
                    dataCenter:     {require: false,         limited: 9999, enabled: true, stage: 1, name: 'library'},
                    academy:        {require: 'wood',        limited: 9999, enabled: true},
                    observatory:    {require: 'iron',        limited: 9999, enabled: true},

                    // other
                    amphitheatre:   {require: 'minerals',    limited: 9999, enabled: true, stage: 0},
                    broadcastTower: {require: 'titanium',    limited: 9999, enabled: true, stage: 1, name: 'amphitheatre'},
                    tradepost:      {require: 'gold',        limited: 9999, enabled: true},
                    chapel:         {require: 'minerals',    limited: 9999, enabled: true},
                    temple:         {require: 'gold',        limited: 9999, enabled: true},
                    mint:           {require: false,         limited: 9999, enabled: false},
                    unicornPasture: {require: false,         limited: 9999, enabled: true},
                    ziggurat:       {require: false,         limited: 9999, enabled: false},
                    chronosphere:   {require: 'unobtainium', limited: 9999, enabled: false},
                    aiCore:         {require: false,         limited: 9999, enabled: false},

                    // storage
                    barn:           {require: 'wood',        limited: 9999, enabled: true},
                    harbor:         {require: false,         limited: 9999, enabled: false},
                    warehouse:      {require: false,         limited: 9999, enabled: false}
                }
            },
            space: {
                // Should space buildings be built automatically?
                enabled: false,
                // The functionality of the space section is identical to the build section. It just needs to be treated
                // seperately, because the game internals are slightly different.
                trigger: 0,
                items: {
                    // Cath
                    spaceElevator:  {require: 'unobtainium', limited: 9999, enabled: false},
                    sattelite:      {require: 'titanium',    limited: 9999, enabled: false},
                    spaceStation:   {require: 'oil',         limited: 9999, enabled: false},

                    // Moon
                    moonOutpost:    {require: 'uranium',     limited: 9999, enabled: false},
                    moonBase:       {require: 'unobtainium', limited: 9999, enabled: false},

                    // Dune
                    planetCracker:  {require: 'science',     limited: 9999, enabled: false},
                    hydrofracturer: {require: 'science',     limited: 9999, enabled: false},
                    spiceRefinery:  {require: 'science',     limited: 9999, enabled: false},

                    // Piscine
                    researchVessel: {require: 'titanium',    limited: 9999, enabled: false},
                    orbitalArray:   {require: 'eludium',     limited: 9999, enabled: false},

                    // Helios
                    sunlifter:          {require: 'eludium', limited: 9999, enabled: false},
                    containmentChamber: {require: 'science', limited: 9999, enabled: false},
                    heatsink:           {require: 'thorium', limited: 9999, enabled: false},
                    sunforge:           {require: false,     limited: 9999, enabled: false},

                    // T-Minus
                    cryostation:    {require: 'eludium',     limited: 9999, enabled: false},

                    // Kairo
                    spaceBeacon:    {require: 'antimatter',  limited: 9999, enabled: false},

                    // Yarn
                    terraformingStation: {require: 'antimatter',  limited: 9999, enabled: false},
                    hydroponics:         {require: 'kerosene',    limited: 9999, enabled: false},

                    // Umbra
                    hrHarvester:    {require: 'antimatter',  limited: 9999, enabled: false},

                    // Charon
                    entangler:    {require: 'antimatter',  limited: 9999, enabled: false},

                    // Centaurus
                    tectonic:   {require: 'antimatter', limited: 9999, enabled: false},
                    moltenCore: {require: 'uranium',    limited: 9999, enabled: false}
                }
            },
            time: {
                // Should time upgrades be built automatically?
                enabled: false,
                trigger: 0,
                items: {
                    // Variants denote whether these buildings fall within the Chronoforge or Void categories.
                    // Chronoforge has variant chrono.
                    temporalBattery:     {require: false,          limited: 9999, enabled: false, variant: 'chrono'},
                    blastFurnace:        {require: false,          limited: 9999, enabled: false, variant: 'chrono'},
                    timeBoiler:          {require: false,          limited: 9999, enabled: false, variant: 'chrono'},
                    temporalAccelerator: {require: false,          limited: 9999, enabled: false, variant: 'chrono'},
                    temporalImpedance:   {require: false,          limited: 9999, enabled: false, variant: 'chrono'},
                    ressourceRetrieval:  {require: false,          limited: 9999, enabled: false, variant: 'chrono'},
                    
                    // Void Space has variant void.
                    cryochambers:        {require: false,          limited: 9999, enabled: false, variant: 'void'},
                    voidHoover:          {require: 'antimatter',   limited: 9999, enabled: false, variant: 'void'},
                    voidRift:            {require: false,          limited: 9999, enabled: false, variant: 'void'},
                    chronocontrol:       {require: 'temporalFlux', limited: 9999, enabled: false, variant: 'void'},
                    voidResonator:       {require: false,          limited: 9999, enabled: false, variant: 'void'}
                }
            },
            craft: {
                // Should resources be crafted automatically?
                enabled: true,
                // Every item can define a required resource with the *require* property.
                // At what percentage of the storage capacity of that required resource should the listed resource be crafted?
                trigger: 0.95,
                // The items that can be crafted.
                // In addition to the *require* property, which is explained above, items can also define a *max*. If they
                // do, no more than that resource will be automatically produced. This feature can not be controlled through
                // the UI and is not used for any resource by default.
                // The *limited* property tells KS to craft resources whenever the ratio of the component cost of the stored resources
                // to the number of stored components is greater than the limit ratio "limRat".
                // This means that if limRat is 0.5, then if you have 1000 beams and 500 beams worth of scaffolds, 250 of the beams
                // will be crafted into scaffolds. If instead limRat is 0.75, 625 of the beams will be crafted into scaffolds for a final result
                // of 1125 beams-worth of scaffolds and 375 remaining beams.
                // Currently, limRat is not modifiable through the UI, though if there is demand, perhaps this will be added in the future.
                // Limited has a few other effects like balancing plates and steel while minimizing iron waste
                
                // TLDR: The purpose of the limited property is to proportionally distribute raw materials
                // across all crafted resources without wasting raw materials.
                
                items: {
                    wood:       {require: 'catnip',      max: 0, limited: false, limRat: 0.5, enabled: true},
                    beam:       {require: 'wood',        max: 0, limited: false, limRat: 0.5, enabled: true},
                    slab:       {require: 'minerals',    max: 0, limited: false, limRat: 0.5, enabled: true},
                    steel:      {require: 'coal',        max: 0, limited: false, limRat: 0.5, enabled: true},
                    plate:      {require: 'iron',        max: 0, limited: false, limRat: 0.5, enabled: true},
                    alloy:      {require: 'titanium',    max: 0, limited: true,  limRat: 0.5, enabled: true},
                    concrete:   {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: true},
                    gear:       {require: false,         max: 0, limited: true,  limRat: 0.25, enabled: true},
                    scaffold:   {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: true},
                    ship:       {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: false},
                    tanker:     {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: false},
                    parchment:  {require: false,         max: 0, limited: false, limRat: 0.5, enabled: true},
                    manuscript: {require: 'culture',     max: 0, limited: false,  limRat: 0.5, enabled: true},
                    compendium: {require: 'science',     max: 0, limited: false,  limRat: 0.5, enabled: true},
                    blueprint:  {require: 'science',     max: 0, limited: false,  limRat: 0.5, enabled: false},
                    kerosene:   {require: 'oil',         max: 0, limited: false, limRat: 0.5, enabled: true},
                    megalith:   {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: false},
                    eludium:    {require: 'unobtainium', max: 0, limited: false, limRat: 0.5, enabled: true},
                    thorium:    {require: 'uranium',     max: 0, limited: false, limRat: 0.5, enabled: true}
                }
            },
            trade: {
                // Should KS automatically trade?
                enabled: false,
                // Every trade can define a required resource with the *require* property.
                // At what percentage of the storage capacity of that required resource should the trade happen?
                trigger: 0.98,
                // Trades can be limited to only happen during specific seasons. This is because trades with certain races
                // are more effective during specific seasons.
                // The *allowcapped* property allows us to trade even if the sold resources are at their cap.
                items: {
                    dragons:    {enabled: false,  require: 'titanium',    allowcapped: false,    limited: false,
                        summer:  true,  autumn:  true,  winter:  true,          spring:      true},

                    zebras:     {enabled: true,  require: false,         allowcapped: false,    limited: true,
                        summer:  true,  autumn:  true,  winter:  true,          spring:      true},

                    lizards:    {enabled: false,  require: 'minerals',    allowcapped: false,    limited: false,
                        summer:  true,  autumn:  false, winter:  false,         spring:      false},

                    sharks:     {enabled: false,  require: 'iron',        allowcapped: false,    limited: false,
                        summer:  false, autumn:  false, winter:  true,          spring:      false},

                    griffins:   {enabled: false,  require: 'wood',        allowcapped: false,    limited: false,
                        summer:  false, autumn:  true,  winter:  false,         spring:      false},

                    nagas:      {enabled: false,  require: false,         allowcapped: false,    limited: false,
                        summer:  false, autumn:  false, winter:  false,         spring:      true},

                    spiders:    {enabled: false,  require: false,         allowcapped: false,    limited: false,
                        summer:  false, autumn:  true,  winter:  false,         spring:      false},

                    leviathans: {enabled: false,  require: 'unobtainium', allowcapped: true,     limited: false,
                        summer:  true,  autumn:  true,  winter:  true,          spring:      true}
                }
            },
            upgrade: {
                //Should KS automatically upgrade?
                enabled: false,
                items: {
                    upgrades:  {enabled: true},
                    techs:     {enabled: true},
                    races:     {enabled: true},
                    missions:  {enabled: true},
                    buildings: {enabled: true}
                }
            },
            options: {
                //Which misc options should be enabled?
                enabled: true,
                items: {
                    observe:            {enabled: true,                    misc: true, label: '观测天文事件'},
                    festival:           {enabled: true,                    misc: true, label: '举办节日'},
                    autoPraise:         {enabled: true, subTrigger: 0.98,  misc: true, label: '赞美太阳'},
                    autoczxy:           {enabled: false,                   misc: true, label: '自动重置信仰'},
                    autoTranscendence:  {enabled: false,                   misc: true, label: '自动超越'},
                    //shipOverride:       {enabled: true,                    misc: true, label: '强制 243 艘船'},
                    autofeed:           {enabled: true,                    misc: true, label: '献祭上古神'},
                    hunt:               {enabled: true, subTrigger: 0.98,  misc: true, label: '狩猎'},
                    crypto:             {enabled: true, subTrigger: 10000, misc: true, label: '黑币交易'},
                    catDistribution:    {enabled: false, subTrigger: 5,    misc: true, label: '分配空闲猫咪'},
                    leaderPromote:      {enabled: true, subTrigger: 0.98,  misc: true, label: '提拔领袖'},
                    xfldc:              {enabled: false,                   misc: true, label: '修复冷冻仓'}
                    // buildEmbassies:     {enabled: true, subTrigger: 0.9,   misc: true, label: '建造大使馆 (测试功能)'},
                    // explore:            {enabled: false,                   misc: true, label: '探索 (废弃功能))'}
                }
            },
            filter: {
                //What log messages should be filtered?
                enabled: false,
                items: {
                    buildFilter:         {enabled: false, filter: true, label: '建筑',     variant: "ks-activity type_ks-build"},
                    craftFilter:         {enabled: false, filter: true, label: '工艺',     variant: "ks-activity type_ks-craft"},
                    upgradeFilter:       {enabled: false, filter: true, label: '升级',     variant: "ks-activity type_ks-upgrade"},
                    researchFilter:      {enabled: false, filter: true, label: '研究',     variant: "ks-activity type_ks-research"},
                    tradeFilter:         {enabled: false, filter: true, label: '贸易',     variant: "ks-activity type_ks-trade"},
                    huntFilter:          {enabled: false, filter: true, label: '狩猎',     variant: "ks-activity type_ks-hunt"},
                    praiseFilter:        {enabled: false, filter: true, label: '赞美太阳', variant: "ks-activity type_ks-praise"},
                    faithFilter:         {enabled: false, filter: true, label: '太阳秩序', variant: "ks-activity type_ks-faith"},
                    festivalFilter:      {enabled: false, filter: true, label: '节日',     variant: "ks-activity type_ks-festival"},
                    starFilter:          {enabled: false, filter: true, label: '天文事件', variant: "ks-activity type_ks-star"},
                    distributionFilter:  {enabled: false, filter: true, label: '分配小猫', variant: "ks-activity type_ks-distribution"},
                    promoteFilter:       {enabled: false, filter: true, label: '提拔领袖', variant: "ks-activity type_ks-promote"},
                    resetFaithFilter:    {enabled: false, filter: true, label: '重置信仰', variant: "ks-activity type_ks-resetfaith"},
                    transcendenceFilter: {enabled: false, filter: true, label: '超越',     variant: "ks-activity type_ks-transcendence"},
                    ldcFilter:           {enabled: true,  filter: true, label: '冷冻仓提示',     variant: "ks-activity type_ks-ldc"},
                    miscFilter:          {enabled: false, filter: true, label: '杂项',     variant: "ks-activity"}
                }
            },
            resources: {
                furs:   {stock: 1000},
                unobtainium: {consume: 1.0}
            },
            cache: {
                cache:    [],
                cacheSum: {}
            }
        }
    };

    // GameLog Modification
    // ====================

    // Increase messages displayed in log
    game.console.maxMessages = 1000;

    var printoutput = function (args) {
        if (options.auto.filter.enabled) {
            for (var filt in options.auto.filter.items) {
                var filter = options.auto.filter.items[filt]
                if (filter.enabled && filter.variant === args[1]) {return;}
            }
        }
        var color = args.pop();
        args[1] = args[1] || 'ks-default';

        // update the color of the message immediately after adding
        var msg = game.msg.apply(game, args);
        $(msg.span).css('color', color);

        if (options.debug && console) console.log(args);
    };

    // Used for option change messages and other special notifications
    var message = function () {
        var args = Array.prototype.slice.call(arguments);
        args.push('ks-default');
        args.push(options.msgcolor);
        printoutput(args);
    };

    var activity = function () {
        var args = Array.prototype.slice.call(arguments);
        var activityClass = args.length > 1 ? ' type_' + args.pop() : '';
        args.push('ks-activity' + activityClass);
        args.push(options.activitycolor);
        printoutput(args);
    };

    var summary = function () {
        var args = Array.prototype.slice.call(arguments);
        args.push('ks-summary');
        args.push(options.summarycolor);
        printoutput(args);
    };

    var warning = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('Warning!');

        if (console) console.log(args);
    };

    // Core Engine for Kitten Scientists
    // =================================

    var Engine = function () {
        this.upgradeManager = new UpgradeManager();
        this.buildManager = new BuildManager();
        this.spaceManager = new SpaceManager();
        this.craftManager = new CraftManager();
        this.bulkManager = new BulkManager();
        this.tradeManager = new TradeManager();
        this.religionManager = new ReligionManager();
        this.timeManager = new TimeManager();
        //this.explorationManager = new ExplorationManager();
        this.villageManager = new TabManager('Village');
        this.cacheManager = new CacheManager();
    };

    Engine.prototype = {
        upgradeManager: undefined,
        buildManager: undefined,
        spaceManager: undefined,
        craftManager: undefined,
        bulkManager: undefined,
        tradeManager: undefined,
        religionManager: undefined,
        timeManager: undefined,
        //explorationManager: undefined,
        villageManager: undefined,
        cacheManager: undefined,
        loop: undefined,
        start: function () {
            if (this.loop) return;

            this.loop = setInterval(this.iterate.bind(this), options.interval);
            message('启用小猫珂学家！');
        },
        stop: function () {
            if (!this.loop) return;

            clearInterval(this.loop);
            this.loop = undefined;
            message('禁用小猫珂学家！');
        },
        iterate: function () {
            var subOptions = options.auto.options;
            if (subOptions.enabled && subOptions.items.observe.enabled)  this.observeStars();
            if (options.auto.upgrade.enabled)                            this.upgrade();
            if (subOptions.enabled && subOptions.items.festival.enabled) this.holdFestival();
            if (options.auto.build.enabled)                              this.build();
            if (options.auto.space.enabled)                              this.space();
            if (options.auto.faith.enabled)                              this.worship();
            if (options.auto.craft.enabled)                              this.craft();
            if (options.auto.trade.enabled)                              this.trade();
            if (subOptions.enabled && subOptions.items.hunt.enabled)     this.hunt();
            if (options.auto.time.enabled)                               this.chrono();
            if (subOptions.enabled && subOptions.items.crypto.enabled)   this.crypto();
            //if (subOptions.enabled && subOptions.items.explore.enabled)  this.explore();
            if (subOptions.enabled && subOptions.items.autofeed.enabled) this.autofeed();
            if (subOptions.enabled)                                      this.miscOptions();
            if (options.auto.autotime.enabled)                           this.autotime();
        },
        autofeed: function () {
            var levi = game.diplomacy.get("leviathans");
            var nCorn = game.resPool.get("necrocorn");
            if (!(levi.unlocked && nCorn.value > 0)) {return;}
            if (nCorn.value >= 1) {
                if (levi.energy < game.religion.getZU("marker").val * 5 + 5) {
                    game.diplomacy.feedElders();
                    activity('小猫向上古神献上祭品。 上古神很高兴');
                    storeForSummary('feed', 1);
                }
            } else {
                if (0.25 * (1 + game.getEffect("corruptionBoostRatio")) < 1) {
                    storeForSummary('feed', nCorn.value);
                    game.diplomacy.feedElders();
                    activity('小猫处理掉了影响效率的多余死灵兽。');
                }
            }
        },
        autotime: function(){
            // 精密锻造已研究、有时间水晶
            if (gamePage.workshop.get("chronoforge").researched && gamePage.resPool.get("timeCrystal").value >= 1) {
                // 防止输入无效数值
                var trigger = String(options.auto.autotime.trigger);
                var trigger0 = trigger.charAt(0);
                var trigger1 = trigger.charAt(1);
                var trigger2 = trigger.charAt(2);
                if (isNaN(trigger) || trigger < 100 || trigger > 999) {
                    trigger0 = 9;
                    trigger1 = 9;
                    trigger2 = 5;
                }

                var autotime = options.auto.autotime.items;
                // 检查千禧年完成状态
                var factor = gamePage.challenges.getChallenge("1000Years").researched ? 5 : 10;

                // 设置燃烧倍数
                var x = 1;
                if (autotime.x250.enabled && gamePage.resPool.get("timeCrystal").value >= 250) {x = 250;}
                else if (autotime.x50.enabled && gamePage.resPool.get("timeCrystal").value >= 50) {x = 50;}
                else if (autotime.x5.enabled && gamePage.resPool.get("timeCrystal").value >= 5) {x = 5;}
                else if (autotime.x2.enabled && gamePage.resPool.get("timeCrystal").value >= 2) {x = 2;}
                // 设置周期年份为0年
                if (x > 44 && gamePage.calendar.cycle != trigger2) {
                    if (gamePage.calendar.cycle < trigger2) {x = (trigger2 - gamePage.calendar.cycle) * 5 - gamePage.calendar.cycleYear;}
                    else {x = x - (gamePage.calendar.cycle - trigger2) * 5 - gamePage.calendar.cycleYear;}
                }
                else if (x > 4 && gamePage.calendar.cycleYear != 0) {
                    x = x - gamePage.calendar.cycleYear;
                }

                // 按trigger值燃烧水晶、指定周期内、日期大于0(防止跳过时间悖论)、计时炉不过热 或者 非指定周期、日期大于0(防止跳过时间悖论)、计时炉不过热
                if ((gamePage.calendar.cycleYear >= trigger1 || gamePage.calendar.season >= trigger0 - 1) && gamePage.calendar.cycle == trigger2 && gamePage.calendar.day > 0 && gamePage.getEffect("heatMax") - gamePage.time.heat > factor * x || gamePage.calendar.cycle != trigger2 && gamePage.calendar.day > 0 && gamePage.getEffect("heatMax") - gamePage.time.heat > factor * x) {
                    gamePage.timeTab.cfPanel.children[0].children[0].controller.doShatterAmt(gamePage.timeTab.cfPanel.children[0].children[0].model, x);
                    gamePage.timeTab.cfPanel.children[0].children[0].update();
                }
            }
        },
        crypto: function () {
            var coinPrice = game.calendar.cryptoPrice;
            var previousRelic = game.resPool.get('relic').value;
            var previousCoin = game.resPool.get('blackcoin').value;
            var exchangedCoin = 0.0;
            var exchangedRelic = 0.0;
            var waitForBestPrice = false;

            // Waits for coin price to drop below a certain treshold before starting the exchange process
            if (waitForBestPrice == true && coinPrice < 860.0) { waitForBestPrice = false; }

            // Exchanges up to a certain threshold, in order to keep a good exchange rate, then waits for a higher treshold before exchanging for relics.
            if (waitForBestPrice == false && coinPrice < 1095.0 && previousRelic > options.auto.options.items.crypto.subTrigger) {
                var currentCoin;

                game.diplomacy.buyEcoin();

                currentCoin = game.resPool.get('blackcoin').value;
                exchangedCoin = Math.round(currentCoin - previousCoin);
                activity('小猫出售了你的圣遗物并买入了 '+ exchangedCoin +' 黑币');
            }
            else if (coinPrice > 1099.9 && game.resPool.get('blackcoin').value > 0) {
                var currentRelic;

                waitForBestPrice = true;

                game.diplomacy.sellEcoin();

                currentRelic = game.resPool.get('relic').value;
                exchangedRelic = Math.round(currentRelic - previousRelic);

                activity('小猫出售了你的黑币并买入了 '+ exchangedRelic +' 圣遗物');
            }
        },
        explore: function () {
            var manager = this.explorationManager;
            var expeditionNode = game.village.map.expeditionNode;

            if ( expeditionNode == null) {
                manager.getCheapestNode();

                manager.explore(manager.cheapestNodeX, manager.cheapestNodeY);

                activity('你的小猫开始探索地图上的结点 '+ manager.cheapestNodeX +'-'+ manager.cheapestNodeY +' 。');
            }
        },
        worship: function () {
            var builds = options.auto.faith.items;
            var buildManager = this.religionManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var trigger = options.auto.faith.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();
          
            var metaData = {};
            for (var name in builds) {
                var build = builds[name]
                metaData[name] = buildManager.getBuild(name, build.variant);
                if (!buildManager.getBuildButton(name, build.variant)) {
                    metaData[name].rHidden = true;
                } else {
                    var model = buildManager.getBuildButton(name, build.variant).model;
                    var panel = (build.variant === 'c') ? game.science.techs[58].researched : true;
                    metaData[name].rHidden = !(model.visible && model.enabled && panel);
                }
            }
            
            var buildList = bulkManager.bulk(builds, metaData, trigger, 'faith');
            
            var refreshRequired = false;
            for (var entry in buildList) {
                if (buildList[entry].count > 0) {
                    buildManager.build(buildList[entry].id, buildList[entry].variant, buildList[entry].count);
                    refreshRequired = true;
                }
            }
          
            if (refreshRequired) {game.ui.render();}
        },
        chrono: function () {
            if (!game.timeTab.visible) {return;}
            var builds = options.auto.time.items;
            var buildManager = this.timeManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var trigger = options.auto.time.trigger;
            
            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();
            
            var metaData = {};
            for (var name in builds) {
                var build = builds[name]
                metaData[name] = buildManager.getBuild(name, build.variant);
                var model = buildManager.getBuildButton(name, build.variant).model;
                var panel = (build.variant === 'chrono') ? game.tabs[7].cfPanel : game.tabs[7].vsPanel;
                metaData[name].tHidden = (!model.visible || !model.enabled || !panel.visible);
            }
            
            var buildList = bulkManager.bulk(builds, metaData, trigger, 'time');
            
            var refreshRequired = false;
            for (var entry in buildList) {
                if (buildList[entry].count > 0) {
                    buildManager.build(buildList[entry].id, buildList[entry].variant, buildList[entry].count);
                    refreshRequired = true;
                }
            }
          
            if (refreshRequired) {game.ui.render();}
        },
        upgrade: function () {
            var upgrades = options.auto.upgrade.items;
            var upgradeManager = this.upgradeManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var buildManager = this.buildManager;
            
            upgradeManager.workManager.render();
            upgradeManager.sciManager.render();
            
            if (upgrades.upgrades.enabled && gamePage.tabs[3].visible) {
                var work = game.workshop.upgrades;
                var noup = ["factoryOptimization","factoryRobotics","spaceEngineers","chronoEngineers","amFission","biofuel","gmo","pumpjack","factoryAutomation","advancedAutomation","pneumaticPress"];
                workLoop:
                for (var upg in work) {
                    if (work[upg].researched || !work[upg].unlocked) {continue;}
                    
                    var prices = work[upg].prices;
                    for (var resource in prices) {
                        if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {continue workLoop;}
                    }
                    for (var name in noup) {
                        if (work[upg].name == noup[name]) {continue workLoop;}
                    }
                    upgradeManager.build(work[upg], 'workshop');
                }
            }
            
            if (upgrades.techs.enabled && gamePage.tabs[2].visible) {
                var tech = game.science.techs;
                techLoop:
                for (var upg in tech) {
                    if (tech[upg].researched || !tech[upg].unlocked) {continue;}
                    
                    var prices = tech[upg].prices;
                    for (var resource in prices) {
                        if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val && prices[resource].name != 'parchment') {continue techLoop;}
                    }
                    upgradeManager.build(tech[upg], 'science');
                }
            }
          
            if (upgrades.missions.enabled && gamePage.tabs[6].visible) {
                var missions = game.space.meta[0].meta;
                missionLoop:
                for (var i = 0; i < missions.length; i++) {
                    if (!(missions[i].unlocked && missions[i].val < 1)) {continue;}
                    
                    var model = game.tabs[6].GCPanel.children[i];
                    var prices = model.model.prices;
                    for (var resource in prices) {
                        if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {continue missionLoop;}
                    }
                    model.domNode.click();
                    if (i === 8 || i === 9 || i === 10) {
                        activity('小猫执行了 ' + missions[i].label, 'ks-upgrade');
                    } else if (i === 12) {
                        activity('小猫执行了 探索边界环 的任务', 'ks-upgrade');
                    } else {
                        activity('小猫执行了 ' + missions[i].label + ' 的任务', 'ks-upgrade');
                    }
                }
            }
          
            if (upgrades.races.enabled && gamePage.tabs[4].visible) {
                var maxRaces = (game.diplomacy.get('leviathans').unlocked) ? 8 : 7;
                if (game.diplomacyTab.racePanels.length < maxRaces) {
                    var manpower = craftManager.getValueAvailable('manpower', true);
                    if (!game.diplomacy.get('lizards').unlocked) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('小猫遇到了 ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('sharks').unlocked) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('小猫遇到了 ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('griffins').unlocked) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('小猫遇到了 ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('nagas').unlocked && game.resPool.get("culture").value >= 1500) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('小猫遇到了 ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('zebras').unlocked && game.resPool.get("ship").value >= 1) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('小猫遇到了 ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('spiders').unlocked && game.resPool.get("ship").value >= 100 && game.resPool.get("science").maxValue > 125000) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('小猫遇到了 ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('dragons').unlocked && game.science.get("nuclearFission").researched) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('小猫遇到了 ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                }
            }
            
            if (upgrades.buildings.enabled) {
                var pastures = (game.bld.getBuildingExt('pasture').meta.stage === 0) ? game.bld.getBuildingExt('pasture').meta.val: 0;
                var aqueducts = (game.bld.getBuildingExt('aqueduct').meta.stage === 0) ? game.bld.getBuildingExt('aqueduct').meta.val: 0;
              
                var pastureMeta = game.bld.getBuildingExt('pasture').meta;
                if (pastureMeta.stage === 0) {
                    if (pastureMeta.stages[1].stageUnlocked) {
                        if (craftManager.getPotentialCatnip(true, 0, aqueducts) > 0) {
                            var prices = pastureMeta.stages[1].prices;
                            var priceRatio = bulkManager.getPriceRatio(pastureMeta, true);
                            if (bulkManager.singleBuildPossible(pastureMeta, prices, 1)) {
                                var button = buildManager.getBuildButton('pasture', 0);
                                button.controller.sellInternal(button.model, 0);
                                pastureMeta.on = 0;
                                pastureMeta.val = 0;
                                pastureMeta.stage = 1;
                                activity('将牧场升级为太阳能农场！', 'ks-upgrade');
                                game.ui.render();
                                buildManager.build('pasture', 1, 1);
                                game.ui.render();
                                return;
                            }
                        }
                    }
                }
                
                var aqueductMeta = game.bld.getBuildingExt('aqueduct').meta;
                if (aqueductMeta.stage === 0) {
                    if (aqueductMeta.stages[1].stageUnlocked) {
                        if (craftManager.getPotentialCatnip(true, pastures, 0) > 0) {
                            var prices = aqueductMeta.stages[1].prices;
                            var priceRatio = bulkManager.getPriceRatio(aqueductMeta, true);
                            if (bulkManager.singleBuildPossible(aqueductMeta, prices, 1)) {
                                var button = buildManager.getBuildButton('aqueduct', 0);
                                button.controller.sellInternal(button.model, 0);
                                aqueductMeta.on = 0
                                aqueductMeta.val = 0
                                aqueductMeta.stage = 1
                                aqueductMeta.calculateEffects(aqueductMeta, game)
                                activity('将水渠升级为水电站！', 'ks-upgrade');
                                game.ui.render();
                                buildManager.build('aqueduct', 1, 1);
                                game.ui.render();
                                return;
                            }
                        }
                    }
                }
                
                var libraryMeta = game.bld.getBuildingExt('library').meta;
                if (libraryMeta.stage === 0) {
                    if (libraryMeta.stages[1].stageUnlocked) {
                        var enCon = (game.workshop.get('cryocomputing').researched) ? 1 : 2;
                        if (game.challenges.currentChallenge == 'energy') {enCon *= 2;}
                        var libToDat = 3;
                        if (game.workshop.get('uplink').researched) {
                            libToDat *= (1 + game.bld.get('biolab').val * game.getEffect('uplinkDCRatio'));
                        }
                        if (game.workshop.get('machineLearning').researched) {
                            libToDat *= (1 + game.bld.get('aiCore').on * game.getEffect('dataCenterAIRatio'));
                        }
                        if (game.resPool.energyProd >= game.resPool.energyCons + enCon*libraryMeta.val/libToDat) {
                            var prices = libraryMeta.stages[1].prices;
                            var priceRatio = bulkManager.getPriceRatio(libraryMeta, true);
                            if (bulkManager.singleBuildPossible(libraryMeta, prices, 1)) {
                                var button = buildManager.getBuildButton('library', 0);
                                button.controller.sellInternal(button.model, 0);
                                libraryMeta.on = 0
                                libraryMeta.val = 0
                                libraryMeta.stage = 1
                                libraryMeta.calculateEffects(libraryMeta, game)
                                activity('将图书馆升级为数据中心！', 'ks-upgrade');
                                game.ui.render();
                                buildManager.build('library', 1, 1);
                                game.ui.render();
                                return;
                            }
                        }
                    }
                    
                }
                
                var amphitheatreMeta = game.bld.getBuildingExt('amphitheatre').meta;
                if (amphitheatreMeta.stage === 0) {
                    if (amphitheatreMeta.stages[1].stageUnlocked) {
                        var prices = amphitheatreMeta.stages[1].prices;
                        var priceRatio = bulkManager.getPriceRatio(amphitheatreMeta, true);
                        if (bulkManager.singleBuildPossible(amphitheatreMeta, prices, 1)) {
                            var button = buildManager.getBuildButton('amphitheatre', 0);
                            button.controller.sellInternal(button.model, 0);
                            amphitheatreMeta.on = 0
                            amphitheatreMeta.val = 0
                            amphitheatreMeta.stage = 1
                            activity('将剧场升级为广播塔！', 'ks-upgrade');
                            game.ui.render();
                            buildManager.build('amphitheatre', 1, 1);
                            game.ui.render();
                            return;
                        }
                    }
                }
            }
        },
        build: function () {
            var builds = options.auto.build.items;
            var buildManager = this.buildManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var trigger = options.auto.build.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();
            
            var metaData = {};
            for (var name in builds) {
                var build = builds[name]
                metaData[name] = buildManager.getBuild(build.name || name).meta;
            }
            
            var buildList = bulkManager.bulk(builds, metaData, trigger, 'bonfire');
            
            var refreshRequired = false;
            for (var entry in buildList) {
                if (buildList[entry].count > 0) {
                    buildManager.build(buildList[entry].name || buildList[entry].id, buildList[entry].stage, buildList[entry].count);
                    refreshRequired = true;
                }
            }
            if (refreshRequired) {game.ui.render();}
        },
        space: function () {
            var builds = options.auto.space.items;
            var buildManager = this.spaceManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var trigger = options.auto.space.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();
          
            var metaData = {};
            for (var name in builds) {
                var build = builds[name]
                metaData[name] = buildManager.getBuild(name);
            }
            
            var buildList = bulkManager.bulk(builds, metaData, trigger, 'space');
            
            var refreshRequired = false;
            for (var entry in buildList) {
                if (buildList[entry].count > 0) {
                    buildManager.build(buildList[entry].id, buildList[entry].count);
                    refreshRequired = true;
                }
            }
            if (refreshRequired) {game.ui.render();}
        },
        craft: function () {
            var crafts = options.auto.craft.items;
            var manager = this.craftManager;
            var trigger = options.auto.craft.trigger;

            for (var name in crafts) {
                var craft = crafts[name];
                var current = !craft.max ? false : manager.getResource(name);
                var require = !craft.require ? false : manager.getResource(craft.require);
                var season = game.calendar.season;
                var amount = 0;
                // Ensure that we have reached our cap
                if (current && current.value > craft.max) continue;
                if (!manager.singleCraftPossible(name)) {continue;}
                // Craft the resource if we meet the trigger requirement
                if (!require || trigger <= require.value / require.maxValue) {
                    amount = manager.getLowestCraftAmount(name, craft.limited, craft.limRat, true);
                } else if (craft.limited) {
                    amount = manager.getLowestCraftAmount(name, craft.limited, craft.limRat, false);
                }
                if (amount > 0) {
                    manager.craft(name, amount);
                }
            }
        },
        holdFestival: function () {
            if (!(game.science.get('drama').researched && game.calendar.festivalDays < 400)) {return;}
            if (!game.prestige.getPerk('carnivals').researched && game.calendar.festivalDays > 0) {return;}
          
            var craftManager = this.craftManager;
            if (craftManager.getValueAvailable('manpower', true) < 1500 || craftManager.getValueAvailable('culture', true) < 5000) {return;}
          
            var catpowProf = 4000 * craftManager.getTickVal(craftManager.getResource('manpower'), true) > 1500;
            var cultureProf = 4000 * craftManager.getTickVal(craftManager.getResource('culture'), true) > 5000;
          
            if (!(catpowProf && cultureProf)) {return;}
          
            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            this.villageManager.render();

            if (game.villageTab.festivalBtn.model.enabled) {
                var beforeDays = game.calendar.festivalDays;
                game.villageTab.festivalBtn.onClick();
                storeForSummary('festival');
                if (beforeDays > 0) {
                    activity('小猫延长了节日', 'ks-festival');
                } else {
                    activity('小猫开始举办节日', 'ks-festival');
                }
            }
        },
        observeStars: function () {
            if (game.calendar.observeBtn != null){
                game.calendar.observeHandler();
                activity('小猫珂学家观察到一颗星星', 'ks-star');
                storeForSummary('stars', 1);
            }
        },
        hunt: function () {
            var catpower = this.craftManager.getResource('catpower');

            if (options.auto.options.items.hunt.subTrigger <= catpower.value / catpower.maxValue && catpower.value >= 100) {
                // No way to send only some hunters. Thus, we hunt with everything
                var huntCount = Math.floor(catpower.value/100);
                storeForSummary('hunt', huntCount);
                activity('派出 ' + huntCount + ' 波小猫去打猎', 'ks-hunt');

                var huntCount = Math.floor(catpower.value/100);
                var aveOutput = this.craftManager.getAverageHunt();
                var trueOutput = {};
              
                for (var out in aveOutput) {
                    var res = this.craftManager.getResource(out);
                    trueOutput[out] = (res.maxValue > 0) ? Math.min(aveOutput[out] * huntCount, Math.max(res.maxValue - res.value, 0)) : aveOutput[out] * huntCount;
                }

                this.cacheManager.pushToCache({'materials': trueOutput, 'timeStamp': game.timer.ticksTotal});
              
                game.village.huntAll();
            }
        },
        trade: function () {
            var craftManager = this.craftManager;
            var tradeManager = this.tradeManager;
            var cacheManager = this.cacheManager;
            var gold = craftManager.getResource('gold');
            var trades = [];
            var requireTrigger = options.auto.trade.trigger;
          
            tradeManager.manager.render();
          
            if (!tradeManager.singleTradePossible(undefined)) {return;}
          
            var season = game.calendar.getCurSeason().name;

            // Determine how many races we will trade this cycle
            for (var name in options.auto.trade.items) {
                var trade = options.auto.trade.items[name];

                // Check if the race is in season, enabled, unlocked, and can actually afford it
                if (!trade.enabled) continue;
                if (!trade[season]) continue;
                var race = tradeManager.getRace(name);
                if (!race.unlocked) {continue;}
                var button = tradeManager.getTradeButton(race.name);
                if (!button.model.enabled) {continue;}
                if (!tradeManager.singleTradePossible(name)) {continue;}

                var require = !trade.require ? false : craftManager.getResource(trade.require);

                // If we have enough to trigger the check, then attempt to trade
                var prof = tradeManager.getProfitability(name);
                if (trade.limited && prof) {
                    trades.push(name);
                } else if ((!require || requireTrigger <= require.value / require.maxValue) && requireTrigger <= gold.value / gold.maxValue) {
                    trades.push(name);
                }
            }
          
            if (trades.length === 0) {return;}

            // Figure out how much we can currently trade
            var maxTrades = tradeManager.getLowestTradeAmount(undefined, true, false);

            // Distribute max trades without starving any race

            if (maxTrades < 1) {return;}
          
            var maxByRace = [];
            for (var i = 0; i < trades.length; i++) {
                var name = trades[i];
                var trade = options.auto.trade.items[name];
                var require = !trade.require ? false : craftManager.getResource(trade.require);
                var trigConditions = ((!require || requireTrigger <= require.value / require.maxValue) && requireTrigger <= gold.value / gold.maxValue);
                var tradePos = tradeManager.getLowestTradeAmount(name, trade.limited, trigConditions);
                if (tradePos < 1) {
                    trades.splice(i, 1);
                    i--;
                    continue;
                }
                maxByRace[i] = tradePos;
            }
          
            if (trades.length === 0) {return;}
          
            var tradesDone = {};
            while (trades.length > 0 && maxTrades >= 1) {
                if (maxTrades < trades.length) {
                    var j = Math.floor(Math.random() * trades.length);
                    if (!tradesDone[trades[j]]) {tradesDone[trades[j]] = 0;}
                    tradesDone[trades[j]] += 1;
                    maxTrades -= 1;
                    trades.splice(j, 1);
                    maxByRace.splice(j, 1);
                    continue;
                }
                var minTrades = Math.floor(maxTrades / trades.length);
                var minTradePos = 0;
                for (var i = 0; i < trades.length; i++) {
                    if (maxByRace[i] < minTrades) {
                        minTrades = maxByRace[i];
                        minTradePos = i;
                    }
                }
                if (!tradesDone[trades[minTradePos]]) {tradesDone[trades[minTradePos]] = 0;}
                tradesDone[trades[minTradePos]] += minTrades;
                maxTrades -= minTrades;
                trades.splice(minTradePos, 1);
                maxByRace.splice(minTradePos, 1);
            }
            if (tradesDone.length === 0) {return;}
          
            var tradeNet = {};
            for (var name in tradesDone) {
                var race = tradeManager.getRace(name);

                var materials = tradeManager.getMaterials(name);
                for (var mat in materials) {
                    if (!tradeNet[mat]) {tradeNet[mat] = 0;}
                    tradeNet[mat] -= materials[mat] * tradesDone[name];
                }
              
                var meanOutput = tradeManager.getAverageTrade(race);
                for (var out in meanOutput) {
                    var res = craftManager.getResource(out);
                    if (!tradeNet[out]) {tradeNet[out] = 0;}
                    tradeNet[out] += (res.maxValue > 0) ? Math.min(meanOutput[out] * tradesDone[name], Math.max(res.maxValue - res.value, 0)) : meanOutput[out] * tradesDone[name];
                }
            }

            cacheManager.pushToCache({'materials': tradeNet, 'timeStamp': game.timer.ticksTotal});
          
            for (var name in tradesDone) {
                if (tradesDone[name] > 0) {
                    tradeManager.trade(name, tradesDone[name]);
                }
            }
        },
        miscOptions: function () {
            var craftManager = this.craftManager;
            var optionVals = options.auto.options.items;
            
            /*AutoEmbassy:
            if (optionVals.buildEmbassies.enabled) {
                var culture = craftManager.getResource('culture');
                if (optionVals.buildEmbassies.subTrigger <= culture.value / culture.maxValue) {
                    var racePanels = game.diplomacyTab.racePanels;
                    var cultureVal = craftManager.getValueAvailable('culture', true);
              
                    var embassyBulk = {};
                    var bulkTracker = [];
              
                    for (var i = 0; i < racePanels.length; i++) {
                        if (!racePanels[i].embassyButton) {continue;}
                        var name = racePanels[i].race.name;
                        var race = game.diplomacy.get(name);
                        embassyBulk[name] = {'val': 0, 'basePrice': race.embassyPrices[0].val, 'currentEm': race.embassyLevel, 'priceSum': 0, 'race': race};
                        bulkTracker.push(name);
                    }
              
                    if (bulkTracker.length === 0) {break AutoEmbassy;}
              
                    var refreshRequired = false;

                    while (bulkTracker.length > 0) {
                        for (var i=0; i < bulkTracker.length; i++) {
                            var name = bulkTracker[i];
                            var emBulk = embassyBulk[name];
                            var nextPrice = emBulk.basePrice * Math.pow(1.15, emBulk.currentEm + emBulk.val);
                            if (nextPrice <= cultureVal) {
                                cultureVal -= nextPrice;
                                emBulk.priceSum += nextPrice;
                                emBulk.val += 1;
                                refreshRequired = true;
                            } else {
                                bulkTracker.splice(i, 1);
                                i--;
                            }
                        }
                    }

                    for (var name in embassyBulk) {
                        var emBulk = embassyBulk[name];
                        if (emBulk.val === 0) {continue;}
                        var cultureVal = craftManager.getValueAvailable('culture', true);
                        if (emBulk.priceSum > cultureVal) {warning('Something has gone horribly wrong.' + [emBulk.priceSum, cultureVal]);}
                        game.resPool.resources[13].value -= emBulk.priceSum;
                        emBulk.race.embassyLevel += emBulk.val;
                        storeForSummary('embassy', emBulk.val);
                        if (emBulk.val !== 1) {
                            activity('Built ' + emBulk.val + ' embassies for ' + name, 'ks-trade');
                        } else {
                            activity('Built ' + emBulk.val + ' embassy for ' + name, 'ks-trade');
                        }
                    }

                    if (refreshRequired) {game.ui.render();}
                }
            }*/

            if (optionVals.autoPraise.enabled) {
                var faith = craftManager.getResource('faith');
                if (optionVals.autoPraise.subTrigger <= faith.value / faith.maxValue) {
                    var sumfaith = faith.value * (1 + game.religion.getFaithBonus());
                    storeForSummary('faith', sumfaith);
                    activity('赞美太阳！积累 ' + game.getDisplayValueExt(faith.value) + ' 信仰为 ' + game.getDisplayValueExt(sumfaith) + ' 信仰总数', 'ks-praise');
                    game.religion.praise();
                }
            }

            if (optionVals.catDistribution.enabled) {
                var kittens = game.village.getFreeKittens();
                if (kittens > 0) {
                    switch (optionVals.catDistribution.subTrigger) {
                        case 0:
                            var name = 'woodcutter';
                            break;
                        case 1:
                            var name = 'farmer';
                            break;
                        case 2:
                            var name = 'scholar';
                            break;
                        case 3:
                            var name = 'hunter';
                            break;
                        case 4:
                            var name = 'miner';
                            break;
                        case 5:
                            var name = 'priest';
                            break;
                        case 6:
                            var name = 'geologist';
                            break;
                        case 7:
                            var name = 'engineer';
                            break;
                        default:
                            var name = 'priest';
                    }
                    if (game.village.getJob(name).unlocked) {
                        game.village.assignJob(game.village.getJob(name),kittens);
                        game.villageTab.updateTab();
                        activity('分配了 ' + kittens + ' 只小猫到 ' + cnItem(name), 'ks-distribution');
                    }
                }
            }

            // 自动重置信仰
            if (optionVals.autoczxy.enabled) {
                if (gamePage.religion.getRU("apocripha").on && (gamePage.religion.faith / gamePage.religion.getFaithBonus()) > gamePage.resPool.get("faith").maxValue * 10) {
                    activity('重置了 ' + game.getDisplayValueExt(gamePage.religion.faith) + ' 信仰总数', 'ks-resetfaith');
                    gamePage.religionTab.resetFaithInternal(1.01);
                }
            }

            if (optionVals.leaderPromote.enabled && game.science.get('civil').researched) {
                var gold = craftManager.getResource('gold');
                var leader = game.village.leader;
                if (leader != null && leader.exp > game.village.getRankExp(leader.rank) && optionVals.leaderPromote.subTrigger <= gold.value / gold.maxValue) {
                    if (game.village.sim.promote(leader) > 0) {
                        activity('你的领袖被提拔到了 ' + leader.rank + ' 级', 'ks-promote');
                        gamePage.tabs[1].censusPanel.census.renderGovernment(gamePage.tabs[1].censusPanel.census);
                        gamePage.tabs[1].censusPanel.census.update();
                    }
                }
            }

            if (optionVals.autoTranscendence.enabled && gamePage.religion.getRU("transcendence").on) {
                var ratio = game.religion.faithRatio;
                var lv = game.religion.tclevel;
                var k = (lv + 2) / (lv + 1); k *= k;
                var x1 = Math.exp(lv + 1) / 5 + 1; x1 *= x1;
                var x2 = Math.exp(lv) / 5 + 1; x2 *= x2;
                var x = (x1 - x2) / 80;
                var rec = (1-k+Math.sqrt(80*(k*k-1)*x+(k-1)*(k-1)))*k/(40*(k+1)*(k+1)*(k-1))+x+x/(k*k-1);
                //console.log('推荐值: ' + rec/x + ' ,当前值: ' + ratio/x);
                if(ratio >= rec) {
                    game.religion.faithRatio -= x;
                    game.religion.tcratio += x;
                    ++game.religion.tclevel;
                    activity('超越到了 ' + game.religion.tclevel + ' 级', 'ks-transcendence');
                }
            }

            //修复冷冻仓
            var ldc = game.tabs[7].vsPanel.children[0].children;
            if (optionVals.xfldc.enabled && game.resPool.get("karma").value < ldc[1].model.prices[2].val && ldc[2].model.visible && game.resPool.get("temporalFlux").value > 6000) {
                game.timeTab.update();
                var ldcx = Math.floor((game.resPool.get("temporalFlux").value - 3000) / 3000);
                for (var i = 0; i < ldcx; i++) {
                ldc[0].controller.buyItem(ldc[0].model, {}, function() {});
                }
            }

            var factor = game.challenges.getChallenge("1000Years").researched ? 5 : 10;
            //修复冷冻仓热量计算
            if (ldc[2].model.visible && (ldc[2].model.on * 3000 / game.bld.getBuildingExt('chronosphere').meta.val - (game.time.getCFU("blastFurnace").heat / 100)) * factor < game.getEffect("heatMax") - game.time.heat) {activity('可修复冷冻仓', 'ks-ldc');}
        }
    };

    // Tab Manager
    // ===========

    var TabManager = function (name) {
        this.setTab(name);
    };

    TabManager.prototype = {
        tab: undefined,
        render: function () {
            if (this.tab && game.ui.activeTabId !== this.tab.tabId) this.tab.render();

            return this;
        },
        setTab: function (name) {
            for (var tab in game.tabs) {
                if (game.tabs[tab].tabId === name) {
                    this.tab = game.tabs[tab];
                    break;
                }
            }

            this.tab ? this.render() : warning('无法找到标签 ' + name);
        }
    };

    // Exploration Manager
    // ===================

    var ExplorationManager = function () {
        this.manager = new TabManager('Village');
    };

    ExplorationManager.prototype = {
        manager: undefined,
        currentCheapestNode: null,
        currentCheapestNodeValue: null,
        cheapestNodeX: null,
        cheapestNodeY: null,
        explore: function(x, y) {
            game.village.map.expeditionNode = {x, y};
            game.village.map.explore(x, y);
        },
        getCheapestNode: function () {
            var tileArray = game.village.map.villageData;
            var tileKey = "";

            this.currentCheapestNode = null;

            for (var i in tileArray) {
                tileKey = i;

                // Discards locked nodes
                if (i.unlocked == false) { break; }

                // Discards junk nodes
                if (tileKey.includes('-')) { break; }

                // Acquire node coordinates
                var regex = /(\d).(\d*)/g;
                var keyMatch = regex.exec(tileKey);
                var xCoord = parseInt(keyMatch[1]);
                var yCoord = parseInt(keyMatch[2]);

                if (this.currentCheapestNode == null) {
                    this.currentCheapestNodeValue = this.getNodeValue(xCoord, yCoord)
                    this.currentCheapestNode = i;
                    this.cheapestNodeX = xCoord;
                    this.cheapestNodeY = yCoord;
                }

                if (this.currentCheapestNode != null && this.getNodeValue(xCoord, yCoord) < this.currentCheapestNodeValue) {
                    this.currentCheapestNodeValue = this.getNodeValue(xCoord, yCoord)
                    this.currentCheapestNode = i;
                    this.cheapestNodeX = xCoord;
                    this.cheapestNodeY = yCoord;
                }
            }
        },
        getNodeValue: function (x, y){
            var nodePrice = game.village.map.toLevel(x, y);
            var exploreCost = game.village.map.getExplorationPrice(x,y);

            var tileValue = nodePrice / exploreCost;

            return tileValue;
        }
    };

    // Religion manager
    // ================

    var ReligionManager = function () {
        this.manager = new TabManager('Religion');
        this.crafts = new CraftManager();
        this.bulkManager = new BulkManager();
    };

    var getButton = function(tab, buttonName){
        for(var i in gamePage.tabs[tab].buttons){
            if(gamePage.tabs[tab].buttons[i].opts.building == buttonName)
                return parseInt(i);
        }
    };

    var getBestUniBuilding = function(log=false) {
        var validBuildings = ["unicornTomb","ivoryTower","ivoryCitadel","skyPalace","unicornUtopia","sunspire"];
        var pastureButton = getButton(0, "unicornPasture");
        var unicornsPerSecond = game.getEffect("unicornsPerTickBase") * game.getRateUI();
        var globalRatio = game.getEffect("unicornsGlobalRatio")+1;
        var religionRatio = game.getEffect("unicornsRatioReligion")+1;
        var paragonRatio = game.prestige.getParagonProductionRatio()+1;
        var faithBonus = game.religion.getProductionBonus()/100+1;
        var cycle = 1;
        if(game.calendar.cycles[game.calendar.cycle].festivalEffects["unicorns"]!=undefined)
            if(game.prestige.getPerk("numeromancy").researched && game.calendar.festivalDays)
                cycle=game.calendar.cycles[game.calendar.cycle].festivalEffects["unicorns"];
        var onZig = Math.max(game.bld.getBuildingExt("ziggurat").meta.on,1);
        var total = unicornsPerSecond * globalRatio * religionRatio * paragonRatio * faithBonus * cycle;
        var baseUnicornsPerRift = 500 * (1 + game.getEffect("unicornsRatioReligion") * 0.1);
        var riftChanceRatio = 1;
        if(game.prestige.getPerk("unicornmancy").researched)
            riftChanceRatio *= 1.1;
        var baseRift = game.getEffect("riftChance") * riftChanceRatio / (10000 * 2) * baseUnicornsPerRift;
        /*if(log){
            console.log("Unicorns per second: "+total);
            console.log("Base rift per second average: "+baseRift);
        }*/
        var bestAmoritization = Infinity;
        var bestBuilding = "";
        var pastureAmor = game.bld.getBuildingExt("unicornPasture").meta.effects["unicornsPerTickBase"] * game.getRateUI();
        pastureAmor = pastureAmor * globalRatio * religionRatio * paragonRatio * faithBonus * cycle;
        /*if(log){
            console.log("unicornPasture");
            console.log("\tBonus unicorns per second: "+pastureAmor);
        }*/
        pastureAmor = game.tabs[0].buttons[pastureButton].model.prices[0].val / pastureAmor;
        /*if(log){
            var baseWait = game.tabs[0].buttons[pastureButton].model.prices[0].val / total;
            var avgWait = game.tabs[0].buttons[pastureButton].model.prices[0].val / (total + baseRift);
            console.log("\tMaximum time to build: " + game.toDisplaySeconds(baseWait) + " | Average time to build: " + game.toDisplaySeconds(avgWait));
            console.log("\tPrice: "+game.tabs[0].buttons[pastureButton].model.prices[0].val+" | Amortization: "+game.toDisplaySeconds(pastureAmor));
        }*/
        if(pastureAmor < bestAmoritization){
            bestAmoritization = pastureAmor;
            bestBuilding = "独角兽牧场";
        }
        for(var i in game.tabs[5].zgUpgradeButtons){
            var btn = game.tabs[5].zgUpgradeButtons[i];
            if(validBuildings.indexOf(btn.id)!=-1){
                if(btn.model.visible){
                    unicornPrice = 0;
                    for(var j in btn.model.prices){
                        if(btn.model.prices[j].name=="unicorns")
                            unicornPrice += btn.model.prices[j].val;
                        if(btn.model.prices[j].name=="tears")
                            unicornPrice += btn.model.prices[j].val * 2500 / onZig;
                    }
                    var bld=game.religion.getZU(btn.id);
                    var relBonus = religionRatio;
                    var riftChance = game.getEffect("riftChance");
                    for(var j in bld.effects){
                        if(j=="unicornsRatioReligion")
                            relBonus += bld.effects[j]
                        if(j=="riftChance")
                            riftChance += bld.effects[j];
                    }
                    var unicornsPerRift = 500 * ((relBonus -1) * 0.1 +1);
                    var riftBonus = riftChance * riftChanceRatio / (10000 * 2) * unicornsPerRift;
                    riftBonus -= baseRift;
                    var amor = unicornsPerSecond * globalRatio * relBonus * paragonRatio * faithBonus * cycle;
                    amor -= total;
                    amor = amor + riftBonus;
                    /*if(log){
                        console.log(btn.id);
                        console.log("\tBonus unicorns per second: "+amor);
                    }*/
                    amor = unicornPrice / amor;
                    /*if(log){
                        var baseWait = unicornPrice / total;
                        var avgWait = unicornPrice / (total + baseRift);
                        var amorSeconds = gamePage.toDisplaySeconds(amor);
                        if(amorSeconds == "")
                            amorSeconds = "NA";
                        console.log("\tMaximum time to build: " + gamePage.toDisplaySeconds(baseWait) + " | Average time to build: " + gamePage.toDisplaySeconds(avgWait));
                        console.log("\tPrice: "+unicornPrice + " | Amortization: "+amorSeconds);
                    }*/
                    if(amor < bestAmoritization) {
                        if(riftBonus > 0 || relBonus > religionRatio && unicornPrice > 0){
                            bestAmoritization = amor;
                            switch (btn.id) {
                                case 'unicornTomb':
                                    bestBuilding = '0';
                                    break;
                                case 'ivoryTower':
                                    bestBuilding = '1';
                                    break;
                                case 'ivoryCitadel':
                                    bestBuilding = '2';
                                    break;
                                case 'skyPalace':
                                    bestBuilding = '3';
                                    break;
                                case 'unicornUtopia':
                                    bestBuilding = '4';
                                    break;
                                case 'sunspire':
                                    bestBuilding = '5';
                                    break;
                            }
                        }
                    }
                }
            }
        }
        return bestBuilding;
    };

    ReligionManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, variant, amount) {
            var build = this.getBuild(name, variant);
            var button = this.getBuildButton(name, variant);

            if (!button || !button.model.enabled) return;
          
            var amountTemp = amount;
            var label = build.label;
            amount=this.bulkManager.construct(button.model, button, amount);
            if (amount !== amountTemp) {warning(label + ' Amount ordered: '+amountTemp+' Amount Constructed: '+amount);}
          
            if (variant === "s") {
                storeForSummary(label, amount, 'faith');
                if (amount === 1) {
                    activity('小猫发现了 ' + label, 'ks-faith');
                } else {
                    activity('小猫发现了 ' + label + ' ' + amount + ' 次。', 'ks-faith');
                }
            } else {
                storeForSummary(label, amount, 'build');
                if (amount === 1) {
                    activity('小猫建造了一个新的 ' + label, 'ks-build');
                } else {
                    activity('小猫建造了 ' + amount + ' 个新的 ' + label, 'ks-build');
                }
            }
        },
        getBuild: function (name, variant) {
            switch (variant) {
                case 'z':
                    return game.religion.getZU(name);
                case 's':
                    return game.religion.getRU(name);
                case 'c':
                    return game.religion.getTU(name);
            }
        },
        getBuildButton: function (name, variant) {
            switch (variant) {
                case 'z':
                    var buttons = this.manager.tab.zgUpgradeButtons;
                    break;
                case 's':
                    var buttons = this.manager.tab.rUpgradeButtons;
                    break;
                case 'c':
                    var buttons = this.manager.tab.children[0].children[0].children;
            }
            var build = this.getBuild(name, variant);
            var zdmt = options.auto.faith.items;
            for (var i in buttons) {
                //判断是否为庙塔
                if (variant === "z" && game.bld.get("unicornPasture").val > 0 && i <= 5) {
                    //设置庙塔升级ID
                    if (zdmt["unicornTomb"].enabled && zdmt["ivoryTower"].enabled && zdmt["ivoryCitadel"].enabled && zdmt["skyPalace"].enabled && zdmt["unicornUtopia"].enabled && zdmt["sunspire"].enabled) {
                        if (getBestUniBuilding() <= 5) {
                            i = getBestUniBuilding();
                        }
                        else {
                            i = 9;
                        }
                    }
                    //检测升级所需眼泪
                    var btn = game.tabs[5].zgUpgradeButtons[i];
                    for (var j in btn.model.prices) {
                        if (btn.model.prices[j].name=="tears") {
                            var unicornPrice = btn.model.prices[j].val;
                        }
                    }
                    //自动献祭独角兽
                    if (gamePage.bld.getBuildingExt("ziggurat").meta.on > 0) {
                        var maxSacrifice = Math.floor(gamePage.resPool.get("unicorns").value/2500);
                        var neededSacrifice = Math.ceil((unicornPrice - gamePage.resPool.get("tears").value) / gamePage.bld.getBuildingExt("ziggurat").meta.on);
                        if(neededSacrifice <= maxSacrifice && neededSacrifice > 0) {
                            gamePage.religionTab.sacrificeBtn.controller.sacrifice(gamePage.religionTab.sacrificeBtn.model,neededSacrifice);
                        }
                    }
                }
                var haystack = buttons[i].model.name;
                if (haystack.indexOf(build.label) !== -1) {
                    return buttons[i];
                }
            }
        }
    };

    // Time manager
    // ============
    
    var TimeManager = function () {
        this.manager = new TabManager('Time');
        this.crafts = new CraftManager();
        this.bulkManager = new BulkManager();
    };
    
    TimeManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, variant, amount) {
            var build = this.getBuild(name, variant);
            var button = this.getBuildButton(name, variant);

            if (!button || !button.model.enabled) return;

            var amountTemp = amount;
            var label = build.label;
            amount=this.bulkManager.construct(button.model, button, amount);
            if (amount !== amountTemp) {warning(label + ' Amount ordered: '+amountTemp+' Amount Constructed: '+amount);}
            storeForSummary(label, amount, 'build');
          
          
            if (amount === 1) {
                activity('小猫建造了一个新的 ' + label, 'ks-build');
            } else {
                activity('小猫建造了 ' + amount + ' 个新的 ' + label, 'ks-build');
            }
        },
        getBuild: function (name, variant) {
            if (variant === 'chrono') {
                return game.time.getCFU(name);
            } else {
                return game.time.getVSU(name);
            }
        },
        getBuildButton: function (name, variant) {
            if (variant === 'chrono') {
                var buttons = this.manager.tab.children[2].children[0].children;
            } else {
                var buttons = this.manager.tab.children[3].children[0].children;
            }
            var build = this.getBuild(name, variant);
            for (var i in buttons) {
                var haystack = buttons[i].model.name;
                if (haystack.indexOf(build.label) !== -1) {
                    return buttons[i];
                }
            }
        }
    };
    
    // Upgrade manager
    // ============
    
    var UpgradeManager = function () {
        this.workManager = new TabManager('Workshop');
        this.sciManager = new TabManager('Science');
        this.crafts = new CraftManager();
    };
    
    UpgradeManager.prototype = {
        manager: undefined,
        crafts: undefined,
        build: function (upgrade, variant) {
            var button = this.getBuildButton(upgrade, variant);

            if (!button || !button.model.enabled) return;

            //need to simulate a click so the game updates everything properly
            button.domNode.click(upgrade);
            var label = upgrade.label;
            
            if (variant === 'workshop') {
                storeForSummary(label, 1, 'upgrade');
                activity('小猫购买了 ' + label + ' 升级', 'ks-upgrade');
            } else {
                storeForSummary(label, 1, 'research');
                activity('小猫购买了 ' + label + ' 科学', 'ks-research');
            }
        },
        getBuildButton: function (upgrade, variant) {
            if (variant === 'workshop') {
                var buttons = this.workManager.tab.buttons;
            } else if (variant === 'science') {
                var buttons = this.sciManager.tab.buttons;
            }
            for (var i in buttons) {
                var haystack = buttons[i].model.name;
                if (haystack === upgrade.label) {
                    return buttons[i];
                }
            }
        }
    };
    
    // Building manager
    // ================

    var BuildManager = function () {
        this.manager = new TabManager('Bonfire');
        this.crafts = new CraftManager();
        this.bulkManager = new BulkManager();
    };

    BuildManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, stage, amount) {
            var build = this.getBuild(name);
            var button = this.getBuildButton(name, stage);
          
            if (!button || !button.model.enabled) return;
            var amountTemp = amount;
            var label = build.meta.label ? build.meta.label : build.meta.stages[stage].label;
            amount=this.bulkManager.construct(button.model, button, amount);
            if (amount !== amountTemp) {warning(label + ' Amount ordered: '+amountTemp+' Amount Constructed: '+amount);}
            storeForSummary(label, amount, 'build');
          
            if (amount === 1) {
                activity('小猫建造了一个新的 ' + label, 'ks-build');
            } else {
                activity('小猫建造了 ' + amount + ' 个新的 ' + label, 'ks-build');
            }
        },
        getBuild: function (name) {
            return game.bld.getBuildingExt(name);
        },
        getBuildButton: function (name, stage) {
            var buttons = this.manager.tab.buttons;
            var build = this.getBuild(name);
            var label = typeof stage !== 'undefined' ? build.meta.stages[stage].label : build.meta.label;
          
            for (var i in buttons) {
                var haystack = buttons[i].model.name;
                if (haystack.indexOf(label) !== -1){
                    return buttons[i];
                }
            }
        }
    };

    // Space manager
    // ================

    var SpaceManager = function () {
        this.manager = new TabManager('Space');
        this.crafts = new CraftManager();
        this.bulkManager = new BulkManager();
    };

    SpaceManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, amount) {
            var build = this.getBuild(name);
            var button = this.getBuildButton(name);

            if (!build.unlocked || !button || !button.model.enabled || !options.auto.space.items[name].enabled) return;
            var amountTemp = amount;
            var label = build.label;
            amount=this.bulkManager.construct(button.model, button, amount);
            if (amount !== amountTemp) {
                warning(label + ' Amount ordered: '+amountTemp+' Amount Constructed: '+amount);
            }
            storeForSummary(label, amount, 'build');
          
            if (amount === 1) {
                activity('小猫建造了一个新的 ' + label, 'ks-build');
            } else {
                activity('小猫建造了 ' + amount + ' 个新的 ' + label, 'ks-build');
            }
        },
        getBuild: function (name) {
            return game.space.getBuilding(name);
        },
        getBuildButton: function (name) {
            var panels = this.manager.tab.planetPanels;

            for (var panel in panels) {
                for (var child in panels[panel].children) {
                    if (panels[panel].children[child].id === name) return panels[panel].children[child];
                }
            }
        }
    };

    // Crafting Manager
    // ================

    var CraftManager = function () {
        this.cacheManager = new CacheManager();
    };

    CraftManager.prototype = {
        craft: function (name, amount) {
            amount = Math.floor(amount);

            if (!name || 1 > amount) return;
            if (!this.canCraft(name, amount)) return;

            var craft = this.getCraft(name);
            var ratio = game.getResCraftRatio(craft);

            game.craft(craft.name, amount);

            // determine actual amount after crafting upgrades
            amount = (amount * (1 + ratio)).toFixed(2);

            storeForSummary(ucfirst(name), amount, 'craft');
            activity('小猫制作了 ' + game.getDisplayValueExt(amount) + ' ' + cnItem(ucfirst(name)), 'ks-craft');
        },
        canCraft: function (name, amount) {
            var craft = this.getCraft(name);
            var enabled = options.auto.craft.items[name].enabled;
            var result = false;

            if (craft.unlocked && enabled) {
                result = true;

                for (var i in craft.prices) {
                    var price = craft.prices[i];
                    var value = this.getValueAvailable(price.name);

                    if (value < price.val * amount) {
                        result = false;
                    }
                }
            }

            return result;
        },
        getCraft: function (name) {
            return game.workshop.getCraft(this.getName(name));
        },
        singleCraftPossible: function (name) {
            var materials = this.getMaterials(name);
            for (var mat in materials) {
                if (this.getValueAvailable(mat, true) < materials[mat]) {return false;}
            }
            return true;
        },
        getLowestCraftAmount: function (name, limited, limRat, aboveTrigger) {
            var amount = Number.MAX_VALUE;
            var plateMax = Number.MAX_VALUE;
            var materials = this.getMaterials(name);
            
            var craft = this.getCraft(name);
            var ratio = game.getResCraftRatio(craft);
            var trigger = options.auto.craft.trigger;
            //var optionVal = options.auto.options.enabled && options.auto.options.items.shipOverride.enabled;
          
            // Safeguard if materials for craft cannot be determined.
            if (!materials) return 0;
            
            if (name==='steel' && limited) {
                var plateRatio=game.getResCraftRatio(this.getCraft('plate'));
                if (this.getValueAvailable('plate')/this.getValueAvailable('steel') < ((plateRatio+1)/125)/((ratio+1)/100)) {
                    return 0;
                }
            } else if (name==='plate' && limited) {
                var steelRatio=game.getResCraftRatio(this.getCraft('steel'));
                if (game.getResourcePerTick('coal', true) > 0) {
                    if (this.getValueAvailable('plate')/this.getValueAvailable('steel') > ((ratio+1)/125)/((steelRatio+1)/100)) {
                        var ironInTime = ((this.getResource('coal').maxValue*trigger - this.getValue('coal'))/game.getResourcePerTick('coal', true))*Math.max(game.getResourcePerTick('iron', true), 0);
                        plateMax = (this.getValueAvailable('iron') - Math.max(this.getResource('coal').maxValue*trigger - ironInTime,0))/125;
                    }
                }
            }

            var res = this.getResource(name);

            for (var i in materials) {
                var delta = undefined;
                //if (!limited || (this.getResource(i).maxValue > 0 && aboveTrigger) || (name === 'ship' && optionVal && (this.getResource('ship').value < 243)) )
                if (!limited || (this.getResource(i).maxValue > 0 && aboveTrigger)) {
                    // If there is a storage limit, we can just use everything returned by getValueAvailable, since the regulation happens there
                    delta = this.getValueAvailable(i) / materials[i];
                } else {
                    // Take the currently present amount of material to craft into account
                    // Currently this determines the amount of resources that can be crafted such that base materials are proportionally distributed across limited resources.
                    // This base material distribution is governed by limRat "limited ratio" which defaults to 0.5, corresponding to half of the possible components being further crafted.
                    // If this were another value, such as 0.75, then if you had 10000 beams and 0 scaffolds, 7500 of the beams would be crafted into scaffolds.
                    delta = limRat * ((this.getValueAvailable(i, true) + (materials[i] / (1 + ratio)) * this.getValueAvailable(res.name, true)) / materials[i]) - (this.getValueAvailable(res.name, true) / (1 + ratio));
                }

                amount = Math.min(delta,amount,plateMax);
            }

            // If we have a maximum value, ensure that we don't produce more than
            // this value. This should currently only impact wood crafting, but is
            // written generically to ensure it works for any craft that produces a
            // good with a maximum value.
            if (res.maxValue > 0 && amount > (res.maxValue - res.value))
                amount = res.maxValue - res.value;

            return Math.floor(amount);
        },
        getMaterials: function (name) {
            var materials = {};
            var craft = this.getCraft(name);

            // Safeguard against craft items that aren't actually available yet.
            if (!craft) return;

            var prices = game.workshop.getCraftPrice(craft);

            for (var i in prices) {
                var price = prices[i];

                materials[price.name] = price.val;
            }

            return materials;
        },
        getTickVal: function (res, preTrade) {
            var prod = game.getResourcePerTick(res.name, true);
            if (res.craftable) {
                var minProd=Number.MAX_VALUE;
                var materials = this.getMaterials(res.name);
                for (var mat in materials) {
                    var rat = (1+game.getResCraftRatio(res.name))/materials[mat];
                    //Currently preTrade is only true for the festival stuff, so including furs from hunting is ideal.
                    var addProd = this.getTickVal(this.getResource(mat));
                    minProd = Math.min(addProd * rat, minProd);
                }
                prod += (minProd!==Number.MAX_VALUE) ? minProd : 0;
            }
            if (prod <= 0 && (res.name === 'spice' || res.name === 'blueprint')) {return 'ignore';}
            if (!preTrade) {prod += this.cacheManager.getResValue(res.name);}
            return prod;
        },
        getAverageHunt: function() {
            var output = {};
            var hunterRatio = game.getEffect('hunterRatio') + game.village.getEffectLeader('manager', 0);

            output['furs'] = 40 + 32.5 * hunterRatio;
          
            output['ivory'] = 50 * Math.min(0.225 + 0.01 * hunterRatio, 0.5) + 40 * hunterRatio * Math.min(0.225 + 0.01 * hunterRatio, 0.5);
          
            output['unicorns'] = 0.05;
          
            if (this.getValue('zebras') >= 10) {
                output['bloodstone'] = (this.getValue('bloodstone') === 0) ? 0.05 : 0.0005;
            }
          
            if (game.ironWill && game.workshop.get('goldOre').researched) {
                output['gold'] = 0.625 + 0.625 * hunterRatio;
            }
          
            return output;
        },
        getName: function (name) {
            // adjust for spelling discrepancies in core game logic
            if ('catpower' === name) name = 'manpower';
            if ('compendium' === name) name = 'compedium';
            if ('concrete' === name) name = 'concrate';

            return name;
        },
        getResource: function (name) {
            if (name === 'slabs') {name = 'slab';} //KG BETA BUGFIX
            for (var i in game.resPool.resources) {
                var res = game.resPool.resources[i];
                if (res.name === this.getName(name)) return res;
            }
            warning('无法找到资源 ' + name);
            return null;
        },
        getValue: function (name) {
            return this.getResource(name).value;
        },
        getStock: function (name) {
            var res = options.auto.resources[this.getName(name)];
            var stock = res ? res.stock : 0;

            return !stock ? 0 : stock;
        },
        getValueAvailable: function (name, all, typeTrigger) {
            var value = this.getValue(name);
            var stock = this.getStock(name);
          
            if (!typeTrigger && typeTrigger !== 0) {
                var trigger = options.auto.craft.trigger;
            }
            else {
              var trigger = typeTrigger;
            }
            
            if ('catnip' === name) {
                var pastures = (game.bld.getBuildingExt('pasture').meta.stage === 0) ? game.bld.getBuildingExt('pasture').meta.val: 0;
                var aqueducts = (game.bld.getBuildingExt('aqueduct').meta.stage === 0) ? game.bld.getBuildingExt('aqueduct').meta.val: 0;
                var resPerTick = this.getPotentialCatnip(true, pastures, aqueducts);

                if (resPerTick < 0) stock -= resPerTick * 202 * 5;
            }

            value = Math.max(value - stock, 0);

            // If we have a maxValue, and user hasn't requested all, check
            // consumption rate
            if (!all && this.getResource(name).maxValue > 0) {
                var res = options.auto.resources[name];
                var consume = res && (res.consume != undefined) ? res.consume : options.consume;

                value -= Math.min(this.getResource(name).maxValue * trigger, value) * (1 - consume);
            }

            return value;
        },
        getPotentialCatnip: function (worstWeather, pastures, aqueducts) {
            var fieldProd = game.getEffect('catnipPerTickBase');
            if (worstWeather) {
                fieldProd *= 0.1;
            } else {
                fieldProd *= game.calendar.getWeatherMod() + game.calendar.getCurSeason().modifiers['catnip'];
            }
            var vilProd = (game.village.getResProduction().catnip) ? game.village.getResProduction().catnip * (1 + game.getEffect('catnipJobRatio')) : 0;
            var baseProd = fieldProd + vilProd;
            
            var hydroponics = game.space.getBuilding('hydroponics').val;
            if (game.prestige.meta[0].meta[21].researched) {
                if (game.calendar.cycle === 2) {hydroponics *= 2;}
                if (game.calendar.cycle === 7) {hydroponics *= 0.5;}
            }
            baseProd *= 1 + 0.03 * aqueducts + 0.025 * hydroponics;
          
            var paragonBonus = (game.challenges.currentChallenge == "winterIsComing") ? 0 : game.prestige.getParagonProductionRatio();
            baseProd *= 1 + paragonBonus;
          
            baseProd *= 1 + game.religion.getProductionBonus()/100;
          
            if (!game.opts.disableCMBR) {baseProd *= (1 + game.getCMBRBonus());}
          
            baseProd = game.calendar.cycleEffectsFestival({catnip: baseProd})['catnip'];
          
            var baseDemand = game.village.getResConsumption()['catnip'];
            var uniPastures = game.bld.getBuildingExt('unicornPasture').meta.val;
            baseDemand *= 1 + (game.getHyperbolicEffect(pastures * -0.005 + uniPastures * -0.0015, 1.0));
            if (game.village.sim.kittens.length > 0 && game.village.happiness > 1) {
                var happyCon = game.village.happiness - 1;
                if (game.challenges.currentChallenge == "anarchy") {
                    baseDemand *= 1 + happyCon * (1 + game.getEffect("catnipDemandWorkerRatioGlobal"));
                } else {
                    baseDemand *= 1 + happyCon * (1 + game.getEffect("catnipDemandWorkerRatioGlobal")) * (1 - game.village.getFreeKittens() / game.village.sim.kittens.length);
                }
            }
            baseProd += baseDemand;
            
            baseProd += game.getResourcePerTickConvertion('catnip');
          
            //Might need to eventually factor in time acceleration using game.timeAccelerationRatio().
            return baseProd;
        }
    };
  
    // Bulk Manager
    // ============
    
    var BulkManager = function () {
        this.craftManager = new CraftManager();
    };
    
    BulkManager.prototype = {
        craftManager: undefined,
        bulk: function (builds, metaData, trigger, source) {
            var bList = [];
            var countList = [];
            var counter = 0;
            for (var name in builds) {
                var build = builds[name];
                var data = metaData[name];
                if (!build.enabled) {continue;}
                if (data.tHidden === true) {continue;}
                if (data.rHidden === true) {continue;}
                if ((data.rHidden === undefined) && !data.unlocked) {continue;}
                if (name === 'cryochambers' && (game.time.getVSU('usedCryochambers').val > 0 
                    || game.bld.getBuildingExt('chronosphere').meta.val <= data.val)) {continue;}
                if (name === 'ressourceRetrieval' && data.val >= 100) {continue;}
                var prices = (data.stages) ? data.stages[data.stage].prices : data.prices;
                var priceRatio = this.getPriceRatio(data, source);
                if (!this.singleBuildPossible(data, prices, priceRatio, source)) {continue;}
                var require = !build.require ? false : this.craftManager.getResource(build.require);
                if (!require || trigger <= require.value / require.maxValue) {
                    if (typeof(build.stage) !== 'undefined' && build.stage !== data.stage) { 
                        continue;
                    }
                    bList.push(new Object());
                    bList[counter].id = name;
                    bList[counter].label = build.label;
                    bList[counter].name = build.name;
                    bList[counter].stage = build.stage;
                    bList[counter].variant = build.variant;
                    countList.push(new Object());
                    countList[counter].id = name;
                    countList[counter].name = build.name;
                    countList[counter].count = 0;
                    countList[counter].spot = counter;
                    countList[counter].prices = prices;
                    countList[counter].priceRatio = priceRatio;
                    countList[counter].source = source;
                    countList[counter].ISLAND = build.variant;
                    counter++;
                }
            }
          
            if (countList.length === 0) {return;}
          
            var tempPool = new Object();
            for (var res in game.resPool.resources) {
                tempPool[game.resPool.resources[res].name]=game.resPool.resources[res].value;
            }
            for (var res in tempPool) {tempPool[res] = this.craftManager.getValueAvailable(res, true);}
          
            var k = 0;
            while (countList.length !== 0) {
                bulkLoop:
                for (var j = 0; j < countList.length; j++) {
                    var nowNum;
                    var goalNum;
                    switch (countList[j].source) {
                        case 'bonfire':
                            nowNum = game.bld.get(countList[j].name || countList[j].id).val;
                            goalNum = options.auto.build.items[countList[j].id].limited;
                            break;
                        case 'space':
                            nowNum = game.space.getBuilding(countList[j].id).val;
                            goalNum = options.auto.space.items[countList[j].id].limited;
                            break;
                        case 'faith':
                            switch (countList[j].ISLAND) {
                                case 'z':
                                    nowNum = game.religion.getZU(countList[j].id).val;
                                    break;
                                case 's':
                                    nowNum = game.religion.getRU(countList[j].id).val;
                                    break;
                                case 'c':
                                    nowNum = game.religion.getTU(countList[j].id).val;
                                    break;
                            }
                            goalNum = options.auto.faith.items[countList[j].id].limited;
                            break;
                        case 'time':
                            if (countList[j].ISLAND == 'chrono') {
                                nowNum = game.time.getCFU(countList[j].id).val;
                            }
                            else {
                                nowNum = game.time.getVSU(countList[j].id).val;
                            }
                            goalNum = options.auto.time.items[countList[j].id].limited;
                            break;
                    }
                    if (nowNum + countList[j].count >= goalNum) {
                        bList[countList[j].spot].count = countList[j].count;
                        countList.splice(j, 1);
                        j--;
                        continue bulkLoop;
                    }
                    var build = countList[j];
                    var data = metaData[build.id];
                    var prices = build.prices;
                    var priceRatio = build.priceRatio;
                    var source = build.source;
                    for (var p = 0; p < prices.length; p++) {
                      
                        var spaceOil = false;
                        var cryoKarma = false;
                        if (source && source === 'space' && prices[p].name === 'oil') {
                            spaceOil = true;
                            var oilPrice = prices[p].val * (1 - game.getHyperbolicEffect(game.getEffect('oilReductionRatio'), 0.75));
                        } else if (build.id === 'cryochambers' && prices[p].name === 'karma') {
                            cryoKarma = true;
                            var karmaPrice = prices[p].val * (1 - game.getHyperbolicEffect(0.01 * game.prestige.getBurnedParagonRatio(), 1.0));
                        }
                      
                        if (spaceOil) {
                            var nextPriceCheck = (tempPool['oil'] < oilPrice * Math.pow(1.05, k + data.val));
                        } else if (cryoKarma) {
                            var nextPriceCheck = (tempPool['karma'] < karmaPrice * Math.pow(priceRatio, k + data.val));
                        } else {
                            var nextPriceCheck = (tempPool[prices[p].name] < prices[p].val * Math.pow(priceRatio, k + data.val));
                        }
                        if (nextPriceCheck || (data.noStackable && (k + data.val)>=1) || (build.id === 'ressourceRetrieval' && k + data.val >= 100)
                          || (build.id === 'cryochambers' && game.bld.getBuildingExt('chronosphere').meta.val <= k + data.val)) {
                            for (var p2 = 0; p2 < p; p2++) {
                                if (source && source === 'space' && prices[p2].name === 'oil') {
                                    var oilPriceRefund = prices[p2].val * (1 - game.getHyperbolicEffect(game.getEffect('oilReductionRatio'), 0.75));
                                    tempPool['oil'] += oilPriceRefund * Math.pow(1.05, k + data.val);
                                } else if (build.id === 'cryochambers' && prices[p2].name === 'karma') {
                                    var karmaPriceRefund = prices[p2].val * (1 - game.getHyperbolicEffect(0.01 * game.prestige.getBurnedParagonRatio(), 1.0));
                                    tempPool['karma'] += karmaPriceRefund * Math.pow(priceRatio, k + data.val);
                                } else {
                                    var refundVal = prices[p2].val * Math.pow(priceRatio, k + data.val);
                                    tempPool[prices[p2].name] += (prices[p2].name === 'void') ? Math.ceil(refundVal) : refundVal;
                                }
                            }
                            bList[countList[j].spot].count = countList[j].count;
                            countList.splice(j, 1);
                            j--;
                            continue bulkLoop;
                        }
                        if (spaceOil) {
                            tempPool['oil'] -= oilPrice * Math.pow(1.05, k + data.val);
                        } else if (cryoKarma) {
                            tempPool['karma'] -= karmaPrice * Math.pow(priceRatio, k + data.val);
                        } else {
                            var pVal = prices[p].val * Math.pow(priceRatio, k + data.val);
                            tempPool[prices[p].name] -= (prices[p].name === 'void') ? Math.ceil(pVal) : pVal;
                        }
                    }
                    countList[j].count++;
                }
                k++;
            }
            return bList;
        },
        construct: function (model, button, amount) {
            var meta = model.metadata;
            var counter = 0;
            if (typeof meta.limitBuild == "number" && meta.limitBuild - meta.val < amount) {
                amount = meta.limitBuild - meta.val;
            }
            if (model.enabled && button.controller.hasResources(model) || game.devMode ) {
                while (button.controller.hasResources(model) && amount > 0) {
                    model.prices=button.controller.getPrices(model);
                    button.controller.payPrice(model);
                    button.controller.incrementValue(model);
                    counter++;
                    amount--;
                }
                if (meta.breakIronWill) {game.ironWill = false;}
                if (meta.unlocks) {game.unlock(meta.unlocks);}
                if (meta.upgrades) {game.upgrade(meta.upgrades);}
            }
            return counter;
        },
        getPriceRatio: function (data, source) {
            var ratio = (!data.stages) ? data.priceRatio : (data.priceRatio || data.stages[data.stage].priceRatio);

            var ratioDiff = 0;
            if (source && source === 'bonfire') {
                ratioDiff = game.getEffect(data.name + "PriceRatio") +
                    game.getEffect("priceRatio") +
                    game.getEffect("mapPriceReduction");

                ratioDiff = game.getHyperbolicEffect(ratioDiff, ratio - 1);
            }
            return ratio + ratioDiff;
        },
        singleBuildPossible: function (data, prices, priceRatio, source) {
            for (var price in prices) {
                if (source && source === 'space' && prices[price].name === 'oil') {
                    var oilPrice = prices[price].val * (1 - game.getHyperbolicEffect(game.getEffect('oilReductionRatio'), 0.75));
                    if (this.craftManager.getValueAvailable('oil', true) < oilPrice * Math.pow(1.05, data.val)) {return false;}
                } else if (data.name === 'cryochambers' && prices[price].name === 'karma') {
                    var karmaPrice = prices[price].val * (1 - game.getHyperbolicEffect(0.01 * game.prestige.getBurnedParagonRatio(), 1.0));
                    if (this.craftManager.getValueAvailable('karma', true) < karmaPrice * Math.pow(priceRatio, data.val)) {return false;}
                } else {
                    if (this.craftManager.getValueAvailable(prices[price].name, true) < prices[price].val * Math.pow(priceRatio, data.val)) {return false;}
                }
            }
            return true;
        }
    };

    // Trading Manager
    // ===============

    var TradeManager = function () {
        this.craftManager = new CraftManager();
        this.manager = new TabManager('Trade');
    };

    TradeManager.prototype = {
        craftManager: undefined,
        manager: undefined,
        trade: function (name, amount) {

            if (!name || 1 > amount) {warning('KS trade checks are not functioning properly, please create an issue on the github page.');}

            var race = this.getRace(name);

            var button = this.getTradeButton(race.name);

            if (!button.model.enabled || !options.auto.trade.items[name].enabled) {warning('KS trade checks are not functioning properly, please create an issue on the github page.');}

            game.diplomacy.tradeMultiple(race, amount);
            storeForSummary(race.title, amount, 'trade');
            activity('小猫和 ' + cnItem(ucfirst(name)) + ' 交易了 ' + amount + ' 次', 'ks-trade');
        },
        getProfitability: function (name) {
            var race = this.getRace(name);
          
            var materials = this.getMaterials(name);
            var cost = 0;
            for (var mat in materials) {
                var tick = this.craftManager.getTickVal(this.craftManager.getResource(mat));
                if (tick <= 0) {return false;}
                cost += materials[mat]/tick;
            }
          
            var output = this.getAverageTrade(race);
            var profit = 0;
            for (var prod in output) {
                var res = this.craftManager.getResource(prod);
                var tick = this.craftManager.getTickVal(res);
                if (tick === 'ignore') {continue;}
                if (tick <= 0) {return true;}
                profit += (res.maxValue > 0) ? Math.min(output[prod], Math.max(res.maxValue - res.value, 0))/tick : output[prod]/tick;
            }
            return (cost <= profit);
        },
        getAverageTrade: function (race) {
            var standRat = game.getEffect("standingRatio");
            standRat += (game.prestige.getPerk("diplomacy").researched) ? 10 : 0;
            var rRatio = (race.name === "leviathans") ? (1 + 0.02 * race.energy) : 1;
            var tRatio = 1 + game.diplomacy.getTradeRatio();
            var successRat = (race.attitude === "hostile") ? Math.min(race.standing + standRat/100, 1) : 1;
            var bonusRat = (race.attitude === "friendly") ? Math.min(race.standing + standRat/200, 1) : 0;
            var output = {};
            for (var s in race.sells) {
                var item = race.sells[s];
                if (!this.isValidTrade(item, race)) {continue;}
                var resource = this.craftManager.getResource(item.name);
                var mean = 0;
                var tradeChance = (race.embassyPrices) ? item.chance * (1 + game.getHyperbolicEffect(0.01 * race.embassyLevel, 0.75)) : item.chance;
                if (race.name == "zebras" && item.name == "titanium") {
                    var shipCount = game.resPool.get("ship").value;
                    var titanProb = Math.min(0.15 + shipCount * 0.0035, 1);
                    var titanRat = 1 + shipCount / 50;
                    mean = 1.5 * titanRat * (successRat * titanProb); 
                } else {
                    var sRatio = (!item.seasons) ? 1 : item.seasons[game.calendar.getCurSeason().name];
                    var normBought = (successRat - bonusRat) * Math.min(tradeChance/100, 1);
                    var normBonus = bonusRat * Math.min(tradeChance/100, 1);
                    mean = (normBought + 1.25 * normBonus) * item.value * rRatio * sRatio * tRatio;
                }
                output[item.name] = mean;
            }
          
            var spiceChance = (race.embassyPrices) ? 0.35 * (1 + 0.01 * race.embassyLevel) : 0.35;
            var spiceTradeAmount = successRat * Math.min(spiceChance, 1);
            output['spice'] = 25 * spiceTradeAmount + 50 * spiceTradeAmount * tRatio / 2;
          
            output['blueprint'] = 0.1 * successRat;
          
            return output;
        },
        isValidTrade: function (item, race) {
            return (!(item.minLevel && race.embassyLevel < item.minLevel) && (game.resPool.get(item.name).unlocked || item.name === 'titanium' || item.name === 'uranium' || race.name === 'leviathans'));
        },
        getLowestTradeAmount: function (name, limited, trigConditions) {
            var amount = undefined;
            var highestCapacity = undefined;
            var materials = this.getMaterials(name);
            var race = this.getRace(name);

            for (var i in materials) {
                if (i === "catpower") {
                    var total = this.craftManager.getValueAvailable(i, true) / materials[i];
                } else {
                    var total = this.craftManager.getValueAvailable(i, limited, options.auto.trade.trigger) / materials[i];
                }

                amount = (amount === undefined || total < amount) ? total : amount;
            }
          
            amount = Math.floor(amount);
          
            if (amount === 0) {return 0;}

            if (race === null || options.auto.trade.items[name].allowcapped) return amount;

            // Loop through the items obtained by the race, and determine
            // which good has the most space left. Once we've determined this,
            // reduce the amount by this capacity. This ensures that we continue to trade
            // as long as at least one resource has capacity, and we never over-trade.
            
            var tradeOutput = this.getAverageTrade(race);
            for (var s in race.sells) {
                var item = race.sells[s];
                var resource = this.craftManager.getResource(item.name);
                var max = 0;

                // No need to process resources that don't cap
                if (!resource.maxValue) continue;

                max = tradeOutput[item.name];

                var capacity = Math.max((resource.maxValue - resource.value) / max, 0);

                highestCapacity = (capacity < highestCapacity) ? highestCapacity : capacity;
            }

            // We must take the ceiling of capacity so that we will trade as long
            // as there is any room, even if it doesn't have exact space. Otherwise
            // we seem to starve trading altogether.
            highestCapacity = Math.ceil(highestCapacity);
          
            if (highestCapacity === 0) {return 0;}

            // Now that we know the most we *should* trade for, check to ensure that
            // we trade for our max cost, or our max capacity, whichever is lower.
            // This helps us prevent trading for resources we can't store. Note that we
            // essentially ignore blueprints here. In addition, if highestCapacity was never set,
            // then we just
          
            amount = (highestCapacity < amount) ? Math.max(highestCapacity - 1, 1) : amount;
            
            return Math.floor(amount);
        },
        getMaterials: function (name) {
            var materials = {catpower: 50, gold: 15};

            if (name === undefined)
                return materials;

            var prices = this.getRace(name).buys;

            for (var i in prices) {
                var price = prices[i];

                materials[price.name] = price.val;
            }

            return materials;
        },
        getRace: function (name) {
            if (name === undefined)
                return null;
            else
                return game.diplomacy.get(name);
        },
        getTradeButton: function (race) {
            for (var i in this.manager.tab.racePanels) {
                var panel = this.manager.tab.racePanels[i];

                if (panel.race.name === race) return panel.tradeBtn;
            }
        },
        singleTradePossible: function (name) {
            var materials = this.getMaterials(name);
            for (var mat in materials) {
                if (this.craftManager.getValueAvailable(mat, true) < materials[mat]) {return false;}
            }
            return true;
        }
    };
  
    // Cache Manager
    // ===============

    var CacheManager = function () {};

    CacheManager.prototype = {
        pushToCache: function (data) {
            var cache = options.auto.cache.cache;
            var cacheSum = options.auto.cache.cacheSum;
            var materials = data['materials'];
            var currentTick = game.timer.ticksTotal;

            cache.push(data);
            for (var mat in materials) {
                if (!cacheSum[mat]) {cacheSum[mat] = 0;}
                cacheSum[mat] += materials[mat];
            }
          
            for (var i = 0; i < cache.length; i++) {
                var oldData = cache[i];
                if (cache.length > 10000) {
                    var oldMaterials = oldData['materials'];
                    for (var mat in oldMaterials) {
                        if (!cacheSum[mat]) {cacheSum[mat] = 0;}
                        cacheSum[mat] -= oldMaterials[mat];
                    }
                    cache.shift();
                    i--;
                } else {
                    return;
                }
            }
        },
        getResValue: function (res) {
            var cache = options.auto.cache.cache;
            if (cache.length === 0) {return 0;}
            var cacheSum = options.auto.cache.cacheSum;
            if (!cacheSum[res]) {return 0;}
            var currentTick = game.timer.ticksTotal;
            var startingTick = cache[0].timeStamp;

            return (cacheSum[res] / (currentTick - startingTick));
        }
    };

    // ==============================
    // Configure overall page display
    // ==============================

    var right = $('#rightColumn');

    var addRule = function (rule) {
        var sheets = document.styleSheets;
        sheets[0].insertRule(rule, 0);
    };

    var defaultSelector = 'body[data-ks-style]:not(.scheme_sleek)';

    addRule(defaultSelector + ' #game {'
        + 'font-family: monospace;'
        + 'font-size: 12px;'
        + 'min-width: 1300px;'
        + 'top: 32px;'
        + '}');

    addRule(defaultSelector + ' {'
        + 'font-family: monospace;'
        + 'font-size: 12px;'
        + '}');

    addRule(defaultSelector + ' .column {'
        + 'min-height: inherit;'
        + 'max-width: inherit !important;'
        + 'padding: 1%;'
        + 'margin: 0;'
        + 'overflow-y: auto;'
        + '}');

    addRule(defaultSelector + ' #leftColumn {'
        + 'height: 92%;'
        + 'width: 26%;'
        + '}');

    addRule(defaultSelector + ' #midColumn {'
        + 'margin-top: 1% !important;'
        + 'height: 90%;'
        + 'width: 48%;'
        + '}');

    addRule(defaultSelector + ' #rightColumn {'
        + 'overflow-y: scroll;'
        + 'height: 92%;'
        + 'width: 19%;'
        + '}');

    addRule(defaultSelector + ' #gameLog .msg {'
        + 'display: block;'
        + '}');

    addRule(defaultSelector + ' #gameLog {'
        + 'overflow-y: hidden !important;'
        + 'width: 100% !important;'
        + 'padding-top: 5px !important;'
        + '}');

    addRule(defaultSelector + ' #resContainer .maxRes {'
        + 'color: #676766;'
        + '}');

    addRule(defaultSelector + ' #game .btn {'
        + 'border-radius: 0px;'
        + 'font-family: monospace;'
        + 'font-size: 12px !important;'
        + 'margin: 0 5px 7px 0;'
        + 'width: 290px;'
        + '}');

    addRule(defaultSelector + ' #game .map-viewport {'
        + 'height: 340px;'
        + 'max-width: 500px;'
        + 'overflow: visible;'
        + '}');

    addRule(' #game .map-dashboard {'
        + 'height: 120px;'
        + 'width: 292px;'
        + '}');

    addRule('#ks-options ul {'
        + 'list-style: none;'
        + 'margin: 0 0 5px;'
        + 'padding: 0;'
        + '}');

    addRule('#ks-options ul:after {'
        + 'clear: both;'
        + 'content: " ";'
        + 'display: block;'
        + 'height: 0;'
        + '}');

    addRule('#ks-options ul li {'
        + 'display: block;'
        + 'float: left;'
        + 'width: 100%;'
        + '}');

    addRule('#ks-options #toggle-list-resources .stockWarn {'
        + 'color: ' + options.stockwarncolor + ';'
        + '}');

    document.body.setAttribute("data-ks-style", "");

    // Local Storage
    // =============

    var kittenStorageVersion = 1;

    var kittenStorage = {
        version: kittenStorageVersion,
        toggles: {},
        items: {},
        resources: {},
        triggers: {}
    };

    var initializeKittenStorage = function () {
        $("#items-list-build, #items-list-craft, #items-list-trade").find("input[id^='toggle-']").each(function () {
            kittenStorage.items[$(this).attr("id")] = $(this).prop("checked");
        });

        saveToKittenStorage();
    };

    var saveToKittenStorage = function () {
        kittenStorage.toggles = {
            build: options.auto.build.enabled,
            space: options.auto.space.enabled,
            craft: options.auto.craft.enabled,
            upgrade: options.auto.upgrade.enabled,
            trade: options.auto.trade.enabled,
            faith: options.auto.faith.enabled,
            time: options.auto.time.enabled,
            options: options.auto.options.enabled,
            filter: options.auto.filter.enabled,
            autotime: options.auto.autotime.enabled
        };
        kittenStorage.resources = options.auto.resources;
        kittenStorage.triggers = {
            faith: options.auto.faith.trigger,
            time: options.auto.time.trigger,
            build: options.auto.build.trigger,
            space: options.auto.space.trigger,
            craft: options.auto.craft.trigger,
            trade: options.auto.trade.trigger,
            autotime: options.auto.autotime.trigger
        };
        localStorage['cbc.kitten-scientists'] = JSON.stringify(kittenStorage);
    };

    var loadFromKittenStorage = function () {
        var saved = JSON.parse(localStorage['cbc.kitten-scientists'] || 'null');
        if (saved && saved.version == kittenStorageVersion) {
            kittenStorage = saved;

            if (saved.toggles) {
                for (var toggle in saved.toggles) {
                    if (toggle !== 'engine' && options.auto[toggle]) {
                        options.auto[toggle].enabled = !!saved.toggles[toggle];
                        var el = $('#toggle-' + toggle);
                        el.prop('checked', options.auto[toggle].enabled);
                    }
                }
            }

            for (var item in kittenStorage.items) {
                var value = kittenStorage.items[item];
                var el = $('#' + item);
                var option = el.data('option');
                var name = item.split('-');
              
                if (option === undefined) {
                    delete kittenStorage.items[item];
                    continue;
                }
                
                if (name[0] == 'set') {
                    el[0].title = value;
                } else {
                    el.prop('checked', value);
                }

                if (name.length == 2) {
                    option.enabled = value;
                } else {
                    if (name[1] == 'limited') {
                        option.limited = value;
                        el[0].title = value;
                    } else {
                        option[name[2]] = value;
                    }
                }
            }

            var list = $("#toggle-list-resources");
            for (var resource in kittenStorage.resources) {
                var res = kittenStorage.resources[resource];

                if ($('#resource-' + resource).length === 0) {
                    list.append(addNewResourceOption(resource));
                }
                if ('stock' in res) {
                    setStockValue(resource, res.stock);
                }
                if ('consume' in res) {
                    setConsumeRate(resource, res.consume);
                }
            }

            if (saved.triggers) {
                options.auto.faith.trigger = saved.triggers.faith;
                options.auto.time.trigger = saved.triggers.time;
                options.auto.build.trigger = saved.triggers.build;
                options.auto.space.trigger = saved.triggers.space;
                options.auto.craft.trigger = saved.triggers.craft;
                options.auto.trade.trigger = saved.triggers.trade;
                options.auto.autotime.trigger = saved.triggers.autotime;

                $('#trigger-faith')[0].title = options.auto.faith.trigger;
                $('#trigger-time')[0].title = options.auto.time.trigger;
                $('#trigger-build')[0].title = options.auto.build.trigger;
                $('#trigger-space')[0].title = options.auto.space.trigger;
                $('#trigger-craft')[0].title = options.auto.craft.trigger;
                $('#trigger-trade')[0].title = options.auto.trade.trigger;
                $('#trigger-autotime')[0].title = options.auto.autotime.trigger;
            }

        } else {
            initializeKittenStorage();
        }
    };

    // Add options element
    // ===================

    var ucfirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var roundToTwo = function (n) {
        return +(Math.round(n + "e+2") + "e-2")
    };

    var setStockWarning = function(name, value) {
        // simplest way to ensure it doesn't stick around too often; always do
        // a remove first then re-add only if needed
        $("#resource-" + name).removeClass("stockWarn");

        var maxValue = game.resPool.resources.filter(i => i.name == name)[0].maxValue;
        if (value > maxValue && !(maxValue === 0)) $("#resource-" + name).addClass("stockWarn");
    }

    var setStockValue = function (name, value) {
        var n = Number(value);

        if (isNaN(n) || n < 0) {
            warning('忽略无效的库存值 ' + value);
            return;
        }

        if (!options.auto.resources[name]) options.auto.resources[name] = {};
        options.auto.resources[name].stock = n;
        $('#stock-value-' + name).text('库存： ' + game.getDisplayValueExt(n));

        setStockWarning(name, n);
    };

    var setConsumeRate = function (name, value) {
        var n = parseFloat(value);

        if (isNaN(n) || n < 0.0 || n > 1.0) {
            warning('忽略无效的消耗率 ' + value);
            return;
        }

        if (!options.auto.resources[name]) options.auto.resources[name] = {};
        options.auto.resources[name].consume = n;
        $('#consume-rate-' + name).text('消耗率： ' + n.toFixed(2));
    };

    var removeResourceControl = function (name) {
        delete options.auto.resources[name];
    };

    var addNewResourceOption = function (name, title) {
        var res = options.auto.resources[name];
        var stock = res && (res.stock != undefined) ? res.stock : 0;
        var consume = res && (res.consume != undefined) ? res.consume : options.consume;

        var container = $('<div/>', {
            id: 'resource-' + name,
            css: {display: 'inline-block', width: '100%'},
        });

        var label = $('<div/>', {
            id: 'resource-label-' + name,
            text: cnItem(ucfirst(name)),
            css: {display: 'inline-block', width: '95px'},
        });

        var stock = $('<div/>', {
            id: 'stock-value-' + name,
            text: '库存： ' + game.getDisplayValueExt(stock),
            css: {cursor: 'pointer', display: 'inline-block', width: '80px'},
        });

        var consume = $('<div/>', {
            id: 'consume-rate-' + name,
            text: '消耗率： ' + consume.toFixed(2),
            css: {cursor: 'pointer', display: 'inline-block'},
        });

        var del = $('<div/>', {
            id: 'resource-delete-' + name,
            text: '删除',
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray'},
        });

        container.append(label, stock, consume, del);

        // once created, set color if relevant
        if (res != undefined && res.stock != undefined) setStockWarning(name, res.stock);

        stock.on('click', function () {
            var value = window.prompt('库存 ' + cnItem(ucfirst(name)));
            if (value !== null) {
                setStockValue(name, value);
                saveToKittenStorage();
            }
        });

        consume.on('click', function () {
            var value = window.prompt('消耗率 ' + cnItem(ucfirst(name)));
            if (value !== null) {
                setConsumeRate(name, value);
                saveToKittenStorage();
            }
        });

        del.on('click', function () {
            if (window.confirm('确定取消自动转换 ' + cnItem(ucfirst(name)) + ' ？')) {
                container.remove();
                removeResourceControl(name);
                saveToKittenStorage();
            }
        });

        return container;
    };

    var getAvailableResourceOptions = function () {
        var items = [];

        for (var i in game.resPool.resources) {
            var res = game.resPool.resources[i];

            // Show only new resources that we don't have in the list and that are
            // visible. This helps cut down on total size.
            if (res.name && $('#resource-' + res.name).length === 0) {
                var item = $('<div/>', {
                    id: 'resource-add-' + res.name,
                    text: cnItem(ucfirst(res.name)),
                    css: {cursor: 'pointer',
                        textShadow: '3px 3px 4px gray'},
                });

                // Wrapper function needed to make closure work
                (function (res, item) {
                    item.on('click', function () {
                        item.remove();
                        if (!options.auto.resources[res.name]) options.auto.resources[res.name] = {};
                        options.auto.resources[res.name].stock = 0;
                        options.auto.resources[res.name].consume = options.consume;
                        $('#toggle-list-resources').append(addNewResourceOption(res.name, res.title));
                    });
                })(res, item);

                items.push(item);
            }
        }

        return items;
    };

    var getResourceOptions = function () {
        var list = $('<ul/>', {
            id: 'toggle-list-resources',
            css: {display: 'none', paddingLeft: '20px'}
        });

        var add = $('<div/>', {
            id: 'resources-add',
            text: '添加资源',
            css: {cursor: 'pointer',
                display: 'inline-block',
                textShadow: '3px 3px 4px gray',
                borderBottom: '1px solid rgba(185, 185, 185, 0.7)' },
        });

        var clearunused = $('<div/>', {
            id: 'resources-clear-unused',
            text: '清除未使用项',
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray' },
        });

        clearunused.on('click', function () {
            for (var name in options.auto.resources) {
                // Only delete resources with unmodified values. Require manual
                // removal of resources with non-standard values.
                if (!options.auto.resources[name].stock &&
                    options.auto.resources[name].consume == options.consume ||
                    options.auto.resources[name].consume == undefined) {
                    $('#resource-' + name).remove();
                }
            }
        });

        var allresources = $('<ul/>', {
            id: 'available-resources-list',
            css: {display: 'none', paddingLeft: '20px'}
        });

        add.on('click', function () {
            allresources.toggle();
            allresources.empty();
            allresources.append(getAvailableResourceOptions());
        });

        list.append(add, clearunused, allresources);

        // Add all the current resources
        for (var name in options.auto.resources) {
            list.append(addNewResourceOption(name));
        }

        return list;
    };

    var getToggle = function (toggleName, text) {
        var auto = options.auto[toggleName];
        var element = $('<li/>', {id: 'ks-' + toggleName});

        var label = $('<label/>', {
            'for': 'toggle-' + toggleName,
            text: text
        });

        var input = $('<input/>', {
            id: 'toggle-' + toggleName,
            type: 'checkbox'
        });

        if (auto.enabled) {
            input.prop('checked', true);
        }

        // engine needs a custom toggle
        if (toggleName !== 'engine') {
            input.on('change', function () {
                if (input.is(':checked') && auto.enabled == false) {
                    auto.enabled = true;
                    if (toggleName === 'filter' || toggleName === 'options') {
                        message('启用 ' + cnItem(ucfirst(text)));
                    } else {
                        message('启用自动化 ' + cnItem(ucfirst(text)));
                    }
                    saveToKittenStorage();
                } else if ((!input.is(':checked')) && auto.enabled == true) {
                    auto.enabled = false;
                    if (toggleName === 'filter' || toggleName === 'options') {
                        message('禁用 ' + cnItem(ucfirst(text)));
                    } else {
                        message('禁用自动化 ' + cnItem(ucfirst(text)));
                    }
                    saveToKittenStorage();
                }
            });
        }

        element.append(input, label);

        if (auto.items) {
            // Add a border on the element
            element.css('borderBottom', '1px  solid rgba(185, 185, 185, 0.7)');

            var toggle = $('<div/>', {
                css: {display: 'inline-block', float: 'right'}
            });

            var button = $('<div/>', {
                id: 'toggle-items-' + toggleName,
                text: '项目',
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            });
          
            element.append(button);

            var list = $('<ul/>', {
                id: 'items-list-' + toggleName,
                css: {display: 'none', paddingLeft: '20px'}
            });

            var disableall = $('<div/>', {
                id: 'toggle-all-items-' + toggleName,
                text: '全部禁用',
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    textShadow: '3px 3px 4px gray',
                    marginRight: '8px'}
            });

            disableall.on('click', function () {
                // can't use find as we only want one layer of checkboxes
                var items = list.children().children(':checkbox');
                items.prop('checked', false);
                items.change();
                list.children().children(':checkbox').change();
            });

            list.append(disableall);

            var enableall = $('<div/>', {
                id: 'toggle-all-items-' + toggleName,
                text: '全部启用',
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    textShadow: '3px 3px 4px gray'}
            });

            enableall.on('click', function () {
                // can't use find as we only want one layer of checkboxes
                var items = list.children().children(':checkbox');
                items.prop('checked', true);
                items.change();
                list.children().children(':checkbox').change();
            });

            list.append(enableall);

            // fill out list with toggle items
            for (var itemName in auto.items) {
                switch (toggleName) {
                    case 'faith':
                        list.append(getlimitedOption(itemName, auto.items[itemName]));
                        break;
                    case 'build':
                        list.append(getlimitedOption(itemName, auto.items[itemName]));
                        break;
                    case 'space':
                        list.append(getlimitedOption(itemName, auto.items[itemName]));
                        break;
                    case 'time':
                        list.append(getlimitedOption(itemName, auto.items[itemName]));
                        break;
                    case 'trade':
                        list.append(getTradeOption(itemName, auto.items[itemName]));
                        break;
                    case 'craft':
                        list.append(getCraftOption(itemName, auto.items[itemName]));
                        break;
                    case 'options':
                        list.append(getOptionsOption(itemName, auto.items[itemName]));
                        break;
                    default:
                        list.append(getOption(itemName, auto.items[itemName]));
                }
            }

            button.on('click', function () {
                list.toggle();
            });

            // Add resource controls for crafting, sort of a hack
            if (toggleName === 'craft') {
                var resources = $('<div/>', {
                    id: 'toggle-resource-controls',
                    text: '资源',
                    css: {cursor: 'pointer',
                        display: 'inline-block',
                        float: 'right',
                        paddingRight: '5px',
                        textShadow: '3px 3px 4px gray'},
                });

                var resourcesList = getResourceOptions();

                // When we click the items button, make sure we clear resources
                button.on('click', function () {
                    resourcesList.toggle(false);
                });

                resources.on('click', function () {
                    list.toggle(false);
                    resourcesList.toggle();
                });

                element.append(resources);
            }

        }
      
        if (auto.trigger !== undefined) {
            var triggerButton = $('<div/>', {
                id: 'trigger-' + toggleName,
                text: '触发条件',
                title: auto.trigger,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            });

            triggerButton.on('click', function () {
                var value;
                if (text == '自动燃烧水晶') {value = window.prompt('季节(百位)取值范围：1到4之间，5到9为关闭。\n' + '周期年份(十位)取值范围：0到4之间，5到9为关闭。\n' + '周期(个位)取值范围：0到9之间，5为红月。\n' + '\n栗子：挂5年995，1年915，1季215，无限烧195或905（季节或周期年份有1个满足条件就烧）', auto.trigger);}
                else {value = window.prompt('输入新的触发值 ' + text + '。 取值范围为 0 到 1 之间的小数。', auto.trigger);}

                if (value !== null) {
                    auto.trigger = parseFloat(value);
                    saveToKittenStorage();
                    triggerButton[0].title = auto.trigger;
                }
            });

            element.append(triggerButton);
        }
      
        if (toggleName === 'craft') {element.append(resourcesList);}
      
        if (auto.items) {element.append(toggle, list);}

        return element;
    };

    var getTradeOption = function (name, option) {
        var element = getOption(name, option);
        element.css('borderBottom', '1px solid rgba(185, 185, 185, 0.7)');

        //Limited Trading
        var label = $('<label/>', {
            'for': 'toggle-limited-' + name,
            text: '限制'
        });

        var input = $('<input/>', {
            id: 'toggle-limited-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.limited) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.limited == false) {
                option.limited = true;
                message('与 ' + cnItem(ucfirst(name)) + ' 的交易限制为比产量更优时才会触发');
            } else if ((!input.is(':checked')) && option.limited == true) {
                option.limited = false;
                message('取消与 ' + cnItem(ucfirst(name)) + ' 交易的限制');
            }
            kittenStorage.items[input.attr('id')] = option.limited;
            saveToKittenStorage();
        });

        element.append(input, label);
        //Limited Trading End
        
        var button = $('<div/>', {
            id: 'toggle-seasons-' + name,
            text: '季节',
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray'},
        });

        var list = $('<ul/>', {
            id: 'seasons-list-' + name,
            css: {display: 'none', paddingLeft: '20px'}
        });

        // fill out the list with seasons
        list.append(getSeason(name, 'spring', option));
        list.append(getSeason(name, 'summer', option));
        list.append(getSeason(name, 'autumn', option));
        list.append(getSeason(name, 'winter', option));

        button.on('click', function () {
            list.toggle();
        });

        element.append(button, list);

        return element;
    };

    var getSeason = function (name, season, option) {
        var element = $('<li/>');

        var label = $('<label/>', {
            'for': 'toggle-' + name + '-' + season,
            text: cnItem(ucfirst(season))
        });

        var input = $('<input/>', {
            id: 'toggle-' + name + '-' + season,
            type: 'checkbox'
        }).data('option', option);

        if (option[season]) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option[season] == false) {
                option[season] = true;
                message('启用在 ' + cnItem(ucfirst(season)) + ' 与 ' + cnItem(ucfirst(name)) + ' 的交易');
            } else if ((!input.is(':checked')) && option[season] == true) {
                option[season] = false;
                message('停止在 ' + cnItem(ucfirst(season)) + ' 与 ' + cnItem(ucfirst(name)) + ' 交易');
            }
            kittenStorage.items[input.attr('id')] = option[season];
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    var getOption = function (name, option) {
        var element = $('<li/>');
        var elementLabel = option.label || cnItem(ucfirst(name));

        var label = $('<label/>', {
            'for': 'toggle-' + name,
            text: elementLabel,
            css: {display: 'inline-block', minWidth: '80px'}
        });

        var input = $('<input/>', {
            id: 'toggle-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.enabled) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.enabled == false) {
                option.enabled = true;
                if (option.filter) {
                    message('过滤 ' + elementLabel);
                } else if (option.misc) {
                    message('启用 ' + elementLabel);
                } else {
                    message('启用自动化 ' + elementLabel);
                }
            } else if ((!input.is(':checked')) && option.enabled == true) {
                option.enabled = false;
                if (option.filter) {
                    message('取消过滤 ' + elementLabel);
                } else if (option.misc) {
                    message('禁用 ' + elementLabel);
                } else {
                    message('禁用自动化 ' + elementLabel);
                }
            }
            kittenStorage.items[input.attr('id')] = option.enabled;
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    var getlimitedOption = function (name, option) {
        var element = getOption(name, option);

        if (option.limited !== undefined) {
            var limitedButton = $('<div/>', {
                id: 'toggle-limited-' + name,
                text: '限制数量',
                title: option.limited,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            }).data('option', option);
                              
            limitedButton.on('click', function () {
                var value = window.prompt('输入建造 ' + option.label + ' 的最大数量。 ', option.limited);

                if (value !== null) {
                    option.limited = parseFloat(value);
                    kittenStorage.items[limitedButton.attr('id')] = option.limited;
                    saveToKittenStorage();
                    limitedButton[0].title = option.limited;
                }
            });

            element.append(limitedButton);
        }

        return element;
    };
  
    var getCraftOption = function (name, option) {
        var element = getOption(name, option);

        var label = $('<label/>', {
            'for': 'toggle-limited-' + name,
            text: '限制'
        });

        var input = $('<input/>', {
            id: 'toggle-limited-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.limited) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.limited == false) {
                option.limited = true;
                message('限制 ' + cnItem(ucfirst(name)) + ' 的合成总量');
            } else if ((!input.is(':checked')) && option.limited == true) {
                option.limited = false;
                message('制作 ' + cnItem(ucfirst(name)) + ' 不受限制');
            }
            kittenStorage.items[input.attr('id')] = option.limited;
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };
  
    var getOptionsOption = function (name, option) {
        var element = getOption(name, option);
      
        if (option.subTrigger !== undefined) {
            var triggerButton = $('<div/>', {
                id: 'set-' + name +'-subTrigger',
                text: '触发条件',
                title: option.subTrigger,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            }).data('option', option);
                              
            triggerButton.on('click', function () {
                var value;
                if (name == 'catDistribution'){value = window.prompt('输入一个新的触发值 ' + option.label + '。\n取值范围为 0 到 7 之间的整数，分别对应 8 种职业。（5 为牧师）', option.subTrigger);}
                else if (name == 'crypto'){value = window.prompt('输入一个新的触发值 ' + option.label + '。\n设置触发黑币交易所需达到的圣遗物的数量。', option.subTrigger);}
                else{value = window.prompt('输入一个新的触发值 ' + option.label + '。 取值范围为 0 到 1 之间的小数', option.subTrigger);}

                if (value !== null) {
                    option.subTrigger = parseFloat(value);
                    kittenStorage.items[triggerButton.attr('id')] = option.subTrigger;
                    saveToKittenStorage();
                    triggerButton[0].title = option.subTrigger;
                }
            });

            element.append(triggerButton);
        }

        return element;
    };

    // Grab button labels for religion options
    var religionManager = new ReligionManager();
    for (var buildOption in options.auto.faith.items) {
        var buildItem = options.auto.faith.items[buildOption];
        var build = religionManager.getBuild(buildItem.name || buildOption, buildItem.variant);
        if (build) {
            options.auto.faith.items[buildOption].label = build.label;
        }
    }

    // Grab button labels for time options
    var timeManager = new TimeManager();
    for (var buildOption in options.auto.time.items) {
        var buildItem = options.auto.time.items[buildOption];
        var build = timeManager.getBuild(buildItem.name || buildOption, buildItem.variant);
        if (build) {
            options.auto.time.items[buildOption].label = build.label;
        }
    }

    // Grab button labels for build options
    var buildManager = new BuildManager();
    for (var buildOption in options.auto.build.items) {
        var buildItem = options.auto.build.items[buildOption];
        var build = buildManager.getBuild(buildItem.name || buildOption);
        if (build) {
            if ("stage" in buildItem) {
                options.auto.build.items[buildOption].label = build.meta.stages[buildItem.stage].label;
            } else {
                options.auto.build.items[buildOption].label = build.meta.label;
            }
        }
    }

    // Grab button labels for space options
    var spaceManager = new SpaceManager();
    for (var spaceOption in options.auto.space.items) {
        var build = spaceManager.getBuild(spaceOption);
        if (build) {
            // It's changed to label in 1.3.0.0
            var title = build.title ? build.title : build.label;
            options.auto.space.items[spaceOption].label = title;
        }
    }

    var optionsElement = $('<div/>', {id: 'ks-options', css: {marginBottom: '10px'}});
    var optionsListElement = $('<ul/>');
    var optionsTitleElement = $('<div/>', {
        css: { bottomBorder: '1px solid gray', marginBottom: '5px' },
        text: version
    });

    optionsElement.append(optionsTitleElement);

    optionsListElement.append(getToggle('engine',   '启用小猫珂学家'));
    optionsListElement.append(getToggle('build',    '建筑'));
    optionsListElement.append(getToggle('space',    '太空'));
    optionsListElement.append(getToggle('craft',    '工艺'));
    optionsListElement.append(getToggle('upgrade',  '升级'));
    optionsListElement.append(getToggle('trade',    '贸易'));
    optionsListElement.append(getToggle('faith',    '宗教'));
    optionsListElement.append(getToggle('time',     '时间'));
    optionsListElement.append(getToggle('options',  '选项'));
    optionsListElement.append(getToggle('autotime', '自动燃烧水晶'));
    optionsListElement.append(getToggle('filter',   '日志过滤'));

    // add activity button
    // ===================

    var activitySummary = {};
    var resetActivitySummary = function () {
        activitySummary = {
            lastyear: game.calendar.year,
            lastday:  game.calendar.day,
            craft:    {},
            trade:    {},
            build:    {},
            other:    {}
        };
    };

    var storeForSummary = function (name, amount, section) {
        if (amount === undefined) amount = 1;
        if (section === undefined) section = 'other';

        if (activitySummary[section] === undefined)
            activitySummary[section] = {};

        if (activitySummary[section][name] === undefined) {
            activitySummary[section][name] = parseFloat(amount);
        } else {
            activitySummary[section][name] += parseFloat(amount);
        }
    };

    var displayActivitySummary = function () {
        // Festivals
        if (activitySummary.other.festival) {
            summary('举办了 ' + game.getDisplayValueExt(activitySummary.other.festival) + ' 次节日');
        }

        // Observe stars
        if (activitySummary.other.stars) {
            summary('观察到 ' + game.getDisplayValueExt(activitySummary.other.stars) + ' 颗星星');
        }

        // Praise the Sun
        if (activitySummary.other.faith) {
            summary('通过赞美太阳累计了 ' + game.getDisplayValueExt(activitySummary.other.faith) + ' 信仰总数');
        }

        // Hunters
        if (activitySummary.other.hunt) {
            summary('派出了 ' + game.getDisplayValueExt(activitySummary.other.hunt) + ' 批可爱的小猫猎人');
        }
        
        // Embassies
        if (activitySummary.other.embassy) {
            summary('建造了 ' + game.getDisplayValueExt(activitySummary.other.embassy) + ' 栋大使馆');
        }
      
        // Necrocorns
        if (activitySummary.other.feed) {
            summary('献祭给上古神 ' + game.getDisplayValueExt(activitySummary.other.feed) + ' 只死灵兽');
        }
        
        // Techs
        for (var name in activitySummary.research) {
            summary('研究了 ' + cnItem(ucfirst(name)));
        }
        
        // Upgrades
        for (var name in activitySummary.upgrade) {
            summary('升级了 ' + cnItem(ucfirst(name)));
        }
        
        // Buildings
        for (var name in activitySummary.build) {
            summary('建造了 ' + game.getDisplayValueExt(activitySummary.build[name]) + ' 个 ' + cnItem(ucfirst(name)));
        }
        
        // Order of the Sun
        for (var name in activitySummary.faith) {
            summary('发现了 ' + game.getDisplayValueExt(activitySummary.faith[name]) + ' 次 ' + cnItem(ucfirst(name)));
        }

        // Crafts
        for (var name in activitySummary.craft) {
            summary('制作了 ' + game.getDisplayValueExt(activitySummary.craft[name]) + ' ' + cnItem(ucfirst(name)));
        }

        // Trading
        for (var name in activitySummary.trade) {
            summary('与 ' + cnItem(ucfirst(name)) + ' 贸易了 ' + game.getDisplayValueExt(activitySummary.trade[name]) + ' 次');
        }

        // Show time since last run. Assumes that the day and year are always higher.
        if (activitySummary.lastyear && activitySummary.lastday) {
            var years = game.calendar.year - activitySummary.lastyear;
            var days = game.calendar.day - activitySummary.lastday;

            if (days < 0) {
                years -= 1;
                days += 400;
            }

            var duration = '';
            if (years > 0) {
                duration += years + ' 年 ';
            }

            if (days >= 0) {
                duration += roundToTwo(days) + ' 天 ';
            }

            summary('过去 ' + duration + ' 里的总结：');
        }

        // Clear out the old activity
        resetActivitySummary()
    };

    resetActivitySummary();

    var activityBox = $('<div/>', {
        id: 'activity-box',
        css: {
            display: 'inline-block',
            verticalAlign: 'top'
        }
    });

    var showActivity = $('<a/>', {
        id: 'showActivityHref',
        text: '总结',
        href: '#',
        css: {
            verticalAlign: 'top'
        }
    });

    showActivity.on('click', displayActivitySummary);

    activityBox.append(showActivity);

    $('#clearLog').append(activityBox);

    // Donation Button
    // ===============

    var donate = $('<li/>', {id: "ks-donate"}).append($('<a/>', {
        href: 'bitcoin:' + address + '?amount=0.00048&label=Kittens Donation',
        target: '_blank',
        text: address
    })).prepend($('<img/>', {
        css: {
            height: '15px',
            width: '15px',
            padding: '3px 4px 0 4px',
            verticalAlign: 'bottom'
        },
        src: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iNTEycHgiCiAgIGhlaWdodD0iNTEycHgiCiAgIHZpZXdCb3g9IjAgMCAxIDEiCiAgIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIgogICBpZD0ic3ZnMiIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4yIHI5ODE5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJiaXRjb2luLWxvZ28tbm9zaGFkb3cuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyMiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxNDQ3IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijg2MSIKICAgICBpZD0ibmFtZWR2aWV3MjAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuOTIxODc1IgogICAgIGlua3NjYXBlOmN4PSIyMTIuNTE0MzciCiAgICAgaW5rc2NhcGU6Y3k9IjIzMy4yNDYxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+CiAgPCEtLSBBbmRyb2lkIGxhdW5jaGVyIGljb25zOiB2aWV3Qm94PSItMC4wNDUgLTAuMDQ1IDEuMDkgMS4wOSIgLS0+CiAgPGRlZnMKICAgICBpZD0iZGVmczQiPgogICAgPGZpbHRlcgogICAgICAgaWQ9Il9kcm9wLXNoYWRvdyIKICAgICAgIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iYmx1ci1vdXQiCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMSIKICAgICAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyNyIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iYmx1ci1vdXQiCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgaWQ9ImZlQmxlbmQ5IiAvPgogICAgPC9maWx0ZXI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJjb2luLWdyYWRpZW50IgogICAgICAgeDE9IjAlIgogICAgICAgeTE9IjAlIgogICAgICAgeDI9IjAlIgogICAgICAgeTI9IjEwMCUiPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjAlIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZjlhYTRiIgogICAgICAgICBpZD0ic3RvcDEyIiAvPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjEwMCUiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmNzkzMWEiCiAgICAgICAgIGlkPSJzdG9wMTQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZwogICAgIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUpIgogICAgIGlkPSJnMTYiPgogICAgPHBhdGgKICAgICAgIGlkPSJjb2luIgogICAgICAgZD0ibSA2My4wMzU5LDM5Ljc0MSBjIC00LjI3NCwxNy4xNDMgLTIxLjYzNywyNy41NzYgLTM4Ljc4MiwyMy4zMDEgLTE3LjEzOCwtNC4yNzQgLTI3LjU3MSwtMjEuNjM4IC0yMy4yOTUsLTM4Ljc4IDQuMjcyLC0xNy4xNDUgMjEuNjM1LC0yNy41NzkgMzguNzc1LC0yMy4zMDUgMTcuMTQ0LDQuMjc0IDI3LjU3NiwyMS42NCAyMy4zMDIsMzguNzg0IHoiCiAgICAgICBzdHlsZT0iZmlsbDp1cmwoI2NvaW4tZ3JhZGllbnQpIiAvPgogICAgPHBhdGgKICAgICAgIGlkPSJzeW1ib2wiCiAgICAgICBkPSJtIDQ2LjEwMDksMjcuNDQxIGMgMC42MzcsLTQuMjU4IC0yLjYwNSwtNi41NDcgLTcuMDM4LC04LjA3NCBsIDEuNDM4LC01Ljc2OCAtMy41MTEsLTAuODc1IC0xLjQsNS42MTYgYyAtMC45MjMsLTAuMjMgLTEuODcxLC0wLjQ0NyAtMi44MTMsLTAuNjYyIGwgMS40MSwtNS42NTMgLTMuNTA5LC0wLjg3NSAtMS40MzksNS43NjYgYyAtMC43NjQsLTAuMTc0IC0xLjUxNCwtMC4zNDYgLTIuMjQyLC0wLjUyNyBsIDAuMDA0LC0wLjAxOCAtNC44NDIsLTEuMjA5IC0wLjkzNCwzLjc1IGMgMCwwIDIuNjA1LDAuNTk3IDIuNTUsMC42MzQgMS40MjIsMC4zNTUgMS42NzksMS4yOTYgMS42MzYsMi4wNDIgbCAtMS42MzgsNi41NzEgYyAwLjA5OCwwLjAyNSAwLjIyNSwwLjA2MSAwLjM2NSwwLjExNyAtMC4xMTcsLTAuMDI5IC0wLjI0MiwtMC4wNjEgLTAuMzcxLC0wLjA5MiBsIC0yLjI5Niw5LjIwNSBjIC0wLjE3NCwwLjQzMiAtMC42MTUsMS4wOCAtMS42MDksMC44MzQgMC4wMzUsMC4wNTEgLTIuNTUyLC0wLjYzNyAtMi41NTIsLTAuNjM3IGwgLTEuNzQzLDQuMDE5IDQuNTY5LDEuMTM5IGMgMC44NSwwLjIxMyAxLjY4MywwLjQzNiAyLjUwMywwLjY0NiBsIC0xLjQ1Myw1LjgzNCAzLjUwNywwLjg3NSAxLjQzOSwtNS43NzIgYyAwLjk1OCwwLjI2IDEuODg4LDAuNSAyLjc5OCwwLjcyNiBsIC0xLjQzNCw1Ljc0NSAzLjUxMSwwLjg3NSAxLjQ1MywtNS44MjMgYyA1Ljk4NywxLjEzMyAxMC40ODksMC42NzYgMTIuMzg0LC00LjczOSAxLjUyNywtNC4zNiAtMC4wNzYsLTYuODc1IC0zLjIyNiwtOC41MTUgMi4yOTQsLTAuNTI5IDQuMDIyLC0yLjAzOCA0LjQ4MywtNS4xNTUgeiBtIC04LjAyMiwxMS4yNDkgYyAtMS4wODUsNC4zNiAtOC40MjYsMi4wMDMgLTEwLjgwNiwxLjQxMiBsIDEuOTI4LC03LjcyOSBjIDIuMzgsMC41OTQgMTAuMDEyLDEuNzcgOC44NzgsNi4zMTcgeiBtIDEuMDg2LC0xMS4zMTIgYyAtMC45OSwzLjk2NiAtNy4xLDEuOTUxIC05LjA4MiwxLjQ1NyBsIDEuNzQ4LC03LjAxIGMgMS45ODIsMC40OTQgOC4zNjUsMS40MTYgNy4zMzQsNS41NTMgeiIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+CiAgPC9nPgo8L3N2Zz4='
    }));

    // Add some padding above the donation item
    donate.css('padding', '5px');

    optionsListElement.append(donate);

    // add the options above the game log
    right.prepend(optionsElement.append(optionsListElement));

    // Initialize and set toggles for Engine
    // =====================================

    var engine = new Engine();
    var toggleEngine = $('#toggle-engine');

    toggleEngine.on('change', function () {
        if (toggleEngine.is(':checked')) {
            engine.start();
        } else {
            engine.stop();
        }
    });

    loadFromKittenStorage();

    if (console && console.log) console.log(version + " 加载成功");
    game._publish("kitten_scientists/ready", version);

}

var loadTest = function() {
    if (typeof gamePage === 'undefined') {
        // Test if kittens game is already loaded or wait 2s and try again
        setTimeout(function(){
            loadTest();
        }, 2000);
    } else {
        // Kittens loaded, run Kitten Scientist's Automation Engine
        game = gamePage;
        run();
    }
}

loadTest();
