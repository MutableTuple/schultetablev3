import React from 'react'

export default function Footer() {
  return (
     {/* ✅ Responsive Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        {/* ✅ Benefits Column */}
        <aside>
          <h2 className="footer-title">🔤 Benefits of Medium Alphabet Mode</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-1" />
              Designed to boost cognitive flexibility and visual attention
            </li>
            <li className="flex items-start gap-2">
              <FaBrain className="text-purple-600 mt-1" />
              Trains sequencing, short-term memory, and quick decisions
            </li>
            <li className="flex items-start gap-2">
              <FaEye className="text-info mt-1" />
              Improves eye movement speed for faster scanning
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Fully responsive – perfect for mobile and desktop users
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Goal:</strong> Complete the alphabet sequence in{" "}
                <span className="font-semibold">under 5.5 seconds</span>
              </span>
            </li>
          </ul>
        </aside>

        {/* ✅ Game Modes Column */}
        <GameModesLinks />

        {/* ✅ Account + Social Column */}
        <nav>
          <h2 className="footer-title">👤 Account</h2>
          <AuthOptions user={user} />

          <h2 className="footer-title mt-6">🌐 Follow Us</h2>
          <SocialLinks />
        </nav>
      </footer>
  )
}
