
import Button from '../ui/Button'
import { Search } from 'lucide-react';

const SearchRoadmap = () => {
  return (
    <section className="max-w-2xl mx-auto h-14 relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden flex justify-between items-center px-6">
        <div className="flex items-center gap-4 w-full">
            <Search color='gray'/>
            <input 
                type="text" 
                placeholder="Busca un tema para aprender..." 
                className="text-md text-gray-500 font-primary font-medium w-full h-full outline-none"
            />
         </div>
        <Button className="mr-2 font-secondary">
            Buscar
        </Button>
    </section>
  )
}

export default SearchRoadmap