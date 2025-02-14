import { Metadata } from "next";
import Image from 'next/image';

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about our team and what we do.",
};

export default function AboutPage() {
    return (
        <div className="md:p-8 p-4">
            <div className="md:py-7 py-4 mx-auto">
                <h1 className="text-5xl md:text-9xl md:pt-5 text-center md:text-left md:pl-8 lg:pl-16">
                    About Us
                </h1>
                <p className="text-lg md:text-1xl text-gray-600 text-center md:text-left mt-4 md:mt-0 p-4 md:p-0 md:pl-8 lg:pl-16">
                    We are a team of developers working to make the world a better place.
                </p>
            </div>
            <div className="mt-8">
                <h2 className="text-3xl md:text-5xl text-center">
                    Team
                </h2>
                <div className="flex flex-wrap justify-center items-center">
                    <div className="p-4 md:p-6">
                        <Image
                            src="/nathan_profile_picture.jpeg"
                            alt="Nathan profile picture"
                            width={172}
                            height={172}
                            className="rounded-full object-cover"
                        />
                        <p className="text-center mt-2">Nathan</p>
                    </div>
                    <div className="p-4 md:p-6">
                        <Image
                            src="/leonora_profile_picture.jpeg"
                            alt="Leonora profile picture"
                            width={172}
                            height={172}
                            className="rounded-full object-cover"
                        />
                        <p className="text-center mt-2">Leonora</p>
                    </div>
                    <div className="p-4 md:p-6">
                        <Image
                            src="/alma_profile_picture.jpeg"
                            alt="Alma profile picture"
                            width={172}
                            height={172}
                            className="rounded-full object-cover"
                        />
                        <p className="text-center mt-2">Alma</p>
                    </div>
                    <div className="p-4 md:p-6">
                        <Image
                            src="/mouhamed_profile_picture.jpeg"
                            alt="Mouhamed profile picture"
                            width={172}
                            height={172}
                            className="rounded-full object-cover"
                        />
                        <p className="text-center mt-2">Mouhamed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}