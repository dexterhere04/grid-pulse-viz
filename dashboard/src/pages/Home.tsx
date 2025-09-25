import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, BarChart3, Shield, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-solar-grid.jpg";

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "Track your solar panel performance in real-time with advanced analytics."
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Get insights into energy production, efficiency trends, and optimization opportunities."
    },
    {
      icon: Shield,
      title: "Reliable Management",
      description: "Ensure optimal performance with automated monitoring and maintenance alerts."
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Impact",
      description: "Track your environmental contribution with CO₂ savings and sustainability metrics."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Smart Grid
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {" "}Solar Management
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Monitor, analyze, and optimize your solar energy system with our intelligent management platform. Real-time insights for maximum efficiency.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="group">
                  <Link to="/panels">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/analytics">View Analytics</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl -z-10"></div>
              <img 
                src={heroImage} 
                alt="Smart Grid Solar Management Dashboard" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              Powerful Features for Smart Energy Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to maximize your solar energy efficiency and monitor performance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Ready to Optimize Your Solar System?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Start managing your solar panels efficiently with our smart grid platform.
            </p>
            <Button size="lg" variant="secondary" asChild className="bg-white text-primary hover:bg-white/90">
              <Link to="/panels">Start Managing Panels</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;