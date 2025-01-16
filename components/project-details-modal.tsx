"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectDetailsModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailsModal({
  project,
  open,
  onOpenChange,
}: ProjectDetailsModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">About the Project</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Optional: Add these fields to your Project type and model if you want to include them */}
            <div className="flex gap-4">
              {project.liveUrl && (
                <Button variant="outline" className="gap-2" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Live Preview
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" className="gap-2" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    View Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}