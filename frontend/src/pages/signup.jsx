import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, Globe, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Signup() {
    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSignup(e) {
        e.preventDefault();

        try {
            setError("");
            await signup(email, password);
            navigate("/dashboard");
        } catch {
            setError("Signup failed. Try a stronger password.");
        }
    }

    async function handleGoogleSignup() {
        try {
            setError("");
            await loginWithGoogle();
            navigate("/dashboard");
        } catch {
            setError("Google signup failed");
        }
    }

    return (
        <div className="min-h-screen bg-[#f7fbf4] grid lg:grid-cols-2">
            <div className="hidden lg:flex bg-[#102015] text-white p-12 flex-col justify-between">
                <Link to="/" className="flex items-center gap-2 font-black text-2xl">
                    <Leaf className="text-green-400" />
                    CarbonCoach IQ
                </Link>

                <div>
                    <h1 className="text-5xl font-black leading-tight">
                        Start reducing your carbon footprint today.
                    </h1>
                    <p className="text-gray-300 mt-5 text-lg">
                        Join CarbonCoach IQ and get your personal AI carbon coach.
                    </p>
                </div>

                <div className="bg-white/10 rounded-[2rem] p-6">
                    <p className="text-green-300 font-black">What you get</p>
                    <ul className="mt-4 space-y-3 text-gray-300">
                        <li>✓ Daily carbon tracking</li>
                        <li>✓ AI-powered reduction tips</li>
                        <li>✓ Progress dashboard</li>
                        <li>✓ Habit goals and insights</li>
                    </ul>
                </div>
            </div>

            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-green-100">
                    <div className="lg:hidden flex items-center gap-2 font-black text-2xl mb-8">
                        <Leaf className="text-green-600" />
                        CarbonCoach IQ
                    </div>

                    <h2 className="text-4xl font-black">Create Account</h2>
                    <p className="text-gray-500 mt-2">
                        Build smarter climate habits with AI.
                    </p>

                    {error && (
                        <div className="mt-5 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleSignup}
                        className="mt-7 w-full border border-green-100 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-50"
                    >
                        <Globe size={20} />
                        Continue with Google
                    </button>

                    <div className="my-6 text-center text-gray-400 text-sm">
                        or signup with email
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="auth-input">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-input">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="Password min 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700">
                            Create Account <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600">
                        Already have account?{" "}
                        <Link to="/login" className="text-green-700 font-black">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;