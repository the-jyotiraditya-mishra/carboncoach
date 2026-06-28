import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, Globe, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        try {
            setError("");
            await login(email, password);
            navigate("/dashboard");
        } catch {
            setError("Invalid email or password");
        }
    }

    async function handleGoogleLogin() {
        try {
            setError("");
            await loginWithGoogle();
            navigate("/dashboard");
        } catch {
            setError("Google login failed");
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
                        Welcome back to your climate dashboard.
                    </h1>
                    <p className="text-gray-300 mt-5 text-lg">
                        Track your footprint. Understand your impact. Take smarter climate actions.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <AuthStat number="25K+" label="Activities" />
                    <AuthStat number="18%" label="Reduction" />
                    <AuthStat number="AI" label="Coach" />
                </div>
            </div>

            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-green-100">
                    <div className="lg:hidden flex items-center gap-2 font-black text-2xl mb-8">
                        <Leaf className="text-green-600" />
                        CarbonCoach IQ
                    </div>

                    <h2 className="text-4xl font-black">Login</h2>
                    <p className="text-gray-500 mt-2">
                        Continue your carbon tracking journey.
                    </p>

                    {error && (
                        <div className="mt-5 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        className="mt-7 w-full border border-green-100 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-50"
                    >
                        <Globe size={20} />
                        Continue with Google
                    </button>

                    <div className="my-6 text-center text-gray-400 text-sm">
                        or login with email
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
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
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700">
                            Login <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600">
                        New here?{" "}
                        <Link to="/signup" className="text-green-700 font-black">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function AuthStat({ number, label }) {
    return (
        <div className="bg-white/10 rounded-2xl p-4">
            <h3 className="text-2xl font-black">{number}</h3>
            <p className="text-sm text-gray-300">{label}</p>
        </div>
    );
}

export default Login;