import React from 'react'
import Hero from '../../components/LandingPage/About/Hero'
import Cards from '../../components/LandingPage/About/Cards'
import Founder from '../../components/LandingPage/About/Founder'
import Footer from '../../components/LandingPage/Home/Footer'
import CoreValues from '../../components/LandingPage/About/CoreValues'

const About = () => {
  return (
    <div>
        <Hero/>
        <Cards/>
        <Founder/>
        <CoreValues/>
        <Footer/>
    </div>
  )
}

export default About