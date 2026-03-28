"use client";

import { TreePine, Sprout, Leaf, Wind, ShieldCheck } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Seed Phase",
    date: "Mar 2026",
    content: "Initial carbon footprint reduction began. First virtual seeds planted in the community forest.",
    category: "Inception",
    icon: Sprout,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Sprout Growth",
    date: "Apr 2026",
    content: "Community reached 500kg CO2 offsets. First saplings emerged across the digital landscape.",
    category: "Growth",
    icon: Leaf,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "Thriving Forest",
    date: "Current",
    content: "Active AI monitoring and IoT sensor feedback maintain the health of our thriving virtual habitat.",
    category: "Maintenance",
    icon: TreePine,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Eco Guardian",
    date: "Future",
    content: "Achievement unlocked at 1000kg offset. Users become platinum-tier environmental guardians.",
    category: "Shield",
    icon: ShieldCheck,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "Pure Atmosphere",
    date: "Goal",
    content: "Ultimate goal: Net Zero contribution via community-driven gamified sustainability.",
    category: "Atmosphere",
    icon: Wind,
    relatedIds: [4],
    status: "pending" as const,
    energy: 15,
  },
];

const RadialOrbitalTimelineDemo = () => {
  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center">
      <RadialOrbitalTimeline timelineData={timelineData} />
    </div>
  );
}

export default RadialOrbitalTimelineDemo;
