import Badge from '../layout/Badge.jsx';
import SearchRoadmap from './Search.jsx';

const Hero = () => {
  return (
    <section className="bg-linear-to-b from-violet-400/30 via-blue-400/30 to-amber-400/20 text-center p-4 md:p-12 space-y-6 md:space-y-8 mb-6">
        <Badge text="Aprendizaje con IA" />

        <article className="container mx-auto space-y-3 md:space-y-5">
          <h1 className="font-accent text-4xl md:text-6xl lg:text-7xl text-secondary-500 font-bold">Aprende lo que quieras</h1>
          <h2 className='font-accent text-3xl md:text-5xl lg:text-6xl text-primary-500 font-bold'>a tu ritmo</h2>
          <p className='font-secondary text-secondary-300 text-lg md:text-xl lg:text-2xl font-light'>Nuestra IA te ayuda a crear y seguir rutas de aprendizaje personalizadas para alcanzar tus objetivos.</p>
        </article>

        <SearchRoadmap />
    </section>
  )
}

export default Hero