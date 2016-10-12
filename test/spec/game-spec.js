describe("game", function() {
    var game;
    beforeEach(function() {
        game = new com.nuclearunicorn.game.ui.GamePage();
    });

    it("game-self-check", function() {
        expect(game).not.toBe(null);
    });

    it("game-load-reference-save", function() {
    });

    it("game-reset", function() {
    });
});