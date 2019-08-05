/*	-WHAT IS THIS?-
	This file adds optional material to "MPMB's Character Record Sheet" found at https://flapkan.com/mpmb/charsheets
	Import this file using the "Add Extra Materials" bookmark.
	-KEEP IN MIND-
	It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
*/

/*	-INFORMATION-
	Subject:	Class
	Effect:		This script adds a class, called "Battlemage" and 2 of its subclasses (Runic Bulwark and Spell Dancer)
				This class has been made and published by Luke Arndt on DMs Guild
				If you intend to use this script, please consider supporting the creator at https://www.dmsguild.com/product/194217/
				This script uses version 4.0, released 17th of June 2019
	Code by:	MorePurpleMoreBetter
	Date:		2019-08-05 (sheet v13.0.0beta18)

	Caution:	MorePurpleMoreBetter advises against using this class as it breaks game balance (some of its features are clearly overpowered). This code was made on commission for a patron.
*/

var iFileName = "Battlemage [Luke Arndt's work, transcribed by MPMB].js";
RequiredSheetVersion(13);

SourceList["LA:BM"] = {
	name : "Luke Arndt: Battlemage (v4.0)",
	abbreviation : "LA:BM",
	group : "Dungeon Masters Guild",
	url : "https://www.dmsguild.com/product/194217/",
	date : "2019/06/17"
};

