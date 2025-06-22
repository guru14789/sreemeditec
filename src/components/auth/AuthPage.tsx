import { useState } from "react";
import { Link } from "react-router-dom";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showForgotPopup, setShowForgotPopup] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0fdfa] px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg relative">
                <h2 className="text-2xl font-bold text-center text-[#1d7d69] mb-6">
                    {isLogin ? "Login to Your Account" : "Create a New Account"}
                </h2>

                {/* Login Form */}
                {isLogin ? (
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d7d69]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d7d69]"
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="accent-[#1d7d69]" />
                                Remember me
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowForgotPopup(true)}
                                className="text-[#1d7d69] hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#1d7d69] text-white py-2 rounded-lg hover:bg-[#166353] transition"
                        >
                            Login
                        </button>
                        <p className="text-center text-sm mt-4">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="text-[#1d7d69] hover:underline font-medium"
                                onClick={() => setIsLogin(false)}
                            >
                                Create one
                            </button>
                        </p>
                    </form>
                ) : (
                    // Signup Form
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1d7d69] w-full"
                            />
                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                required
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1d7d69] w-full"
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1d7d69]"
                        />
                        <input
                            type="text"
                            placeholder="User ID"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1d7d69]"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1d7d69]"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1d7d69]"
                        />
                        <label className="flex items-start text-sm gap-2">
                            <input type="checkbox" className="mt-1 accent-[#1d7d69]" required />
                            <span>
                                I agree to the{" "}
                                <Link to="/terms" className="text-[#1d7d69] hover:underline">
                                    Terms and Conditions
                                </Link>
                            </span>
                        </label>
                        <button
                            type="submit"
                            className="w-full bg-[#1d7d69] text-white py-2 rounded-lg hover:bg-[#166353] transition"
                        >
                            Create Account
                        </button>
                        <p className="text-center text-sm mt-4">
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-[#1d7d69] hover:underline font-medium"
                                onClick={() => setIsLogin(true)}
                            >
                                Login
                            </button>
                        </p>
                    </form>
                )}

                {/* Forgot Password Modal */}
                {showForgotPopup && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center space-y-4">
                            <h3 className="text-lg font-semibold text-[#1d7d69]">Forgot Password?</h3>
                            <p className="text-sm text-gray-600">
                                Please contact the admin to reset your password.
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                📞 Admin Contact: <span className="text-[#1d7d69] font-semibold">+91 93458 43187</span>
                            </p>
                            <button
                                onClick={() => setShowForgotPopup(false)}
                                className="mt-4 px-4 py-1 text-sm rounded bg-[#1d7d69] text-white hover:bg-[#166353]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
