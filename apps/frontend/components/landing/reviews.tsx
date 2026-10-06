import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, HeartIcon } from "@phosphor-icons/react/ssr";
import { Container, Rating } from "@/components/ui";
import { avatarUrl, communityReviews, coverUrl, type Review } from "@/lib/data";

function Byline({ review }: { review: Review }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={avatarUrl(review.user, 80)}
        alt=""
        width={28}
        height={28}
        className="size-7 border border-line-strong"
      />
      <span className="text-sm font-medium">{review.user}</span>
      <span className="label ml-auto flex items-center gap-1 text-dim">
        <HeartIcon size={11} weight="fill" className="text-accent" />
        {review.likes}
      </span>
    </div>
  );
}

export function Reviews() {
  const [lead, ...rest] = communityReviews;

  return (
    <section id="reviews" className="border-b border-line">
      <Container className="py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
            Fresh reviews
          </h2>
          <Link
            href="#"
            className="label hidden items-center gap-1 text-muted transition-colors hover:text-accent sm:inline-flex"
          >
            All reviews
            <ArrowUpRightIcon size={12} weight="bold" />
          </Link>
        </div>

        <div className="mt-12 grid gap-px border border-line bg-line lg:grid-cols-12">
          <article className="grid gap-8 bg-surface p-6 sm:grid-cols-[200px_1fr] md:p-10 lg:col-span-7">
            <div className="relative aspect-[2/3] w-40 border border-line sm:w-full">
              <Image
                src={coverUrl(lead.game.appId)}
                alt={`${lead.game.title} cover`}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="label text-dim">
                {lead.game.title} <span className="text-line-strong">/</span> {lead.game.year}
              </p>
              <div className="mt-3">
                <Rating value={lead.rating} size={16} />
              </div>
              <blockquote className="mt-5 text-2xl leading-snug font-medium tracking-tight md:text-3xl">
                &ldquo;{lead.body}&rdquo;
              </blockquote>
              <div className="mt-auto pt-8">
                <Byline review={lead} />
              </div>
            </div>
          </article>

          <div className="grid gap-px bg-line lg:col-span-5">
            {rest.map((r) => (
              <article key={r.id} className="grid grid-cols-[72px_1fr] gap-5 bg-bg p-6 md:p-8">
                <div className="relative aspect-[2/3] border border-line">
                  <Image
                    src={coverUrl(r.game.appId)}
                    alt={`${r.game.title} cover`}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate font-semibold">{r.game.title}</h3>
                    <Rating value={r.rating} />
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{r.body}</p>
                  <div className="mt-auto pt-5">
                    <Byline review={r} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
