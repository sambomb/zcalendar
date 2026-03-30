const STRUCTURE_GUIDE_DEFS = [
  ["resource-structure-headquarters", "Headquarters", "Main progression gate for overall base development.", ["resource-buildings", "day-shelter"]],
  ["resource-structure-lumber-mill", "Lumber Mill", "Produces wood for continuous building and growth.", ["resource-buildings", "day-shelter"]],
  ["resource-structure-farm", "Farm", "Produces food for troop and city sustain.", ["resource-buildings", "day-growth"]],
  ["resource-structure-foundry", "Foundry", "Produces alloys for equipment and upgrades.", ["resource-buildings", "day-hero"]],
  ["resource-structure-training-camp", "Training Camp", "Supports troop development throughput.", ["type-army", "day-growth"]],
  ["resource-structure-residence", "Residence", "Supports population and city operation flow.", ["resource-buildings", "day-shelter"]],
  ["resource-structure-production-center", "Production Center", "Improves core resource production efficiency.", ["resource-buildings", "day-growth"]],
  ["resource-structure-wall", "Wall", "Primary defensive layer for city safety.", ["day-enemy", "resource-shield"]],
  ["resource-structure-formation-i", "Formation I", "Main march slot for strongest lineup.", ["resource-heroes", "type-hero"]],
  ["resource-structure-formation-ii", "Formation II", "Secondary march slot for support operations.", ["resource-heroes", "day-growth"]],
  ["resource-structure-formation-iii", "Formation III", "Third march slot for advanced coverage.", ["resource-heroes", "day-growth"]],
  ["resource-structure-toxic-fog-garden", "Toxic Fog Garden", "Faction structure related to Blood Rose growth.", ["resource-heroes", "hero-katrina"]],
  ["resource-structure-steel-factory", "Steel Factory", "Faction structure related to Guard of Order growth.", ["resource-heroes", "hero-chinatsu"]],
  ["resource-structure-dawn-tower", "Dawn Tower", "Faction structure related to Wings of Dawn growth.", ["resource-heroes", "hero-laura"]],
  ["resource-structure-military", "Military", "Core military progression building.", ["type-army", "day-growth"]],
  ["resource-structure-restaurant", "Restaurant", "Support structure for city operation bonuses.", ["day-growth", "type-army"]],
  ["resource-structure-shooting-range", "Shooting Range", "Shooter troop development structure.", ["type-army", "day-growth"]],
  ["resource-structure-bikers-camp", "Bikers Camp", "Biker troop development structure.", ["type-army", "day-growth"]],
  ["resource-structure-raiders-camp", "Raiders Camp", "Raider/assaulter troop development structure.", ["type-army", "day-growth"]],
  ["resource-structure-hospital", "Hospital", "Controls wounded capacity and recovery risk.", ["day-enemy", "resource-shield"]],
  ["resource-structure-intercity-trade", "Inter-City Trade", "City structure tied to trade operations.", ["resource-intercity-trades", "day-growth"]],
  ["resource-structure-caravan", "Caravan", "Supports special mission and operation flow.", ["resource-bounty", "day-growth"]],
  ["resource-structure-radar", "Radar (Structure)", "Building-level support for reconnaissance operations.", ["resource-radar", "day-vehicle"]],
  ["resource-structure-task-center", "Task Center", "Supports task progression and daily throughput.", ["resource-general-tips", "day-growth"]],
  ["resource-structure-meeting-plaza", "Meeting Plaza", "Alliance coordination and rally support structure.", ["resource-bounty", "day-enemy"]],
  ["resource-structure-alliance-center", "Alliance Center", "Enables stronger alliance support handling.", ["day-enemy", "resource-shield"]],
  ["resource-structure-warehouse", "Warehouse", "Resource storage and protection structure.", ["resource-shield", "day-growth"]],
  ["resource-structure-village", "Village", "Population support structure for base scaling.", ["day-shelter", "day-growth"]],
  ["resource-structure-library", "Library", "Research support structure for long-term growth.", ["type-science", "day-science"]],
  ["resource-structure-club", "Club", "Hero recruitment and roster-development structure.", ["type-hero", "day-hero"]],
  ["resource-structure-vehicle-workshop", "Vehicle Workshop", "Main vehicle progression structure.", ["type-vehicle", "day-vehicle", "resource-blueprints", "resource-wrenches", "resource-fuel"]]
]

export const STRUCTURE_GUIDES = STRUCTURE_GUIDE_DEFS.map(([id, title, summary, related]) => ({
  id,
  group: "resources",
  badge: "Structure",
  title,
  summary,
  sections: [
    {
      title: "Role",
      items: [
        "Upgrade this structure in sync with your event-day plan and account bottlenecks."
      ]
    }
  ],
  related
}))
