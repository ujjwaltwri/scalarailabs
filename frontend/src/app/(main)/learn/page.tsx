import { cookies } from "next/headers"
import { Unit } from "./Unit"
import { DailyGoal } from "@/components/DailyGoal"

export type SkillType = {
  id: number;
  title: string;
  order: number;
  status: "LOCKED" | "AVAILABLE" | "COMPLETED";
}

export type UnitType = {
  id: number;
  title: string;
  description: string;
  order: number;
  skills: SkillType[];
}

export default async function LearnPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value || "0";

  let units: UnitType[] = [];
  let totalXp = 0;
  try {
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || '/api';
    let res = await fetch(`${apiUrl}/path/${userId}`, { cache: 'no-store' });
    if (!res.ok && res.status === 404) {
      res = await fetch(`${apiUrl}/path/0`, { cache: 'no-store' });
    }
    if (res.ok) {
      units = await res.json();
    }
    
    // Fetch XP data
    const xpRes = await fetch(`${apiUrl}/progress/user/${userId}`, { cache: 'no-store' });
    if (xpRes.ok) {
      const xpData = await xpRes.json();
      totalXp = xpData.total_xp || 0;
    }
  } catch (error) {
    console.error("Failed to fetch learning path:", error);
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 max-w-[1056px] mx-auto pt-6">
      <div className="w-[368px] sticky top-6 hidden lg:block flex-col gap-y-4">
        <DailyGoal />
      </div>
      
      <div className="flex flex-col flex-1 pb-[100px]">
        {units.map((unit) => (
          <Unit key={unit.id} unit={unit} />
        ))}
        {units.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            <p className="font-bold text-lg mb-2">No units found.</p>
            <p>Please ensure the FastAPI backend is running on port 8000 and you have run the seed script!</p>
          </div>
        )}
      </div>
    </div>
  )
}
