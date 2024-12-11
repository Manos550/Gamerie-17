import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad, Users, Trophy, Swords, Shield, UserPlus, ArrowRight, Star, Zap, Globe, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gaming-dark text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#00ff9d33,#13141c_50%)]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gaming-dark/50 to-gaming-dark" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gamepad className="w-8 h-8 text-gaming-neon animate-glow" />
                <span className="text-2xl font-display font-bold">GAMERIE</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gaming-neon text-black rounded-lg hover:bg-gaming-neon/90 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative min-h-[calc(100vh-80px)] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="relative z-10">
                <h1 className="text-5xl sm:text-7xl font-display font-bold mb-6 leading-tight">
                  Welcome to the <span className="text-gaming-neon">Future</span> of Gaming
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-xl">
                  Join the ultimate gaming network where professional players, teams, and opportunities converge to shape the future of competitive gaming.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gaming-neon text-black rounded-lg hover:bg-gaming-neon/90 transition-all transform hover:scale-105 font-display font-bold group"
                  >
                    <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Join Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gaming-dark border border-gaming-neon text-gaming-neon rounded-lg hover:bg-gaming-neon hover:text-black transition-all font-display font-bold"
                  >
                    Already a member?
                  </Link>
                </div>
              </div>

              {/* Right Column - Hero Images */}
              <div className="relative hidden lg:block">
                <div className="relative w-full h-[600px]">
                  {/* Main Character Image */}
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"
                    alt="Cyberpunk Character"
                    className="absolute top-0 right-0 w-4/5 h-4/5 object-cover rounded-lg shadow-2xl shadow-gaming-neon/20 z-20"
                  />
                  {/* Secondary Character Image */}
                  <img
                    src="https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80"
                    alt="Cyberpunk Team"
                    className="absolute bottom-0 left-0 w-3/4 h-3/4 object-cover rounded-lg shadow-2xl shadow-gaming-neon/20 z-10"
                  />
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gaming-neon/20 rounded-full blur-3xl" />
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-gaming-neon/20 rounded-full blur-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative py-24 bg-gaming-dark border-t border-gaming-neon/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00ff9d11,transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Level Up Your <span className="text-gaming-neon">Gaming Experience</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join a community of passionate gamers and take your gaming career to new heights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="group bg-gaming-card/80 backdrop-blur-sm p-8 rounded-xl border border-gaming-neon/20 hover:border-gaming-neon/40 transition-all">
              <Shield className="w-12 h-12 text-gaming-neon mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-xl font-bold mb-4">Professional Teams</h3>
              <p className="text-gray-400">Create or join professional gaming teams, compete in tournaments, and climb the rankings together.</p>
            </div>

            <div className="group bg-gaming-card/80 backdrop-blur-sm p-8 rounded-xl border border-gaming-neon/20 hover:border-gaming-neon/40 transition-all">
              <Trophy className="w-12 h-12 text-gaming-neon mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-xl font-bold mb-4">Competitive Matches</h3>
              <p className="text-gray-400">Participate in ranked matches, tournaments, and special events with players worldwide.</p>
            </div>

            <div className="group bg-gaming-card/80 backdrop-blur-sm p-8 rounded-xl border border-gaming-neon/20 hover:border-gaming-neon/40 transition-all">
              <Star className="w-12 h-12 text-gaming-neon mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-xl font-bold mb-4">Skill Development</h3>
              <p className="text-gray-400">Track your progress, get coaching from pros, and improve your gaming skills systematically.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="relative py-24 bg-gaming-card/50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00ff9d11,transparent_70%)]" />
          <img
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80"
            alt="Gaming Community"
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">
                Join Our <span className="text-gaming-neon">Elite</span> Community
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Connect with like-minded players, form teams, and compete in tournaments. Your gaming journey starts here.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-display font-bold text-gaming-neon mb-2">10K+</div>
                  <div className="text-gray-400">Active Players</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-display font-bold text-gaming-neon mb-2">500+</div>
                  <div className="text-gray-400">Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-display font-bold text-gaming-neon mb-2">100+</div>
                  <div className="text-gray-400">Tournaments</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-display font-bold text-gaming-neon mb-2">20+</div>
                  <div className="text-gray-400">Games</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"
                alt="Gaming Community"
                className="rounded-lg shadow-2xl shadow-gaming-neon/20"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gaming-neon/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 bg-gaming-dark">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00ff9d22,transparent_70%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-display font-bold mb-6">
            Ready to <span className="text-gaming-neon">Level Up</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Join thousands of gamers who have already taken their gaming to the next level with Gamerie.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-12 py-6 bg-gaming-neon text-black rounded-xl hover:bg-gaming-neon/90 transition-all transform hover:scale-105 font-display font-bold text-xl group"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Start Your Journey
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gaming-card border-t border-gaming-neon/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Gamepad className="w-8 h-8 text-gaming-neon" />
              <span className="font-display font-bold text-2xl">GAMERIE</span>
            </div>
            <div className="flex items-center gap-8">
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                Register
              </Link>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
            </div>
            <div className="text-gray-400">
              © {new Date().getFullYear()} Gamerie. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}