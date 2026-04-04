import { Link } from 'react-router-dom'
import { Coffee, Users } from 'lucide-react'

const teamMembers = [
    {
        name: 'Adel Zahid',
        email: 'adel.cse.20220204057@aust.edu',
    },
    {
        name: 'Md. Rubayet Islam',
        email: 'rubayet.cse.20220204069@aust.edu',
    },
    {
        name: 'Ma-Huan Sheikh Meem',
        email: 'ma-huan.cse.20220204070@aust.edu',
    },
    {
        name: 'Md Ahsan Habib Ridoy',
        email: 'ahsan.cse.20220204064@aust.edu',
    },
]

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center px-4 py-10">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 mb-10">
                <div className="bg-amber-100 p-3 rounded-xl shadow-sm">
                    <Coffee className="h-8 w-8 text-amber-600" />
                </div>
                <span className="font-bold text-3xl tracking-tight text-gray-900">
                    Cafems
                </span>
            </Link>

            {/* Main Container */}
            <div className="w-full max-w-5xl bg-white border shadow-lg rounded-3xl p-8">

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-3">
                    About Us
                </h1>

                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
                    Cafems is a smart cafe management system developed to simplify operations,
                    enhance employee coordination, and provide a smooth experience for cafe owners.
                    This project was built as part of an academic initiative with a focus on real-world usability.
                </p>

                {/* Team Section */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="text-amber-600" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Project Team
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="p-5 rounded-2xl border bg-amber-50 hover:shadow-md transition"
                            >
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 break-words">
                                    {member.email}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="bg-gray-50 border rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        About the Project
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Cafems is designed to help cafe owners manage employees, monitor operations,
                        and streamline workflows efficiently. It includes role-based authentication,
                        employee request systems, and intuitive dashboards for different user roles.
                        The system is built using modern web technologies ensuring performance,
                        scalability, and ease of use.
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/login"
                        className="bg-amber-600 text-white px-6 py-3 rounded-xl text-center hover:bg-amber-700 transition"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/"
                        className="border px-6 py-3 rounded-xl text-center hover:bg-gray-100 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AboutUs