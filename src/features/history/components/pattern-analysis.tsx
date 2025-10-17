"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { PatternAnalysis } from "../types";

interface PatternAnalysisProps {
  analysis: PatternAnalysis;
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "improving":
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    case "declining":
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    default:
      return <Minus className="w-4 h-4 text-gray-600" />;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "improving":
      return "text-green-600";
    case "declining":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

export default function PatternAnalysisCard({
  analysis,
}: PatternAnalysisProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Overall Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {getTrendIcon(analysis.trend)}
            <span
              className={`font-medium capitalize ${getTrendColor(
                analysis.trend
              )}`}
            >
              {analysis.trend}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Most common diagnosis:{" "}
              <span className="font-medium">
                {analysis.mostCommonDiagnosis}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Average confidence:{" "}
              <span className="font-medium">{analysis.averageConfidence}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Symptom Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analysis.symptomTrends).map(([symptom, trend]) => (
              <div key={symptom} className="flex items-center justify-between">
                <span className="text-sm capitalize">
                  {symptom.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trend)}
                  <span
                    className={`text-sm capitalize ${getTrendColor(trend)}`}
                  >
                    {trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-blue-600 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
