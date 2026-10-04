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
        dq({
          id: "meta-seed",
          level: "applied",
          scene: {
            side: "一只可覆盖成任意场地的支援手，与一个已触发轻装的单体输出手。|A supporter who can overwrite into any terrain, plus a single-target attacker with Unburden already active.",
            foes: "已消耗精神种子的大狃拉（当前速度 240）与 一只特攻手。|Sneasler that consumed its Psychic Seed (now 240 Speed) and a special attacker.",
            field: "第 8 回合，精神场地。|Turn 8, Psychic Terrain active.",
            known: "大狃拉没有获得新道具，本回合不会换下。|Sneasler gained no new item and will not switch this turn.",
          },
          prompt:
            "你覆盖成青草场地之后，大狃拉的速度加成还在吗？|After you overwrite into Grassy Terrain, does Sneasler keep its Speed boost?",
          options: [
            "仍在：场地替换不改写特性状态，而且青草场地还额外保护它不受先制干扰|Still active: the overwrite does not rewrite ability state, and Grassy Terrain additionally protects it from priority",
            "消失：任何场地变化都会重置特性带来的加速|Ends: any terrain change resets an ability-granted speed boost",
            "消失一次后立刻重新触发|Ends once and immediately re-triggers",
          ],
          answer: 0,
          why: [
            "轻装是特性状态，场地只改写场地规则；同时青草场地保护接地单位不受击掌奇袭等先制影响。|Unburden is ability state while the overwrite only edits terrain rules, and Grassy Terrain separately protects grounded Pokémon from priority moves.",
            "没有任何规则让场地替换清除特性状态。|Candidate B invents a rule that does not exist.",
            "加速不会因为场地改变而重新触发，也不会反复刷新。|Candidate C has no mechanic behind it.",
          ],
        }),
        dq({
          id: "meta-read",
          level: "applied",
          scene: {
            side: "一个可以安全换入的场地支援手。|A terrain supporter you can switch in safely.",
            foes: "一只大狃拉（常见配置是轻装，但未确认）与 一只正在施压的输出手。|Sneasler, commonly built around Unburden but unconfirmed, plus an attacker applying pressure.",
            field: "第 3 回合。|Turn 3.",
            known: "排名里大狃拉的轻装使用率很高，但没有任何一条是对局的证据。|Unburden ranks highly on Sneasler, and none of that is evidence about this battle.",
          },
          prompt:
            "在决定要不要为它准备轻装应对时，你应该怎么用这份排名？|How should that ranking inform your Unburden preparation?",
          options: [
            "把它当作准备清单，同时保留“它没带种子或不是轻装”的应对|Use it as a preparation list while keeping the “no seed, not Unburden” answer ready",
            "直接假设它一定带种子且一定是轻装|Assume it certainly holds a seed and is certainly Unburden",
            "因为排名不能证明任何事，所以完全忽略这只宝可梦|Ignore the Pokémon entirely because ranks prove nothing",
          ],
          answer: 0,
          why: [
            "排名是准备用的先验信息，而结论必须来自实际结算，所以两条路线都要留着。|Rankings are a prior for preparation while conclusions come from what actually resolved, so both lines stay open.",
            "把高使用率当成确认，等于在对局第一回合就把结论写死。|Candidate B hard-codes a conclusion before the first turn resolves.",
            "忽略排名会让你在最常见的阵容上毫无准备，而忽略观察会让你把先验当成事实。|Candidate C swaps one error for the other: unprepared for the common case.",
          ],
        }),
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
        dq({
          id: "meta-intim",
          level: "applied",
          scene: {
            side: "一只准备上场触发威吓的输出手，与一只可轮转的支援手。|An attacker about to trigger Intimidate, plus a supporter you can pivot.",
            foes: "已确认不服输的仆刀将军，与一只场地支援手。|Confirmed Defiant Kingambit and a terrain supporter.",
            field: "第 5 回合。|Turn 5.",
            known: "从 0 级开始被威吓，会先 -1 再触发不服输 +2。|Intimidating from neutral costs -1 first and then triggers Defiant for +2.",
          },
          prompt:
            "把反复威吓当成稳定减伤方案，在这一局会发生什么？|What happens if you treat repeated Intimidate as reliable damage reduction?",
          options: [
            "仆刀将军净 +1 攻击，威吓反而在喂它；减伤方案变成强化对方的方案|Kingambit ends at net +1 Attack, so Intimidate feeds it; your damage-reduction plan becomes their setup",
            "仆刀将军会被稳定压到 -1 或更低|Kingambit will be reliably held at -1 or lower",
            "威吓对不服输无效，所以相当于白送一个动作|Intimidate has no effect on Defiant, so it is simply a wasted action",
          ],
          answer: 0,
          why: [
            "先 -1 再 +2，净 +1；把对方强化成可执行计划，才是这局真正的结果。|Minus one plus two is a net +1, and turning that boost into an executable plan is the real outcome.",
            "这是这份快照里最常见的自伤动作，必须在预览阶段就排除。|Candidate B is the mistake this snapshot exists to prevent.",
            "它并非无效，而是结果与预期相反。|Candidate C is wrong about the direction of the effect.",
          ],
        }),
        dq({
          id: "meta-voice",
          level: "applied",
          scene: {
            side: "两只都需要保住的核心，其中后排能使用看我嘛或广域防守。|Two cores you need to keep, one of which can use Follow Me or Wide Guard.",
            foes: "已确认本回合两只都只使用范围攻击。|Both opponents are confirmed to use only spread attacks this turn.",
            field: "第 6 回合。|Turn 6.",
            known: "范围攻击对两只同时生效，看我嘛只改变单体目标指向。|A spread move hits both at once, while Follow Me only redirects single-target moves.",
          },
          prompt: "要保护全队时，哪一个选项才对？|Which option correctly protects the whole side?",
          options: [
            "广域防守：它直接针对范围威胁本身|Only Wide Guard, because it addresses the spread threat itself",
            "看我嘛：它把对手的招式引到你身上|Only Follow Me, because it pulls their attacks onto you",
            "两者都可以，效果完全相同|Either one works and they are equivalent",
          ],
          answer: 0,
          why: [
            "广域防守挡的是范围招式这整件事，正好对应你描述的威胁类型。|Wide Guard blocks the spread category itself, which is exactly the threat described.",
            "看我嘛只重定向单体招式，对两只同时生效的范围攻击无效。|Follow Me redirects single-target moves only, so it does nothing against a spread attack hitting both.",
            "两者作用范围不同，不等价。|Candidate C treats them as interchangeable when they answer different threats.",
          ],
        }),
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
        dq({
          id: "meta-shot",
          level: "applied",
          scene: {
            side: "一只需要处理雨天压力的支援手，与一只刚上场的雷系输出手。|A supporter handling rain pressure, plus a freshly switched-in Lightning attacker.",
            foes: "大嘴鸥（已确认降雨）与 一只雨天干燥手。|Confirmed Rain Pelipper and a Dry Weather user.",
            field: "第 4 回合，已确认当前为雨天。|Turn 4, rain confirmed active.",
            known: "雨天让电光束当回合以双倍威力发动，不需要蓄力回合。|Rain lets Electro Shot fire at double power this turn with no charge turn.",
          },
          prompt: "面对雨天铝钢桥龙的电光束，计划应该怎么算？|How should you plan around Archaludon’s Electro Shot in rain?",
          note: TRAINING_NOTE,
          options: [
            "把它当成当回合的进攻威胁，而不是一个蓄力空档|Treat it as an immediate attacking threat, not as a free charge turn",
            "利用它第一回合必须蓄力这一点来先手压制|Use the turn it must charge as a free chance to attack first",
            "雨天会自动帮你取消对手的行动|Rain cancels the opponent’s action for you",
          ],
          answer: 0,
          why: [
            "雨天下电光束当回合就能打出双倍威力，所以“它还在准备”这个窗口不存在。|In rain Electro Shot deals its doubled damage immediately, so the setup window you were counting does not exist.",
            "这一条正是雨天与晴天的区别所在，也是准备阶段最常犯的错。|Candidate B is the exact mistake this snapshot flags.",
            "雨天只改变招式效果，不会代替你行动。|Candidate C describes rain as if it acted for you.",
          ],
        }),
        dq({
          id: "meta-last",
          level: "applied",
          scene: {
            side: "围巾幽尾玄鱼，已锁招扫墓。|Scarf Basculegion locked into Last Respects.",
            foes: "一只一般属性的目标，与一只会反击的输出手。|A Normal-typing target and an attacker that counters.",
            field: "第 9 回合，你方三只参战队友已倒下且无复活。|Turn 9; three selected allies fainted with no revival.",
            known: "扫墓按倒下队友数量提高威力：50 + 50 × 3 = 200。|Last Respects gains power per fainted ally: 50 + 50 × 3 = 200.",
          },
          prompt:
            "这个残局里，扫墓的威力与目标该怎么判断？|How do you read Last Respects’ power and target in this endgame?",
          options: [
            "威力是 200，但它对一般属性免疫，所以它不是这只目标|The power is 200, but a Normal-type target is immune, so this was never its matchup",
            "威力是 200，而且可以直接改用水流喷射|Power 200, and it can freely switch to Aqua Jet",
            "威力是 150，因为它只算两只选出的队友|Power 150, because only two selected allies count",
          ],
          answer: 0,
          why: [
            "威力结算与属性免疫是两件事：200 正确，但这个目标本就免疫，所以该换目标而不是继续打它。|Power and immunity are separate: 200 is right, and the target is immune, so you change targets rather than keep attacking.",
            "围巾已经锁招扫墓，无法在同一回合改点别的招式。|Candidate B ignores the Choice lock.",
            "三只参战队友都已倒下，50 + 50 × 3 才是结算方式。|Candidate C undercounts the fainted allies.",
          ],
        }),
      ],
    ),
  ],
  [
    dq({
      id: "meta-check1",
      level: "applied",
      scene: {
        side: "一个根据环境排名准备好的第一回合计划。|A turn-one plan built from the environment rankings.",
        foes: "大狃拉、仆刀将军与赛富豪，都按常见配置出现过。|Sneasler, Kingambit and Gholdengo, all seen with their common sets.",
        field: "对局预览，第 1 回合。|Match preview, turn one.",
        known: "排名是 M-6 Season 6 的双打使用率快照，不含任何本场信息。|The rankings are a Season 6 usage snapshot and contain nothing about this battle.",
      },
      prompt: "排位使用排名能证明你眼前的宝可梦携带某个道具吗？|Can usage rank prove this opponent’s held item?",
      options: [
        "不能：环境资料用于准备，本场结论必须来自实际结算|Cannot: meta data prepares you, while conclusions come from what resolves",
        "能：使用率足够高的配置可以直接当成事实|Can: a high usage rate is close enough to certainty",
      ],
      answer: 0,
      why: [
        "排名描述的是别人怎么打，不是这一场发生了什么。|Rankings describe how others play, not what happened in this battle.",
        "把先验当成事实会让你在最关键的判断上下错注。|Candidate B is how a prior turns into a wrong in-bet conclusion.",
      ],
    }),
    dq({
      id: "meta-check2",
      level: "applied",
      scene: {
        side: "准备在 M-6 赛季结束后继续使用这份环境课。|You plan to keep using this module after the M-6 season ends.",
        foes: "一个可能已更新的合法名单与新的当期环境。|An updated roster and a new current meta.",
        field: "2026-10-07 赛季结束之后。|After the season ends on 2026-10-07.",
        known: "这份快照自带 verified 与 reviewAfter 日期。|This snapshot carries its own verified and reviewAfter dates.",
      },
      prompt: "赛季结束后应如何对待这份 M-6 环境课？|After the season ends, how should you treat this M-6 module?",
      options: [
        "作为注明日期的快照重新核实，并与基础机制课分开维护|Treat it as a dated snapshot to reverify, maintained separately from the core mechanics",
        "永远当成当前排名使用|Forever as the current ranking",
        "直接删除整个环境课|Just delete the whole module",
      ],
      answer: 0,
      why: [
        "快照的价值在于它标了日期，所以到期重新核实是流程的一部分，而不是错误。|A snapshot is valuable precisely because it is dated, so reverifying on schedule is part of the process.",
        "不重新核实就等于把旧数据当新数据用。|Candidate B treats old data as current.",
        "删掉会连同基础机制课一起丢失，而两者本来就该分开。|Candidate C loses the durable lessons along with the dated part.",
      ],
    }),
    dq({
      id: "meta-check3",
      level: "applied",
      scene: {
        side: "一支想沿用上赛季热门队伍的四只参战阵容。|A four-Pokémon selection carried over from last season’s popular roster.",
        foes: "一个可能已经更换合法名单的当期规则集。|A current regulation whose legal roster may have changed.",
        field: "对局预览，第 1 回合。|Match preview, turn one.",
        known: "合法名单以游戏内当期 M-C 规则为准，赛季结束后会变。|Legality follows the in-game M-C roster, which changes when the season ends.",
      },
      prompt: "沿用上赛季队伍时，哪一条才是可靠的判断？|When carrying a roster over, which judgement is reliable?",
      options: [
        "以当期游戏内合法名单为准，并按当期环境重新检查每只的定位|Check the current in-game legal roster and re-check every member’s role against the current meta",
        "上赛季排名高就说明这赛季仍然合法|High placement last season means it is still legal this season",
        "环境课里出现过就代表当前合法|A Pokémon appearing in the module is currently legal",
      ],
      answer: 0,
      why: [
        "排名与课程内容都可能是过期的，唯一可靠的是当期游戏内名单。|Placements and module copy can both be stale; only the current in-game roster is authoritative.",
        "排名描述的是上赛季，不构成当期合法性证明。|Candidate B reads last season’s results as this season’s legality.",
        "环境课是注明日期的快照，不是当期名单。|Candidate C mistakes a dated snapshot for a live roster.",
      ],
    }),
  ],
);
