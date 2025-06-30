"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IconUpload,
  IconSparkles,
  IconFileCode,
  IconBolt,
} from "@tabler/icons-react";
import {
  generateDatabaseSchemaMock,
  type GenerationProgress
} from "@/lib/ai-service";
import { type SchemaGenerationInput } from "@/lib/ai-prompts";

export default function NewSchemaPage() {
  const [prompt, setPrompt] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(null);

    try {
      // Prepare input for AI service
      let uploadedSql: string | undefined;
      if (uploadedFile) {
        uploadedSql = await readFileAsText(uploadedFile);
      }

      const input: SchemaGenerationInput = {
        userDescription: prompt.trim(),
        uploadedSql,
        context: {
          isImprovement: !!uploadedFile,
          fileSize: uploadedFile?.size,
          fileName: uploadedFile?.name,
        },
      };

      // Call AI service with progress tracking
      const result = await generateDatabaseSchemaMock(input, (progress) => {
        setGenerationProgress(progress);
      });

      if (result.success && result.data) {
        // TODO: Navigate to results page with the generated schema
        console.log("Generated schema:", result.data);
        // For now, just log the results
        alert(`Schema generated successfully!\n\nSQL Length: ${result.data.sql.length} characters\nSuggestions: ${result.data.suggestions.length}`);
      } else {
        console.error("Generation failed:", result.error);
        alert(`Generation failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error during generation:", error);
      alert("An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const isGenerateDisabled = !prompt.trim() && !uploadedFile;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Schema
          </h1>
          <p className="text-muted-foreground">
            Generate optimized database schemas from natural language or
            existing SQL
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-none">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <IconSparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Describe Your Schema</CardTitle>
                <CardDescription className="text-base">
                  Tell us what you want to build
                  {uploadedFile && " or how to improve your SQL"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Split Layout */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Main Input */}
              <div className="lg:col-span-2 space-y-6">
                {/* File Upload - Inline */}
                <div className="space-y-3">
                  {!uploadedFile ? (
                    <div className="relative group">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-primary/10 transition-colors">
                            <IconUpload className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <Label
                              htmlFor="file-upload"
                              className="cursor-pointer"
                            >
                              <span className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                                Drop your SQL file here
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1">
                                or click to browse • .sql, .txt files
                              </span>
                            </Label>
                          </div>
                        </div>
                        <Input
                          id="file-upload"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".sql,.txt"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <IconFileCode className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {(uploadedFile.size / 1024).toFixed(1)} KB • Ready to
                          analyze
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-100"
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>

                {/* Main Textarea */}
                <div className="space-y-3">
                  <div className="relative">
                    <Textarea
                      id="prompt"
                      placeholder={
                        uploadedFile
                          ? "Tell us how to improve your SQL: 'Add proper indexing, normalize tables, create relationships, optimize performance...'"
                          : "Describe your database: 'I need a blog with users, posts, and comments. Users can create many posts, posts have many comments. Include proper relationships and indexing...'"
                      }
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[140px] resize-none text-base leading-relaxed border-2 focus:border-primary/50 transition-colors w-full"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      {prompt.length}/2000
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full block"></span>
                    The more details you provide, the better your schema will be
                  </p>
                </div>
              </div>

              {/* Right Column - Generate */}
              <div className="flex flex-col space-y-6">
                {/* AI Badge */}
                <div className="flex-1 text-center p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl border border-primary/20">
                  <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                    <IconBolt className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    AI-Powered Generation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI will automatically optimize normalization, indexing,
                    and provide cost analysis
                  </p>
                </div>

                                  {/* Generate Section */}
                  <div className="space-y-4">
                    {isGenerating && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span>{generationProgress?.message || "Analyzing your requirements..."}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${generationProgress?.progress || 0}%` }}
                          />
                        </div>
                        {generationProgress && (
                          <div className="text-xs text-muted-foreground text-center">
                            {generationProgress.progress}% complete
                          </div>
                        )}
                      </div>
                    )}

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerateDisabled || isGenerating}
                    className="w-full h-14 text-base font-semibold"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating Schema...
                      </>
                    ) : (
                      <>
                        <IconBolt className="w-5 h-5 mr-2" />
                        Generate Schema
                      </>
                    )}
                  </Button>

                  {!isGenerating && (
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        ⚡ Usually takes 30-60 seconds
                      </p>
                      {uploadedFile && (
                        <p className="text-sm text-blue-600 font-medium">
                          + Will analyze and improve your SQL
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
