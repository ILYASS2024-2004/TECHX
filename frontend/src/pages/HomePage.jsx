import React from 'react'
import HeroSection from '../components/home/HeroSection'
import DropNow from '../components/home/DropNow'
import BestSellers from '../components/home/BestSellers'
//import HorizontalScroll from '../components/home/3d/HorizontalScroll'
import Footer from '../components/Footer'
import HorizontalScrollo from '../components/home/3d/HorizontalScrollo'
import TransicBack from '../components/home/TransicBack'


const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <DropNow></DropNow>
      <BestSellers></BestSellers>
      {/* <HorizontalScroll></HorizontalScroll> */}
      <HorizontalScrollo></HorizontalScrollo>
      {/* <div className='h-[50vh] bg-[#f1f1f1]'></div> */}
      <TransicBack></TransicBack>
      <Footer />
      
  
    </div>
    
  )
    
}

export default HomePage