import React from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FEATURES } from '../constants';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { RocketIcon } from '../assets/icons';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const NewHeroSection = () => (
    <section className="py-16 px-4 text-center">
        <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
             <Card className="p-8 sm:p-16 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                    <RocketIcon className="w-12 h-12 text-brand-primary mb-4" />
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-text-primary dark:text-white">
                        CosmicSplit
                    </h1>
                    <p className="mt-2 text-lg sm:text-xl font-semibold text-brand-primary">
                        Split Smarter. Settle Faster. Spend Fairly.
                    </p>
                    <p className="mt-6 max-w-2xl mx-auto text-base text-text-secondary dark:text-gray-300">
                        Welcome to CosmicSplit, the future of group expense management. Effortlessly track shared costs for trips, projects, and daily life with our AI-powered platform. From smart receipt scanning to automated settlements and fraud detection, we provide top-notch features to ensure every split is fair, transparent, and simple.
                    </p>
                </div>
            </Card>
        </motion.div>
    </section>
);


const FeaturesSection = () => (
    <section id="features" className="py-20 sm:py-32 px-4 bg-light-bg dark:bg-dark-bg">
        <div className="container mx-auto">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need, and more.</h2>
                <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
                    From simple splits to complex settlements, CosmicSplit's powerful features have you covered.
                </p>
            </div>
            <motion.div
                className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {FEATURES.map((feature, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <NavLink to={feature.href} className="block h-full group">
                            <Card className="h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-brand-primary/10 rounded-lg">
                                        <feature.icon className="w-8 h-8 text-brand-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{feature.name}</h3>
                                </div>
                                <p className="mt-4 text-text-secondary">{feature.description}</p>
                            </Card>
                        </NavLink>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);


const TestimonialsSection = () => (
    <section className="py-20 sm:py-32 px-4 bg-light-card dark:bg-dark-bg">
        <div className="container mx-auto max-w-4xl">
            <div className="text-center">
                 <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary dark:text-white">Trusted by crews across the galaxy</h2>
                <p className="mt-4 text-lg text-text-secondary">See what our users are saying about their cosmic journeys with us.</p>
            </div>
            <motion.div 
                className="mt-16 flex flex-col gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {[
                    { name: 'Alex', role: 'World Traveler', quote: "CosmicSplit made our 10-person trip through Europe a breeze. No more awkward money talks!" },
                    { name: 'Jess', role: 'College Student', quote: "My roommates and I use this for everything. Rent, utilities, groceries... it keeps everything fair and simple." },
                ].map((testimonial, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card className="p-8">
                            <blockquote className="flex flex-col h-full">
                                <p className="flex-grow text-text-primary dark:text-dark-text italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                                <footer className="mt-6 text-right">
                                    <p className="font-bold text-text-primary dark:text-dark-text">{testimonial.name}</p>
                                    <p className="text-sm text-text-secondary">{testimonial.role}</p>
                                </footer>
                            </blockquote>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);


const CTASection = () => (
     <section className="py-20 sm:py-32 px-4">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-bold">Ready to Launch Your Next Adventure?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
                Stop worrying about expenses and start making memories. Sign up for CosmicSplit today and join the future of fair spending.
            </p>
            <div className="mt-8">
                <NavLink to="/register" className="inline-block bg-brand-primary hover:opacity-90 text-white px-10 py-4 rounded-lg text-xl font-semibold transition-opacity shadow-lg">
                    Start Splitting
                </NavLink>
            </div>
        </div>
    </section>
);


const LandingPage: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full">
      <NewHeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;