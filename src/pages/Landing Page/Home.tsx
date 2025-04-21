import React from 'react'
import Hero from '../../components/LandingPage/Home/Hero'
import WhereWeCanWork from '../../components/LandingPage/Home/WhereWeCanWork'
import Agents from '../../components/LandingPage/Home/Agents'
import HowItWorks from '../../components/LandingPage/Home/HowItWorks'
import Artisans from '../../components/LandingPage/Home/Artisans'
import Testimonials from '../../components/LandingPage/Home/Testimonials'
import Footer from '../../components/LandingPage/Home/Footer'

const Home = () => {
  return (
    <div>
        <Hero/>
        <WhereWeCanWork/>
        <Agents/>
        <HowItWorks/>
        <Artisans/>
        <Testimonials/>
        <Footer/>
        </div>
  )
}

export default Home