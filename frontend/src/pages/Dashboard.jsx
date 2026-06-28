import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
} from "firebase/firestore";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Activity,
    BarChart3,
    Bike,
    Bot,
    Car,
    Fan,
    Home,
    Laptop,
    Leaf,
    LogOut,
    Menu,
    Plus,
    Send,
    Smartphone,
    Target,
    Trash2,
    Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const factors = {
    phone: 0.012,
    laptop: 0.05,
    ac: 1.2,
    bike: 0.09,
    car: 0.19,
    bus: 0.07,
};

const quickActivities = [
    { label: "Phone Used", icon: Smartphone, type: "phone", unit: "hours" },
    { label: "Laptop Used", icon: Laptop, type: "laptop", unit: "hours" },
    { label: "AC Used", icon: Fan, type: "ac", unit: "hours" },
    { label: "Bike Travel", icon: Bike, type: "bike", unit: "km" },
    { label: "Car Travel", icon: Car, type: "car", unit: "km" },
    { label: "Bus Travel", icon: Activity, type: "bus", unit: "km" },
];

const weeklyData = [
    { day: "Mon", co2: 4.2 },
    { day: "Tue", co2: 6.1 },
    { day: "Wed", co2: 3.8 },
    { day: "Thu", co2: 7.4 },
    { day: "Fri", co2: 5.2 },
    { day: "Sat", co2: 8.1 },
    { day: "Sun", co2: 4.9 },
];

const monthlyData = [
    { month: "Jan", co2: 120 },
    { month: "Feb", co2: 98 },
    { month: "Mar", co2: 112 },
    { month: "Apr", co2: 86 },
    { month: "May", co2: 74 },
    { month: "Jun", co2: 69 },
];

