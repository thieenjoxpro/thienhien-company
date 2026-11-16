import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/catalogue/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { getPolicies, getPolicy, parseBlocks } from "@/lib/policies";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPolicies()).map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const policy = await getPolicy((await params).slug);
  return policy ? { title: policy.title, alternates: { canonical: `/chinh-sach/${policy.slug}` } } : {};
}

// Chính sách (mục 5.6): nội dung markdown tối giản từ data/policies.json
export default async function PolicyPage({ params }: Props) {
  const policy = await getPolicy((await params).slug);
  if (!policy) notFound();
  return (
    <Section>
      <Breadcrumb
        items={[
          { name: "Trang chủ", href: "/" },
          { name: policy.title, href: `/chinh-sach/${policy.slug}` },
        ]}
      />
      <article className="max-w-3xl">
        <h1 className="mb-8 text-h2">{policy.title}</h1>
        {parseBlocks(policy.body).map((block, index) => {
          if (block.kind === "h2") return <h2 key={index} className="mt-8 mb-3 text-h3">{block.text}</h2>;
          if (block.kind === "ul")
            return (
              <ul key={index} className="mb-4 list-disc pl-6">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          return <p key={index} className="mb-4">{block.text}</p>;
        })}
      </article>
    </Section>
  );
}
