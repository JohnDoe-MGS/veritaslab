import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    action: "New risk created",
    user: "Admin",
    timestamp: "2 hours ago",
    details: "Risk 'Data Breach' created in 'Operational'",
  },
  {
    action: "Action plan updated",
    user: "John Doe",
    timestamp: "5 hours ago",
    details: "Action plan 'AC-001' updated to 'In Progress'",
  },
  {
    action: "Framework assessed",
    user: "Jane Smith",
    timestamp: "1 day ago",
    details: "ISO 37301 assessment completed",
  },
  {
    action: "Risk mitigated",
    user: "Admin",
    timestamp: "2 days ago",
    details: "Risk 'Financial Misstatement' mitigated",
  },
];

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {activity.user.substring(0, 2)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500">{activity.details}</p>
                <p className="text-xs text-gray-400">{activity.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}