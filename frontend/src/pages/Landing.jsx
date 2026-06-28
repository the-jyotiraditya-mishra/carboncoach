import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    ArrowRight,
    BarChart3,
    Bot,
    Brain,
    Calculator,
    Camera,
    ChevronDown,
    Globe2,
    Leaf,
    Mail,
    Menu,
    MessageCircle,
    Send,
    Share2,
    ShieldCheck,
    Sparkles,
    Target,
    Users,
    X,
    Zap,
} from "lucide-react";

const WHATSAPP_NUMBER = "917978931932";

function Landing() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatText, setChatText] = useState("");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20CarbonCoach%20IQ,%20I%20want%20to%20know%20more%20about%20carbon%20footprint%20tracking.`;

    const shareSite = async () => {
        const shareData = {
            title: "CarbonCoach IQ",
            text: "Track your footprint. Understand your impact. Take smarter climate actions.",
            url: window.location.href,
        };

        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert("Website link copied!");
        }
    };

    const shareTo = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(
            "Check out CarbonCoach IQ - an AI-powered carbon footprint awareness platform."
        );

        const links = {
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            instagram: `https://www.instagram.com/`,
        };

        window.open(links[platform], "_blank");
    };

    return (
        <div id="top" className="min-h-screen bg-[#f7fbf4] text-[#102015] overflow-hidden">
            {/* Floating Left Share Bar */}
            <div className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
                <button onClick={shareSite} className="share-btn bg-[#102015] text-white">
                    <Share2 size={18} />
                </button>
                <button onClick={() => shareTo("whatsapp")} className="share-btn bg-green-500 text-white">
                    <MessageCircle size={18} />
                </button>
                <button onClick={() => shareTo("linkedin")} className="share-btn bg-blue-700 text-white">
                    <Globe2 size={18} />
                </button>
                <button onClick={() => shareTo("instagram")} className="share-btn bg-pink-600 text-white">
                    <Camera size={18} />
                </button>
            </div>

            {/* Floating AI Chat + WhatsApp */}
            <div className="fixed right-4 bottom-5 z-50 flex flex-col items-end gap-3">
                {chatOpen && (
                    <div className="w-[310px] sm:w-[360px] bg-white rounded-[2rem] shadow-2xl border border-green-100 overflow-hidden">
                        <div className="bg-[#102015] text-white p-5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                    <Bot size={22} />
                                </div>
                                <div>
                                    <h3 className="font-black">CarbonCoach AI</h3>
                                    <p className="text-xs text-gray-300">Pre-login assistant</p>
                                </div>
                            </div>
                            <button onClick={() => setChatOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="bg-[#edf8e8] p-4 rounded-2xl text-sm font-semibold">
                                Let's check your carbon footprint. Tell me what you did today.
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-600">
                                Example: “I rode a bike for 15 km and used AC for 4 hours.”
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={chatText}
                                    onChange={(e) => setChatText(e.target.value)}
                                    placeholder="Type your activity..."
                                    className="flex-1 bg-[#f7fbf4] border border-green-100 rounded-full px-4 py-3 outline-none text-sm"
                                />
                                <button className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className="w-14 h-14 rounded-full bg-[#102015] text-white shadow-2xl flex items-center justify-center hover:bg-green-600 hover:scale-110 transition"
                    title="Chat with AI"
                >
                    <Bot size={25} />
                </button>

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 rounded-full bg-green-500 text-white shadow-2xl flex items-center justify-center hover:bg-[#102015] hover:scale-110 transition"
                    title="Chat on WhatsApp"
                >
                    <MessageCircle size={25} />
                </a>
            </div>

            {/* Header */}
            <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-7xl">
                <nav className="bg-white/90 backdrop-blur-xl border border-green-100 shadow-xl rounded-[2rem] lg:rounded-full px-5 py-3">
                    <div className="flex items-center justify-between">
                        <a href="#top" className="flex items-center gap-2 font-black text-lg sm:text-xl">
                            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                                <Leaf size={21} />
                            </div>
                            CarbonCoach IQ
                        </a>

                        <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-700">
                            <Dropdown title="Platform" items={["Carbon Dashboard", "AI Coach", "Activity Tracker"]} />
                            <Dropdown title="Solutions" items={["Students", "Families", "Teams"]} />
                            <a href="#features">Features</a>
                            <a href="#testimonials">Stories</a>
                            <a href="#blogs">Blogs</a>
                            <a href="#contact">Contact</a>
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <RouterLink to="/login" className="px-5 py-2 rounded-full font-bold hover:bg-green-50">
                                Login
                            </RouterLink>
                            <RouterLink
                                to="/signup"
                                className="bg-[#102015] text-white px-5 py-2 rounded-full font-bold hover:bg-green-700 transition"
                            >
                                Get Started
                            </RouterLink>
                        </div>

                        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
                            {menuOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                    {menuOpen && (
                        <div className="lg:hidden mt-5 border-t border-green-100 pt-5 grid gap-3">
                            {["features", "testimonials", "blogs", "contact"].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item}`}
                                    onClick={() => setMenuOpen(false)}
                                    className="capitalize font-bold px-4 py-3 rounded-2xl hover:bg-green-50"
                                >
                                    {item}
                                </a>
                            ))}
                            <RouterLink
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="px-4 py-3 rounded-2xl font-black hover:bg-green-50"
                            >
                                Login
                            </RouterLink>
                            <RouterLink
                                to="/signup"
                                onClick={() => setMenuOpen(false)}
                                className="bg-[#102015] text-white py-3 rounded-2xl font-black text-center"
                            >
                                Get Started
                            </RouterLink>
                        </div>
                    )}
                </nav>
            </header>

            {/* Hero */}
            <section className="relative pt-36 pb-20 px-5 sm:px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="absolute top-20 left-0 w-72 h-72 bg-green-300 blur-3xl rounded-full opacity-25 -z-10"></div>

                <div>
                    <div className="inline-flex items-center gap-2 bg-white border border-green-100 rounded-full px-4 py-2 shadow-sm text-sm mb-6">
                        <Sparkles size={16} className="text-green-600" />
                        AI-powered carbon footprint awareness platform
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight">
                        Track your footprint.
                        <span className="block text-green-600">Understand your impact.</span>
                    </h1>

                    <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                        CarbonCoach IQ helps individuals understand, track, and reduce their carbon footprint
                        through simple actions, daily activity logs, and personalized AI insights.
                    </p>

                    <div className="mt-9 flex flex-col sm:flex-row gap-4">
                        <RouterLink
                            to="/login"
                            className="bg-green-600 text-white px-8 py-4 rounded-full font-black flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-xl"
                        >
                            Start Carbon Check <ArrowRight size={20} />
                        </RouterLink>

                        <a
                            href="#features"
                            className="bg-white border border-green-100 px-8 py-4 rounded-full font-black hover:shadow-lg transition text-center"
                        >
                            Watch Demo
                        </a>
                    </div>

                    <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
                        <MiniStat number="25K+" label="activities tracked" />
                        <MiniStat number="18%" label="avg. reduction" />
                        <MiniStat number="AI" label="personal coach" />
                    </div>
                </div>

                <div className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80"
                        alt="Green forest"
                        className="rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full h-[420px] sm:h-[560px] object-cover"
                    />

                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-xl w-56 sm:w-64">
                        <p className="text-sm text-gray-500">Today’s emission</p>
                        <h3 className="text-3xl sm:text-4xl font-black">6.8 kg</h3>
                        <p className="text-green-600 font-bold mt-1 text-sm">18% better than yesterday</p>
                    </div>

                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#102015]/95 text-white rounded-3xl p-4 sm:p-5 shadow-xl w-64 sm:w-72">
                        <div className="flex items-center gap-3 mb-3">
                            <Brain className="text-green-400" />
                            <h3 className="font-black">AI Coach</h3>
                        </div>
                        <p className="text-sm text-gray-300">
                            Try replacing one short ride with walking today. You may save around 0.6 kg CO₂.
                        </p>
                    </div>
                </div>
            </section>

            {/* Professional Metrics Strip */}
            <section className="px-5 sm:px-6 pb-14">
                <div className="max-w-7xl mx-auto bg-white rounded-[2rem] border border-green-100 shadow-sm p-5 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <ImpactCard icon={<Calculator />} title="Carbon Calculator" value="Fast activity-based CO₂ estimates" />
                    <ImpactCard icon={<Brain />} title="AI Insights" value="Personal suggestions and summaries" />
                    <ImpactCard icon={<BarChart3 />} title="Visual Reports" value="Daily, weekly, monthly progress" />
                    <ImpactCard icon={<Globe2 />} title="Climate Actions" value="Practical habits that users can follow" />
                </div>
            </section>

            {/* Features */}
            <section id="features" className="px-5 sm:px-6 py-20 max-w-7xl mx-auto">
                <SectionTitle tag="FEATURES" title="Built like a real climate-tech platform" />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-14">
                    <Feature icon={<BarChart3 />} title="Smart Dashboard" text="See daily, weekly, and monthly carbon emissions using clean charts and metrics." />
                    <Feature icon={<Brain />} title="AI Carbon Coach" text="Enter activities naturally and get personalized reduction tips instantly." />
                    <Feature icon={<Target />} title="Green Goals" text="Set small habit goals and track your progress toward lower emissions." />
                    <Feature icon={<Zap />} title="Instant Calculator" text="Calculate emissions for transport, electricity, food, and digital activities." />
                    <Feature icon={<ShieldCheck />} title="Daily History" text="Save each day’s footprint and compare your carbon behavior over time." />
                    <Feature icon={<Users />} title="Built for Everyone" text="Useful for students, professionals, families, and eco-aware communities." />
                </div>
            </section>

            {/* How It Works */}
            <section className="px-5 sm:px-6 py-20 bg-white">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <img
                        src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=80"
                        alt="Solar energy"
                        className="rounded-[2rem] shadow-xl h-[350px] sm:h-[500px] w-full object-cover"
                    />

                    <div>
                        <p className="text-green-600 font-black">HOW IT WORKS</p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3">
                            Log your day in parts. We calculate the full impact.
                        </h2>

                        <div className="mt-8 space-y-5">
                            <Step number="01" title="Tell what you did" text="Example: I used my phone for 3 hours or rode bike for 15 km." />
                            <Step number="02" title="CarbonCoach calculates CO₂" text="Each activity is calculated separately and added to your daily total." />
                            <Step number="03" title="AI suggests better choices" text="Get practical and realistic climate actions based on your lifestyle." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="px-5 sm:px-6 py-20 max-w-7xl mx-auto">
                <SectionTitle tag="TESTIMONIALS" title="Small actions. Real awareness." />

                <div className="grid md:grid-cols-3 gap-7 mt-14">
                    <Testimonial name="Aarav Sharma" role="Student" text="CarbonCoach made me realize how my daily travel habits affect emissions. The AI tips are simple and useful." />
                    <Testimonial name="Priya Mehta" role="Working Professional" text="The dashboard feels clean and motivating. I can track my progress without complicated forms." />
                    <Testimonial name="Rohan Das" role="Hackathon Judge Demo User" text="A practical climate-tech idea with strong AI usage and a very clear user flow." />
                </div>
            </section>

            {/* Blogs */}
            <section id="blogs" className="px-5 sm:px-6 py-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14">
                        <div>
                            <p className="text-green-600 font-black">READ OUR BLOGS</p>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2">
                                Learn smarter climate actions
                            </h2>
                            <p className="text-gray-600 mt-4 max-w-2xl">
                                Simple guides to understand carbon emissions, daily habits, and sustainable living.
                            </p>
                        </div>

                        <button className="bg-[#102015] text-white px-6 py-3 rounded-full font-black hover:bg-green-700 transition w-fit">
                            Read All Blogs
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-7">
                        <BlogCard image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" category="Daily Habits" title="How small lifestyle changes reduce your carbon footprint" text="Learn how transport, electricity, food, and shopping choices affect your daily emissions." />
                        <BlogCard image="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80" category="Clean Energy" title="Why energy awareness matters in everyday life" text="Understand how simple energy-saving actions at home can lower your environmental impact." />
                        <BlogCard image="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=900&q=80" category="AI Climate Tech" title="How AI can guide better climate decisions" text="See how personalized insights can help people make smarter and greener choices daily." />
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="px-5 sm:px-6 py-20 bg-[#edf8e8]">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-green-600 font-black">CONTACT</p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3">
                            Want to build greener habits?
                        </h2>
                        <p className="text-gray-600 mt-5 leading-relaxed">
                            Start using CarbonCoach IQ and understand how your daily choices shape your
                            environmental impact.
                        </p>
                    </div>

                    <form className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-xl border border-green-100">
                        <div className="grid gap-4">
                            <input className="input" placeholder="Your name" />
                            <input className="input" placeholder="Email address" />
                            <textarea className="input h-32 resize-none" placeholder="Message"></textarea>
                            <button className="bg-[#102015] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 transition">
                                Send Message <Mail size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Back To Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-full bg-[#12351e] text-white py-4 font-black hover:bg-green-700 transition"
            >
                Back to top
            </button>

            {/* Footer */}
            <footer className="bg-[#07130b] text-white px-5 sm:px-6 py-16">
                <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-2 font-black text-2xl">
                            <Leaf className="text-green-400" />
                            CarbonCoach IQ
                        </div>
                        <p className="text-gray-400 mt-4">
                            Track your footprint. Understand your impact. Take smarter climate actions.
                        </p>
                    </div>

                    <FooterCol title="Platform" items={["Dashboard", "AI Coach", "Carbon Check", "Goals"]} />
                    <FooterCol title="Resources" items={["Climate Tips", "How it works", "FAQ", "Blog"]} />
                    <FooterCol title="Company" items={["About", "Contact", "Privacy", "Terms"]} />
                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-gray-400 text-sm flex flex-col md:flex-row justify-between gap-4">
                    <p>© 2026 CarbonCoach IQ. All rights reserved.</p>
                    <p>Made by Jyotiraditya Mishra</p>
                </div>
            </footer>
        </div>
    );
}

function Dropdown({ title, items }) {
    return (
        <div className="relative group">
            <button className="flex items-center gap-1 hover:text-green-700">
                {title} <ChevronDown size={15} />
            </button>
            <div className="absolute top-8 left-0 hidden group-hover:block bg-white rounded-2xl shadow-xl border border-green-100 p-3 w-56">
                {items.map((item) => (
                    <a key={item} className="block px-4 py-3 rounded-xl hover:bg-green-50" href="#">
                        {item}
                    </a>
                ))}
            </div>
        </div>
    );
}

function SectionTitle({ tag, title }) {
    return (
        <div className="text-center">
            <p className="text-green-600 font-black">{tag}</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2">{title}</h2>
        </div>
    );
}

function MiniStat({ number, label }) {
    return (
        <div className="bg-white/70 border border-green-100 rounded-2xl p-4">
            <h3 className="text-xl sm:text-2xl font-black">{number}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        </div>
    );
}

function ImpactCard({ icon, title, value }) {
    return (
        <div className="bg-[#f7fbf4] rounded-3xl p-5 border border-green-100">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="font-black text-lg">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{value}</p>
        </div>
    );
}

function Feature({ icon, title, text }) {
    return (
        <div className="bg-white p-7 rounded-[2rem] border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-5">
                {icon}
            </div>
            <h3 className="font-black text-xl mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{text}</p>
        </div>
    );
}

function Step({ number, title, text }) {
    return (
        <div className="bg-[#f7fbf4] border border-green-100 rounded-3xl p-5 flex gap-5">
            <div className="text-green-600 font-black text-3xl">{number}</div>
            <div>
                <h3 className="font-black text-xl">{title}</h3>
                <p className="text-gray-600 mt-1">{text}</p>
            </div>
        </div>
    );
}

function Testimonial({ name, role, text }) {
    return (
        <div className="bg-white rounded-[2rem] p-7 border border-green-100 shadow-sm">
            <p className="text-gray-600 leading-relaxed">“{text}”</p>
            <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-black text-green-700">
                    {name[0]}
                </div>
                <div>
                    <h4 className="font-black">{name}</h4>
                    <p className="text-sm text-gray-500">{role}</p>
                </div>
            </div>
        </div>
    );
}

function BlogCard({ image, category, title, text }) {
    return (
        <div className="bg-[#f7fbf4] rounded-[2rem] overflow-hidden border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <img src={image} alt={title} className="w-full h-56 object-cover" />
            <div className="p-6">
                <p className="text-green-600 font-black text-sm mb-3">{category}</p>
                <h3 className="text-2xl font-black leading-tight">{title}</h3>
                <p className="text-gray-600 mt-3 leading-relaxed">{text}</p>
                <button className="mt-6 flex items-center gap-2 text-green-700 font-black hover:gap-3 transition-all">
                    Read More <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

function FooterCol({ title, items }) {
    return (
        <div>
            <h3 className="font-black mb-4">{title}</h3>
            <div className="space-y-3">
                {items.map((item) => (
                    <p key={item} className="text-gray-400 hover:text-green-400 cursor-pointer">
                        {item}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Landing;