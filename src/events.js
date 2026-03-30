
const BASE_URL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL)
 ? import.meta.env.BASE_URL
 : "/"

function withBase(path){
	const normalizedBase = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`
	return `${normalizedBase}${String(path).replace(/^\/+/, "")}`
}

export const ICONS={
 red: withBase("red.png"),
 gold: withBase("gold.png"),
 white: withBase("white.png")
};

export const DAY_KEYS=["peace","vehicle","shelter","science","hero","growth","enemy"];

export const EVENTS=[
["Mod Vehicle Boost","Shelter Upgrade","Age of Science","Hero Initiative","Army Expansion","Mod Vehicle Boost","Age of Science"],
["Shelter Upgrade","Age of Science","Hero Initiative","Army Expansion","Mod Vehicle Boost","Shelter Upgrade","Mod Vehicle Boost"],
["Army Expansion","Mod Vehicle Boost","Shelter Upgrade","Age of Science","Hero Initiative","Army Expansion","Hero Initiative"],
["Age of Science","Hero Initiative","Army Expansion","Mod Vehicle Boost","Shelter Upgrade","Age of Science","Shelter Upgrade"],
["Hero Initiative","Army Expansion","Mod Vehicle Boost","Shelter Upgrade","Age of Science","Hero Initiative","Army Expansion"],
["Army Expansion","Mod Vehicle Boost","Shelter Upgrade","Age of Science","Hero Initiative","Army Expansion","Hero Initiative"]
];
