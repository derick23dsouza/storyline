"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/container/Container";
import { signOut, useSession } from "@/lib/auth-client";

export default function Hero() {
    const { data: session, isPending } = useSession();
    return (
        <section className="flex items-center justify-center min-h-[90vh] bg-gradient-to-b from-black via-zinc-950 to-black">
            <Container className="flex flex-col-reverse md:flex-row items-center justify-between py-12">
                {/* Left Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left space-y-6 mt-10 md:mt-0">
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        Discover, Discuss, and Dive Into <span className="text-lime-300"> Stories That Inspire</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300">
                        Find your next favorite read, connect with readers worldwide, and track your literary journey — all in one place.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-8 mx-auto sm:mx-0 flex flex-row sm:flex-row gap-4">
                        {
                            session ? (<>
                                <Link
                                    href="/discover"
                                    className="px-8 py-3 text-lg rounded-full border border-lime-300 text-lime-300 hover:bg-lime-300 hover:text-black transition font-medium"
                                >
                                    Discover new books!
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="px-8 py-3 text-lg rounded-full bg-blue-950 text-white hover:bg-blue-900 transition font-medium"
                                >
                                    Your library
                                </Link>
                            </>) : (<>
                                <Link
                                    href="/login"
                                    className="px-8 py-3 text-lg rounded-full border border-lime-300 text-lime-300 hover:bg-lime-300 hover:text-black transition font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-8 py-3 text-lg rounded-full bg-blue-950 text-white hover:bg-blue-900 transition font-medium"
                                >
                                    Sign Up
                                </Link>
                            </>)
                        }

                    </div>
                </div>

                {/* Right Image */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-4 sm:mt-0">
                    <div className="relative w-[80%] max-w-md md:max-w-lg lg:max-w-xl aspect-square">
                        <Image
                            src="/images/HeroImage.png"
                            alt="Minimalist Reader Illustration"
                            fill
                            className="object-contain drop-shadow-lg"
                            priority
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}
