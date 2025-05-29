import React, { useState, useEffect } from 'react';
import { Folder, Plus, Save, Download, Upload, Trash2, Star, StarOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { CodePayload } from '../LiveUIPreview';
import { useAuth } from '../Auth';

interface Component {
  id: string;
  name: string;
  code: CodePayload;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  components: Component[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectSystemProps {
  currentComponent?: CodePayload;
  onLoadComponent: (component: Component) => void;
}

export const ProjectSystem: React.FC<ProjectSystemProps> = ({ 
  currentComponent, 
  onLoadComponent 
}) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newComponentName, setNewComponentName] = useState('');
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showSaveComponentDialog, setShowSaveComponentDialog] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = () => {
    if (user) {
      // Load from cloud storage (implement backend API)
      // For now, use localStorage as fallback
      const savedProjects = localStorage.getItem(`projects_${user.id}`);
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } else {
      // Guest mode - use localStorage
      const savedProjects = localStorage.getItem('guest_projects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    }
  };

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    const storageKey = user ? `projects_${user.id}` : 'guest_projects';
    localStorage.setItem(storageKey, JSON.stringify(updatedProjects));
  };

  const createProject = () => {
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      description: '',
      components: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    setSelectedProject(newProject);
    setNewProjectName('');
    setShowNewProjectDialog(false);
  };

  const saveComponent = () => {
    if (!currentComponent || !newComponentName.trim() || !selectedProject) return;

    const newComponent: Component = {
      id: Date.now().toString(),
      name: newComponentName,
      code: currentComponent,
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false
    };

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          components: [...project.components, newComponent],
          updatedAt: new Date()
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id) || null);
    setNewComponentName('');
    setShowSaveComponentDialog(false);
  };

  const toggleFavorite = (componentId: string) => {
    if (!selectedProject) return;

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          components: project.components.map(comp => 
            comp.id === componentId 
              ? { ...comp, isFavorite: !comp.isFavorite }
              : comp
          )
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id) || null);
  };

  const exportProject = (project: Project) => {
    const exportData = {
      project,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Projects</h2>
        <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createProject}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <div className="space-y-2">
        {projects.map(project => (
          <Card key={project.id} className={`cursor-pointer transition-colors ${
            selectedProject?.id === project.id ? 'bg-blue-50 border-blue-300' : ''
          }`}>
            <CardContent className="p-3" onClick={() => setSelectedProject(project)}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    {project.components.length} components
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    exportProject(project);
                  }}
                >
                  <Download size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Project Components */}
      {selectedProject && (
        <Card className="glass-card">
          <CardHeader className="border-b border-white/20">
            <CardTitle className="text-white flex justify-between items-center">
              <span>{selectedProject.name}</span>
              <Dialog open={showSaveComponentDialog} onOpenChange={setShowSaveComponentDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" disabled={!currentComponent}>
                    <Save size={16} className="mr-1" />
                    Save Current
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Component</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Component name"
                      value={newComponentName}
                      onChange={(e) => setNewComponentName(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowSaveComponentDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveComponent}>Save</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {selectedProject.components.map(component => (
                <div key={component.id} className="flex items-center justify-between p-2 bg-white/10 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-white">{component.name}</span>
                    {component.isFavorite && <Star size={14} className="text-yellow-400 fill-current" />}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(component.id)}
                    >
                      {component.isFavorite ? 
                        <StarOff size={14} /> : 
                        <Star size={14} />
                      }
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onLoadComponent(component)}
                    >
                      Load
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectSystem;