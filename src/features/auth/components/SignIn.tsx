'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link.js'
import Input from '@/components/ui/Input'
import Image from 'next/image'
import { Eye, EyeClosed } from 'lucide-react'
import { loginUser } from '@/apis/auth.api'
import { handleAxiosError } from '@/apis/utils/handleAxiosError'
import toast from 'react-hot-toast'
import { LoginFormData, loginSchema } from '../schemas/login.schema'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { Button, LoadingButton } from '@/components/ui/button'

export default function SignIn() {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    const submit: SubmitHandler<LoginFormData> = async (data) => {
        setLoading(true)
        try {
            const result = await loginUser(data)

            toast.success('Logged in successfully')

            router.push('/shop/dashboard')

            reset()
        } catch (err: unknown) {
            handleAxiosError(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full flex flex-col items-center'>
            <h1 className='text-3xl font-semibold mb-7'>Welcome Back</h1>
            <div
                className="flex flex-col items-center justify-center bg-white rounded-xl p-3 py-10 w-full max-w-110 border border-gray-300">

                <button
                    type='button'
                    onClick={() => window.location.href = '/api/auth/google'}
                    aria-label='Sign in with Google'
                    className='text-sm border border-gray-300 rounded-lg w-full max-w-90 px-3 py-1.5 bg-gray-50 cursor-pointer hover:bg-gray-100 flex justify-center items-center gap-3'>
                    <Image
                        src='/google-logo.svg'
                        alt='google-logo'
                        width={15}
                        height={15}
                    />
                    <span className=''>Sign in with Google</span>
                </button>

                <div className='flex items-center my-6 max-w-90 w-full'>
                    <div className='grow border-t border-gray-300 w-full' />
                    <span className='text-sm text-gray-500 px-1'>or</span>
                    <div className='grow border-t border-gray-300 w-full' />
                </div>

                <form
                    className="w-full flex flex-col space-y-6 max-w-90"
                    onSubmit={handleSubmit(submit)}>
                    <div className='flex flex-col space-y-6'>
                        <Input
                            label='Email Address'
                            type="email"
                            placeholder="e.g., xyz@gmail.com"
                            errors={errors.email}
                            aria-invalid={!!errors.email}
                            aria-describedby='email-error'
                            {...register('email')}
                        />

                        <div className='relative'>
                            <div className='absolute right-3 top-7'
                                onClick={() => setIsPasswordVisible(prev => !prev)}>
                                {isPasswordVisible ?
                                    <EyeClosed size={16}
                                        className='' /> :
                                    <Eye size={16}
                                        className='' />
                                }
                            </div>

                            <Input
                                label='Password'
                                type={isPasswordVisible ? 'text' : 'password'}
                                placeholder="Enter your password"
                                errors={errors.password}
                                aria-invalid={!!errors.password}
                                aria-describedby='password-error'
                                {...register('password')}
                            />
                        </div>
                        <p className="cursor-pointer -mt-6 text-right text-sm hover:text-gray-700">Forgot?</p>
                    </div>
                    {
                        loading ?
                            <LoadingButton /> :
                            <Button
                                type="submit"
                            />
                    }
                </form>
            </div>
            <p className='mt-4 text-sm text-center'>Don't have an account? <Link href='register' className="cursor-pointer font-semibold hover:text-gray-700">Register now</Link></p>
        </div>
    )
}

