import { useState } from "react";
import * as Yup from "yup";
import { Heart, Star, Package, Pencil, Trash2, PenLine } from "lucide-react";
import { Button } from "./ui/Button";
import BackButtonUser from "./ui/BackButtonUser";
import { CreatePanel } from "./ui/CreatePanel";
import { EditPanel } from "./ui/EditPanel";
import ConfirmProvider from "./ui/ConfirmProvider";
import { Rating } from "./ui/Rating";

/* ---------- static data ---------- */
const initialLiked = [
  {
    id: 1,
    name: "Wireless Earbuds – Black",
    price: 5999,
    was: 6999,
    rating: 4.4,
    reviews: 1280,
    inStock: true,
  },
  {
    id: 2,
    name: "Cotton Kurta – Navy",
    price: 1299,
    rating: 4.2,
    reviews: 312,
    inStock: true,
  },
  {
    id: 3,
    name: "Stainless Steel Bottle 1L",
    price: 450,
    rating: 4.6,
    reviews: 2210,
    inStock: true,
  },
  {
    id: 4,
    name: "Running Shoes – White",
    price: 3799,
    was: 4299,
    rating: 4.1,
    reviews: 640,
    inStock: false,
  },
  {
    id: 5,
    name: "Desk Lamp – Matte Black",
    price: 1499,
    rating: 4.5,
    reviews: 455,
    inStock: true,
  },
  {
    id: 6,
    name: "Leather Wallet – Tan",
    price: 2199,
    rating: 4.3,
    reviews: 198,
    inStock: true,
  },
];

const initialReviews = [
  {
    id: 1,
    product: "Wireless Earbuds – Black",
    rating: 5,
    title: "Great sound for the price",
    comment:
      "Battery easily lasts a full day and the bass is punchy. Pairing is quick and the fit is comfortable.",
    date: "20 Oct 2026",
    helpful: 12,
  },
  {
    id: 2,
    product: "Cotton Kurta – Navy (M)",
    rating: 4,
    title: "Comfortable, runs slightly large",
    comment:
      "Soft fabric and the colour matches the photos. Consider sizing down if you're between sizes.",
    date: "2 Oct 2026",
    helpful: 5,
  },
  {
    id: 3,
    product: "Desk Lamp – Matte Black",
    rating: 3,
    title: "Good lamp, flimsy switch",
    comment:
      "Light quality is nice but the switch feels cheap. Works fine so far.",
    date: "18 Aug 2026",
    helpful: 2,
  },
];

const initialPending = [
  { id: "p1", product: "Stainless Steel Bottle 1L", delivered: "27 Oct 2026" },
  { id: "p2", product: "Sports Socks Pack of 3", delivered: "20 Oct 2026" },
];

/* ---------- review panel config ---------- */
const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

const REVIEW_FIELDS = [
  {
    name: "rating",
    label: "Rating",
    type: "select",
    span: "full",
    required: true,
    placeholder: "Select a rating",
    options: [5, 4, 3, 2, 1].map((n) => ({
      label: `${n} star${n > 1 ? "s" : ""} – ${RATING_LABELS[n]}`,
      value: String(n),
    })),
  },
  {
    name: "title",
    label: "Title",
    type: "text",
    span: "full",
    required: true,
    placeholder: "Sum up your experience",
  },
  {
    name: "comment",
    label: "Your review",
    type: "textarea",
    span: "full",
    rows: 4,
    required: true,
    placeholder: "What did you like or dislike?",
  },
];

const reviewSchema = Yup.object({
  rating: Yup.string().required("Select a rating"),
  title: Yup.string()
    .trim()
    .max(80, "Keep the title under 80 characters")
    .required("Add a title"),
  comment: Yup.string()
    .trim()
    .min(10, "Write at least 10 characters")
    .max(500, "Keep it under 500 characters")
    .required("Write your review"),
});

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

function Empty({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-black/30 px-6 py-14 text-center">
      <Icon className="mx-auto h-8 w-8 text-neutral-400" />
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-neutral-500">{text}</p>
    </div>
  );
}

/* ---------- product card ---------- */
function LikedCard({ item, onUnlike }) {
  const off = item.was ? item.was - item.price : 0;
  return (
    <article className="flex flex-col rounded-2xl border border-black/15 bg-white p-3 transition hover:border-black/60 sm:p-4">
      <div className="relative grid aspect-square place-items-center rounded-xl border border-black/10 bg-neutral-50">
        <Package className="h-10 w-10 text-neutral-300" strokeWidth={1.4} />
        <button
          onClick={onUnlike}
          aria-label="Remove from wishlist"
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-black bg-white transition hover:bg-black hover:text-white"
        >
          <Heart className="h-4 w-4" fill="currentColor" />
        </button>
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-black px-2.5 py-0.5 text-[10px] font-semibold text-white">
            {inr(off)} off
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold">
        {item.name}
      </h3>
      <div className="mt-1 flex h-4 overflow-hidden items-center gap-1.5 text-xs text-neutral-500">
        <Rating rating={item.rating} className="h-16 w-16 mt-0" />
        {item.rating} ({item.reviews.toLocaleString("en-IN")})
      </div>
      <p className="mt-2 text-sm">
        <span className="font-bold">{inr(item.price)}</span>
        {item.was && (
          <span className="ml-2 text-xs text-neutral-400 line-through">
            {inr(item.was)}
          </span>
        )}
      </p>

      <Button
        variant={item.inStock ? undefined : "secondary"}
        disabled={!item.inStock}
        className="mt-3 w-full text-xs"
      >
        {item.inStock ? "Add to cart" : "Out of stock"}
      </Button>
    </article>
  );
}

