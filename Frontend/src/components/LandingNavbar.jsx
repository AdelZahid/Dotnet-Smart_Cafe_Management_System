import { Link } from 'react-router-dom'
import { Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LandingNavbar() {
    return (
        <nav className="border-b bg-amber-50/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-amber-100 p-2 rounded-lg">
                                <Coffee className="h-6 w-6 text-amber-600" />
                            </div>
                            <span className="font-bold text-xl md:text-2xl tracking-tight text-gray-900">Cafems</span>
                        </Link>
                    </div>

                    <div className="flex-1 hidden md:flex justify-center space-x-8">
                        <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
                        <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
                        <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About</Link>
                        <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
                    </div>

                    <div className="flex-1 flex justify-end items-center space-x-4">
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            Login
                        </Link>
                        <Link to="/owner/register">
                            <Button className="rounded-full px-6 bg-amber-600 hover:bg-amber-700 text-white">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