ClassList["battlemage"] = {
	regExpSearch : /battlemage/i,
	name : "Battlemage",
	source : ["LA:BM", 0],
	primaryAbility : "Intelligence, and Strength or Dexterity",
	prereqs : "Intelligence 13, and Strength 13 or Dexterity 13",
	die : 10,
	improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
	saves : ["Con", "Int"],
	skillstxt : {
		primary : "Choose two from Acrobatics, Arcana, Athletics, History, Insight, Investigation and Persuasion"
	},
	armorProfs : {
		primary : [true, true, false, true],
		secondary : [true, true, false, true]
	},
	weaponProfs : {
		primary : [true, true],
		secondary : [true, true]
	},
	equipment : "Warlord starting equipment:" +
		"\n \u2022 A martial weapon and a shield -or- two martial weapons;" +
		"\n \u2022 Chain shirt -or- leather armor and 10 darts;" +
		"\n \u2022 A sholar's pack -or- an explorer's pack;" +
		"\n \u2022 A component pouch and a spellbook;" +
		"\n\nAlternatively, choose 5d4 \xD7 10 gp worth of starting equipment instead of both the class' and the background's starting equipment.",
	subclasses : ["Battlemage Archetype", []],
	attacks : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	spellcastingFactor : 2,
	spellcastingKnown : {
		cantrips : [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
		spells : "book",
		prepared : true
	},
	spellcastingList : {
		"class" : "wizard",
		level : [0, 5]
	},
	features : {
		"spellcasting" : {
			name : "Spellcasting",
			source : ["LA:BM", 2],
			minlevel : 1,
			description : desc([
				"I can cast prepared wizard cantrips/spells, using Intelligence as my spellcasting ability",
				"I can use a weapon I'm proficient in as a spellcasting focus"
			]),
			additional : levels.map(function (n, idx) {
				return [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5][idx] + " cantrips known";
			})
		},
		"energy specialization" : {
			name : "Energy Specialization",
			source : ["LA:BM", 3],
			minlevel : 1,
			description : desc([
				'Choose an energy type using the "Choose Features" button above; I gain resistance to it',
				"It replaces the acid, cold, fire, lightning, necrotic, psychic, and thunder damage in spells"
			]),
			calcChanges : {
				atkAdd : [
					function (fields, v, output) {
						var nrgType = GetFeatureChoice('class', 'battlemage', 'energy specialization');
						if (nrgType && v.isSpell && (/acid|cold|fire|lightning|necrotic|psychic|thunder/i).test(fields.Damage_Type)) {
							fields.Damage_Type = nrgType.capitalize();
						};
					},
					"Spells I cast that normally deal acid, cold, fire, lightning, necrotic, psychic, or thunder damage type, deal my energy specialization damage type instead."
				],
				spellAdd : [
					function (spellKey, spellObj, spName) {
						if (spellObj.psionic) return;
						var a = /(\d+d?\d*(\+\d+d?\d*\/(\d?SL|PP|extra PP))?(\+spell(casting)? (ability )?mod(ifier)?|(\+|-)\d+ \(.{3}\))? )(acid|cold|fire|lightning|necrotic|psychic|thunder)( dmg| damage)/gi;
						if ((a).test(spellObj.description)) {
							var newDmgType = GetFeatureChoice('class', 'battlemage', 'energy specialization');
							if (!newDmgType) return;
							var b = spellObj.description.replace(a, "$1" + newDmgType.capitalize() + " $10");
							if (b != spellObj.description) {
								spellObj.description = b;
								return true;
							}
						}
					},
					"Spells I cast that normally deal acid, cold, fire, lightning, necrotic, psychic, or thunder damage type, deal my energy specialization damage type instead."
				]
			},
			choices : ["Acid", "Cold", "Fire", "Lightning", "Necrotic", "Psychic", "Thunder"],
			"acid" : {
				name : "Acid Energy Specialization",
				description : desc([
					"I have resistance to acid damage; My battlemaster features deal acid damage",
					"Spells I cast that deal one of the other energy options now deal acid damage instead",
					"Thus, I replace cold, fire, lightning, necrotic, psychic, and thunder damage with acid"
				]),
				dmgres : ["Acid"],
				eval : function (lvlA, choiceA) {
					ClassList.battlemage.features["energy specialization"].updateNRGtype(choiceA[0], choiceA[1]);
				}
			},
			"cold" : {
				name : "Cold Energy Specialization",
				description : desc([
					"I have resistance to cold damage; My battlemaster features deal cold damage",
					"Spells I cast that deal one of the other energy options now deal cold damage instead",
					"Thus, I replace acid, fire, lightning, necrotic, psychic, and thunder damage with cold"
				]),
				dmgres : ["Cold"],
				eval : function (lvlA, choiceA) {
					ClassList.battlemage.features["energy specialization"].updateNRGtype(choiceA[0], choiceA[1]);
				}
			},
			"fire" : {
				name : "Fire Energy Specialization",
				description : desc([
					"I have resistance to fire damage; My battlemaster features deal fire damage",
					"Spells I cast that deal one of the other energy options now deal fire damage instead",
					"Thus, I replace acid, cold, lightning, necrotic, psychic, and thunder damage with fire"
				]),
				dmgres : ["Fire"],
				eval : function (lvlA, choiceA) {
					ClassList.battlemage.features["energy specialization"].updateNRGtype(choiceA[0], choiceA[1]);
				}
			},
			"lightning" : {
				name : "Lightning Energy Specialization",
				description : desc([
					"I have resistance to lightning damage; My battlemaster features deal lightning damage",
					"Spells I cast that deal one of the other energy options now deal lightning damage instead",
					"Thus, I replace acid, cold, fire, necrotic, psychic, and thunder damage with lightning"
				]),
				dmgres : ["Lightning"],
				eval : function (lvlA, choiceA) {
					ClassList.battlemage.features["energy specialization"].updateNRGtype(choiceA[0], choiceA[1]);
				}
			},
			"necrotic" : {
				name : "Necrotic Energy Specialization",
				description : desc([
					"I have resistance to necrotic damage; My battlemaster features deal necrotic damage",
					"Spells I cast that deal one of the other energy options now deal necrotic damage instead",
					"Thus, I replace acid, cold, fire, lightning, psychic, and thunder damage with necrotic"
				]),
				dmgres : ["Necrotic"],
				eval : function (lvlA, choiceA) {
					ClassList.battlemage.features["energy specialization"].updateNRGtype(choiceA[0], choiceA[1]);
				}
			},
			"psychic" : {
				name : "Psychic Energy Specialization",
				description : desc([
					"I have resistance to psychic damage; My battlemaster features deal psychic damage",
					"Spells I cast that deal one of the other energy options now deal psychic damage instead",
					"Thus, I replace acid, cold, fire, lightning, necrotic, and thunder damage with psychic"
				]),
				dmgres : ["Psychic"],
				eval : function (lvlA, choiceA) {
					ClassList.battlemage.features["energy specialization"].updateNRGtype(choiceA[0], choiceA[1]);
				}
			},
			"thunder" : {
				name : "Thunder Energy Specialization",
				description : desc([
					"I have resistance to thunder damage; My battlemaster features deal thunder damage",
					"Spells I cast that deal one of the other energy options now deal thunder damage instead",
					"Thus, I replace acid, cold, fire, lightning, necrotic, and psychic damage with thunder"
				]),
				dmgres : ["Thunder"],
				eval : function (lvlA, choiceA) {
					ClassList.battlemage.features["energy specialization"].updateNRGtype(choiceA[0], choiceA[1]);
				}
			},
			updateNRGtype : function (oldType, newType) {
				if (!newType) return;
				var toReplace = oldType ? RegExp(oldType + "\\u200A damage", "ig") : /\[energy damage\]/ig;
				newType += "\u200A damage";
				Value("Class Features", What("Class Features").replace(toReplace, newType));
				Value("Extra.Notes", What("Extra.Notes").replace(toReplace, newType));
			},
			changeeval : function () {
				var nrgType = GetFeatureChoice('class', 'battlemage', 'energy specialization');
				if (!nrgType || !CurrentClasses.battlemage) return;
				nrgType += "\u200A damage";
				var descrNGRtype = function (obj) {
					if (obj.description) {
						obj.description = obj.description.replace(/\[energy damage\]/ig, nrgType);
					}
				}
				for (var key in CurrentClasses.battlemage.features) {
					var fea = CurrentClasses.battlemage.features[key];
					descrNGRtype(fea);
					if (fea.choices) {
						for (var i = 0; i < fea.choices.length; i++) {
							descrNGRtype(fea[fea.choices[i].toLowerCase()]);
						}
					}
					if (fea.extrachoices) {
						for (var i = 0; i < fea.extrachoices.length; i++) {
							descrNGRtype(fea[fea.extrachoices[i].toLowerCase()]);
						}
					}
				}
			},
			choiceDependencies : [{
				feature : "energy mastery"
			}]
		},
		"arcane battery" : {
			name : "Arcane Battery",
			source : ["LA:BM", 3],
			minlevel : 2,
			description : desc([
				"When I hit a weapon attack, or successfully shove or grapple, I can expend energy dice",
				"The target then takes additional [energy damage] equal to the dice rolled",
				"If I use a spell slot to cast a spell, I regain a number of spend dice equal to the slot level"
			]),
			recovery : "short rest",
			additional : "Energy Dice",
			usages : levels.map(function (n) {
				return n < 2 ? "" : (n < 5 ? 2 : n < 9 ? 3 : n < 13 ? 4 : n < 17 ? 5 : n < 20 ? 6 : 7) + "d6 per ";
			}),
			usagescalc : "event.value = event.value.toString().replace(/ ?per ?/i, '');"
		},
		"discoveries" : {
			name : "Discoveries",
			source : ["LA:BM", 3],
			minlevel : 2,
			description : '\n   Use the "Choose Feature" button above to add a discovery to the third page',
			additional : levels.map(function (n) {
				return n < 2 ? "" : (n < 7 ? 1 : n < 15 ? 2 : 3) + " known; swap one when gaining level";
			}),
			extraTimes : levels.map(function (n) { return  n < 2 ? 0 : n < 7 ? 1 : n < 15 ? 2 : 3; }),
			extraname : "Discovery",
			extrachoices : ["Arcane Brawling", "Controlled Destruction", "Improved Familiar", "Reach Mastery", "Ritual Casting", "Wider Study"],
			"arcane brawling" : {
				name : "Arcane Brawling",
				source : ["LA:BM", 3],
				description : desc([
					"My unarmed strikes deal 1d4 plus my Int mod in damage, and can use Dex instead of Str",
					"Whenever I cast a spell that requires a spell attack, I can do a shove or grapple instead",
					"If the shove or grapple succeeds, the spell affects that target as it would with a spell attack"
				]),
				calcChanges : {
					atkCalc : [
						function (fields, v, output) {
							if (v.baseWeaponName == "unarmed strike") output.extraDmg += What('Int Mod');
						}, ""
					],
					atkAdd : [
						function (fields, v) {
							if (v.baseWeaponName == "unarmed strike") {
								if (fields.Damage_Die == 1) fields.Damage_Die = '1d4';
								fields.Mod = v.StrDex;
							};
						},
						"I can use Dexterity for my unarmed strikes instead of Strength;\n \u2022 My unarmed strikes do 1d4 damage instead of 1;\n \u2022 I add my Intelligence modifier to the damage of my unarmed strikes."
					]
				}
			},
			"controlled destruction" : {
				name : "Controlled Destruction",
				source : ["LA:BM", 3],
				description : desc([
					"When I cast a spell/feature that deals [energy damage], I can choose Int mod of creatures",
					"The chosen automatically succeed on their save vs. the spell and take no [energy damage]"
				])
			},
			"improved familiar" : { // the option to make the familiar an elemental can't be coded
				name : "Improved Familiar",
				source : ["LA:BM", 3],
				description : desc([
					"I add Find Familiar to my spellbook and my familiar can have the elemental type",
					"It has twice my level as HP, has my Proficiency bonus, and is immune to energy damage",
					"Also, it can speak and understand common and one language of my choice"
				]),
				spellcastingBonus : {
					name : "Improved Familiar",
					spells : ["find familiar"],
					selection : ["find familiar"]
				},
				changeeval : function (lvlA, choiceA) {
					var AScompA = isTemplVis('AScomp') ? What('Template.extras.AScomp').split(',') : false;
					if (!AScompA) return;
					var curProf = How("Proficiency Bonus");
					var nrgType = GetFeatureChoice('class', 'battlemage', 'energy specialization');
					if (!nrgType) nrgType = "[energy damage]";
					for (var a = 1; a < AScompA.length; a++) {
						if ((/^(pact_of_the_chain|familiar)$/i).test(What(AScompA[a] + 'Companion.Remember'))) {
							prefix = AScompA[a];
							Value(prefix + "Comp.Use.HP.Max", Math.round(lvlA[1] * 2));
							Value(prefix + "Comp.Use.Proficiency Bonus", curProf);
							var theNotes = What(prefix + "Cnote.Left");
							if (!(/HP is twice my battlemaster level/i).test(theNotes)) {
								Value(prefix + "Cnote.Left", theNotes + "\n\u2022 My familiar's HP is twice my battlemaster level and its Proficiency bonus is equal to mine" +
								"\n\u2022 My familiar can be of the elemental type and is immune to " + nrgType +
								"\n\u2022 My familiar understands and speaks common and one language of my choice");
							}
						}
					}
				},
				removeeval : function (lvlA, choiceA) {
					var AScompA = isTemplVis('AScomp') ? What('Template.extras.AScomp').split(',') : false;
					if (!AScompA) return;
					for (var a = 1; a < AScompA.length; a++) {
						if ((/^(pact_of_the_chain|familiar)$/i).test(What(AScompA[a] + 'Companion.Remember'))) {
							prefix = AScompA[a];
							var itsRace = How("P4.AScomp.Comp.Race");
							if (CreatureList[itsRace]) {
								Value(prefix + "Comp.Use.HP.Max", CreatureList[itsRace].hp);
								Value(prefix + "Comp.Use.Proficiency Bonus", CreatureList[itsRace].proficiencyBonus);
							}
							Value(prefix + "Cnote.Left", What(prefix + "Cnote.Left").replace(/\r\u2022 (My familiar's HP is twice my battlemaster level and its Proficiency bonus is equal to mine|My familiar can be of the elemental type and is immune to \[?.*? damage\]?|My familiar understands and speaks common and .*)/ig, ""));
						}
					}
				}
			},
			"reach mastery" : {
				name : "Reach Mastery",
				source : ["LA:BM", 3],
				description : desc([
					"While wielding a reach weapon, I can shove a creature that is within 10 ft",
					"The reach weapon allows me to cast spells with a range of 5 ft or touch at a range of 10 ft",
					"I can use a whip to grapple or interact with an object within 10 ft"
				])
			},
			"ritual casting" : {
				name : "Ritual Casting",
				source : ["LA:BM", 3],
				description : "\n   I can cast wizard spells with the ritual tag in my spellbook as rituals even if not prepared"
			},
			"wider study" : {
				name : "Wider Study",
				source : ["LA:BM", 3],
				description : desc([
					"I learn one cantrip and two 1st-level spells from any spell list; These are always prepared",
					"They count as wizard spells, but do not count towards the number of cantrips I can know"
				]),
				spellcastingBonus : [{
					"class" : "any",
					level : [0, 0],
					firstCol : "marked"
				}, {
					"class" : "any",
					level : [1, 1],
					firstCol : "marked",
					times : 2
				}]
			}
		},
		"subclassfeature3" : {
			name : "Battlemage Archetype",
			source : ["LA:BM", 3],
			minlevel : 3,
			description : "\n   Choose a Battlemage Archetype that represents your style and put it in the \"Class\" field"
		},
		"warrior magic" : {
			name : "Warrior Magic",
			source : ["LA:BM", 3],
			minlevel : 5,
			description : desc([
				"When I use my action to cast a spell, I can make a weapon attack as a bonus action",
				"I can do the attack first, but it takes up my action if I can't cast a spell afterwards"
			]),
			action : ["bonus action", ""]
		},
		"energy efficiency" : {
			name : "Energy Efficiency",
			source : ["LA:BM", 4],
			minlevel : 11,
			description : desc([
				"I use 1 lower level spell slot for spells that deal [energy damage]; This also affects scaling",
				"If this makes it a 0th level spell slot, I can cast the spell without using a spell slot"
			])
		},
		"energy mastery" : {
			name : "Energy Mastery",
			source : ["LA:BM", 4],
			minlevel : 20,
			description : '\n   Choose an energy specialization using the "Choose Features" button above',
			calcChanges : {
				atkCalc : [
					function (fields, v, output) {
						if (classes.known.battlemage && classes.known.battlemage.level > 19 && v.isSpell) {
							var nrgType = GetFeatureChoice('class', 'battlemage', 'energy specialization');
							if (nrgType && fields.Damage_Type.toLowerCase().indexOf(nrgType) != -1) output.extraDmg += What('Int Mod');
						};
					},
					"Cantrips and spells that deal my energy specialization type of damage get my Intelligence modifier added to their damage."
				],
				spellAdd : [
					function (spellKey, spellObj, spName) {
						if (!spellObj.psionic) {
							var nrgType = GetFeatureChoice('class', 'battlemage', 'energy specialization');
							return genericSpellDmgEdit(spellKey, spellObj, nrgType, "Int");
						}
					},
					"Cantrips and spells that deal my energy specialization type of damage get my Intelligence modifier added to their damage."
				]
			},
			choices : ["Acid", "Cold", "Fire", "Lightning", "Necrotic", "Psychic", "Thunder"],
			choicesNotInMenu : true,
			"acid" : {
				name : "Acid Energy Mastery",
				description : " [Acid damage immunity]" + "\n   I add my Intelligence modifier to the damage rolls of spells that deal acid damage",
				savetxt : { immune : ["acid"] }
			},
			"cold" : {
				name : "Cold Energy Mastery",
				description : " [Cold damage immunity]" + "\n   I add my Intelligence modifier to the damage rolls of spells that deal cold damage",
				savetxt : { immune : ["cold"] }
			},
			"fire" : {
				name : "Fire Energy Mastery",
				description : " [Fire damage immunity]" + "\n   I add my Intelligence modifier to the damage rolls of spells that deal fire damage",
				savetxt : { immune : ["fire"] }
			},
			"lightning" : {
				name : "Lightning Energy Mastery",
				description : " [Lightning damage immunity]" + "\n   I add my Intelligence modifier to the damage rolls of spells that deal lightning damage",
				savetxt : { immune : ["lightning"] }
			},
			"necrotic" : {
				name : "Necrotic Energy Mastery",
				description : " [Necrotic damage immunity]" + "\n   I add my Intelligence modifier to the damage rolls of spells that deal necrotic damage",
				savetxt : { immune : ["necrotic"] }
			},
			"psychic" : {
				name : "Psychic Energy Mastery",
				description : " [Psychic damage immunity]" + "\n   I add my Intelligence modifier to the damage rolls of spells that deal psychic damage",
				savetxt : { immune : ["psychic"] }
			},
			"thunder" : {
				name : "Thunder Energy Mastery",
				description : " [Thunder damage immunity]" + "\n   I add my Intelligence modifier to the damage rolls of spells that deal thunder damage",
				savetxt : { immune : ["thunder"] }
			}
		}
	}
};

AddSubClass("battlemage", "runic bulwark", {
	regExpSearch : /^(?=.*runic)(?=.*bulwark).*$/i,
	subname : "Runic Bulwark",
	source : ["LA:BM", 6],
	fullname : "Runic Bulwark",
	features : {
		"subclassfeature3" : {
			name : "Arcane Scholar",
			source : ["LA:BM", 6],
			minlevel : 3,
			description : "\n   I gain heavy armor proficiency, and Arcana and caligrapher's supplies prof. \u0026 expertise",
			skills : [["Arcana", "full"]],
			toolProfs : ["Caligrapher's supplies (expertise)"],
			armorProfs : [false, false, true, false]
		},
		"subclassfeature3.1" : {
			name : "Runic Weapons",
			source : ["LA:BM", 6],
			minlevel : 3,
			description : desc([
				"When I finish a short rest, I can inscribe arcane runes on two simple or martial weapons",
				"These are magical and gain an ability; I can have only two, making more clears another",
				" \u2022 A one-handed melee weapon gains the thrown (30/120) property",
				" \u2022 A two-handed melee weapon scores a critical hit on a 19 or 20 to hit",
				" \u2022 Weapon with the ammunition property no longer require ammo as they conjure it",
				"As an action, I can have it fly 300 ft to me until it reaches me, moving through objects",
				"As part of that action, I can use it to make a ranged attack on a creature in its path"
			]),
			action : [["action", "Call Runic Weapon"]],
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if ((/^(?=.*runic)(?=.*weapon).*$/i).test(v.WeaponText)) {
							if (v.isMeleeWeapon && (/\b(versatile|(2|two).?hand(ed)?s?)\b/i).test(v.theWea.description)) {
								if (v.CritChance) return;
								v.CritChance = 19;
								fields.Description += (fields.Description ? '; ' : '') + 'Crit on 19-20';
							} else if (v.isMeleeWeapon && !(/thrown/i).test(v.theWea.description) && fields.Range == "Melee") {
								fields.Description += (fields.Description ? '; ' : '') + 'Thrown';
								fields.Range = "Melee, 30/120 ft";
							} else if (v.isRangedWeapon && (/ammunition/i).test(v.theWea.description)) {
								fields.Description += (fields.Description ? '; ' : '') + 'Conjures own ammo';
							}
						}
					},
					'If I include the words "Runic Weapon" in a the name of a weapon, it will be treated as a weapon I inscribed with runes. If it is a one-handed melee weapon, it gains the thrown (30/120) property. If it is a two-handed melee weapon, it scores a critical hit on a 19 or 20. If it is a ranged weapon with the ammunition property, it no longer require ammo as it can conjure that.'
				]
			}
		},
		"subclassfeature5" : {
			name : "Call Weapon",
			source : ["LA:BM", 6],
			minlevel : 5,
			description : " [call runic weapon as a bonus action]",
			action : [["bonus action", "Call Runic Weapon"]],
			eval : function () {
				processActions(false, "Runic Bulwark: Runic Weapons", ClassSubList["battlemage-runic bulwark"].features["subclassfeature3.1"].action, "Call Runic Weapon");
			}
		},
		"subclassfeature6" : {
			name : "Runic Armor",
			source : ["LA:BM", 6],
			minlevel : 6,
			description : desc([
				"When I finish a short rest, I can inscribe arcane runes on a single suit of armor",
				"I can sleep in it as if it were light armor; I can have only 1, making more clears the first",
				"As a bonus action while wearing my runic armor, I can expend energy dice for temp HP",
				"I gain temp HP equal to the roll of the energy dice, lasting 1 hour",
				"As a reaction when I take [energy damage] and have these temp HP, I can expel energy",
				"I lose all remaining temp HP and all creatures within 10 ft take 1d6 [energy damage]",
				"They must make a Str save for half the damage and are pushed 10 ft on a failed save"
			]),
			action : [["bonus action", " (temp HP)"], ["reaction", " (energy wave)"]]
		},
		"subclassfeature10" : {
			name : "Improved Runic Weapons",
			source : ["LA:BM", 6],
			minlevel : 10,
			description : " [Int mod to runic weapon dmg]",
			calcChanges : {
				atkCalc : [
					function (fields, v, output) {
						if ((/^(?=.*runic)(?=.*weapon).*$/i).test(v.WeaponText)) {
							output.extraDmg += What('Int Mod');
						}
					},
					'If I include the words "Runic Weapon" in a the name of a weapon, it will be treated as a weapon I inscribed with runes and adds my Intelligence modifier to its damage.'
				]
			}
		},
		"subclassfeature14" : {
			name : "Armored Against Misfortune",
			source : ["LA:BM", 6],
			minlevel : 14,
			description : desc([
				"While wearing my runic armor, I can expend an energy die and add it to a d20 roll",
				"I can do this after rolling a check, attack roll, or save, but before knowing the outcome"
			])
		},
		"subclassfeature18" : {
			name : "Runic Resistance",
			source : ["LA:BM", 6],
			minlevel : 18,
			description : "\n   My runic armor grants me resistance to all damage except bludgeoning/piercing/slashing",
			dmgres : ["Acid", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Poison", "Psychic", "Radiant", "Thunder"]
		}
	}
});

AddSubClass("battlemage", "spell dancer", {
	regExpSearch : /^(?=.*spell)(?=.*dancer).*$/i,
	subname : "Spell Dancer",
	source : ["LA:BM", 7],
	fullname : "Spell Dancer",
	features : {
		"subclassfeature3" : {
			name : "Acrobat",
			source : ["LA:BM", 7],
			minlevel : 3,
			description : " [Proficiency and expertise in Acrobatics]",
			skills : [["Acrobatics", "full"]]
		},
		"subclassfeature3.1" : {
			name : "Spell Dance",
			source : ["LA:BM", 7],
			minlevel : 3,
			description : desc([
				"Whenever I use a spell slot to cast a spell, I go into a spell dance for the rest of the turn",
				"While in this spell dance, I don't provoke opportunity attacks by moving"
			])
		},
		"subclassfeature3.2" : {
			name : "Unarmored Defense",
			source : ["LA:BM", 7],
			minlevel : 3,
			description : "\n   " + "Without armor and no shield, my AC is 10 + Dexterity modifier + Intelligence modifier",
			armorOptions : {
				regExpSearch : /justToAddToDropDown/,
				name : "Unarmored Defense (Int)",
				source : ["LA:BM", 7],
				ac : 10,
				addMod : true
			},
			armorAdd : "Unarmored Defense (Int)"
		},
		"subclassfeature6" : {
			name : "Defensive Riposte",
			source : ["LA:BM", 7],
			minlevel : 6,
			description : desc([
				"As a reaction when missed in melee, I can expend an energy die and add it to my AC",
				"I then make an opportunity attack vs. the attacker; AC lasts until my next turn starts"
			]),
			action : ["reaction", " (after missed in melee)"]
		},
		"subclassfeature10" : {
			name : "Evasion",
			source : ["LA:BM", 7],
			minlevel : 10,
			description : "\n   My Dexterity saves vs. areas of effect negate damage on success and halve it on failure",
			savetxt : { text : ["Dex save vs. area effects: fail \u2015 half dmg, success \u2015 no dmg"] }
		},
		"subclassfeature10.1" : {
			name : "Lightning Reflexes",
			source : ["LA:BM", 7],
			minlevel : 10,
			description : "\n   I gain proficiency with Dexterity saving throws",
			saves : ["Dex"]
		},
		"subclassfeature14" : {
			name : "Reflection",
			source : ["LA:BM", 7],
			minlevel : 14,
			description : desc([
				"As a reaction when I'm the target of a spell attack or save vs. a spell, l can redirect it",
				"I spend two energy dice and roll both; I add the higher of the two to my AC or save roll",
				"If that causes the spell to miss or me to succeed the save, I can choose a new target for it",
				"Line-area spells stop at my space and I then create the same effect, originating from me",
				"For other type of spells, I choose another eligible target within range of the spell"
			]),
			action : ["reaction", ""],
			additional : levels.map(function (n) {
				return n < 15 ? "" : n < 20 ? "30 ft" : "60 ft";
			})
		},
		"subclassfeature18" : {
			name : "Freedom of Movement",
			source : ["LA:BM", 7],
			minlevel : 18,
			description : desc([
				"I'm always under the effect of a Freedom of Movement spell and thus can't be restrained",
				"This can't be dispelled, but can be temporarily suppressed there were no magic functions"
			]),
			spellcastingBonus : {
				name : "Permanent",
				spells : ["freedom of movement"],
				selection : ["freedom of movement"],
				firstCol : "SP"
			}
		}
	}
});
