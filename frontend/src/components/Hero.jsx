import React from 'react'
import { useNavigate } from 'react-router-dom';


const Hero = () => {
    
    const navigate = useNavigate();
  return (
     <div className="text-center mb-10 px-6 py-16 bg-gradient-to-b">
      <h1 className="text-gray-900 text-4xl md:text-5xl font-bold mb-6">
        "Because your health deserves a comeback."
      </h1>
      <h2 className="text-gray-600 text-lg md:text-2xl font-semibold max-w-2xl mx-auto leading-relaxed">
  QuitTrack helps you <span className="text-green-600 font-bold">quit smoking</span> step by step.  
  Log your daily habits, track your progress, and see how your <span className="text-green-600 font-bold">health improves</span> over time.
</h2>

       <div className='flex justify-center items-center gap-6 my-6 mb-8'>
        <button 
         onClick={() => navigate("/login")} 
         className="w-32 px-6 py-3 rounded-md text-sm bg-amber-400 hover:bg-amber-500 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-400">
         Log in
        </button>

        <button 
        onClick={() => navigate("/signup")}
        className="w-32 px-6 py-3 rounded-md bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-green-700 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-500">Sign up</button>
       </div>
    </div>
  )
}

export default Hero
