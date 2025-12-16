import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              {children}
              <div className="bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 relative hidden md:flex items-center justify-center p-12">
                <IconPlaceholder />
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </main>
  );
}

const IconPlaceholder = () => (
  <svg
    className="w-full h-full opacity-90"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Grid Background */}
    <pattern
      id="grid"
      x="0"
      y="0"
      width="40"
      height="40"
      patternUnits="userSpaceOnUse"
    >
      <path
        d="M 40 0 L 0 0 0 40"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
    </pattern>
    <rect width="400" height="400" fill="url(#grid)" />

    {/* Centered site icon with glow effect */}
    <g transform="translate(200, 200)">
      {/* Glow circle */}
      <circle cx="0" cy="0" r="80" fill="rgba(255,255,255,0.05)">
        <animate
          attributeName="r"
          values="80;85;80"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="0" cy="0" r="65" fill="rgba(255,255,255,0.08)">
        <animate
          attributeName="r"
          values="65;70;65"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Main icon - centered and scaled */}
      <g transform="translate(-48, -48) scale(4)">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5" />
          <path d="M12 21h-7a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7" />
          <path d="M3 10h18" />
          <path d="M10 3v18" />
        </svg>
      </g>
    </g>

    {/* Floating orbs around the icon */}
    <circle cx="80" cy="120" r="4" fill="rgba(255,255,255,0.5)">
      <animate
        attributeName="cy"
        values="120;100;120"
        dur="4s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.5;0.8;0.5"
        dur="4s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="320" cy="160" r="3" fill="rgba(255,255,255,0.4)">
      <animate
        attributeName="cy"
        values="160;140;160"
        dur="5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.4;0.7;0.4"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="100" cy="300" r="3.5" fill="rgba(255,255,255,0.45)">
      <animate
        attributeName="cy"
        values="300;280;300"
        dur="4.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.45;0.75;0.45"
        dur="4.5s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="310" cy="290" r="2.5" fill="rgba(255,255,255,0.35)">
      <animate
        attributeName="cy"
        values="290;270;290"
        dur="3.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.35;0.65;0.35"
        dur="3.5s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Decorative corner elements */}
    <path
      d="M 50 20 Q 35 20, 35 35"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 350 20 Q 365 20, 365 35"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 50 380 Q 35 380, 35 365"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 350 380 Q 365 380, 365 365"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
