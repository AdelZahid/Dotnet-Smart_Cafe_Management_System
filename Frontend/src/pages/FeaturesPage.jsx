import { LandingNavbar } from '@/components/LandingNavbar'
import { LandingFooter } from '@/components/LandingFooter'
import { Utensils, PieChart, Users, Smartphone, Clock, CreditCard, Shield, RefreshCcw, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col font-sans text-gray-900">
            <LandingNavbar />
            <main className="flex-grow py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-amber-50 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900">Robust Features <br className="hidden md:block"/> for Your Cafe</h1>
                        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                            Discover the comprehensive suite of tools built specifically to help you successfully run, manage, and grow your cafe business without the technical headache.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                <Utensils className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Table Top Ordering</h3>
                            <p className="text-gray-600 leading-relaxed">Give your wait staff the tools to seamlessly submit orders right from the table. Tickets instantly sync with the kitchen display, reducing wait times.</p>
                        </motion.div>

                        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                <PieChart className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Live Analytics Dashboard</h3>
                            <p className="text-gray-600 leading-relaxed">Follow real-time granular analytics to see exactly what is selling fast. Manage low inventory stocks proactively and make data-backed decisions on the fly.</p>
                        </motion.div>

                        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Smart Staff Roles</h3>
                            <p className="text-gray-600 leading-relaxed">Define precise permission levels for Managers, Chefs, and Wait Staff. Secure sensitive financial data while allowing staff to perform their specific duties.</p>
                        </motion.div>

                        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                <Smartphone className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Mobile & Tablet Friendly</h3>
                            <p className="text-gray-600 leading-relaxed">Cafems is ultra-responsive, meaning you can manage your entire cafe's backend, order flow, or staff schedules directly from your personal mobile device or iPad.</p>
                        </motion.div>

                        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Time & Payroll Tracking</h3>
                            <p className="text-gray-600 leading-relaxed">Let your employees punch in and out securely from the POS terminal. Automatically calculate shift hours and compute accurate salaries natively.</p>
                        </motion.div>

                        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Versatile Easy Payments</h3>
                            <p className="text-gray-600 leading-relaxed">Process complex partial payments, split bills evenly, or mix cash and card methods seamlessly. Refunds are tracked automatically in your revenue charts.</p>
                        </motion.div>

                        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Bank-Grade Security</h3>
                            <p className="text-gray-600 leading-relaxed">Your financial data and customer information are heavily encrypted, ensuring your daily operations remain completely private and absolutely bulletproof.</p>
                        </motion.div>

                        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                <RefreshCcw className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Free Automated Updates</h3>
                            <p className="text-gray-600 leading-relaxed">Because Cafems is entirely cloud-based, you receive rapid feature updates and critical bug fixes instantly without ever needing to manually download anything.</p>
                        </motion.div>

                        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Offline Mode Reliability</h3>
                            <p className="text-gray-600 leading-relaxed">Internet went down? Native caching allows your waiters to continue pushing critical text tickets directly until your internet flawlessly reconnects to the cloud.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
            <LandingFooter />
        </div>
    )
}
