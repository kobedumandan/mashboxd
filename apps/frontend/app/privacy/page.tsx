import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

const UPDATED = "October 6, 2026";
// TODO: replace with the real support address before launch.
const CONTACT = "[contact email]";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      updated={UPDATED}
      intro={
        <p>
          This explains what Mashboxd collects, why, and what you can do about it. Short version: we collect
          what&apos;s needed to run your profile, we don&apos;t sell data, and we don&apos;t use advertising or
          tracking cookies.
        </p>
      }
      sections={[
        {
          heading: "What we collect",
          body: (
            <ul>
              <li>
                <strong>Account details:</strong> email, username, optional display name, and your password
                (stored only as a secure hash by our auth provider).
              </li>
              <li>
                <strong>Taste picks:</strong> the platforms and genres you choose at sign-up.
              </li>
              <li>
                <strong>Steam, if you link it:</strong> your public SteamID. Once library import is available,
                also your owned games, playtime and last-played dates.
              </li>
              <li>
                <strong>What you post:</strong> statuses, ratings, reviews, diary entries, lists, comments,
                likes and follows.
              </li>
              <li>
                <strong>Consent records:</strong> when you accepted the Terms, and which version.
              </li>
            </ul>
          ),
        },
        {
          heading: "What is public",
          body: (
            <p>
              Your username, display name, profile, taste picks, ratings, reviews, lists, diary and comments
              are public, including to people without an account. Your <strong>email is never shown</strong>.
              Your SteamID is used to show that Steam is linked.
            </p>
          ),
        },
        {
          heading: "How we use it",
          body: (
            <ul>
              <li>to run your account and profile;</li>
              <li>to import and sync your Steam library when you ask us to;</li>
              <li>to show game pages, scores and recommendations;</li>
              <li>to send account emails such as confirmation and password reset;</li>
              <li>to keep the service safe, including handling reports.</li>
            </ul>
          ),
        },
        {
          heading: "Who we share it with",
          body: (
            <>
              <p>We don&apos;t sell your data. We use these providers to run Mashboxd:</p>
              <ul>
                <li>
                  <strong>Supabase:</strong> database, authentication and account emails.
                </li>
                <li>
                  <strong>Valve (Steam):</strong> sign-in when you link Steam, and library data you ask us to
                  import.
                </li>
              </ul>
              <p>
                IGDB and OpenCritic provide game and critic data. They receive no personal information about you.
              </p>
            </>
          ),
        },
        {
          heading: "Cookies",
          body: (
            <p>
              We only use cookies that keep you signed in and protect sign-in flows. No advertising or
              analytics cookies.
            </p>
          ),
        },
        {
          heading: "How long we keep it",
          body: (
            <p>
              We keep your data while your account exists. When you delete your account, your personal data and
              content are removed. Backups may hold copies for a short period before they expire.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <p>
              You can see, correct, export or delete your data. Self-serve export and deletion are coming to
              Settings. Until then, email {CONTACT} and we&apos;ll handle it. Depending on where you live (for
              example under GDPR), you may also have the right to object to processing or complain to a data
              protection authority.
            </p>
          ),
        },
        {
          heading: "Age",
          body: (
            <p>
              Mashboxd is for people aged <strong>16 and older</strong>. If we learn that an account belongs to
              someone younger, we&apos;ll delete it.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: <p>Privacy questions or requests: {CONTACT}.</p>,
        },
      ]}
    />
  );
}
