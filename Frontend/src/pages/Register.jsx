import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

    const [ownerLoading, setOwnerLoading] = useState(false)
    const [employeeLoading, setEmployeeLoading] = useState(false)

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

    const [employeeForm, setEmployeeForm] = useState({
        email: '',
        cafeId: '',
        role: 'Waiter',
    })

    const handleOwnerChange = (e) => {
        const { name, value } = e.target
        setOwnerForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleEmployeeChange = (e) => {
        const { name, value } = e.target
        setEmployeeForm((prev) => ({ ...prev, [name]: value }))
    }

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
                description: error.response?.data?.message || 'Could not create owner account.',
                variant: 'destructive',
            })
        } finally {
            setOwnerLoading(false)
        }
    }

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
                description: 'Your employee access request was sent to the owner.',
            })

            navigate('/login?type=employee')
        } catch (error) {
            toast({
                title: 'Request failed',
                description: error.response?.data?.message || 'Could not submit employee request.',
                variant: 'destructive',
            })
        } finally {
            setEmployeeLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
            <Link to="/" className="flex items-center space-x-2 mb-8">
                <div className="bg-amber-100 p-3 rounded-xl shadow-sm">
                    <Coffee className="h-8 w-8 text-amber-600" />
                </div>
                <span className="font-bold text-3xl tracking-tight text-gray-900">Cafems</span>
            </Link>
            <div className="w-full max-w-md rounded-2xl bg-white border shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 text-center">Owner Registration</h1>

                <Tabs defaultValue="owner" className="w-full">
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

                    <TabsContent value="owner" className="mt-6">
                        <form onSubmit={handleOwnerSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name</Label>
                                <Input
                                    id="ownerName"
                                    name="ownerName"
                                    value={ownerForm.ownerName}
                                    onChange={handleOwnerChange}
                                    autoComplete="name"
                                    required
                                />
                            </div>

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

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={ownerForm.email}
                                    onChange={handleOwnerChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={ownerForm.phone}
                                    onChange={handleOwnerChange}
                                    autoComplete="tel"
                                />
                            </div>

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

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={ownerForm.imageUrl}
                                    onChange={handleOwnerChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={ownerForm.password}
                                    onChange={handleOwnerChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={ownerForm.confirmPassword}
                                    onChange={handleOwnerChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

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
                                    onClick={() => navigate('/login?type=owner')}
                                >
                                    Already have an owner account? Sign in
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    <TabsContent value="employee" className="mt-6">
                        <form onSubmit={handleEmployeeSubmit} className="space-y-4 max-w-xl mx-auto">
                            <div className="space-y-2">
                                <Label htmlFor="employeeEmail">Email</Label>
                                <Input
                                    id="employeeEmail"
                                    name="email"
                                    type="email"
                                    value={employeeForm.email}
                                    onChange={handleEmployeeChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cafeId">Shop ID / Cafe ID</Label>
                                <Input
                                    id="cafeId"
                                    name="cafeId"
                                    type="number"
                                    value={employeeForm.cafeId}
                                    onChange={handleEmployeeChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Requested Role</Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={employeeForm.role}
                                    onChange={handleEmployeeChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="Waiter">Waiter</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>

                            <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-900">
                                With your current backend, employee request supports email + cafe ID + role request.
                                Password + employee ID based approval flow is not implemented yet in the API.
                            </div>

                            <div className="space-y-3 pt-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-amber-600 hover:bg-amber-700"
                                    disabled={employeeLoading}
                                >
                                    {employeeLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending request...
                                        </>
                                    ) : (
                                        'Request Employee Access'
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/login?type=employee')}
                                >
                                    Already approved? Sign in
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Register