import React from 'react'
import Hero from '../../components/LandingPage/Artisans/Hero'
import JobCategories from '../../components/LandingPage/Artisans/JobCategories'
import SubscriptionPlans from '../../components/LandingPage/Artisans/SubscriptionPlans'
import EmployeeList from '../../components/LandingPage/Artisans/EmployeeList'
import Footer from '../../components/LandingPage/Home/Footer'

const Artisans = () => {
  return (
    <div>
        <Hero/>
        <JobCategories/>
        <SubscriptionPlans/>
        <EmployeeList/>
        <Footer/>
    </div>
  )
}

export default Artisans