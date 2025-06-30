'use client'

import React, { useState } from "react"
import Link from "next/link"
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconDatabase,
  IconCalendar,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconDownload,
  IconEye,
  IconClock,
  IconCheck,
  IconLoader2,
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data - replace with real data from Supabase
const mockSchemas = [
  {
    id: '1',
    name: 'E-commerce Database',
    description: 'Complete schema for online store with products, orders, users, and inventory management',
    tags: ['e-commerce', 'retail', 'production'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    status: 'completed',
    tableCount: 12,
  },
  {
    id: '2',
    name: 'Blog Platform',
    description: 'Content management system schema with posts, comments, categories, and user roles',
    tags: ['blog', 'cms', 'content'],
    createdAt: '2024-01-10T09:20:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    status: 'completed',
    tableCount: 8,
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Data warehouse schema for business intelligence, reporting, and real-time analytics',
    tags: ['analytics', 'reporting', 'warehouse'],
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-19T13:30:00Z',
    status: 'draft',
    tableCount: 15,
  },
  {
    id: '4',
    name: 'Social Media App',
    description: 'Social networking platform with posts, followers, messaging, and activity feeds',
    tags: ['social', 'messaging', 'mobile'],
    createdAt: '2024-01-08T15:45:00Z',
    updatedAt: '2024-01-16T10:20:00Z',
    status: 'completed',
    tableCount: 10,
  },
  {
    id: '5',
    name: 'Task Management',
    description: 'Project management system with tasks, teams, deadlines, and progress tracking',
    tags: ['productivity', 'teams', 'project'],
    createdAt: '2024-01-05T13:15:00Z',
    updatedAt: '2024-01-17T11:30:00Z',
    status: 'processing',
    tableCount: 7,
  },
  {
    id: '6',
    name: 'Inventory System',
    description: 'Warehouse management with products, stock levels, suppliers, and order tracking',
    tags: ['inventory', 'warehouse', 'logistics'],
    createdAt: '2024-01-03T08:45:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    status: 'completed',
    tableCount: 11,
  },
  {
    id: '7',
    name: 'Learning Platform',
    description: 'Online education system with courses, students, instructors, and progress tracking',
    tags: ['education', 'learning', 'courses'],
    createdAt: '2024-01-02T16:30:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
    status: 'completed',
    tableCount: 9,
  },
  {
    id: '8',
    name: 'Financial Tracker',
    description: 'Personal finance management with accounts, transactions, budgets, and reporting',
    tags: ['finance', 'budgeting', 'personal'],
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-13T17:45:00Z',
    status: 'draft',
    tableCount: 6,
  },
  {
    id: '9',
    name: 'Event Management',
    description: 'Event planning platform with venues, attendees, tickets, and scheduling',
    tags: ['events', 'planning', 'tickets'],
    createdAt: '2023-12-28T10:15:00Z',
    updatedAt: '2024-01-12T15:30:00Z',
    status: 'completed',
    tableCount: 8,
  },
  {
    id: '10',
    name: 'HR Management',
    description: 'Human resources system with employees, departments, payroll, and performance tracking',
    tags: ['hr', 'employees', 'payroll'],
    createdAt: '2023-12-25T14:20:00Z',
    updatedAt: '2024-01-11T11:10:00Z',
    status: 'processing',
    tableCount: 13,
  },
  {
    id: '11',
    name: 'Real Estate CRM',
    description: 'Property management with listings, clients, agents, and transaction tracking',
    tags: ['real-estate', 'crm', 'properties'],
    createdAt: '2023-12-22T09:30:00Z',
    updatedAt: '2024-01-10T13:45:00Z',
    status: 'completed',
    tableCount: 10,
  },
  {
    id: '12',
    name: 'Recipe Database',
    description: 'Cooking platform with recipes, ingredients, nutrition info, and meal planning',
    tags: ['cooking', 'recipes', 'nutrition'],
    createdAt: '2023-12-20T11:45:00Z',
    updatedAt: '2024-01-09T16:20:00Z',
    status: 'draft',
    tableCount: 5,
  },
]

const statusConfig = {
  'completed': {
    color: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
    icon: IconCheck,
    label: 'Completed'
  },
  'draft': {
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
    icon: IconPencil,
    label: 'Draft'
  },
  'processing': {
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    icon: IconLoader2,
    label: 'Processing'
  },
}

export default function SchemasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6) // Fixed at 6 items per page

  const filteredSchemas = mockSchemas.filter(schema => {
    const matchesSearch = schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schema.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schema.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || schema.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredSchemas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSchemas = filteredSchemas.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return formatDate(dateString)
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schema Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your AI-generated database schemas
          </p>
        </div>
        <Button asChild size="lg" className="w-fit">
          <Link href="/new-schema">
            <IconPlus className="mr-2 h-5 w-5" />
            Create New Schema
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <IconDatabase className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Total</span>
          </div>
          <div className="text-2xl font-bold mt-1">{mockSchemas.length}</div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <IconCheck className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">Completed</span>
          </div>
          <div className="text-2xl font-bold mt-1">
            {mockSchemas.filter(s => s.status === 'completed').length}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <IconPencil className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-muted-foreground">Drafts</span>
          </div>
          <div className="text-2xl font-bold mt-1">
            {mockSchemas.filter(s => s.status === 'draft').length}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <IconDatabase className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Tables</span>
          </div>
          <div className="text-2xl font-bold mt-1">
            {mockSchemas.reduce((sum, schema) => sum + schema.tableCount, 0)}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search schemas, descriptions, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[164px]">
            <IconFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
          </SelectContent>
        </Select>
      </div>

             {/* Schema Cards Grid */}
       {filteredSchemas.length > 0 ? (
         <>
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {currentSchemas.map((schema) => {
            const StatusIcon = statusConfig[schema.status as keyof typeof statusConfig].icon
            return (
              <Card key={schema.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-1">{schema.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={statusConfig[schema.status as keyof typeof statusConfig].color}
                        >
                          <StatusIcon className={`w-3 h-3 mr-1`} />
                          {statusConfig[schema.status as keyof typeof statusConfig].label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{schema.tableCount} tables</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconDotsVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <IconEye className="mr-2 h-4 w-4" />
                          View Schema
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconPencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconDownload className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <IconTrash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {schema.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {schema.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {schema.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{schema.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IconClock className="h-3 w-3" />
                      <span>{getRelativeTime(schema.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconCalendar className="h-3 w-3" />
                      <span>Created {formatDate(schema.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
                       })}
           </div>

           {/* Pagination */}
           {totalPages > 1 && (
             <div className="flex items-center justify-between">
               <div className="text-sm text-muted-foreground">
                 Showing {startIndex + 1} to {Math.min(endIndex, filteredSchemas.length)} of {filteredSchemas.length} results
               </div>

               <div className="flex items-center gap-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                   disabled={currentPage === 1}
                 >
                   <IconChevronLeft className="h-4 w-4" />
                   Previous
                 </Button>

                 <div className="flex items-center gap-1">
                   {Array.from({ length: totalPages }, (_, i) => i + 1)
                     .filter(page => {
                       const distance = Math.abs(page - currentPage)
                       return distance <= 1 || page === 1 || page === totalPages
                     })
                     .map((page, idx, arr) => {
                       const prevPage = arr[idx - 1]
                       const showEllipsis = prevPage && page - prevPage > 1

                       return (
                         <React.Fragment key={page}>
                           {showEllipsis && (
                             <span className="px-2 text-muted-foreground">...</span>
                           )}
                           <Button
                             variant={currentPage === page ? "default" : "outline"}
                             size="sm"
                             onClick={() => setCurrentPage(page)}
                             className="w-8 h-8 p-0"
                           >
                             {page}
                           </Button>
                         </React.Fragment>
                       )
                     })}
                 </div>

                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                   disabled={currentPage === totalPages}
                 >
                   Next
                   <IconChevronRight className="h-4 w-4" />
                 </Button>
               </div>
             </div>
           )}
         </>
       ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <IconDatabase className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No schemas found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first database schema'}
            </p>
            <Button asChild size="lg">
              <Link href="/new-schema">
                <IconPlus className="mr-2 h-5 w-5" />
                Create Your First Schema
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
