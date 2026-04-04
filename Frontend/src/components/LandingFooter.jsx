import { Link } from 'react-router-dom'
import { Coffee } from 'lucide-react'

export function LandingFooter() {
    return (
        <footer className="bg-white border-t border-amber-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center space-x-2 grayscale opacity-75">
                    <Coffee className="h-5 w-5 text-gray-900" />
                    <span className="font-bold text-lg text-gray-900">Cafems</span>
                </div>
                <div className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Cafems Inc. All rights reserved.
                </div>
                <div className="flex space-x-6 text-sm font-medium text-gray-500">
                    <Link to="/features" className="hover:text-amber-600">Features</Link>
                    <Link to="/pricing" className="hover:text-amber-600">Pricing</Link>
                    <Link to="/about" className="hover:text-amber-600">About</Link>
                    <Link to="/contact" className="hover:text-amber-600">Contact</Link>
                </div>
            </div>
        </footer>
    )
}
