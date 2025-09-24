import React, { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

// FIX: Use PropsWithChildren for robust typing of components with children.
type SocialIconProps = PropsWithChildren<{
    href: string;
}>;

const SocialIcon = ({ href, children }: SocialIconProps) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent-cyan transition-colors">
        {children}
    </a>
)

const Footer: React.FC = () => {
  return (
    <footer className="bg-text-primary dark:bg-dark-bg text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white">CosmicSplit</h3>
            <p className="mt-2 text-gray-400">Split Smarter. Settle Faster. Spend Fairly.</p>
            <div className="flex space-x-4 mt-4">
                <SocialIcon href="#">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                </SocialIcon>
                <SocialIcon href="#">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </SocialIcon>
                <SocialIcon href="#">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect></svg>
                </SocialIcon>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h4>
              <ul className="mt-4 space-y-2">
                {['Features', 'Pricing', 'Security'].map(item => (
                    <li key={item}><a href="#" className="text-base text-gray-400 hover:text-white">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h4>
              <ul className="mt-4 space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                    <li key={item}><a href="#" className="text-base text-gray-400 hover:text-white">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h4>
              <ul className="mt-4 space-y-2">
                {['Privacy', 'Terms', 'Licenses'].map(item => (
                    <li key={item}><a href="#" className="text-base text-gray-400 hover:text-white">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} CosmicSplit, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;