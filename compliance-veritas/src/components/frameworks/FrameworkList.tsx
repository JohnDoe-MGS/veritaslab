"use client";

import { useFrameworks } from "@/contexts/FrameworkContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function FrameworkList() {
  const { frameworks } = useFrameworks();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {frameworks.map((framework) => (
        <Card key={framework.id}>
          <CardHeader>
            <CardTitle>{framework.name}</CardTitle>
            <CardDescription>{framework.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Compliance Level</span>
              <Badge>{framework.complianceLevel}%</Badge>
            </div>
            <Progress value={framework.complianceLevel} className="w-full" />
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Last Assessment:</strong>{" "}
                {new Date(framework.lastAssessment).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {framework.status}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}