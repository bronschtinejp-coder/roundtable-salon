import json

path = r'D:\CMproject\roundtable\roundtable-data.json'
data = json.load(open(path, 'r', encoding='utf-8'))

# ========== Case-009: 大话西游 ==========
c009 = next(c for c in data['cases'] if c['id'] == 'case-009')

# --- 加导读（作为新的第一个conversation，index 0）---
guide = {
    "question": "导读",
    "answer": (
        "对于一个运营了七年半的数值付费MMO，战斗数值设计的核心挑战是什么？\n"
        "大话西游手游的数值策划周玉分享了四个层面的「解题思路」：\n"
        "- **削弱的取巧**：超模职业不能直接砍，怎么通过改变环境条件让玩家自己换打法？\n"
        "- **装逼的价值**：数值膨胀控得这么严，靠什么驱动土豪持续付费？\n"
        "- **促销的包装**：数学期望一样的两个属性，为什么一个卖爆一个卖不动？\n"
        "- **自由度的分寸**：养成系统给玩家多大的构筑空间才合适？\n"
        "底层结论——数值策划的核心能力不是「算得准」，而是「理解人」：理解玩家怎么感知数值、怎么做决策、什么时候会愤怒什么时候会买单。"
    ),
    "images": []
}

# --- 改Q提问 ---
# Q0 (原index 0): 背景
c009['conversations'][0]['question'] = "大话作为一个大体量的数值付费游戏，调整数值平衡的时候都遇到了什么难题？"

# Q1 (原index 1): 削弱
c009['conversations'][1]['question'] = "调整数值平衡时，一般难以避免舆论风险——玩家充了钱的职业被削弱，肯定会闹。有什么技巧可以分享吗？"
# 在answer开头加一句承接
old_a1 = c009['conversations'][1]['answer']
c009['conversations'][1]['answer'] = "不动职业本身，也能成功削弱它。我举两个我们最得意的例子。\n" + old_a1[old_a1.index("案例一"):]

# Q2 (原index 2): 不变
# Q3 (原index 3): 不变

# Q4 (原index 4): 改提问
c009['conversations'][4]['question'] = "怎么把控做出来的数值符合策划的设计预期？养成系统的自由度又该给多少？"

# Q5 (原index 5): 不变

# --- 专有名词注释 ---
# 在Q3的answer中，注释「伤害想法」
old_a3 = c009['conversations'][3]['answer']
c009['conversations'][3]['answer'] = old_a3.replace(
    "「伤害加深+法术命中」和「想法+忽视抗控」",
    "「伤害加深+法术命中」（高阶装备词条）和「伤害想法+忽视抗控」（低阶装备词条，原文简称「想法」）"
)

# 在Q4的answer中，注释「五蕴皆空」和「男鬼」和「八阵图」
old_a4 = c009['conversations'][4]['answer']
c009['conversations'][4]['answer'] = old_a4.replace(
    "男鬼五蕴皆空从29%飙到90%",
    "男鬼（大话中的奶妈/治疗职业）选择「五蕴皆空」（八阵图信物系统中的防御向技能，是策划预期的最优解）的比例从29%飙到90%"
).replace(
    "男鬼选择五蕴皆空",
    "男鬼选择「五蕴皆空」"
)

# 在Q0的answer中，注释「连乘结构」
old_a0 = c009['conversations'][0]['answer']
c009['conversations'][0]['answer'] = old_a0.replace(
    "底层公式是连乘结构，天然容易膨胀。",
    "底层公式是连乘结构（多个层级项相乘，而非相加），天然容易膨胀。"
)

# 在Q1的answer中，注释「变身卡」「幻影套装」
old_a1 = c009['conversations'][1]['answer']
c009['conversations'][1]['answer'] = old_a1.replace(
    "配合变身卡连击20次+幻影套装",
    "配合变身卡（可切换的角色形态，附带不同属性加成）连击20次 + 幻影套装（大话中的装备套装，穿满后普攻有概率控制敌人）"
)

# --- 插入导读到最前面 ---
c009['conversations'].insert(0, guide)


# ========== Case-008: 暗黑不朽 ==========
c008 = next(c for c in data['cases'] if c['id'] == 'case-008')

# --- 加导读 ---
guide_008 = {
    "question": "导读",
    "answer": (
        "暗黑破坏神系列从未做过八人Boss副本——暗黑不朽是第一次。在移动端、无语音交流、职业无分工的条件下，怎么让八个陌生人顺畅合作？\n"
        "关卡组长乔帅分享了从概念探索到两年迭代的完整历程：\n"
        "- **Boss不是独舞，是共舞**：为什么精心设计的Boss表演玩家不买账，互动瞬间反而最深刻？\n"
        "- **交互自解释性**：不靠沟通就能合作的秘诀——篝火、迷雾、炸弹，这些概念如何让玩家凭直觉做对事？\n"
        "- **高低战力断层**：大号带小号体验差，怎么让每个人都「被需要」？\n"
        "- **初见vs复刷**：第一次震撼的过场动画，刷第十次就变成惩罚，怎么处理？"
    ),
    "images": []
}

# --- 改Q提问 ---
c008['conversations'][0]['question'] = "暗黑系列从来没做过八人Boss副本，在移动端做这个玩法面临哪些硬限制？"

c008['conversations'][1]['question'] = "早期Boss设计投入很大但玩家反馈平庸，问题出在哪？"

c008['conversations'][2]['question'] = "移动端八个陌生人没法语音交流，怎么让他们自然合作起来？"

c008['conversations'][3]['question'] = "概念简单不代表机制好用——有没有设计阶段觉得没问题、实际测试翻车的例子？"

c008['conversations'][4]['question'] = "大号带小号打Boss，小号全程发呆，这个体验怎么解决？"

c008['conversations'][5]['question'] = "迭代了两年多、做了28个Boss，最核心的收获是什么？"

# --- 专有名词注释 ---
# 注释「战法牧」
old_a0_008 = c008['conversations'][0]['answer']
c008['conversations'][0]['answer'] = old_a0_008.replace(
    "没有传统MMO的战法牧分工",
    "没有传统MMO的「战法牧」分工（即坦克/输出/治疗的固定角色划分）"
)

# 注释「仇恨规则」「就近原则」
c008['conversations'][0]['answer'] = c008['conversations'][0]['answer'].replace(
    "暗黑的仇恨规则是就近原则",
    "暗黑的仇恨规则（决定Boss攻击谁的逻辑）是就近原则"
)

# --- 插入导读 ---
c008['conversations'].insert(0, guide_008)


# ========== 保存 ==========
with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 验证
data2 = json.load(open(path, 'r', encoding='utf-8'))
for c in data2['cases'][-2:]:
    print(f'{c["id"]}: {len(c["conversations"])} QAs')
    for i, qa in enumerate(c['conversations']):
        print(f'  Q{i}: {qa["question"][:60]}')
