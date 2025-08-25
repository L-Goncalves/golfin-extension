import React from "react";
import { Tabs as ShadcnTabs, TabsList, TabsTrigger, TabsContent } from "~components/ui/tabs";
import { useThemeContext } from "~lib/theme-context";

interface ITab {
  id: string;
  label: string;
  content: React.JSX.Element;
  icon?: React.ReactNode;
}

interface ITabProps {
  tabs: ITab[];
}

const Tabs = ({ tabs }: ITabProps): React.JSX.Element => {
  const defaultValue = tabs[0]?.id || "";
  const { isDarkMode } = useThemeContext();

  return (
    <ShadcnTabs defaultValue={defaultValue} className="w-full space-y-6">
      {/* Modern glassmorphism tab list */}
      <TabsList className="
        flex w-full justify-center
        glass-card border border-glass-white-20 
        bg-gradient-to-r from-glass-white-10 to-glass-white-20 
        p-2 gap-2 h-auto
        backdrop-blur-2xl
        shadow-glass
      ">
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="
              flex-1 relative overflow-hidden
              flex items-center justify-center gap-2
              py-3 px-4 rounded-xl
              font-semibold text-sm
              ${isDarkMode ? 'text-dark-300' : 'text-slate-500'} cursor-pointer
              transition-all duration-400 ease-out
              border border-transparent
              
              ${isDarkMode ? 'hover:text-dark-100' : 'hover:text-slate-700'}
              hover:bg-glass-white-10
              hover:border-glass-white-20
              hover:shadow-lg
              hover:-translate-y-0.5
              
              data-[state=active]:text-white
              data-[state=active]:bg-gradient-to-r
              data-[state=active]:from-neon-cyan-500 
              data-[state=active]:to-neon-purple-500
              data-[state=active]:border-neon-cyan-400/50
              data-[state=active]:shadow-neon-cyan
              data-[state=active]:animate-glow-cyan
              data-[state=active]:-translate-y-1
              data-[state=active]:scale-105
              
              before:absolute before:inset-0
              before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
              before:translate-x-[-100%] before:transition-transform before:duration-700
              hover:before:translate-x-[100%]
              
              group
            "
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            {tab.icon && (
              <span className={`
                transition-all duration-300
                group-data-[state=active]:scale-110
                ${isDarkMode ? 'group-data-[state=active]:text-white' : 'group-data-[state=active]:text-black'}
                group-hover:scale-105
              `}>
                {tab.icon}
              </span>
            )}
            
            {/* Label */}
            <span className={`relative z-10 whitespace-nowrap ${isDarkMode ? 'group-data-[state=active]:text-white' : 'group-data-[state=active]:text-black'}`}>
              {tab.label}
            </span>
            
            {/* Active indicator dot */}
            <div className="
              w-1.5 h-1.5 rounded-full
              bg-neon-pink-400
              opacity-0 scale-0
              transition-all duration-300
              group-data-[state=active]:opacity-100 
              group-data-[state=active]:scale-100
              group-data-[state=active]:animate-pulse
            "></div>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Tab content with animations */}
      {tabs.map((tab, index) => (
        <TabsContent 
          key={tab.id} 
          value={tab.id} 
          className="
            mt-0 space-y-4
            animate-slide-up opacity-0
            data-[state=active]:opacity-100
            data-[state=active]:animate-fade-in
          "
          style={{ 
            animationDelay: '150ms',
            animationFillMode: 'both'
          }}
        >
          <div className="
            glass-card 
            border border-glass-white-20 
            bg-gradient-to-br from-glass-white-10 to-glass-white-20
            backdrop-blur-2xl
            shadow-glass
            hover:border-glass-white-30
            hover:bg-gradient-to-br hover:from-glass-white-20 hover:to-glass-white-10
            transition-all duration-500
            overflow-hidden
            group
          ">
            {/* Content shimmer effect on hover */}
            <div className="
              absolute inset-0 
              bg-gradient-to-r from-transparent via-white/5 to-transparent
              translate-x-[-100%] 
              group-hover:translate-x-[100%]
              transition-transform duration-1000
              pointer-events-none
            "></div>
            
            {/* Tab content */}
            <div className="relative z-10">
              {tab.content}
            </div>
          </div>
        </TabsContent>
      ))}
    </ShadcnTabs>
  );
};

export default Tabs;