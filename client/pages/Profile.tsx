import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setToken, setUser, getUser } from "@/services/api";
import { useNavigate } from "react-router-dom";

export default function Profile(){
  const navigate = useNavigate();
  const user = getUser<any>();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded border p-3">
            <p className="font-medium">{user?.name || 'User'}</p>
            <p className="text-sm text-muted-foreground">{user?.email || 'you@example.com'}</p>
          </div>
          <Button onClick={()=>{ setToken(null); setUser(null); navigate('/login'); }}>Logout</Button>
        </CardContent>
      </Card>
    </div>
  );
}
