import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, User, Bell, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { MenuBase, MenuItem } from '../components/ui/MenuBase';
import { KineticText } from '../components/ui/KineticText';
import { SUBJECT_REGISTRY } from '../design-system/crivoSubjects';

export default function CrivoDesignSystemGallery() {
  const [activeSubject, setActiveSubject] = useState<string>('biologia');

  const subjects: string[] = Object.keys(SUBJECT_REGISTRY);
  const profile = SUBJECT_REGISTRY[activeSubject];

  const menuItems: MenuItem[] = [
    { id: '1', label: 'Profile Settings', icon: <User /> },
    { id: '2', label: 'Notifications', icon: <Bell /> },
    { id: '3', label: 'System Preferences', icon: <Settings /> },
    { id: '4', label: 'Log Out', icon: <LogOut />, destructive: true },
  ];

  return (
    <div className="min-h-screen bg-background-base p-8 text-text-primary">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header & Subject Selector */}
        <header className="space-y-4">
          <KineticText as="h2" text="Crivo Design System" runKey="gallery-header" className="text-4xl font-bold" />
          <p className="text-text-secondary">
            Testando a convergência visual, geometria e movimento através dos componentes base.
          </p>

          <div className="flex flex-wrap gap-2 pt-4">
            {subjects.map((sub) => (
              <Button
                key={sub}
                size="sm"
                variant={activeSubject === sub ? 'primary' : 'secondary'}
                onClick={() => setActiveSubject(sub)}
                subject={sub}
              >
                {SUBJECT_REGISTRY[sub].label}
              </Button>
            ))}
          </div>
        </header>

        {/* Current Theme Info */}
        <Panel elevation="secondary" className="p-6" subject={activeSubject}>
          <h2 className="text-xl font-semibold mb-2">Active Universe: {profile.label}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text-secondary">
            <div><strong>Field Type:</strong> {profile.fieldType}</div>
            <div><strong>Color (Dark):</strong> <span className={`inline-block w-3 h-3 rounded-full`} style={{ backgroundColor: profile.palettes.dark.primary }} /> {profile.palettes.dark.primary}</div>
            <div><strong>Core Type:</strong> {profile.coreType}</div>
          </div>
        </Panel>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-border-subtle pb-2">Buttons</h2>
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="primary" subject={activeSubject}>Primary Action</Button>
            <Button variant="secondary" subject={activeSubject}>Secondary Action</Button>
            <Button variant="ghost" subject={activeSubject}>Ghost Action</Button>
            <Button variant="destructive" subject={activeSubject}>Destructive</Button>
            <Button variant="primary" loading subject={activeSubject}>Loading</Button>
            <Button variant="primary" disabled subject={activeSubject}>Disabled</Button>
          </div>
        </section>

        {/* Panels / Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-border-subtle pb-2">Cards & Panels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Panel elevation="default" subject={activeSubject} className="p-6 h-40 flex flex-col justify-between">
              <h3 className="font-medium">Default Panel</h3>
              <p className="text-sm text-text-secondary">Standard structural container.</p>
            </Panel>

            <Panel elevation="secondary" subject={activeSubject} className="p-6 h-40 flex flex-col justify-between">
              <h3 className="font-medium">Secondary Panel</h3>
              <p className="text-sm text-text-secondary">Used for grouped or subordinate content.</p>
            </Panel>

            <Panel elevation="elevated" subject={activeSubject} interactive className="p-6 h-40 flex flex-col justify-between">
              <h3 className="font-medium">Interactive Panel</h3>
              <p className="text-sm text-text-secondary">Hover me to see the {profile.label} motion field in action!</p>
            </Panel>
          </div>
        </section>

        {/* Menus Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-border-subtle pb-2">Context Menus & Dropdowns</h2>
          <div className="flex gap-12">
            <MenuBase
              items={menuItems}
              subject={activeSubject}
              trigger={
                <Button variant="secondary" subject={activeSubject}>
                  Options Menu <ChevronDown className="w-4 h-4" />
                </Button>
              }
            />

            <MenuBase
              items={menuItems.slice(0, 2)}
              subject={activeSubject}
              align="right"
              trigger={
                <Button variant="primary" subject={activeSubject}>
                  Quick Actions
                </Button>
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}
