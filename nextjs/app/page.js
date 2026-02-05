import Profile from "@/Components/Profile";

export default function Home() {
  return (
    <div className="h-[calc(100vh-76px)] flex items-center justify-center overflow-hidden flex-col">
      <h1 className="text-7xl">Technical Agency </h1>
      <Profile />
    </div>
  );
}
