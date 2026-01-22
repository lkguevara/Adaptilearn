
const Badge = ({ text }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border-2 border-primary-500 rounded-full px-4 md:px-6 py-2 flex items-center gap-2 shadow-[0px_4px_6px_0px_rgba(36,120,129,0.3)] w-56 mx-auto justify-center cursor-pointer animate-tilt hover:animate-pulse">
        <span className="text-xl md:text-2xl">✨</span>
        <span className="font-['VT323'] text-primary-500 text-base md:text-lg">{text}</span>
    </div>
  )
}

export default Badge