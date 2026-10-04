import { b, dq, q, lesson, section, TRAINING_NOTE } from "./curriculum.mjs";
// A dated, deliberately static snapshot. Replace this object and the meta lessons
// together after verifying the next season; never silently relabel an old snapshot.
export const meta = {
  version: "2026-10-03-m6",
  verified: "2026-10-03",
  reviewAfter: "2026-10-07",
  season: "M-6",
  regulation: "M-C",
  seasonStart: "2026-09-09",
  seasonEnd: "2026-10-07",
  regulationEnd: "2026-12-02",
  scope: b(
    "2026 年 10 月 3 日的双打排位快照；排名来自 Pokémon Zone 的 Season 6 双打页，不代表胜率或每场必带配置。组合课程是基于常见成员与机制的教学归纳，不是组合使用率榜。",
    "Ranked doubles snapshot checked October 3, 2026. Ranks are from Pokémon Zone’s Season 6 doubles page, not win rates or guaranteed sets. Core lessons are teaching interpretations of common members and mechanics, not a core-usage ranking.",
  ),
  rules: b(
    "双打每方两只同时在场，选四只参战（通常从六只队伍中选择），统一 Lv.50；选队 90 秒、每回合 45 秒、个人时间 7 分钟。物种与携带道具不得重复；每场最多一次 Mega 进化。合法名单以游戏内 M-C 规则为准。",
    "Two active Pokémon per side; select four (normally from a team of six), set to Lv.50. Team preview: 90 seconds; turn timer: 45 seconds; your time: 7 minutes. No duplicate species or held items; at most one Mega Evolution per battle. Check the in-game M-C roster for legality.",
  ),
  sources: [
    {
      id: "official-mc",
      label: b("官方 M-C 公告", "Official M-C announcement"),
      url: "https://www.pokemon.com/us/news/get-ready-for-regulation-set-m-c-in-pokemon-champions",
      note: b(
        "官方新闻目录可核实公告标题；正文抓取不可用。",
        "Official news index confirms the announcement; article body was not retrievable.",
      ),
    },
    {
      id: "serebii-m6-rules",
      label: b("M-6 赛季规则 · Serebii", "M-6 season rules · Serebii"),
      url: "https://www.serebii.net/pokemonchampions/rankedbattle/seasonm-6.shtml",
    },
    {
      id: "serebii-mc-roster",
      label: b(
        "M-C 合法名单与日期 · Serebii",
        "M-C roster and dates · Serebii",
      ),
      url: "https://www.serebii.net/pokemonchampions/rankedbattle/regulationm-c.shtml",
    },
    {
      id: "ranking-season-6",
      label: b(
        "Season 6 双打排名 · Pokémon Zone",
        "Season 6 doubles rankings · Pokémon Zone",
      ),
      url: "https://www.pokemon-zone.com/champions/ranked-seasons/doubles/?page=1",
    },
    {
      id: "serebii-status",
      label: b(
        "Champions 状态变化 · Serebii",
        "Champions status changes · Serebii",
      ),
      url: "https://www.serebii.net/pokemonchampions/statusconditions.shtml",
    },
    {
      id: "showdown-champions",
      label: b(
        "Champions 机制实现 · Pokémon Showdown",
        "Champions mechanics implementation · Pokémon Showdown",
      ),
      url: "https://github.com/smogon/pokemon-showdown/tree/master/data/mods/champions",
    },
    {
      id: "showdown-base",
      label: b(
        "通用招式与特性实现 · Pokémon Showdown",
        "Base moves and abilities · Pokémon Showdown",
      ),
      url: "https://github.com/smogon/pokemon-showdown/tree/master/data",
    },
  ],
  roster: [
    ["轰擂金刚猩", "Rillaboom", "场地与先制", "Terrain / priority"],
    ["大狃拉", "Sneasler", "轻装输出", "Unburden attacker"],
    ["炽焰咆哮虎", "Incineroar", "威吓与转场", "Intimidate / pivot"],
    ["暴飞龙", "Salamence", "Mega 与顺风", "Mega / Tailwind"],
    ["爱管侍♀", "Indeedee-F", "精神场地与引导", "Psychic Terrain / redirect"],
    ["仆刀将军", "Kingambit", "不服输与残局", "Defiant / endgame"],
    ["烈咬陆鲨", "Garchomp", "地面输出", "Ground offense"],
    ["幽尾玄鱼", "Basculegion", "扫墓收尾", "Last Respects cleaner"],
    ["具甲武者", "Golisopod", "物理压力", "Physical pressure"],
    ["赛富豪", "Gholdengo", "特殊输出", "Special offense"],
    ["铝钢桥龙", "Archaludon", "雨天输出", "Rain offense"],
    ["大嘴鸥", "Pelipper", "降雨与支援", "Rain / support"],
  ].map(([zh, en, rzh, ren], i) => ({
    rank: i + 1,
    name: b(`${zh} ${en}`, en),
    role: b(rzh, ren),
  })),
};
export const metaSection = section(
  "meta",
  "当前环境实战室|Current meta lab",
  "M-6 / M-C · 2026-10-03 核实|M-6 / M-C · checked 2026-10-03",
  "✧",
  [
    lesson(
      "meta-terrain",
      "场地核心：轰擂金刚猩／爱管侍＋大狃拉|Terrain cores: Rillaboom / Indeedee + Sneasler",
      [
        "轰擂金刚猩和爱管侍提供不同的场地路线。大狃拉可用对应种子启动轻装，但道具与特性必须通过实际信息确认；常见不等于确定。|Rillaboom and Indeedee enable different terrain modes. Sneasler can consume the matching seed to activate Unburden, but confirm the actual item and ability; common does not mean certain.",
        "对精神场地，先判断目标接地，再决定击掌奇袭能否使用。覆盖成青草场地会改变先制保护，但不会直接取消已经触发的轻装。|Against Psychic Terrain, check the target’s grounding before Fake Out. Replacing it with Grassy Terrain changes priority protection but does not directly cancel activated Unburden.",
        "实战观察：记录种子是否消耗、哪只仍在场、能否安全换入场地手。不要为了覆盖场地白送自己的收尾手。|In battle, track seed consumption, who remains active and whether your terrain setter can switch in safely. Do not sacrifice your cleaner merely to overwrite terrain.",
      ],
      [
        q(
          "meta-seed",
          "精神种子已消耗，轻装已触发；覆盖为青草场地后，大狃拉仍在场且没获得新道具。速度加成？|Psychic Seed was consumed and Unburden activated. Grassy Terrain replaces it; Sneasler stays in and gains no item. The boost?",
          ["仍在|Remains", "立即消失|Immediately ends"],
          0,
          "场地切换不直接清除轻装。|Terrain replacement does not directly remove Unburden.",
        ),
        q(
          "meta-read",
          "看到大狃拉，应把种子当成已确认道具吗？|Does seeing Sneasler confirm it holds a seed?",
          ["是|Yes", "否，仍需观察|No, observe first"],
          1,
          "常见配置用于准备，不用于伪造对局信息。|Popular sets guide preparation, not certainty about this opponent.",
        ),
      ],
    ),
    lesson(
      "meta-balance",
      "平衡核心：轮转与反威吓|Balance cores: pivots and anti-Intimidate",
      [
        "炽焰咆哮虎与轰擂金刚猩能通过击掌和轮转给队友创造行动。遇到仆刀将军先查不服输；遇到赛富豪先查黄金之躯。|Incineroar and Rillaboom can create turns through Fake Out and pivots. Check Defiant before cycling Intimidate into Kingambit, and Good as Gold before targeting Gholdengo.",
        "暴飞龙常见 Mega 进化、巨声和顺风路线。先确定对方速度窗口和范围伤害，再安排守住或广域防守；未看到招式前仍要保留替代配置。|Salamence commonly offers Mega Evolution, Hyper Voice and Tailwind. Account for speed windows and spread damage when planning Protect or Wide Guard, while retaining alternative sets until revealed.",
        "烈咬陆鲨的地面压力要求检查友伤与飞行免疫；具甲武者是本期需要准备的物理威胁。先观察实际形态和招式，不根据名字推断唯一配置。|Garchomp’s Ground pressure demands checks for friendly fire and Flying immunity. Golisopod is a physical threat to prepare for this season. Observe actual forms and moves rather than assuming one set.",
      ],
      [
        q(
          "meta-intim",
          "对手仆刀将军已确认不服输，能把反复威吓当作稳定减伤吗？|Kingambit is confirmed Defiant. Is repeated Intimidate a reliable damage-reduction plan?",
          ["能|Yes", "不能，反而可能强化它|No, it can boost it"],
          1,
          "每次有效触发不服输，都可能让局面更危险。|Each effective Defiant trigger can make the position worse.",
        ),
        q(
          "meta-voice",
          "已确认对方本回合两只都只使用范围攻击，你要保护全队，应考虑？|Both opponents are confirmed to use only spread attacks this turn. To protect your side, consider?",
          ["广域防守|Wide Guard", "看我嘛|Follow Me"],
          0,
          "广域防守对准范围威胁；看我嘛不是范围防守。|Wide Guard addresses spread threats; Follow Me does not.",
        ),
      ],
    ),
    lesson(
      "meta-rain",
      "雨天与残局：大嘴鸥／铝钢桥龙／幽尾玄鱼|Rain and endgames: Pelipper / Archaludon / Basculegion",
      [
        "大嘴鸥＋铝钢桥龙用降雨帮助电光束当回合出手。规划换天气、集火或消耗雨天回合，而不是默认电光束会给你一个蓄力空档。|Pelipper + Archaludon uses rain to fire Electro Shot immediately. Plan weather replacement, focused pressure or stalling rain instead of assuming a free charge turn.",
        "幽尾玄鱼的扫墓 Last Respects 随己方倒下次数变强。常规选四、无复活、其余三只倒下时为 200 威力；不是把队伍预览里未选出的两只也算进去。|Basculegion’s Last Respects strengthens with allied faints. With four selected, no revival and three allies fainted, it reaches 200 power; the two unselected preview members do not count.",
        "残局同时检查锁招、一般属性免疫与先制。即使围巾让普通招式更快，也不让它越过更高优先度，更不允许随意改点水流喷射。|In endgames, check Choice locks, Normal immunity and priority together. Scarf Speed neither beats higher priority nor permits a free switch to Aqua Jet.",
      ],
      [
        q(
          "meta-shot",
          "雨天中，铝钢桥龙的电光束通常需要先花一回合蓄力吗？|In rain, does Archaludon’s Electro Shot normally need a charge turn?",
          ["需要|Yes", "不需要|No"],
          1,
          "雨天跳过蓄力，必须当成当回合的进攻威胁。|Rain skips charging, so treat it as an immediate threat.",
        ),
        q(
          "meta-last",
          "幽尾玄鱼最后一只，无复活、三只参战队友倒下，扫墓威力？|Basculegion is last, with three selected allies fainted and no revival. Last Respects power?",
          ["150|150", "200|200", "300|300"],
          1,
          "50 + 50 × 3 = 200。|50 + 50 × 3 = 200.",
        ),
      ],
    ),
  ],
  [
    q(
      "meta-check1",
      "排位使用排名能证明你眼前的宝可梦携带某个道具吗？|Can usage rank prove this opponent’s held item?",
      ["能|Yes", "不能|No"],
      1,
      "环境资料帮助准备；对局结论来自实际观察。|Meta data helps preparation; in-battle conclusions need observation.",
    ),
    q(
      "meta-check2",
      "赛季结束后应如何对待这份 M-6 环境课？|After the season ends, how should you treat this M-6 module?",
      [
        "永远当成当前排名|Forever as the current ranking",
        "作为注明日期的快照，重新核实|As a dated snapshot to reverify",
      ],
      1,
      "基础机制与当期使用环境应分开维护。|Maintain core mechanics separately from time-sensitive usage.",
    ),
  ],
);

import { buildMetaAdvanced } from "./advanced.mjs";
const applied = buildMetaAdvanced(dq);
metaSection.lessons.forEach((l, i) => {
  l.questions.push(applied.lessons[i]);
});
metaSection.mastery.push(applied.mastery);
