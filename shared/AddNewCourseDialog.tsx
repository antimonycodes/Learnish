"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import {
  Loader2Icon,
  BookOpen,
  Brain,
  FileText,
  CheckCircle,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormData = {
  name: string;
  description: string;
  difficulty: string;
  category: string;
  noOfChapters: number;
};

type GenerationStep = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
};

const AddNewCourseDialog = ({ children }: any) => {
  const [loading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    difficulty: "",
    category: "",
    noOfChapters: 10,
  });

  const generationSteps: GenerationStep[] = [
    {
      id: "analyzing",
      label: "Analyzing Requirements",
      description: "Processing your course requirements and preferences",
      icon: <Brain className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "structuring",
      label: "Creating Course Structure",
      description: "Building the course outline and chapter breakdown",
      icon: <BookOpen className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "content",
      label: "Generating Content Framework",
      description: "Creating detailed content plans for each chapter",
      icon: <FileText className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "finalizing",
      label: "Finalizing Course",
      description: "Putting everything together and preparing your course",
      icon: <CheckCircle className="w-4 h-4" />,
      completed: false,
    },
  ];

  const router = useRouter();

  const handleFormInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const simulateProgress = () => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < generationSteps.length) {
        setCurrentStep(step);
        setProgress(((step + 1) / generationSteps.length) * 100);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 15000); // Each step takes 2 seconds

    return interval;
  };

  const resetDialogState = () => {
    setProgress(0);
    setCurrentStep(0);
    setFormData({
      name: "",
      description: "",
      difficulty: "",
      category: "",
      noOfChapters: 10,
    });
  };

  const Generate = async () => {
    setIsLoading(true);
    const courseId = uuidv4();

    // Start progress simulation
    const progressInterval = simulateProgress();

    try {
      const response = await axios.post("/api/generate-course-layout", {
        ...formData,
        courseId: courseId,
      });

      // Clear the progress interval
      clearInterval(progressInterval);

      if (response.data.error?.includes("Limit exceeded")) {
        setIsLoading(false);
        setOpen(false);
        resetDialogState();

        toast.warning("Limit reached, please subscribe");
        router.push(`/workspace/billing`);
        return;
      }

      // Show completion
      setCurrentStep(generationSteps.length - 1);
      setProgress(100);

      // Success toast
      toast.success("Course generated successfully!");

      // Close dialog and reset state before navigation
      setOpen(false);
      resetDialogState();

      // Navigate to edit course page
      router.push(`/workspace/edit-course/${response.data?.courseId}`);
    } catch (error: any) {
      console.error(error);
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(0);
      setCurrentStep(0);

      const errorMessage =
        error.response?.data?.error || "Failed to generate course";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() && formData.difficulty && formData.category.trim();

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!loading) {
          // Only allow closing if not loading
          setOpen(newOpen);
          if (!newOpen) {
            resetDialogState();
          }
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Course Using AI</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4 mt-3">
              {!loading ? (
                // Form content
                <>
                  <div>
                    <label className="text-sm font-medium">Course name *</label>
                    <Input
                      placeholder="e.g., Introduction to React"
                      value={formData.name}
                      onChange={(e) =>
                        handleFormInputChange("name", e?.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Course Description (optional)
                    </label>
                    <Textarea
                      placeholder="Brief description of what students will learn"
                      value={formData.description}
                      onChange={(e) =>
                        handleFormInputChange("description", e?.target.value)
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Difficulty *</label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) =>
                        handleFormInputChange("difficulty", value)
                      }
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Category *</label>
                    <Input
                      placeholder="e.g., Programming, Web Development"
                      value={formData.category}
                      onChange={(e) =>
                        handleFormInputChange("category", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={Generate}
                      className="w-full"
                      disabled={!isFormValid}
                    >
                      Generate Course
                    </Button>
                  </div>
                </>
              ) : (
                // Loading content with progress
                <div className="py-6 px-2">
                  <div className="text-center mb-6">
                    <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold text-lg">
                      Generating Your Course
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This may take a few moments, please don't close this
                      window
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      {generationSteps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                            index <= currentStep
                              ? "bg-primary/10 border border-primary/20"
                              : "bg-muted/50"
                          }`}
                        >
                          <div
                            className={`mt-0.5 ${
                              index < currentStep
                                ? "text-green-600"
                                : index === currentStep
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {index < currentStep ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              step.icon
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium text-sm ${
                                index <= currentStep
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {step.description}
                            </div>
                          </div>
                          {index === currentStep && (
                            <Loader2Icon className="w-4 h-4 animate-spin text-primary mt-0.5" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCourseDialog;
