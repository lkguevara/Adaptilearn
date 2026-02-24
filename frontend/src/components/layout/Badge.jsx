
import { Sparkles } from "lucide-react";
import "./index.css"

const Badge = ({ text }) => {
  return (
    <div className="gradient-border-secondary rounded-full px-6 md:px-8 py-3 flex items-center gap-3 w-fit min-w-56 mx-auto justify-center cursor-pointer animate-tilt hover:animate-pulse">
        <Sparkles className="h-6 w-6 text-secondary" />
        <span className="font-accent text-secondary text-lg md:text-xl">{text}</span>
    </div>
  )
}

export default Badge
