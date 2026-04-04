import { Link } from 'react-router-dom'
import { CheckCircle2, Utensils, PieChart, Users, ChevronRight, Zap, Star, LayoutDashboard, CreditCard, Shield, Globe, Clock, Smartphone, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LandingNavbar } from '@/components/LandingNavbar'
import { LandingFooter } from '@/components/LandingFooter'
import dashboardPreview from '../Assets/images/dashboard_preview.jpeg'
import { motion } from 'framer-motion'

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
}

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.15 } },
    viewport: { once: true }
}

export default function Landing() {
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col font-sans text-gray-900">
            <LandingNavbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 overflow-hidden bg-white">
                    <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-amber-50 to-transparent pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div {...fadeInUp} className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-amber-100 text-amber-700 mb-8 border border-amber-200">
                            <Zap className="h-4 w-4 mr-2" /> Elevate your cafe operations
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 mt-4 text-gray-900"
                        >
                            The Smart Way to Manage <br className="hidden md:block"/> Your Cafe & Coffee Shop
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-4 max-w-2xl text-lg md:text-xl text-gray-600 mx-auto leading-relaxed mb-10"
                        >
                            Cafems streamlines operations, simplifies point-of-sale, and delivers powerful analytics to help your cafe thrive. Built for owners, loved by staff, and enjoyed by customers.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row justify-center gap-4"
                        >
                            <Link to="/owner/register">
                                <Button size="lg" className="rounded-full w-full sm:w-auto text-base px-8 h-14 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/25 transition-all transform hover:-translate-y-1">
                                    Start Free Trial <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-base px-8 h-14 border-2 border-gray-200 hover:border-amber-600 hover:bg-amber-50 text-gray-900 transition-all">
                                    Sign In
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Dashboard Preview Section with Animation */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 mb-24 hidden md:block"
                >
                    <div className="rounded-3xl shadow-2xl border border-gray-200 overflow-hidden bg-white p-2">
                        <img src={dashboardPreview} alt="Cafems Dashboard" className="w-full h-auto rounded-2xl object-cover" />
                    </div>
                </motion.section>

                {/* Rich Content - Detailed Features Overview */}
                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="flex-1 space-y-8"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Built exactly for the way your cafe works</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Stop using generic retail software. Cafems is designed intimately with coffee shops and restaurants in mind. We provide customized modules for Managers, Waiters, and Owners directly out of the box.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex group">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                                                <LayoutDashboard className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-xl font-bold text-gray-900">Interactive Table Layouts</h4>
                                            <p className="mt-2 text-gray-600">Map your POS to your actual floor plan. Manage table states, reservations, and waitlists visually, making staff instantly familiar with where orders should go.</p>
                                        </div>
                                    </div>
                                    <div className="flex group">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                                                <CreditCard className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-xl font-bold text-gray-900">Split Payments Simplified</h4>
                                            <p className="mt-2 text-gray-600 text-base leading-relaxed">Handling large groups doesn't have to be a headache. Split bills by item, divide evenly among customers, and process multiple payment methods flawlessly in seconds.</p>
                                        </div>
                                    </div>
                                    <div className="flex group">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                                                <Smartphone className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-xl font-bold text-gray-900">Mobile Ordering for Staff</h4>
                                            <p className="mt-2 text-gray-600">Equip your wait staff with mobile tablets or phones to take tableside orders efficiently. Tickets shoot straight to the kitchen instantly.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="flex-1 w-full relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-amber-50 rounded-[3rem] transform rotate-3 scale-105 opacity-50"></div>
                                <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
                                    <img src={dashboardPreview} alt="Interactive POS Dashboard Preview" className="w-full h-auto rounded-[2rem] object-cover" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Core Features Grid Section */}
                <section className="py-24 bg-amber-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeInUp} className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900">Everything you need to succeed</h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">From taking orders to tracking inventory, Cafems handles the heavy lifting so you can focus on making great coffee.</p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                    <Utensils className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Lightning-Fast POS</h3>
                                <p className="text-gray-600 leading-relaxed">Lightning-fast point of sale designed explicitly for speed. Reduce customer waiting times, manage queues efficiently, and communicate instantly with your kitchen or baristas.</p>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                    <PieChart className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Live Reporting & Analytics</h3>
                                <p className="text-gray-600 leading-relaxed">Track sales trends, identify your best-selling items, and optimize resource allocation with our beautifully designed real-time reporting dashboard. Export data securely anywhere.</p>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl w-fit mb-6">
                                    <Users className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Smart Staff Management</h3>
                                <p className="text-gray-600 leading-relaxed">Empower your team. Track shifts securely, manage dynamic role permissions for Managers vs. Waiters, and calculate payroll out-of-the-box securely.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Testimonial & Stats Row */}
                <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-amber-600/10 pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-6 w-6 text-amber-400 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-3xl md:text-5xl font-medium leading-tight mb-8 text-white">
                                    "Cafems has completely revolutionized how we run our shop. Our table turnover has doubled because of how incredibly fast the system pushes tickets."
                                </blockquote>
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-amber-600 flex items-center justify-center text-xl font-bold">SJ</div>
                                    <div className="flex flex-col">
                                        <div className="font-bold text-xl text-white">Sarah Jenkins</div>
                                        <div className="text-gray-400">Owner, The Daily Grind Espresso</div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                variants={staggerContainer}
                                className="grid grid-cols-2 gap-x-8 gap-y-12 lg:border-l lg:border-gray-700 lg:pl-16"
                            >
                                <motion.div variants={fadeInUp}>
                                    <div className="text-5xl font-extrabold text-amber-400 mb-2 tracking-tighter">2.5s</div>
                                    <div className="text-gray-400 text-lg font-medium">Avg order processing time</div>
                                </motion.div>
                                <motion.div variants={fadeInUp}>
                                    <div className="text-5xl font-extrabold text-amber-400 mb-2 tracking-tighter">99.9%</div>
                                    <div className="text-gray-400 text-lg font-medium">Platform uptime reliable</div>
                                </motion.div>
                                <motion.div variants={fadeInUp}>
                                    <div className="text-5xl font-extrabold text-amber-400 mb-2 tracking-tighter">45m</div>
                                    <div className="text-gray-400 text-lg font-medium">Saved daily on register closing</div>
                                </motion.div>
                                <motion.div variants={fadeInUp}>
                                    <div className="text-5xl font-extrabold text-amber-400 mb-2 tracking-tighter">1.2k+</div>
                                    <div className="text-gray-400 text-lg font-medium">Happy cafes tracking revenue</div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeInUp} className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
                        </motion.div>
                        <motion.div variants={staggerContainer} className="space-y-6">
                            <motion.div variants={fadeInUp} className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center"><CheckCircle2 className="h-5 w-5 text-amber-600 mr-2"/> Can my employees sign up on their own?</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">Yes! Employees can easily request access via the public portal using their shop ID. Managers or owners can then simply approve those secure requests directly from the dashboard—keeping onboarding absolutely effortless.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center"><CheckCircle2 className="h-5 w-5 text-amber-600 mr-2"/> Do I need to buy expensive terminal hardware?</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">Not at all. Cafems runs natively and directly in your standard web browser. You can seamlessly use iPads, Android tablets, or any touch-screen PC setups you already own in your shop.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center"><CheckCircle2 className="h-5 w-5 text-amber-600 mr-2"/> How does the free trial work?</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">You'll instantly receive 14 days of unrestricted access to all Pro-tier features. Once the trial properly concludes, you can seamlessly downgrade to the Starter tier or keep your secure Pro subscription.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing CTA */}
                <section className="py-24 bg-amber-600 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
                        <Coffee className="h-96 w-96 transform rotate-12" />
                    </div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.h2 {...fadeInUp} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">Ready to upgrade your workflow?</motion.h2>
                        <motion.p {...fadeInUp} className="text-amber-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">Join the 1,200+ modern coffee shops and restaurants who have reduced wait times, slashed training overhead, and successfully reclaimed their precious time using Cafems.</motion.p>
                        <motion.div {...fadeInUp} className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link to="/owner/register">
                                <Button size="lg" className="rounded-full px-10 h-16 bg-white text-amber-700 hover:bg-gray-50 text-xl font-bold shadow-2xl hover:shadow-white/20 transition-all transform hover:-translate-y-1">
                                    Start your 14-day free trial
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button size="lg" className="rounded-full px-10 h-16 bg-amber-700 text-white hover:bg-amber-800 text-xl font-bold border border-amber-500 hover:border-amber-400 transition-all transform hover:-translate-y-1">
                                    Talk to Sales Experts
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    )
}
