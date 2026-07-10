import { UnitType } from "./page"
import { SkillNode } from "./SkillNode"

type Props = {
  unit: UnitType
}

export const Unit = ({ unit }: Props) => {
  return (
    <div className="flex flex-col mb-10">
      <div className="bg-[#58cc02] rounded-2xl p-6 text-white mb-6 flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h2 className="text-2xl font-extrabold">{unit.title}</h2>
          <p className="text-lg font-bold opacity-90">{unit.description}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-y-8 mt-4">
        {unit.skills.map((skill, index) => {
          // Creating a snake-like path layout
          const isRight = index % 2 === 0;
          const xOffset = isRight ? (index % 4 === 0 ? 0 : 40) : -40;

          return (
            <div key={skill.id} style={{ transform: `translateX(${xOffset}px)` }}>
              <SkillNode skill={skill} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
