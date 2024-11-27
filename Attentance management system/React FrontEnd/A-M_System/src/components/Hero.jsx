import React from 'react'

const Hero = () => {
  return (
    <>
    <div className="relative h-screen bg-cover">
       {/* Video background */}
       <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      >
        <source
          src="/src/assets/images/video.mp4"
          type="video/mp4"
        />
      </video>
    </div>
    </>
  )
}

export default Hero