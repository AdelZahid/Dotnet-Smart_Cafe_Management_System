import { LandingNavbar } from '@/components/LandingNavbar'
import { LandingFooter } from '@/components/LandingFooter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

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

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col font-sans text-gray-900">
            <LandingNavbar />
            <main className="flex-grow py-24 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900">Get perfectly in touch</h1>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto">Have crucial questions about Cafems? We're here to securely support you.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true }}
                            className="flex flex-col space-y-8 p-8 md:p-12 bg-amber-50/50 rounded-3xl border border-amber-100 shadow-sm"
                        >
                            <motion.div variants={fadeInUp}>
                                <h3 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h3>
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    Whether you're opening your very first pop-up espresso bar or flawlessly migrating twenty enterprise bistros onto a modern cloud POS, our cafe-experienced sales squad is fully ready to smoothly guide you entirely.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex items-start">
                                <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl flex-shrink-0 mt-0.5 shadow-sm transform hover:scale-110 transition-transform">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div className="ml-5 text-gray-800 font-medium">
                                    <p className="text-gray-500 text-sm font-normal mb-1">Global Headquarters</p>
                                    1243 Espresso Avenue,<br />
                                    Suite 900<br />
                                    New York, NY 10012
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex items-start">
                                <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl flex-shrink-0 mt-0.5 shadow-sm transform hover:scale-110 transition-transform">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div className="ml-5 text-gray-800 font-medium">
                                    <p className="text-gray-500 text-sm font-normal mb-1">Sales & Tech Support</p>
                                    +1 (800) 555-CAFEMS<br />
                                    +1 (800) 555-2233
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex items-start">
                                <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl flex-shrink-0 mt-0.5 shadow-sm transform hover:scale-110 transition-transform">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div className="ml-5 text-gray-800 font-medium">
                                    <p className="text-gray-500 text-sm font-normal mb-1">Inquiries</p>
                                    hello@cafems.example.com<br />
                                    support@cafems.example.com
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex items-start pt-6 border-t border-amber-200/50">
                                <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl flex-shrink-0 mt-0.5 shadow-sm transform hover:scale-110 transition-transform">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div className="ml-5 text-gray-800 font-medium">
                                    <p className="text-gray-500 text-sm font-normal mb-1">Support Hours</p>
                                    24/7 Global Priority Coverage for Pro plans.<br />
                                    M-F 9AM-8PM EST for Starter plans.
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 w-full"
                        >
                            <h3 className="text-3xl font-bold mb-8 text-gray-900">Send us a direct message</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-gray-700 font-semibold">First name</Label>
                                        <Input id="firstName" placeholder="Jane" className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white h-14 text-lg focus:border-amber-500 focus:ring-amber-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-gray-700 font-semibold">Last name</Label>
                                        <Input id="lastName" placeholder="Doe" className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white h-14 text-lg focus:border-amber-500 focus:ring-amber-500" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 font-semibold">Business Email</Label>
                                    <Input id="email" type="email" placeholder="jane@yourcafe.com" className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white h-14 text-lg focus:border-amber-500 focus:ring-amber-500" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="locations" className="text-gray-700 font-semibold">How many locations?</Label>
                                    <select id="locations" className="flex w-full rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 text-lg h-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500">
                                        <option>1-2 Locations</option>
                                        <option>3-5 Locations</option>
                                        <option>6+ Locations</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-gray-700 font-semibold">Message</Label>
                                    <textarea id="message" className="flex w-full rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white px-4 py-3 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500 min-h-[160px] resize-y" placeholder="Briefly describe what challenges your cafe is currently facing..." />
                                </div>

                                <Button className="w-full text-lg h-14 rounded-2xl font-bold bg-amber-600 hover:bg-amber-700 text-white border-transparent shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/30 transition-all transform hover:-translate-y-1 mt-4">Send secure message</Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>
            <LandingFooter />
        </div>
    )
}
