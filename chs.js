/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Deutsch': '德文',
    'close': '关闭',
    'Apply changes': '保存更改',
    'Android': '安卓',
    'Clear log': '清除日志',
    'Color scheme': '配色方案',
    'autosaving...': '自动保存...',
    'Disable game telemetry': '禁用游戏遥测',
    'Compress exported save file': '压缩导出的存档文件',
    'Enable offline progression': '启用离线进度',
    'Nummon': '概览',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    'Setting up game engine...': '设置游戏引擎…',
    'Kittens Game Mobile has been released! Click on the link to follow': '小猫游戏手机版已经发布!点击链接查看',
    //科学家
    'Beam': '木梁',
    'All resources': '全部资源',
    'All upgrades': '全部升级',
    'Crafting': '工艺',
    'Building': '建筑',
    'Enable Scientists': '启用科学家',
    'Religion': '宗教',
    'Trading': '贸易',
    'Hunting': '狩猎',
    'Space': '太空',
    'Festival': '节日',
    'Zebras': '斑马',
    'Sharks': '鲨鱼',
    'Leviathans': '利维坦',
    'Dragons': '龙',
    'Spiders': '蜘蛛',
    'Lizards': '蜥蜴',
    'Nagas': '娜迦',
    'Griffins': '格里芬',
    'Wood': '木头',
    'Steel': '钢',
    'Alloy': '合金',
    'Gear': '齿轮',
    'Ship': '船',
    'Tanker': '油轮',
    'Kerosene': '煤油',
    'Parchment': '羊皮纸',
    'Eludium': 'E合金',
    'Slab': '石板',
    'Concrete': '混凝土',
    'Plate': '金属板',
    'Scaffold': '脚手架',
    'Manuscript': '手稿',
    'Blueprint': '蓝图',
    'Compendium': '概要',
    'Thorium': '钍',
    'Megalith': '巨石',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',

    //原样
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    "Kitten Scientists version ": "小猫科学家版本",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    " ": " ",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    "\n": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^x?\d+(\.\d+)?[A-Za-z%]{0,2}(\s.C)?\s*$/, //12.34K,23.4 °C
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /^\s*$/, //纯空格
    /^fps: (\d+) ms$/,
    /^\d+(\.\d+)?[A-Za-z]{0,2}.?\(?([+\-]?(\d+(\.\d+)?[A-Za-z]{0,2})?)?$/, //12.34M (+34.34K
    /^(\d+(\.\d+)?[A-Za-z]{0,2}\/s)?.?\(?([+\-]?\d+(\.\d+)?[A-Za-z]{0,2})?\/s\stot$/, //2.74M/s (112.4K/s tot
    /^\d+(\.\d+)?(e[+\-]?\d+)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?$/, //2.177e+6 (+4.01+4
    /^(\d+(\.\d+)?(e[+\-]?\d+)?\/s)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?\/s\stot$/, //2.177e+6/s (+4.01+4/s tot
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^(\d+) Royal points$/, '$1 皇家点数'],
    [/^(.+)Kittens Game$/, '猫国建设者'],
    [/^(.+)Thanks a lot to 4chan\/igg for being such a nice guys.$/, '非常感谢4chan\/igg这么好的人。'],
    [/^If none of these work:\n(.+)$/, '如果以上这些都不起作用:'],
    [/^(.+)Loading...\n(.+)$/, '加载中...'],
    [/^(.+)Loading...$/, '加载中...'],
    [/^(.+)You are a kitten in a catnip forest.\n(.+)$/, '你是猫薄荷森林里的一只小猫。'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);