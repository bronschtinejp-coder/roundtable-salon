import json

path = r'D:\CMproject\roundtable\roundtable-data.json'
data = json.load(open(path, 'r', encoding='utf-8'))

# Case-008: 暗黑不朽
c008 = next(c for c in data['cases'] if c['id'] == 'case-008')

# Q1 (index 1): 表演力≠体验力
old = c008['conversations'][1]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **设计启示：表演力≠体验力**\n"
    "> 表演是策划视角的自嗨，互动才是玩家视角的价值。\n"
    "> 判断一个Boss机制好不好的标准：\n"
    "> - **不是**「看起来酷不酷」——恶魔人马看着很酷，但玩家反馈平庸\n"
    "> - **而是**「玩家在这个瞬间有没有被要求做出有意义的反应」——真正留下印象的是高威胁技能+特殊应对方式"
)
c008['conversations'][1]['answer'] = old[:old.index('> ')] + new_insight

# Q2 (index 2): 交互自解释性
old = c008['conversations'][2]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **设计启示：交互自解释性**\n"
    "> 多人合作的设计核心不是「规则有多精妙」，而是「玩家能不能在不沟通的情况下，凭直觉做对事」。\n"
    "> **选概念的原则**——优先选「公众认知的最大公约数」：\n"
    "> - 寒冰Boss用**篝火**暗示取暖——进场就植入认知，不需要额外解释\n"
    "> - 迷雾Boss用**光驱散黑暗**——跨文化、跨经验都能秒懂\n"
    "> - 反例：斗牛士Boss三个独立概念叠加，移动端有限视觉空间根本传达不清"
)
c008['conversations'][2]['answer'] = old[:old.index('> ')] + new_insight

# Q3 (index 3): 简洁性原则
old = c008['conversations'][3]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **设计启示：一个机制做深，胜过多个机制堆砌**\n"
    "> 斗牛士失败 vs 迷雾Boss成功的核心差异：\n"
    "> - **斗牛士**：公牛行为 + 红旗作用 + 铠甲规则——三个独立概念，玩家同时消化不了\n"
    "> - **迷雾Boss**：所有能力都围绕「迷雾」一个概念展开——产生迷雾、藏在迷雾里、摧毁灯塔\n"
    "> 分享人的原话总结：**不需要创建很多新机制，而是通过一个机制把它做得足够丰富且深刻。**\n"
    "> 在移动端有限屏幕下，信息密度越低、概念越统一，玩家越容易自发做出正确行为。"
)
c008['conversations'][3]['answer'] = old[:old.index('> ')] + new_insight

# Q4 (index 4): 非数值价值锚点
old = c008['conversations'][4]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **设计启示：用「非数值任务」弥合战力断层**\n"
    "> 不要试图用数值公式抹平高低战力差距——这条路极难走通。\n"
    "> 更有效的思路：在Boss战中嵌入**数值无关的关键任务节点**：\n"
    "> - 炸弹Boss：不拆就团灭——低战力玩家**专注拆弹**，高战力去输出\n"
    "> - 寒冰巨蛇：多人协作阻挡光束——跟战力高低**完全无关**\n"
    "> **验证标准**：如果去掉低战力玩家，高战力能独自解决这个机制吗？如果能，这个设计就没用。"
)
c008['conversations'][4]['answer'] = old[:old.index('> ')] + new_insight

# Q5 (index 5): 初见vs复刷
old = c008['conversations'][5]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **设计启示：初见体验和复刷体验是两套评估标准**\n"
    "> 常见陷阱：用初见的标准评估复刷——初见那段过场动画很震撼，复刷第10次就变成每次30秒的惩罚。\n"
    "> 分享人的做法是把内容分成**两层**：\n"
    "> - **不可跳过的核心交互**——这是体验本体，每次都要参与\n"
    "> - **可跳过的演出包装**——这是锦上添花，看过一次就够了\n"
    "> 三项具体改进（参与度提升20%）：强制动画改可跳过、允许跳阶段速杀、增加Boss能力随机性。"
)
c008['conversations'][5]['answer'] = old[:old.index('> ')] + new_insight

# Case-009: 大话西游
c009 = next(c for c in data['cases'] if c['id'] == 'case-009')

