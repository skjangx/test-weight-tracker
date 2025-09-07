export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Weight Tracker ⚖️
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Track progress, reach your goals
        </p>
        <div className="max-w-md mx-auto p-6 bg-card border border-border rounded-lg shadow-sm">
          <p className="text-sm text-muted-foreground">
            Welcome to your weight tracking journey!
          </p>
        </div>
      </div>
    </main>
  );
}