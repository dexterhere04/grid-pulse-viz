import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, MapPin, Activity, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Panel {
  id: string;
  name: string;
  capacity: number;
  location: string;
  status: "active" | "offline" | "maintenance";
  efficiency: number;
  energyGenerated: number;
}

const PanelManagement = () => {
  const { toast } = useToast();
  const [panels, setPanels] = useState<Panel[]>([
    {
      id: "1",
      name: "North Roof Panel A1",
      capacity: 400,
      location: "Building A - North Roof",
      status: "active",
      efficiency: 95,
      energyGenerated: 1240
    },
    {
      id: "2",
      name: "South Roof Panel B2",
      capacity: 400,
      location: "Building B - South Roof",
      status: "active",
      efficiency: 92,
      energyGenerated: 1180
    },
    {
      id: "3",
      name: "East Wing Panel C1",
      capacity: 300,
      location: "Building C - East Wing",
      status: "maintenance",
      efficiency: 78,
      energyGenerated: 890
    },
    {
      id: "4",
      name: "West Parking Panel D1",
      capacity: 500,
      location: "West Parking Lot",
      status: "offline",
      efficiency: 0,
      energyGenerated: 0
    }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    location: "",
    status: "active" as Panel["status"]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newPanel: Panel = {
      id: (panels.length + 1).toString(),
      name: formData.name,
      capacity: parseInt(formData.capacity),
      location: formData.location,
      status: formData.status,
      efficiency: Math.floor(Math.random() * 20) + 80,
      energyGenerated: Math.floor(Math.random() * 1000) + 500
    };

    setPanels([...panels, newPanel]);
    setFormData({ name: "", capacity: "", location: "", status: "active" });
    
    toast({
      title: "Success",
      description: "Solar panel added successfully!",
    });
  };

  const getStatusColor = (status: Panel["status"]) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "offline": return "bg-destructive text-destructive-foreground";
      case "maintenance": return "bg-warning text-warning-foreground";
    }
  };

  const getStatusIcon = (status: Panel["status"]) => {
    switch (status) {
      case "active": return <Zap className="h-4 w-4" />;
      case "offline": return <AlertTriangle className="h-4 w-4" />;
      case "maintenance": return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Panel Management</h1>
          <p className="text-muted-foreground">Add and monitor your solar panels</p>
        </div>
      </div>

      {/* Add Panel Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Solar Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Panel Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., North Roof Panel A1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (W) *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="e.g., 400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Building A - North Roof"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Panel["status"]) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2 lg:col-span-4">
              <Button type="submit" className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Panel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {panels.map((panel) => (
          <Card key={panel.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {panel.name}
                </CardTitle>
                <Badge className={getStatusColor(panel.status)}>
                  {getStatusIcon(panel.status)}
                  <span className="ml-1 capitalize">{panel.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{panel.location}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{panel.capacity}W</div>
                  <div className="text-xs text-muted-foreground">Capacity</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{panel.efficiency}%</div>
                  <div className="text-xs text-muted-foreground">Efficiency</div>
                </div>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                <div className="text-xl font-bold text-foreground">{panel.energyGenerated} kWh</div>
                <div className="text-xs text-muted-foreground">Energy Generated Today</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PanelManagement;