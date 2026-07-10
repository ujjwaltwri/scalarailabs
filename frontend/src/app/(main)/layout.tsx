import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { BottomBar } from "@/components/BottomBar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] bg-white dark:bg-[#18252a] text-slate-900 dark:text-slate-100">
      <TopBar className="lg:hidden" />
      <Sidebar className="hidden lg:flex" />
      <main className="flex-1 lg:pl-[256px] pt-[50px] lg:pt-0 h-[100dvh] overflow-y-auto pb-[70px] lg:pb-0">
        <div className="max-w-[1056px] mx-auto h-full">
          {children}
        </div>
      </main>
      <BottomBar className="lg:hidden" />
    </div>
  )
}
