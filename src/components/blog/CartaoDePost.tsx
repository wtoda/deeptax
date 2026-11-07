import Link from "next/link";
import { formatarData, tempoDeLeitura, urlDoPost, type Post } from "@/lib/blog";

/** Cartão de post na lista do blog. */
export function CartaoDePost({ post }: { post: Post }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white transition-shadow hover:shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)]">
      {post.capa && (
        <div className="aspect-[16/9] overflow-hidden bg-brand-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.capa.src}
            alt={post.capa.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-brand-900/50">
          <time dateTime={post.data}>{formatarData(post.data)}</time>
          <span aria-hidden="true">·</span>
          <span>{tempoDeLeitura(post)} min de leitura</span>
        </div>

        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-brand-950">
          {/* O link cobre o cartão inteiro para a área de clique incluir a imagem. */}
          <Link href={urlDoPost(post)} className="after:absolute after:inset-0 focus:outline-none">
            {post.titulo}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-brand-900/65">
          {post.resumo}
        </p>

        {post.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-brand-900/60"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
