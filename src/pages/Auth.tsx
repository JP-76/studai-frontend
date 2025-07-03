import { useState } from 'react';
import {
    IoPersonAddOutline,
    IoLogInOutline,
    IoPerson,
    IoLockClosed,
    IoEyeOutline,
    IoEyeOffOutline
} from "react-icons/io5";

import type { LoginRequest } from '../types/login-request';
import type { RegisterRequest } from '../types/register-request';

import api from '../lib/axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showTerms, setShowTerms] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [loginUserOrEmail, setLoginUserOrEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const [usernameTouched, setUsernameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

    const navigate = useNavigate()

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        if (value.trim().length > 0) setUsernameTouched(true);
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (value.trim().length > 0) setEmailTouched(true);
    };

    const validatePassword = (value: string) => ({
        length: value.length >= 8,
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        uppercase: /[A-Z]/.test(value),
    });

    const validateEmail = (value: string) => {
        if (!value) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const validateUsername = (value: string) => {
        if (!value) return false;
        return value.trim().length > 3;
    };

    const pwd = validatePassword(password);
    const allValid = Object.values(pwd).every(Boolean);
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);

    // Clear all fields when switching form
    const toggleForm = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setEmail('');
        setLoginUserOrEmail('');
        setPassword('');
        setShowPassword(false);
        setAcceptedTerms(false);
        setUsernameTouched(false);
        setEmailTouched(false);
    };

    const isLoginEnabled = loginUserOrEmail.trim().length > 0 && password.trim().length > 0;
    const isRegisterEnabled = isUsernameValid && isEmailValid && allValid && acceptedTerms;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            login({ login: loginUserOrEmail, password: password });
        } else {
            register({
                username: username,
                email: email,
                password: password,
                role: 'STUDENT' // Default role, can be changed later
            });
        }
    };

    const login = async (body: LoginRequest) => {
        try {
            const response = await api.post('/v1/login', body);

            if (response.status === 200) {
                const token: string = response.data;

                // Store the token in cookies using js-cookie
                // Set the cookie with a 7-day expiration, sameSite, and secure attributes
                Cookies.set('auth_token', token, {
                    expires: 7,
                    sameSite: 'Strict',
                    secure: window.location.protocol === 'https:',
                });

                toast.success('Login successful!');
                navigate('/');
            } else {
                toast.error('Invalid credentials. Please try again.');
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error('Incorrect username or password.');
            } else {
                toast.error('Something went wrong. Please try again later.');
            }
        }
    };

    const register = async (body: RegisterRequest) => {
        try {
            const response = await api.post('/v1/register', body);

            if (response.status === 200) {
                toast.success('Registration successful! You can now log in.');
                toggleForm();
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } catch (error: any) {
            if (error.response?.status === 400) {
                toast.error('Invalid registration data. Please check your inputs.');
            } else {
                toast.error('Something went wrong. Please try again later.');
            }
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
                <div className="border-b border-dashed border-base-300">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            {isLogin ? (
                                <>
                                    <IoLogInOutline className='text-xl' />
                                    Welcome back
                                </>
                            ) : (
                                <>
                                    <IoPersonAddOutline className='text-xl' />
                                    Create new account
                                </>
                            )}
                        </div>
                        <button onClick={toggleForm} className="link text-xs">
                            {isLogin ? 'Register' : 'Login'}
                        </button>
                    </div>
                </div>

                <form className="card-body gap-4" onSubmit={handleFormSubmit}>
                    {!isLogin ? (
                        <p className="text-xs opacity-60">Registration is free and only takes a minute</p>
                    ) : (
                        <p className="text-xs opacity-60">Please enter your credentials to login</p>
                    )}

                    {isLogin ? (
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <IoPerson className='opacity-70' />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Username or Email"
                                value={loginUserOrEmail}
                                onChange={(e) => setLoginUserOrEmail(e.target.value)}
                            />
                        </label>
                    ) : (
                        <>
                            <div className='flex flex-col gap-1'>
                                <label className="input input-bordered flex items-center gap-2 w-full">
                                    <IoPerson className='opacity-70' />
                                    <input
                                        type="text"
                                        className="grow"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => handleUsernameChange(e.target.value)}
                                    />
                                </label>
                                {usernameTouched && !isUsernameValid && (
                                    <span className="text-error text-xs">Username must be longer than 3 characters</span>
                                )}
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className="input input-bordered flex items-center gap-2 w-full">

                                    <IoPerson className='opacity-70' />
                                    <input
                                        type="email"
                                        className="grow"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => handleEmailChange(e.target.value)}
                                    />

                                </label>
                                {emailTouched && !isEmailValid && (
                                    <span className="text-error text-xs">Please enter a valid email address</span>
                                )}
                            </div>
                        </>
                    )}

                    <div className="flex flex-col gap-1 relative">
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <IoLockClosed className='opacity-70' />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="grow w-full"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <IoEyeOffOutline className="text-lg opacity-70" />
                                ) : (
                                    <IoEyeOutline className="text-lg opacity-70" />
                                )}
                            </button>
                        </label>

                        {!isLogin && (
                            <div className="text-base-content/60 px-1 text-[0.6875rem] grid grid-cols-2 flex-wrap">
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span
                                        className={`status inline-block ${pwd.uppercase ? 'status-success' : 'status-error'}`}
                                    />
                                    At least one uppercase letter
                                </div>
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span
                                        className={`status inline-block ${pwd.special ? 'status-success' : 'status-error'}`}
                                    />
                                    At least one special character
                                </div>
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span
                                        className={`status inline-block ${pwd.number ? 'status-success' : 'status-error'}`}
                                    />
                                    At least one number
                                </div>
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span
                                        className={`status inline-block ${pwd.length ? 'status-success' : 'status-error'}`}
                                    />
                                    At least 8 characters
                                </div>
                            </div>
                        )}
                    </div>

                    {!isLogin && (
                        <label className="text-base-content/60 flex items-center gap-2 text-xs">
                            <input
                                type="checkbox"
                                className="toggle toggle-xs"
                                checked={acceptedTerms}
                                onChange={e => setAcceptedTerms(e.target.checked)}
                            />
                            <span>
                                Accept{' '}
                                <button
                                    type="button"
                                    onClick={() => setShowTerms(true)}
                                    className="link link-hover inline underline"
                                >
                                    Terms of Service
                                </button>
                            </span>
                        </label>
                    )}

                    <div className="card-actions mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isLogin ? !isLoginEnabled : !isRegisterEnabled}
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </div>
                </form>

                {/* Terms Modal */}
                {showTerms && (
                    <dialog open className="modal modal-open">
                        <div className="modal-box max-w-6xl max-h-11/12 m-16">
                            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                            <p className="text-sm text-gray-500 mb-8">Last updated: July 3, 2025</p>

                            <section className="space-y-6">
                                <p>
                                    Welcome to <strong>StudAI</strong> — a platform that uses artificial intelligence to help users generate quizzes for educational and self-assessment purposes.
                                </p>
                                <p>
                                    By accessing or using StudAI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                                </p>

                                <div>
                                    <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of the Service</h2>
                                    <p>
                                        StudAI provides quiz generation services powered by artificial intelligence. You may use the platform to create, view, and interact with quizzes for personal, educational, or non-commercial use.
                                    </p>
                                    <p>You agree not to use the service for any unlawful, harmful, or abusive purposes.</p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mt-8 mb-2">2. AI-Generated Content Disclaimer</h2>
                                    <p>
                                        The quizzes, answers, and explanations generated by StudAI are produced by artificial intelligence. While we strive to ensure accuracy and usefulness, the content may sometimes be:
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                        <li>Incorrect,</li>
                                        <li>Misleading,</li>
                                        <li>Outdated,</li>
                                        <li>Or inappropriate for your specific educational needs.</li>
                                    </ul>
                                    <p className="mt-2">
                                        <strong>You are solely responsible</strong> for verifying the accuracy and appropriateness of the content before using it in any educational or professional context.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mt-8 mb-2">3. No Guarantee of Accuracy</h2>
                                    <p>
                                        We do not guarantee the correctness, completeness, or reliability of any AI-generated content. StudAI and its contributors shall not be held liable for any errors or decisions made based on the information provided by the platform.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mt-8 mb-2">4. User Accounts</h2>
                                    <p>
                                        To access certain features, you may need to register and create an account. You are responsible for maintaining the confidentiality of your credentials and for any activity under your account.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mt-8 mb-2">5. Intellectual Property</h2>
                                    <p>
                                        All original content and software provided by StudAI, excluding AI-generated content derived from user input, is the property of the platform and its developers.
                                        You may not copy, reproduce, or redistribute any part of the service without explicit permission.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mt-8 mb-2">6. Changes to the Terms</h2>
                                    <p>
                                        We may update these Terms from time to time. Continued use of StudAI after changes constitutes your acceptance of the new Terms.
                                        You are encouraged to review them periodically.
                                    </p>
                                </div>
                            </section>
                            <div className="modal-action">
                                <button className="btn" onClick={() => setShowTerms(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </dialog>
                )}
            </div>
        </main>
    );
};

export default AuthPage;
