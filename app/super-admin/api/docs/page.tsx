import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Code, ExternalLink, FileText } from "lucide-react";

export default function SuperAdminApiDocsPage() {
  const endpoints = [
    {
      id: 1,
      path: "/api/v1/users",
      method: "GET",
      description: "Retrieve a list of users",
      auth: "JWT",
      status: "Active",
    },
    {
      id: 2,
      path: "/api/v1/backups",
      method: "POST",
      description: "Create a new system backup",
      auth: "API Key",
      status: "Active",
    },
    {
      id: 3,
      path: "/api/v1/reports",
      method: "GET",
      description: "Generate analytics reports",
      auth: "JWT",
      status: "Deprecated",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
            <p className="text-muted-foreground">View and manage API endpoints and docs</p>
          </div>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Export Docs
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{endpoints.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                {endpoints.filter((e) => e.status === "Active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Deprecated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {endpoints.filter((e) => e.status === "Deprecated").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Path</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Auth</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoints.map((endpoint) => (
                  <TableRow key={endpoint.id}>
                    <TableCell className="font-mono text-sm">{endpoint.path}</TableCell>
                    <TableCell>
                      <Code className="h-4 w-4 mr-1 inline" />
                      {endpoint.method}
                    </TableCell>
                    <TableCell>{endpoint.description}</TableCell>
                    <TableCell>{endpoint.auth}</TableCell>
                    <TableCell>
                      <Badge variant={endpoint.status === "Active" ? "default" : "secondary"}>
                        {endpoint.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}