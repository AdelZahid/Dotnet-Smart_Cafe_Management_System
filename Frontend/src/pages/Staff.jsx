import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Mail, Phone, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/authStore'

const Staff = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'Waiter',
    phoneNumber: '',
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user: currentUser } = useAuthStore()

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getAll().then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => userApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsAddDialogOpen(false)
      resetForm()
      toast({ title: 'User created successfully' })
    },
    onError: (error) => {
      toast({
        title: 'Failed to create user',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setEditingUser(null)
      resetForm()
      toast({ title: 'User updated successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to update user', variant: 'destructive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: 'User deleted successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to delete user', variant: 'destructive' })
    },
  })

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      role: 'Waiter',
      phoneNumber: '',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingUser) {
      const updateData = {
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      }
      if (currentUser?.role === 'Owner') {
        updateData.role = formData.role
      }
      updateMutation.mutate({ id: editingUser.id, data: updateData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      fullName: user.fullName,
      role: user.role,
      phoneNumber: user.phoneNumber || '',
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Owner':
        return 'bg-purple-100 text-purple-800'
      case 'Manager':
        return 'bg-blue-100 text-blue-800'
      case 'Waiter':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500">Manage your cafe staff</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  disabled={editingUser !== null && currentUser?.role !== 'Owner'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUser?.role === 'Owner' && <SelectItem value="Owner">Owner</SelectItem>}
                    {(currentUser?.role === 'Owner' || currentUser?.role === 'Manager') && (
                      <SelectItem value="Manager">Manager</SelectItem>
                    )}
                    <SelectItem value="Waiter">Waiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-amber-700">
                      {user.fullName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.fullName}</h3>
                    <Badge className={`mt-1 ${getRoleColor(user.role)}`}>{user.role}</Badge>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <User className="h-4 w-4" />
                        <span>{user.username}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {user.id !== currentUser?.id && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No staff members found.</p>
        </div>
      )}
    </div>
  )
}

export default Staff
