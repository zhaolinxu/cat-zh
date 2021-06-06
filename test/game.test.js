/* global 

    test,
    expect,
    game,
    LCstorage
*/


beforeEach(() => {
    global.gamePage = global.game = new com.nuclearunicorn.game.ui.GamePage();
    //TODO: use special UI system specifically for unit tests
    game.setUI(new classes.ui.UISystem("gameContainerId"));
});

test("basic sanity check, game must load hoglasave without crashing", () => {
    var hoglasave = require("./res/save.js");
    LCstorage["com.nuclearunicorn.kittengame.savedata"] = hoglasave;

    game.load();
});


//--------------------------------
//      Basic faith stuff
//--------------------------------
test("Faith praising should correctly discard faith resoruce and update religion.faith", () => {
    game.resPool.get("faith").value = 1000;
    game.religion.praise();

    expect(game.resPool.get("faith").value).toBe( 0.0001);
    expect(game.religion.faith).toBe(1000);
});


//--------------------------------
//      Ecology tests
//--------------------------------
test("Pollution values must be sane", () => {
    //TODO: please add other effects there
    
    var POL_LBASE = game.bld.getPollutionLevelBase();
    expect(POL_LBASE).toBeGreaterThanOrEqual(100000);

    game.bld.cathPollution = 100000;
    game.bld.update();

    let effects = game.bld.pollutionEffects;
    expect(effects["catnipPollutionRatio"]).toBe(0);

    //~halfway to level 1
    game.bld.cathPollution = POL_LBASE/2;
    game.bld.update();
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.1);

    //~lvl 1
    game.bld.cathPollution = POL_LBASE*10;
    game.bld.update();
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.25);

    //~lvl 2
    game.bld.cathPollution = POL_LBASE*100;
    game.bld.update();
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.275);

    //~lvl 3
    game.bld.cathPollution = POL_LBASE*1000;
    game.bld.update();
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.3);
});