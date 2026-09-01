import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/cn';
import { getMotionConfigForSubject } from '../../design-system/crivoMotionPresets';

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}

export interface MenuBaseProps {
  items: MenuItem[];
  trigger: React.ReactNode;
  subject?: string;
  className?: string;
  align?: 'left' | 'right';
}

export function MenuBase({ items, trigger, subject, className, align = 'left' }: MenuBaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const motionConfig = getMotionConfigForSubject(subject);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute z-50 mt-2 w-56 rounded-card border border-border-subtle bg-surface-elevated shadow-soft-lg overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
          >
            <motion.div
              variants={motionConfig.containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col p-1"
            >
              {items.map((item) => (
                <motion.button
                  key={item.id}
                  variants={motionConfig.itemVariants}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                    item.destructive
                      ? 'text-red-500 hover:bg-red-500/10'
                      : 'text-text-primary hover:bg-surface-secondary'
                  )}
                >
                  {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
