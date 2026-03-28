/**
 * Generate mock attorneys based on case tier
 * Tier 1-2: General/Civil attorneys
 * Tier 3-4: Criminal/Complex case specialists
 * Tier 5+: High-stakes/Constitutional attorneys
 */

const tierSpecializations = {
  1: {
    legalArea: ["Contract Law", "Civil Disputes", "General Practice"],
    experience: [3, 4, 5],
    rating: [4.5, 4.6, 4.7],
  },
  2: {
    legalArea: ["Family Law", "Property Law", "Personal Injury"],
    experience: [5, 6, 7],
    rating: [4.6, 4.7, 4.8],
  },
  3: {
    legalArea: ["Criminal Defense", "Violent Crime Defense", "Serious Felonies"],
    experience: [8, 10, 12],
    rating: [4.7, 4.8, 4.9],
  },
  4: {
    legalArea: ["Federal Criminal Defense", "Complex Litigation", "Appeals"],
    experience: [12, 15, 18],
    rating: [4.8, 4.9, 5.0],
  },
  5: {
    legalArea: ["Constitutional Law", "High-Stakes Criminal", "Federal Cases"],
    experience: [18, 20, 25],
    rating: [4.9, 4.95, 5.0],
  },
};

const firstNames = [
  "John",
  "Sarah",
  "Michael",
  "Jennifer",
  "David",
  "Elizabeth",
  "Robert",
  "Margaret",
  "James",
  "Patricia",
  "William",
  "Barbara",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
];

const locations = [
  "Detroit, MI",
  "Grand Rapids, MI",
  "Lansing, MI",
  "Ann Arbor, MI",
  "Flint, MI",
  "Dearborn, MI",
  "Kalamazoo, MI",
  "Sterling Heights, MI",
];

export const generateMockAttorneys = (tier, count = 6) => {
  const tierData = tierSpecializations[tier] || tierSpecializations[1];
  const attorneys = [];

  for (let i = 0; i < count; i++) {
    const firstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const legalArea =
      tierData.legalArea[Math.floor(Math.random() * tierData.legalArea.length)];
    const yearsExperience =
      tierData.experience[Math.floor(Math.random() * tierData.experience.length)];
    const rating =
      tierData.rating[Math.floor(Math.random() * tierData.rating.length)];

    attorneys.push({
      id: `mock-tier-${tier}-${i}`,
      full_name: `${firstName} ${lastName}`,
      profile_image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
      preferred_legal_area: legalArea,
      location: location,
      date_joined: new Date(
        new Date().getFullYear() - yearsExperience,
        0,
        1,
      ).toISOString(),
      rating: {
        average: rating,
      },
      is_mock: true,
      case_tier: tier,
      description: `Specializes in ${legalArea.toLowerCase()} with ${yearsExperience} years of experience.`,
      tier_match_reason: `Matched for Tier ${tier} cases requiring expertise in ${legalArea.toLowerCase()}.`,
    });
  }

  return attorneys;
};

export const getTierDescription = (tier) => {
  const descriptions = {
    1: "General Legal Matters",
    2: "Intermediate Cases",
    3: "Serious Criminal & Complex Cases",
    4: "High-Complexity Federal Cases",
    5: "Constitutional & High-Stakes Cases",
  };
  return descriptions[tier] || "Legal Services";
};
