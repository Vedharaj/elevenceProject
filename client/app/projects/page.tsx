"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/Axiosinstance";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CardSkeleton } from "@/components/ui/loader-components";
import { EmptyState, ErrorState } from "@/components/ui/feedback-states";

const page = () => {
  const router = useRouter();
  const { user, setSelectedProject } = useAuth();
  const [project, setProject] = useState([]);
  const [issuesbyproject, setissuesbyproject] = useState<any>({});
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchproject = async () => {
    try {
      setloading(true);
      setError(null);
      const res = await axiosInstance.get("api/projects");
      const userproject = res.data?.filter(
        (p: any) => p.ownerId === user?.id || (p.memberIds && p.memberIds.includes(user?.id)),
      );
      setProject(userproject || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load projects. Please verify your connection or server status.");
    } finally {
      setloading(false);
    }
  };

  const fetchissuesforproject = async (projectid: string) => {
    try {
      const res = await axiosInstance.get(`api/issues/project/${projectid}`);
      setissuesbyproject((prev: any) => ({
        ...prev,
        [projectid]: res.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchproject();
  }, [user]);

  useEffect(() => {
    project.forEach((proj: any) => {
      fetchissuesforproject(proj.id);
    });
  }, [project]);

  const redirectproject = () => {
    router.push("/create-project");
  };

  return (
    <div className="flex h-full flex-col p-6 scrollbar-container">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#172B4D] mb-2">Projects</h1>
        <p className="text-[#5E6C84]">Manage and view all your projects</p>
      </div>

      <Button
        className="mb-6 bg-[#0052CC] text-white hover:bg-[#0747A6] w-fit font-medium"
        onClick={redirectproject}
        disabled={loading}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Project
      </Button>

      {error ? (
        <ErrorState onRetry={fetchproject} isRetrying={loading} message={error} />
      ) : loading ? (
        <CardSkeleton />
      ) : project.length === 0 ? (
        <EmptyState
          type="projects"
          action={{
            label: "Create your first project",
            onClick: redirectproject,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.map((proj: any) => {
            const projectIssues = issuesbyproject[proj.id] || [];

            return (
              <Card
                key={proj.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-[#172B4D]">
                        {proj.name}
                      </CardTitle>
                      <CardDescription>Key: {proj.key}</CardDescription>
                    </div>
                    <Badge variant="outline">{proj.key}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-[#5E6C84]">
                      {proj.description || "No description"}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[#5E6C84]">
                        <Users className="h-4 w-4" />
                        <span>{proj.memberIds?.length || 0} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5E6C84]">
                        <span>{projectIssues?.length || 0} issues</span>
                      </div>
                    </div>

                    <Link href={`/`} onClick={() => setSelectedProject(proj)}>
                      <Button
                        variant="outline"
                        className="w-full mt-4 text-[#0052CC] border-[#0052CC] hover:bg-[#DEEBFF] bg-transparent font-medium"
                      >
                        View Board
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default page;
