# Kittens Game （猫国建设者

[游戏地址](https://kitten-game-cn.now.sh/#)

A fork from https://bitbucket.org/bloodrizer/kitten-game/

A fork from https://gitee.com/likexia/cat-zh


kitten-scientists: https://github.com/Cirn09/cbc-kitten-scientists

NummonCalc: https://github.com/Cirn09/NummonCalc

---

以下为原汉化版信息，现已过期

### 网页版本链接 ###
* 最新汉化版本（v 1.4.6.2.d (29 may 2019)）：http://likexia.gitee.io/cat-zh/
* 备用汉化版（V 1.4.5.2b）：http://cnh5.gitee.io/cat-zh/
* 之前汉化版（V 1.4.0.7）：http://kittens.applinzi.com/
* 作者最新英文原版（v 1.4.6.2.d (29 may 2019)）：http://bloodrizer.ru/games/kittens/

1.4以下版本的存档不能用在最新版上哦~
* U77汉化版（V 1.0.5.8）http://www.u77.com/game/4649

### 手机版本下载 ###
手机版本为付费版本，大概6元，有需要的朋友可以移步下载，目前最新的手机版本已经加入了中文，可以在菜单里面设置。
* 安卓版（v 1.4.6.2c）US$1.99：https://play.google.com/store/apps/details?id=com.nuclearunicorn.kittensgame
* ios版：https://itunes.apple.com/us/app/kittens-game/id1198099725?mt=8



[![Crowdin](https://badges.crowdin.net/kittensgame/localized.svg)](https://crowdin.com/project/kittensgame)

# README
## Contents
* [General Information](#general-information)
    * [No ES6, please](#no-es6-please)
    * [Roadmap](#roadmap)

* [CONTRIBUTION GUIDELINES](#contribution-guidelines)
    * [General Design Principles](#general-design-principles)
    * [Consistency](#consistency)
    * [Themes](#themes)
    * [Translation and Localization]
    * [LINKS](#links)

## General Information
* [Discord](https://discord.gg/Y8bTG3) - * check it first! *
* [Kittens Game subreddit](https://www.reddit.com/r/kittensgame)
* [dojo Reference Guide](https://dojotoolkit.org/reference-guide/1.7/dojo/index.html)
    * (I'm using mostly pre-1.7 dojo functionality.)
* [NodeJS](https://nodejs.org/) v10+
* [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable )

### Installation

To install the prereqs
```
npm install --global yarn
yarn install
```

To run the local developer server
```
yarn start
```

To run the tests
```
yarn test
```

## Contribution

### Rules

1. No meanies and baddies
2. No bureocracy

### Repo access

As a general rule, all changes should go through the PR.
If you have a write access, you can submit small changes directly without approval. Major changes are still advised to be pushed through PR.

Please run all major UI changes through Blood first.

### No ES6, please
The KG ecosystem must support about 20.000 different Android devices, iOS, and various OS and browser versions dating from 1980, including Chrome/FF/IE/Edge/webkit of all possible releases.

We support IE6. We support browsers that do not know how to work with local storage or web workers. I'm not sure, but it might actually work on Netscape, Links or Mosaic.

Please, no ()=>{}, const, require, webpackers, etc.

### Roadmap
* [Most recent roadmap on Trello](https://trello.com/b/cecIwqp2/kittens-game-roadmap)
    * NB: This has not been updated for years.

## Contribution Guidelines
* Brave souls that try to change formatting will be fed to wolfs.
* THERE IS NO UNUSED CODE in this repo.
* If you found some confusing place and wasted more than few hours here, please document it for your fellow devs.

### General Design Principles
* It's better to reuse existing buildings and resources than to introduce new ones.
* Active gameplay should be encouraged when possible, but it should not be an absolute requirement to play.
* Every problem or bottleneck should be addressed in multiple ways,
e.g. Tradepost to reduce fur consumption AND Hunting upgrade to get better yield.
* Every solution to a problem should create a new problem.
* Design things to be difficult initially, and address them with upgrades later.
    * For god's sake, never, **ever** nerf anything!!
* Consider how things will scale at later stages. You have a rare resource that costs 1 million unobtainium?
Someone will be able to farm trillions of them.
* Try to introduce some variety to the mechanics, but stay within the established rule system.
    * For example, hunting requires catpower, grants you various resources, and has a chance to give you something rare.
    * Similarly, trade requires catpower, grants you various resources, and has a chance to give you something rare.
        * Our players are really comfortable with the trade mechanic because it uses familiar terms they know already.
* Don't use percent reduction effects. For every problem they may solve, a trillion new issues will appear.
* Don't use price reduction effects. (If you do, be *extremely* careful.)

### Consistency
* With code formatting, it's nice to have, but it's not critical.

### Themes
In a grim and dark future of catkind, no one can hear you scream.

* Good: mythical monsters, elder artifacts, arcane technologies, lost civilizations
* Bad: elves, fairies, robots, owls

### Translation and Localization

https://crowdin.com/project/kittensgame

* Please use the link above for all the localization changes.

* Please use $I(<string_id>) instead of hardcoded strings.
* i18n/en.json is a master file that contains all the keys for the game. When adding new locale string, please add a key and a value to en.json 
    * You are not required to provide translation for new string to other languages.
* _i18n/\*.json_ are legacy translation files and should not be changed.
* _i18n/crowdin/\*json_ are autogenerated by crowdin and should not be changed directly in the codebase. They have higher priority over i18n/_.json

### Links
* [Resource Order](./Resource-Order.md)
