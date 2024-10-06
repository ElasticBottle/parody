import { Button } from "@parody/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@parody/ui/card";
import { Input } from "@parody/ui/input";
import { Label } from "@parody/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@parody/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@parody/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute(
  "/dashboard/$teamName/$projectName/playground",
)({
  component: () => <PlaygroundPage />,
});

export const PlaygroundPage = () => {
  const [redirectUrl, setRedirectUrl] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  const keys = [
    { id: "public_key_test", name: "Public Key 1" },
    { id: "public_key_test1", name: "Public Key 2" },
    { id: "public_key_test2", name: "Public Key 3" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", { redirectUrl, selectedKey });
  };

  const loginWithSocial = (provider: string) => {
    const url = new URL(
      `https://parody-elasticbottle-apiscript.winstonyeo99.workers.dev/login/${provider}`,
    );
    url.searchParams.set("redirectUrl", redirectUrl);
    url.searchParams.set("publicKey", selectedKey);
    window.location.href = url.href;
  };

  return (
    <div className="container mx-auto space-y-8 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="url">Direct URL</Label>
            <Input
              id="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="Enter URL"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="publicKey">Public Key</Label>
            <Select value={selectedKey} onValueChange={setSelectedKey}>
              <SelectTrigger id="publicKey">
                <SelectValue placeholder="Select a public key" />
              </SelectTrigger>
              <SelectContent>
                {keys?.map((key) => (
                  <SelectItem key={key.id} value={key.id}>
                    {key.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>

      <Tabs defaultValue="snippets">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="snippets">Code Snippets</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="snippets">
          <Card>
            <CardHeader>
              <CardTitle>Code Snippets</CardTitle>
              <CardDescription>View and copy code snippets.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-muted p-4">
                <code>{`
const example = () => {
  console.log("This is a code snippet");
};

example();
                `}</code>
              </pre>
            </CardContent>
            <CardFooter>
              <Button>Copy Code</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to log in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter your username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
              <hr />
              <Button className="w-full">Log In</Button>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => loginWithSocial("discord")}
              >
                Log In With Discord
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