/* ---------- page ---------- */
export default function LikesReviews() {
  const [tab, setTab] = useState("likes"); // "likes" | "reviews"
  const [liked, setLiked] = useState(initialLiked);
  const [reviews, setReviews] = useState(initialReviews);
  const [pending, setPending] = useState(initialPending);

  // write a review (target kept after closing so the panel stays stable)
  const [writeTarget, setWriteTarget] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  // edit a review
  const [editingId, setEditingId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const editing = reviews.find((r) => r.id === editingId);

  // delete a review
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCreate = (values) => {
    setReviews((list) => [
      {
        id: Date.now(),
        product: writeTarget.product,
        rating: Number(values.rating),
        title: values.title,
        comment: values.comment,
        date: "1 Nov 2026",
        helpful: 0,
      },
      ...list,
    ]);
    setPending((list) => list.filter((p) => p.id !== writeTarget.id));
    setCreateOpen(false);
  };

  const handleEdit = (values) => {
    setReviews((list) =>
      list.map((r) =>
        r.id === editingId
          ? {
              ...r,
              rating: Number(values.rating),
              title: values.title,
              comment: values.comment,
            }
          : r,
      ),
    );
    setEditOpen(false);
  };

  const handleDeleteResult = (confirmed) => {
    setConfirmOpen(false);
    if (confirmed && deleteTarget) {
      setReviews((list) => list.filter((r) => r.id !== deleteTarget.id));
    }
  };

  const tabBtn = (key, label, count) => (
    <Button onClick={() => setTab(key)}>
      {label} ({count})
    </Button>
  );

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-1 sm:px-6">
        <BackButtonUser variant="secondary" />

        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Likes &amp; Reviews
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Your wishlist and everything you've said about what you bought.
          </p>
        </header>

        <div className="mb-6 flex gap-2">
          {tabBtn("likes", "Wishlist", liked.length)}
          {tabBtn("reviews", "My reviews", reviews.length)}
        </div>

        {tab === "likes" ? (
          liked.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {liked.map((item) => (
                <LikedCard
                  key={item.id}
                  item={item}
                  onUnlike={() =>
                    setLiked((list) => list.filter((l) => l.id !== item.id))
                  }
                />
              ))}
            </div>
          ) : (
            <Empty
              icon={Heart}
              title="Your wishlist is empty"
              text="Tap the heart on any product to save it here."
            />
          )
        ) : (
          <div className="space-y-8">
            {pending.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-widest">
                  Waiting for your review ({pending.length})
                </h2>
                <div className="space-y-3">
                  {pending.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-wrap items-center gap-4 rounded-2xl border border-black/15 p-4 sm:px-6"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-black/15 bg-neutral-50">
                        <Package
                          className="h-5 w-5 text-neutral-400"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {p.product}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Delivered {p.delivered}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setWriteTarget(p);
                          setCreateOpen(true);
                        }}
                        className="w-fit"
                        variant="secondary"
                      >
                        <PenLine className="h-3 w-3" /> Write review
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest">
                Your reviews
              </h2>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <article
                    key={r.id}
                    className="rounded-2xl border border-black/15 bg-white p-5 transition hover:border-black/60 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{r.product}</p>
                      <span className="text-xs text-neutral-500">{r.date}</span>
                    </div>
                    <div className="mt-2 flex items-center h-5 overflow-hidden gap-2">
                      <Rating className="h-16 w-16 mt-0" rating={r.rating} />
                      <span className="text-sm font-bold">{r.title}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {r.comment}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
                      <Button
                        onClick={() => {
                          setEditingId(r.id);
                          setEditOpen(true);
                        }}
                        className={"w-fit"}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteTarget(r);
                          setConfirmOpen(true);
                        }}
                        variant="secondary"
                        className={"text-red-500 w-fit"}
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                      <span className="ml-auto text-xs text-neutral-500">
                        {r.helpful} found this helpful
                      </span>
                    </div>
                  </article>
                ))}

                {reviews.length === 0 && (
                  <Empty
                    icon={Star}
                    title="No reviews yet"
                    text="Reviews you write will show up here."
                  />
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <CreatePanel
        variant="user"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Write a review"
        subtitle={writeTarget?.product}
        fields={REVIEW_FIELDS}
        validationSchema={reviewSchema}
        submitLabel="Post review"
        onSubmit={handleCreate}
      />

      <EditPanel
        variant="user"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit review"
        subtitle={editing?.product}
        fields={REVIEW_FIELDS}
        initialValues={
          editing
            ? {
                rating: String(editing.rating),
                title: editing.title,
                comment: editing.comment,
              }
            : {}
        }
        validationSchema={reviewSchema}
        submitLabel="Save changes"
        onSubmit={handleEdit}
      />

      <ConfirmProvider
        variant="user"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onResult={handleDeleteResult}
      >
        Are you sure you want to delete your review of {deleteTarget?.product}?
      </ConfirmProvider>
    </div>
  );
}