function Dashboard() {
    const { currentUser, logout } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selected, setSelected] = useState(quickActivities[0]);
    const [amount, setAmount] = useState("");
    const [smartInput, setSmartInput] = useState("");
    const [activities, setActivities] = useState([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [saving, setSaving] = useState(false);

    const [chatText, setChatText] = useState("");
    const [messages, setMessages] = useState([
        {
            from: "ai",
            text: "Hi! I am your CarbonCoach AI. Log your activity and I will suggest smarter climate actions.",
        },
    ]);

    useEffect(() => {
        async function loadActivities() {
            if (!currentUser) return;

            try {
                setLoadingActivities(true);

                const q = query(
                    collection(db, "activities"),
                    where("userId", "==", currentUser.uid)
                );

                const snapshot = await getDocs(q);

                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setActivities(data);
            } catch (error) {
                console.error("Error loading activities:", error);
            } finally {
                setLoadingActivities(false);
            }
        }

        loadActivities();
    }, [currentUser]);

    const todayTotal = useMemo(() => {
        return activities.reduce((sum, item) => sum + Number(item.co2 || 0), 0);
    }, [activities]);

    const categoryData = useMemo(() => {
        const grouped = {};

        activities.forEach((item) => {
            grouped[item.type] = (grouped[item.type] || 0) + Number(item.co2 || 0);
        });

        const data = Object.keys(grouped).map((key) => ({
            name: key,
            value: Number(grouped[key].toFixed(2)),
        }));

        return data.length > 0 ? data : [{ name: "No data", value: 1 }];
    }, [activities]);

    async function addActivity() {
        if (!amount || Number(amount) <= 0 || !currentUser || saving) return;

        try {
            setSaving(true);

            const co2 = Number((Number(amount) * factors[selected.type]).toFixed(2));

            const activityData = {
                userId: currentUser.uid,
                userEmail: currentUser.email || "",
                name: selected.label,
                type: selected.type,
                amount: Number(amount),
                unit: selected.unit,
                co2,
                date: new Date().toISOString().split("T")[0],
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, "activities"), activityData);

            setActivities([
                {
                    id: docRef.id,
                    ...activityData,
                },
                ...activities,
            ]);

            setAmount("");

            setMessages((prev) => [
                ...prev,
                {
                    from: "ai",
                    text: `You added ${selected.label}. Estimated emission is ${co2} kg CO₂. Tip: reduce usage slightly or choose greener alternatives where possible.`,
                },
            ]);
        } catch (error) {
            console.error("Error saving activity:", error);
            alert("Activity could not be saved. Check Firestore rules.");
        } finally {
            setSaving(false);
        }
    }
    async function handleSmartLogger() {
        if (!smartInput.trim() || !currentUser) return;

        const text = smartInput.toLowerCase();
        const detectedActivities = [];

        const patterns = [
            {
                type: "phone",
                label: "Phone Used",
                unit: "hours",
                regex: /phone.*?(\d+(\.\d+)?)\s*(hour|hours|hr|hrs)/,
            },
            {
                type: "laptop",
                label: "Laptop Used",
                unit: "hours",
                regex: /laptop.*?(\d+(\.\d+)?)\s*(hour|hours|hr|hrs)/,
            },
            {
                type: "ac",
                label: "AC Used",
                unit: "hours",
                regex: /(ac|air conditioner).*?(\d+(\.\d+)?)\s*(hour|hours|hr|hrs)/,
                valueIndex: 2,
            },
            {
                type: "bike",
                label: "Bike Travel",
                unit: "km",
                regex: /bike.*?(\d+(\.\d+)?)\s*(km|kilometer|kilometers)/,
            },
            {
                type: "car",
                label: "Car Travel",
                unit: "km",
                regex: /car.*?(\d+(\.\d+)?)\s*(km|kilometer|kilometers)/,
            },
            {
                type: "bus",
                label: "Bus Travel",
                unit: "km",
                regex: /bus.*?(\d+(\.\d+)?)\s*(km|kilometer|kilometers)/,
            },
        ];

        patterns.forEach((pattern) => {
            const match = text.match(pattern.regex);

            if (match) {
                const value = Number(match[pattern.valueIndex || 1]);
                const co2 = Number((value * factors[pattern.type]).toFixed(2));

                detectedActivities.push({
                    userId: currentUser.uid,
                    userEmail: currentUser.email || "",
                    name: pattern.label,
                    type: pattern.type,
                    amount: value,
                    unit: pattern.unit,
                    co2,
                    date: new Date().toISOString().split("T")[0],
                    createdAt: serverTimestamp(),
                    source: "smart_logger",
                    originalText: smartInput,
                });
            }
        });

        if (detectedActivities.length === 0) {
            setMessages((prev) => [
                ...prev,
                {
                    from: "ai",
                    text: "I could not detect an activity. Try: I used AC for 4 hours and travelled by bike for 12 km.",
                },
            ]);
            return;
        }

        const savedActivities = [];

        for (const activity of detectedActivities) {
            const docRef = await addDoc(collection(db, "activities"), activity);
            savedActivities.push({
                id: docRef.id,
                ...activity,
            });
        }

        setActivities([...savedActivities, ...activities]);
        setSmartInput("");

        const total = detectedActivities.reduce((sum, item) => sum + item.co2, 0);

        setMessages((prev) => [
            ...prev,
            {
                from: "ai",
                text: `Smart Logger added ${detectedActivities.length} activities. Estimated total emission: ${total.toFixed(
                    2
                )} kg CO₂.`,
            },
        ]);
    }

    async function sendChat() {
        if (!chatText.trim()) return;

        const userMsg = chatText;
        setChatText("");

        setMessages((prev) => [...prev, { from: "user", text: userMsg }]);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/coach`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    todayTotal: todayTotal.toFixed(2),
                    activities,
                    question: userMsg,
                }),
            });

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    from: "ai",
                    text: data.reply || "I could not generate a response right now.",
                },
            ]);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    from: "ai",
                    text: "AI coach is not connected. Please check backend server.",
                },
            ]);
        }
    }

    function clearLocalActivities() {
        setActivities([]);
    }

    return (
        <div className="min-h-screen bg-[#eef7e9] text-[#102015]">
            <div className="flex">
                <aside
                    className={`fixed lg:sticky top-0 z-40 h-screen w-72 bg-[#07130b] text-white p-5 transition-all ${sidebarOpen ? "left-0" : "-left-80 lg:left-0"
                        }`}
                >
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 rounded-2xl bg-green-500 flex items-center justify-center">
                            <Leaf />
                        </div>
                        <div>
                            <h2 className="font-black text-xl">CarbonCoach IQ</h2>
                            <p className="text-xs text-gray-400">AI Climate Dashboard</p>
                        </div>
                    </div>

                    <nav className="space-y-3">
                        <SideItem active icon={<Home />} text="Dashboard" />
                        <SideItem icon={<Plus />} text="Carbon Check" />
                        <SideItem icon={<Bot />} text="AI Coach" />
                        <SideItem icon={<BarChart3 />} text="Insights" />
                        <SideItem icon={<Target />} text="Goals" />
                    </nav>

                    <button
                        onClick={logout}
                        className="absolute bottom-6 left-5 right-5 bg-white/10 hover:bg-white/20 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </aside>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-green-100 flex items-center justify-between mb-6">
                        <div>
                            <button className="lg:hidden mb-3" onClick={() => setSidebarOpen(true)}>
                                <Menu />
                            </button>
                            <h1 className="text-2xl sm:text-4xl font-black">
                                Hi, {currentUser?.displayName || currentUser?.email || "Eco Learner"} 👋
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Today’s carbon summary and smart climate actions.
                            </p>
                        </div>

                        <div className="hidden sm:block text-right">
                            <p className="text-sm text-gray-500">Today</p>
                            <h3 className="font-black">{new Date().toDateString()}</h3>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                        <StatCard title="CO₂ Today" value={`${todayTotal.toFixed(2)} kg`} icon={<Leaf />} note="Live daily total" />
                        <StatCard title="Activities" value={activities.length} icon={<Activity />} note="Saved in Firestore" />
                        <StatCard title="Goal Progress" value="68%" icon={<Target />} note="Monthly target" />
                        <StatCard title="Energy Score" value="82/100" icon={<Zap />} note="Good climate habits" />
                    </div>

                    <div className="grid xl:grid-cols-3 gap-6 mb-6">
                        <div className="xl:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-green-100">
                            <h2 className="text-xl font-black">Weekly Emission Trend</h2>
                            <p className="text-sm text-gray-500 mb-6">kg CO₂ emitted per day</p>

                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={weeklyData}>
                                        <defs>
                                            <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5f4df" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="co2"
                                            stroke="#16a34a"
                                            fill="url(#co2Gradient)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-green-100">
                            <h2 className="text-xl font-black">Category Split</h2>
                            <p className="text-sm text-gray-500">Today’s footprint sources</p>

                            <div className="h-72 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={categoryData} dataKey="value" outerRadius={95} innerRadius={55}>
                                            {categoryData.map((_, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={["#16a34a", "#84cc16", "#f59e0b", "#0f766e", "#65a30d"][index % 5]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    {/* Smart Logger */}
                    <div className="bg-[#102015] text-white rounded-[2rem] p-6 shadow-sm mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-green-500 flex items-center justify-center">
                                        <Bot />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black">AI Smart Carbon Logger</h2>
                                        <p className="text-sm text-gray-300">
                                            Describe your day and CarbonCoach will detect activities automatically.
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm text-green-300 mt-4">
                                    Example: I used AC for 4 hours, phone for 5 hours and travelled by bike for 12 km.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-[55%]">
                                <input
                                    value={smartInput}
                                    onChange={(e) => setSmartInput(e.target.value)}
                                    placeholder="Describe your activity..."
                                    className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none font-semibold text-white placeholder:text-gray-400"
                                />

                                <button
                                    onClick={handleSmartLogger}
                                    className="bg-green-500 text-white px-7 py-4 rounded-2xl font-black hover:bg-green-400"
                                >
                                    Smart Calculate
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid xl:grid-cols-3 gap-6 mb-6">
                        <div className="xl:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-green-100">
                            <h2 className="text-xl font-black">Start Carbon Check</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Choose an activity, enter time or distance, and save CO₂ instantly.
                            </p>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                {quickActivities.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <button
                                            key={item.type}
                                            onClick={() => setSelected(item)}
                                            className={`p-5 rounded-3xl border text-left transition ${selected.type === item.type
                                                ? "bg-[#102015] text-white border-[#102015]"
                                                : "bg-[#f7fbf4] border-green-100 hover:border-green-400"
                                                }`}
                                        >
                                            <Icon className="mb-4" />
                                            <h3 className="font-black">{item.label}</h3>
                                            <p className="text-sm opacity-70">Enter {item.unit}</p>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    placeholder={`Enter ${selected.unit}`}
                                    className="flex-1 bg-[#f7fbf4] border border-green-100 rounded-2xl px-5 py-4 outline-none font-bold"
                                />
                                <button
                                    onClick={addActivity}
                                    disabled={saving}
                                    className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-green-700 disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Calculate"}
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#102015] text-white rounded-[2rem] p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 rounded-2xl bg-green-500 flex items-center justify-center">
                                    <Bot />
                                </div>
                                <div>
                                    <h2 className="font-black text-xl">AI Carbon Coach</h2>
                                    <p className="text-xs text-gray-300">Personal climate assistant</p>
                                </div>
                            </div>

                            <div className="h-72 overflow-y-auto space-y-3 pr-1">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-2xl text-sm ${msg.from === "ai" ? "bg-white/10 text-gray-100" : "bg-green-500 text-white ml-8"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-2">
                                <input
                                    value={chatText}
                                    onChange={(e) => setChatText(e.target.value)}
                                    placeholder="Ask AI..."
                                    className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-3 outline-none text-sm"
                                />
                                <button
                                    onClick={sendChat}
                                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-green-100">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-black">Today’s Activities</h2>

                                <button
                                    onClick={clearLocalActivities}
                                    className="text-sm flex items-center gap-2 text-red-500 font-bold"
                                >
                                    <Trash2 size={16} />
                                    Clear View
                                </button>
                            </div>

                            {loadingActivities ? (
                                <p className="text-gray-500">Loading activities...</p>
                            ) : activities.length === 0 ? (
                                <div className="bg-[#f7fbf4] rounded-2xl p-6 text-center text-gray-500">
                                    No activity added yet. Add your first carbon activity above.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {activities.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between bg-[#f7fbf4] p-4 rounded-2xl"
                                        >
                                            <div>
                                                <h3 className="font-black">{item.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {item.amount} {item.unit}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <h3 className="font-black text-green-700">{item.co2} kg</h3>
                                                <p className="text-xs text-gray-500">CO₂</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-green-100">
                            <h2 className="text-xl font-black">Monthly Overview</h2>
                            <p className="text-sm text-gray-500">Reduction pattern</p>

                            <div className="h-64 mt-5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="co2" radius={[10, 10, 0, 0]} fill="#22c55e" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                />
            )}
        </div>
    );
}

function SideItem({ icon, text, active }) {
    return (
        <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition ${active ? "bg-green-500 text-white" : "text-gray-300 hover:bg-white/10"
                }`}
        >
            {icon}
            {text}
        </button>
    );
}

function StatCard({ title, value, icon, note }) {
    return (
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-black">
                    Live
                </span>
            </div>
            <p className="text-gray-500 text-sm mt-5">{title}</p>
            <h3 className="text-3xl font-black mt-1">{value}</h3>
            <p className="text-xs text-gray-500 mt-2">{note}</p>
        </div>
    );
}

export default Dashboard;