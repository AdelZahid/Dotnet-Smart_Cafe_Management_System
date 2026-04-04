import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Coffee, Loader2, UserCog, Users } from 'lucide-react'
import { authApi } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/authStore'

const Register = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const { setAuth } = useAuthStore()

    // Loading states
    const [ownerLoading, setOwnerLoading] = useState(false)
    const [employeeLoading, setEmployeeLoading] = useState(false)

    // Owner form
    const [ownerForm, setOwnerForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        cafeName: '',
        ownerName: '',
        location: '',
        phone: '',
        imageUrl: '',
    })

    // Employee form
    const [employeeForm, setEmployeeForm] = useState({
        email: '',
        cafeId: '',
        role: 'Waiter',
    })

    // Handle owner input change
    const handleOwnerChange = (e) => {
        const { name, value } = e.target
        setOwnerForm((prev) => ({ ...prev, [name]: value }))
    }

    // Handle employee input change
    const handleEmployeeChange = (e) => {
        const { name, value } = e.target
        setEmployeeForm((prev) => ({ ...prev, [name]: value }))
    }

    // Owner submit
    const handleOwnerSubmit = async (e) => {
        e.preventDefault()

        if (ownerForm.password !== ownerForm.confirmPassword) {
            toast({
                title: 'Password mismatch',
                description: 'Password and confirm password must match.',
                variant: 'destructive',
            })
            return
        }

        setOwnerLoading(true)

        try {
            const payload = {
                email: ownerForm.email,
                password: ownerForm.password,
                cafeName: ownerForm.cafeName,
                ownerName: ownerForm.ownerName,
                location: ownerForm.location,
                phone: ownerForm.phone,
                imageUrl: ownerForm.imageUrl || null,
            }

            const response = await authApi.registerOwner(payload)
            setAuth(response.data.user, response.data.token)

            toast({
                title: 'Owner registration successful',
                description: 'Your cafe profile has been created.',
            })

            navigate('/dashboard')
        } catch (error) {
            toast({
                title: 'Registration failed',
                description:
                    error.response?.data?.message ||
                    'Could not create owner account.',
                variant: 'destructive',
            })
        } finally {
            setOwnerLoading(false)
        }
    }

    // Employee submit
    const handleEmployeeSubmit = async (e) => {
        e.preventDefault()
        setEmployeeLoading(true)

        try {
            const payload = {
                email: employeeForm.email,
                cafeId: Number(employeeForm.cafeId),
                role: employeeForm.role,
            }

            await authApi.registerEmployee(payload)

            toast({
                title: 'Request submitted',
                description:
                    'Your employee access request was sent to the owner.',
            })

            navigate('/login?type=employee')
        } catch (error) {
            toast({
                title: 'Request failed',
                description:
                    error.response?.data?.message ||
                    'Could not submit employee request.',
                variant: 'destructive',
            })
        } finally {
            setEmployeeLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 mb-8">
                <div className="bg-amber-100 p-3 rounded-xl shadow-sm">
                    <Coffee className="h-8 w-8 text-amber-600" />
                </div>
                <span className="font-bold text-3xl tracking-tight text-gray-900">
                    Cafems
                </span>
            </Link>

            {/* Card */}
            <div className="w-full max-w-md rounded-2xl bg-white border shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center">
                    Owner Registration
                </h1>

                <Tabs defaultValue="owner" className="w-full">

                    {/* Tabs */}
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="owner" className="gap-2">
                            <UserCog className="h-4 w-4" />
                            Owner
                        </TabsTrigger>
                        <TabsTrigger value="employee" className="gap-2">
                            <Users className="h-4 w-4" />
                            Employee
                        </TabsTrigger>
                    </TabsList>

                    {/* OWNER TAB */}
                    <TabsContent value="owner" className="mt-6">
                        <form
                            onSubmit={handleOwnerSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {/* Owner Name */}
                            <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name</Label>
                                <Input
                                    id="ownerName"
                                    name="ownerName"
                                    value={ownerForm.ownerName}
                                    onChange={handleOwnerChange}
                                    required
                                />
                            </div>

                            {/* Cafe Name */}
                            <div className="space-y-2">
                                <Label htmlFor="cafeName">Cafe Name</Label>
                                <Input
                                    id="cafeName"
                                    name="cafeName"
                                    value={ownerForm.cafeName}
                                    onChange={handleOwnerChange}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={ownerForm.email}
                                    onChange={handleOwnerChange}
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={ownerForm.phone}
                                    onChange={handleOwnerChange}
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={ownerForm.location}
                                    onChange={handleOwnerChange}
                                    required
                                />
                            </div>

                            {/* Image */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={ownerForm.imageUrl}
                                    onChange={handleOwnerChange}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input
                                    name="password"
                                    type="password"
                                    value={ownerForm.password}
                                    onChange={handleOwnerChange}
                                    required
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label>Confirm Password</Label>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    value={ownerForm.confirmPassword}
                                    onChange={handleOwnerChange}
                                    required
                                />
                            </div>

                            {/* Buttons */}
                            <div className="md:col-span-2 space-y-3 pt-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-amber-600 hover:bg-amber-700"
                                    disabled={ownerLoading}
                                >
                                    {ownerLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating cafe...
                                        </>
                                    ) : (
                                        'Register Owner'
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() =>
                                        navigate('/login?type=owner')
                                    }
                                >
                                    Already have an account? Sign in
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    {/* EMPLOYEE TAB */}
                    <TabsContent value="employee" className="mt-6">
                        <form
                            onSubmit={handleEmployeeSubmit}
                            className="space-y-4"
                        >
                            <Input
                                name="email"
                                type="email"
                                value={employeeForm.email}
                                onChange={handleEmployeeChange}
                                placeholder="Email"
                                required
                            />

                            <Input
                                name="cafeId"
                                type="number"
                                value={employeeForm.cafeId}
                                onChange={handleEmployeeChange}
                                placeholder="Cafe ID"
                                required
                            />

                            <select
                                name="role"
                                value={employeeForm.role}
                                onChange={handleEmployeeChange}
                                className="w-full border px-3 py-2 rounded-md"
                            >
                                <option value="Waiter">Waiter</option>
                                <option value="Manager">Manager</option>
                            </select>

                            <Button
                                type="submit"
                                className="w-full bg-amber-600 hover:bg-amber-700"
                                disabled={employeeLoading}
                            >
                                {employeeLoading
                                    ? 'Sending request...'
                                    : 'Request Access'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Register