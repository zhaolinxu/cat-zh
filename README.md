# README #

### General Information ###

* https://www.reddit.com/r/kittensgame
* https://dojotoolkit.org/reference-guide/1.7/dojo/index.html#dojo-index (I'm using mostly pre-1.7 dojo functionality)

### Roadmap ###

* UI
    * Resources
        * Edit icon for craft table to show/hide individual craft recipes

* QOL/Other
    * ~~Ziggurat upgrades should be hidden by default and unlocked one by one~~

* Features
    * Leaders should give a special minor bonus based on trait (and rank)
    * Planetary cycles should give cosmetic gameplay bonuses/penalties

* Portability
    * ~~Render/Update loops should be decoupled from the Game class.~~
        *  ~~Game should be probably splitted into GameCore and GameClient with the option to provide arbitrary implementation of the GameClient~~
    * Most of the logic in the button handlers should be moved to the corresponding manager methods

Please feel free to add other suggestions.

### Contribution guidelines ###

## Theme/Setting ##

In a grim and dark future of the catkind no one can hear you scream.

* Good: mythical monsters, elder artifacts, arcane technologies, lost civilizations
* Bad: elves, fairies, robots, owls

## General Design Principles ##

* It's better to reuse existing buildings and resources rather than introduce new
* Active gameplay should be encouraged if possible, but should not be an absolute requirement to play.
* Every problem or bottleneck should be addressed in multiple ways
(E.g.: Tradepost to reduce fur consumption AND hunting upgrade to get better yield)
* Every solution to a problem should create a new problem

* Design things difficult first and address them with upgrades later
    * For god's sake never ever nerf anything

* Think how things will scale at later stages. You have a rare resource that cost 1M unobtainium? 
Someone will be able to farm trillions of them.

* Try to introduce some varieties in mechanic but stay withing establish rule system.
    * For example, hunt require catpower, grants you various resource and have a chance of giving you something rare
    * Similarly trade require catpower, grants you various resource and have a chance of giving you something rare.
        * Everyone are really comfortable with trade mechanic because it speaks in familiar terms that players have learned already.

* Don't use %reduction effects. For every problem it may solve, a trillion new issues will appear.
* Don't use price reduction effects. If you do, be extremely careful.