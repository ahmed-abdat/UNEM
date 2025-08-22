import { useState } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, Calendar, Clock } from 'lucide-react';

/**
 * Session Selector Component
 * Allows users to choose between regular and complementary BAC sessions
 */
export default function SessionSelector({ 
  currentSession, 
  onSessionChange, 
  availableSessions = [],
  className = "",
  variant = "default" // "default", "compact", "cards"
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Session configurations with display info
  const sessionDisplayInfo = {
    regular: {
      title: 'الدورة العادية',
      subtitle: 'نتائج الدورة العادية للباكلوريا 2025',
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    complementary: {
      title: 'الدورة التكميلية',
      subtitle: 'نتائج الدورة التكميلية للباكلوريا 2025',
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200'
    }
  };

  const handleSessionSelect = (sessionKey) => {
    onSessionChange(sessionKey);
    setIsOpen(false);
  };

  const currentSessionInfo = sessionDisplayInfo[currentSession] || sessionDisplayInfo.regular;

  // Compact variant for mobile or smaller spaces
  if (variant === "compact") {
    return (
      <div className={cn("relative", className)}>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          اختر الدورة
        </Label>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full justify-between text-right",
              currentSessionInfo.borderColor,
              currentSessionInfo.bgColor
            )}
          >
            <div className="flex items-center gap-2">
              <currentSessionInfo.icon className="h-4 w-4" />
              <span className="font-medium">{currentSessionInfo.title}</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )} />
          </Button>
          
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50">
              {availableSessions.map(session => {
                const sessionInfo = sessionDisplayInfo[session.key];
                if (!sessionInfo) return null;
                
                return (
                  <button
                    key={session.key}
                    onClick={() => handleSessionSelect(session.key)}
                    className={cn(
                      "w-full px-3 py-2 text-right hover:bg-gray-50 flex items-center gap-2 transition-colors",
                      currentSession === session.key && "bg-blue-50"
                    )}
                  >
                    <sessionInfo.icon className="h-4 w-4" />
                    <span>{sessionInfo.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Cards variant for better visual distinction
  if (variant === "cards") {
    return (
      <div className={cn("space-y-3", className)}>
        <Label className="text-lg font-medium text-gray-800 block text-center">
          اختر دورة الباكلوريا
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableSessions.map(session => {
            const sessionInfo = sessionDisplayInfo[session.key];
            if (!sessionInfo) return null;
            
            const isSelected = currentSession === session.key;
            const IconComponent = sessionInfo.icon;
            
            return (
              <button
                key={session.key}
                onClick={() => handleSessionSelect(session.key)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-right hover:shadow-md",
                  isSelected 
                    ? `${sessionInfo.borderColor} ${sessionInfo.bgColor} shadow-md` 
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    isSelected ? sessionInfo.color : "bg-gray-100"
                  )}>
                    <IconComponent className={cn(
                      "h-5 w-5",
                      isSelected ? "text-white" : "text-gray-600"
                    )} />
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-semibold text-lg",
                      isSelected ? sessionInfo.textColor : "text-gray-800"
                    )}>
                      {sessionInfo.title}
                    </h3>
                    <p className={cn(
                      "text-sm",
                      isSelected ? sessionInfo.textColor : "text-gray-600"
                    )}>
                      {sessionInfo.subtitle}
                    </p>
                  </div>
                  {isSelected && (
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      sessionInfo.color
                    )} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default variant - simple button group
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-base font-medium text-gray-700">
        اختر الدورة
      </Label>
      <div className="flex flex-col sm:flex-row gap-2">
        {availableSessions.map(session => {
          const sessionInfo = sessionDisplayInfo[session.key];
          if (!sessionInfo) return null;
          
          const isSelected = currentSession === session.key;
          const IconComponent = sessionInfo.icon;
          
          return (
            <Button
              key={session.key}
              variant={isSelected ? "default" : "outline"}
              onClick={() => handleSessionSelect(session.key)}
              className={cn(
                "flex-1 justify-start gap-2 text-right",
                isSelected && `${sessionInfo.color} hover:${sessionInfo.color}/90`
              )}
            >
              <IconComponent className="h-4 w-4" />
              <span>{sessionInfo.title}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
