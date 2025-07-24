import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RiskChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Riscos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Risk Chart Placeholder</p>
        </div>
      </CardContent>
    </Card>
  );
}