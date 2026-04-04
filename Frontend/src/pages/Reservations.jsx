import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationApi, tableApi } from '@/services/api'
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
import { Plus, Pencil, Trash2, Calendar, Users, Phone } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const Reservations = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    reservationDate: '',
    numberOfGuests: '',
    tableId: '',
    notes: '',
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationApi.getAll().then((res) => res.data),
  })

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApi.getAll().then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => reservationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      setIsAddDialogOpen(false)
      resetForm()
      toast({ title: 'Reservation created successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to create reservation', variant: 'destructive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => reservationApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      setEditingReservation(null)
      resetForm()
      toast({ title: 'Reservation updated successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to update reservation', variant: 'destructive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => reservationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      toast({ title: 'Reservation deleted successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to delete reservation', variant: 'destructive' })
    },
  })

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      reservationDate: '',
      numberOfGuests: '',
      tableId: '',
      notes: '',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      reservationDate: new Date(formData.reservationDate).toISOString(),
      numberOfGuests: parseInt(formData.numberOfGuests),
      notes: formData.notes,
    }

    if (formData.tableId) {
      data.tableId = parseInt(formData.tableId)
    }

    if (editingReservation) {
      updateMutation.mutate({ id: editingReservation.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (reservation) => {
    setEditingReservation(reservation)
    setFormData({
      customerName: reservation.customerName,
      customerPhone: reservation.customerPhone || '',
      reservationDate: new Date(reservation.reservationDate).toISOString().slice(0, 16),
      numberOfGuests: reservation.numberOfGuests.toString(),
      tableId: reservation.tableId?.toString() || '',
      notes: reservation.notes || '',
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleStatusChange = (id, status) => {
    updateMutation.mutate({ id, data: { status } })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Confirmed':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      case 'Completed':
        return 'bg-gray-100 text-gray-800'
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

  const upcomingReservations = reservations
    ?.filter((r) => r.status !== 'Cancelled' && r.status !== 'Completed')
    .sort((a, b) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime())

  const pastReservations = reservations
    ?.filter((r) => r.status === 'Cancelled' || r.status === 'Completed')
    .sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-500">Manage table reservations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              New Reservation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReservation ? 'Edit Reservation' : 'New Reservation'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reservationDate">Date & Time</Label>
                <Input
                  id="reservationDate"
                  type="datetime-local"
                  value={formData.reservationDate}
                  onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfGuests">Number of Guests</Label>
                <Input
                  id="numberOfGuests"
                  type="number"
                  min="1"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="table">Table (Optional)</Label>
                <Select
                  value={formData.tableId}
                  onValueChange={(value) => setFormData({ ...formData, tableId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables?.map((table) => (
                      <SelectItem key={table.id} value={table.id.toString()}>
                        Table {table.tableNumber} (Capacity: {table.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                {editingReservation ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Reservations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingReservations?.map((reservation) => (
            <Card key={reservation.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{reservation.customerName}</h3>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDateTime(reservation.reservationDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{reservation.numberOfGuests} guests</span>
                    </div>
                    {reservation.customerPhone && (
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{reservation.customerPhone}</span>
                      </div>
                    )}
                    {reservation.table && (
                      <p className="text-sm text-gray-500 mt-1">
                        Table: {reservation.table.tableNumber}
                      </p>
                    )}
                    {reservation.notes && (
                      <p className="text-sm text-gray-500 mt-1">{reservation.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(reservation)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {reservation.status === 'Pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(reservation.id, 'Confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    {(reservation.status === 'Pending' || reservation.status === 'Confirmed') && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(reservation.id, 'Completed')}
                        >
                          Complete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(reservation.id, 'Cancelled')}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reservation.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {upcomingReservations?.length === 0 && (
          <p className="text-gray-500 text-center py-8">No upcoming reservations</p>
        )}
      </div>

      {pastReservations && pastReservations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Past Reservations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastReservations.map((reservation) => (
              <Card key={reservation.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{reservation.customerName}</h3>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDateTime(reservation.reservationDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{reservation.numberOfGuests} guests</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reservation.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Reservations
