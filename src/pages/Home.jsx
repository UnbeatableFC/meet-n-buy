import React from 'react'
import Navbar from '../components/general/Navbar'
import Hero from '../features/homepage/Hero'

const Home = () => {
  return (
    <div className='w-full'>
        <Navbar />
        <Hero />
    </div>
  )
}

export default Home