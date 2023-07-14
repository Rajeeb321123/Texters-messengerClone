'use client';


import { useCallback, useEffect, useState } from "react";
import {
    useForm,
    FieldValues,
    SubmitHandler
} from "react-hook-form";
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { FaFacebookSquare } from 'react-icons/fa'
import axios from "axios";
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import Image from "next/image";
import Logo from "./Logo";
import Loader from "@/app/components/Loader";


type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {

    // The useSession() React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.
    const session = useSession();
    const router = useRouter();

    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    // for going to users page after authenticated
    useEffect(() => {
        if (session?.status === 'authenticated') {
            console.log('Authenticated');
            router.push('/users');
        }
    }, [session, session?.status, router]);

    // toggle betwen login and register form
    const toggleVairant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER')
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        // destructure the formstate to get error because we only need error only
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });

    // for submitting the form
    // data is props
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === 'REGISTER') {
            // Axios Register
            axios.post('/api/register', data)
                // .then  is used we are immediately logged in after signed In
                .then(() => signIn('credentials', data))
                .catch(() => toast.error("Registration error"))
                .finally(() => setIsLoading(false));
        };

        if (variant === 'LOGIN') {
            // NEXT AUTH SIGN IN 
            signIn('credentials', {
                ...data,
                // we setting redirect to false to to use .then below
                redirect: false,
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error('Invalid credentials');
                    };

                    if (callback?.ok && !callback?.error) {
                        toast.success('Logged in!');
                        router.push('/users');
                    }
                })
                .finally(() => setIsLoading(false));
        };
    };

    // for social Sign In using github and google
    const socialAction = (action: string) => {
        setIsLoading(true);

        // NEXT AUTH social sign in
        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials');
                };

                if (callback?.ok && !callback?.error) {
                    toast.success('Logged in!');
                }
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <>



            <div
                className="
                    flex 
                    min-h-full 
                    flex-col 
                    justify-center 
                    py-6 
                    sm:px-6 
                    lg:px-8 
                    bg-fixed
                    bg-cover
                "

            >
                {session?.status === 'loading' ? (
                   <Loader />
                ) : (
                    <>

                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="flex">
                                <Logo
                                    size={60}
                                />
                            </div>
                            <h2
                                className="
                                mt-6
                                text-center
                                text-3xl
                                font-bold
                                tracking-tight
                                text-gray-300
                            "
                            >
                                Sign in to your account
                            </h2>
                        </div>
                        <div
                            className="
                            mt-8 
                            sm:mx-auto 
                            sm:w-full 
                            sm:max-w-md 
                        "
                        >

                            <div
                                // I added empty onCLick just for shine effect on touch on mobile device
                                onClick={() => { }}
                                className="
                                    px-4
                                    py-8
                                    text-white
                                    shadow
                                    sm:rounded-lg
                                    sm:px-10
                                    sm:border-2
                                    bg-[linear-gradient(45deg,transparent_25%,white_10%,transparent_75%,transparent_80%)]
                                    bg-[length:250%_250%,100%_100%] 
                                    bg-[position:-100%_0,0_0] bg-no-repeat   
                                    hover:bg-[position:200%_0,0_0] 
                                    hover:duration-[1500ms]
                                "
                            >
                                <form
                                    className=" space-y-6 "
                                    // handleSubmit is from react form and onSubmit is out submit funcion
                                    // handleSubmit is automatically going to pass the data to on Submit
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    {variant === 'REGISTER' && (
                                        <Input
                                            id="name"
                                            label="name"
                                            register={register}
                                            errors={errors}
                                            disabled={isLoading}
                                        />
                                    )}
                                    <Input
                                        id="email"
                                        label="Email Address"
                                        type="email"
                                        register={register}
                                        errors={errors}
                                        disabled={isLoading}
                                    />
                                    <Input
                                        id="password"
                                        label="Password"
                                        type="password"
                                        register={register}
                                        errors={errors}
                                        disabled={isLoading}
                                    />
                                    <div>
                                        <Button
                                            disabled={isLoading}
                                            fullwidth
                                            // type submit will make this button submit the form or trigger onSubmit of form
                                            type="submit"
                                        >
                                            {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-6">
                                    <div className="relative">
                                        <div
                                            className="
                                            absolute
                                            inset-0
                                            flex
                                            items-center
                                        "
                                        >
                                        </div>
                                        <div
                                            className="
                                            relative 
                                            flex 
                                            justify-center 
                                            text-sm
                                            items-center
                                        "
                                        >
                                            {/* line */}
                                            <div
                                                className="
                                                w-full
                                                border-t
                                                border-gray-300
                                            "
                                            />
                                            <span
                                                className="
                                                bg-white/0
                                                whitespace-nowrap
                                                px-2 
                                                text-gray-300
                                            "
                                            >
                                                Or continue with
                                            </span>
                                            {/* line */}
                                            <div className="w-full
                                            border-t
                                            border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <AuthSocialButton
                                            disabled={isLoading}
                                            icon={BsGithub}
                                            onClick={() => socialAction('github')}
                                        />
                                        <AuthSocialButton
                                            disabled={isLoading}
                                            icon={FaFacebookSquare}
                                            onClick={() => socialAction('facebook')}
                                        />
                                        <AuthSocialButton
                                            disabled={isLoading}
                                            icon={BsGoogle}
                                            onClick={() => socialAction('google')}
                                        />
                                    </div>

                                    <div
                                        className="
                                        flex
                                        gap-2
                                        justify-center
                                        text-sm
                                        mt-6
                                        px-2
                                        text-gray-300
                                    "
                                    >
                                        <div>
                                            {variant === 'LOGIN' ? "New to Texters?" : 'Already have an account?'}
                                        </div>
                                        <div
                                            onClick={toggleVairant}
                                            className="underline cursor-pointer animate-[pointer_400ms_infinite]"
                                        >
                                            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </>
    )
}

export default AuthForm;