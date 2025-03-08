import {
    Bell,
    Box,
    ChevronDown,
    Grid,
    Maximize,
    Search,
    Users,
    BarChart2,
    Target,
  } from "lucide-react"

  
const Header = () => {
  return (
    <header className="bg-transparent text-white p-4 flex items-center justify-between">
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <div className="bg-teal-500 rounded-full p-2">
          <div className="h-5 w-5 text-black">
            <Target className="h-5 w-5" />
          </div>
        </div>
        <span className="font-semibold text-lg">Company</span>
      </div>
      <button className="p-2">
        <Grid className="h-5 w-5" />
      </button>
      <button className="bg-zinc-800 rounded-full py-2 px-4 flex items-center space-x-2">
        <Box className="h-5 w-5" />
        <span>Tracking</span>
      </button>
    </div>

    <div className="sm:flex hidden items-center space-x-4">
      <button className="p-2">
        <Box className="h-5 w-5" />
      </button>
      <button className="p-2">
        <Users className="h-5 w-5" />
      </button>
      <button className="p-2">
        <BarChart2 className="h-5 w-5" />
      </button>
      <button className="p-2">
        <Maximize className="h-5 w-5" />
      </button>
      <button className="p-2">
        <Search className="h-5 w-5" />
      </button>
      <div className="relative">
        <button className="p-2">
          <Bell className="h-5 w-5" />
        </button>
        <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
      </div>
      <div className="flex items-center space-x-2">
        <div>
          <img src="https://avatar.iran.liara.run/public/16" className="size-[40px] object-cover" alt="User" />
          
        </div>
        <div className="flex flex-col text-sm">
          <span className="font-medium">Amit Trivedi</span>
          <span className="text-gray-400 text-xs">Admin</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  </header>
  )
}

export default Header