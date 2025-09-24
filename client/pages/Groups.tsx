import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Groups() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Groups</CardTitle>
          <CardDescription>Create or join groups. API integration pending.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button>Create Group</Button>
            <Button variant="outline">Join via Code</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
