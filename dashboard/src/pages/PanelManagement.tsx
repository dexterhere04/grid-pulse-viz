import { useState, useEffect } from "react"; // ⬅️ IMPORT useEffect
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Zap, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  Calendar,
  Thermometer,
  Sun,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  Wifi,
  WifiOff,
  Wrench,
  Filter,
  Search,
  Loader2 // ⬅️ Added for loading state
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
// Assuming these asset paths are correct and available
import solarPanelActive from "@/assets/solar-panel.jpg";
import solarPanelMaintenance from "@/assets/solar-panel-maintenance.jpg";
import solarPanelOffline from "@/assets/solar-panel-offline.jpg";
// import { format } from "path"; // ⬅️ Removed unused import

// Define the TypeScript interface for your Panel data
interface Panel {
  id: string;
  name: string;
  capacity: number;
  location: string;
  status: "active" | "offline" | "maintenance" | "warning";
  efficiency: number;
  energyGenerated: number;
  temperature: number;
  installationDate: string;
  lastMaintenance: string;
  warranty: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  voltage: number;
  current: number;
  tilt: number;
  azimuth: number;
  // NOTE: Assuming image is a string URL now if fetched from DB/API
  image: string | null; 
}

// ⬅️ Define your API endpoint here
const API_URL = 'http://localhost:5000/api/devices'; 

const PanelManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [panels, setPanels] = useState<Panel[]>([]); // ⬅️ Initialize as empty array
  
  // ⬅️ New state variables for API handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // The rest of your existing states/handlers...
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    location: "",
    status: "active" as Panel["status"],
    manufacturer: "",
    model: "",
    tilt: "",
    azimuth: "",
    image: null as File | null
  });

  // --- ⬇️ DYNAMIC DATA FETCHING WITH useEffect ⬇️ ---
  useEffect(() => {
    const fetchPanels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          // If the server returns a 4xx or 5xx status
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Panel[] = await response.json();
        // The data fetched from the backend now populates the state
        setPanels(data);
      } catch (e: any) {
        console.error("Failed to fetch solar panels:", e);
        setError("Failed to load panels. Check the backend server and network connection.");
        toast({
            title: "Connection Error",
            description: "Could not connect to the panel API. Displaying no data.",
            variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanels();
  }, []); // Empty dependency array means this runs only ONCE when the component mounts
  // --- ⬆️ DYNAMIC DATA FETCHING WITH useEffect ⬆️ ---

  // ... (Your filteredPanels, handleSubmit, handleDelete, getPanelImage, getStatusColor, getStatusIcon functions remain the same)
  // ... (PanelDetailModal component remains the same)
  
  const filteredPanels = panels.filter(panel => {
    const matchesSearch = panel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         panel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || panel.status === statusFilter;
    return matchesSearch && matchesStatus;
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

    // NOTE: For a real application, this new panel would be POSTed to your Flask API,
    // and the backend would assign a true ID, serial number, etc., and persist it to the DB.
    // The component would then typically re-fetch the list or add the returned object.
    const newPanel: Panel = {
      id: (panels.length + 1).toString(), // Temporary client-side ID
      name: formData.name,
      capacity: parseInt(formData.capacity),
      location: formData.location,
      status: formData.status,
      // Mock data for new panels
      efficiency: Math.floor(Math.random() * 20) + 80,
      energyGenerated: 0,
      temperature: Math.floor(Math.random() * 20) + 35,
      installationDate: new Date().toISOString().split('T')[0],
      lastMaintenance: new Date().toISOString().split('T')[0],
      warranty: "25 years",
      manufacturer: formData.manufacturer || "Generic Solar",
      model: formData.model || "GS-" + formData.capacity + "W",
      serialNumber: "GS" + Date.now(),
      voltage: parseInt(formData.capacity) * 0.08,
      current: parseInt(formData.capacity) / 40,
      tilt: parseInt(formData.tilt) || 30,
      azimuth: parseInt(formData.azimuth) || 180,
      image: preview // Use the preview URL for client-side display
    };

    setPanels([...panels, newPanel]);
    setFormData({ name: "", capacity: "", location: "", status: "active", manufacturer: "", model: "", tilt: "", azimuth: "" , image: null});
    setPreview(null); // Clear image preview
    
    toast({
      title: "Success",
      description: "Solar panel added successfully!",
    });
  };

  const handleDelete = (id: string) => {
    // NOTE: In a real app, this would be a DELETE request to your Flask API
    setPanels(panels.filter(panel => panel.id !== id));
    toast({
      title: "Panel Deleted",
      description: "Solar panel has been removed from the system.",
    });
  };

  // The rest of your helper functions (getPanelImage, getStatusColor, getStatusIcon, PanelDetailModal) go here...
  // (omitted for brevity, assume they are identical to the original code)
  
  const getPanelImage = (status: Panel["status"]) => {
    switch (status) {
      case "maintenance": return solarPanelMaintenance;
      case "offline": return solarPanelOffline;
      default: return solarPanelActive;
    }
  };

  const getStatusColor = (status: Panel["status"]) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "offline": return "bg-destructive text-destructive-foreground";
      case "maintenance": return "bg-warning text-warning-foreground";
      case "warning": return "bg-warning text-warning-foreground";
    }
  };

  const getStatusIcon = (status: Panel["status"]) => {
    switch (status) {
      case "active": return <Wifi className="h-4 w-4" />;
      case "offline": return <WifiOff className="h-4 w-4" />;
      case "maintenance": return <Wrench className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const PanelDetailModal = ({ panel }: { panel: Panel }) => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5" />
          {panel.name} - Detailed View
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="relative">
            <img 
              src={panel.image || getPanelImage(panel.status)} 
              alt={panel.name}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            <Badge className={`absolute top-2 right-2 ${getStatusColor(panel.status)}`}>
              {getStatusIcon(panel.status)}
              <span className="ml-1 capitalize">{panel.status}</span>
            </Badge>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Real-time Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{panel.voltage}V</div>
                  <div className="text-xs text-muted-foreground">Voltage</div>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{panel.current}A</div>
                  <div className="text-xs text-muted-foreground">Current</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Efficiency</span>
                  <span className="text-sm font-medium">{panel.efficiency}%</span>
                </div>
                <Progress value={panel.efficiency} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Temperature</span>
                </div>
                <span className="font-medium">{panel.temperature}°C</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Panel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Manufacturer:</span>
                  <p className="font-medium">{panel.manufacturer}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <p className="font-medium">{panel.model}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Serial Number:</span>
                  <p className="font-medium">{panel.serialNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Capacity:</span>
                  <p className="font-medium">{panel.capacity}W</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tilt Angle:</span>
                  <p className="font-medium">{panel.tilt}°</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Azimuth:</span>
                  <p className="font-medium">{panel.azimuth}°</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maintenance & Warranty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Installed:</span>
                  <span className="font-medium">{new Date(panel.installationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">Last Maintenance:</span>
                  <span className="font-medium">{new Date(panel.lastMaintenance).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">Warranty:</span>
                  <span className="font-medium">{panel.warranty}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <Button onClick={() => navigate('/analytics')} className="flex-1">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit Panel
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );


  // --- ⬇️ RENDER LOGIC WITH LOADING/ERROR STATES ⬇️ ---
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-start">
        {/* ... (Header remains the same) */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Solar Panel Management</h1>
          <p className="text-muted-foreground">Monitor and manage your solar panel fleet</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-success border-success">
            {panels.filter(p => p.status === 'active').length} Active
          </Badge>
          <Badge variant="outline" className="text-warning border-warning">
            {panels.filter(p => p.status === 'maintenance' || p.status === 'warning').length} Maintenance
          </Badge>
          <Badge variant="outline" className="text-destructive border-destructive">
            {panels.filter(p => p.status === 'offline').length} Offline
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search panels by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Add Panel Form */}
      <Card>
        {/* ... (Add Panel Form remains the same) */}
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
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="e.g., SolarTech Pro"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., ST-400W-M"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tilt">Tilt Angle (°)</Label>
              <Input
                id="tilt"
                type="number"
                value={formData.tilt}
                onChange={(e) => setFormData({ ...formData, tilt: e.target.value })}
                placeholder="e.g., 30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="azimuth">Azimuth (°)</Label>
              <Input
                id="azimuth"
                type="number"
                value={formData.azimuth}
                onChange={(e) => setFormData({ ...formData, azimuth: e.target.value })}
                placeholder="e.g., 180"
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

            <div className="space-y-2">
              <Label htmlFor="panelImage">Panel Image *</Label>
              <Input
                id="panelImage"
                type="file"
                accept="image/*"              // limits selection to image types
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // store the File object in state
                    setFormData({ ...formData, image: file });

                    // (optional) create a preview
                    const previewUrl = URL.createObjectURL(file);
                    setPreview(previewUrl);
                  }
                }}
              />
            </div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-32 object-cover rounded"
              />
            )}
            
            <div className="md:col-span-2 lg:col-span-4">
              <Button type="submit" className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Panel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>


      {/* Conditional Rendering based on state */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium">Loading solar panels...</h3>
          <p className="text-muted-foreground">Fetching data from Flask/PostgreSQL API.</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-destructive/50 bg-destructive/10 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium text-destructive">API Connection Failed</h3>
          <p className="text-destructive/80">{error}</p>
        </div>
      ) : (
        // Panels Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPanels.map((panel) => (
            <Dialog key={panel.id}>
              <DialogTrigger asChild>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] relative overflow-hidden">
                  {/* Solar Panel Visual */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={panel.image || getPanelImage(panel.status)} 
                      alt={panel.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Status Badge */}
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(panel.status)}`}>
                      {getStatusIcon(panel.status)}
                      <span className="ml-1 capitalize">{panel.status}</span>
                    </Badge>
                    
                    {/* Power Indicator */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {panel.energyGenerated} kWh Today
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {panel.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{panel.location}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-primary/10 rounded-lg">
                        <div className="text-lg font-bold text-primary">{panel.capacity}W</div>
                        <div className="text-xs text-muted-foreground">Max Power</div>
                      </div>
                      <div className="text-center p-2 bg-accent/10 rounded-lg">
                        <div className="text-lg font-bold text-accent">{panel.efficiency}%</div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span>{panel.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span>{panel.voltage}V</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Performance</span>
                        <span className="text-xs font-medium">{panel.efficiency}%</span>
                      </div>
                      <Progress value={panel.efficiency} className="h-2 mt-1" />
                    </div>
                  </CardContent>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/analytics');
                        }}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(panel.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              
              <PanelDetailModal panel={panel} />
            </Dialog>
          ))}
        </div>
      )}

      {/* No panels found message (only show if not loading and no error) */}
      {!isLoading && !error && filteredPanels.length === 0 && (
        <div className="text-center py-12">
          <Sun className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No panels found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "Add your first solar panel to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PanelManagement;



// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Progress } from "@/components/ui/progress";
// import { 
//   Plus, 
//   Zap, 
//   MapPin, 
//   Activity, 
//   AlertTriangle, 
//   Calendar,
//   Thermometer,
//   Sun,
//   Edit,
//   Trash2,
//   BarChart3,
//   Settings,
//   Wifi,
//   WifiOff,
//   Wrench,
//   Filter,
//   Search
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";
// import solarPanelActive from "@/assets/solar-panel.jpg";
// import solarPanelMaintenance from "@/assets/solar-panel-maintenance.jpg";
// import solarPanelOffline from "@/assets/solar-panel-offline.jpg";
// import { format } from "path";

// interface Panel {
//   id: string;
//   name: string;
//   capacity: number;
//   location: string;
//   status: "active" | "offline" | "maintenance" | "warning";
//   efficiency: number;
//   energyGenerated: number;
//   temperature: number;
//   installationDate: string;
//   lastMaintenance: string;
//   warranty: string;
//   manufacturer: string;
//   model: string;
//   serialNumber: string;
//   voltage: number;
//   current: number;
//   tilt: number;
//   azimuth: number;
//   image: null;
// }

// const PanelManagement = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
  
//   const [panels, setPanels] = useState<Panel[]>([
//     {
//       id: "1",
//       name: "North Roof Panel A1",
//       capacity: 400,
//       location: "Building A - North Roof",
//       status: "active",
//       efficiency: 95.2,
//       energyGenerated: 1240,
//       temperature: 45,
//       installationDate: "2023-03-15",
//       lastMaintenance: "2024-08-20",
//       warranty: "25 years",
//       manufacturer: "SolarTech Pro",
//       model: "ST-400W-M",
//       serialNumber: "ST240315001",
//       voltage: 38.4,
//       current: 10.42,
//       tilt: 30,
//       azimuth: 180,
//       image: null
//     },
//     {
//       id: "2",
//       name: "South Roof Panel B2",
//       capacity: 400,
//       location: "Building B - South Roof",
//       status: "active",
//       efficiency: 92.1,
//       energyGenerated: 1180,
//       temperature: 42,
//       installationDate: "2023-03-15",
//       lastMaintenance: "2024-08-20",
//       warranty: "25 years",
//       manufacturer: "SolarTech Pro",
//       model: "ST-400W-M",
//       serialNumber: "ST240315002",
//       voltage: 37.8,
//       current: 10.18,
//       tilt: 25,
//       azimuth: 180, 
//       image: null
//     },
//     {
//       id: "3",
//       name: "East Wing Panel C1",
//       capacity: 300,
//       location: "Building C - East Wing",
//       status: "maintenance",
//       efficiency: 78.5,
//       energyGenerated: 890,
//       temperature: 38,
//       installationDate: "2022-11-10",
//       lastMaintenance: "2024-09-20",
//       warranty: "20 years",
//       manufacturer: "EcoPanel Systems",
//       model: "EP-300W-P",
//       serialNumber: "EP221110001",
//       voltage: 30.2,
//       current: 8.92,
//       tilt: 35,
//       azimuth: 90,
//       image: null
//     },
//     {
//       id: "4",
//       name: "West Parking Panel D1",
//       capacity: 500,
//       location: "West Parking Lot",
//       status: "offline",
//       efficiency: 0,
//       energyGenerated: 0,
//       temperature: 35,
//       installationDate: "2023-06-22",
//       lastMaintenance: "2024-07-15",
//       warranty: "25 years",
//       manufacturer: "PowerMax Solar",
//       model: "PM-500W-B",
//       serialNumber: "PM230622001",
//       voltage: 0,
//       current: 0,
//       tilt: 20,
//       azimuth: 270,
//       image: null
//     },
//     {
//       id: "5",
//       name: "Central Array Panel E3",
//       capacity: 450,
//       location: "Central Building - Array E",
//       status: "warning",
//       efficiency: 85.7,
//       energyGenerated: 1050,
//       temperature: 48,
//       installationDate: "2023-01-08",
//       lastMaintenance: "2024-06-10",
//       warranty: "25 years",
//       manufacturer: "SolarTech Pro",
//       model: "ST-450W-M",
//       serialNumber: "ST230108003",
//       voltage: 35.2,
//       current: 9.85,
//       tilt: 28,
//       azimuth: 180,
//       image : null
//     }
//   ]);

//   const [formData, setFormData] = useState({
//     name: "",
//     capacity: "",
//     location: "",
//     status: "active" as Panel["status"],
//     manufacturer: "",
//     model: "",
//     tilt: "",
//     azimuth: "",
//     image: null as File | null
//   });

//   const filteredPanels = panels.filter(panel => {
//     const matchesSearch = panel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          panel.location.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === "all" || panel.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.name || !formData.capacity || !formData.location) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields.",
//         variant: "destructive"
//       });
//       return;
//     }

//     const newPanel: Panel = {
//       id: (panels.length + 1).toString(),
//       name: formData.name,
//       capacity: parseInt(formData.capacity),
//       location: formData.location,
//       status: formData.status,
//       efficiency: Math.floor(Math.random() * 20) + 80,
//       energyGenerated: Math.floor(Math.random() * 1000) + 500,
//       temperature: Math.floor(Math.random() * 20) + 35,
//       installationDate: new Date().toISOString().split('T')[0],
//       lastMaintenance: new Date().toISOString().split('T')[0],
//       warranty: "25 years",
//       manufacturer: formData.manufacturer || "Generic Solar",
//       model: formData.model || "GS-" + formData.capacity + "W",
//       serialNumber: "GS" + Date.now(),
//       voltage: parseInt(formData.capacity) * 0.08,
//       current: parseInt(formData.capacity) / 40,
//       tilt: parseInt(formData.tilt) || 30,
//       azimuth: parseInt(formData.azimuth) || 180,
//       image: formData.image ? URL.createObjectURL(formData.image) : null
//     };

//     setPanels([...panels, newPanel]);
//     setFormData({ name: "", capacity: "", location: "", status: "active", manufacturer: "", model: "", tilt: "", azimuth: "" , image: null});
    
//     toast({
//       title: "Success",
//       description: "Solar panel added successfully!",
//     });
//   };

//   const handleDelete = (id: string) => {
//     setPanels(panels.filter(panel => panel.id !== id));
//     toast({
//       title: "Panel Deleted",
//       description: "Solar panel has been removed from the system.",
//     });
//   };

//   const getPanelImage = (status: Panel["status"]) => {
//     switch (status) {
//       case "maintenance": return solarPanelMaintenance;
//       case "offline": return solarPanelOffline;
//       default: return solarPanelActive;
//     }
//   };

//   const getStatusColor = (status: Panel["status"]) => {
//     switch (status) {
//       case "active": return "bg-success text-success-foreground";
//       case "offline": return "bg-destructive text-destructive-foreground";
//       case "maintenance": return "bg-warning text-warning-foreground";
//       case "warning": return "bg-warning text-warning-foreground";
//     }
//   };

//   const getStatusIcon = (status: Panel["status"]) => {
//     switch (status) {
//       case "active": return <Wifi className="h-4 w-4" />;
//       case "offline": return <WifiOff className="h-4 w-4" />;
//       case "maintenance": return <Wrench className="h-4 w-4" />;
//       case "warning": return <AlertTriangle className="h-4 w-4" />;
//     }
//   };

//   const PanelDetailModal = ({ panel }: { panel: Panel }) => (
//     <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
//       <DialogHeader>
//         <DialogTitle className="flex items-center gap-2">
//           <Sun className="h-5 w-5" />
//           {panel.name} - Detailed View
//         </DialogTitle>
//       </DialogHeader>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="space-y-6">
//           <div className="relative">
//             <img 
//               src={panel.image || getPanelImage(panel.status)} 
//               alt={panel.name}
//               className="w-full h-48 object-cover rounded-lg shadow-md"
//             />
//             <Badge className={`absolute top-2 right-2 ${getStatusColor(panel.status)}`}>
//               {getStatusIcon(panel.status)}
//               <span className="ml-1 capitalize">{panel.status}</span>
//             </Badge>
//           </div>
          
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Real-time Metrics</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-primary/10 rounded-lg">
//                   <div className="text-2xl font-bold text-primary">{panel.voltage}V</div>
//                   <div className="text-xs text-muted-foreground">Voltage</div>
//                 </div>
//                 <div className="text-center p-3 bg-accent/10 rounded-lg">
//                   <div className="text-2xl font-bold text-accent">{panel.current}A</div>
//                   <div className="text-xs text-muted-foreground">Current</div>
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-muted-foreground">Efficiency</span>
//                   <span className="text-sm font-medium">{panel.efficiency}%</span>
//                 </div>
//                 <Progress value={panel.efficiency} className="h-2" />
//               </div>
              
//               <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
//                 <div className="flex items-center gap-2">
//                   <Thermometer className="h-4 w-4 text-orange-500" />
//                   <span className="text-sm">Temperature</span>
//                 </div>
//                 <span className="font-medium">{panel.temperature}°C</span>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
        
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Panel Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Manufacturer:</span>
//                   <p className="font-medium">{panel.manufacturer}</p>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Model:</span>
//                   <p className="font-medium">{panel.model}</p>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Serial Number:</span>
//                   <p className="font-medium">{panel.serialNumber}</p>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Capacity:</span>
//                   <p className="font-medium">{panel.capacity}W</p>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Tilt Angle:</span>
//                   <p className="font-medium">{panel.tilt}°</p>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Azimuth:</span>
//                   <p className="font-medium">{panel.azimuth}°</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Maintenance & Warranty</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="space-y-2 text-sm">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-primary" />
//                   <span className="text-muted-foreground">Installed:</span>
//                   <span className="font-medium">{new Date(panel.installationDate).toLocaleDateString()}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Wrench className="h-4 w-4 text-accent" />
//                   <span className="text-muted-foreground">Last Maintenance:</span>
//                   <span className="font-medium">{new Date(panel.lastMaintenance).toLocaleDateString()}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Activity className="h-4 w-4 text-success" />
//                   <span className="text-muted-foreground">Warranty:</span>
//                   <span className="font-medium">{panel.warranty}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <div className="flex gap-2">
//             <Button onClick={() => navigate('/analytics')} className="flex-1">
//               <BarChart3 className="h-4 w-4 mr-2" />
//               View Analytics
//             </Button>
//             <Button variant="outline" className="flex-1">
//               <Edit className="h-4 w-4 mr-2" />
//               Edit Panel
//             </Button>
//           </div>
//         </div>
//       </div>
//     </DialogContent>
//   );

//   return (
//     <div className="container mx-auto px-4 py-8 space-y-8">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-4xl font-bold text-foreground">Solar Panel Management</h1>
//           <p className="text-muted-foreground">Monitor and manage your solar panel fleet</p>
//         </div>
//         <div className="flex gap-2">
//           <Badge variant="outline" className="text-success border-success">
//             {panels.filter(p => p.status === 'active').length} Active
//           </Badge>
//           <Badge variant="outline" className="text-warning border-warning">
//             {panels.filter(p => p.status === 'maintenance' || p.status === 'warning').length} Maintenance
//           </Badge>
//           <Badge variant="outline" className="text-destructive border-destructive">
//             {panels.filter(p => p.status === 'offline').length} Offline
//           </Badge>
//         </div>
//       </div>

//       {/* Search and Filter */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search panels by name or location..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[180px]">
//             <Filter className="h-4 w-4 mr-2" />
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="active">Active</SelectItem>
//             <SelectItem value="maintenance">Maintenance</SelectItem>
//             <SelectItem value="warning">Warning</SelectItem>
//             <SelectItem value="offline">Offline</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Add Panel Form */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Plus className="h-5 w-5" />
//             Add New Solar Panel
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Panel Name *</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="e.g., North Roof Panel A1"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="capacity">Capacity (W) *</Label>
//               <Input
//                 id="capacity"
//                 type="number"
//                 value={formData.capacity}
//                 onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
//                 placeholder="e.g., 400"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="location">Location *</Label>
//               <Input
//                 id="location"
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                 placeholder="e.g., Building A - North Roof"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="manufacturer">Manufacturer</Label>
//               <Input
//                 id="manufacturer"
//                 value={formData.manufacturer}
//                 onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
//                 placeholder="e.g., SolarTech Pro"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="model">Model</Label>
//               <Input
//                 id="model"
//                 value={formData.model}
//                 onChange={(e) => setFormData({ ...formData, model: e.target.value })}
//                 placeholder="e.g., ST-400W-M"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="tilt">Tilt Angle (°)</Label>
//               <Input
//                 id="tilt"
//                 type="number"
//                 value={formData.tilt}
//                 onChange={(e) => setFormData({ ...formData, tilt: e.target.value })}
//                 placeholder="e.g., 30"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="azimuth">Azimuth (°)</Label>
//               <Input
//                 id="azimuth"
//                 type="number"
//                 value={formData.azimuth}
//                 onChange={(e) => setFormData({ ...formData, azimuth: e.target.value })}
//                 placeholder="e.g., 180"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="status">Status</Label>
//               <Select value={formData.status} onValueChange={(value: Panel["status"]) => setFormData({ ...formData, status: value })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="maintenance">Maintenance</SelectItem>
//                   <SelectItem value="offline">Offline</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="panelImage">Panel Image *</Label>
//               <Input
//                 id="panelImage"
//                 type="file"
//                 accept="image/*"              // limits selection to image types
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
//                     // store the File object in state
//                     setFormData({ ...formData, image: file });

//                     // (optional) create a preview
//                     const previewUrl = URL.createObjectURL(file);
//                     setPreview(previewUrl);
//                   }
//                 }}
//               />
//             </div>
//             {preview && (
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="mt-2 h-32 object-cover rounded"
//               />
//             )}
            
//             <div className="md:col-span-2 lg:col-span-4">
//               <Button type="submit" className="w-full md:w-auto">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Panel
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Panels Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {filteredPanels.map((panel) => (
//           <Dialog key={panel.id}>
//             <DialogTrigger asChild>
//               <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] relative overflow-hidden">
//                 {/* Solar Panel Visual */}
//                 <div className="relative h-48 overflow-hidden">
//                   <img 
//                     src={panel.image || getPanelImage(panel.status)} 
//                     alt={panel.name}
//                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
//                   {/* Status Badge */}
//                   <Badge className={`absolute top-2 right-2 ${getStatusColor(panel.status)}`}>
//                     {getStatusIcon(panel.status)}
//                     <span className="ml-1 capitalize">{panel.status}</span>
//                   </Badge>
                  
//                   {/* Power Indicator */}
//                   <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
//                     {panel.energyGenerated} kWh Today
//                   </div>
//                 </div>

//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg group-hover:text-primary transition-colors">
//                     {panel.name}
//                   </CardTitle>
//                   <div className="flex items-center gap-2 text-muted-foreground text-sm">
//                     <MapPin className="h-4 w-4" />
//                     <span>{panel.location}</span>
//                   </div>
//                 </CardHeader>
                
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="text-center p-2 bg-primary/10 rounded-lg">
//                       <div className="text-lg font-bold text-primary">{panel.capacity}W</div>
//                       <div className="text-xs text-muted-foreground">Max Power</div>
//                     </div>
//                     <div className="text-center p-2 bg-accent/10 rounded-lg">
//                       <div className="text-lg font-bold text-accent">{panel.efficiency}%</div>
//                       <div className="text-xs text-muted-foreground">Efficiency</div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center gap-1">
//                       <Thermometer className="h-4 w-4 text-orange-500" />
//                       <span>{panel.temperature}°C</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Sun className="h-4 w-4 text-yellow-500" />
//                       <span>{panel.voltage}V</span>
//                     </div>
//                   </div>
                  
//                   <div className="pt-2 border-t">
//                     <div className="flex justify-between items-center">
//                       <span className="text-xs text-muted-foreground">Performance</span>
//                       <span className="text-xs font-medium">{panel.efficiency}%</span>
//                     </div>
//                     <Progress value={panel.efficiency} className="h-2 mt-1" />
//                   </div>
//                 </CardContent>
                
//                 {/* Action Buttons */}
//                 <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <div className="flex gap-1">
//                     <Button 
//                       size="sm" 
//                       variant="secondary" 
//                       className="h-8 w-8 p-0"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate('/analytics');
//                       }}
//                     >
//                       <BarChart3 className="h-4 w-4" />
//                     </Button>
//                     <Button 
//                       size="sm" 
//                       variant="destructive" 
//                       className="h-8 w-8 p-0"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDelete(panel.id);
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             </DialogTrigger>
            
//             <PanelDetailModal panel={panel} />
//           </Dialog>
//         ))}
//       </div>
      
//       {filteredPanels.length === 0 && (
//         <div className="text-center py-12">
//           <Sun className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-foreground mb-2">No panels found</h3>
//           <p className="text-muted-foreground">
//             {searchTerm || statusFilter !== "all" 
//               ? "Try adjusting your search or filters" 
//               : "Add your first solar panel to get started"}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PanelManagement;