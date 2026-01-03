
export interface DeepwokenStats {
  strength: number;
  fortitude: number;
  agility: number;
  intelligence: number;
  willpower: number;
  charisma: number;
}

export interface BuildStep {
  level: string;
  action: string;
  reason: string;
  isShrinePoint?: boolean;
}

export interface Requirement {
  item: string;
  statRequirement: string;
}

export interface AttunementStat {
  name: string;
  value: number;
}

export interface InvestmentPoints {
  vitality: number;
  erudition: number;
  proficiency: number;
  songchant: number;
}

export interface DeepwokenBuild {
  name: string; // Should be prefixed with [PVE] or [PVP]
  oath: string;
  attunement: string;
  weaponType: string;
  race: string;
  murmur: string;
  preShrineStats: DeepwokenStats;
  postShrineStats: DeepwokenStats;
  preShrineAttunementStats: AttunementStat[]; // Investment in each attunement pre-shrine
  postShrineAttunementStats: AttunementStat[]; // Final investment in each attunement
  preShrineTalents: string[];
  postShrineTalents: string[];
  mantras: string[];
  weaponRequirements: Requirement[];
  oathRequirements: Requirement[];
  recommendedBells: string[];
  progressionOrder: BuildStep[];
  description: string;
  playstyle: string;
  exportSummary: string; // Strict format for deepwoken.co
  builderJson: string;   // JSON string formatted for potential import into community tools
  imageUrl?: string;
  // New Fields
  preferableBoons: string[];
  preferableFlaws: string[];
  investmentPoints: InvestmentPoints;
}

export enum Attunement {
  Flamecharmer = "Flamecharmer",
  Frostdraw = "Frostdraw",
  Thundercall = "Thundercall",
  Galebreathe = "Galebreathe",
  Shadowcast = "Shadowcast",
  Ironsing = "Ironsing",
  Attunementless = "Attunementless"
}

export enum Oath {
  Starkindred = "Starkindred",
  Blindseer = "Blindseer",
  Visionshaper = "Visionshaper",
  Linkstrider = "Linkstrider",
  Silentheart = "Silentheart",
  Dawnwalker = "Dawnwalker",
  Arcweaver = "Arcweaver",
  None = "None"
}
