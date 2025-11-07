import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockQuestions = [
  { id: 1, clientName: 'John Doe', question: 'What are the best exercises for back pain?', status: 'new', date: '2023-10-26' },
  { id: 2, clientName: 'Jane Smith', question: 'Can I substitute almonds for walnuts in my snack?', status: 'answered', date: '2023-10-25' },
  { id: 3, clientName: 'Peter Jones', question: 'I missed a workout, what should I do?', status: 'new', date: '2023-10-26' },
  { id: 4, clientName: 'Mary Johnson', question: 'How much water should I be drinking daily?', status: 'answered', date: '2023-10-24' },
];

export default function TrainerQuestionsPage() {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-bold">Client Questions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockQuestions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{q.clientName}</TableCell>
                  <TableCell>{q.question}</TableCell>
                  <TableCell>{q.date}</TableCell>
                  <TableCell>
                    <Badge variant={q.status === 'new' ? 'default' : 'secondary'}>
                      {q.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {q.status === 'new' ? 'Reply' : 'View'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}