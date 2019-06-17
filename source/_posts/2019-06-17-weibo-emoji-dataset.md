---
title: 微博表情数据爬取
tags:
  - 微博
  - 爬虫
categories:
  - 项目
  - 爬虫
date: 2019-06-17 23:09:39
---

由于百度人工智能比赛的需要，我们需要爬取新浪微博的微博数据，得到带表情的微博，将数据进行适当地处理，便于后续深度学习模型的训练使用。本文章用到的所有源代码请见 https://github.com/upupming/weiboAPI 。注意本文是一个**探索过程**，并不是一个总结。

<!-- more -->

## 基本思路

首先，我在 GitHub 上找到了 [dataabc/weiboSpider](https://github.com/dataabc/weiboSpider) 这个项目，并且立即 Star 和 Watch 了它，在我 Watch 之后看到开发者还在积极地给项目更新、回答 Issue，我感到很幸运。所以基本上打算在这个项目的基础上加以修改，符合我的需要。

注意：微博一共有三个比较不同的网站：

1. weibo.cn

    极简版的微博，没有现代化的 UI 界面，适合爬取。weiboSpider 就是基于这个 weibo.cn 进行抓取的。
2. weibo.com

    现代化的微博网页，[使用 Ajax](https://zhuanlan.zhihu.com/p/35682031) 进行页面内数据的加载。我也向开发者提议使用网页使用的 Ajax API 进行抓取，作者回复说对项目的改动比较大，后续可能会在其他项目中实现。
3. m.weibo.cn

    手机版的微博网页，也是用 Ajax 来加载页面数据的。

接下来我们只考虑 weibo.cn，有了 weiboSpider，要爬取数据就简单很多了，我需要做的也不算特别多。但是有几点比较难以处理的事情先需要明确一下解决方案。

微博的表情有的是用图片表示的（比如 <img alt="[微笑]" src="https://h5.sinaimg.cn/m/emoticon/icon/default/d_hehe-039d0a6a8a.png" style="width:1em; height:1em;">），有的则是用 Unicode 表示的（比如 😀），有的则是直接用『[...]』表示的（比如 [黑桃]️）。

 1. 对于**图片表情**，weiboSpider 是直接把它们忽略掉，最终的爬取结果里面没有这些表情，我可以对它进行修改，用图片的 `alt` 属性表示表情，然后建立一个【表情名称 -> 表情图片/网址】的字典。
 2. 对于 **Unicode 表情**，无需做任何处理。
 3. 对于**文字表情**，我们需要人工去判断这些表情与 Unicode 中的哪些表情对应。

## 表情数据库搭建

### Unicode 表情

所有的 Unicode 参见 https://unicode.org/emoji/charts-12.0/full-emoji-list.html，简单起见，我们直接使用 GitHub 支持的所有 emoji，参见[这里](https://gist.github.com/roachhd/1f029bd4b50b8a524f3c#gistcomment-2585127)，使用 regexr.com 处理后得到下面的文本：

<details>

<summary>unicode.txt</summary>

```txt
Copied from: https://gist.github.com/roachhd/1f029bd4b50b8a524f3c#gistcomment-2585127

😄😆😊😃☺️😏😍😘😚😳😌😆😁😉😜😝😀😗😙😛😴😟😦😧😮😬😕😯😑😒😅😓😥😩😔😞😖😨😰😣😢😭😂😲😱😫😠😡😤😪😋😷😎😵👿😈😐😶😇👽💛💙💜❤️💚💔💓💗💕💞💘💖✨⭐️🌟💫💥💥💢❗️❓❕❔💤💨💦🎶🎵🔥💩💩💩👍👍👎👎👌👊👊✊✌️👋✋✋👐☝️👇👈👉🙌🙏👆👏💪🤘🖕🚶🏃🏃👫👪👬👭💃👯🙆🙅💁🙋👰🙎🙍🙇💑💆💇💅👦👧👩👨👶👵👴👱👲👳👷👮👼👸😺😸😻😽😼🙀😿😹😾👹👺🙈🙉🙊💂💀🐾👄💋💧👂👀👃👅💌👤👥💬💭

Nature
☀️☔️☁️❄️⛄️⚡️🌀🌁🌊🐱🐶🐭🐹🐰🐺🐸🐯🐨🐻🐷🐽🐮🐗🐵🐒🐴🐎🐫🐑🐘🐼🐍🐦🐤🐥🐣🐔🐧🐢🐛🐝🐜🐞🐌🐙🐠🐟🐳🐋🐬🐄🐏🐀🐃🐅🐇🐉🐐🐓🐕🐖🐁🐂🐲🐡🐊🐪🐆🐈🐩🐾💐🌸🌷🍀🌹🌻🌺🍁🍃🍂🌿🍄🌵🌴🌲🌳🌰🌱🌼🌾🐚🌐🌞🌝🌚🌑🌒🌓🌔🌕🌖🌗🌘🌜🌛🌔🌍🌎🌏🌋🌌⛅️

Objects
🎍💝🎎🎒🎓🎏🎆🎇🎐🎑🎃👻🎅🎄🎁🔔🔕🎋🎉🎊🎈🔮💿📀💾📷📹🎥💻📺📱☎️☎️📞📟📠💽📼🔉🔈🔇📢📣⌛️⏳⏰⌚️📻📡➿🔍🔎🔓🔒🔏🔐🔑💡🔦🔆🔅🔌🔋📲✉️📫📮🛀🛁🚿🚽🔧🔩🔨💺💰💴💵💷💶💳💸📧📥📤✉️📨📯📪📬📭📦🚪🚬💣🔫🔪💊💉📄📃📑📊📈📉📜📋📆📅📇📁📂✂️📌📎✒️✏️📏📐📕📗📘📙📓📔📒📚🔖📛🔬🔭📰🏈🏀⚽️⚾️🎾🎱🏉🎳⛳️🚵🚴🏇🏂🏊🏄🎿♠️♥️♣️♦️💎💍🏆🎼🎹🎻👾🎮🃏🎴🎲🎯🀄️🎬📝📝📖🎨🎤🎧🎺🎷🎸👞👡👠💄👢👕👕👔👚👗🎽👖👘👙🎀🎩👑👒👞🌂💼👜👝👛👓🎣☕️🍵🍶🍼🍺🍻🍸🍹🍷🍴🍕🍔🍟🍗🍖🍝🍛🍤🍱🍣🍥🍙🍘🍚🍜🍲🍢🍡🥚🍞🍩🍮🍦🍨🍧🎂🍰🍪🍫🍬🍭🍯🍎🍏🍊🍋🍒🍇🍉🍓🍑🍈🍌🍐🍍🍠🍆🍅🌽

Places
🏠🏡🏫🏢🏣🏥🏦🏪🏩🏨💒⛪️🏬🏤🌇🌆🏯🏰⛺️🏭🗼🗾🗻🌄🌅🌠🗽🌉🎠🌈🎡⛲️🎢🚢🚤⛵️⛵️🚣⚓️🚀✈️🚁🚂🚊🚞🚲🚡🚟🚠🚜🚙🚘🚗🚗🚕🚖🚛🚌🚍🚨🚓🚔🚒🚑🚐🚚🚋🚉🚆🚅🚄🚈🚝🚃🚎🎫⛽️🚦🚥⚠️🚧🔰🏧🎰🚏💈♨️🏁🎌🏮🗿🎪🎭📍🚩🇯🇵🇰🇷🇨🇳🇺🇸🇫🇷🇪🇸🇮🇹🇷🇺🇬🇧🇬🇧🇩🇪

Symbols
1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🔢0️⃣#️⃣🔣◀️⬇️▶️⬅️🔠🔡🔤↙️↘️➡️⬆️↖️↗️⏬⏫🔽⤵️⤴️↩️↪️↔️↕️🔼🔃🔄⏪⏩ℹ️🆗🔀🔁🔂🆕🔝🆙🆒🆓🆖🎦🈁📶🈹🈴🈺🈯️🈷️🈶🈵🈚️🈸🈳🈲🈂️🚻🚹🚺🚼🚭🅿️♿️🚇🛄🉑🚾🚰🚮㊙️㊗️Ⓜ️🛂🛅🛃🉐🆑🆘🆔🚫🔞📵🚯🚱🚳🚷🚸⛔️✳️❇️✴️💟🆚📳📴💹💱♈️♉️♊️♋️♌️♍️♎️♏️♐️♑️♒️♓️⛎🔯❎🅰️🅱️🆎🅾️💠♻️🔚🔙🔛🔜🕐🕜🕙🕥🕚🕦🕛🕧🕑🕝🕒🕞🕓🕟🕔🕠🕕🕡🕖🕢🕗🕣🕘🕤💲©️®️™️❌❗️‼️⁉️⭕️✖️➕➖➗💮💯✔️☑️🔘🔗➰〰️〽️🔱▪️▫️◾️◽️◼️◻️⬛️⬜️✅🔲🔳⚫️⚪️🔴🔵🔷🔶🔹🔸🔺🔻
```

</details>

在发布微博之后，看到如下内容：

![发布后的 Unicode 表情](https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/img/20190615170628.png)

使用 weiboSpider 爬取得到的结果如下：

<details>

<summary>爬取结果</summary>

```txt
微博内容: 
1:[开心]😆[大笑]️[花痴][飞吻][脸红][闭眼]😆[傻笑][眨眼][鬼脸二][吐舌头]😀😗😙😛😴😟😦😧😮😬😕😯😑[斜眼]😅[紧张]😩[闭眼][难过][惊讶][害怕][崩溃][鼻涕][大哭][眼泪][星星眼][惊恐]😫[生气][愤怒]😤[瞌睡]😋[口罩]😎😵[妖怪]😈😐😶😇[外星人][黄心][蓝心][紫心][爱心]️[绿心][心碎][爱心发光][红心]💕💞[一箭穿心]💖[星光]⭐️[星星]💫💥💥[抵消]❗️❓[感叹号][问号][睡觉][喷气][水滴][音符][火焰][大便][大便][大便][强][强][贬低][贬低][好][胜利]️[手掌][手掌][手掌][翅膀][no]️[下][向左][向右][emoji][祈祷][上][强壮]🤘🖕[走路][跑][跑][约会]👪👬👭[卡门][健美操][瑜伽二][瑜伽一][emoji]🙋👰🙎🙍[emoji][恋爱][按摩][理发][美甲][男孩][女孩][阿姨][大叔][婴儿][奶奶][爷爷][外国人一][外国人二][外国人三][工人][列车员][天使][公主]😺😸😻😽😼🙀😿😹😾👹👺🙈🙉🙊[男士头像一]🐾[张嘴][小嘴]💧[耳朵][看看][鼻子]👅💌👤👥💬💭 Nature ️️[白云]️❄️[雪人]️[闪电]️[漩涡]🌁[海浪][猫咪][狗][老鼠][鼹鼠][狗][青蛙][老虎][考拉][熊]🐽[奶牛][野猪][猴子][猴子][马头][赛马][骆驼][绵羊][大象]🐼[蛇][小鸟][小鸡]🐥🐣[母鸡][企鹅]🐢[毛毛虫]🐝🐜🐞🐌[章鱼][热带鱼][鱼][鲸鱼]🐋[海豚]🐄🐏🐀🐃🐅🐇🐉🐐🐓🐕🐖🐁🐂🐲🐡🐊🐪🐆🐈🐩🐾[花束][樱花][郁金香][四叶草][玫瑰][向日葵][花朵][枫叶][绿叶][黄叶]🌿🍄[仙人掌][椰树]🌲🌳🌰🌱🌼[芦苇][贝壳]🌐🌞🌝🌚🌑🌒🌓🌔🌕🌖🌗🌘🌜🌛🌔🌍🌎🌏🌋🌌⛅️ Objects [emoji][心形礼物][结婚][emoji][制服][鲤鱼旗][烟火][烟花][风铃][风景][南瓜灯][幽灵][圣诞树][铃铛]🔕🎋[礼花]🎊[气球]🔮[光盘][光盘]💾[相机]📹[摄像机][显示器][电视][iphone][电话]️[电话]️📞📟[传真][光盘][磁带]🔉🔈🔇[喇叭][喇叭]⌛️⏳⏰⌚️[收音机][雷达][emoji][放大镜]🔎[开锁][锁住]🔏🔐[钥匙][灯泡]🔦🔆🔅🔌🔋[来电]✉️[信箱][邮筒][浴缸]🛁🚿[马桶]🔧🔩[拍卖][办公椅]💴💵💷💶💳💸📧📥📤✉️📨📯📪📬📭📦🚪[抽烟][炸弹][手枪]🔪[药丸][打针]📄📃📑📊📈📉📜📋📆📅📇📁📂[剪刀]️📌📎✒️✏️📏📐📕📗📘📙📓📔📒📚🔖📛🔬🔭📰[橄榄球][篮球][足球]️[棒球]️[网球][台球]🏉🎳[高尔夫]️🚵🚴🏇🏂[游泳][冲浪][滑雪][黑桃]️[红桃]️[梅花]️[方块]️[钻石][戒指][奖杯]🎼🎹🎻[病毒]🎮🃏🎴🎲[飞镖][红中]️[导演][记录][记录][看书][画画][卡拉ok][听歌][小号][萨克斯][吉他]👞[凉鞋][高跟鞋][口红][靴子][上衣][上衣][衬衫]👚[裙子]🎽👖[和服][比基尼][蝴蝶结][魔术][皇冠][草帽]👞[雨伞][公文包][手提包]👝👛👓🎣[咖啡]️[绿茶][米酒]🍼[啤酒][酒杯]🍹🍷[刀叉]🍕[汉堡][薯条]🍗🍖[意面][盖饭]🍤[emoji][寿司]🍥[饭团][饭团][米饭][面条][粥][丸子][丸子]🥚[面包]🍩🍮[甜筒]🍨[冰淇凌][草莓蛋糕]🍪🍫🍬🍭🍯[苹果]🍏[橙子]🍋🍒🍇[西瓜][草莓]🍑🍈🍌🍐🍍🍠[茄子][番茄]🌽 Places [家]🏡[学校][大楼][emoji][医院][银行][24营业][酒店][酒店][婚礼][教堂]️[公司]🏤[落日][黄昏][古迹][城堡][露营]️[工厂][铁塔]🗾[富士山][日出][海边落日]🌠[自由女神]🌉🎠[彩虹][摩天轮][喷泉]️[过山车][游轮][快艇][帆船]️[帆船]️🚣⚓️[火箭]️🚁🚂🚊🚞[自行车]🚡🚟🚠🚜[小汽车]🚘[小汽车][小汽车][出租车]🚖🚛[巴士]🚍🚨[警车]🚔[消防车][救护车]🚐[卡车]🚋[火车]🚆[快轨][轻轨]🚈🚝[巴士]🚎[票][加油机]️🚦[红绿灯][警告]️[障碍][emoji][atm][老虎机][emoji][理发店转灯][emoji]️[格子旗][日本国旗]🏮🗿🎪🎭📍🚩[日本][韩国][中国][美国][法国][西班牙][意大利][俄罗斯][美国][美国][德国] Symbols 1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🔢0️⃣#️⃣🔣[后退]️[下]️[前进]️[右]️🔠🔡🔤[左下]️[右下]️[左]️[上]️[左上]️[右上]️⏬⏫🔽⤵️⤴️↩️↪️↔️↕️🔼🔃🔄[快退][快进]ℹ️🔀🔁🔂[new][top][up][cool]🆓🆖[摄像][emoji][信号][割]🈴[emoji][指]️[月]️[有][满][无]️[申][空]🈲[emoji]️[厕所][男][女][emoji][禁烟][停车场]️[残疾人]️[铁路]🛄🉑[wc]🚰🚮[秘]️[祝]️Ⓜ️🛂🛅🛃[得]🆑🆘[id]🚫[未成年禁入]📵🚯🚱🚳🚷🚸⛔️[发光]️❇️[emoji]️[爱心][vs][爱心手机][关机][股票][货币兑换][白羊座]️[金牛座]️[双子座]️[巨蟹座]️[狮子座]️[处女座]️[天秤座]️[天蝎座]️[射手座]️[摩羯座]️[水瓶座]️[双鱼座]️[emoji][六角星]❎[a]️[b]️[ab][o]️💠♻️🔚🔙🔛🔜[一点钟]🕜[十点钟]🕥[十一点钟]🕦[十二点钟]🕧[二点钟]🕝[三点钟]🕞[四点钟]🕟[五点钟]🕠[六点钟]🕡[七点钟]🕢[八点钟]🕣[九点钟]🕤💲[c]️[r]️[tm]️[叉]❗️‼️⁉️[圈]️✖️➕➖➗💮💯✔️☑️🔘🔗➰〰️[emoji]️[emoji]▪️▫️◾️◽️◼️◻️⬛️⬜️✅[绿点][紫点]⚫️⚪️[红灯]🔵🔷🔶🔹🔸🔺🔻
```

</details>

从实验结果看到，使用 Unicode 发布的表情，有一些保留原样还是『Unicode 表情』，有些则被转换成了『文字表情』，还有一些转换成了『[emoji]』这样的文字表情，也就是说 weibo.cn 根本无法处理这些表情。

因此我们分情况进行处理：

1. 保留原样的 『Unicode 表情』

    不做任何处理

2. 转换为了『文字表情』的 Unicode 表情

    建立『Unicode 表情』->『文字描述』（unicode2Desc）和『文字描述』->『Unicode 表情』（desc2Unicode）两个哈希表（python 中的字典）。

3. 转换为了『[emoji]』的 Unicode 表情

    总共只有 19 Unicode 个表情是这种情况，因为这些表情不太常见，所以可以直接忽略。

经过反复思考，我觉得这样处理还是太过麻烦，因此决定：__放弃使用 weiboSpider，自己写一个基于 Ajax API 的爬虫，爬取 weibo.com 的内容__。因为 weibo.com 对 Unicode 表情处理的是很好的，不会用文字去展示。

`etree` 对 HTML 进行处理主要是要学会 `xpath` 搜索功能，在 Chrome 中有一个 `Copy XPath` 功能很有用，再结合 [`lxml` 的文档](https://lxml.de/tutorial.html)和[这个](https://way2tutorial.com/xml/xpath-tutorial.php#different_between_/_and_//_)看一下就能够理解了:

![20190616095933](https://i.loli.net/2019/06/16/5d05a289d13a444512.png)

因此我构造出的 `XPath` 为 `//div[@node-type='feed_list_content_full']`。

但是有一个小问题，在默认情况下，长微博是不展开的，并在末尾有一个『展开全文』：

![20190616100837](https://i.loli.net/2019/06/16/5d05a4aa1206353779.png)

通过调试我发现未展开的时候，HTML 中并没有微博的全部内容，此时我打开 `Network` 页，选中 `XHR`，点击页面中的『展开全文』，可以看到多了一个网络请求：

![20190616101229](https://i.loli.net/2019/06/16/5d05a5924ee4d84410.png)

![20190616101248](https://i.loli.net/2019/06/16/5d05a5a5a3b9b30004.png)

我们可以通过 Postman 来复现这个请求：

![20190616101838](https://i.loli.net/2019/06/16/5d05a7033e69112556.png)

分析以下几个参数的意义：

```txt
ajwvr:6 不清楚含义，但是我见过的所有爬虫都设置为了 `6`
mid:4383487819465288 微博 id
is_settop: 这几个`is` 参数应该影响不大
is_sethot:
is_setfanstop:
is_setyoudao:
__rnd:1560650969754 添加随机数欺骗浏览器url改变了，防止缓存，对爬虫影响不大
```

所以这里最关键的就是 `mid` 这个参数了，我们怎么拿到这个参数呢？有一个最简单的想法是直接利用 `etree` 对得到的 HTML 进行搜索，对于有『展开全文』的微博，其外部都有一个类似 `action-data="mid=4374832440848723"` 的属性。weiboSpider 的做法是根据微博中有没有 `<a>` 标签内的文本为『全文』来判断一条微博是否是长微博，是长微博的话，再次对服务器发起请求，获取这条长微博的所有内容。

借鉴 Ajax 爬去的思想，我还是想看看有没有更加简单的 API。

经过不断测试发现 weibo.com 比较麻烦，有多个 `page`，`page` 之内分为 2 个 `pagebar`，也就是说一页的内容是分两次加载的。但是 m.weibo.cn 就没有这个分页问题，所有微博都是随着屏幕下滑逐渐加载的。所以 API 也更加简单。

### m.weibo.cn 的 API

#### 获取用户基本信息

`https://m.weibo.cn/api/container/getIndex?type=uid&value={}`

```json
type: uid
value: 1669879400
```

返回结果：

<script src='https://cdn.jsdelivr.net/gh/upupming/weiboAPI@123d4015af294937c6cb1edb92f728d69d762b21/response.js'></script>

<div id="userInfo"></div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/renderjson@1.4.0/renderjson.js"></script>
<script>
    renderjson.set_show_to_level(2);
    document.getElementById("userInfo").appendChild(
        renderjson(userInfo)
    );
</script>

#### 获取用户微博

`https://m.weibo.cn/api/container/getIndex?type=uid&value={}&containerid={}`

```json
type: uid
value: 1669879400
containerid: 1076031669879400
```

可以看到这里只是多了一个 `containerid`，而就是获取用户信息时拿到的 `data->tabsInfo->tabs` 数组的第二个值，其 `title` 为 `微博`。也就是说我们可以在获取用户信息之后，拿到其微博的 containerid，从而继续调用 API。

> 可以借鉴一下[这篇文章](https://www.jianshu.com/p/5d1061f09a1f)，containerid 其实是以 uid 结尾的，`m.weibo.cn/status/+id` 是微博详情页。

返回结果：

<div id="cards1"></div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/renderjson@1.4.0/renderjson.js"></script>
<script>
    renderjson.set_show_to_level(2);
    document.getElementById("cards1").appendChild(
        renderjson(cards1)
    );
</script>

但是要如何连续爬取第二页呢？根据[这篇文章](https://www.jianshu.com/p/832d33a377f7)，可以传入一个 `page` 参数，我们的请求 `url` 就变成了 `https://m.weibo.cn/api/container/getIndex?type=uid&value={}&containerid={}&page={}`。

~~并且我们可以根据返回结果中的 `cardlistInfo->total` 拿到总页数，一共是 1012 页。利用循环获取到所有页面的微博即可。~~ 最后发现返回的结果中并没有总页数，我感觉手机版的微博本身就是不需要总页数的（因为一直往下在滑刷新页面），所以这个 API 不返回总页数。最终我是直接根据返回结果，如果出现下面的结果就终止循环：

```json
{
    "ok": 0,
    "msg": "这里还没有内容",
    "data": {
        "cards": []
    }
}
```

这是一个想法，但是我又想到了另外一个做法，就是：页数=微博条数/每页微博条数+1，更加简单。

#### 获取微博详细内容

对于较长的微博，上面的获取方式并不会直接返回全部内容，而是带有『全文』的链接：

```txt
😄😆😊😃☺️😏😍😘😚😳😌😆😁😉😜😝😀😗😙😛😴😟😦😧😮😬😕😯😑😒😅😓😥😩😔😞😖😨😰😣😢😭😂😲😱😫😠😡😤😪😋😷😎😵👿😈😐😶😇👽💛💙💜❤️💚💔💓💗💕💞 ...<a href="/status/4383487819465288">全文</a>
```

这个时候我们就不得不去获取这条微博的详细内容了，通过前往 https://m.weibo.cn/status/4383487819465288 抓包发现可以使用下面的 API：

`https://m.weibo.cn/statuses/extend?id={mid}`

```json
mid: 4383487819465288
```

返回结果：

<div id="statuses1"></div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/renderjson@1.4.0/renderjson.js"></script>
<script>
    renderjson.set_show_to_level(2);
    document.getElementById("statuses1").appendChild(
        renderjson(statuses1)
    );
</script>

具体的做法是对每一条微博通过 XPath 判断是否有『全文』链接，如果有的话，再次请求这条微博的获取详细内容。

### 图片表情

图片表情的处理方式是，建议一个『文字描述』到『图片URL』的 dict，同时还把这些图片 URL 抓取到本地一下，以备查看。

由于图片表情在返回的博文中是以 HTML 格式表示的，我们需要用 `etree` 进行处理：

```py
html = etree.HTML(text)

res = html.xpath("//span/img/@alt")
print(res)
# ['[爱你]', '[允悲]', '[悲伤]', '[吃惊]', '[偷笑]', '[疑问]', '[右哼哼]', '[互粉]', '[顶]', '[污]', '[害羞]', '[可怜]', '[失望]', '[生病]', '[憧憬]', '[黑线]', '[感冒]', '[亲亲]', '[并不简单]', '[晕]', '[吃瓜]', '[打 
# 脸]', '[可爱]', '[汗]', '[笑而不语]', '[馋嘴]', '[米妮爱你]', '[米妮开心]', '[米妮酷炫]', '[米妮紧张]', '[米
# 奇喜欢]', '[米奇飞吻]', '[钢铁侠]', '[美国队长]', '[雷神]', '[浩克]', '[黑寡妇]', '[鹰眼]', '[惊奇队长]', '[奥克耶]', '[蚁人]', '[灭霸]', '[蜘蛛侠]', '[洛基]', '[奇异博士]', '[冬兵]', '[黑豹]', '[哆啦A梦花心]', '[哆 
# 啦A梦害怕]', '[哆啦A梦吃惊]', '[哆啦A梦汗]', '[哆啦A梦微笑]', '[哆啦A梦笑]', '[哆啦A梦无奈]', '[哆啦A梦美味]', '[哆啦A梦开心]', '[哆啦A梦亲亲]', '[小黄人不屑]', '[小黄人高兴]', '[小黄人惊讶]', '[小黄人白眼]']  
```

## 评论、粉丝和关注、转发爬取

有了微博信息还不够，我们需要对评论进行爬取。因为评论短小、更适合应用表情。为了爬取能够循环下去，我们还需要对粉丝和关注所有进行爬取。

转发微博的话也占了很大一部分，转发内容具有重复性，不是我们需要的，所以我是把原始内容发布者作为一个新的爬取对象进行爬取。我们可以维护一个 `crawling_user_ids` 数组存储当前所有正在被爬取的用户防止重复爬取。

### 转发 API

还是使用前面提到的『获取用户微博』的 API，如果是转发的微博的话，会有一个 `retweeted_status` 对象包含了几乎被转发微博的所有的信息，里面的 `retweeted_status->user->id` 就是被转发者的 `uid`。我们根据这个微博重新创建一个 `WBSpider` 对象，抓取被转发的用户。

另外，有这样一个 API：

`https://m.weibo.cn/statuses/show?id={}`

```json
id: HyZVegYAP
```

得到的结果如下：

<script src='https://cdn.jsdelivr.net/gh/upupming/weiboAPI/response.js'></script>

<div id="retweet01"></div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/renderjson@1.4.0/renderjson.js"></script>
<script>
    renderjson.set_show_to_level(2);
    document.getElementById("retweet01").appendChild(
        renderjson(retweet01)
    );
</script>

但是我们并不需要用到这个 API，因为我们不关注转发内容，只关注被转发者的 uid。

### 评论获取 API

`https://m.weibo.cn/api/comments/show?id={}&page={}`

```json
id: 4383183661430868
page: 1
```

得到的结果如下：

<script src='https://cdn.jsdelivr.net/gh/upupming/weiboAPI/response.js'></script>

<div id="comments1"></div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/renderjson@1.4.0/renderjson.js"></script>
<script>
    renderjson.set_show_to_level(2);
    document.getElementById("comments1").appendChild(
        renderjson(comments1)
    );
</script>

其中的 `total_number` 就是总的评论数量，`max` 是总页数。我们可以根据 `max` 来进行循环，获取到所有的评论信息。

另外，我发现这个 API 会出问题，请求几页之后就不行了（后来发现是需要登录），我抓取到的评论 API 是这样的：

`https://m.weibo.cn/comments/hotflow?id=4383183661430868&mid=4383183661430868&max_id_type=0`

按照返回的：

```
max_id: 314345666829623
max_id_type: 0
```

作为第二次请求的参数进行循环请求即可，经过测试发现最后终止条件是这两者都为 0。

另外，我们还需要利用多线程增加并行处理来加快爬取速度。通过维护『被抓取用户池』来并行抓取，详情可以参考我的代码。

评论爬取这块还有一个坑，应该是微博自己做了反爬限制，所以直接用 python 的 `request` 会出现 302 FOUND 并把你重定向到微博的登录网址。我后来使用 [`chromedriver`](http://chromedriver.chromium.org/downloads) 才发现微博的限制是这样来进行重定向的：

![20190617214259](https://i.loli.net/2019/06/17/5d0798e85a76871186.png)

但是在 Chrome 直接输入就会返回正常的数据。我又尝试了 Chrome 的无痕浏览，发现也会被 302 重定向，因此我推测是没有登录的原因，因此我们可以写一个登录的步骤：

```py
def login(self):
    print('请进入 https://passport.weibo.cn/signin/login 后按 Enter 键继续')
    os.system("pause")
    self.driver.find_element_by_id('loginName').send_keys(settings.USER_NAME)
    self.driver.find_element_by_id('loginPassword').send_keys(settings.PASSWORD)
    print(f'密码已经填好，请完成登录之后按 Enter 继续（可能需要人工拖动滑块验证）')
    os.system("pause")
```

所以最终的总结还是：虽然爬取 m.weibo.cn 的微博正文不需要 Cookie，但是第一页之后的评论还是需要 Cookie 的，我以为是 request 自身的原因还将 request 换成了 chromedriver。

最后，我们把评论人的 uid 也要加入『被抓取用户池』中进行抓取，注意并行度不能太高，否则会出现『请求过于频繁』，我们可以维护一个等待队列：

```py
def start(self):
    if crawling_user_ids.count(self.user_id):
        logging.warning(f'uid {self.user_id} 正在爬取，拒绝加入到爬取池')
        return
    elif crawled_user_ids.count(self.user_id):
        logging.warning(f'uid {self.user_id} 已经爬取完毕，拒绝加入到爬取池')
        return
    elif waiting_user_ids.count(self.user_id):
        logging.warning(f'uid {self.user_id} 正在等待被抓取，拒绝加入到爬取池')
        return
    elif len(crawling_user_ids) < MAX_CRAWING_USERS:
        crawling_user_ids.append(self.user_id)
        logging.info(f'uid {self.user_id} 加入到爬取池')
    else:
        waiting_user_ids.append(self.user_id)
        logging.info(f'uid {self.user_id} 加入到等待池')
        return
```

## 外部链接

1. 项目地址：https://github.com/upupming/weiboAPI
2. [Ajax 爬取](https://zhuanlan.zhihu.com/p/35682031)
3. [Weibo API on gist](https://gist.github.com/momo0v0/805e4a005225e3808626656c7ff284e5)
