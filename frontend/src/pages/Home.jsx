import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Play,
  Star,
  Award,
  TrendingUp,
  Clock,
  Building,
  Globe,
  ChevronDown,
  Menu,
  X,
  MousePointer,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    employees: 0,
    projects: 0,
    efficiency: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targets = { employees: 1000, projects: 250, efficiency: 95 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      
      setAnimatedNumbers({
        employees: Math.floor(targets.employees * progress),
        projects: Math.floor(targets.projects * progress),
        efficiency: Math.floor(targets.efficiency * progress)
      });
      
      if (progress >= 1) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Comprehensive employee profiles, onboarding, and lifecycle management",
      color: "from-blue-500 to-cyan-500",
      delay: "0ms"
    },
    {
      icon: Calendar,
      title: "Smart Attendance",
      description: "Automated tracking with real-time analytics and reporting",
      color: "from-purple-500 to-pink-500",
      delay: "200ms"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into workforce performance and productivity",
      color: "from-green-500 to-emerald-500",
      delay: "400ms"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with role-based access control",
      color: "from-orange-500 to-red-500",
      delay: "600ms"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director",
      company: "TechCorp",
      content: "This system transformed our HR operations completely. The efficiency gains are remarkable!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Operations Manager", 
      company: "StartupXYZ",
      content: "Incredible user experience and powerful features. Our team productivity increased by 40%.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "CEO",
      company: "InnovateCo",
      content: "Best investment we made this year. The ROI was visible within the first month.",
      rating: 5
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        
        .glass-effect {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-yellow-500 rounded-full mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Interactive Cursor Follower */}
      <div 
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none mix-blend-difference transition-all duration-150 ease-out z-50"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: hoveredFeature !== null ? 'scale(2)' : 'scale(1)'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EMS Pro
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
            <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
            
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Dashboard
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Login</Link>
                <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-b-2xl p-6 md:hidden glass-effect">
            <div className="flex flex-col space-y-4">
              <Link to="/features" className="text-gray-600 dark:text-gray-300">Features</Link>
              <Link to="/pricing" className="text-gray-600 dark:text-gray-300">Pricing</Link>
              <Link to="/about" className="text-gray-600 dark:text-gray-300">About</Link>
              {user ? (
                <button onClick={() => navigate('/dashboard')} className="text-left text-blue-600">Dashboard</button>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 dark:text-gray-300">Login</Link>
                  <Link to="/register" className="text-blue-600">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent animate-gradient">
              Revolutionize Your
              <br />
              <span className="relative">
                Workforce Management
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 animate-pulse"></div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline HR operations, boost productivity, and empower your team with our 
              next-generation employee management platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={handleGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group px-8 py-4 glass-effect text-gray-700 dark:text-gray-300 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-on-scroll opacity-0">
            <div className="glass-effect rounded-2xl p-6 hover-lift">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {animatedNumbers.employees}+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Happy Employees</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 hover-lift">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {animatedNumbers.projects}+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Projects Managed</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 hover-lift">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {animatedNumbers.efficiency}%
              </div>
              <div className="text-gray-600 dark:text-gray-300">Efficiency Boost</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Modern Teams</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage your workforce efficiently in one comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-on-scroll opacity-0 group"
                style={{ animationDelay: feature.delay }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="glass-effect rounded-3xl p-8 hover-lift group-hover:scale-105 transition-all duration-500 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </p>

                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-blue-600 transform translate-x-0 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll opacity-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                See It In
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Action</span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Experience the power of our platform with real-time analytics, 
                intuitive workflows, and seamless integrations.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: CheckCircle, text: "Real-time Employee Analytics" },
                  { icon: Zap, text: "Lightning-fast Performance" },
                  { icon: Shield, text: "Enterprise-grade Security" },
                  { icon: Globe, text: "Multi-location Support" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 transform hover:translate-x-2 transition-transform duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 flex items-center space-x-2">
                <MousePointer className="w-5 h-5" />
                <span>Try Interactive Demo</span>
              </button>
            </div>

            <div className="animate-on-scroll opacity-0 animate-float">
              <div className="relative">
                <div className="glass-effect rounded-3xl p-8 shadow-2xl">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Active Employees</span>
                        <span className="font-bold">847</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Attendance Rate</span>
                        <span className="font-bold">98.5%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white rounded-full h-2" style={{ width: '98.5%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">New Hires</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">42</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Projects</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Trusted by
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Industry Leaders</span>
            </h2>
          </div>

          <div className="relative">
            <div className="glass-effect rounded-3xl p-8 md:p-12 hover-lift">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonials[currentTestimonial].name[0]}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform
              <br />
              Your Workforce?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using our platform to streamline 
              their HR operations and boost productivity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="px-8 py-4 border-2 border-white text-white rounded-2xl text-lg font-semibold hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300">
                Schedule Demo
              </button>
            </div>

            <div className="mt-8 text-blue-100 text-sm">
              ✨ No credit card required • Free 14-day trial • Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EMS Pro</span>
              </div>
              <p className="text-gray-400">
                The next-generation employee management platform for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <Link to="/features" className="block hover:text-white transition-colors">Features</Link>
                <Link to="/pricing" className="block hover:text-white transition-colors">Pricing</Link>
                <Link to="/integrations" className="block hover:text-white transition-colors">Integrations</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <Link to="/about" className="block hover:text-white transition-colors">About</Link>
                <Link to="/careers" className="block hover:text-white transition-colors">Careers</Link>
                <Link to="/contact" className="block hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <Link to="/help" className="block hover:text-white transition-colors">Help Center</Link>
                <Link to="/docs" className="block hover:text-white transition-colors">Documentation</Link>
                <Link to="/status" className="block hover:text-white transition-colors">Status</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm">
              © 2025 EMS Pro. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
