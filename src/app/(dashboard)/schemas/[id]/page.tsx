"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrowLeft,
  IconDownload,
  IconPencil,
  IconTrash,
  IconShare,
  IconCopy,
  IconCheck,
  IconDatabase,
  IconCalendar,
  IconClock,
  IconTable,
  IconRelationOneToMany,
  IconCode,
  IconBulb,
  IconChevronDown,
  IconChevronRight,
  IconExternalLink,
  IconLoader2,
  IconSearch,
  IconList,
  IconLayoutGrid,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with real data from Supabase
const mockSchema = {
  id: "1",
  name: "E-commerce Database",
  description:
    "Complete schema for online store with products, orders, users, and inventory management system",
  tags: ["e-commerce", "retail", "production"],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-20T14:15:00Z",
  status: "completed",
  get tableCount() {
    return this.tables.length;
  },
  tables: [
    {
      name: "users",
      description: "User accounts and authentication data",
      columns: [
        { name: "id", type: "UUID", constraints: ["Primary Key"] },
        {
          name: "email",
          type: "VARCHAR(255)",
          constraints: ["Unique", "Not Null"],
        },
        {
          name: "password_hash",
          type: "VARCHAR(255)",
          constraints: ["Not Null"],
        },
        { name: "first_name", type: "VARCHAR(100)", constraints: [] },
        { name: "last_name", type: "VARCHAR(100)", constraints: [] },
        { name: "phone", type: "VARCHAR(20)", constraints: [] },
        {
          name: "created_at",
          type: "TIMESTAMP",
          constraints: ["Default: CURRENT_TIMESTAMP"],
        },
        {
          name: "updated_at",
          type: "TIMESTAMP",
          constraints: ["Default: CURRENT_TIMESTAMP"],
        },
      ],
    },
    {
      name: "categories",
      description: "Product categories and hierarchy",
      columns: [
        { name: "id", type: "SERIAL", constraints: ["Primary Key"] },
        { name: "name", type: "VARCHAR(100)", constraints: ["Not Null"] },
        {
          name: "slug",
          type: "VARCHAR(100)",
          constraints: ["Unique", "Not Null"],
        },
        { name: "description", type: "TEXT", constraints: [] },
        {
          name: "parent_id",
          type: "INTEGER",
          constraints: ["FK: categories.id"],
        },
        {
          name: "created_at",
          type: "TIMESTAMP",
          constraints: ["Default: CURRENT_TIMESTAMP"],
        },
      ],
    },
    {
      name: "products",
      description: "Product catalog with pricing and inventory",
      columns: [
        { name: "id", type: "SERIAL", constraints: ["Primary Key"] },
        { name: "name", type: "VARCHAR(200)", constraints: ["Not Null"] },
        {
          name: "slug",
          type: "VARCHAR(200)",
          constraints: ["Unique", "Not Null"],
        },
        { name: "description", type: "TEXT", constraints: [] },
        { name: "price", type: "DECIMAL(10,2)", constraints: ["Not Null"] },
        { name: "cost", type: "DECIMAL(10,2)", constraints: [] },
        { name: "sku", type: "VARCHAR(100)", constraints: ["Unique"] },
        {
          name: "stock_quantity",
          type: "INTEGER",
          constraints: ["Default: 0"],
        },
        {
          name: "category_id",
          type: "INTEGER",
          constraints: ["FK: categories.id"],
        },
        { name: "is_active", type: "BOOLEAN", constraints: ["Default: true"] },
        {
          name: "created_at",
          type: "TIMESTAMP",
          constraints: ["Default: CURRENT_TIMESTAMP"],
        },
        {
          name: "updated_at",
          type: "TIMESTAMP",
          constraints: ["Default: CURRENT_TIMESTAMP"],
        },
      ],
    },
    {
      name: "orders",
      description: "Customer orders and transaction records",
      columns: [
        { name: "id", type: "SERIAL", constraints: ["Primary Key"] },
        {
          name: "user_id",
          type: "INTEGER",
          constraints: ["FK: users.id", "Not Null"],
        },
        { name: "status", type: "VARCHAR(50)", constraints: ["Not Null"] },
        {
          name: "total_amount",
          type: "DECIMAL(10,2)",
          constraints: ["Not Null"],
        },
        { name: "shipping_address", type: "TEXT", constraints: [] },
        { name: "billing_address", type: "TEXT", constraints: [] },
        { name: "payment_status", type: "VARCHAR(50)", constraints: [] },
        {
          name: "created_at",
          type: "TIMESTAMP",
          constraints: ["Default: CURRENT_TIMESTAMP"],
        },
        {
          name: "updated_at",
          type: "TIMESTAMP",
          constraints: ["Default: CURRENT_TIMESTAMP"],
        },
      ],
    },
    {
      name: "order_items",
      description: "Individual items within orders",
      columns: [
        { name: "id", type: "SERIAL", constraints: ["Primary Key"] },
        {
          name: "order_id",
          type: "INTEGER",
          constraints: ["FK: orders.id", "Not Null"],
        },
        {
          name: "product_id",
          type: "INTEGER",
          constraints: ["FK: products.id", "Not Null"],
        },
        { name: "quantity", type: "INTEGER", constraints: ["Not Null"] },
        {
          name: "unit_price",
          type: "DECIMAL(10,2)",
          constraints: ["Not Null"],
        },
        {
          name: "total_price",
          type: "DECIMAL(10,2)",
          constraints: ["Not Null"],
        },
      ],
    },
    {
      name: "cart_items",
      description: "Shopping cart temporary storage",
      columns: [
        { name: "id", type: "SERIAL", constraints: ["Primary Key"] },
        {
          name: "user_id",
          type: "INTEGER",
          constraints: ["FK: users.id", "Not Null"],
        },
        {
          name: "product_id",
          type: "INTEGER",
          constraints: ["FK: products.id", "Not Null"],
        },
        { name: "quantity", type: "INTEGER", constraints: ["Not Null"] },
        {
          name: "created_at",
          type: "TIMESTAMP",
          constraints: ["Default: CURRENT_TIMESTAMP"],
        },
      ],
    },
  ],
  sql: `-- E-commerce Database Schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
  suggestions: [
    {
      type: "performance",
      title: "Add Indexes for Better Query Performance",
      description:
        "Consider adding indexes on frequently queried columns like email, slug, and foreign keys.",
      priority: "high",
      tables: ["users", "products", "categories"],
    },
    {
      type: "normalization",
      title: "Address Normalization",
      description:
        "Consider creating a separate addresses table to handle multiple addresses per user.",
      priority: "medium",
      tables: ["users"],
    },
    {
      type: "security",
      title: "Sensitive Data Protection",
      description:
        "Ensure password_hash and payment information are properly encrypted.",
      priority: "high",
      tables: ["users"],
    },
  ],
};

const statusConfig = {
  completed: {
    color:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    icon: IconCheck,
    label: "Completed",
  },
  draft: {
    color:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
    icon: IconPencil,
    label: "Draft",
  },
  processing: {
    color:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    icon: IconLoader2,
    label: "Processing",
  },
};

const priorityColors = {
  high: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  medium:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
  low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
};

interface SchemaDetailPageProps {
  params: { id: string };
}

export default function SchemaDetailPage({ params }: SchemaDetailPageProps) {
  const [activeTab, setActiveTab] = useState("blueprint");
  const [copiedSql, setCopiedSql] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [tableSearch, setTableSearch] = useState("");
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact");

  // In real app, fetch schema by ID from Supabase
  // const schema = await getSchemaById(params.id)
  const schema = mockSchema; // TODO: Replace with actual data fetching using params.id

  // Suppress unused params warning until we implement real data fetching
  void params;

  if (!schema) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(schema.sql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } catch (err) {
      console.error("Failed to copy SQL:", err);
    }
  };

  const StatusIcon =
    statusConfig[schema.status as keyof typeof statusConfig].icon;

  const toggleTableExpansion = (tableName: string) => {
    setExpandedTables((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tableName)) {
        newSet.delete(tableName);
      } else {
        newSet.add(tableName);
      }
      return newSet;
    });
  };

  const expandAllTables = () => {
    setExpandedTables(new Set(schema.tables.map((t) => t.name)));
  };

  const collapseAllTables = () => {
    setExpandedTables(new Set());
  };

  const filteredTables = schema.tables.filter(
    (table) =>
      table.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      table.description.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="w-fit">
          <Link href="/schemas">
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Schemas
          </Link>
        </Button>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {schema.name}
                </h1>
                <Badge
                  variant="outline"
                  className={
                    statusConfig[schema.status as keyof typeof statusConfig]
                      .color
                  }
                >
                  <StatusIcon
                    className={`w-3 h-3 mr-1 ${
                      schema.status === "processing" ? "animate-spin" : ""
                    }`}
                  />
                  {
                    statusConfig[schema.status as keyof typeof statusConfig]
                      .label
                  }
                </Badge>
              </div>

              <p className="text-muted-foreground text-sm sm:text-base">
                {schema.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {schema.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="outline" size="sm">
                <IconShare className="h-4 w-4 mr-2" />
                Share
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconDownload className="h-4 w-4 mr-2" />
                    Export
                    <IconChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <IconCode className="mr-2 h-4 w-4" />
                    PostgreSQL (.sql)
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCode className="mr-2 h-4 w-4" />
                    MySQL (.sql)
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCode className="mr-2 h-4 w-4" />
                    Laravel Migration
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCode className="mr-2 h-4 w-4" />
                    Prisma Schema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm">
                <IconPencil className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions - Mobile */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <IconShare className="h-4 w-4 mr-2" />
              Share
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <IconDownload className="h-4 w-4 mr-2" />
                  Export
                  <IconChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <IconCode className="mr-2 h-4 w-4" />
                  PostgreSQL (.sql)
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCode className="mr-2 h-4 w-4" />
                  MySQL (.sql)
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCode className="mr-2 h-4 w-4" />
                  Laravel Migration
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCode className="mr-2 h-4 w-4" />
                  Prisma Schema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <IconPencil className="h-4 w-4 mr-2" />
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive whitespace-nowrap"
            >
              <IconTrash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/25">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Tables</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{schema.tableCount}</p>
              </div>
              <div className="p-2 bg-blue-200/50 dark:bg-blue-800/30 rounded-lg">
                <IconTable className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/25">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Relations</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {schema.tables.reduce(
                    (sum, table) =>
                      sum +
                      table.columns.filter((col) =>
                        col.constraints.some((constraint) =>
                          constraint.startsWith("FK:")
                        )
                      ).length,
                    0
                  )}
                </p>
              </div>
              <div className="p-2 bg-purple-200/50 dark:bg-purple-800/30 rounded-lg">
                <IconRelationOneToMany className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/25">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-green-700 dark:text-green-300">Created</p>
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">{formatDate(schema.createdAt).split(",")[0]}</p>
              </div>
              <div className="p-2 bg-green-200/50 dark:bg-green-800/30 rounded-lg">
                <IconCalendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/25">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Updated</p>
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">{formatDate(schema.updatedAt).split(",")[0]}</p>
              </div>
              <div className="p-2 bg-orange-200/50 dark:bg-orange-800/30 rounded-lg">
                <IconClock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 h-auto bg-gray-100/70 dark:bg-gray-800/70 p-1 rounded-lg">
              <TabsTrigger
                value="blueprint"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <IconDatabase className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Blueprint</span>
                <span className="xs:hidden sm:hidden">BP</span>
              </TabsTrigger>
              <TabsTrigger
                value="sql"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <IconCode className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Raw SQL</span>
                <span className="xs:hidden sm:hidden">SQL</span>
              </TabsTrigger>
              <TabsTrigger
                value="erd"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <IconRelationOneToMany className="h-3 w-3 sm:h-4 sm:w-4" />
                ERD
              </TabsTrigger>
              <TabsTrigger
                value="suggestions"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <IconBulb className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Suggestions</span>
                <span className="xs:hidden sm:hidden">Tips</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-3 sm:p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="min-w-0"
          >
            {/* Blueprint Tab */}
            <TabsContent
              value="blueprint"
              className="space-y-3 sm:space-y-4 mt-3 sm:mt-4"
            >
              <div className="space-y-3">
                {/* Header with controls */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <h3 className="text-lg font-semibold">Database Blueprint</h3>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setViewMode(
                          viewMode === "compact" ? "detailed" : "compact"
                        )
                      }
                      className="whitespace-nowrap"
                    >
                      {viewMode === "compact" ? (
                        <IconLayoutGrid className="h-4 w-4 sm:mr-2" />
                      ) : (
                        <IconList className="h-4 w-4 sm:mr-2" />
                      )}
                      <span className="hidden sm:inline">
                        {viewMode === "compact"
                          ? "Detailed View"
                          : "Compact View"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopySql}
                      className="whitespace-nowrap"
                    >
                      <IconCopy className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Copy SQL</span>
                    </Button>
                  </div>
                </div>

                {/* Search and expand/collapse controls */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                  <div className="relative flex-1 lg:max-w-md">
                    <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search tables..."
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border rounded-md bg-background min-w-0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={expandAllTables}
                      className="flex-1 lg:flex-none"
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={collapseAllTables}
                      className="flex-1 lg:flex-none"
                    >
                      Collapse All
                    </Button>
                  </div>
                </div>

                {/* Tables count */}
                <div className="text-sm text-muted-foreground">
                  Showing {filteredTables.length} of {schema.tables.length}{" "}
                  tables
                </div>
              </div>

              {/* Tables list */}
              <div className="space-y-2 sm:space-y-3">
                {filteredTables.map((table) => {
                  const isExpanded = expandedTables.has(table.name);
                  const foreignKeys = table.columns.filter((col) =>
                    col.constraints.some((constraint) =>
                      constraint.startsWith("FK:")
                    )
                  );

                  return (
                    <Card key={table.name} className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-gray-50/50 to-gray-100/30 dark:from-gray-900/50 dark:to-gray-800/30 hover:shadow-md transition-all duration-200">
                      <CardHeader
                        className="pb-2 cursor-pointer hover:bg-gradient-to-r hover:from-gray-100/60 hover:to-gray-200/40 dark:hover:from-gray-800/60 dark:hover:to-gray-700/40 transition-all duration-200"
                        onClick={() => toggleTableExpansion(table.name)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {isExpanded ? (
                              <IconChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <IconChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <div className="p-1.5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-md">
                              <IconTable className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-sm sm:text-base truncate font-semibold">
                                {table.name}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground truncate">
                                {table.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Badge
                              variant="secondary"
                              className="text-xs whitespace-nowrap bg-gray-200/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 border-0"
                            >
                              {table.columns.length} cols
                            </Badge>
                            {foreignKeys.length > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-purple-100/60 text-purple-700 border-0 dark:bg-purple-900/40 dark:text-purple-300 whitespace-nowrap"
                              >
                                {foreignKeys.length} FK
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="p-0 border-t">
                          {/* Desktop Table View */}
                          <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b bg-muted/50">
                                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                                    COLUMN
                                  </th>
                                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                                    TYPE
                                  </th>
                                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                                    CONSTRAINTS
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {table.columns.map((column, index) => (
                                  <tr
                                    key={column.name}
                                    className={
                                      index !== table.columns.length - 1
                                        ? "border-b"
                                        : ""
                                    }
                                  >
                                    <td className="py-3 px-4 font-mono text-sm font-medium">
                                      {column.name}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-muted-foreground">
                                      {column.type}
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex flex-wrap gap-1">
                                        {column.constraints.map(
                                          (constraint, constraintIndex) => {
                                            let badgeClass = "text-xs";
                                            if (constraint === "Primary Key") {
                                              badgeClass +=
                                                " bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300";
                                            } else if (
                                              constraint === "Unique"
                                            ) {
                                              badgeClass +=
                                                " bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300";
                                            } else if (
                                              constraint.startsWith("FK:")
                                            ) {
                                              badgeClass +=
                                                " bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300";
                                            } else {
                                              badgeClass +=
                                                " bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300";
                                            }

                                            return (
                                              <Badge
                                                key={constraintIndex}
                                                variant="outline"
                                                className={badgeClass}
                                              >
                                                {constraint}
                                              </Badge>
                                            );
                                          }
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Card View */}
                          <div className="sm:hidden">
                            {table.columns.map((column, index) => (
                              <div
                                key={column.name}
                                className={`p-4 ${
                                  index !== table.columns.length - 1
                                    ? "border-b"
                                    : ""
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="font-mono text-sm font-medium">
                                    {column.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {column.type}
                                  </div>
                                  {column.constraints.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {column.constraints.map(
                                        (constraint, constraintIndex) => {
                                          let badgeClass = "text-xs";
                                          if (constraint === "Primary Key") {
                                            badgeClass +=
                                              " bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300";
                                          } else if (constraint === "Unique") {
                                            badgeClass +=
                                              " bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300";
                                          } else if (
                                            constraint.startsWith("FK:")
                                          ) {
                                            badgeClass +=
                                              " bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300";
                                          } else {
                                            badgeClass +=
                                              " bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300";
                                          }

                                          return (
                                            <Badge
                                              key={constraintIndex}
                                              variant="outline"
                                              className={badgeClass}
                                            >
                                              {constraint}
                                            </Badge>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>

              {filteredTables.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <IconSearch className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No tables found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* SQL Tab */}
            <TabsContent value="sql" className="space-y-3 mt-3 sm:mt-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <h3 className="text-lg font-semibold">Generated SQL Schema</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySql}
                  disabled={copiedSql}
                  className="w-fit whitespace-nowrap"
                >
                  {copiedSql ? (
                    <IconCheck className="h-4 w-4 mr-2" />
                  ) : (
                    <IconCopy className="h-4 w-4 mr-2" />
                  )}
                  {copiedSql ? "Copied!" : "Copy SQL"}
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <pre className="bg-muted p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                    <code>{schema.sql}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ERD Tab */}
            <TabsContent value="erd" className="space-y-4 mt-4 sm:mt-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <h3 className="text-lg font-semibold">
                  Entity Relationship Diagram
                </h3>
                <Button variant="outline" size="sm" className="w-fit whitespace-nowrap">
                  <IconExternalLink className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Open in Fullscreen</span>
                  <span className="sm:hidden">Fullscreen</span>
                </Button>
              </div>

              <Card>
                <CardContent className="p-4 sm:p-8">
                  <div className="flex items-center justify-center h-64 sm:h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center px-4">
                      <IconDatabase className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-base sm:text-lg font-medium mb-2">
                        Interactive ERD
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Entity relationship diagram will be rendered here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suggestions Tab */}
            <TabsContent value="suggestions" className="space-y-4 mt-4 sm:mt-6">
              <div className="space-y-4">
                {schema.suggestions.map((suggestion, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">
                            {suggestion.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {suggestion.description}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            priorityColors[
                              suggestion.priority as keyof typeof priorityColors
                            ]
                          }
                        >
                          {suggestion.priority} priority
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Affects tables:
                        </span>
                        {suggestion.tables.map((table) => (
                          <Badge
                            key={table}
                            variant="secondary"
                            className="text-xs"
                          >
                            {table}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
