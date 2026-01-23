'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Input from '@/src/components/ui/Input'
import { useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/src/lib/utils'
import { registerUser } from '@/src/apis/auth.api'
import { RegisterFormData, registerSchema } from '../schemas/register.schema'
import { useRouter } from 'next/navigation'
import { handleAxiosError } from '@/src/apis/utils/handleAxiosError'
import { Button, LoadingButton } from '@/src/components/ui/button'

export default function SignUp() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(
            registerSchema
        )
    })
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [isConfirmPassVisible, setIsConfirmPassVisible] = useState<boolean>(false)
    const [withEmail, setWithEmail] = useState<boolean>(false)

    const submit: SubmitHandler<RegisterFormData> = async (data) => {
        setLoading(true)
        try {
            const { email, password } = data
            await registerUser({ email, password })

            router.push('/auth/login')

            reset()
        } catch (err: unknown) {
            handleAxiosError(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full flex flex-col items-center'>
            <h1 className='text-3xl font-semibold mb-7'>Register Now</h1>
            <div
                className="w-full flex flex-col items-center justify-center bg-white rounded-xl p-3 py-10 max-w-110 border border-gray-300">

                <button
                    type='button'
                    onClick={() => window.location.href = '/api/auth/google'}
                    aria-label='Sign in with Google'
                    className={cn('text-sm border rounded-lg w-full',
                        'max-w-90 px-3 py-1.5 cursor-pointer',
                        'flex justify-center items-center gap-3',
                        withEmail ?
                            'bg-gray-50 border-gray-300 hover:bg-gray-100' :
                            'bg-black text-white border-black hover:bg-gray-800'
                    )}>
                    <Image
                        src='/google-logo.svg'
                        alt='google-logo'
                        width={15}
                        height={15}
                    />
                    <span className=''>Continue with Google</span>
                </button>

                <div className='flex items-center my-6 max-w-90 w-full'>
                    <div className='grow border-t border-gray-300 w-full' />
                    <span className='text-sm text-gray-500 px-1'>or</span>
                    <div className='grow border-t border-gray-300 w-full' />
                </div>

                {withEmail ?
                    <form
                        className="w-full flex flex-col space-y-5 max-w-90"
                        onSubmit={handleSubmit(submit)}>
                        <Input
                            label='Email Address'
                            placeholder="e.g., xyz@gmail.com"
                            type="email"
                            errors={errors.email}
                            aria-invalid={!!errors.email}
                            aria-describedby='email-error'
                            {...register('email')}
                        />

                        <div className='relative'>
                            <button
                                type='button'
                                aria-label="Toggle password visibility"
                                className='absolute right-3 top-7'
                                onClick={() => setIsPasswordVisible(prev => !prev)}>
                                {isPasswordVisible ?
                                    <EyeClosed size={16}
                                        className='' /> :
                                    <Eye size={16}
                                        className='' />
                                }
                            </button>

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

                        <div className='relative'>
                            <button
                                type='button'
                                aria-label="Toggle password visibility"
                                className='absolute right-3 top-7'
                                onClick={() => setIsConfirmPassVisible(prev => !prev)}>
                                {isConfirmPassVisible ?
                                    <EyeClosed size={16}
                                        className='' /> :
                                    <Eye size={16}
                                        className='' />
                                }
                            </button>

                            <Input
                                label='Confirm Password'
                                type={isConfirmPassVisible ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                errors={errors.confirmPassword}
                                aria-invalid={!!errors.confirmPassword}
                                aria-describedby='password-error'
                                {...register('confirmPassword')}
                            />
                        </div>

                        {
                            loading ?
                                <LoadingButton /> :
                                <Button
                                    type="submit"
                                />
                        }
                    </form> :

                    <button
                        type='button'
                        onClick={() => setWithEmail(true)}
                        aria-label='Sign in with Email'
                        className='text-sm border border-gray-300 rounded-lg w-full max-w-90 px-3 py-1.5 bg-gray-50 cursor-pointer hover:bg-gray-100'>
                        Continue with Email
                    </button>
                }

            </div>
            <p className='mt-4 text-sm text-center'>Already registered? <Link href='login' className="cursor-pointer font-semibold hover:text-gray-700">Login</Link></p>
        </div>
    )
}