# Q1 (index 1): 迂回削弱三步法
old = c009['conversations'][1]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **方法论：迂回削弱三步法**\n"
    "> - **第一步**：从超模属性出发，追问「是什么环境让这个套路成为最优解」\n"
    "> - **第二步**：不直接动超模源头，而是改变环境条件（PVE怪物数值、其他系统的属性投放），让原本的最优解变成非最优解\n"
    "> - **第三步**：确保玩家的调整成本低——如果切换成本高，迂回反而引发更大不满\n"
    "> **核心**：让玩家觉得「是我自己判断要换打法」，而不是「策划逼我换的」。"
)
c009['conversations'][1]['answer'] = old[:old.index('> ')] + new_insight

# Q2 (index 2): 装逼矩阵
old = c009['conversations'][2]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **方法论：装逼矩阵的四个维度**\n"
    "> 分享人将付费驱动力拆成了四个维度：\n"
    "> - **养成等级**：展示差距远大于实际数值差距（100级 vs 41级 = 「两倍」感知，实际仅30%差异）\n"
    "> - **战力排行**：评分增速不必跟数值增速正比，名次本身就是社交货币\n"
    "> - **外观追求**：每个养成系统捆绑独占外观（3.4万元仅换3.8%数值，但光影特效拉动购买飙升）\n"
    "> - **边际数值反馈**：PVE关卡梯度极平滑 + PVP赛事驱动\n"
    "> **核心逻辑**：玩家在MMO里买的不仅仅是数值，更是名次附带的社交价值和外观带来的视觉满足。当这些维度足够丰富时，数值膨胀就不是付费的唯一支撑。"
)
c009['conversations'][2]['answer'] = old[:old.index('> ')] + new_insight

# Q3 (index 3): 锚定替换法
old = c009['conversations'][3]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **方法论：数值包装的「锚定替换」法**\n"
    "> 当两种属性数学期望等价时，选能让玩家产生**高价锚定联想**的那个。\n"
    "> 三个判断维度（均有原文案例支撑）：\n"
    "> - **锚定价值**：该属性在游戏中是否有已知的高成本获取途径？有则玩家自动换算价值（鱼龙舞案例：50%暴击率对标坐骑养成成本）\n"
    "> - **安全边际**：该属性是提升上限还是下限？提升下限更安全，不会突破阈值导致超模（暴击率提升下限 vs 伤害提升上限）\n"
    "> - **内部校验**：同事看到这个数值的第一反应是什么？连组内策划都觉得强，说明包装到位了（真龙案例原话印证）"
)
c009['conversations'][3]['answer'] = old[:old.index('> ')] + new_insight

# Q4 (index 4): 两层锁原则
old = c009['conversations'][4]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **方法论：构筑自由度的「两层锁」原则**\n"
    "> - **锁死基础层**：决定职业定位和攻防基线的属性，策划必须替玩家做决定，不留自由度（参考魔兽：法师天生技能无减伤无嘲讽，布甲白字属性不可构筑）\n"
    "> - **开放进阶层**：决定流派和打法风格的属性，完全放开给玩家（参考魔兽：绿字属性可选暴击火法或精通奥法）\n"
    "> **判断标准**：如果玩家选错了这个属性，会不会导致他连「基本能玩」都做不到？会→锁。不会→放。"
)
c009['conversations'][4]['answer'] = old[:old.index('> ')] + new_insight

# Q5 (index 5): 底层判断
old = c009['conversations'][5]['answer']
old_insight = old[old.index('> '):]
new_insight = (
    "> 🔑 **一个底层判断**\n"
    "> 在长线运营的MMO中，数值策划的核心能力**不是「算得准」，而是「理解人」**。\n"
    "> 理解玩家怎么感知数值、怎么做决策、什么时候会愤怒什么时候会买单。\n"
    "> 数学模型是工具，用户心理才是答案。\n"
    "> （原文：「要求数值策划有极强的同理心，必须深入体验自己的产品，要跟玩家在一起了解用户心理」）"
)
c009['conversations'][5]['answer'] = old[:old.index('> ')] + new_insight

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Done. Validated: {len(data["topics"])} topics, {len(data["cases"])} cases')
