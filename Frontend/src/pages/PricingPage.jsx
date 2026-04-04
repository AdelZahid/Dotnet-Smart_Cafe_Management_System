import { Link } from 'react-router-dom'
import { LandingNavbar } from '@/components/LandingNavbar'
import { LandingFooter } from '@/components/LandingFooter'
import { CheckCircle2, DollarSign, Cloud, LifeBuoy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col font-sans text-gray-900">
            <LandingNavbar />
            <main className="flex-grow py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-amber-50 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">Transparent Pricing</h1>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto">No hidden fees. Cancel anytime. Choose the perfect plan specially tailored for your bustling cafe.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {/* Starter Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col transform hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="mb-8">
                                <h3 className="text-3xl font-bold mb-2">Starter</h3>
                                <div className="text-gray-500">Perfect for small, independent cafes starting out.</div>
                            </div>
                            <div className="mb-8">
                                <span className="text-6xl font-extrabold text-gray-900">$29</span>
                                <span className="text-gray-500 font-medium text-lg">/mo</span>
                            </div>
                            <ul className="space-y-5 mb-10 flex-grow">
                                {[
                                    'Up to 2 location branches',
                                    'Unlimited staff member accounts',
                                    'Basic sales reporting dashboard',
                                    'Standard email support',
                                    'Table-top waitstaff ordering'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-700 text-lg">
                                        <CheckCircle2 className="h-6 w-6 text-amber-600 mr-4 flex-shrink-0" /> {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/owner/register">
                                <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-semibold border-2 hover:bg-amber-50 text-gray-900 hover:text-amber-800 border-gray-200 hover:border-amber-200 transition-colors">
                                    Get Started Free
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-amber-600 text-white p-10 rounded-[2.5rem] relative shadow-2xl shadow-amber-600/30 flex flex-col transform hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="absolute top-0 right-10 transform -translate-y-1/2">
                                <span className="bg-gray-900 text-white text-sm font-bold uppercase tracking-wider py-2 px-6 rounded-full shadow-lg">
                                    Most Popular
                                </span>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-3xl font-bold mb-2">Pro</h3>
                                <div className="text-amber-100">Built for rapidly growing enterprise businesses.</div>
                            </div>
                            <div className="mb-8">
                                <span className="text-6xl font-extrabold text-white">$79</span>
                                <span className="text-amber-100 font-medium text-lg">/mo</span>
                            </div>
                            <ul className="space-y-5 mb-10 flex-grow">
                                {[
                                    'Unlimited cafe locations',
                                    'Advanced analytics & raw data exports',
                                    'Detailed raw ingredient inventory',
                                    'Priority 24/7 technical support',
                                    'Custom offline mode syncing',
                                    'Integrated customer loyalty program'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center text-white/95 text-lg">
                                        <CheckCircle2 className="h-6 w-6 text-amber-300 mr-4 flex-shrink-0" /> {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/owner/register">
                                <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-white text-amber-700 hover:bg-gray-50 border-2 border-transparent hover:shadow-lg transition-all">
                                    Start 14-Day Free Trial
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Features Comparison Add-on */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mt-24 pt-24 border-t border-gray-100 max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold text-center mb-12">Every plan automatically includes</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center text-gray-700">
                            <div className="space-y-4">
                                <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                                    <Cloud className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-lg text-gray-900">Cloud Backups</h4>
                                <p>Your menus, tickets, and shifts are safely saved eternally in our secure cloud.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                                    <LifeBuoy className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-lg text-gray-900">Free Updates</h4>
                                <p>We continuously upgrade Cafems. All updates flow directly to you at zero cost.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-lg text-gray-900">No Setup Fees</h4>
                                <p>Skip the expensive installation consultant. Download the browser tab, log in, and print tickets.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <LandingFooter />
        </div>
    )
}
