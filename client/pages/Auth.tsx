import { useState } from "react";
import { api, setToken, setUser } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onLogin() {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  }

  async function onRegister() {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", { name, email, password });
      setToken(data.token);
      setUser(data.user);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[calc(100vh-64px-64px)] grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.25),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.25),transparent_40%)]" />
        <div className="h-full w-full bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\'><defs><radialGradient id=\'g\' cx=\'50%\' cy=\'50%\' r=\'50%\'><stop offset=\'0%\' stop-color=\'%23ffffff22\'/><stop offset=\'100%\' stop-color=\'transparent\'/></radialGradient></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23g)\'/></svg>')] bg-center" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500" />
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Shared Expense Manager
            </h1>
            <p className="mt-3 text-white/70 text-lg">AI‑Powered Group Expense Splitting</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login">
            <TabsList className="w-full">
              <TabsTrigger className="w-1/2" value="login">Login</TabsTrigger>
              <TabsTrigger className="w-1/2" value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6 space-y-4" aria-label="Login form">
              <div>
                <label className="text-sm font-medium" htmlFor="lemail">Email</label>
                <Input id="lemail" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="lpassword">Password</label>
                <Input id="lpassword" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" aria-label="Password" />
              </div>
              <div className="flex items-center justify-between">
                <a className="text-sm text-accent hover:underline" href="#">Forgot password?</a>
              </div>
              <Button disabled={loading} className="w-full" onClick={onLogin} aria-label="Submit login">{loading ? "Loading..." : "Sign In"}</Button>
            </TabsContent>
            <TabsContent value="register" className="mt-6 space-y-4" aria-label="Register form">
              <div>
                <label className="text-sm font-medium" htmlFor="rname">Name</label>
                <Input id="rname" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" aria-label="Name" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="remail">Email</label>
                <Input id="remail" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="rpassword">Password</label>
                <Input id="rpassword" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Create a password" aria-label="Password" />
              </div>
              <Button disabled={loading} className="w-full" onClick={onRegister} aria-label="Submit register">{loading ? "Creating..." : "Create Account"}</Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
    </div>
  );
}
