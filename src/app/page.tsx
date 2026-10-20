
const colors = [
  { name: "Primary text", value: "#0000FF", className: "text-primary" },
  {
    name: "Secondary text",
    value: "#000000",
    className: "text-secondary-text",
  },
  {
    name: "Tertiary text",
    value: "#777777",
    className: "text-tertiary-text",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:px-10">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">
            DOCBOOK DESIGN SYSTEM
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Color & Component Test
          </h1>

          <p className="text-tertiary-text">
            Testing the DocBook theme tokens and button gradient.
          </p>
        </header>

        {/* Color palette */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Color palette</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {colors.map((color) => (
              <div
                key={color.name}
                className="flex items-center gap-4 rounded-xl border border-border-default bg-white p-4"
              >
                <div
                  className="size-12 shrink-0 rounded-lg"
                  style={{ backgroundColor: color.value }}
                />

                <div>
                  <p className={`font-medium ${color.className}`}>
                    {color.name}
                  </p>
                  <p className="text-sm text-tertiary-text">
                    {color.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Button test */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Buttons</h2>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              style={{ background: "var(--button-gradient)" }}
            >
              Primary button
            </button>

            <button
              type="button"
              className="rounded-lg border border-primary bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Secondary button
            </button>

            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-500"
            >
              Disabled button
            </button>
          </div>

          <p className="text-sm text-tertiary-text">
            The gradient should appear only on the primary button.
          </p>
        </section>

        {/* Card test */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Sample booking card</h2>

          <div className="rounded-2xl border border-border-default bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-primary">
              AVAILABLE FOR BOOKING
            </p>

            <h3 className="mt-2 text-xl font-bold">
              Dr. Sample Doctor
            </h3>

            <p className="mt-1 text-tertiary-text">
              General Physician · DocBook Clinic
            </p>

            <div className="my-5 border-t border-border-default" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">22 October</p>
                <p className="mt-1 text-sm text-tertiary-text">
                  Visit time: 10 AM – 12 PM
                </p>
              </div>

              <p className="font-semibold text-primary">12 tokens left</p>
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-lg px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              style={{ background: "var(--button-gradient)" }}
            >
              Book appointment
            </button>
          </div>
        </section>

        {/* Theme verification */}
        <footer className="rounded-xl border border-border-default p-4 text-sm text-tertiary-text">
          Theme test: white background · blue primary text · black
          secondary text · gray tertiary text · gradient buttons.
        </footer>
      </div>
    </main>
  );
}
