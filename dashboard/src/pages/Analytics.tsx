import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Leaf, 
  AlertCircle, 
  CheckCircle,
  Sun,
  Battery
} from "lucide-react";

const Analytics = () => {
  const metrics = [
    {
      title: "Total Energy Generated",
      value: "12,847 kWh",
      change: "+15.3%",
      trend: "up",
      icon: Zap,
      color: "text-primary"
    },
    {
      title: "System Efficiency",
      value: "91.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-accent"
    },
    {
      title: "CO₂ Saved",
      value: "8.4 tons",
      change: "+12.7%",
      trend: "up",
      icon: Leaf,
      color: "text-success"
    },
    {
      title: "Active Panels",
      value: "24/26",
      change: "92.3%",
      trend: "stable",
      icon: Sun,
      color: "text-warning"
    }
  ];

  const weeklyData = [
    { day: "Mon", energy: 1850, efficiency: 89 },
    { day: "Tue", energy: 2100, efficiency: 92 },
    { day: "Wed", energy: 1950, efficiency: 87 },
    { day: "Thu", energy: 2300, efficiency: 95 },
    { day: "Fri", energy: 2150, efficiency: 91 },
    { day: "Sat", energy: 1800, efficiency: 85 },
    { day: "Sun", energy: 1680, efficiency: 83 }
  ];

  const alerts = [
    {
      type: "warning",
      title: "Panel B2 Efficiency Drop",
      description: "Panel efficiency dropped by 8% in the last 3 days",
      time: "2 hours ago"
    },
    {
      type: "info",
      title: "Maintenance Scheduled",
      description: "Routine maintenance for West Wing panels scheduled for tomorrow",
      time: "5 hours ago"
    },
    {
      type: "success",
      title: "Peak Performance Achieved",
      description: "System reached 98% efficiency during peak hours",
      time: "1 day ago"
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="h-4 w-4 text-warning" />;
      case "success": return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <AlertCircle className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor your solar system performance and insights</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={metric.trend === "up" ? "default" : "secondary"} className="text-xs">
                      {metric.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-2xl bg-muted/50 ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {weeklyData.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{day.day}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-primary">{day.energy} kWh</span>
                      <span className="text-accent">{day.efficiency}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={(day.energy / 2500) * 100} className="h-2" />
                    <Progress value={day.efficiency} className="h-1 opacity-60" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status & Alerts */}
        <div className="space-y-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">24</div>
                  <div className="text-sm text-muted-foreground">Active Panels</div>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">2</div>
                  <div className="text-sm text-muted-foreground">In Maintenance</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Overall Health</span>
                  <span className="text-sm font-medium text-success">Excellent</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground opacity-70">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Energy Production Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Energy Production Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">Peak Hour</div>
              <div className="text-muted-foreground">1:30 PM - 2:30 PM</div>
              <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                2,847 kWh generated
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-accent">Best Panel</div>
              <div className="text-muted-foreground">South Roof Panel B2</div>
              <div className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full">
                98.5% efficiency
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-success">Monthly Savings</div>
              <div className="text-muted-foreground">Estimated</div>
              <div className="text-sm bg-success/10 text-success px-3 py-1 rounded-full">
                $1,247 saved
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;