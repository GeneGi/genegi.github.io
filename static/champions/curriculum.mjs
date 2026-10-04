// Stable IDs are part of the local progress contract. Keep them when editing copy.
export const b = (zh, en) => ({ zh, en });
const t = (text) => {
  const [zh, en] = text.split("|");
  return b(zh, en);
};
const list = (values) => values.map(t);
export const LEVELS = ["foundation", "applied", "battle"];
export const PASS_RATIO = 0.8;
export const passMark = (total) => Math.ceil(total * PASS_RATIO);
export const TRAINING_NOTE =
  "题目里的伤害与速度数字是本课程给定的教学假设，用于练习判断方法，不是精确对战计算。|The damage and Speed figures here are supplied training assumptions for practising the decision method, not exact game calculations.";
export const answerIndexes = (question) =>
  Array.isArray(question.answer) ? [...question.answer] : [question.answer];
const CARD_LABELS = [
  "理解机制|Understand the mechanic",
  "看清限制|Know the boundaries",
  "带入实战|Apply it in battle",
  "再推一步|Push it one step further",
];
const q = (id, prompt, options, answer, explanation, type = "single") => ({
  id,
  level: "foundation",
  prompt: t(prompt),
  options: list(options),
  answer,
  explanation: t(explanation),
  type,
});
const dq = ({
  id,
  level = "applied",
  scene,
  prompt,
  options,
  answer,
  why,
  note,
  explanation,
}) => ({
  id,
  level,
  prompt: t(prompt),
  options: list(options),
  answer,
  type: Array.isArray(answer) ? "multi" : "single",
  explanation: t(
    explanation ?? why[Array.isArray(answer) ? answer[0] : answer],
  ),
  why: list(why),
  note: note ? t(note) : null,
  scenario: {
    side: t(scene.side),
    foes: t(scene.foes),
    field: t(scene.field),
    known: t(scene.known),
    goal: scene.goal ? t(scene.goal) : null,
  },
});
const lesson = (id, title, cards, questions) => ({
  id,
  title: t(title),
  cards: cards.map(t),
  labels: list(CARD_LABELS.slice(0, cards.length)),
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
      dq({
        id: "type-check1",
        level: "applied",
        scene: {
          side: "你的地面输出手，后排放着一只火属性替补。|Your Ground attacker, with a Fire-type reserve behind it.",
          foes: "大嘴鸥（水／飞行）与 超能力／一般的爱管侍。|Pelipper (Water/Flying) and a Normal/Psychic Indeedee.",
          field: "无天气、无场地，第 3 回合。|No weather or terrain, turn 3.",
          known: "两只都没有已知的飘浮或气球。|Neither is known to have Levitate or an Air Balloon.",
        },
        prompt:
          "地面招式打水／飞行的大嘴鸥，属性倍率？|Ground move against Water/Flying Pelipper: what multiplier?",
        options: ["0×|0×", "1×|1×", "2×|2×"],
        answer: 0,
        why: [
          "飞行带来的 0 倍无法被水属性的 2 倍救回。|The ×0 from Flying cannot be rescued by Water’s ×2.",
          "0 乘任何数仍是 0，不会退回 1 倍。|Zero times anything is still zero; it never settles at ×1.",
          "地面打飞行永远是 0 倍，第二属性不改变这条免疫。|Ground is always ×0 against Flying, whatever the secondary type is.",
        ],
      }),
      dq({
        id: "type-check2",
        level: "applied",
        scene: {
          side: "你的幽灵输出手，后排放着一般属性的收尾手。|Your Ghost attacker, with a Normal-type cleaner in reserve.",
          foes: "一般／超能力的爱管侍 与 一般属性的输出手。|A Normal/Psychic Indeedee and a Normal-type attacker.",
          field: "无场地，第 2 回合。|No terrain, turn 2.",
          known: "对手两只都还没被施加异常状态。|Neither foe is statused yet.",
        },
        prompt:
          "幽灵招式打一般／超能力的爱管侍，属性倍率？|Ghost move against Normal/Psychic Indeedee: what multiplier?",
        options: ["2×|2×", "0×|0×", "1×|1×"],
        answer: 1,
        why: [
          "超能力的弱点不会让它变成可被幽灵打中的目标。|Psychic’s weakness does not make it Ghost-vulnerable.",
          "一般属性免疫幽灵，乘法直接归零。|Normal is immune to Ghost, so the combined multiplier is zero.",
          "1 倍只出现在双方都没有匹配倍率时。|×1 only appears when neither type matches a modifier.",
        ],
      }),
      dq({
        id: "type-check3",
        level: "applied",
        scene: {
          side: "你的电属性范围输出手，后排放着龙属性替补。|Your Electric spread attacker, with a Dragon reserve behind it.",
          foes: "烈咬陆鲨（龙／地面）与 超能力／一般的爱管侍。|Garchomp (Dragon/Ground) and a Normal/Psychic Indeedee.",
          field: "无天气、无场地，第 4 回合。|No weather or terrain, turn 4.",
          known: "本回合你只有一个动作，两只对手都会行动。|You have one action this turn and both foes will act.",
        },
        prompt:
          "放电 Thunderbolt 作为范围招式使用，会打到谁？|Used as a spread move, which foes does Thunderbolt hit?",
        options: [
          "只有超能力／一般那只，地面那只免疫|Only the Normal/Psychic one; the Ground-type is immune",
          "两只都吃到伤害|Both take damage",
          "两只都免疫|Both are immune",
        ],
        answer: 0,
        why: [
          "地面免疫让那只完全不吃伤害，另一只按 2 倍结算。|Ground immunity zeroes one target while the other takes ×2.",
          "龙／地面对电是 0 倍，范围招式不会绕开属性。|Dragon/Ground is ×0 against Electric; spreading does not bypass typing.",
          "超能力／一般不免疫电，0 倍只出现在地面那一只身上。|Normal/Psychic is not immune to Electric; only the Ground-type is.",
        ],
      }),
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
      dq({
        id: "damage-check1",
        level: "applied",
        scene: {
          side: "你的特攻输出手（喷射火焰）与 物攻输出手各一只。|Your special attacker (Flamethrower) and your physical attacker.",
          foes: "一只物攻输出手与 一只特殊输出手。|A physical attacker and a special attacker.",
          field: "无场地，第 2 回合。|No terrain, turn 2.",
          known: "对面炽焰咆哮虎已确认威吓，压制了物攻。|The opposing Incineroar is confirmed Intimidate and has cut your physical damage.",
        },
        prompt:
          "物攻被威吓降低，会直接降低喷射火焰的伤害吗？|Does the Intimidate Attack drop directly weaken Flamethrower?",
        options: ["会|Yes", "不会|No"],
        answer: 1,
        why: [
          "特攻数值没有变化，喷射火焰不经过攻击。|The Special Attack stat is untouched, and Flamethrower never reads Attack.",
          "威吓只影响攻击 Attack；换成特攻招式就绕开了这次削弱。|Intimidate only lowers Attack, so a special move sidesteps it entirely.",
        ],
      }),
      dq({
        id: "damage-check2",
        level: "applied",
        scene: {
          side: "你的地面本系输出手，后排有特攻替补。|Your Ground STAB attacker, with a special reserve behind it.",
          foes: "一只 4× 被击倒线的输出手 与 一只高特防耐久手。|An attacker four times over the KO line and a high special-defense wall.",
          field: "无天气、无场地，第 5 回合。|No weather or terrain, turn 5.",
          known: "你不知道对手的道具与剩余血量精确值。|You do not know their items or exact remaining HP.",
        },
        prompt:
          "属性克制的攻击一定击倒对手？|Does a super-effective attack always KO?",
        options: ["是|Yes", "否|No"],
        answer: 1,
        why: [
          "倍率只是乘数之一，威力、攻防、剩余血量和随机浮动都还没定。|The multiplier is one factor; power, stats, remaining HP and the damage roll still apply.",
          "克制保证伤害更高，不保证超过对手的耐久线。|Super effective means more damage, not that you cross the HP threshold.",
        ],
      }),
      dq({
        id: "damage-check3",
        level: "applied",
        scene: {
          side: "你的地面本系输出手（地震）与 特攻替补（十万伏特）。|Your Ground STAB attacker (Earthquake) and a special reserve (Thunderbolt).",
          foes: "钢／妖精的赛富豪 与 水／地面的大钳蟹。|Gholdengo (Steel/Fairy) and a Water/Ground Crawdaunt.",
          field: "青草场地，第 6 回合。|Grassy Terrain, turn 6.",
          known: "队友未免疫地面，且本回合无法安全换下。|Your partner is not Ground-immune and cannot switch out safely.",
        },
        prompt:
          "要打击两只对手，本回合的招式分类与倍率判断？|To reach both foes this turn, judge the move category and multipliers how?",
        options: [
          "地面本系对赛富豪 0 倍；十万伏特对两只都是 2 倍，但会打中队友|Ground STAB is ×0 into Gholdengo; Thunderbolt is ×2 into both but also hits your partner",
          "地震对两只都是 4 倍|Ground moves are ×4 into both",
          "地面招式只看属性，不看本系加成|Ground moves only read typing, not the STAB bonus",
        ],
        answer: 0,
        why: [
          "钢属性免疫地面；范围电招才能同时打到两只，代价是承担队友那一份。|Steel is Ground-immune; only a spread attack reaches both, at the cost of the ally hit.",
          "钢／妖精对地面是 0 倍，倍率不会因为本系加成而改变。|Steel/Fairy is ×0 against Ground, and STAB cannot change an immunity.",
          "本系加成乘在伤害上，不改变属性倍率；冰 × 2 才是这种组合的答案。|STAB multiplies damage after typing; it never edits the type multiplier.",
        ],
      }),
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
      lesson(
        "speed-sequencing",
        "算出有效速度与行动顺序|Work out effective Speed and turn order",
        [
          "一个回合的结算顺序是固定的四层：先比较招式优先度，只在同一优先度内再比较有效速度；空间只反转第二层的速度比较，不反转第一层；最后速度完全相同才随机。|A turn resolves in four fixed layers: compare move priority first, compare effective Speed only inside one priority bracket, let Trick Room reverse only that Speed comparison, and roll randomly only on an exact Speed tie.",
          "有效速度 = 基础速度 × 能力等级修正 × 特性加成，再乘顺风的 2 倍或按戏法空间处理。能力等级用 2/3 的幂次：+2 是 4/3 倍，-1 是 2/3 倍。场地是乘在结果上，不是改变计算方式。|Effective Speed = base Speed × stat-stage multiplier × ability, then Tailwind’s ×2 or Trick Room’s reversal. Stages are powers of two-thirds: +2 is 4/3, -1 is 2/3. Field effects multiply the result rather than changing how it is computed.",
          "先制攻击在第 1 层就解决战斗，因此先制与速度是两件事：击掌奇袭 +3 会先于所有 0 优先度招式，青草滑梯 +1 会先于空间里的 0 优先度普通攻击。但后生效的场地不会救回已经结算过的先制。|Priority resolves at layer one, so priority and Speed are separate problems: Fake Out (+3) precedes every priority-0 move and a grounded Grassy Glide (+1) precedes priority-0 attacks even under Trick Room. A field effect that only activates later cannot retroactively unblock a priority move.",
          "行动顺序和伤害是两个独立判断。更慢的一方照样能靠克制、道具或高威力赢下这个回合；先动只决定你能不能在对手的攻击之前先处理掉它，不等于你的伤害更高。|Turn order and damage are independent judgements. The slower attacker can still win the exchange through typing, items or raw power; going first only decides whether you can remove something before it hits you.",
        ],
        [
          dq({
            id: "speed-seq-tailwind",
            level: "applied",
            scene: {
              side: "顺风下的输出手，基础有效速度 100（本回合刚开顺风）。|Your Tailwind-boosted attacker at a base effective Speed of 100 (Tailwind set this turn).",
              foes: "已触发轻装的大狃拉，基础有效速度 120。|Sneasler with Unburden already activated, base effective Speed 120.",
              field: "本回合无戏法空间；顺风只剩这一回合。|No Trick Room; this is the last turn of Tailwind.",
              known: "双方都只用 0 优先度招式，速度互不相同。|Both use priority-0 moves and the Speeds are not equal.",
            },
            prompt: "这一回合谁先出手？|Who acts first this turn?",
            note: TRAINING_NOTE,
            options: [
              "顺风方，200 先动手|The Tailwind side moves first at 200",
              "轻装的大狃拉，240 先动手|Sneasler with Unburden moves first at 240",
              "速度相同，随机决定|A Speed tie, decided randomly",
            ],
            answer: 1,
            why: [
              "顺风把 100 变成 200，可 200 仍然低于轻装加成后的 240。|Tailwind turns 100 into 200, and 200 is still below the Unburden-boosted 240.",
              "轻装的加速已经生效，所以 240 大于 200，对手先行动。|Unburden has already applied, so 240 exceeds 200 and the opponent acts first.",
              "两边算出的速度并不相同，随机只在完全相等时才出现。|The two computed Speeds differ, so the random tiebreak never comes into play.",
            ],
            explanation:
              "顺风把 100 变成 200，轻装把 120 变成 240；0 优先度下 240 先动。|Tailwind turns 100 into 200 and Unburden turns 120 into 240, so at priority 0 the 240 acts first.",
          }),
          dq({
            id: "speed-seq-priority-room",
            level: "applied",
            scene: {
              side: "你的主力，带水流喷射（+1），本回合必须先动才能保住后排。|Your win condition with Aqua Jet (+1); it must act this turn to keep its partner safe.",
              foes: "两只 0 优先度普通攻击，都能击倒你的后排；戏法空间剩最后一回合。|Two priority-0 attacks that both KO your partner; Trick Room has one turn left.",
              field: "戏法空间，第 4 回合。|Trick Room, turn 4.",
              known: "你的主力速度低于对手两只。|Your win condition is slower than both foes.",
            },
            prompt:
              "水流喷射和对手的普通攻击，谁先结算？|Aqua Jet and the opposing normal attacks: which resolves first?",
            options: [
              "你的水流喷射|Your Aqua Jet",
              "空间让较慢的普通攻击先动|Trick Room lets the slower normal attacks act first",
              "本回合双方一起结算，无法比较|Both resolve together this turn",
            ],
            answer: 0,
            why: [
              "优先度先比较，+1 永远早于 0 优先度，空间不影响这一层。|Priority is compared first, so +1 always precedes 0 and Trick Room never touches that layer.",
              "空间只反转同一优先度内部的速度顺序，这里两边不在同一层。|Candidate B confuses the layers: Trick Room only reverses Speed inside one bracket.",
              "同一个优先度内不存在“一起结算”。|Candidate C describes a mechanic that does not exist.",
            ],
          }),
          dq({
            id: "speed-seq-terrain-window",
            level: "battle",
            scene: {
              side: "刚进入本回合的炽焰咆哮虎（首次行动窗口），队友本回合可换入后场的轰擂金刚猩。|Incineroar that entered at the start of this turn (first-action window); its partner may switch to reserve Rillaboom this turn.",
              foes: "接地的轻装大狃拉与一只精神场地引导手；本回合两者都会攻击，无守住、无先制招式。|A grounded Unburden Sneasler and a Psychic Terrain setter; both will attack this turn with no Protect and no priority moves.",
              field: "精神场地，第 5 回合。|Psychic Terrain, turn 5.",
              known: "对手不会换人；你的轰擂金刚猩携带青草场地。|The foes will not switch; your Rillaboom carries Grassy Terrain.",
            },
            prompt:
              "这一回合击掌奇袭能打中大狃拉吗？|Can Fake Out reach Sneasler this turn?",
            options: [
              "不能：击掌奇袭（+3）先结算，青草场地（0 优先度）在它之后才成立|Not this turn: Fake Out (+3) resolves before the priority-0 Grassy Terrain it would need",
              "可以：队友换入轰擂金刚猩覆盖场地后，阻挡立即解除|Yes: Rillaboom’s overwrite removes the block the moment it enters",
              "可以：场地覆盖会先取消大狃拉的轻装，阻挡随之消失|Yes: the overwrite cancels Unburden, so the block goes with it",
            ],
            answer: 0,
            why: [
              "场地要等 0 优先度招式结算时才建立，而击掌奇袭已经在第 1 层出手；本回合的阻挡依旧生效。|The terrain only exists once the priority-0 move resolves, and Fake Out already acted in layer one, so the block still applies this turn.",
              "换入发生在招式之前，但场地效果在场地招式结算时才生效，两者不是同一时刻。|Candidate B mixes up two clocks: switching happens before moves, the terrain itself starts when the field move resolves.",
              "覆盖场地不会取消已经触发的轻装，理由本身是错的。|Candidate C is wrong on the premise: replacing terrain does not remove Unburden.",
            ],
            explanation:
              "先制被精神场地挡住这一回合；换场地要等它自己的优先度结算，来不及救回这只击掌奇袭。|Psychic Terrain blocks Fake Out this turn, and a priority-0 overwrite resolves too late to change that.",
          }),
          dq({
            id: "speed-seq-damage",
            level: "applied",
            scene: {
              side: "较快的普通攻击（必定击倒对方）与较慢但威力更高的攻击手。|A faster normal attack that KOs for certain, and a slower attacker with higher power.",
              foes: "两只 0 优先度输出手，都会在这回合攻击你的后排。|Two priority-0 attackers that both hit your partner this turn.",
              field: "无场地，第 7 回合；你领先。|No terrain, turn 7; you are ahead.",
              known: "两只对手都不会换人，也没有守住。|Neither foe will switch and neither can Protect.",
            },
            prompt:
              "要结束战斗，最合理的分工是？|To close out the battle, what is the soundest split of roles?",
            options: [
              "让较快的普通攻击先击倒，较慢的高威力手留到下一回合|Let the faster attack KO first and keep the slower heavy hitter for next turn",
              "让较慢的高威力手先出手，因为威力才有保证|Give the slower heavy hitter the first slot because power is the guarantee",
              "两只一起出手，用数量补足把握|Attack with both and let numbers cover the uncertainty",
              "先让对手打完，再决定要不要收尾|Let the opponents attack first and decide afterwards",
            ],
            answer: 0,
            why: [
              "先动的击倒结束战斗，另一只保留完整血量进入下一回合，同时不改变对手已定的行动。|The first KO ends the battle and the second attacker stays at full HP for the next turn without changing what the foes already chose.",
              "威力更高不等于更早结算；后手意味着它这一回合可能先被打掉。|Candidate B confuses power with order: going second means it can be removed before it acts.",
              "多打一下不增加胜率，只增加后排被打中的机会。|Candidate C adds no win probability and only exposes the partner to more incoming damage.",
              "放弃先手等于把两个威胁都放到自己前面，风险没有任何补偿。|Candidate D gives up the first slot for no compensating benefit.",
            ],
          }),
        ],
      ),
    ],
    [
      dq({
        id: "speed-check1",
        level: "applied",
        scene: {
          side: "你的空间输出手（基础有效速度 60）与 队友（120）。|Your Trick Room attacker (base effective Speed 60) and your partner (120).",
          foes: "两只 0 优先度输出手（90 与 150）。|Two priority-0 attackers (90 and 150).",
          field: "戏法空间，第 3 回合。|Trick Room, turn 3.",
          known: "本回合没有先制招式，也没有能力等级变化。|No priority moves this turn and no stat-stage changes.",
        },
        prompt:
          "空间下同为 0 优先度，速度 60 和 150 谁先？|Under Trick Room, both use priority-0 moves. Who acts first: 60 or 150?",
        options: ["60|60", "150|150"],
        answer: 0,
        why: [
          "空间让同一优先度内较慢的一方先行动，60 先于 150。|Trick Room puts the slower Pokémon first inside the bracket, so 60 precedes 150.",
          "空间反转的是这一层的比较，150 反而要等 60 行动完。|Trick Room reverses exactly this layer, so 150 waits for 60.",
        ],
      }),
      dq({
        id: "speed-check2",
        level: "applied",
        scene: {
          side: "接地的轰擂金刚猩，正在青草场地使用青草滑梯（+1）。|A grounded Rillaboom using Grassy Glide (+1) in Grassy Terrain.",
          foes: "突袭 Sucker Punch（+1）的使用者与 一只支援手。|A Sucker Punch (+1) user and a support Pokémon.",
          field: "青草场地，第 6 回合。|Grassy Terrain, turn 6.",
          known: "没有戏法空间，双方都没有能力等级变化。|No Trick Room and no stat-stage changes on either side.",
        },
        prompt:
          "突袭和接地使用者的青草滑梯都是 +1，正常情况下谁先？|Sucker Punch and a grounded user’s Grassy Glide are both +1. Without Trick Room, who acts first?",
        options: [
          "有效速度较快者|The higher effective Speed",
          "固定青草滑梯|Always Grassy Glide",
        ],
        answer: 0,
        why: [
          "同优先度才比较速度，所以由有效速度决定，场地本身不指定赢家。|Only a priority tie falls through to Speed, and the terrain never names a winner.",
          "优先度相同意味着没有先后保证；把青草滑梯当成必先是错觉。|Candidate B mistakes a shared priority for a guaranteed order.",
        ],
      }),
      dq({
        id: "speed-check3",
        level: "applied",
        scene: {
          side: "围巾 Sneasler（已触发轻装）与 需要时间开空间的备用空间手。|Scarf Sneasler with Unburden active, plus a reserve Trick Room setter that needs time.",
          foes: "接地的暴飞龙（已 Mega）与 一只速度更快的干扰手。|A grounded Mega Salamence and a faster disruption user.",
          field: "本回合未开空间，场地为空。|No Trick Room this turn and no terrain.",
          known: "对手可能本回合开空间；你不能同时开空间又用击掌奇袭。|The foes may open Trick Room this turn, and you cannot set Trick Room and use Fake Out in the same action.",
        },
        prompt:
          "本回合控速的优先目标应该是？|What should speed control target first this turn?",
        options: [
          "让威胁你后排的那只无法舒服地开空间，而不是追求全场速度领先|Keep the Pokémon that endangers your partner from setting Trick Room, rather than chasing overall Speed lead",
          "无条件先开空间，因为空间总会让你更快|Open Trick Room unconditionally, because it always makes you faster",
          "完全不管速度，改成全力输出|Ignore Speed entirely and output at full power",
        ],
        answer: 0,
        why: [
          "速度控制服务的是具体威胁；阻止对方的空间比争一个无意义的领先更值钱。|Speed control serves a specific threat, and denying their Trick Room is worth more than a lead that means nothing.",
          "空间只会反转同一优先度的速度，而对手更快时会反噬自己的后排。|Candidate B ignores that Trick Room reverses Speed inside a bracket, which backfires when the foes are faster.",
          "放弃速度等于交出行动顺序，输出再高也可能打不到该打的目标。|Candidate C surrenders turn order, so even high damage may arrive after the threat has already acted.",
        ],
      }),
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
      dq({
        id: "status-check1",
        level: "applied",
        scene: {
          side: "你的击掌奇袭手与 后排的特攻输出手。|Your Fake Out user and a special attacker in reserve.",
          foes: "本回合先行动的物攻输出手 与 一只支援手。|A physical attacker that acts first this turn and a support Pokémon.",
          field: "无场地，第 2 回合。|No terrain, turn 2.",
          known: "你已经看到对手第一只完成了行动。|You have watched the first opposing Pokémon complete its action.",
        },
        prompt:
          "已行动目标这回合再畏缩，会撤销刚才的攻击吗？|Will flinching an already-acted target undo the attack it just used?",
        options: ["会|Yes", "不会|No"],
        answer: 1,
        why: [
          "畏缩只取消尚未发生的行动，已经结算的伤害不会回滚。|Flinch only cancels an action that has not happened; finished damage is never rolled back.",
          "所以对已行动目标用畏缩等于白白花掉一个动作。|Spending a turn flinching an opponent that already acted is a wasted action.",
        ],
      }),
      dq({
        id: "status-check2",
        level: "applied",
        scene: {
          side: "你的干扰手与 承担集火的物理输出手。|Your disruption user and a physical attacker soaking focus.",
          foes: "火属性物理输出手、电属性速度手 与 一只中毒的输出手。|A Fire-type physical attacker, an Electric-type speedster and a poisoned attacker.",
          field: "第 4 回合，无场地。|Turn 4, no terrain.",
          known: "本回合你只能对一个目标施加异常状态。|You can inflict status on exactly one target this turn.",
        },
        prompt: "下列哪些通常成立？（多选）|Which normally hold? (Select all.)",
        options: [
          "火属性免疫灼伤|Fire types are immune to burn",
          "麻痹降低速度|Paralysis reduces Speed",
          "换下必定治好中毒|Switching always cures poison",
        ],
        answer: [0, 1],
        why: [
          "火属性不会被灼伤，所以在它身上浪费鬼火等于空过一回合。|Fire types cannot be burned, so Will-O-Wisp there wastes the turn.",
          "麻痹把有效速度减半，1/8 的无法行动是额外风险。|Paralysis halves effective Speed, and the 1/8 full-paralysis chance is extra risk on top.",
          "普通换下不会治疗中毒，只有明确写出治疗效果的方式才行。|Ordinary switching does not cure poison; only an explicit cure does.",
        ],
      }),
      dq({
        id: "status-check3",
        level: "applied",
        scene: {
          side: "你的冰冻控制手，后排有接力特攻手。|Your freeze controller with a follow-up special attacker in reserve.",
          foes: "怕冷的龙／冰输出手 与 一只带先制招式的威胁。|A Dragon/Ice attacker weak to freezing and a threat with a priority move.",
          field: "本回合你必须让它不能行动，第 6 回合。|You must stop it acting this turn; turn 6.",
          known: "它此前没有异常状态，也没有防异常特性。|It has no status yet and no status-immunity ability.",
        },
        prompt:
          "本回合控住它的计划，哪一条缺口最需要补上？|Which gap most needs closing in your plan to stop it acting?",
        options: [
          "确认它本回合在异常状态检查之后才行动，并且没有每回合自愈|Confirm it acts after the status check and has no per-turn cure",
          "只要是龙／冰属性就一定能冻上|Dragon/Ice typing alone guarantees the freeze lands",
          "先给它上强化，再冻|Set it up first, then freeze it",
        ],
        answer: 0,
        why: [
          "冻结是概率判定，所以要知道检查顺序，也要确认没有治疗来源。|Freezing is a probability check, so both the check timing and the absence of a cure matter.",
          "属性只是影响概率，不会把冻结变成必然。|Typing shifts the odds; it never turns a freeze into a certainty.",
          "给对手强化只会让你更难控制它，且它本回合就会先动。|Boosting the foe only makes it harder to control, and it acts before you finish.",
        ],
      }),
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
      lesson(
        "position-win-condition",
        "保护胜利条件，而不是浪费回合|Protect the win condition instead of wasting turns",
        [
          "胜利条件不是最强的宝可梦，而是你最缺的那个角色：唯一能清场的手、唯一能撑过对手空间的速度手、或者已经蓄好的一次集火。它通常也是你最脆弱的东西，所以每回合先问：这一回合结束后，我还能执行原来的收尾吗？|A win condition is not your strongest Pokémon; it is the role you cannot replace: the only cleaner, the only speed that survives their Trick Room, or one charged focus. It is also usually your most fragile slot, so ask every turn whether the original finish is still executable afterwards.",
          "守住是一次交易，不是保险。用它之前要同时满足三点：这回合对手真的会打你、你有理由相信它挡得住、挡住之后你有具体计划。三条缺一条，守住就只是把回合让出去。连续使用的成功率还会下降。|Protect is a purchase, not insurance. Before using it, three things must hold at once: the opponent will really attack you, you have reason to believe the block lands, and you have a concrete plan for the turn after. Missing any one makes it a donated turn, and consecutive use becomes less reliable.",
          "换人发生在招式之前。新上场的那只会承受原本瞄准该位置的攻击，所以换入要挑能扛住那一击或能免疫的；普通换下会清除能力等级变化，所以强化过的宝可梦不能靠“先藏一下”保留强化。|Switching resolves before moves. The incoming Pokémon receives whatever was aimed at that slot, so switch in something that survives or is immune; a normal switch-out clears stat stages, so a boosted attacker cannot bank its boosts by stepping out.",
          "两个位置不是对称的。前排通常吃第一记单体与范围攻击，后排吃集火；把免疫与抗性更高的放前面承压，把“需要时间”和“不能被打断”的角色放后面。位置本身就是资源，只是它免费。|The two slots are not symmetric. The front takes the first single-target hit and any spread; the back takes focused fire. Put the more resistant slot in front and the role that needs uninterrupted time in the back. Positioning is a free resource.",
        ],
        [
          dq({
            id: "position-win-fakeout",
            level: "battle",
            scene: {
              side: "刚上场、仍在首次行动窗口的炽焰咆哮虎（击掌奇袭可用），与满血的围巾幽尾玄鱼（已锁扫墓）。|Incineroar that just entered and still has its first-action window (Fake Out available), plus a full-HP Scarf Basculegion locked into Last Respects.",
              foes: "接地的轰擂金刚猩（青草滑梯 +1）与 一只支援手。|A grounded Rillaboom with Grassy Glide (+1) and a support Pokémon.",
              field: "无精神场地，第 8 回合。|No Psychic Terrain, turn 8.",
              known: "对手没有守住，也没有防畏缩特性，本回合不会换人。|Neither foe can Protect or absorb flinching, and neither will switch this turn.",
            },
            prompt: "本回合最合理的分工是？|What is the soundest split of roles this turn?",
            options: [
              "击掌奇袭先手压掉接地的轰擂金刚猩，队友正常输出，保住状态良好的清场手|Fake Out removes the grounded Rillaboom first, the partner attacks as planned, and the cleaner stays intact",
              "放弃控制，两只都用最高威力的攻击赌一次更大的伤害|Skip control and have both swing for maximum damage instead",
              "清场手主动换下，独自面对这回合剩下的压力|Switch the cleaner out and let it face the rest of the turn alone",
              "把击掌奇袭改打自己的队友，用优先度抢先压制对手节奏|Aim Fake Out at your own partner to seize the priority window",
            ],
            answer: 0,
            why: [
              "+3 优先度早于青草滑梯的 +1，先制能保证这只场地手本回合打不到你；收尾手的血量与状态都被保留下来。|+3 resolves before Grassy Glide’s +1, so the flinch reliably removes the priority threat while the cleaner keeps its HP and status.",
              "对手已经先手过一次，最大伤害会晚于青草滑梯打出，风险拿不到回报。|The priority threat already acts first, so raw damage arrives too late to matter.",
              "换下清空能力等级并把替补暴露给集火，而清场手一旦退场就失去本局的收尾。|Switching clears stat stages, exposes the reserve to focus, and once the cleaner leaves, the finish is gone.",
              "击掌奇袭不能打自己人；把先制浪费在队友身上还会白白损失它的输出回合。|Candidate D is not a legal target choice and burns the priority window for nothing.",
            ],
            explanation:
              "先制顺序让击掌奇袭先于 +1 的青草滑梯出手，因此控制住接地的场地手比堆伤害更能保住清场手。|Because +3 resolves before +1, controlling the grounded terrain user protects the cleaner far better than stacking damage.",
          }),
          dq({
            id: "position-win-protect",
            level: "applied",
            scene: {
              side: "必须留到残局的清场手（仍有扫墓）与 一个本回合能打掉对手输出手的队友。|A cleaner you must keep for the endgame (Last Respects in hand) and a partner that can KO the opposing attacker this turn.",
              foes: "两只都会攻击清场手位置的对手，本回合都没有守住可用。|Two foes that will both hit the cleaner’s slot; neither can Protect this turn.",
              field: "第 6 回合，无场地、无天气。|Turn 6, no terrain and no weather.",
              known: "你的清场手第一次使用守住，队友本回合有可靠的击倒。|This is the cleaner’s first Protect, and the partner has a reliable KO.",
            },
            prompt: "清场手这一回合最该做什么？|What should the cleaner do with its action this turn?",
            options: [
              "守住本回合，让队友用可靠的一击处理掉对手输出手|Protect, and let the partner KO the opposing attacker with its reliable attack",
              "和队友一起全力输出，两只同时承担风险|Attack at full power with the partner and share the risk",
              "换下清场手，用后备替补顶这一回合|Switch the cleaner out and let a reserve take the turn",
              "抢先手压制对手，不顾清场手的血量|Use priority to suppress the foes and ignore the cleaner’s HP",
            ],
            answer: 0,
            why: [
              "守住买下一整个回合：对手的集火落空，威胁被队友清掉，收尾手完好进入下一回合。|Protect buys the whole turn: the focus fails, the threat is removed, and the cleaner is intact next turn.",
              "清场手的输出通常不足以结束战斗，而它挨完集火后可能再也无法收尾。|A cleaner usually cannot finish the battle alone, and after eating a focus it may never get to.",
              "换下会让替补吃集火，还失去唯一能收尾的角色。|Switching feeds the focus to the reserve and discards the only finishing role.",
              "清场手未必有先制招式，而且先手并不会减少它承受的伤害。|The cleaner may not have priority at all, and going first does not reduce the damage it takes.",
            ],
          }),
          dq({
            id: "position-win-slot",
            level: "applied",
            scene: {
              side: "前排：带看我嘛的支援手。后排：围巾锁招的幽尾玄鱼（幽灵／水），需要这一回合打完全场。|Front slot: a Follow Me supporter. Back slot: Scarf Basculegion (Ghost/Water) that must take this turn to close the game.",
              foes: "一只单体集火输出手 与 一只支援手；本回合不会范围攻击。|A single-target focused attacker and a support Pokémon; no spread attacks this turn.",
              field: "第 9 回合，无场地。|Turn 9, no terrain.",
              known: "你这一回合没有先制招式可用，对手这次集火是单体的。|You have no priority move available and the incoming focus is single-target.",
            },
            prompt: "这一回合的位置与分工怎么安排？|How should slots and roles be arranged this turn?",
            options: [
              "前排看我嘛把单体攻击引到自己身上，后排清场手按计划完成收尾|Front slot uses Follow Me to pull the single-target attack, and the back cleaner finishes on schedule",
              "让后排锁招的清场手直接吃这记集火，反正它本回合还能动|Let the Choice-locked cleaner eat the focused hit; it can still act this turn",
              "两只都守住，把这一回合完全交给对手决定|Both Protect and hand the turn over to the opponent",
              "立刻把清场手换下，改用后备输出手尝试结束战斗|Switch the cleaner out now and try to finish with a reserve attacker",
            ],
            answer: 0,
            why: [
              "看我嘛正是为可改向的单体攻击准备的，后排因此保住血量、状态与收尾资格。|Follow Me exists for redirectable single-target attacks, so the back slot keeps its HP, its status and its eligibility to finish.",
              "收尾手是全场最脆弱的角色，让它吃未知威力的集火可能直接让结局失效。|The cleaner is the most fragile role on the field; a focus of unknown power can end the game early.",
              "双守住只在两人都被打时有效，而且把输出回合完全让给了对手。|Double Protect only helps if both are attacked, and it hands the whole turn to the opponent.",
              "换下清空能力等级、暴露替补，而且收尾手离场后可能再也回不来。|Switching clears stages, exposes the reserve, and the cleaner may never return.",
            ],
          }),
        ],
      ),
    ],
    [
      dq({
        id: "position-check1",
        level: "applied",
        scene: {
          side: "你的两只都能首次使用守住，本回合你有安全的反击计划。|Both of your Pokémon can use a fresh Protect, and you have a safe follow-up next turn.",
          foes: "已开戏法空间的两只，0 优先度普通攻击，空间只剩这一回合。|Two priority-0 attackers with Trick Room active; the room has one turn left.",
          field: "戏法空间，第 5 回合，无天气扣血。|Trick Room, turn 5, no weather chip.",
          known: "下回合你只要速度领先就能赢，对方两只都不会穿透守住。|You win next turn with the Speed advantage, and neither foe can bypass Protect.",
        },
        prompt:
          "对手空间只剩最后一回合，双守住一定错误吗？|Is double Protect always wrong when the opposing Trick Room has one turn left?",
        options: [
          "是，双守住浪费了输出回合|Yes, double Protect wastes the attacking turn",
          "否，安全耗尽空间能让下回合的速度优势兑现|No, safely stalling the room converts your Speed advantage into a win",
          "否，但这只适合落后时使用|No, but it is only useful when behind",
        ],
        answer: 1,
        why: [
          "守住在这个局面里买到的正是下回合的胜势，输出回合可以之后再补。|Protect buys exactly the next-turn win here; the damage turn can come later.",
          "空间的最后一回合已经无法延续，耗掉它等于把速度优势兑现。|The room cannot be renewed, so spending it converts the Speed lead into a result.",
          "领先时守住同样有价值；是否使用取决于本回合有没有别的收益。|Candidate C is wrong about state: Protect is valuable when ahead too, it just needs a reason.",
        ],
      }),
      dq({
        id: "position-check2",
        level: "applied",
        scene: {
          side: "攻击 +2 的收尾手，需要在下一回合用一次重击结束战斗。|A cleaner at +2 Attack that must finish with one heavy hit next turn.",
          foes: "一只速度足以在它下场后追击后排的对手。|A foe fast enough to punish the slot it leaves behind.",
          field: "第 4 回合，无场地。|Turn 4, no terrain.",
          known: "普通换下，没有保留强化的能力。|An ordinary switch; nothing preserves stat stages.",
        },
        prompt:
          "攻击 +2 的宝可梦普通换下再回来，通常剩几级？|A +2 Attack Pokémon switches out normally and returns. What is its usual Attack stage?",
        options: ["+2|+2", "0|0"],
        answer: 1,
        why: [
          "普通换下会清除全部能力等级变化，回场就是 0 级起步。|An ordinary switch clears every stat stage, so it returns at neutral.",
          "把强化藏一下并不能保住它；重新强化还要再花掉一个回合。|Banking the boosts does not work, and rebuilding them costs another turn.",
        ],
      }),
      dq({
        id: "position-check3",
        level: "applied",
        scene: {
          side: "围巾锁招的幽尾玄鱼，已锁扫墓；三只参战队友已倒下。|Scarf Basculegion locked into Last Respects; three selected allies have fainted.",
          foes: "两只一般属性的残血对手，本回合都没有免疫幽灵的手段。|Two low-HP Normal-type foes, neither able to avoid Ghost damage this turn.",
          field: "第 7 回合，无场地。|Turn 7, no terrain.",
          known: "队伍没有复活，也没有保留能力等级变化的效果。|No revival is available and nothing preserves stat stages.",
        },
        prompt:
          "如果收尾手必须在本回合换下再回来，扫墓还能作为收尾手段吗？|If the cleaner must switch out and return this turn, is Last Respects still a usable finish?",
        options: [
          "可以：扫墓威力只取决于已倒下的队友数量，与自身能力等级无关|Yes — Last Respects scales from fainted allies, not from the user’s stat stages",
          "不可以：能力等级清空后扫墓威力会下降|No — clearing the boosts weakens it",
          "可以，但必须换下两次并重新完成强化|Yes, but it needs two switches and a fresh boost",
          "不可以：收尾手一旦离场就等于失去胜利条件|No — once the cleaner leaves, the win condition is gone",
        ],
        answer: 0,
        why: [
          "50 + 50 × 3 = 200 的计算只数倒下的队友，所以普通换下不会削弱收尾手段。|50 + 50 × 3 = 200 counts only fainted allies, so an ordinary switch does not weaken the finish.",
          "扫墓的威力公式里没有能力等级这一项。|Candidate B adds a term that the Last Respects formula does not contain.",
          "反复换下只是白白消耗回合，并不会改变招式的收益。|Candidate C burns turns without changing what the move is worth.",
          "锁招本身在换下时就已解除，回来后还能重新选择招式。|The Choice lock ends when it switches, so the move can be chosen again on return.",
        ],
      }),
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
      lesson(
        "doubles-targeting",
        "选槽位、算范围、赌对手的防守|Slot targeting, spread maths and reading their defence",
        [
          "单体招式锁定的是一个位置，不是一个宝可梦。对方换人发生在招式之前，所以被你瞄准的那只下场后，新上场的那只会替你承受这一击。因此“先锁位置、再看免疫”比“先看血量”更可靠。|A single-target move locks a slot, not a Pokémon. Switching resolves before moves, so if your target leaves, the incoming Pokémon eats the hit instead. Locking the slot and then checking for immunities is more reliable than chasing the lowest HP.",
          "范围招式命中所有在场对手，命中多个目标时通常有 0.75 倍伤害修正；命中单个目标时没有这个修正。范围攻击通常不被看我嘛改向——它既不会被引开，也不会被引到别人身上，所以它的覆盖范围是确定的，它的伤害不是。|Spread moves hit every opponent on the field and normally take a 0.75× modifier when multiple targets are in range; hitting a single target carries no modifier. Follow Me normally does not redirect spread moves, so their coverage is fixed while their damage is not.",
          "广域防守是预判，不是保险。对手本回合选择广域防守，就意味着你的范围招式这一回合等于空过。所以在决定“要不要用范围”时，第一个要问的不是“我能打到几只”，而是“他们最可能选什么防守”。|Wide Guard is a read, not insurance. If the opponent spends this turn on Wide Guard, your spread move simply does nothing this turn. The first question when choosing a spread attack is therefore not “how many can I reach” but “what defence are they most likely to pick”.",
          "雨里的电光束是一个没有蓄力回合的威胁。看到大嘴鸥 + 铝钢桥龙时，你的计划要么是本回合就处理掉关键那只，要么是明确接受它这回合当回合打出伤害；同时确认自己这一回合手上的是单体选项还是范围选项——只有后者会被广域防守拦下。|Electro Shot in rain is a threat with no charge turn. Facing Pelipper plus Archaludon, your plan either removes the key Pokémon this turn or explicitly accepts its damage now; and check whether the tool in your hand is single-target or spread, because only the spread option can be shut down by Wide Guard.",
        ],
        [
          dq({
            id: "doubles-wide-guard",
            level: "battle",
            scene: {
              side: "一个已确认的单体电系攻击（对未满血的大嘴鸥足以击倒），以及一个范围特殊选项。后排没有替补。|A single-target Electric attack confirmed to KO a non-full-HP Pelipper before it moves, plus a spread special option. No reserves behind them.",
              foes: "雨天的大嘴鸥与铝钢桥龙；雨天还剩 4 回合。|Pelipper and Archaludon in rain; four turns of rain left.",
              field: "第 3 回合。|Turn 3.",
              known: "你不知道对手本回合是否选择广域防守。|You do not know whether the opponents choose Wide Guard this turn.",
            },
            prompt: "哪一条给定路线能覆盖广域防守？|Which of the given lines still works if they use Wide Guard?",
            options: [
              "用已确认足以击倒的单体电系攻击先打大嘴鸥；范围选项可能被广域防守整回合挡下|Use the confirmed single-target Electric attack to KO Pelipper first; the spread option could be shut down entirely",
              "用范围特殊招式同时压两只，即使对手开广域防守也照样结算|Use the spread special option on both; it resolves even against Wide Guard",
              "先用范围招式削血，把击倒留给下一回合|Chip with the spread move first and save the KO for next turn",
              "先打铝钢桥龙，因为它是这套雨天阵容里最强的输出|Attack Archaludon first, since it is the strongest attacker in this rain set",
            ],
            answer: 0,
            why: [
              "广域防守只拦范围招式；单体攻击照常结算，所以这条路线在两种对手选择下都成立。|Wide Guard only stops spread moves, so a single-target attack resolves either way and this line survives both reads.",
              "广域防守存在的意义正是把这一回合的范围攻击变成零收益。|Candidate B ignores the one move the opponents have specifically prepared against your spread option.",
              "把击倒推迟一回合，等于让对手的当回合电光束按计划打出来。|Deferring the KO hands the opponents the turn they planned for their immediate Electro Shot.",
              "铝钢桥龙确实危险，但本回合它不是唯一威胁；先解决能改变整场天气的关键那只才稳。|Archaludon is dangerous, but it is not the only threat this turn; removing the piece that shapes the weather is the sturdier read.",
            ],
            explanation:
              "范围选项有被广域防守整回合清零的风险，单体选项没有，所以覆盖率在这里取决于对手的防守选择。|Spread is the only option Wide Guard can erase, so coverage here depends on their read, not on yours.",
          }),
          dq({
            id: "doubles-slot-switch",
            level: "applied",
            scene: {
              side: "你的单体招式已瞄准对方前排；你的队友本回合无法提供改向或保护。|Your single-target move is aimed at the opponents’ front slot; your partner cannot redirect or protect this turn.",
              foes: "前排是会换人的宝可梦，后排是一只速度很快的输出手。|A front-slot Pokémon that will switch, and a fast back-slot attacker.",
              field: "第 4 回合。|Turn 4.",
              known: "对手前排本回合会换入一只被你的招式免疫的替补。|The opposing front slot will switch into a reserve immune to your move.",
            },
            prompt: "这一发单体招式打向哪里？|Where should this single-target move go?",
            options: [
              "打向对方后排的快攻手，让换入的免疫替补吃下这一发|Aim at the fast back-slot attacker, spending their switch on a turn where it does nothing",
              "照原计划打前排，赌它这回合不会换人|Stay aimed at the front slot and bet they do not switch",
              "改用范围招式，一次覆盖两个位置|Switch to a spread move and cover both slots at once",
              "先打前排，被免疫后再用范围招式补一手|Aim at the front slot, then fall back to a spread move if it is immune",
            ],
            answer: 0,
            why: [
              "招式锁定的是位置，打后排就一定会结算；对方那次换人被消耗在一个没有收益的回合里。|The move locks a slot, so aiming at the back guarantees resolution and wastes their switch on a worthless turn.",
              "你已经知道对手会换，这一步是在跟已知信息对赌。|Candidate B bets against information you already have.",
              "范围招式有 0.75 倍修正，而且对手本回合就摆着广域防守这一层。|Candidate C pays the 0.75× spread modifier while the opponents are holding a Wide Guard read.",
              "一个动作只能选一个目标，中途不能改瞄另一只。|Candidate D needs two actions; a turn grants one move and one target.",
            ],
          }),
          dq({
            id: "doubles-friendly-fire",
            level: "applied",
            scene: {
              side: "接地震的输出手（本回合无法安全换下）与 你自己的地面范围攻击。|A grounded attacker that cannot safely switch this turn, and your own Ground spread attack.",
              foes: "两只都会被你这一发打到位置的对手。|Two foes that this attack also reaches.",
              field: "第 5 回合，无场地。|Turn 5, no terrain.",
              known: "你的队友本回合可以使用首次守住；对手是否开广域防守未知。|Your partner can use a fresh Protect; Wide Guard on their side is unknown.",
            },
            prompt: "打这一发之前，必须处理的是什么？|What has to be handled before committing to that attack?",
            options: [
              "队友这回合的行动：己方范围招式同样会被队友的守住挡下|Your partner’s action this turn: a friendly spread move is blocked by the ally’s Protect too",
              "对手会不会开广域防守，那是唯一需要判断的事|Whether they use Wide Guard, which is the only thing to check",
              "威力够不够，范围招式本来就比其他招式强|Whether the damage is enough, since spread moves are stronger anyway",
              "什么也不需要，友伤只是小概率事件|Nothing, since friendly fire is a rare event",
            ],
            answer: 0,
            why: [
              "地面范围攻击会命中相邻队友，所以友方守得住这一回合，比任何事后补救都便宜。|The Ground spread reaches the adjacent ally, so a partner Protect is the cheapest way to make the turn legal.",
              "广域防守确实要判断，但先把队友安排好才有资格谈覆盖率。|Wide Guard is a real question, but the ally has to be handled before coverage means anything.",
              "范围招式命中多个目标时有 0.75 倍修正，它并不比其他招式更强。|That gets the modifier backwards: spread loses 0.75× when it hits several targets.",
              "只要队友接地，友伤就是必然结果而不是概率事件。|While the partner is grounded, the ally hit is certain, not occasional.",
            ],
          }),
          dq({
            id: "doubles-spread-tradeoff",
            level: "applied",
            scene: {
              side: "一个确定能穿透气势披带的集火组合，与一个能同时覆盖两只的范围招式。|A focus combination that reliably breaks a Focus Sash, and a spread move that can pressure both foes.",
              foes: "一只满血披带输出手与 一只高特防耐久手。|A full-HP Focus Sash attacker and a high special-defense wall.",
              field: "第 6 回合。|Turn 6.",
              known: "对手本回合有广域防守的打算，但你还不知道。|The opponents may spend this turn on Wide Guard, though you cannot be sure.",
            },
            prompt:
              "关于集火与范围，下列哪一条判断是正确的？|Which statement about focusing and spread is correct?",
            options: [
              "范围招式命中多个目标时有 0.75 倍修正，所以“稳定击倒”和“覆盖全场”通常需要两套工具|Spread moves take the 0.75× modifier with multiple targets, so a guaranteed KO and full-field coverage normally need different tools",
              "0.75 倍修正只在打到自己的队友时才出现|The 0.75× modifier only appears when you hit your own ally",
              "气势披带能挡住范围招式，所以范围攻击对满血目标无效|Focus Sash blocks spread moves, so spread attacks cannot pressure a full-HP target",
              "集火两次永远比一次范围攻击更省回合|Two focused attacks always cost fewer turns than one spread attack",
            ],
            answer: 0,
            why: [
              "把两个工具分开用，才既不会被 0.75 修正削弱，也不必赌对手的防守选择。|Separating the two tools keeps the 0.75× penalty off your KO plan and keeps you off their Wide Guard read.",
              "修正由命中目标数量决定，与是不是自己的队友无关。|Candidate B is wrong about the trigger: it is the number of targets, not the allegiance.",
              "气势披带只挡一次致命攻击，不会让范围招式失效。|Candidate C overstates Sash, which only survives one lethal hit.",
              "两次集火要用两个动作和一个回合以上；一条回合内的效率最高的是一次覆盖。|Candidate D miscounts: two focused attacks cost two actions and can span turns.",
            ],
          }),
        ],
      ),
    ],
    [
      dq({
        id: "doubles-check1",
        level: "applied",
        scene: {
          side: "你的两只：一只想输出一记高威力单体，另一只想收尾。|One slot wants to land a heavy single-target hit; the other wants to close.",
          foes: "热风 Thermal Arc 等范围攻击使用者与 一只单体输出手。|A Heat Wave user and a single-target attacker.",
          field: "第 3 回合。|Turn 3.",
          known: "本回合对手的热风不会被任何改向手段影响。|Their Heat Wave cannot be redirected by anything this turn.",
        },
        prompt:
          "看我嘛通常能把热风从队友身上引走吗？|Does Follow Me normally redirect Heat Wave away from its partner?",
        options: ["能|Yes", "不能|No"],
        answer: 1,
        why: [
          "热风是范围招式，改向手段对范围攻击无效，所以队友仍然会被命中。|Heat Wave is a spread move, so redirection does not apply and the partner is still hit.",
          "想保护队友免受范围攻击，需要广域防守而不是看我嘛。|Protecting a partner from spread damage calls for Wide Guard, not Follow Me.",
        ],
      }),
      dq({
        id: "doubles-check2",
        level: "applied",
        scene: {
          side: "你的收尾手（幽灵属性扫墓）与 三只已经倒下的参战队友。|Your cleaner with Ghost-type Last Respects, and three selected allies already fainted.",
          foes: "两只残血对手。|Two low-HP foes.",
          field: "第 10 回合。|Turn 10.",
          known: "队伍没有复活，选出时也没有多选宝可梦。|No revival, and no extra Pokémon were selected.",
        },
        prompt:
          "双打四只中三只已倒下，无复活，扫墓基础威力？|Three of your four selected Pokémon have fainted, with no revival. Last Respects base power?",
        options: ["150|150", "200|200", "250|250"],
        answer: 1,
        why: [
          "50 + 50 × 3 = 200；倒下的只有你的参战队友，未选出的成员不计入。|50 + 50 × 3 = 200, and only your selected allies count, not the bench.",
          "150 少算了一位倒下队友，这一项按 150 结算是因为少算了一位。|Candidate A is 150 because it undercounts the fainted allies by one.",
          "250 之所以超出，是因为它把未选出的成员也算进倒下数量。|Candidate C is 250 because it folds the unselected Pokémon into the count.",
        ],
      }),
      dq({
        id: "doubles-check3",
        level: "applied",
        scene: {
          side: "一个确定能击倒披带目标的集火组合，与一个能同时压两只的范围招式。|A focus combination that reliably breaks a Focus Sash, and a spread move that pressures both foes.",
          foes: "满血披带输出手与 高特防耐久手，都可能在本回合选择广域防守。|A full-HP Focus Sash attacker and a high special-defense wall, either of whom may choose Wide Guard.",
          field: "第 6 回合，你落后。|Turn 6, and you are behind.",
          known: "两个工具都在你手上，本回合你只能用一个。|Both tools are in hand and you get one action this turn.",
        },
        prompt:
          "落后局面下，用哪一个工具更合理？|When behind, which tool is the sounder one to spend?",
        options: [
          "确定能击倒披带目标的集火：落后时最缺的是把局面扳回来的确定性|The focus that breaks the Sash, because being behind needs a deterministic swing back",
          "范围招式：一次动两只可以追回两个回合的差距|The spread move, because hitting two foes claws back two turns at once",
          "看对手本回合的防守选择再决定|Leave it open and decide after you see their defensive choice",
        ],
        answer: 0,
        why: [
          "落后时最值钱的是确定性，而集火正是唯一能保证结算的那个工具。|When behind, certainty is what you are short of, and focus is the only tool that guarantees resolution.",
          "范围招式在这个局面里还要同时应付 0.75 修正和可能的广域防守。|Candidate B still has to absorb the 0.75× modifier and a possible Wide Guard while behind.",
          "“看对手选什么再决定”在这个回合内无法执行：动作一旦提交就不能改。|Candidate C is not an available decision; a submitted action cannot be revised after the opponent answers.",
        ],
      }),
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
      lesson(
        "terrain-timing",
        "接地判定与场地生效的时机|Grounding checks and when terrain actually starts",
        [
          "接地的判定对象是目标，不是使用者。飞行属性、飘浮特性、携带气球都让目标不接地，而大多数场地效果只对接地者生效。所以“能不能用击掌奇袭”这类问题，永远先问目标站在哪儿。|Grounding is evaluated on the target, not the user. Flying typing, Levitate and a held Air Balloon all make a target ungrounded, and most terrain effects only reach grounded Pokémon. So for any “can I use Fake Out” question, start by asking where the target stands.",
          "场地在它自己的招式结算时才建立。设置场地的招式通常是 0 优先度，所以同一回合里 +1 或 +3 的先制已经在旧场地下结算完了。想让先制改变可用性，场地必须在回合开始之前就已经存在，或者由一个更早结算的动作提供。|Terrain starts when its own move resolves. Terrain moves are normally priority 0, so any +1 or +3 action in the same turn already resolved under the old terrain. To change whether priority works, the terrain has to exist before the turn begins or come from an earlier action.",
          "覆盖会替换规则，不会回滚已经发生的事。新场地覆盖旧场地（通常持续 5 回合），天气与场地是互相独立的两套状态；已经被消耗的种子、已经触发的轻装、已经生效过的保护都不会因为覆盖而恢复或消失。|An overwrite replaces the rules; it does not roll back what already happened. A new terrain replaces the old one (normally five turns), weather and terrain are separate systems, and a consumed seed, an activated Unburden or a protection that already fired neither returns nor disappears because of the change.",
          "覆盖的代价是场地手必须能安全上场。如果你唯一的收尾手是唯一能开场地的那只，用它去换一个 5 回合的增益，就等于用一个不可替代的角色换一个短期效果——先确认场地带来的东西值得这个交换。|The price of an overwrite is that your setter has to survive entry. If your only cleaner is also your only terrain setter, spending it to buy a five-turn effect trades an irreplaceable role for a short one, so check that the terrain is worth that exchange first.",
        ],
        [
          dq({
            id: "terrain-window-priority",
            level: "applied",
            scene: {
              side: "本回合才上场的电气场地手（青草场地不再需要），以及一个单体输出手。|An Electric Terrain setter entering this turn, plus a single-target attacker.",
              foes: "一只接地的青草滑梯使用者（+1）与 一只飞行属性的先制威胁。|A grounded Grassy Glide user (+1) and a Flying-type priority threat.",
              field: "当前是薄雾场地，第 3 回合。|Misty Terrain is active, turn 3.",
              known: "对手本回合不会换人；你的场地手只有 0 优先度的场地招式。|The foes will not switch; your setter only has a priority-0 terrain move.",
            },
            prompt: "这一回合对手的青草滑梯还能拿到 +1 吗？|Can the opponent’s Grassy Glide still take +1 this turn?",
            options: [
              "能：场地要等 0 优先度招式结算才建立，先制已经在旧场地下出手|Yes: terrain only starts when the priority-0 move resolves, and priority already acted under the old terrain",
              "不能：场地手一上场，场地就已经是新场地|No: the moment the setter enters, the new terrain is already in place",
              "只有不接地的飞行目标才保留 +1|Only the ungrounded Flying target keeps +1",
            ],
            answer: 0,
            why: [
              "+1 的青草滑梯在第一层就结算，而电气场地是 0 优先度，所以覆盖来得太晚。|Grassy Glide resolves in the first layer while the terrain move is priority 0, so the overwrite arrives after it.",
              "上场只完成换人，场地效果要等场地招式本身结算才成立。|Candidate B confuses entering the field with activating the field effect, which happens only when the terrain move resolves.",
              "接不接地决定的是场地效果，不是优先度本身；优先度是独立的一层。|Candidate C mixes up grounding with priority: grounding governs terrain effects, not move order.",
            ],
          }),
          dq({
            id: "terrain-grounded-target",
            level: "applied",
            scene: {
              side: "能打飞行属性的单体招式，与 一个需要铺场的支援手。|A single-target move that can reach Flying types, plus a setup supporter.",
              foes: "精神场地已开；一只接地的输出手与 一只不接地的飞行属性先制威胁。|Psychic Terrain is active; a grounded attacker and an ungrounded Flying-type priority threat.",
              field: "第 5 回合。|Turn 5.",
              known: "你不知道对方是否携带气球，飞行属性本身就足以让它不接地。|You do not know about an Air Balloon, and Flying typing alone is enough to be ungrounded.",
            },
            prompt: "这一回合该怎么分配目标？|How should you allocate your targets this turn?",
            options: [
              "用能打飞行的单体招式处理不接地的威胁，接地那只交给队友或下一回合；精神场地保护不了它|Take the ungrounded threat with a single-target move that reaches it; leave the grounded one to your partner or next turn, because Psychic Terrain does not cover it",
              "用击掌奇袭一次处理两只，精神场地会保证它成功|Fake Out covers both at once, and Psychic Terrain guarantees it",
              "等精神场地消失之后再行动|Wait for the Psychic Terrain to expire before acting",
              "改用范围招式，一次覆盖两个位置|Switch to a spread move so one attack covers both slots",
            ],
            answer: 0,
            why: [
              "场地只保护接地目标，所以不接地的先制威胁必须用能命中的招式单独处理。|The terrain only shields grounded targets, so an ungrounded priority threat needs a move that can actually reach it.",
              "精神场地不会替你打中一只不接地的目标。|Candidate B asks the terrain to do something it does not do.",
              "等场地结束要花五个回合，而对手每回合都在行动；而且它本来也保护不了那只飞行目标。|Candidate C gives up five turns of opponent actions to wait for a protection that never applied to that target anyway.",
              "范围招式确实能命中它，但要付 0.75 倍修正，还要赌对手的广域防守。|Candidate D can reach it, but it pays the 0.75× modifier and invites a Wide Guard.",
            ],
          }),
          dq({
            id: "terrain-unburden-replace",
            level: "applied",
            scene: {
              side: "一个能在本回合覆盖成青草场地的支援手。|A supporter that can overwrite into Grassy Terrain this turn.",
              foes: "接地的、已触发轻装的大狃拉，以及一只接地的输出手。|A grounded Sneasler with Unburden already triggered, and a grounded attacker.",
              field: "当前是电气场地，第 4 回合。|Electric Terrain is active, turn 4.",
              known: "大狃拉不会再获得任何道具；你的支援手上场是安全的。|Sneasler will not regain an item, and your supporter enters safely.",
            },
            prompt: "覆盖场地对大狃拉的速度意味着什么？|What does the terrain overwrite mean for Sneasler’s Speed?",
            options: [
              "没有任何改变：轻装取决于它自己的道具状态，与场地无关|Nothing changes, because Unburden tracks its own item and not the terrain",
              "覆盖会让它慢下来，你因此追回速度差|The overwrite slows it down, so you recover the Speed gap",
              "覆盖会让它重新消耗种子并再次加速|The overwrite lets it consume a seed again and speed up once more",
              "只要它站在场地上，加速只维持到场地结束|The boost lasts only as long as the terrain",
            ],
            answer: 0,
            why: [
              "轻装在道具被消耗后就一直生效，场地替换不会回滚这个状态。|Unburden applies once the item is consumed and stays applied; a terrain change cannot rewind it.",
              "覆盖场地不会削减速益，它只改变场地的规则。|Candidate B invents a slowdown that terrain replacement does not cause.",
              "它的种子已经用掉，覆盖场地不会凭空再给它一颗。|Candidate C needs an item Sneasler no longer holds.",
              "加速来自特性，不来自场地，所以它不会随场地结束。|Candidate D is wrong on the source: the boost comes from the ability, so it does not expire with the terrain.",
            ],
          }),
          dq({
            id: "terrain-weather-window",
            level: "applied",
            scene: {
              side: "可上场的电气场地手，以及一只靠单体输出完成集火的输出手。|An Electric Terrain setter available to switch in, plus a single-target attacker built for a focus.",
              foes: "雨天加速的输出手（雨天还剩 1 回合）与 一只支援手。|A Swift Swim attacker with one turn of rain left, and a support Pokémon.",
              field: "无场地，第 6 回合。|No terrain, turn 6.",
              known: "对手本回合会攻击；雨天与场地是两套独立状态。|The opponent will attack this turn; weather and terrain are separate systems.",
            },
            prompt: "这一回合最合理的计划是？|What is the soundest plan for this turn?",
            options: [
              "换入电气场地手，同时用单体输出处理靠雨天加速的那只；雨停不会让场地失效|Switch in the Electric Terrain setter and take out the Swift Swim attacker with your single-target move; rain ending does not cancel terrain",
              "只开场地，把输出留给下一回合，因为雨天本回合就会结束|Set terrain only and save your damage for next turn, since the rain ends this turn",
              "让收尾手去开场地，用场地加速自己的攻击|Have your cleaner overwrite the terrain to boost its own damage",
              "追着对手换天气，把回合花在天气博弈上|Chase the opposing weather change and spend the turn on weather",
            ],
            answer: 0,
            why: [
              "场地手上场不占用你的输出动作，所以你同时完成铺场与集火。|Switching is free, so you can install the field and still land the focus in the same turn.",
              "雨天结束不代表这一回合安全，对手仍然会行动。|Candidate B treats weather ending as safety; the opponent still takes its turn.",
              "电气场地不提供任何攻击加成，而让收尾手进场等于给全场最大的风险。|Candidate C misreads the terrain, which grants no damage bonus, and spends your cleaner’s entry.",
              "换天气能拖时间，但不推进你的胜利条件。|Candidate D stalls without moving the win condition forward.",
            ],
          }),
        ],
      ),
    ],
    [
      dq({
        id: "terrain-check1",
        level: "applied",
        scene: {
          side: "你的先制控场手与 一个单体输出手。|Your priority control user and a single-target attacker.",
          foes: "精神场地已开；一只接地的输出手与 一只不接地的飞行属性威胁。|Psychic Terrain is active; a grounded attacker and an ungrounded Flying-type threat.",
          field: "第 6 回合。|Turn 6.",
          known: "对手没有防畏缩特性，但飞行属性本身让先制保护失效。|Neither foe absorbs flinching, but Flying typing alone defeats the priority protection.",
        },
        prompt:
          "精神场地保护通常不接地的飞行属性目标免受先制吗？|Does Psychic Terrain protect an ordinarily ungrounded Flying target from priority?",
        options: ["是|Yes", "否|No"],
        answer: 1,
        why: [
          "保护对象是接地目标；不接地的飞行属性不在保护范围内，所以先制照常打出。|The protection is granted to grounded targets, so an ungrounded Flying-type is still hit by priority moves.",
          "场地是否生效与你的使用者是谁无关，只与目标站在哪儿有关。|Whether the terrain applies depends on the target’s footing, never on your own user.",
        ],
      }),
      dq({
        id: "terrain-check2",
        level: "applied",
        scene: {
          side: "你本回合可以开电气场地。|You can set Electric Terrain this turn.",
          foes: "一只已经睡着的接地输出手，以及一只带防睡特性（已确认）的干扰手。|An already-asleep grounded attacker, and a confirmed insomnia-immune disruptor.",
          field: "当前无场地，第 5 回合。|No terrain yet, turn 5.",
          known: "睡着的那只已经睡了至少两个行动检查。|The sleeping target has already been through at least two wake checks.",
        },
        prompt:
          "电气场地会让已经睡着的接地宝可梦立即醒来吗？|Does Electric Terrain immediately wake an already-asleep grounded Pokémon?",
        options: ["会|Yes", "不会|No"],
        answer: 1,
        why: [
          "电气场地只阻止新的入睡，对已有的睡眠无效。|Electric Terrain prevents new sleep; it does not cure existing sleep.",
          "所以它是一个预防工具，而不是一个唤醒工具。|That makes it a preventive tool, not a wake-up tool.",
        ],
      }),
      dq({
        id: "terrain-check3",
        level: "applied",
        scene: {
          side: "一只麻痹控速手与 一个能开电气场地支援手。|A paralysis controller and a supporter who can set Electric Terrain.",
          foes: "一只怕水的龙属性输出手与 一只带防眠特性的干扰手。|A Water-weak Dragon attacker and a confirmed insomnia-immune disruptor.",
          field: "本回合你可以开电气场地。|You could set Electric Terrain this turn.",
          known: "本回合你只能做一件事：开场地，或麻痹目标。|You have one action this turn: set the terrain, or paralyse the target.",
        },
        prompt:
          "关于场地与异常状态，下列哪一条判断是正确的？|Which statement about terrain and status is correct?",
        options: [
          "电气场地只阻止新的睡眠；它不会阻止麻痹，也不会唤醒已经睡着的目标|Electric Terrain blocks new sleep only; it neither prevents paralysis nor wakes an existing sleeper",
          "电气场地会让麻痹对接地目标无效|Electric Terrain makes paralysis fail against grounded targets",
          "电气场地会立刻唤醒已经睡着的接地目标|Electric Terrain immediately wakes a grounded target that is already asleep",
          "站在电气场地上的任何异常状态都会被清空|Any status on a Pokémon standing in Electric Terrain is cleared",
        ],
        answer: 0,
        why: [
          "电气场地只与睡眠这一件事有关，其余状态与场地互不干涉。|Electric Terrain interacts with sleep and nothing else; other statuses are untouched by it.",
          "麻痹不受电气场地影响，所以你还是可以直接用它控速。|Candidate B is wrong, so paralysis remains a perfectly good speed tool here.",
          "它防止新的入睡，不治疗已有的睡眠。|Candidate C reverses the effect: prevention, not cure.",
          "场地不会清除任何状态；换下也不会治好普通异常状态。|Candidate D describes a mechanic that does not exist, and ordinary switching does not cure status either.",
        ],
      }),
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
      dq({
        id: "weather-check1",
        level: "applied",
        scene: {
          side: "一个靠雨天才划算的输出手与 一个能拖时间的手。|An attacker that only pays off in rain and a stalling option.",
          foes: "依赖雨天加速的输出手（雨天剩 2 回合）与 一只天气手（后排有晴天替补）。|A Swift Swim attacker with two turns of rain left, plus a weather setter with a sun reserve behind it.",
          field: "无场地，第 8 回合；你落后。|No terrain, turn 8; you are behind.",
          known: "天气手会主动替换天气来重新加速。|The weather setter will replace the weather to restore the boost.",
        },
        prompt: "这两回合你的规划方式应该是？|How should you plan these two turns?",
        options: [
          "按“雨天会在这一回合内仍然存在”来规划，把它当窗口而不是长期状态|Plan as if the rain will still be up for this turn, treating it as a window rather than a baseline",
          "忽略雨天，因为它随时可能结束|Ignore rain, because it can end at any time",
          "先花一个回合换掉天气手，把雨拖到结束再打|Spend one turn switching out the setter to outlast the rain before attacking",
          "假设雨天会持续到本局结束再规划|Plan as if the rain will last the whole game",
        ],
        answer: 0,
        why: [
          "两回合的窗口足够你换掉一个依赖加速的威胁，而规划的前提必须与场上事实一致。|Two turns are enough to remove a boost-dependent threat, and the plan has to match the board as it is.",
          "窗口仍然存在，所以完全忽略天气等于在错误的假设上做决定。|Candidate B plans on a board that does not exist yet.",
          "合法但你只是把换人的回合让出去，雨还在，对手的加速也还在。|Candidate C is legal yet wasteful: the rain persists and so does the boost you wanted to remove.",
          "假设天气不会结束，等于把你最需要的信息当成已知。|Candidate D hard-codes an assumption about the one thing you cannot know.",
        ],
      }),
      dq({
        id: "weather-check2",
        level: "applied",
        scene: {
          side: "火属性本系输出手与 一个能打龙的单体招式。|A Fire STAB attacker and a single-target move that reaches Dragons.",
          foes: "雨天中的火属性耐久手 与 一只怕水的龙属性输出手。|A bulky Fire-type foe in rain and a Water-weak Dragon attacker.",
          field: "雨天还剩 4 回合，无场地。|Four turns of rain, no terrain.",
          known: "火招式在常规雨天下伤害减半；两只对手本回合都会攻击。|Fire damage is halved in ordinary rain, and both foes will attack this turn.",
        },
        prompt: "这个回合你更应该依赖哪个选项？|Which option should this turn rely on more?",
        options: [
          "能打龙的单体招式：雨天削弱火，不影响龙的路线|The single-target move that reaches Dragons, since rain weakens Fire and leaves Dragon routes intact",
          "火招式：对手的火属性耐久手血量不高，依然值得赌|Fire is still worth gambling on because their bulky Fire-type is at low HP",
          "范围火招式：同时打两只，0.75 修正也够|A spread Fire move to reach both despite the 0.75× modifier",
          "等雨结束再用火招式|Wait for the rain to end before using Fire",
        ],
        answer: 0,
        why: [
          "雨天把你唯一稳定的输出路线砍半，却不动另一条；此时应该把回合交给不受影响的那条。|Rain halves one of your two routes and leaves the other alone, so the unaffected route should take the turn.",
          "减半的伤害需要更多回合才能击倒，也就给了对手更多回合反击。|Halved damage needs extra turns, and every extra turn is a turn the opponent gets to hit back.",
          "范围招式同时吃雨天的减伤与 0.75 修正，还可能撞上广域防守。|Candidate C stacks the rain penalty, the 0.75× modifier and a possible Wide Guard on one move.",
          "你无法决定雨何时结束，而对手可以主动替换天气。|Candidate D hands the timing decision to the opponent.",
        ],
      }),
      dq({
        id: "weather-check3",
        level: "applied",
        scene: {
          side: "一个能单独击倒的集火目标，与 一个能把伤害打满的单体招式。|A focus target you can KO alone, and a single-target move that can build the damage.",
          foes: "雨天中的大嘴鸥（后排有晴天替补）与 一只雨天加速的输出手。|Pelipper in rain with a sun reserve behind it, and a Swift Swim attacker.",
          field: "雨天还剩 2 回合，第 4 回合；你领先一点。|Two turns of rain left, turn 4; you are slightly ahead.",
          known: "大嘴鸥本回合会攻击；你无法决定雨天何时结束。|Pelipper attacks this turn and you do not control when the rain ends.",
        },
        prompt: "这一回合的取舍是？|What is the trade-off for this turn?",
        options: [
          "把集火放在这回合能击倒的那只身上，接受它这一回合的雨天输出，然后按“雨仍在”继续规划|Commit to the KO you can land this turn, accept the rain-boosted hit, and keep planning as if the rain persists",
          "先换掉大嘴鸥，让雨继续但拿掉它的支援，再慢慢打|Switch out Pelipper to keep the rain but remove its support, then grind",
          "等雨自然结束再开始进攻|Wait for the rain to end before pressing",
          "用范围水招式同时压两只，取消雨天带来的加速优势|Spread Water onto both foes to cancel the Swift Swim advantage",
        ],
        answer: 0,
        why: [
          "减少一个威胁的价值高于多花一个回合，而且后续规划只需要承认一个事实：雨很可能还在。|Removing a threat now beats spending a turn on it, and “the rain is probably still up” is the only assumption you need afterwards.",
          "合法，但换下不改变天气，对手的加速与输出都还在，等于把节奏交给对方。|Candidate B is legal yet it leaves both the weather and the boost in place while giving away tempo.",
          "天气何时结束不由你决定，等它结束就是等对手决定。|Candidate C is waiting on the opponent’s timing decision.",
          "范围招式有 0.75 倍修正，还把对手的广域防守引到了你面前。|Candidate D pays the 0.75× modifier and invites the read you are least equipped to handle.",
        ],
      }),
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
      lesson(
        "item-inference",
        "道具是推理出来的|Items are inferred, not guessed",
        [
          "读道具分两步。第一步是列出这局里合理的几种配置；第二步是等一个能把它们区分开的事实：种子在对应场地上被消耗、气势披带挡下一击、速度明显超出你的预期。使用率只提供第一步的概率，不提供结论。|Reading an item takes two steps. First list the plausible sets for this battle; second wait for a fact that separates them: a seed consumed on matching terrain, a Focus Sash eating one lethal hit, Speed that clearly beats your expectation. Usage only informs the first step, never the conclusion.",
          "读错的代价是对称的，而且立即结算。你按“带围巾”排好的出手顺序，在对方其实没带时会反过来；你按“有种子”准备的地覆盖计划，在对方没带时会浪费一整回合并暴露场地手。|A misread is symmetric and settles immediately. A turn order built around Scarf inverts when they do not hold it, and a terrain plan built around a seed wastes a whole turn and exposes your setter.",
          "讲究锁招是一次性约束：锁定后本回合一直有效，只有换下才解除。先制不绕过它，替身也不绕过它。这意味着“有威胁要处理”和“我能改点”往往是互斥的。|A Choice lock is a one-action constraint: it holds for the rest of the turn and only a switch clears it. Priority does not bypass it and Substitute does not bypass it, so “there is a threat” and “I can change my move” are often mutually exclusive.",
          "最便宜的防守，是让计划在两种可能下都成立。如果一条路线只在某一种道具假设下才赢，它就不该是你唯一的路线；第二种可能不需要被排除，只需要被覆盖。|The cheapest defence is a plan that holds under two hypotheses. If a line only wins under one item assumption, it should not be your only line; the second possibility does not need eliminating, only covering.",
        ],
        [
          dq({
            id: "item-inference-sash",
            level: "applied",
            scene: {
              side: "一个 100% 命中的单体输出手，后排有补刀手段。|A 100%-accurate single-target attacker with a finisher in reserve.",
              foes: "一只满血宝可梦，本回合被你的单体招式命中。|A full-HP foe that your single-target move hit this turn.",
              field: "第 6 回合，无场地。|Turn 6, no terrain.",
              known: "对手没有守住；你的招式必定命中。|The foe cannot Protect and your move cannot miss.",
            },
            prompt: "它倒下时只剩 1 HP，这条信息说明什么？|It drops to 1 HP. What does that tell you?",
            options: [
              "它携带气势披带并且刚刚承受了第一次致命攻击，下回合一次攻击就能结束它|It holds a Focus Sash and just absorbed its first lethal hit, so one attack ends it next turn",
              "它携带生命宝珠，并且你的招式已经让它付出了血量代价|It holds a Life Orb and your move already charged it HP",
              "它的实际耐久远低于你估计|Its real bulk is far lower than you estimated",
              "你的招式实际上没有命中|Your move actually missed",
            ],
            answer: 0,
            why: [
              "披带只在满血时挡下一次致命攻击，所以它的存在同时确认了道具和剩余状态。|Sash only triggers at full HP against one lethal hit, so the observation confirms both the item and the remaining state.",
              "生命宝珠不会让被击中的目标停在 1 HP。|Candidate B describes a recoil effect that never applies to the target.",
              "停在 1 HP 是披带的特征信号，不是因为它太脆。|Candidate C reads a signature item indicator as a bulk estimate.",
              "如果没命中，它的血量不会变成 1。|Candidate D contradicts what you saw.",
            ],
          }),
          dq({
            id: "item-inference-seed",
            level: "applied",
            scene: {
              side: "一个可以覆盖场地的支援手。|A supporter that can overwrite the terrain.",
              foes: "一只接地的输出手与 一只地面／钢的干扰手。|A grounded attacker and a Ground/Steel disruptor.",
              field: "青草场地，第 7 回合。|Grassy Terrain, turn 7.",
              known: "那只输出手本回合消耗了场上的种子并加速。|That attacker consumed a seed from the field this turn and gained Speed.",
            },
            prompt: "这条信息最直接改变的是哪个判断？|Which judgement does this change most directly?",
            options: [
              "它带的是种子：覆盖场地不会取消它的加速，所以不要再指望它掉速|It holds a seed: overwriting the terrain will not remove the boost, so stop expecting it to slow down",
              "它没有道具，所以可以放心使用破坏道具的招式|It has no item, so item-removal moves are now safe",
              "它下回合还会再加速一次|It will speed up once more next turn",
              "它是地面属性，所以地面招式能打四倍|It is Ground-typed, so Ground moves are ×4",
            ],
            answer: 0,
            why: [
              "种子消耗证明的是“它有种子并已经触发轻装”，因此场地覆盖对它无效。|A consumed seed tells you it holds one and has already triggered Unburden, so a terrain overwrite changes nothing for it.",
              "消耗掉道具恰恰证明它之前有道具。|This inverts the evidence: consumption is proof of an item.",
              "加速不会每回合叠加，也不会因为场地被覆盖而重来。|That mechanism does not exist; the boost neither stacks nor restarts.",
              "种子消耗不透露属性，属性仍然要靠招式确认。|Candidate D invents type information from an item event.",
            ],
          }),
          dq({
            id: "item-choice-lock-scenario",
            level: "applied",
            scene: {
              side: "围巾锁招的输出手（上回合用了扫墓，本回合没有换下），队友有一记先制控制。|A Scarf-locked attacker that used Last Respects last turn and has not switched; its partner has a priority control move.",
              foes: "一只 +1 优先度的先制威胁，与 一只支援手。|A +1 priority threat and a support Pokémon.",
              field: "第 8 回合，无场地。|Turn 8, no terrain.",
              known: "对手本回合不会换人，也还没有本回合已知的先制招式。|The foes will not switch and no priority move is confirmed for them this turn.",
            },
            prompt: "这一回合怎么安排更稳？|What is the sounder arrangement this turn?",
            options: [
              "让队友的先制处理威胁，你的输出手正常执行它锁定的那一招；或换下它解除锁招后重新安排|Let the partner’s priority handle the threat while your locked attacker plays the move it is locked into; or switch it out to clear the lock and replan",
              "本回合改用水流喷射，因为先制不受锁招限制|Change to Aqua Jet this turn, since priority ignores the Choice lock",
              "换另一个更痛的招式，反正围巾只在第一回合锁定|Switch to a stronger move, since the Scarf only locks on the first turn",
              "先让对手行动，锁招自然就解除了|Let the opponents act first so the lock expires on its own",
            ],
            answer: 0,
            why: [
              "锁招只影响你自己的可选招式，不影响队友；把先制交给队友，你可以照常兑现锁定的输出。|The lock constrains your own move choice only, so handing priority to the partner lets you still cash in the locked attack.",
              "先制是优先度概念，它不会解除讲究锁定。|Candidate B confuses priority order with the Choice lock.",
              "围巾在整回合内持续锁定，并不是只锁第一回合。|Candidate C gets the duration wrong: the lock lasts the whole turn.",
              "没有任何机制会在回合进行中自动解除锁招。|Candidate D describes a rule that does not exist.",
            ],
          }),
          dq({
            id: "item-robust-plan",
            level: "applied",
            scene: {
              side: "一个集火计划，两种对手道具假设都还成立：围巾（很快）或攻击布（不快但更痛）。|A focus plan that is still valid under two item hypotheses: Scarf (very fast) or Choice Band (slower but harder hitting).",
              foes: "一只速度未知的输出手，本回合会攻击。|An attacker of unknown Speed that will act this turn.",
              field: "第 5 回合，无场地、无天气。|Turn 5, no terrain and no weather.",
              known: "对手不会换人，也没有守住的迹象。|The foe will not switch and shows no sign of Protect.",
            },
            prompt: "这个集火计划应该怎么排，才对两种假设都成立？|How should you order the focus so it holds under both?",
            options: [
              "把攻击交给确定能先动的队友，你守住或锁住另一个位置；这样两种速度假设下结算顺序都成立|Hand the attack to the partner that is certain to move first while you hold or lock the other slot, so resolution order holds under both Speed hypotheses",
              "按围巾假设排出手顺序，赌它更快|Order the turn on the Scarf hypothesis and bet it is faster",
              "按攻击布假设排出手顺序，赌它更痛但不更快|Order the turn on the Band hypothesis and bet it hits harder but is slower",
              "先什么都不做，等它展示速度再决定|Wait and see what its Speed is before committing",
            ],
            answer: 0,
            why: [
              "不依赖未知信息的顺序在两种假设下都能结算，这是覆盖而不是预测。|A sequence that does not rely on the unknown resolves under either hypothesis; that is coverage rather than prediction.",
              "赌一种假设，就是把整回合交给一个你还没确认的事实。|Candidate B bets the turn on an unconfirmed fact.",
              "这一支同样只在一种假设下成立；而且“先动”带来的伤害优势并不一定需要。|Candidate C is equally assumption-dependent, and going first is not worth an unreliable plan.",
              "等待会交出行动顺序，而对手每回合都会消耗你的时间与血量。|Candidate D donates turn order while the opponent spends your clock and HP.",
            ],
          }),
        ],
      ),
    ],
    [
      dq({
        id: "item-check1",
        level: "applied",
        scene: {
          side: "突击背心特攻手（本回合需要挡住一次集火）与 一个本回合能击倒的集火目标。|An Assault Vest special attacker that must survive a focused hit, and a focus target you can KO this turn.",
          foes: "两只 0 优先度输出手，都会攻击背心那一侧。|Two priority-0 attackers, both aimed at the Vest side.",
          field: "第 6 回合，无场地。|Turn 6, no terrain.",
          known: "本回合是你第一次使用突击背心；对手没有穿透手段。|This is your first turn with the Assault Vest, and the foes cannot bypass Protect.",
        },
        prompt:
          "突击背心使用者能正常选择守住吗？|Can an Assault Vest holder normally select Protect?",
        options: ["能|Yes", "不能|No"],
        answer: 1,
        why: [
          "守住是变化招式，突击背心会封锁这类招式，所以它的常规防御手段被拿掉了。|Protect is a status move, which the Assault Vest blocks, so its normal defensive option is gone.",
          "这意味着背心使用者必须靠换人、位置或队友来替代守住。|The Vest holder therefore needs switching, positioning or its partner instead of Protect.",
        ],
      }),
      dq({
        id: "item-check2",
        level: "applied",
        scene: {
          side: "两只分别携带 Mega 石的队友，都在你的四只参战名单里。|Two team members each hold a Mega Stone, and both are among your four selected.",
          foes: "依赖对手先动才能建立优势的阵容。|A set that needs your opponent to move first to take shape.",
          field: "第 4 回合，已进入战斗。|Turn 4, already in battle.",
          known: "你本回合的 Mega 进化名额还没有使用。|Your one Mega Evolution for this battle is still unused.",
        },
        prompt:
          "队里两只带 Mega 石，能在同场都 Mega 进化吗？|Two team members hold Mega Stones. Can both Mega Evolve in one battle?",
        options: ["能|Yes", "不能|No"],
        answer: 1,
        why: [
          "每场只有一次 Mega 进化机会，所以第二只需要提前选出而不是留到场上再决定。|There is one Mega Evolution per battle, so the second one has to be chosen at preview rather than on the field.",
          "因此核心问题是“你围绕哪一只打”，而不是“我能不能两只都变”。|The real question is which one you build the plan around, not whether both can change.",
        ],
      }),
      dq({
        id: "item-check3",
        level: "applied",
        scene: {
          side: "围巾输出手，上回合使用了扫墓，本回合没有换下。|A Scarf attacker that used Last Respects last turn and has not switched.",
          foes: "一只一般属性的目标（本回合在你面前）与 一只支援手。|A Normal-type target in front of you and a support Pokémon.",
          field: "第 8 回合，无场地。|Turn 8, no terrain.",
          known: "没有可以绕过锁招的机制；你的先制招式不会解除锁招。|Nothing bypasses the lock here, and your priority move does not clear it.",
        },
        prompt:
          "面对一般属性的目标，这一回合的输出情况是？|Against a Normal-type target, what is this turn’s damage situation?",
        options: [
          "你只能继续用扫墓，而扫墓对一般属性是 0 倍，所以这一回合无法打出伤害|You must keep using Last Respects, which is ×0 into Normal, so you cannot deal damage this turn",
          "你可以临时换一招，下一回合会自动变回扫墓|You can pick another move for this turn and it reverts next turn",
          "你可以换招，因为围巾只锁定一次|You can change move, because the Scarf only locks once",
          "必须换下再上场才能改点|You have to switch out and back before changing move",
        ],
        answer: 0,
        why: [
          "锁招把可选招式固定成扫墓，而扫墓对一般属性无效，于是伤害被锁成 0。|The lock fixes your move to Last Respects and Normal typing zeroes it, so the turn’s damage is fixed at zero.",
          "不存在“临时换一招”这一步；锁招没有单回合豁免。|Candidate B invents a one-turn exception that does not exist.",
          "锁招持续整个回合，不是只锁一次。|Candidate C gets the duration wrong again.",
          "换下确实能解除锁招，但代价是交出这一回合的行动，而不是当前就能改点。|Candidate D names a real reset but prices it as a current-turn option.",
        ],
      }),
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
              "本回合先观察对手的防守选择再决定|Watch their defensive choice this turn before committing",
            ],
            0,
            "帮助把该回合的输出集中到主攻手；观察回合则是把优势交给对方。|Helping Hand concentrates the turn’s damage into the attacker; a scouting turn hands the initiative away.",
          ),
        ],
      ),
    ],
    [
      dq({
        id: "support-check1",
        level: "applied",
        scene: {
          side: "两只都怕范围攻击，但没有穿透守住的手段。|Both of your slots are vulnerable to spread, but neither can bypass Protect.",
          foes: "一只单体集火手与 一只支援手。|A single-target focused attacker and a support Pokémon.",
          field: "第 5 回合。|Turn 5.",
          known: "本回合对手已确认会使用单体攻击，没有范围招式。|The opponents are confirmed to use only single-target attacks this turn.",
        },
        prompt:
          "对手只会单体攻击时，广域防守必定保护队友吗？|Does Wide Guard guarantee protection against single-target moves?",
        options: ["是|Yes", "否|No"],
        answer: 1,
        why: [
          "广域防守针对范围招式；单体攻击仍然会命中你那一侧。|Wide Guard answers spread moves; a single-target attack still lands on your side.",
          "要处理单体集火，需要守住、改向或直接换下要保护的那只。|Against single-target focus you need Protect, redirection, or to switch the threatened slot.",
        ],
      }),
      dq({
        id: "support-check2",
        level: "applied",
        scene: {
          side: "一个能改变队友行动的工具（引导或改向）与 一个本回合能自己击倒的输出手。|A tool that changes your partner’s action (setup or redirection) and an attacker that can KO on its own this turn.",
          foes: "一只接地的引导手，本回合会用广域防守。|A grounded redirector that will use Wide Guard this turn.",
          field: "第 7 回合，对方刚开空间。|Turn 7; the opponents just set Trick Room.",
          known: "你有两个优先目标：不让空间延续，和减少对方输出。|You have two priority goals: stop the room from continuing and cut their damage.",
        },
        prompt: "这一回合最合适的辅助方向是？|What is the right direction for support this turn?",
        options: [
          "优先让空间停下来（守住或打掉空间手），因为所有其他计划都依赖速度关系|Prioritise stopping the room (Protect or removing the setter), because every other plan depends on Speed order",
          "固定先打一轮击掌奇袭，把先手当作默认开局|Open with Fake Out as a default opening every time",
          "本回合什么辅助都不做，把两个动作都留给输出|Skip support entirely and spend both actions on damage",
        ],
        answer: 0,
        why: [
          "空间决定了接下来所有行动的先后，所以处理它本身就是这回合的辅助目标。|Trick Room decides the order of everything after it, so addressing it is itself the support objective.",
          "击掌奇袭只有在目标接地、没有防畏缩特性、且你刚上场的那只窗口内才成立。|Candidate B ignores the three conditions Fake Out needs: a grounded target, no anti-flinch, and the entry window.",
          "放弃辅助把两个位置都换成输出，等于放弃改变对手选项的能力。|Candidate C gives up the ability to change what the opponent can do at all.",
        ],
      }),
      dq({
        id: "support-check3",
        level: "applied",
        scene: {
          side: "能提供帮助 Helping Hand 的支援手，以及一个本回合就能靠单体招式收尾的输出手。|A supporter who can provide Helping Hand, plus an attacker who can finish this turn with a single-target move.",
          foes: "一只高耐久手与 一只单体集火手。|A bulky foe and a single-target focused attacker.",
          field: "第 9 回合，你落后一点。|Turn 9; you are slightly behind.",
          known: "帮助不改变行动顺序；你本回合只有一个动作。|Helping Hand does not change turn order, and you have one action this turn.",
        },
        prompt:
          "什么时候帮助才是这一回合最好的分配？|When is Helping Hand the best use of this turn?",
        options: [
          "队友需要的那一点额外伤害正好跨过击倒线，而你自己没有能独立完成这件事的招式|Your partner is short by exactly the damage Helping Hand adds, and you have no way to finish it yourself",
          "任何时候都优先帮助，因为帮助永远不会变差|Always, because Helping Hand can never be the wrong choice",
          "只在自己完全无法行动时才帮助|Preserve it strictly for turns where you are fully unable to act",
          "用看我嘛代替帮助，把对手的单体攻击引开|Use Follow Me instead, pulling the opponents’ single-target attack away",
        ],
        answer: 0,
        why: [
          "帮助的价值在于把这一回合的资源集中在唯一需要它的地方，而且这里有明确的缺口。|Helping Hand concentrates the turn’s resources where there is a specific, measurable gap.",
          "帮助会占掉你本回合的动作；如果攻击本来就能完成，帮助就是空过。|Candidate B ignores the cost: the action is spent, so it is wasted when your own attack would have finished it.",
          "题目里你完全可以行动；帮助从来都是把动作让出去。|Candidate C describes a situation that is not on the board, and support always costs an action.",
          "改向只在对手确实会用单体集火时才更值钱，而这正是题目没给出的前提。|Candidate D swaps in redirection, whose value depends on an incoming single-target focus this question never states.",
        ],
      }),
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
      lesson(
        "disrupt-timing",
        "干扰的时机与代价|Timing and cost of disruption",
        [
          "挑衅与再来一次只有在对方“还有别的招式可选”时才产生价值。对方已经在用的那一招不受影响，所以你先要确认：它是否有第二个会改变局面的选择？如果没有，限制选择等于什么都没做，还白花一个动作。|Taunt and Encore only pay off when the target still has another option available. The move it already chose is unaffected, so first check whether a second, board-changing choice exists; if not, you have restricted nothing and spent an action.",
          "黑雾清全场，包括你自己的强化；清除之烟只重置一个目标，但会被钢属性免疫，也能被替身挡掉。所以真正的对比不是“哪个更强”，而是“我要不要一起付清自己这边的代价”。|Haze clears the whole field including your own boosts, while Clear Smog resets a single target but is blocked by Steel and can be shut down by Substitute. The real comparison is whether you are willing to pay the cost on your own side too.",
          "替身挡住大多数攻击，不是全部：声音招式和穿透特性可以绕过它。所以替身是对物理集火的有效缓冲，而不是可以替代守住的万能盾；用它之前先看对手会不会用声音或穿透手段。|Substitute buffers most attacks, not all: sound moves and Infiltrator-style bypasses get through. That makes it a real buffer against physical focus, not a replacement for Protect; check whether the opponent has sound or piercing options before relying on it.",
          "干扰要花掉一个动作，所以判断标准只有一个：它是否真的改变了对方接下来能做的事。如果对方的计划在你干扰之后照样执行，那它就不是干扰，只是时间。|Disruption costs an action, so there is a single test: does it change what the opponent can do next? If their plan still executes after it, that was not disruption, just time.",
        ],
        [
          dq({
            id: "disrupt-haze-tradeoff",
            level: "applied",
            scene: {
              side: "刚完成强化（攻击 +2）的输出手，以及一个想反击的控制手。|An attacker that just completed +2 setup, plus a control user that wants to answer back.",
              foes: "钢属性的强化输出手（+2）与 一只常规强化手。|A Steel-type attacker at +2 and a normally building attacker.",
              field: "第 6 回合，无场地。|Turn 6, no terrain.",
              known: "清除之烟会被钢属性免疫；黑雾会清空全场包括你自己的强化。|Clear Smog is blocked by Steel; Haze clears the entire field including your own boosts.",
            },
            prompt:
              "这一回合的重置选择，哪一条判断是正确的？|Which statement about resetting boosts this turn is correct?",
            options: [
              "钢属性目标只能靠黑雾这类不依赖毒命中的手段，而代价是你必须接受清掉自己的强化|The Steel target can only be reset by something that does not rely on a Poison hit, and the price is clearing your own boosts",
              "清除之烟可以对钢属性生效，因为它是特殊招式|Clear Smog works on Steel because it is a special move",
              "黑雾只清对方，不会影响己方|Haze only clears the opponents, never your own side",
              "两个选择都无效，能力等级变化无法被重置|Neither option works, because stat stages cannot be reset",
            ],
            answer: 0,
            why: [
              "免疫看的是属性，不是招式分类；黑雾没有属性，所以它能清到钢属性，同时代价是全场一起清。|Immunity follows typing, not move category; Haze is typeless, so it reaches Steel at the price of clearing everyone.",
              "特殊与物理只决定用哪组能力，不改变属性免疫。|Candidate B confuses the damage category with the type chart.",
              "黑雾的作用范围就是全场，两边一起清。|Candidate C gets the scope wrong: Haze is a field-wide reset.",
              "能力等级可以被黑雾与清除之烟重置，只是各有代价。|Candidate D ignores two moves whose entire purpose is resetting stages.",
            ],
          }),
          dq({
            id: "disrupt-taunt-window",
            level: "applied",
            scene: {
              side: "一个能使用挑衅 Taunt 的控制手。|A control user that can apply Taunt.",
              foes: "一只刚完成剑舞的物攻输出手（+2），本回合会继续用同一记输出招式。|A physical attacker that just finished Swords Dance (+2) and will attack again this turn.",
              field: "第 5 回合。|Turn 5.",
              known: "对手本回合没有待用的变化招式，它已经选好了攻击。|The opponent has no pending status move; it has already committed to an attack.",
            },
            prompt: "这一回合使用挑衅的收益是？|What do you gain from Taunting this turn?",
            options: [
              "没有收益：它已经在用攻击招式，限制选择改变不了这一回合|None: it has already chosen an attack, and restricting options does not change this turn",
              "它会因此无法攻击|It cannot attack as a result",
              "它会因此失去本回合的强化|It loses its boosts this turn",
              "它会在本回合内不能切换招式|It cannot switch moves this turn",
            ],
            answer: 0,
            why: [
              "挑衅影响的是“还没选”的招式；已经提交的攻击照常结算。|Taunt constrains moves not yet chosen; the attack already committed resolves normally.",
              "限制变化招式不会让攻击类招式失效。|Candidate B misreads what Taunt restricts.",
              "强化不会因为被挑衅而消失，那要靠重置手段。|Candidate C describes a reset effect, not Taunt.",
              "换招是对手的选择，不是你的限制；你无法替对手取消它。|Candidate D is not a Taunt effect at all.",
            ],
          }),
          dq({
            id: "disrupt-encore-window",
            level: "applied",
            scene: {
              side: "能使用再来一次 Encore 的干扰手，以及一个集火目标。|A disruptor who can use Encore, plus a focus target.",
              foes: "一只用过高威力单体招式的输出手，和 一只刚准备开场的支援手。|An attacker that just used a heavy single-target move, and a support that is about to set up.",
              field: "第 7 回合。|Turn 7.",
              known: "两只都在你面前；对手不会换人。|Both are in front of you and neither will switch.",
            },
            prompt: "对哪一只使用再来一次更有价值？|Which target is Encore worthier on?",
            options: [
              "刚准备开场的支援手：把它按在第一回合它本来要做的事上，阻止展开|The support that is about to set up: pin it to the single move it started with and deny the setup",
              "刚用过高威力招式的输出手：把它锁死在同一个招式上|The attacker that just used a heavy move: lock it into the same move",
              "两只都一样，看哪个更痛|Whichever of the two hits harder",
              "都不值得，再来一次只对你自己的队友有效|Neither is worth it, because Encore only works on your own allies",
            ],
            answer: 0,
            why: [
              "再来一次让对手重复它最近使用的那一招；一只刚开始行动的支援手等于只能重演开场动作。|Encore makes the target repeat its last move, so a supporter that just acted can only replay its opening step.",
              "锁住一只已经在输出招式的宝可梦，只是让它再打一次同样的一发。|Candidate B locks in damage that is already happening rather than denying a new threat.",
              "应该按“它接下来要做什么”判断，而不是按“它刚刚有多痛”判断。|Candidate C judges by past damage instead of by the option you want to remove.",
              "再来一次是对敌方宝可梦使用的招式。|Candidate D is simply wrong about which side Encore works on.",
            ],
          }),
          dq({
            id: "disrupt-cost",
            level: "applied",
            scene: {
              side: "一个干扰手（本回合只能做一件事）与 一个能独立打出伤害的输出手。|A disruptor who can act once this turn, and an attacker who can deal damage independently.",
              foes: "两只都会持续施压的宝可梦，本回合不会换人。|Two foes that will keep applying pressure and will not switch.",
              field: "第 4 回合，你领先一点。|Turn 4, slightly ahead.",
              known: "你对手上的干扰在双方都推进计划时更容易奏效。|Disruption is more valuable when both sides have a plan to advance.",
            },
            prompt:
              "这一回合要不要把动作花在干扰上？|Should this turn’s action go into disruption?",
            options: [
              "不要：你领先，且没有证据表明干扰能改变对方的计划|Skip it: you are ahead and nothing suggests disruption changes their plan",
              "要：干扰总能阻止对方的下一步|Spend it on disruption: it always denies the opponent’s next step",
              "要：多一个动作就等于多一个机会|Spend it on disruption: an extra action is an extra chance",
              "要：干扰从来不会比输出更差|Spend it on disruption: it is never worse than dealing damage",
            ],
            answer: 0,
            why: [
              "干扰的唯一检验是它是否改变对方接下来能做的事；没有这个证据时，它只是一个花掉的回合。|The only test for disruption is whether it changes what the opponent can do; without that evidence it is just a spent turn.",
              "干扰常常改变不了什么，尤其当对手已经在用攻击招式。|Candidate B skips the only question worth asking.",
              "多一个动作不等于多一次有效干预，那仍然要通过同一个检验。|Candidate C assumes usefulness instead of testing it.",
              "领先时，输出与保住优势比限制一个本来就不打算做的事更值钱。|Candidate D is false generally: while ahead, pressure and safety are worth more than denying a move they were not going to use.",
            ],
          }),
        ],
      ),
    ],
    [
      dq({
        id: "disrupt-check1",
        level: "applied",
        scene: {
          side: "一个能施加挑衅的控制手。|A control user that can apply Taunt.",
          foes: "一只刚强化的输出手，本回合会继续用一记伤害招式。|An attacker that just set up and will attack again this turn.",
          field: "第 5 回合。|Turn 5.",
          known: "对手本回合没有待用的变化招式。|The opponent has no pending status move.",
        },
        prompt: "对方受挑衅后还能使用普通伤害招式吗？|Can a Taunted Pokémon still use ordinary damaging moves?",
        options: ["能|Yes", "不能|No"],
        answer: 0,
        why: [
          "挑衅限制的是变化招式，攻击类招式完全不受影响。|Taunt restricts status moves; ordinary attacks are untouched.",
          "所以它的实际作用是切断对方的展开路线，而不是封锁输出。|Its real job is to cut off a setup route, never to shut down damage.",
        ],
      }),
      dq({
        id: "disrupt-check2",
        level: "applied",
        scene: {
          side: "一只刚张开替身的物理耐久手。|A bulky physical attacker that just created a Substitute.",
          foes: "一只声音招式使用者（本回合会攻击）与 一只物理集火手。|A sound-move user that will attack this turn and a physical focused attacker.",
          field: "第 6 回合。|Turn 6.",
          known: "对方两只都没有被确认拥有穿透手段。|Neither foe is confirmed to have a move that bypasses Substitute.",
        },
        prompt: "替身在这只宝可梦身上这一回合的判断是？|What is Substitute worth on this Pokémon this turn?",
        options: [
          "它能挡住物理集火那一记，但挡不住声音招式，所以它只解决了一半问题|It absorbs the physical focus but not the sound move, so it answers only half the threat",
          "它能挡住本回合两只对手的全部攻击|It blocks everything both opponents will use this turn",
          "它完全没用，声音与物理都能穿过|It is worthless, because both sound and physical attacks bypass it",
        ],
        answer: 0,
        why: [
          "替身挡大多数攻击，但声音招式绕过它，所以这一回合它只买到了对集火的保护。|Substitute blocks most attacks but sound moves get through, so it only buys protection from the focus.",
          "替身不是无法被穿透的全能盾，题目里就有一只声音使用者。|Candidate B treats Substitute as unbypassable while the board contains a sound user.",
          "它对物理集火有效，问题只是覆盖不全。|Candidate C overstates the bypass list to dismiss a tool that still works here.",
        ],
      }),
      dq({
        id: "disrupt-check3",
        level: "applied",
        scene: {
          side: "刚完成强化的输出手（攻击 +2）与 一个黑雾使用者。|An attacker that just reached +2 Attack, plus a Haze user.",
          foes: "两只也在本回合强化，且都比你更痛。|Two foes building this turn as well, both harder hitting than yours.",
          field: "第 4 回合。|Turn 4.",
          known: "两只对手本回合都会完成它们的强化。|Both opponents will complete their own boosts this turn.",
        },
        prompt:
          "这一回合清除全场能力等级的取舍是？|What is the trade-off of a field-wide reset this turn?",
        options: [
          "如果这回合不强化就撑不住局面，黑雾能把你拉到同一起跑线，但下一回合大家都要重新积累|If you cannot hold without boosting this turn, Haze resets you to the same start line, but everyone rebuilds from zero next turn",
          "黑雾只清对手，所以你应该无条件使用|Haze only clears the opponents, so you should always use it",
          "黑雾会让对手下一次强化更强|Haze makes the opponents’ next boost stronger",
          "在你领先时清除能力等级永远不会错|Clearing stat stages can never be wrong while you are ahead",
        ],
        answer: 0,
        why: [
          "黑雾是双刃：它把双方的进度一起归零，所以它的价值取决于这一回合谁的收益更大。|Haze zeroes both sides, so its value depends on who benefits more from the reset this turn.",
          "它清全场，不是单方面清理。|Candidate B misstates the scope of the move.",
          "清除之后双方都要重新积累，不存在让对手更强的机制。|Candidate C invents a downside that does not exist; both sides rebuild.",
          "如果你领先，把自己的优势清掉可能正是对手想要的。|Candidate D is exactly backwards: while ahead, a reset can hand over your advantage.",
        ],
      }),
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
      dq({
        id: "ability-check1",
        level: "applied",
        scene: {
          side: "可以覆盖成任意场地的支援手，以及一个单体输出手。|A supporter that can overwrite into any terrain, plus a single-target attacker.",
          foes: "接地的、已触发轻装的大狃拉（当前速度 240）与 一只特攻手。|A grounded Unburden Sneasler at 240 Speed, plus a special attacker.",
          field: "当前是精神场地，第 8 回合。|Psychic Terrain is active, turn 8.",
          known: "你的单体招式有效速度 200，大狃拉本回合不会换下。|Your single-target attacker has an effective Speed of 200, and Sneasler will not switch.",
        },
        prompt:
          "你覆盖成青草场地之后，这一回合的行动顺序会怎样变化？|After you overwrite into Grassy Terrain, how does turn order change?",
        note: TRAINING_NOTE,
        options: [
          "不变：轻装不因场地覆盖而失效，仍然是 240 对 200，对手先动|Unchanged: the overwrite does not remove Unburden, so it stays 240 against 200 and the opponent acts first",
          "你反超：覆盖场地会让它的加速短暂失效，200 先动|You overtake it, because the overwrite briefly cancels the boost and 200 goes first",
          "不变，但场地覆盖会让它下一次行动前必须重新结算速度|Unchanged in order, but the overwrite forces its Speed to be recalculated before it acts",
        ],
        answer: 0,
        why: [
          "轻装属于特性状态，场地替换只改写场地规则，两者互不覆盖。|Unburden is an ability state while the overwrite only edits the terrain rules; neither cancels the other.",
          "没有任何机制会因为换场地而让轻装短暂失效。|Candidate B invents a clause that does not exist.",
          "覆盖不会给它新增一次速度重算，也没有重算会影响顺序的规则。|Candidate C adds a recalculation step the rules do not contain.",
        ],
      }),
      dq({
        id: "ability-check2",
        level: "applied",
        scene: {
          side: "一只准备上场触发威吓的输出手。|An attacker about to enter and trigger Intimidate.",
          foes: "已知有特性线索的三只不同宝可梦，本回合都在场。|Three foes with known ability leads, all on the field.",
          field: "第 5 回合。|Turn 5.",
          known: "你能从招式或外形推测它们可能持有什么特性，但没有任何一条是已确认的。|You can guess at their abilities from moves or appearance, but none is confirmed.",
        },
        prompt:
          "在触发威吓之前，下面哪几类特性需要优先检查？（多选）|Before triggering Intimidate, which of these ability types deserve checking first? (Select all.)",
        options: [
          "不服输 Defiant|Defiant",
          "好胜 Competitive|Competitive",
          "降雨 Drizzle|Drizzle",
        ],
        answer: [0, 1],
        why: [
          "被降攻击会把它变成 +1 攻击，所以威唬对手反而喂了它强化。|A lowered Attack becomes +1, so Intimidating it hands it a boost instead.",
          "好胜同样把被降能力换成特攻强化，与你的特攻路线直接相关。|Competitive converts the same drop into Special Attack, which is exactly the stat you care about.",
          "降雨与威吓的结果没有关系，它只决定天气。|Drizzle has nothing to do with how Intimidate resolves; it only sets weather.",
        ],
      }),
      dq({
        id: "ability-check3",
        level: "applied",
        scene: {
          side: "一个想用抛下狠话转场、并让后排安全落场的支援手。|A supporter who plans to Parting Shot out so the partner can come in safely.",
          foes: "黄金之躯的赛富豪（已确认）与 一只单体集火手。|Confirmed Good as Gold Gholdengo and a single-target focused attacker.",
          field: "第 7 回合。|Turn 7.",
          known: "对方本回合会用单体攻击打你的后排。|The opponents will hit your partner with a single-target attack this turn.",
        },
        prompt:
          "关于这回合的转场计划，哪一条判断是正确的？|Which statement about this pivot plan is correct?",
        options: [
          "抛下狠话会被整招挡下，所以这一回合你不会转场；必须改用能真正执行的控制或输出|Parting Shot is blocked in full, so you do not pivot this turn; you need a control or attack that actually executes",
          "抛下狠话会成功，只是不会降低对方的能力等级|Parting Shot works; only the stat drop fails",
          "黄金之躯只阻挡降低能力等级那部分|Parting Shot’s stat drop alone is blocked",
          "改瞄一只更快的宝可梦就能完成转场|Aim the same move at a faster Pokémon and the pivot succeeds",
        ],
        answer: 0,
        why: [
          "黄金之躯阻挡其他宝可梦针对使用者的变化招式，转场是这一招的一部分，所以整招失效。|Good as Gold blocks other Pokémon’s status moves targeting its user, and the switch is part of that move, so the whole thing fails.",
          "阻挡是整招级别的，不是部分生效，所以不存在“转场成功但不降能力”。|Candidate B describes a partial block that does not exist.",
          "它拦的是整招变化招式，与其中的哪一部分无关。|Candidate C mislocates what Good as Gold reads.",
          "一个动作只有一个目标，中途无法改瞄；而且对方本回合也未必会换人。|Candidate D needs a second action to retarget, and the opponents need not switch.",
        ],
      }),
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
      lesson(
        "decision-ranges",
        "区分可能击倒与必定击倒|Separate a possible KO from a guaranteed one",
        [
          "“稳”是概率，不是属性。两次独立的 90% 命中都中的概率是 81%，而不是 90%；连续使用守住的成功率还会下降。所以计划里每多一个依赖概率的环节，结论就要往下调一档。|Reliability is a probability, not an attribute. Two independent 90% hits both land only 81% of the time, and consecutive Protect becomes less reliable, so every probabilistic link in a plan should lower your confidence one notch.",
          "把伤害当成区间，而不是一个数字。给一个区间（例如对 80 HP 的目标是 72-86），下限低于血量就只是“可能击倒”，上限之上才是“必定击倒”。这个判断直接决定你是该追求一击，还是该安排两步。|Read damage as a range, not a number. Given a range such as 72-86 against an 80 HP target, a floor below the HP value is only a possible KO while a ceiling above it is a guaranteed one, and that single judgement decides whether you chase one attack or plan two.",
          "覆盖对手的选择，而不是猜对手的选择。领先时用那条“对手每种常见应对我都还有下一步”的路线；落后时才用承担风险的路线，因为那时你需要的是一个能改变局面的结果，而不是一个更漂亮的概率。|Cover their replies rather than guess them. When ahead, take the line where every common reply still leaves you a follow-up; when behind, take the risky line, because there you need an outcome that changes the board rather than a prettier number.",
          "领先时不要为没有收益的额外伤害付风险，落后时才可以把命中率换成伤害。同一发招式在两种局面里的价值是不同的，所以“这一招好不好”永远要带上局面。|Ahead, never pay risk for damage that buys nothing; behind, trading accuracy for damage is rational. The same move is worth different things in different positions, so “is this move good” is never a standalone question.",
        ],
        [
          dq({
            id: "decision-range-ko",
            level: "applied",
            scene: {
              side: "一个单体输出手（伤害区间 72-86）与 一个本回合能接上的后手。|A single-target attacker dealing 72-86 and a follow-up you can still reach next turn.",
              foes: "一只当前 80 HP 的输出手，本回合会反击。|An attacker at 80 HP that will counter this turn.",
              field: "第 6 回合，无场地。|Turn 6, no terrain.",
              known: "你的招式 100% 命中且必定先动；对手本回合没有守住可用。|Your move is 100% accurate and moves first; the foe cannot Protect this turn.",
            },
            prompt: "这一发该怎么定位？|How should you describe this attack?",
            note: TRAINING_NOTE,
            options: [
              "只能算“可能击倒”：下限 72 低于 80，所以要准备第二手或换成下限更高的路线|A possible KO only: the 72 floor sits under 80, so plan a second step or pick a line with a higher floor",
              "可以当成击倒：平均值 79 已经足够接近 80|Treat it as a KO, because the 79 average is close enough to 80",
              "可以当成击倒：伤害会随机浮动，所以总有一次能打满|Treat it as a KO, because the roll is random and will land high eventually",
              "应该换成威力更高但命中率更低的招式来求稳|Switch to a higher-power, lower-accuracy move to be safe",
            ],
            answer: 0,
            why: [
              "只有当区间下限跨过血量线才算保证；72 < 80 意味着最坏的那次会留下 8 HP。|Only a floor above the HP line is a guarantee, and 72 < 80 leaves 8 HP on the worst roll.",
              "平均值不是可能出现的值，战斗里你拿到的是某一次具体结果。|Candidate B plans on a number that never actually occurs; you get one concrete roll.",
              "随机意味着不确定，而不是意味着总有一天会成功。|Candidate C inverts what randomness means.",
              "降低命中率会把一个高下限的路线换成一个下限更低、还不确定的路线。|Candidate D trades a solid floor for less certainty, which is the opposite of safer.",
            ],
          }),
          dq({
            id: "decision-two-accurate",
            level: "applied",
            scene: {
              side: "落后，需要这一回合产生足够的伤害差距才能翻盘。|You are behind and need this turn to close a damage gap big enough to swing it.",
              foes: "一只高耐久手，以及一只会反击的输出手。|A bulky foe and an attacker that will counter.",
              field: "第 8 回合。|Turn 8.",
              known: "对手本回合没有守住可用；它的下一步只有两种：先防一轮，或者直接反击。|The foe cannot Protect this turn, and it has exactly two replies: absorb one hit, or counter.",
            },
            prompt: "三条路线里，哪一条在两种应对下都成立？|Which of the three lines holds under both replies?",
            options: [
              "两次 100% 命中的招式打满伤害：对手防与不防你都有确定收益|Two 100%-accurate attacks for the full damage: you gain deterministically whether it defends or counters",
              "一发 70% 命中的高伤招式：命中就结束|Take the single 70% hit and end it if it lands",
              "一发 100% 命中但威力较低的超量伤害|A single 100% but weak overkill hit",
              "范围招式一次压两只，把两回合压缩成一回合|A spread move that compresses two turns into one",
            ],
            answer: 0,
            why: [
              "两次准确的招式把风险摊开成两个高下限动作，因此在对手的两种应对下都有收益。|Two accurate attacks split the risk into two high-floor actions, so both of their replies leave you better off.",
              "单发 70% 只有三成把握；不中时你不仅没翻盘，还交出了这一回合。|Candidate B is a 30% shot, and a miss costs you the turn as well as the comeback.",
              "在“需要拉开差距”的局面里，多余伤害没有结算价值。|Candidate C overkills in a position defined by a gap you have not yet closed.",
              "范围招式付 0.75 倍修正，而且对手下一步选防还是选反击仍然开放。|Candidate D pays the 0.75× modifier while leaving their reply open.",
            ],
          }),
          dq({
            id: "decision-leading-risk",
            level: "applied",
            scene: {
              side: "领先；一个 100% 单体招式能击倒反击手，另一个 70% 范围招式能覆盖两只。|You are ahead; a 100% single-target move KOs the counter-attacker, and a 70% spread move can reach both foes.",
              foes: "一只可能开广域防守的范围手，与 一只会反击的输出手。|A spread user who may choose Wide Guard, and an attacker that will counter.",
              field: "第 7 回合。|Turn 7.",
              known: "对手本回合没有守住可用；两只都不会换人。|Neither foe can Protect this turn, and neither will switch.",
            },
            prompt: "领先局面下这一回合用哪一条？|Which line do you take this turn while ahead?",
            options: [
              "用 100% 单体击倒反击手，把范围选择留到下一回合|Use the accurate single-target KO on the counter-attacker and keep the spread option for next turn",
              "用 70% 范围招式赌两只都吃到|Use the 70% spread move and gamble that it hits both",
              "用两次 100% 单体都打同一只，把伤害打满|Spend both 100% single-target attacks on the same target for full damage",
              "本回合守住，等对手先表态|Protect this turn and let the opponent commit",
            ],
            answer: 0,
            why: [
              "领先时最值钱的是减少一个会反击的威胁，同时把不确定的选项留到你有必要的时候再用。|While ahead, removing a threat that counters you is the value, and the uncertain option stays available for when you need it.",
              "领先时没有必要为一个不保证的结果付 30% 的风险。|Candidate B pays a 30% risk for a result you do not need yet.",
              "多打一下不改变胜负，只会让你在没有收益的回合里继续暴露反击手。|Candidate C changes nothing and leaves the counter-attacker alive one extra turn.",
              "守住会交出行动顺序，而你并不需要等信息。|Candidate D donates turn order for information you can act without.",
            ],
          }),
          dq({
            id: "decision-coverage",
            level: "applied",
            scene: {
              side: "领先，下回合有一记稳定终结；本回合你有两个可选路线。|You are ahead with a stable finish next turn, and two candidate lines this turn.",
              foes: "两只对手，各自对你最常用的那招有不同的应对（防一轮 / 直接反击）。|Two foes with different answers to your usual attack: absorb one hit, or counter.",
              field: "第 6 回合。|Turn 6.",
              known: "两个选项都能造成伤害，差别只在它们面对不同应对时的后续。|Both options deal damage; they differ in what happens after their different replies.",
            },
            prompt: "选择路线时，哪一条原则是对的？|Which principle should choose the line?",
            options: [
              "选那条在对手两种应对下都还留有下一步的路线，即使它本身伤害略低|Pick the line that still leaves you a follow-up under either reply, even at slightly lower damage",
              "选伤害最高的那条，赌对手会选最保守的应对|Pick the highest-damage line and assume the most passive reply",
              "这一回合先不打，先确认对手选了哪种应对|Spend the turn confirming which reply they take",
              "先猜对手会怎么打，然后选针对它的路线|Guess their plan and pick the line aimed at it",
            ],
            answer: 0,
            why: [
              "覆盖两种应对意味着你的结论不依赖一个你控制不了的选择。|Covering both replies means your conclusion does not rest on a choice you do not control.",
              "把结论压在对手最保守的选择上，等于主动放弃优势换一点伤害。|Candidate B trades your advantage for a little damage by assuming the friendliest reply.",
              "确认对手的选择要用掉一整个回合，而你并不需要这个信息就能赢。|Candidate C spends a turn on information you do not need in order to win.",
              "猜测对手的意图得到的是意图，不是应对；应对才是真正结算的那一层。|Candidate D reads intent, not the answer, and intent is not what resolves.",
            ],
          }),
        ],
      ),
    ],
    [
      dq({
        id: "decision-check1",
        level: "applied",
        scene: {
          side: "一个能稳定获胜的收尾手，以及一个会拖慢你的速度控制。|A cleaner that can reliably win and a speed tool that only slows you down.",
          foes: "一只残血输出手（很快）与 一只满血的空间手。|A fast low-HP attacker and a full-HP Trick Room setter.",
          field: "第 7 回合，空间刚开。|Turn 7; Trick Room was just set.",
          known: "空间手本回合之后仍能续上；残血那只不会换人。|The room setter can keep it going, and the low-HP attacker will not switch.",
        },
        prompt:
          "残血目标和满血空间手之间，必须先打残血目标吗？|Must you target the low-HP attacker before the full-HP Trick Room setter?",
        options: [
          "必须|Always target the low-HP attacker first",
          "看哪只更影响胜利路线|It depends on which one your win condition needs removed",
        ],
        answer: 1,
        why: [
          "目标是按“如果失去它我还赢不赢”来排的，不按血量排。|Targets are ranked by whether you can still win without them, not by their HP.",
          "若空间会让你失去控制，阻止空间可能更重要；反过来若空间已被稳定处理，残血目标就是更快的胜利。|If the room would take away your control, denying it may matter more; if the room is already neutralised, the low-HP attacker is the faster win.",
        ],
      }),
      dq({
        id: "decision-check2",
        level: "applied",
        scene: {
          side: "一个两种道具假设下都能执行的集火计划。|A focus plan that executes under either item hypothesis.",
          foes: "一只携带情况未知的输出手，本回合会行动。|An attacker whose held item is unknown and who will act this turn.",
          field: "第 4 回合。|Turn 4.",
          known: "你能看到对方留出的道具空位，但无法确认具体道具。|You can see the empty item slot but cannot confirm which item it is.",
        },
        prompt: "面对未知道具时，最合理的推理方式？|How should you reason about an unknown item?",
        options: [
          "把最常见道具当作确定事实|Treat the most common item as a certainty",
          "保留多个可能，并选择对两种可能都成立的行动|Keep several possibilities and pick the action that holds under each of them",
        ],
        answer: 1,
        why: [
          "使用率是先验信息，不是这场对战的确认；覆盖两种可能才是能执行的下一步。|Usage is a prior, not confirmation for this battle, and covering the possibilities is what you can actually execute.",
          "把先验当成事实，等于把整回合压在一个没有证据的猜测上。|Candidate A turns a prior into evidence and bets the whole turn on it.",
        ],
      }),
      dq({
        id: "decision-check3",
        level: "applied",
        scene: {
          side: "一个收尾手与一个两回合的伤害计划（下限 72、上限 86，目标当前 80 HP）。|A cleaner plus a two-turn damage plan (floor 72, ceiling 86) against a target at 80 HP.",
          foes: "一只 80 HP 的目标，本回合会用守住拖延（还剩一次连续使用）。|An 80 HP target that will use Protect to stall, with one consecutive use left.",
          field: "第 9 回合，你落后一点。|Turn 9; you are slightly behind.",
          known: "两次攻击互相独立；对手本回合已用过一次守住。|The two attacks are independent, and the foe already used Protect once this turn.",
        },
        prompt: "这个两步计划的正确表述是？|What is the correct statement about this two-step plan?",
        options: [
          "每一发都可能未完成击倒，所以第二步必须仍然可用；连续的守住成功率还会下降|Each hit may fall short, so step two has to remain available, and consecutive Protect also becomes less reliable",
          "只要两次都命中，合计伤害足够，所以这是必定击倒|Because both hits land, the total is enough, so this is a guaranteed KO",
          "第一步可以用高威力低命中招式来提高收益|Spend the first hit on a higher-power, lower-accuracy move to raise the payoff",
          "对手用了守住，这一步直接失效，改为全力输出|The foe protected, so the step is invalid and you switch to full-power output",
        ],
        answer: 0,
        why: [
          "两条风险都独立存在：你的伤害下限可能不够，对手的守住连续使用也会更不可靠。|Both risks stand independently: your damage floor may be short, and consecutive Protect gets less reliable.",
          "“都命中”不等于“跨过击倒线”，而题目明确给了下限低于血量。|Candidate B ignores that landing is not the same as crossing the KO line.",
          "把两步计划的第二步换成低命中招式，会同时放大两步的风险。|Candidate C compounds the uncertainty exactly where the plan was already fragile.",
          "守住有概率失效，所以这条路线不是零价值的，只是概率更低。|Candidate D treats a probabilistic block as a hard reset, which throws away a still-usable line.",
        ],
      }),
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
      lesson(
        "team-reactivity",
        "临场改变与读对手|Adapt mid-game and read the opponent",
        [
          "双打里对手的每一步都在缩小你的选项，所以最稳的结构是“有人能一直保住场地／天气”。你不需要判断他们要做什么，只要保证无论他们做什么，都仍然有一个模式可以执行。|In doubles, every move they make narrows your options, so the sturdiest structure is the one with a Pokémon whose only job is keeping terrain or weather. You never need to predict them; you only need every one of their plans to still leave you a mode you can run.",
          "读对手的依据是已结算的事实：谁在保场地、谁在保护谁、哪只从来没动过能力、哪只宁可承受也不换。把这些当成线索去准备两条路线，比试图猜“他们的整套计划”更可靠。|Read from settled facts: who is holding terrain, who is shielding whom, who has never touched a stat, and who would rather take damage than switch. Those facts support two prepared lines far better than guessing their whole plan.",
          "你自己的优先级才是不可谈判的部分。提前决定“我要先手拿什么、绝对不换谁”，临场才不会因为对方一次施压就改变整套计划；改变的是模式，不是底线。|Your own priorities are the non-negotiable part. Decide in advance what you take first and who never gets switched, so pressure does not dismantle the plan; the mode changes, the floor does not.",
          "队伍要同时留着“现在能赢的模式”和“被压制后还能翻回来的模式”。只有前者会让你在对手抓到你的模式时无路可走，后者才是队伍真正的保险。|A team needs both the mode that wins now and the mode that survives being answered. Only the first one leaves you stranded when they find it, and the second one is what a roster is actually insurance for.",
        ],
        [
          dq({
            id: "team-anchor",
            level: "applied",
            scene: {
              side: "顺风队：一只求雨手 + 一只龙卷风 + 两只负责压制的输出手。|A Tailwind team: a Drizzle setter, a physical attacker, and two wall-breaking attackers.",
              foes: "雨队：一只雨天干燥手 + 一只雨天输出手 + 一只雨天干扰手。|A Rain team: a Dry Weather setter, a Rain attacker and a Rain-based disruptor.",
              field: "第 6 回合，双方天气都由各自主力维持。|Turn 6; each side’s weather is held by its own key Pokémon.",
              known: "你方没有任何一次交换主力的机会。|You have no opening to trade your anchors.",
            },
            prompt:
              "两边的天气互相抵消时，哪一步最关键？|When both weather setters cancel each other out, which step matters most?",
            options: [
              "用龙卷风换掉对方雨天干扰手，保留自己的雨干燥手|Aim the wind move at their Rain-based disruptor and keep your own Dry Weather setter",
              "两方都比拼天气，让谁先开谁就输|Keep trading weather and whoever sets last loses",
              "直接用一只输出手开广域防守|Wide Guard from one of your attackers",
              "本回合先换掉自己的干扰手，稳住节奏|Switch out your own disruptor to stabilise",
            ],
            answer: 0,
            why: [
              "目标是按“如果失去它我还赢不赢”排的：断掉雨天干扰手，等于先拆掉对方雨队唯一不可替代的一环。|Targets rank by whether you still win without them, and removing the Rain disruptor deletes the only irreplaceable piece of their Rain core.",
              "既然你已经领先，就不该在一条不需要赌的路线上再开一次天气赌注。|Candidate B opens a weather race you do not need when you are already ahead.",
              "开广域防守只是防住一回合，没有改变天气归属，也不会拆掉对方主力。|Candidate C blocks one turn and changes neither weather ownership nor their key Pokémon.",
              "换掉自己的干扰手是在削弱自己的承压能力，而对方主力仍然完好。|Candidate D weakens your own ability to absorb pressure while their core stays intact.",
            ],
          }),
          dq({
            id: "team-mode-branch",
            level: "applied",
            scene: {
              side: "一只雨天干扰手（已确认对方主力）与 两只雨天输出手。|A Rain disruptor whose opponent anchor is confirmed, plus two Rain attackers.",
              foes: "一只可开顺风的输出手，与 一只可开空间的支援手。|An attacker who can set Tailwind, and a supporter who can set Trick Room.",
              field: "第 5 回合，无天气无场地。|Turn 5; no weather and no terrain.",
              known: "两只对手的气候改变里只有一只被确认；另一只只是可能。|Only one of their two weather claims is confirmed; the other is merely possible.",
            },
            prompt:
              "第 5 回合应先确认哪件事？|What should you pin down on turn 5?",
            options: [
              "哪一只真的会开气候改变：只处理已确认的那一只，另一只留给后手处理|Which speed change is actually coming: commit only against the confirmed one and keep a plan for the other",
              "两只都按已确认处理，同时准备两次应对|Treat both as confirmed and prepare two answers now",
              "先放弃速度控制，把动作用在纯伤害上|Abandon speed control entirely and spend the turn on raw damage",
              "先猜哪一只更重要，再按猜测投入资源|Guess which one matters more and invest accordingly",
            ],
            answer: 0,
            why: [
              "已确认的对手对应一个明确的对策，未确认的留作分支，这才是分支成本最低的读法。|A confirmed threat earns a committed answer and an unconfirmed one earns a branch, which is the cheapest way to read it.",
              "把可能当成事实会同时把资源投入两个方向，而在只有一次动作时这等于两个方向都不够。|Candidate B splits one action across two problems that may share a single answer.",
              "速度控制是可复用的资源，放弃它等于放弃整场的手段。|Candidate C discards a reusable resource to gain one turn of damage.",
              "猜测不是读法：猜测失败时你连自己投了多少资源都不知道。|Candidate D is not a read at all; when a guess fails you cannot even tell what you spent.",
            ],
          }),
          dq({
            id: "team-switch-safety",
            level: "applied",
            scene: {
              side: "两只本就扛不住的单体目标（各剩 40% 耐久）与 一只核心。|Two single-target entries at 40% durability each, plus your core.",
              foes: "对手一个单体清除目标（必定击倒）与 一个正在读你的对手。|A single-target removal user that will KO, and an opponent who is reading your plan.",
              field: "第 5 回合。|Turn 5.",
              known: "如果两只一起被换入，它们会分散对手的保护注意力。|If both come in together, they split your opponent’s protective attention.",
            },
            prompt:
              "这只核心什么时候是错的？|When is this core Pokémon the wrong call?",
            options: [
              "两只都能吃下对手任意一个单体清除目标时|When both of them can each take your opponent’s removal move",
              "对手开始怀疑你的双核，并已针对你的第二核心准备对策时|When your opponent has identified your two-core setup and already has an answer for your second core",
              "两只耐久偏低，但双核在场时对手只能先打一只|At 40% durability each, when the opponent can only hit one at a time",
              "对手全场高速且具备广域手段|At full enemy speed with a spread move available",
            ],
            answer: 0,
            why: [
              "一旦对手能一发带走其中一只，它就会立刻集中攻击那只，你的双核就只剩一个选择。|If one of them can be removed in one hit, your opponent can focus it immediately and your two-core setup collapses into a single choice.",
              "被读出并已准备对策时，双核的依赖已经变成负担，应先重建覆盖面。|Candidate B is the mirror case: once identified and answered, dependence is a liability and you rebuild coverage.",
              "分散对手注意力正是双核的目的，而对手一次只能处理一个。|Candidate C describes the plan working as intended.",
              "有广域手段时你更不该让核心落到能被一击移除的位置。|Candidate D argues for the opposite of what the spread option demands.",
            ],
          }),
          dq({
            id: "team-preview-read",
            level: "applied",
            scene: {
              side: "四只参战宝可梦，两种模式：快攻，或天气保护。|Four selected Pokémon covering two modes: fast pressure, or weather control.",
              foes: "四只参战宝可梦，其中一只明确的雨天主力与一只明确的晴女主力。|Four selected opponents including a confirmed Rain anchor and a confirmed Dry Weather anchor.",
              field: "对局预览。|Match preview.",
              known: "两只对手主力都能在第一回合改变天气。|Both enemy anchors can change weather on turn one.",
            },
            prompt:
              "预览阶段，对手两只都能改天气的阵容，最该确立的是什么？|At preview, against two foes who can both set weather, what should you settle first?",
            options: [
              "我方谁来处理天气的先后顺序，以及失去它时我要切换到哪套输出模式|Who on my side handles weather and in what order, and which offensive mode I switch to if that fails",
              "对方哪一只的排名更高|Which of the two enemy anchors ranks higher",
              "我方应该选四只里最快的三只|I should take the three fastest of my four",
              "我应该直接顺风加空间一起开|I should open with Tailwind and Trick Room together",
            ],
            answer: 0,
            why: [
              "真正需要确立的是我方处理天气的顺序，以及主力被拆掉之后的备用输出模式。|The order my side handles weather, and the fallback offense when the anchor dies, is what actually needs settling.",
              "排名高低不改变结果，而处理顺序和备用模式会直接改变结果。|Candidate B changes no outcome; ordering and fallback both do.",
              "速度只有在顺风已经成立时才有用，而第一回合天气归属还没定。|Candidate C is downstream of a weather contest that has not been decided.",
              "同时开顺风和空间会互相抵消，两者都是先手生效的气候改变。|Candidate D cancels your own two speed claims, since both resolve as priority moves.",
            ],
          }),
        ],
      ),
    ],
    [
      dq({
        id: "team-check1",
        level: "applied",
        scene: {
          side: "一支同时带顺风手与空间手的队伍。|A roster carrying both a Tailwind and a Trick Room user.",
          foes: "当前对手更慢，且依赖空间。|The current opponent is slower and relies on Trick Room.",
          field: "第 6 回合。|Turn 6.",
          known: "你不能每场都按同一模式开局。|You cannot open the same way every game.",
        },
        prompt:
          "有空间手，就必须每场开空间吗？|Must a team with Trick Room use it every game?",
        options: [
          "必须|Yes",
          "不必，可根据对局选模式|No, choose the mode for the matchup",
        ],
        answer: 1,
        why: [
          "同时开顺风和空间会互相抵消，所以模式必须按对手的速度关系来选。|Tailwind and Trick Room cancel each other out, so the mode has to follow the opponent’s speed relationship.",
          "一支带两种控制手段的队伍，价值就在于按对局切换，而不是每场重复同一招。|A roster holding two speed tools exists to switch between them, not to repeat the same one every game.",
        ],
      }),
      dq({
        id: "team-check2",
        level: "applied",
        scene: {
          side: "一个缺少安全换入选项的四人阵容。|A four-Pokémon selection with no safe switch-in available.",
          foes: "两只会持续压制的攻击手，覆盖面与你重复。|Two attackers that keep applying pressure through your shared defensive slots.",
          field: "第 3 回合，你已失去换入空间。|Turn 3; you have already lost the room to switch in.",
          known: "你第四只是第五个相同弱点的输出手。|Your fourth option is another attacker sharing the same weakness.",
        },
        prompt: "队列缺安全换入时，优先补什么？|When a selection lacks safe switch-ins, what do you prioritise?",
        options: [
          "抗性与防守支援|Resistances and defensive support",
          "第五个相同弱点的输出手|Another attacker sharing the same weakness",
        ],
        answer: 0,
        why: [
          "缺安全换入时，每多一只相同弱点的输出手只会让同一个破绽重复出现。|Without safe switch-ins, another shared-weakness attacker just repeats the same hole.",
          "抗性与防守支援提供的是安全轮转本身，而轮转才是重复创造输出机会的前提。|Resistances and defensive support provide the rotation itself, and rotation is what repeated attacking opportunities require.",
        ],
      }),
      dq({
        id: "team-check3",
        level: "applied",
        scene: {
          side: "两套互相冲突的顺风与空间输出队列，都无法调整速度配置。|Two conflicting Tailwind and Trick Room offensive sets with no speed control available.",
          foes: "一对快慢同速的对手队伍，依赖先手压制。|A fast-slow even-Speed opponent pair that relies on priority pressure.",
          field: "对局预览，第 1 回合。|Match preview, turn one.",
          known: "对手可能开优先级抢先手，而你的两套模式都无法应对。|The opponent may open with priority moves, and neither of your modes answers that.",
        },
        prompt:
          "两套互相冲突的速度模式同时带来什么风险？|What risk do two conflicting speed modes create together?",
        options: [
          "你必须选一套并放弃另一套，否则它们的收益互相抵消|You must commit to one and give up the other, otherwise their benefits cancel",
          "两者都能生效，你会得到两种优势|You can keep both because both resolve and stack",
          "你可以在同一回合开顺风与空间来抵消影响|You can open with both and cancel the effect entirely",
          "冲突只在对手也开同样的气候改变时出现|The conflict only appears if your opponent plays the same speed claims",
        ],
        answer: 0,
        why: [
          "顺风与空间互相抵消，所以两套模式只能选一套执行，另一套只能作为对手不打时的备选。|Tailwind and Trick Room cancel each other, so only one set runs and the other is a contingency against opponents who do not play it.",
          "相反的气候改变不能叠加，收益不会相加。|Candidate B assumes two opposing claims stack.",
          "同时开只是互相抵消，并不产生额外收益。|Candidate C describes cancellation and mistakes it for synergy.",
          "冲突在你这边就已存在，不需要等对手也开。|Candidate D blames the opponent for a conflict that exists on your own side.",
        ],
      }),
    ],
  ),
];
export const PLACEMENT_SECTION_IDS = [
  "types",
  "damage",
  "speed",
  "status",
];
export const PLACEMENT_QUESTION_IDS = [
  "type-ice",
  "type-check1",
  "damage-stab",
  "damage-check1",
  "speed-priority",
  "speed-check1",
  "status-para",
  "status-check2",
];
export const placementFoundations = PLACEMENT_SECTION_IDS.map((id) => {
  const found = sections.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown placement section: ${id}`);
  return found;
});
const questionById = new Map();
for (const item of sections) {
  for (const itemLesson of item.lessons) {
    for (const question of itemLesson.questions) {
      questionById.set(question.id, { ...question, sectionId: item.id });
    }
  }
  for (const question of item.mastery) {
    questionById.set(question.id, { ...question, sectionId: item.id });
  }
}
export const placement = PLACEMENT_QUESTION_IDS.map((id) => {
  const found = questionById.get(id);
  if (!found) throw new Error(`Unknown placement question: ${id}`);
  return found;
});
export const finalQuiz = [
  dq({
    id: "final-priority",
    level: "applied",
    scene: {
      side: "一只必杀输出手（普通攻击 100% 命中，必定先于对方普通攻击）与 一只可换入的支援手。|A cleaner whose normal attack is 100% accurate and moves before the foe’s normal attacks, plus a supporter you can switch in.",
      foes: "仆刀将军（会潜袭奇袭）与 一只高耐久挡路手。|Kingambit that knows Sucker Punch, plus a bulky blocker.",
      field: "第 9 回合，残局，你略微领先。|Turn 9 endgame; you are slightly ahead.",
      known: "对方本回合仍有潜袭奇袭，且先制招式在你出手前结算。|The foe still has Sucker Punch, and priority resolves before your move.",
    },
    prompt: "这一回合能只凭速度认定击杀线安全吗？|Can you call the KO line safe on Speed alone this turn?",
    note: TRAINING_NOTE,
    options: [
      "不能：先制招式在你之前结算，你需要覆盖潜袭奇袭这条路（守住、变化招式或换人）|No: priority resolves before you, so you need a line that covers Sucker Punch with Protect, a status move or a switch",
      "能：速度只在同优先度内比较，先制无法影响这一回合|Yes: Speed only compares within a priority bracket, so priority cannot matter",
      "能：潜袭奇袭只会打中最快的那只，而仆刀将军并不是最快|Sucker Punch only hits the fastest, and Kingambit is not the fastest",
      "不能：所以这一回合必须先使用两次攻击打出过量伤害|No, so this turn must spend two attacks on overkill damage",
    ],
    answer: 0,
    why: [
      "先制比较的是优先度而不是速度，所以更高的速度无法让你抢在先制前面。|Priority compares priority, not Speed, so being faster never gets you ahead of a priority move.",
      "速度只在同优先度内决定顺序，这恰恰说明它无法覆盖先制招式。|Candidate B quotes the right rule and draws the opposite conclusion from it.",
      "潜袭奇袭的目标由对手选择，所以“快不快”不是保护条件。|Candidate C assumes the opponent cannot target you with it, which is exactly the assumption that fails.",
      "过量伤害在领先局面没有结算价值，正确动作是覆盖先制而不是加大伤害。|Candidate D is wrong about both the fix and why overkill is worthless here.",
    ],
  }),
  dq({
    id: "final-terrain",
    level: "applied",
    scene: {
      side: "一只可先制的干扰手（击掌奇袭 Fake Out），以及一个能直接压过场的单体输出手。|A priority disruptor with Fake Out, plus a single-target attacker that can outpace the field.",
      foes: "爱管侍与接地的大狃拉（已开精神场地，本回合会输出）。|Indeedee with a grounded Sneasler on Psychic Terrain, which will attack this turn.",
      field: "第 6 回合，精神场地，无天气。|Turn 6, Psychic Terrain, no weather.",
      known: "击掌奇袭对处于精神场地中的接地宝可梦无效。|Fake Out fails against a grounded Pokémon standing on Psychic Terrain.",
    },
    prompt: "你要阻止大狃拉本回合输出，哪一条路线成立？|Which line stops Sneasler attacking this turn?",
    options: [
      "靠能真正结算的控制或压过场的单体输出；击掌奇袭在这一局是空动作|Land control that actually resolves, or a single-target hit that outpaces the field; Fake Out is a wasted action here",
      "靠击掌奇袭，它总能打断第一回合的动作|Use Fake Out, since it always interrupts the first turn’s action",
      "靠先声 damaging move 抢先手打完整伤害|Use a priority damaging move to take the full turn first",
      "靠换人把它换下去，你的输出手能拖住对手的干扰|Switch it out; your attacker can stall their disruptor",
    ],
    answer: 0,
    why: [
      "精神场地直接废掉击掌奇袭，所以在它身上花一个动作等于什么都不做；有效选项是那些能结算的控制或直接压过场的攻击。|Psychic Terrain shuts Fake Out off, so spending an action on it does nothing; the usable options are control that resolves or damage that outpaces the field.",
      "这正是本题的反直觉点：先制不是万能的，它会被场地条件拦下。|Candidate B is the trap this question exists to catch.",
      "先手只是优先度更高，仍然会被精神场地按属性阻挡。|Candidate C confuses priority with terrain immunity.",
      "换人是可行的退路，但它要求对手换人或失去牵制能力，而这里对手完全没有这个需要。|Candidate D only works if the opponent switches or loses its pressure, which nothing here implies.",
    ],
  }),
  dq({
    id: "final-rain",
    level: "applied",
    scene: {
      side: "雨天队伍：一只能一发清场的雷系输出手（雨天免去电光束蓄力回合）与 一只雨天物理输出手。|A Rain team: a Lightning attacker that skips Electro Shot’s charge turn in rain, plus a Rain physical attacker.",
      foes: "大嘴鸥（雨天主力）与 一只可能开广域防守的输出手。|Pelipper holding Rain, and an attacker who may choose Wide Guard.",
      field: "第 7 回合，雨天已开。|Turn 7, Rain active.",
      known: "电光束在雨天直接以双倍威力发动，不需要蓄力回合。|Electro Shot activates at double power in rain with no charge turn.",
    },
    prompt: "选择这一回合的输出时，哪些信息必须进入判断？（多选）|Which facts must enter this turn’s output choice? (Select all.)",
    options: [
      "单体与范围的分类，以及对手是否可能开广域防守|Single-target versus spread, and whether Wide Guard is available to them",
      "雨天让电光束直接双倍威力发动，节省一个蓄力回合|Rain lets Electro Shot fire at double power immediately, saving a turn",
      "只看招式的基础威力排序|Only the move’s base power",
    ],
    answer: [0, 1],
    why: [
      "广域防守是对手手里的一个决定，而范围招式会被它整招防住，所以分类直接决定这回合能不能打出伤害。|Wide Guard is a choice your opponent holds, and it blocks spread outright, so the single-target versus spread reading decides whether this turn does anything.",
      "雨天把蓄力回合变成收益，这是比威力数字更实际的节奏优势。|Rain converts a turn of nothing into damage, which is a tempo gain base power cannot describe.",
      "只看威力会同时漏掉防守选择和蓄力回合，等于在两个已知条件上做决策。|Candidate C drops both known conditions and optimises against neither.",
    ],
  }),
  dq({
    id: "final-room",
    level: "applied",
    scene: {
      side: "两只都还没用过守住的宝可梦，下回合速度优势即可取胜。|Two allies with unused Protect, and you win on the Speed advantage next turn.",
      foes: "一只开了空间的空间手，以及一只会反击的输出手。|A Trick Room setter and an attacker that will counter.",
      field: "第 9 回合，空间将在本回合结束后消失。|Turn 9; Trick Room expires at the end of this turn.",
      known: "双方都没有穿守住招式，也没有天气扣血。|Neither side has a Protect bypass, and no weather chip is in play.",
    },
    prompt: "这一回合合理的路线是？|What is the reasonable line this turn?",
    options: [
      "双守住耗尽空间，保住两只兑现下一回合的胜利条件|Double Protect to run Trick Room out and keep both allies for the win next turn",
      "必须立刻攻击，否则对手会把空间续上|You must attack now, or the opponent will extend Trick Room",
      "开广域防守，反过来压制对手的先制|Wide Guard to suppress the opponent’s priority instead",
      "让两只互相保护，节省一个守住次数|Have the two protect each other to save a Protect use",
    ],
    answer: 0,
    why: [
      "空间本回合结束就消失，而你下回合靠速度取胜，所以守住就是把胜利条件坐实。|The room expires at the end of this turn and you win on Speed next turn, so protecting realises the win condition.",
      "空间无法在空间已经消失的那一回合续上，所以“必须现在攻击”的前提不存在。|Candidate B assumes the room survives, which the given timing rules out.",
      "广域防守对空间手没有意义，而且你在领先位置并不需要压制先制。|Candidate C protects against a threat that is already gone.",
      "互相保护是无效的：守住只保护自己，不保护队友。|Candidate D misreads Protect as a party-wide effect.",
    ],
  }),
  dq({
    id: "final-gold",
    level: "applied",
    scene: {
      side: "一个想用抛下狠话 Parting Shot 转场、并让后排安全落场的支援手。|A supporter whose Parting Shot pivot would let the partner come in safely.",
      foes: "黄金之躯的赛富豪（已确认）与 一只会反击的单体输出手。|Confirmed Good as Gold Gholdengo and a single-target attacker that counters.",
      field: "第 7 回合。|Turn 7.",
      known: "黄金之躯阻挡其他宝可梦针对它的变化招式，抛下狠话属于变化招式。|Good as Gold blocks status moves from other Pokémon that target its user, and Parting Shot is one.",
    },
    prompt: "这个转场计划哪里错，下一步该怎么走？|What is wrong with the pivot, and what do you do instead?",
    options: [
      "整招被挡所以不会转场；改用能真正执行的控制或防守，并接受后排暂时暴露|Parting Shot is blocked in full, so you do not pivot; play control or defence that actually resolves and accept the temporary exposure",
      "转场成功，只是能力下降失败|The pivot succeeds; only the stat drop fails",
      "黄金之躯只挡降低能力等级那部分|Gold’s body blocks only the stat drop",
      "改瞄另一只就能完成转场|Aim at the other foe and the pivot goes through",
    ],
    answer: 0,
    why: [
      "黄金之躯是整招级别的阻挡，所以转场不会发生，你必须换一条真正能结算的路线。|Good as Gold blocks at move level, so the pivot never happens and the line has to change.",
      "不存在“转场生效但降能力失效”的部分结算。|Candidate B invents a partial resolution that does not exist.",
      "它读的是“这是不是其他宝可梦对我用的变化招式”，与招式的哪一部分无关。|Candidate C describes a component-level read that Good as Gold does not perform.",
      "一个动作只有一个目标，中途不能改瞄；换人也不是你能替对方决定的事。|Candidate D needs a second action to retarget, and switching is not yours to decide.",
    ],
  }),
  dq({
    id: "final-cleaner",
    level: "applied",
    scene: {
      side: "围巾幽尾玄鱼，已锁招扫墓 Last Respects。|Scarf Basculegion locked into Last Respects.",
      foes: "一只一般属性的目标，和 一只会反击的输出手。|A Normal-typing target and an attacker that counters.",
      field: "第 8 回合，三只参战队友已倒下且无法复活。|Turn 8; three selected allies have fainted with no revival.",
      known: "扫墓的基础威力按已倒下队友数量提高：50 + 50 × 3 = 200。|Last Respects gains 50 base power per fainted selected ally: 50 + 50 × 3 = 200.",
    },
    prompt: "这个残局里哪些说法成立？（多选）|Which statements hold in this endgame? (Select all.)",
    options: [
      "扫墓当前基础威力是 200|Last Respects is at 200 base power",
      "它可以直接改用水流喷射来打一般属性目标|It can freely switch to Aqua Jet against that Normal-typing target",
      "一般属性对幽灵属性的扫墓免疫|Normal typing is immune to a Ghost-typing Last Respects",
    ],
    answer: [0, 2],
    why: [
      "三只队友倒下，所以威力按 50 + 50 × 3 结算为 200，这正是它作为清场手的价值。|Three allies down, so the power resolves as 50 + 50 × 3 = 200, which is exactly why it is a cleaner here.",
      "围巾已经锁定扫墓，无法在同一回合改成别的招式。|Candidate B ignores the Choice lock that makes the scarf setup fragile in the first place.",
      "幽灵属性的扫墓对一般属性免疫，所以这个目标本来就不是它的目标。|Ghost typing means a Normal-type target is immune, so this was never its matchup.",
    ],
  }),
  dq({
    id: "final-risk",
    level: "applied",
    scene: {
      side: "领先：一个 100% 命中、必定先动且能击倒的招式，以及一个 70% 命中但伤害更高的招式。|You are ahead with an accurate first-moving KO, plus a 70% move that hits harder.",
      foes: "一只 20 HP 的目标，和 一只会在被打断后反击的输出手。|A target at 20 HP and an attacker that counters if it survives.",
      field: "第 6 回合。|Turn 6.",
      known: "对手本回合没有守住可用，也没有先制招式。|The foe cannot Protect this turn and has no priority moves.",
    },
    prompt: "领先局面下这一回合用哪一招？|Which move do you take this turn while ahead?",
    options: [
      "用 100% 命中的击倒：额外伤害没有收益，未命中反而会把领先交出去|Take the accurate KO: the extra damage buys nothing, while a miss hands over the lead",
      "用 70% 的高伤招式：伤害更高就该用|Higher damage means you should use the 70% move",
      "用 70% 的招式，因为你落后需要搏一把|Take the 70% because you are behind and must gamble",
      "两个招式都用，先 70% 再补 100%|Use both: 70% first, then follow with the accurate one",
    ],
    answer: 0,
    why: [
      "领先时风险要有收益才值得付；这里的额外伤害没有任何结算价值，而 30% 的未命中会把优势丢掉。|Ahead, risk needs a payoff; the extra damage has none, and a 30% miss costs you the lead.",
      "把“伤害更高”当成充分理由，会把一个多余的结果换成真实风险。|Candidate B mistakes raw damage for value and pays real risk for a wasted number.",
      "题干明确说你领先，而落后才允许把命中率换成伤害。|Candidate C applies the behind-position rule to a position where you are ahead.",
      "第二个动作只在第一个动作让对手活下来时才有意义，而击倒线已经结束了这一回合。|Candidate D depends on the foe surviving, which the KO line denies.",
    ],
  }),
  dq({
    id: "final-adapt",
    level: "applied",
    scene: {
      side: "四只参战宝可梦，两种可执行模式：快攻压制，或天气控制。|Four selected Pokémon covering two executable modes: fast pressure, or weather control.",
      foes: "四只参战宝可梦，比你更慢，并依赖空间来反转速度关系。|Four selected opponents, slower than you, relying on Trick Room to invert the Speed order.",
      field: "对局预览，第 1 回合。|Match preview, turn one.",
      known: "对方可以先手开空间，而你有两种模式各自完整。|They can open Trick Room on priority, and you have two complete modes.",
    },
    prompt: "预览阶段应该先确立什么？|What should you settle at preview?",
    options: [
      "阻止或耗尽空间的可执行快攻路线，并写清它在你失败时的下一步|A fast line that denies or stalls Trick Room, plus what you do when it fails",
      "自动替对方开空间，好让自己的低速输出先动|Set their Trick Room for them so your slow attacker moves first",
      "按四只个人排名最高的原则直接选出|Select purely on the four highest individual rankings",
      "顺风与空间一起开，两种速度优势都拿到|Open with Tailwind and Trick Room and keep both speed advantages",
    ],
    answer: 0,
    why: [
      "控速必须服务你的相对速度；这里最值钱的资产就是“他的空间开不起来”。|Speed control has to serve your relative Speed, and the most valuable asset here is his room never starting.",
      "替对方开空间是把对手的胜利条件直接送出去。|Candidate B hands the opponent their win condition.",
      "单只排名无法回答“谁先手”，而这正是这一局的决定性问题。|Candidate C answers a question the matchup does not contain.",
      "顺风和空间互相抵消，你只会得到没有速度优势的局面。|Candidate D cancels your own two claims and wins nothing.",
    ],
  }),
];
export { q, dq, lesson, section, t };
