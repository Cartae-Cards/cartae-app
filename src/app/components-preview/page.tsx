import Badge from "@/app/components/ui/badge";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import LoadingSpinner from "@/app/components/ui/loadingspinner";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function ComponentsPreviewPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] p-12">
      <h1 className="text-3xl font-bold text-[#0f1f3d] mb-10">Component Preview</h1>

      <div className="flex flex-col gap-12">

        {/* Button */}
        <Section title="Button — variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </Section>

        <Section title="Button — sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Section>

        <Section title="Button — states">
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </Section>

        {/* Badge */}
        <Section title="Badge — language">
          <Badge variant="language">EN</Badge>
          <Badge variant="language">JP</Badge>
          <Badge variant="language">KR</Badge>
        </Section>

        <Section title="Badge — condition">
          <Badge variant="condition">NM</Badge>
          <Badge variant="condition">LP</Badge>
          <Badge variant="condition">MP</Badge>
          <Badge variant="condition">HP</Badge>
          <Badge variant="condition">DMG</Badge>
        </Section>

        <Section title="Badge — grade">
          <Badge variant="grade">PSA 10</Badge>
          <Badge variant="grade">BGS 9.5</Badge>
          <Badge variant="grade">CGC 10</Badge>
        </Section>

        <Section title="Badge — default">
          <Badge>Default</Badge>
        </Section>

        {/* Card */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Card</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <Card>
              <p className="text-sm text-gray-600">Plain card — no hover effect.</p>
            </Card>
            <Card hover>
              <p className="text-sm text-gray-600">Hover card — lifts on mouse over.</p>
            </Card>
          </div>
        </section>

        {/* LoadingSpinner */}
        <Section title="LoadingSpinner — sizes">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </Section>

      </div>
    </main>
  );
}
