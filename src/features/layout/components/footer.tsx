import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur-md border-t mt-8">
      <div className="container mx-auto px-4 py-8 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <div className="text-base font-semibold text-blue-700">
            Neurocheck
          </div>
          <p className="mt-2 text-gray-600">
            ML-powered predictions for Depression and ME/CFS with explainable
            insights.
          </p>
        </div>
        <div>
          <div className="text-base font-semibold text-gray-900">Product</div>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>
              <a href="/diagnosis" className="hover:text-blue-700">
                Start diagnosis
              </a>
            </li>
            <li>
              <a href="/history" className="hover:text-blue-700">
                History
              </a>
            </li>
            <li>
              <a href="/chat" className="hover:text-blue-700">
                Explain results
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-base font-semibold text-gray-900">Company</div>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-700">
                Home
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-blue-700">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-700">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Neurocheck. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
