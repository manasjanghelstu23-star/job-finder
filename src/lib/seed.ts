import { PrismaClient } from "@prisma/client";
import { skillsList } from "./skillsData";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a default category
  const generalCategory = await prisma.skillCategory.upsert({
    where: { name: "General Technology" },
    update: {},
    create: {
      name: "General Technology",
    },
  });

  const softSkillsCategory = await prisma.skillCategory.upsert({
    where: { name: "Soft Skills" },
    update: {},
    create: {
      name: "Soft Skills",
    },
  });

  // Example subset of soft skills from the prompt
  const softSkills = [
    "Communication",
    "Problem Solving",
    "Critical Thinking",
    "Teamwork",
    "Collaboration",
    "Leadership",
    "Adaptability",
    "Emotional Intelligence",
    "Time Management",
    "Accountability",
    "Negotiation",
    "Conflict Resolution"
  ];

  // Seed Soft Skills
  for (const skillName of softSkills) {
    await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: {
        name: skillName,
        categoryId: softSkillsCategory.id,
      },
    });
  }

  // Seed Tech Skills from skillsData.ts
  let count = 0;
  for (const skillName of skillsList) {
    // Only add if not already added as soft skill
    if (!softSkills.includes(skillName)) {
      await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: {
          name: skillName,
          categoryId: generalCategory.id,
        },
      });
      count++;
    }
  }

  console.log(`Seeded ${softSkills.length} soft skills and ${count} tech skills.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
