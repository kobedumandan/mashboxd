import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms of Service" };

// Keep in sync with TERMS_VERSION in apps/api/lib/validation.ts.
const UPDATED = "October 6, 2026";
// TODO: replace with the real support address before launch.
const CONTACT = "[contact email]";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      updated={UPDATED}
      intro={
        <p>
          These terms cover your use of Mashboxd, a site for tracking, rating and reviewing video games. By
          creating an account you agree to them. If you don&apos;t agree, please don&apos;t use Mashboxd.
        </p>
      }
      sections={[
        {
          heading: "Who can use Mashboxd",
          body: (
            <p>
              You must be <strong>16 or older</strong> to create an account. Anyone can browse game pages,
              reviews and profiles without an account.
            </p>
          ),
        },
        {
          heading: "Your account",
          body: (
            <>
              <p>
                Keep your password private. You&apos;re responsible for what happens under your account. Tell us
                at {CONTACT} if you think someone else has access to it.
              </p>
              <p>Usernames must not impersonate other people or brands. We may reclaim names that do.</p>
            </>
          ),
        },
        {
          heading: "Your content",
          body: (
            <>
              <p>
                You own the reviews, ratings, lists and comments you post. By posting them, you let Mashboxd
                store, display and share them on the service, including on your public profile and game pages.
                This permission ends when you delete the content or your account, except where others have
                already shared or replied to it.
              </p>
              <p>Reviews, ratings, lists and your profile are public. Don&apos;t post anything you want kept private.</p>
            </>
          ),
        },
        {
          heading: "Rules",
          body: (
            <>
              <p>When using Mashboxd, don&apos;t:</p>
              <ul>
                <li>harass, threaten or target other people;</li>
                <li>post hate speech, sexual content involving minors, or illegal material;</li>
                <li>spam, manipulate ratings, or run automated accounts;</li>
                <li>post other people&apos;s private information;</li>
                <li>try to break, overload or get around the security of the service.</li>
              </ul>
              <p>
                Mark spoilers in reviews. You can report content that breaks these rules, and block users you
                don&apos;t want to interact with.
              </p>
            </>
          ),
        },
        {
          heading: "Moderation",
          body: (
            <p>
              We may remove content or suspend accounts that break these terms. Where we can, we&apos;ll tell
              you what was removed and why.
            </p>
          ),
        },
        {
          heading: "Steam and other services",
          body: (
            <p>
              Linking Steam is optional. Steam is a trademark of Valve Corporation, and Mashboxd is not
              affiliated with Valve. Game details come from IGDB and critic reviews from OpenCritic. Critic
              reviews belong to their publishers, and we link to the original.
            </p>
          ),
        },
        {
          heading: "Ending your account",
          body: (
            <p>
              You can stop using Mashboxd at any time and ask us to delete your account. See the{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>{" "}
              for what happens to your data.
            </p>
          ),
        },
        {
          heading: "No guarantees",
          body: (
            <p>
              Mashboxd is provided as is. We work to keep it running and accurate, but we can&apos;t promise it
              will always be available or error-free, and game data from third parties may be incomplete.
            </p>
          ),
        },
        {
          heading: "Changes",
          body: (
            <p>
              If we change these terms in a meaningful way, we&apos;ll ask you to accept the new version the
              next time you sign in.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: <p>Questions about these terms: {CONTACT}.</p>,
        },
      ]}
    />
  );
}
