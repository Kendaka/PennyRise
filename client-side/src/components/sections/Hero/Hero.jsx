import React from "react";
import heroImage from "../../../assets/images/icon.png";
import SlidingButton from "../../common/SlidingButton";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();
    
    return (
        <section className="flex flex-col md:flex-row items-center justify-center md:justify-between lg:justify-around py-10">
            <div className="flex items-center justify-center md:w-1/2 md:mt-24 lg:w-2/5 lg:mt-8">
                <img
                    src={heroImage}
                    alt="Hero Illustration"
                    className="w-full max-w-xs md:max-w-md lg:max-w-xl lg:mt-0 md:mt-0"
                />
            </div>
            <div className="flex flex-col py-4 items-center md:w-1/2 md:justify-center md:mt-20 lg:w-3/5 lg:mt-10 md:pl-10 lg:pl-6">
                <p className="mb-2 font-montserrat font-bold text-text text-3xl md:text-4xl md:text-start md:ml-8 md:mb-4 md:mt-4 lg:text-5xl lg:text-start lg:mt-0 lg:ml-0">Every Penny Counts.</p>
                <p className="font-montserrat font-bold text-text text-3xl md:text-4xl md:mb-4 md:text-start md:ml-8 md:mt-4 lg:text-5xl lg:ml-10 lg:mt-0">Every Rise Matters.</p>
                <p className="mt-8 font-roboto text-text text-xl md:text-xl lg:text-2xl text-center md:text-center">Transform your finances with <span className="font-bold">Prise!</span> Every penny works smarter to bring your goals within reach.</p>
                <div className="flex flex-col items-center justify-center mt-8 md:w-full md:items-center">
                    <SlidingButton text="Get Started" onClick={() => navigate('/login')} />
                </div>
            </div>
        </section>
    )
}

export default Hero;