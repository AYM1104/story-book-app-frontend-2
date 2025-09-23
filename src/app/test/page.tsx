"use client";

import BackgroundStars from "../../components/BackgroundStars";
import LoginCard from "../../components/LoginCard";
import Button from "@/components/button/Button";

export default function Page() {
  const handleLogin = (email: string, password: string) => {
    console.log(email, password);
  };
  return (
    <BackgroundStars>
      <main className="p-8 text-white">
        <h1 className="text-2xl font-bold">えほんのたね</h1>
        <p>ここにUIを載せると、星は背景になります。</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost" size="sm">Ghost Small</Button>
          <Button size="lg">Large</Button>
          <Button fullWidth>Full Width</Button>
          <Button disabled>Disabled</Button>
        </div>
        {/* <LoginCard onSubmit={handleLogin} /> */}
      </main>
    </BackgroundStars>
  );
}
