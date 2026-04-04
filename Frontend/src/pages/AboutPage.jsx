import { LandingNavbar } from '@/components/LandingNavbar'
import { LandingFooter } from '@/components/LandingFooter'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col font-sans text-gray-900">
            <LandingNavbar />
            <main className="flex-grow py-24 bg-white relative overflow-hidden text-gray-900">
                <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-tr from-transparent to-amber-50 pointer-events-none" />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">The Story of Cafems</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Built relentlessly by exhausted cafe owners to solve the massive headache of modern hospitality operations.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-16 group relative"
                    >
                        <div className="absolute inset-0 bg-amber-200 rounded-3xl transform rotate-2 scale-105 opacity-30 transition-transform group-hover:rotate-1 duration-500" />
                        <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200&h=400" alt="Cafe environment" className="w-full object-cover rounded-3xl shadow-xl h-64 md:h-96 relative z-10 transition-transform duration-500 group-hover:scale-[1.01]" />
                    </motion.div>

                    <div className="grid md:grid-cols-12 gap-12 items-start mt-10">
                        <motion.div {...fadeInUp} className="md:col-span-8 prose prose-lg prose-amber text-gray-700 leading-loose">
                            <p className="text-xl font-medium text-gray-900 mb-6 border-l-4 border-amber-500 pl-6">
                                "We got tired of outdated, hard-to-use point of sale systems that fundamentally didn't understand the unique, high-pressure flow of a busy morning coffee shop."
                            </p>
                            <p className="mb-6">
                                We wanted a tool that would reduce training time, drastically speed up the checkout process, and immediately provide deep insights into our sales—all without needing an expensive consultant to set it up. We simply couldn't find it. So we built it.
                            </p>
                            <p className="mb-6">
                                In 2026, we launched Cafems with one incredibly simple mission: radically give cafe owners the smart technology workflow they deserve. Whether you run a single neighborhood espresso bar out of a tiny window, or a rapidly growing chain of seated bistros across the state, our platform seamlessly scales beautifully alongside your exact needs.
                            </p>
                            <p className="mb-6">
                                Everything from the granular ingredient cost tracking down to the waiter dashboard was tested in a live, high-volume environment. We know what it means to be literally in the weeds on a Saturday morning. Our platform ensures your software never slows you down when it counts.
                            </p>
                            <p>
                                From our bustling headquarters in New York, we now passionately support thousands of cafes globally. And miraculously, we're genuinely just getting started. Grab a cup of nice coffee and securely join our growing system today.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="md:col-span-4 bg-amber-50/50 rounded-[2rem] p-8 border border-amber-100 sticky top-24 shadow-sm"
                        >
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Our Core Values</h3>
                            <ul className="space-y-5">
                                <li className="flex items-start">
                                    <CheckCircle2 className="h-6 w-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="font-bold text-gray-900">Speed is King</div>
                                        <div className="text-gray-600 text-sm mt-1">If the system lags, you lose money. UI speed is paramount.</div>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 className="h-6 w-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="font-bold text-gray-900">Zero Training</div>
                                        <div className="text-gray-600 text-sm mt-1">A new barista should know how to charge an oat milk flat white immediately.</div>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 className="h-6 w-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="font-bold text-gray-900">Complete Transparency</div>
                                        <div className="text-gray-600 text-sm mt-1">Straightforward pricing without hidden credit card gateway extortions.</div>
                                    </div>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </main>
            <LandingFooter />
        </div>
    )
}
