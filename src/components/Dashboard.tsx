"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DishService } from "@/lib/supabase"
import { Dish, DishStats } from "@/types/dish"
import { formatCurrency } from "@/lib/utils"
import { 
  Utensils, 
  TrendingUp, 
  DollarSign, 
  Award,
  Plus,
  FileText,
  BarChart3,
  Upload,
  RefreshCw
} from "lucide-react"

export function Dashboard() {
  const [stats, setStats] = useState<DishStats | null>(null)
  const [recentDishes, setRecentDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboardData = async () => {
    try {
      if (refreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const [statsData, allDishes] = await Promise.all([
        DishService.getDishStats(),
        DishService.getAllDishes()
      ])

      setStats(statsData)
      setRecentDishes(allDishes.slice(0, 5))
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleRefresh = () => {
    loadDashboardData()
  }

  const handleLoadSampleData = async () => {
    try {
      await DishService.loadSampleData()
      handleRefresh()
    } catch (error) {
      console.error("Error loading sample data:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🍽️ Dashboard</h1>
          <p className="text-muted-foreground">
            Nusantara Dish Management Overview
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dishes</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDishes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active dishes in menu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined menu value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.averagePrice || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average dish price
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.mostPopularType || '-'}</div>
            <p className="text-xs text-muted-foreground">
              Popular category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Dishes */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Dishes</CardTitle>
            <CardDescription>
              Latest additions to your menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDishes.length === 0 ? (
                <div className="text-center py-8">
                  <Utensils className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No dishes yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by adding your first dish.
                  </p>
                </div>
              ) : (
                recentDishes.map((dish) => (
                  <div key={dish.id} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {dish.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dish.dishId} • {dish.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(dish.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(dish.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your restaurant efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Dish
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View All Dishes
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleLoadSampleData}
            >
              <Utensils className="mr-2 h-4 w-4" />
              Load Sample Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
