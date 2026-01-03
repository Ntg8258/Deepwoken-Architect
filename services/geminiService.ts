
import { GoogleGenAI, Type } from "@google/genai";
import { DeepwokenBuild } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STAT_PROPS = {
  strength: { type: Type.NUMBER },
  fortitude: { type: Type.NUMBER },
  agility: { type: Type.NUMBER },
  intelligence: { type: Type.NUMBER },
  willpower: { type: Type.NUMBER },
  charisma: { type: Type.NUMBER },
};

const REQUIREMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    item: { type: Type.STRING },
    statRequirement: { type: Type.STRING },
  },
  required: ["item", "statRequirement"]
};

const ATTUNEMENT_STAT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    value: { type: Type.NUMBER },
  },
  required: ["name", "value"]
};

const INVESTMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    vitality: { type: Type.NUMBER, description: "Points in Vitality (Max 6 total for all investment stats)" },
    erudition: { type: Type.NUMBER, description: "Points in Erudition" },
    proficiency: { type: Type.NUMBER, description: "Points in Proficiency" },
    songchant: { type: Type.NUMBER, description: "Points in Songchant" },
  },
  required: ["vitality", "erudition", "proficiency", "songchant"]
};

const BUILD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    oath: { type: Type.STRING },
    attunement: { type: Type.STRING },
    weaponType: { type: Type.STRING },
    race: { type: Type.STRING },
    murmur: { type: Type.STRING },
    preShrineStats: {
      type: Type.OBJECT,
      properties: STAT_PROPS,
      required: ["strength", "fortitude", "agility", "intelligence", "willpower", "charisma"]
    },
    postShrineStats: {
      type: Type.OBJECT,
      properties: STAT_PROPS,
      required: ["strength", "fortitude", "agility", "intelligence", "willpower", "charisma"]
    },
    preShrineAttunementStats: { type: Type.ARRAY, items: ATTUNEMENT_STAT_SCHEMA },
    postShrineAttunementStats: { type: Type.ARRAY, items: ATTUNEMENT_STAT_SCHEMA },
    preShrineTalents: { type: Type.ARRAY, items: { type: Type.STRING } },
    postShrineTalents: { type: Type.ARRAY, items: { type: Type.STRING } },
    mantras: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaponRequirements: { type: Type.ARRAY, items: REQUIREMENT_SCHEMA },
    oathRequirements: { type: Type.ARRAY, items: REQUIREMENT_SCHEMA },
    recommendedBells: { type: Type.ARRAY, items: { type: Type.STRING } },
    progressionOrder: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          level: { type: Type.STRING },
          action: { type: Type.STRING },
          reason: { type: Type.STRING },
          isShrinePoint: { type: Type.BOOLEAN },
        },
        required: ["level", "action", "reason"]
      }
    },
    description: { type: Type.STRING },
    playstyle: { type: Type.STRING },
    exportSummary: { 
      type: Type.STRING, 
      description: "The EXACT raw multiline text for deepwoken.co import. MUST follow the specified format with '=====' separators and 50+ talents." 
    },
    builderJson: { type: Type.STRING },
    preferableBoons: { type: Type.ARRAY, items: { type: Type.STRING } },
    preferableFlaws: { type: Type.ARRAY, items: { type: Type.STRING } },
    investmentPoints: INVESTMENT_SCHEMA,
  },
  required: [
    "name", "oath", "attunement", "weaponType", "race", "murmur", "preShrineStats", "postShrineStats", 
    "preShrineAttunementStats", "postShrineAttunementStats",
    "preShrineTalents", "postShrineTalents", "mantras", "weaponRequirements", "oathRequirements", 
    "recommendedBells", "progressionOrder", "description", "playstyle", "exportSummary", "builderJson",
    "preferableBoons", "preferableFlaws", "investmentPoints"
  ]
};

export const generateBuildDetails = async (prompt: string): Promise<DeepwokenBuild> => {
  const systemInstruction = `You are the world-renowned Deepwoken build architect. 
  
  CRITICAL: The 'exportSummary' MUST follow this EXACT format for deepwoken.co compatibility:
  [Build Name]
  =====
  LVL 20 [Race], [Origin], [Oath]
  == ATTRIBUTES ==
  [STR Val] STR; [FTD Val] FTD; [AGL Val] AGL; [INT Val] INT; [WLL Val] WLL; [CHA Val] CHA
  =====
  [HVY Val] HVY; [MED Val] MED; [LHT Val] LHT
  =====
  [ElementVal] [ElementCode (ICE/SDW/FLM/THN/GAL/IRN)]; [ElementVal] [ElementCode]
  == MANTRAS ==
  [Mantra 1]
  [Mantra 2]
  ... (All 8+ mantras)
  == TALENTS ==
  [List EVERY SINGLE talent expected for a finished Power 20 build. You MUST provide an exhaustive list of at least 50-80 talents. This list must be long and complete, including common meta talents like Exoskeleton, Reinforced Armor, To the Finish, Ghost, etc.]

  INVESTMENT POINTS: Distribute a total of 12 points between Vitality, Erudition, Proficiency, and Songchant (e.g., 6 Vitality, 6 Erudition for a tanky mage).
  
  Formatting Rules for 'exportSummary':
  1. No code blocks.
  2. Use "=====" exactly where shown.
  3. No "Brackets" [] in the final string.
  4. One talent/mantra per line.
  
  SHRINE OF ORDER: Always optimize for Shrine of Order.
  
  Return valid JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: BUILD_SCHEMA,
    },
  });

  return JSON.parse(response.text);
};

export const generateBuildImage = async (build: DeepwokenBuild): Promise<string> => {
  const prompt = `Stylized high-quality anime concept art for a Deepwoken Roblox character. Race: ${build.race}. Element: ${build.attunement}. Oath: ${build.oath}. Weapon: ${build.weaponType}. Dark, moody atmospheric lighting from the Depths. Dynamic pose. High detail.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate image");
};
