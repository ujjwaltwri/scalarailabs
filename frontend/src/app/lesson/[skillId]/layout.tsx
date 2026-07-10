export default function LessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-white">
      {children}
    </div>
  )
}
