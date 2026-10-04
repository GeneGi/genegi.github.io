// Stable IDs are part of the local progress contract. Keep them when editing copy.
export const b = (zh, en) => ({ zh, en });
const t = (text) => {
  const [zh, en] = text.split("|");
  return b(zh, en);
};
const q = (id, prompt, options, answer, explanation, type = "single") => ({
  id,
  prompt: t(prompt),
  options: options.map(t),
  answer,
  explanation: t(explanation),
  type,
});
const lesson = (id, title, cards, questions) => ({
  id,
  title: t(title),
  cards: cards.map(t),
  questions,
});
const section = (id, title, summary, icon, lessons, mastery) => ({
  id,
  title: t(title),
  summary: t(summary),
  icon,
  lessons,
  mastery,
});
export const sections = [
  section(
    "types",
    "属性与免疫|Types & immunities",
    "先判断能不能打，再判断有多痛。|Check whether a move connects before its damage.",
    "◈",
    [
      lesson(
        "type-basics",
        "找到有效的攻击|Find an effective attack",
        [
          "每只宝可梦最多有两个属性。招式分别对两个防守属性结算，再把倍率相乘：2 × 2 = 4；2 × 0.5 = 1；任何数 × 0 = 0。|A Pokémon has up to two types. Multiply a move’s effectiveness against both: 2 × 2 = 4; 2 × 0.5 = 1; anything × 0 = 0.",
          "记住常见免疫：一般 ↔ 幽灵、格斗 → 幽灵、地面 → 飞行、电 → 地面、超能力 → 恶、龙 → 妖精、毒 → 钢。特性也可能改变结果，例如飘浮 Levitate 免疫地面。|Key immunities: Normal ↔ Ghost, Fighting → Ghost, Ground → Flying, Electric → Ground, Psychic → Dark, Dragon → Fairy, Poison → Steel. Abilities can change the result: Levitate grants Ground immunity.",
          "双打要看两个对手，也要看后排能换进来的属性。属性克制不等于必定击倒；伤害还受能力、招式和道具影响。|Check both opponents and possible switches. A super-effective hit is not a guaranteed KO; stats, moves and items still matter.",
        ],
        [
          q(
            "type-ice",
            "冰招式打龙／地面的烈咬陆鲨，属性倍率？|What is Ice effectiveness against Dragon/Ground Garchomp?",
            ["1×|1×", "2×|2×", "4×|4×"],
            2,
            "冰分别克制龙和地面，2 × 2 = 4。|Ice is super effective against both types: 2 × 2 = 4.",
          ),
          q(
            "type-zero",
            "不考虑特性和道具，哪些攻击无效？（多选）|Ignoring abilities and items, which attacks do no damage? (Select all.)",
            [
              "电 → 地面|Electric → Ground",
              "龙 → 妖精|Dragon → Fairy",
              "水 → 火|Water → Fire",
            ],
            [0, 1],
            "免疫是 0 倍。水打火则是 2 倍。|Immunity means ×0. Water against Fire is ×2.",
            "multi",
          ),
        ],
      ),
    ],
    [
      q(
        "type-check1",
        "地面招式打水／飞行的大嘴鸥？|Ground move against Water/Flying Pelipper?",
        ["0×|0×", "1×|1×", "2×|2×"],
        0,
        "飞行属性带来的免疫优先于另一个属性的倍率。|Flying immunity makes the combined multiplier zero.",
      ),
      q(
        "type-check2",
        "幽灵招式打一般／超能力的爱管侍？|Ghost move against Normal/Psychic Indeedee?",
        ["2×|2×", "0×|0×", "1×|1×"],
        1,
        "一般属性免疫幽灵；超能力的弱点不会取消免疫。|Normal is immune to Ghost; Psychic’s weakness cannot cancel that immunity.",
      ),
    ],
  ),
  section(
    "damage",
    "伤害直觉|Damage intuition",
    "物攻、特攻与本系加成。|Physical, special and same-type bonuses.",
    "✦",
    [
      lesson(
        "damage-basics",
        "先看招式分类|Read the move category",
        [
          "物理 Physical 通常用攻击 Attack 对防御 Defense；特殊 Special 通常用特攻 Sp. Atk 对特防 Sp. Def。接触 Contact 是另一项属性，不等于物理。|Physical moves normally use Attack against Defense; special moves use Sp. Atk against Sp. Def. Contact is a separate property, not a synonym for physical.",
          "招式属性与使用者任一属性相同，通常有 1.5 倍本系加成 STAB。适应力 Adaptability 等特性会改变它。威力不是最终伤害。|Matching either of the user’s types normally gives a 1.5× same-type attack bonus (STAB). Abilities such as Adaptability modify it. Base power is not final damage.",
          "简化比较：同条件下，80 威力本系约等于 120 威力非本系。实际伤害还有随机浮动、耐久、天气等因素；不要仅凭血条假定必杀。|For intuition, 80 power with STAB resembles 120 without STAB under otherwise equal conditions. Damage rolls, bulk and weather still matter; a health bar alone does not prove a KO.",
        ],
        [
          q(
            "damage-stab",
            "通常情况下，80 威力本系的简化等效威力？|Normally, what is the rough effective power of an 80-power STAB move?",
            ["80|80", "120|120", "160|160"],
            1,
            "80 × 1.5 = 120。这只是比较，不是最终扣血。|80 × 1.5 = 120. This is a comparison, not exact HP damage.",
          ),
          q(
            "damage-special",
            "喷射火焰 Flamethrower 通常用哪组能力？|Which stats does Flamethrower normally use?",
            ["攻击／防御|Attack / Defense", "特攻／特防|Sp. Atk / Sp. Def"],
            1,
            "喷射火焰是特殊招式。|Flamethrower is a special move.",
          ),
        ],
      ),
    ],
    [
      q(
        "damage-check1",
        "物攻被威吓降低，会直接降低喷射火焰的伤害吗？|Does an Attack drop from Intimidate directly weaken Flamethrower?",
        ["会|Yes", "不会|No"],
        1,
        "特攻没有因此降低。|The Special Attack stat has not been reduced.",
      ),
      q(
        "damage-check2",
        "属性克制的攻击一定击倒对手？|Does a super-effective attack always KO?",
        ["是|Yes", "否|No"],
        1,
        "还需考虑威力、攻防、剩余血量和随机伤害。|Power, offensive and defensive stats, remaining HP and damage rolls matter.",
      ),
    ],
  ),
  section(
    "speed",
    "谁先行动|Who moves first",
    "速度、先制、顺风与空间。|Speed, priority, Tailwind and Trick Room.",
    "↯",
    [
      lesson(
        "speed-order",
        "先看优先度，再看速度|Priority before Speed",
        [
          "先比较招式优先度，再在同一优先度内比较有效速度。速度相同通常随机。击掌奇袭 Fake Out 为 +3，水流喷射 Aqua Jet 和突袭 Sucker Punch 为 +1；普通攻击通常为 0。|Compare move priority first, then effective Speed within that bracket. Speed ties are normally random. Fake Out is +3; Aqua Jet and Sucker Punch are +1; most attacks are 0.",
          "顺风 Tailwind 让己方速度翻倍，持续 4 回合（含使用回合）。戏法空间 Trick Room 持续 5 回合（含使用回合），让同优先度内更慢者先动；不会倒转优先度。|Tailwind doubles your side’s Speed for 4 turns including activation. Trick Room lasts 5 turns including activation and reverses Speed order within a priority bracket, not priority itself.",
          "空间本身是 -7 优先度。不要以为慢速空间手会先开空间。速度变化可以影响本回合尚未行动的宝可梦；每回合重新检查场地和剩余回合。|Trick Room itself has -7 priority. A slow setter does not normally set it before attacks. Speed changes can affect Pokémon yet to act this turn; recheck field effects and remaining turns.",
        ],
        [
          q(
            "speed-priority",
            "空间下，+1 水流喷射和 0 优先度普通攻击谁先？|Under Trick Room, which goes first: +1 Aqua Jet or a priority-0 attack?",
            ["水流喷射|Aqua Jet", "较慢的宝可梦|The slower Pokémon"],
            0,
            "空间不倒转优先度。|Trick Room does not reverse priority brackets.",
          ),
          q(
            "speed-tailwind",
            "100 速度在顺风下，能超过无加成的 180 速度吗？|Can 100 Speed under Tailwind outspeed an unboosted 180 at equal priority?",
            ["能|Yes", "不能|No"],
            0,
            "100 × 2 = 200，大于 180。|100 × 2 = 200, which exceeds 180.",
          ),
        ],
      ),
    ],
    [
      q(
        "speed-check1",
        "空间下同为 0 优先度，速度 60 和 120 谁先？|Under Trick Room, both use priority-0 moves. Who acts first: 60 or 120 Speed?",
        ["60|60", "120|120"],
        0,
        "同优先度内，空间让慢者先行动。|Trick Room makes the slower Pokémon act first within the bracket.",
      ),
      q(
        "speed-check2",
        "突袭和青草场地下接地使用者的青草滑梯都是 +1，正常情况下谁先？|Sucker Punch and a grounded user’s Grassy Glide in Grassy Terrain are both +1. Without Trick Room, who acts first?",
        [
          "有效速度较快者|The higher effective Speed",
          "固定青草滑梯|Always Grassy Glide",
        ],
        0,
        "同优先度再比较速度。|Compare Speed after priority ties.",
      ),
    ],
  ),
  section(
    "status",
    "异常状态|Status conditions",
    "削弱输出，管理不确定性。|Reduce damage and manage uncertainty.",
    "☷",
    [
      lesson(
        "status-basics",
        "状态不是控制保证|Status is not a guarantee",
        [
          "灼伤 Burn 通常让物理招式伤害减半，并持续扣血；毅力 Guts 等例外需单独判断。麻痹 Paralysis 让速度减半。|Burn normally halves physical move damage and chips HP; exceptions such as Guts matter. Paralysis halves Speed.",
          "Champions 的麻痹每次行动有 12.5% 无法出招，不能照搬旧作的 25%。睡眠第二次行动检查有 1/3 概率醒来，第三次必醒；冰冻每次检查有 25% 解冻，第三次必解冻。|In Champions, paralysis prevents a move 12.5% of the time, not the older 25%. Sleep has a 1/3 wake chance on the second action check and guarantees waking on the third. Freeze has a 25% thaw chance per check and guarantees thawing on the third.",
          "中毒 Poison 持续扣血，剧毒 Toxic 的伤害逐步增加。火属性通常不灼伤、电属性不麻痹、毒和钢属性通常不中毒。畏缩 Flinch 只影响该回合还没行动的目标；换下不会治好普通异常状态。|Poison chips HP; bad poison escalates. Fire types normally cannot be burned, Electric types cannot be paralyzed, and Poison/Steel types normally cannot be poisoned. Flinching only stops a target that has not acted that turn. Switching does not cure ordinary status.",
        ],
        [
          q(
            "status-burn",
            "通常更适合用鬼火 Will-O-Wisp 削弱谁？|Who is usually the better Will-O-Wisp target?",
            ["物理输出手|A physical attacker", "特殊输出手|A special attacker"],
            0,
            "灼伤通常降低物理伤害。也要先排除火属性和毅力等例外。|Burn normally reduces physical damage; first check Fire typing and exceptions such as Guts.",
          ),
          q(
            "status-para",
            "Champions 麻痹无法行动的概率？|Champions full-paralysis chance?",
            ["12.5%|12.5%", "25%|25%", "50%|50%"],
            0,
            "是 1/8。大多数回合依然能行动，不能把麻痹当成稳定保护。|It is 1/8. Most turns still allow a move, so paralysis is not reliable protection.",
          ),
        ],
      ),
    ],
    [
      q(
        "status-check1",
        "已行动目标这回合再畏缩，会撤销刚才的攻击吗？|Will flinching an already-acted target undo its attack?",
        ["会|Yes", "不会|No"],
        1,
        "畏缩阻止尚未进行的行动。|Flinch prevents an action that has not happened yet.",
      ),
      q(
        "status-check2",
        "下列哪些通常成立？（多选）|Which normally hold? (Select all.)",
        [
          "火属性免疫灼伤|Fire types are immune to burn",
          "麻痹降低速度|Paralysis reduces Speed",
          "换下必定治好中毒|Switching always cures poison",
        ],
        [0, 1],
        "普通换下不会治疗中毒；特殊特性另论。|Ordinary switching does not cure poison; specific abilities may.",
        "multi",
      ),
    ],
  ),
  section(
    "position",
    "守住与换位|Protect & positioning",
    "让两只宝可梦一起创造优势。|Make both slots work toward an advantage.",
    "⬡",
    [
      lesson(
        "position-basics",
        "花一回合，买一个机会|Spend a turn to gain an opening",
        [
          "守住 Protect 通常挡住本回合针对自己的招式。它可以侦察、消耗对方顺风／空间回合，让队友击倒威胁。连续使用成功率降低；它不是每回合的免费保险。|Protect usually blocks moves aimed at the user that turn. Scout, stall Tailwind or Trick Room, or let your partner remove a threat. Consecutive use becomes less reliable; it is not free insurance every turn.",
          "主动换人通常在招式前发生。换入者承受原本打向该位置的攻击；换下通常清除能力等级变化。不要只看换入者能不能活，还要看队友是否会被集火。|Manual switching normally happens before moves. The incoming Pokémon receives attacks aimed at that slot; switching out normally clears stat stages. Consider both the switch-in’s safety and whether its partner can be doubled.",
          "慢速转场（例如成功的抛下狠话 Parting Shot）能让队友在承受对手行动之后上场，但要检查免疫。守住一边、另一边输出，往往比两边盲打更有计划。|A slow pivot such as a successful Parting Shot can bring an ally in after enemy moves, but immunities matter. Protecting one slot while attacking with the other can create a deliberate sequence.",
        ],
        [
          q(
            "position-protect",
            "你的残血主力被威胁，队友本回合能可靠击倒威胁。优先考虑？|Your low-HP win condition is threatened; its partner can reliably KO that threat this turn. Consider?",
            [
              "主力守住，队友击倒威胁|Protect the win condition; attack with its partner",
              "主力必须一起攻击|Both must attack",
            ],
            0,
            "让队友处理威胁，保留主力的下一回合。前提是守住能挡住该招式。|Preserve the win condition for next turn, assuming Protect blocks the incoming move.",
          ),
          q(
            "position-switch",
            "攻击通常会打向换入该位置的新宝可梦吗？|Does an attack normally hit the Pokémon switched into the targeted slot?",
            [
              "会|Yes",
              "不会，攻击自动落空|No, switching automatically dodges it",
            ],
            0,
            "换人不是自动闪避。利用抗性和免疫接招。|Switching is not an automatic dodge. Use resistances and immunities.",
          ),
        ],
      ),
    ],
    [
      q(
        "position-check1",
        "对手空间只剩最后一回合，双守住一定错误吗？|Is double Protect always wrong when opposing Trick Room has one turn left?",
        ["是|Yes", "否|No"],
        1,
        "如果能安全耗尽空间，让下回合有利，双守住可以合理。|It can be useful if it safely stalls the last turn and restores your advantage.",
      ),
      q(
        "position-check2",
        "攻击 +2 的宝可梦普通换下再回来，通常剩几级？|A +2 Attack Pokémon switches out normally and returns. What is its usual Attack stage?",
        ["+2|+2", "0|0"],
        1,
        "普通换下会清除能力等级变化。|Normal switching clears stat-stage changes.",
      ),
    ],
  ),
  section(
    "doubles",
    "双打的两条战线|Two slots, one plan",
    "选四、集火、范围招式与友伤。|Pick four, double-target, spread and friendly fire.",
    "▧",
    [
      lesson(
        "doubles-basics",
        "每次都看四个位置|Read all four positions",
        [
          "Champions 排位双打每方同时上场两只，通常从六只队伍中选四只参战。单打选三只，不能把单打人数套到双打。未选出的两只不算倒下的队友。|Champions ranked doubles has two active Pokémon per side; normally choose four from a team of six. Singles chooses three. Unselected Pokémon do not count as fainted allies.",
          "范围招式能同时命中多个目标；当有多个目标时，伤害通常有 0.75 倍修正。地震 Earthquake 也会打队友；热风 Heat Wave 只打对手。广域防守 Wide Guard 是需要预判的反制。|Spread moves can hit multiple targets and normally receive a 0.75× damage modifier with multiple targets. Earthquake also hits an ally; Heat Wave only hits opponents. Anticipate Wide Guard.",
          "集火 Double-target 能突破耐久或气势披带 Focus Sash，却可能两招一起打进守住。范围攻击通常不被看我嘛 Follow Me 改向；先判断你要稳定削血还是集中击倒。|Double-targeting can overcome bulk or Focus Sash, but both moves can land into Protect. Spread attacks are normally not redirected by Follow Me. Decide between reliable chip and a focused KO.",
        ],
        [
          q(
            "doubles-four",
            "标准双打从六只中选几只实际参战？|In standard doubles, how many of six enter battle?",
            ["3|3", "4|4", "6|6"],
            1,
            "双打选四；不是原对话中的三只。|Doubles selects four, correcting the earlier three-Pokémon example.",
          ),
          q(
            "doubles-earth",
            "己方队友接地且不免疫地面，点击地震前应检查？|Your partner is grounded and not Ground-immune. Before Earthquake, check?",
            [
              "是否会伤到队友|Whether it hits your partner",
              "只需要看对手|Only the opponents",
            ],
            0,
            "地震会命中相邻队友。可考虑队友守住或换入免疫。|Earthquake hits adjacent allies; consider Protect or an immune switch-in.",
          ),
        ],
      ),
    ],
    [
      q(
        "doubles-check1",
        "看我嘛通常能把热风从队友身上引走吗？|Does Follow Me normally redirect Heat Wave away from its partner?",
        ["能|Yes", "不能|No"],
        1,
        "它是范围招式，不按单体招式改向。|Heat Wave is a spread move, not a redirectable single-target attack.",
      ),
      q(
        "doubles-check2",
        "双打四只中三只已倒下，无复活，扫墓基础威力？|Three of your four selected Pokémon have fainted, with no revival. Last Respects base power?",
        ["150|150", "200|200", "250|250"],
        1,
        "50 + 50 × 3 = 200；未选出的两只不计入。|50 + 50 × 3 = 200. Unselected Pokémon do not count.",
      ),
    ],
  ),
  section(
    "terrain",
    "场地争夺|Terrain control",
    "接地、先制保护与场地覆盖。|Grounding, priority protection and overwriting.",
    "❋",
    [
      lesson(
        "terrain-basics",
        "谁真的站在场地上？|Who is actually grounded?",
        [
          "场地 Terrain 和天气 Weather 可以同时存在。通常飞行属性、飘浮或气球使用者不接地；大多数场地效果只影响接地者。|Terrain and weather coexist. Flying types, Levitate users and Air Balloon holders are normally ungrounded; most terrain effects require grounding.",
          "精神场地 Psychic Terrain 阻挡对手针对接地目标的先制招式。青草场地 Grassy Terrain 帮助接地者回血，并让接地使用者的青草滑梯 Grassy Glide 获得 +1 优先度。|Psychic Terrain blocks opponents’ priority moves against grounded targets. Grassy Terrain heals grounded Pokémon and grants +1 priority to a grounded user’s Grassy Glide.",
          "电气场地 Electric Terrain 防止接地者入睡；薄雾场地 Misty Terrain 防止接地者陷入异常状态，并降低其受到的龙属性伤害。新场地覆盖旧场地，通常持续 5 回合。|Electric Terrain prevents grounded Pokémon from falling asleep. Misty Terrain protects grounded Pokémon from status and reduces Dragon damage they receive. New terrain replaces the old and normally lasts 5 turns.",
        ],
        [
          q(
            "terrain-fake",
            "精神场地下，对接地对手击掌奇袭？|Fake Out against a grounded opponent in Psychic Terrain?",
            ["被场地阻挡|Blocked by terrain", "正常畏缩|Normal flinch"],
            0,
            "保护取决于目标接地，不是使用者接地。|Protection depends on the target being grounded, not the attacker.",
          ),
          q(
            "terrain-coexist",
            "下雨与青草场地能同时存在吗？|Can rain coexist with Grassy Terrain?",
            ["能|Yes", "不能|No"],
            0,
            "天气和场地是两套独立状态。|Weather and terrain are separate field effects.",
          ),
        ],
      ),
    ],
    [
      q(
        "terrain-check1",
        "精神场地保护通常不接地的飞行属性目标免受先制吗？|Does Psychic Terrain protect an ordinarily ungrounded Flying target from priority?",
        ["是|Yes", "否|No"],
        1,
        "目标必须接地。|The target must be grounded.",
      ),
      q(
        "terrain-check2",
        "电气场地会让已经睡着的接地宝可梦立即醒来吗？|Does Electric Terrain immediately wake an already-asleep grounded Pokémon?",
        ["会|Yes", "不会|No"],
        1,
        "它防止新入睡，不治疗已有睡眠。|It prevents new sleep; it does not cure existing sleep.",
      ),
    ],
  ),
  section(
    "weather",
    "天气与回合数|Weather & turn economy",
    "雨、晴、沙、雪如何影响计划。|Rain, sun, sand and snow change your plan.",
    "☂",
    [
      lesson(
        "weather-basics",
        "天气是有限的窗口|Weather is a limited window",
        [
          "雨天 Rain 通常加强水招式、削弱火招式；晴天 Sun 相反。悠游自如 Swift Swim 在雨中加速，叶绿素 Chlorophyll 在晴天下加速。不要只看伤害，不看出手顺序。|Rain normally boosts Water and weakens Fire; sun does the reverse. Swift Swim speeds up in rain and Chlorophyll in sun. Check turn order as well as damage.",
          "沙暴 Sand 给岩石属性特防加成并伤害不免疫者；雪 Snow 给冰属性防御加成，不造成旧作冰雹式的持续伤害。天气由后生效的天气覆盖。|Sand boosts Rock-type Special Defense and chips nonimmune Pokémon. Snow boosts Ice-type Defense without old hail’s chip damage. A later weather effect replaces the previous one.",
          "常规天气持续 5 回合；对应岩石道具可延长至 8 回合。守住、换人、替换天气都能消耗对手的输出窗口。雨中铝钢桥龙 Archaludon 的电光束 Electro Shot 不必蓄力。|Standard weather lasts 5 turns, extended to 8 by the matching rock. Protect, switching and replacement weather can spend the opponent’s window. In rain, Archaludon’s Electro Shot skips its charge turn.",
        ],
        [
          q(
            "weather-rain",
            "对手依赖悠游自如，换掉雨天可能改变什么？（多选）|Removing rain against Swift Swim can change what? (Select all.)",
            [
              "速度顺序|Speed order",
              "水招式伤害|Water damage",
              "宝可梦属性|Pokémon typing",
            ],
            [0, 1],
            "天气影响加速特性及伤害，不会因此改变属性。|Weather affects speed abilities and damage, not typing by itself.",
            "multi",
          ),
          q(
            "weather-snow",
            "Champions 雪天会像旧作冰雹那样每回合伤害非冰属性吗？|Does snow chip non-Ice Pokémon like old hail?",
            ["会|Yes", "不会|No"],
            1,
            "雪提供冰属性防御加成，不自带冰雹扣血。|Snow boosts Ice-type Defense and does not inflict hail chip.",
          ),
        ],
      ),
    ],
    [
      q(
        "weather-check1",
        "无延长道具的常规天气，通常持续？|Standard weather without an extending item normally lasts?",
        ["5 回合|5 turns", "永久|Forever"],
        0,
        "要把触发当回合也算入窗口。|Count the activation turn in the window.",
      ),
      q(
        "weather-check2",
        "雨天对火属性攻击通常怎样？|What does rain normally do to Fire attacks?",
        ["加强|Boosts them", "削弱|Weakens them"],
        1,
        "常规雨天将火伤害减半。|Ordinary rain halves Fire damage.",
      ),
    ],
  ),
  section(
    "items",
    "道具读牌|Read the held item",
    "锁招、保命、种子与 Mega。|Choice locks, survival, seeds and Mega Evolution.",
    "◇",
    [
      lesson(
        "item-basics",
        "道具就是行动约束|Items shape available actions",
        [
          "讲究围巾 Choice Scarf 提高速度，但锁定招式；讲究头带 Choice Band 和讲究眼镜 Choice Specs 分别提高物攻和特攻，也锁招。通常需要换下解除锁定。|Choice Scarf boosts Speed but locks a move. Choice Band and Choice Specs boost Attack and Special Attack respectively, also locking a move. Switching out normally resets the lock.",
          "气势披带 Focus Sash 在满血时帮你承受一次致命攻击剩 1 HP，但挡不住后续第二次攻击。文柚果 Sitrus Berry 用于恢复；生命宝珠 Life Orb 增伤并付出血量；突击背心 Assault Vest 提高特防但限制变化招式。|Focus Sash lets a full-HP holder survive one lethal hit at 1 HP, not a subsequent hit. Sitrus Berry restores HP; Life Orb trades HP for damage; Assault Vest boosts Special Defense but restricts status moves.",
          "精神种子 Psychic Seed／青草种子 Grassy Seed 在对应场地下消耗并加防，能启动轻装 Unburden。Mega 石占用道具栏；一场只能让一只 Mega 进化，选出阶段就要决定围绕谁打。|Psychic Seed and Grassy Seed are consumed on matching terrain to boost a defense and can activate Unburden. A Mega Stone occupies the item slot; only one Pokémon can Mega Evolve per battle, so plan your selection around it.",
        ],
        [
          q(
            "item-choice",
            "围巾使用者上回合用了扫墓，没换下也没失去道具，本回合能改水流喷射吗？|A Scarf user used Last Respects and neither switched nor lost its item. Can it choose Aqua Jet now?",
            ["不能|No", "可以，先制不受锁招|Yes, priority bypasses the lock"],
            0,
            "先制不会解除讲究锁招。|Priority does not bypass a Choice lock.",
          ),
          q(
            "item-sash",
            "满血披带扛下第一击后，第二只对手还能击倒它吗？|After Sash saves a full-HP target from the first hit, can the second opponent KO it?",
            ["能|Yes", "不能|No"],
            0,
            "披带不是一整回合无敌。|Sash does not grant invulnerability for the whole turn.",
          ),
        ],
      ),
    ],
    [
      q(
        "item-check1",
        "突击背心使用者能正常选择守住吗？|Can an Assault Vest holder normally select Protect?",
        ["能|Yes", "不能|No"],
        1,
        "守住是变化招式，受到背心限制。|Protect is a status move, restricted by Assault Vest.",
      ),
      q(
        "item-check2",
        "队里两只带 Mega 石，能在同场都 Mega 进化吗？|Two team members hold Mega Stones. Can both Mega Evolve in one battle?",
        ["能|Yes", "不能|No"],
        1,
        "每场只能 Mega 进化一只。|Only one Mega Evolution per battle.",
      ),
    ],
  ),
  section(
    "support",
    "辅助招式|Support moves",
    "击掌、引导、防范围与增伤。|Flinch, redirect, block spread and boost damage.",
    "✚",
    [
      lesson(
        "support-basics",
        "让队友做成一件事|Enable your partner",
        [
          "击掌奇袭 Fake Out 只在上场后的首次行动窗口可用，+3 优先度并造成畏缩。检查幽灵免疫、精神场地和防畏缩特性；不能默认每次都能控住。|Fake Out works only in the first-action window after entering, with +3 priority and flinching. Check Ghost immunity, Psychic Terrain and anti-flinch abilities before relying on it.",
          "看我嘛 Follow Me 用来吸引可改向的单体攻击；广域防守 Wide Guard 保护己方免受范围攻击。前者不拦范围攻击，后者不拦普通单体攻击。|Follow Me attracts redirectable single-target attacks. Wide Guard protects your side from spread attacks. The former does not redirect spread moves; the latter does not block ordinary single-target attacks.",
          "帮助 Helping Hand 提高队友本回合攻击伤害。支援的目的通常是让队友安全开空间、顺风、强化或完成关键击倒；不要为了点辅助而忘了回合目标。|Helping Hand boosts your partner’s attack damage that turn. Support usually enables speed control, setup or a crucial KO. Choose it for a specific turn objective.",
        ],
        [
          q(
            "support-wide",
            "想同时保护己方两只免受热风，选？|To protect both allies from Heat Wave, choose?",
            ["看我嘛 Follow Me|Follow Me", "广域防守 Wide Guard|Wide Guard"],
            1,
            "热风是范围攻击。|Heat Wave is a spread attack.",
          ),
          q(
            "support-help",
            "队友差一点伤害能击倒关键目标，你的低输出辅助可以考虑？|Your partner is just short of a key KO; what can a low-damage support consider?",
            [
              "帮助 Helping Hand|Helping Hand",
              "毫无目的换人|A switch with no purpose",
            ],
            0,
            "帮助把该回合的输出集中到主攻手。|Helping Hand concentrates damage into the attacker.",
          ),
        ],
      ),
    ],
    [
      q(
        "support-check1",
        "对手只会单体攻击时，广域防守必定保护队友吗？|Does Wide Guard guarantee protection against single-target moves?",
        ["是|Yes", "否|No"],
        1,
        "它针对范围招式，不是全队版守住。|It blocks spread moves, not all attacks against the team.",
      ),
      q(
        "support-check2",
        "辅助招式最有用的选法？|The most useful way to choose a support move?",
        [
          "围绕队友本回合目标|Enable the partner’s goal this turn",
          "固定第一回合击掌|Always Fake Out on turn one",
        ],
        0,
        "先检查对方免疫、目标和队友需要。|First check immunities, threats and what the partner needs.",
      ),
    ],
  ),
  section(
    "disruption",
    "干扰与反强化|Disruption & counter-setup",
    "挑衅、再来一次、黑雾与替身。|Taunt, Encore, Haze and Substitute.",
    "⊘",
    [
      lesson(
        "disrupt-basics",
        "别让对手免费展开|Deny a free setup",
        [
          "挑衅 Taunt 限制变化招式；再来一次 Encore 让目标重复最近使用的招式。速度和出手时机很重要，Mental Herb 心灵香草等也可能解除控制。|Taunt restricts status moves; Encore forces repetition of the last move. Speed and timing matter, and Mental Herb can undo these restrictions.",
          "黑雾 Haze 清除场上所有宝可梦的能力等级变化，也包括自己的强化。清除之烟 Clear Smog 通过毒属性攻击重置目标能力，打钢属性无效，替身也会影响它的重置。|Haze clears stat stages across the field, including your own boosts. Clear Smog resets a target via a Poison attack; Steel immunity and Substitute can prevent its reset.",
          "替身 Substitute 消耗一部分 HP，挡住许多攻击与状态干扰，但不是万能盾：声音招式、穿透 Infiltrator 等能绕过。读到守住或强化，不代表下一回合一定仍用同一招。|Substitute spends HP to buffer many attacks and status effects, but sound moves and Infiltrator can bypass it. Seeing Protect or setup does not guarantee the same choice next turn.",
        ],
        [
          q(
            "disrupt-steel",
            "想清掉钢属性目标的强化，清除之烟可靠么？|Is Clear Smog a reliable way to reset a Steel target’s boosts?",
            ["可靠|Yes", "不可靠，毒免疫|No, Poison immunity"],
            1,
            "选择不依赖毒攻击命中的手段，例如黑雾。|Consider a method such as Haze that does not need a Poison hit.",
          ),
          q(
            "disrupt-haze",
            "黑雾会清掉己方剑舞强化吗？|Does Haze erase your ally’s Swords Dance boosts too?",
            ["会|Yes", "不会|No"],
            0,
            "黑雾影响全场能力等级。|Haze resets stat stages across the field.",
          ),
        ],
      ),
    ],
    [
      q(
        "disrupt-check1",
        "对方受挑衅后还能使用普通伤害招式吗？|Can a Taunted Pokémon still use ordinary damaging moves?",
        ["能|Yes", "不能|No"],
        0,
        "挑衅限制变化招式，不是所有招式。|Taunt restricts status moves, not all moves.",
      ),
      q(
        "disrupt-check2",
        "巨声 Hyper Voice 是声音招式，通常能绕过替身吗？|Can the sound move Hyper Voice normally bypass Substitute?",
        ["能|Yes", "不能|No"],
        0,
        "声音招式是替身需要防范的例外。|Sound moves are an important exception to Substitute protection.",
      ),
    ],
  ),
  section(
    "abilities",
    "特性与连锁|Abilities & interactions",
    "围绕常见对手建立条件反射。|Build habits around relevant interactions.",
    "◎",
    [
      lesson(
        "ability-basics",
        "先检查特性，再点击|Check the ability before clicking",
        [
          "威吓 Intimidate 降低对手攻击一级。不服输 Defiant 受到对手降能力时提高攻击两级；从 0 开始被威吓，结果通常是 +1。好胜 Competitive 则提高特攻。|Intimidate lowers opposing Attack one stage. Defiant raises Attack two stages after an opponent lowers a stat: from neutral, Intimidate normally leaves it at +1. Competitive instead raises Special Attack.",
          "黄金之躯 Good as Gold 阻挡其他宝可梦针对自己的变化招式。赛富豪 Gholdengo 挡住抛下狠话 Parting Shot 时，使用者也不能借它换下。它并非免疫所有场地效果。|Good as Gold blocks other Pokémon’s status moves targeting its user. When Gholdengo blocks Parting Shot, its user does not pivot out. It is not immunity to every field effect.",
          "轻装 Unburden 在丢失或消耗道具后加速；之后覆盖场地不直接撤销加速。换下、重新获得道具等会改变状态。漂浮、引水 Storm Drain 和避雷针 Lightning Rod 提醒你：属性表不是全部。|Unburden speeds up after losing or consuming an item; replacing terrain does not itself remove the boost. Switching out or gaining an item changes the state. Levitate, Storm Drain and Lightning Rod remind you that the type chart is not the whole story.",
        ],
        [
          q(
            "ability-defiant",
            "0 级攻击、不服输的仆刀将军被对手威吓后？|Neutral Defiant Kingambit is Intimidated by an opponent. Final Attack stage?",
            ["-1|-1", "+1|+1", "+2|+2"],
            1,
            "先 -1，再 +2，净 +1。|First -1, then +2, for a net +1.",
          ),
          q(
            "ability-gold",
            "对黄金之躯赛富豪使用抛下狠话，会成功转场吗？|Does Parting Shot pivot out against Good as Gold Gholdengo?",
            ["会|Yes", "不会|No"],
            1,
            "整招被阻挡，不能靠这一招换下。|The move is blocked, including its pivot.",
          ),
        ],
      ),
    ],
    [
      q(
        "ability-check1",
        "种子触发轻装后，对手覆盖场地，轻装是否仅因此消失？|After a seed activates Unburden, does replacing terrain alone remove the boost?",
        ["是|Yes", "否|No"],
        1,
        "加速取决于轻装状态，不持续依赖原场地。|The boost depends on Unburden’s state, not continued matching terrain.",
      ),
      q(
        "ability-check2",
        "看到威吓手，哪类特性需要优先检查？（多选）|Before using Intimidate, which abilities deserve checking? (Select all.)",
        [
          "不服输 Defiant|Defiant",
          "好胜 Competitive|Competitive",
          "降雨 Drizzle|Drizzle",
        ],
        [0, 1],
        "前两者能把降能力转成进攻强化。|The first two can turn a stat drop into offensive boosts.",
        "multi",
      ),
    ],
  ),
  section(
    "decisions",
    "胜利条件与风险|Win conditions & risk",
    "目标优先级，不只是最大伤害。|Target priority, not just maximum damage.",
    "⚑",
    [
      lesson(
        "decision-basics",
        "先想怎么赢，再想打谁|Plan the win before the target",
        [
          "胜利条件 Win condition 是可执行的收尾计划：保住某只清场手、耗尽空间、削到先制招式的击倒线。每回合问：失去谁，我就再也赢不了？|A win condition is an executable finish: preserve a cleaner, stall Trick Room, or chip foes into priority range. Ask each turn: which loss would leave me unable to win?",
          "目标优先级取决于行动影响。击倒空间手、天气手或引导手，可能比打最低血量目标更有价值。也可能先处理输出手；没有脱离局面的固定答案。|Target priority depends on impact. Removing a speed setter, weather setter or redirector may be worth more than attacking the lowest HP. Sometimes the attacker matters most; there is no context-free ranking.",
          "领先时找覆盖对手多个选择的稳定路线；落后时才考虑承担必要风险。命中率、守住、换人和未知道具都要计算。两次独立 90% 命中都中的概率是 81%，不是 90%。|When ahead, prefer lines that cover several replies; when behind, consider necessary risk. Account for accuracy, Protect, switches and unknown items. Two independent 90%-accurate hits both land only 81% of the time.",
        ],
        [
          q(
            "decision-risk",
            "领先且普通攻击能稳定获胜，应该优先？|When ahead with a reliable winning attack, prefer?",
            [
              "可靠路线|The reliable line",
              "没有必要的低命中大招|An unnecessary low-accuracy move",
            ],
            0,
            "不要为无收益的风险牺牲已经存在的胜利路线。|Avoid adding risk without a payoff.",
          ),
          q(
            "decision-prob",
            "两次独立 90% 命中都中的概率？|Probability that two independent 90% accurate moves both hit?",
            ["81%|81%", "90%|90%", "180%|180%"],
            0,
            "0.9 × 0.9 = 0.81。|0.9 × 0.9 = 0.81.",
          ),
        ],
      ),
    ],
    [
      q(
        "decision-check1",
        "残血目标和满血空间手中，必须先打残血目标吗？|Must you target a low-HP foe before a full-HP Trick Room setter?",
        [
          "必须|Always",
          "看哪只更影响胜利路线|It depends on your win condition",
        ],
        1,
        "若空间会让你失去控制，阻止空间可能更重要。|If Trick Room would overturn your advantage, denying it may matter more.",
      ),
      q(
        "decision-check2",
        "未知道具时，最合理的推理方式？|How should you reason about an unknown item?",
        [
          "把最常见道具当作确定事实|Treat the most common item as certain",
          "保留多个可能，并用行动收集信息|Keep alternatives and gather evidence",
        ],
        1,
        "使用率是先验信息，不是这场对战的确认。|Usage is a prior, not confirmation for this battle.",
      ),
    ],
  ),
  section(
    "teams",
    "队伍结构与选出|Archetypes & team preview",
    "六只构队，四只执行。|Build six; execute with four.",
    "▥",
    [
      lesson(
        "team-basics",
        "选择一条能落地的路线|Choose a workable mode",
        [
          "平衡 Balance 用抗性、威吓和转场换取优势；顺风进攻 Tailwind offense 用速度窗口压制；空间 Trick Room 用低速输出反转速度关系；天气队围绕天气增益配合。|Balance uses resistances, Intimidate and pivots. Tailwind offense pressures within a speed window. Trick Room supports slow attackers. Weather teams coordinate around weather benefits.",
          "混合队可以同时有快慢两种模式，但别让自己的顺风和空间互相妨碍。常见职责：输出、速度控制、支援、抗性补位；同一只可承担多个职责。|Hybrid teams can have fast and slow modes, but avoid your own Tailwind and Trick Room conflicting. Common roles are damage, speed control, support and defensive coverage; one Pokémon may fill several.",
          "选出先定主计划，再选首发和后排：谁处理对面关键威胁？谁保住天气／场地？谁收残局？检查重复弱点、道具限制与当期合法名单；别直接搬旧世代努力值方案。|At preview, choose a plan, leads and reserves: who handles the key threat, preserves weather or terrain, and cleans up? Check shared weaknesses, item rules and current legality; do not copy old-generation EV spreads blindly.",
        ],
        [
          q(
            "team-room",
            "慢速主攻手通常更适合哪种控速？|Which speed mode usually suits a slow primary attacker?",
            [
              "戏法空间|Trick Room",
              "盲目追求顺风|Tailwind without checking matchups",
            ],
            0,
            "空间能让低速在同优先度内先动，仍要检查对手速度。|Trick Room can put slow attackers first within a bracket, but compare the opponent’s Speed too.",
          ),
          q(
            "team-preview",
            "选四只时，最好的起点？|Best starting point when selecting four?",
            [
              "四只个人排名最高的|The four highest individual rankings",
              "针对对方六只设计首发和残局|A lead and endgame plan against their six",
            ],
            1,
            "队伍协作和对局计划比单只排名更重要。|Synergy and the matchup plan matter more than isolated rankings.",
          ),
        ],
      ),
    ],
    [
      q(
        "team-check1",
        "有空间手，就必须每场开空间吗？|Must a team with Trick Room use it every game?",
        [
          "必须|Yes",
          "不必，可根据对局选模式|No, choose the mode for the matchup",
        ],
        1,
        "混合模式让你根据速度和威胁调整。|Multiple modes let you adapt to speed relationships and threats.",
      ),
      q(
        "team-check2",
        "队伍缺乏安全换入时，优先补什么？|If your team lacks safe switch-ins, prioritize?",
        [
          "抗性与防守支援|Resistances and defensive support",
          "第五个相同弱点的输出手|Another attacker sharing the same weakness",
        ],
        0,
        "能安全轮转，才能反复创造输出机会。|Safe rotation creates repeated attacking opportunities.",
      ),
    ],
  ),
];
export const placement = [
  sections[0].lessons[0].questions[0],
  sections[0].mastery[0],
  sections[1].lessons[0].questions[0],
  sections[1].mastery[0],
  sections[2].lessons[0].questions[0],
  sections[2].mastery[0],
  sections[3].lessons[0].questions[1],
  sections[3].mastery[1],
];
export const finalQuiz = [
  q(
    "final-priority",
    "残局：你的普通攻击一定先于对方普通攻击且可击倒对方，但仆刀将军可能突袭。能否仅凭速度认定安全？|Endgame: your normal attack outspeeds and KOs, but Kingambit may use Sucker Punch. Is Speed alone enough to call the line safe?",
    ["能|Yes", "不能，要考虑 +1 优先度|No, account for +1 priority"],
    1,
    "更高优先度可能在你出手前击倒你。需考虑守住、变化招式或换人等实际可用选项。|Higher priority may KO you first. Consider available Protect, status or switching options.",
  ),
  q(
    "final-terrain",
    "爱管侍＋大狃拉已开精神场地，大狃拉接地。你需要阻止它这回合输出；击掌奇袭可靠么？|Indeedee + grounded Sneasler have Psychic Terrain active. Is Fake Out reliable to stop Sneasler this turn?",
    ["可靠|Yes", "不可靠，场地阻挡|No, terrain blocks it"],
    1,
    "改找其他控制或防守路线；不要浪费本回合在被场地挡住的先制。|Find another control or defensive line rather than spending the turn on blocked priority.",
  ),
  q(
    "final-rain",
    "雨天大嘴鸥＋铝钢桥龙，对手可能广域防守。哪些信息应影响攻击选择？（多选）|Against rain Pelipper + Archaludon with possible Wide Guard, what should influence your attack? (Select all.)",
    [
      "单体／范围分类|Single-target versus spread",
      "雨天电光束无需蓄力|Rain removes Electro Shot’s charge turn",
      "只看招式威力|Only base power",
    ],
    [0, 1],
    "要同时处理防守选择和对手的进攻节奏。|Account for defensive options and the opposing offensive tempo.",
    "multi",
  ),
  q(
    "final-room",
    "对手空间剩 1 回合；双方都无穿守住招式，你两只都能首次守住，无天气扣血。若下回合速度优势即可胜，合理路线？|Opposing Trick Room has one turn left. Both allies can use fresh Protect; no bypass moves or weather chip. You win with the Speed advantage next turn. A reasonable line?",
    [
      "双守住耗尽空间|Double Protect to stall Trick Room",
      "必须立即攻击|You must attack now",
    ],
    0,
    "题目条件下，保住两只并结束空间能兑现胜利条件。|Under the stated assumptions, preserving both and ending Trick Room realizes the win condition.",
  ),
  q(
    "final-gold",
    "你想用抛下狠话从黄金之躯赛富豪面前转场，队友因此暴露。这个计划哪里错？|You plan to Parting Shot out against Good as Gold Gholdengo, leaving your partner exposed. What is wrong?",
    [
      "抛下狠话被挡，不会转场|Parting Shot is blocked and does not pivot",
      "赛富豪会替你换下|Gholdengo switches you out",
    ],
    0,
    "必须重新选择可执行的转场或防守路线。|Choose a pivot or defensive line that can actually execute.",
  ),
  q(
    "final-cleaner",
    "幽尾玄鱼带围巾，已锁扫墓；三只参战队友倒下，无复活。哪些成立？（多选）|Scarf Basculegion is locked into Last Respects; three selected allies have fainted with no revival. Which hold? (Select all.)",
    [
      "扫墓 200 基础威力|Last Respects has 200 base power",
      "可直接改水流喷射|It can freely choose Aqua Jet",
      "一般属性免疫扫墓|Normal typing is immune to Last Respects",
    ],
    [0, 2],
    "50 + 50 × 3 = 200，但锁招和幽灵免疫依然成立。|50 + 50 × 3 = 200, but the Choice lock and Ghost immunity still apply.",
    "multi",
  ),
  q(
    "final-risk",
    "已确认对手没有守住或先制；你的 100% 命中招式必杀且先动。另一个招式 70% 命中但伤害更高。领先时选？|You confirmed no Protect or priority. Your 100%-accurate move moves first and KOs; another does more damage at 70% accuracy. When ahead, choose?",
    ["100% 命中的击倒|The accurate KO", "70% 的过量伤害|The 70% overkill"],
    0,
    "额外伤害没有收益，未命中却会失去优势。|Extra damage gives no benefit, while a miss risks the advantage.",
  ),
  q(
    "final-adapt",
    "队伍有快慢双模式，对面比你更慢且依赖空间。选出时应？|You have fast and slow modes; the opponent is slower and depends on Trick Room. At preview?",
    [
      "自动帮对面开空间|Automatically set their Trick Room",
      "评估阻止或耗尽空间的快攻路线|Evaluate a fast mode that denies or stalls Trick Room",
    ],
    1,
    "控速必须服务你的相对速度，而不是为了使用队伍里的招式。|Speed control should serve your relative Speed, not merely use a move because you carry it.",
  ),
];
export { q, lesson, section, t };
