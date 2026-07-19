"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductAPI, Review, Product } from "../../../lib/api";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useToast } from "../../../components/Toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buying, setBuying] = useState(false);

  const id = Number(params?.id);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const [productData, reviewsData] = await Promise.allSettled([
          ProductAPI.getById(id, controller.signal),
          ProductAPI.getReviews(id, controller.signal),
        ]);

        if (controller.signal.aborted) return;

        if (productData.status === "fulfilled") {
          setProduct(productData.value);
        } else {
          throw new Error("Product not found");
        }

        if (reviewsData.status === "fulfilled" && Array.isArray(reviewsData.value)) {
          setReviews(reviewsData.value);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(product, quantity);
      addToast("success", `${quantity} × ${product.name} added to cart`);
    } catch (err: unknown) {
      addToast("error", err instanceof Error ? err.message : "Failed to add");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setBuying(true);
    try {
      await addToCart(product, quantity);
      router.push("/cart");
    } catch (err: unknown) {
      addToast("error", err instanceof Error ? err.message : "Failed");
    } finally {
      setBuying(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const newReview = await ProductAPI.addReview(id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews((prev) => [newReview, ...prev]);
      setReviewComment("");
      setReviewRating(5);
      addToast("success", "Review submitted!");
    } catch (err: unknown) {
      addToast("error", err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!id || isNaN(id)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Invalid product</h2>
        <Link href="/products" className="text-foreground font-medium transition-base hover:opacity-70">
          &larr; Back to products
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/20 flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Product not found</h2>
        <p className="text-muted text-sm mb-6">{error}</p>
        <Link href="/products" className="text-foreground font-medium transition-base hover:opacity-70">
          &larr; Back to products
        </Link>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="transition-base hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/products" className="transition-base hover:text-foreground">Products</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="card p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[420px] aspect-square bg-muted/10 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <svg className="w-12 h-12 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>

            {product.category && (
              <span className="inline-block px-2.5 py-0.5 bg-muted/10 text-muted text-xs rounded-full mb-3">
                {product.category}
              </span>
            )}

            {avgRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-500" role="img" aria-label={`Rating: ${avgRating.toFixed(1)} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.round(avgRating) ? "opacity-100" : "opacity-30"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted">
                  {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-foreground mb-4">${(product.price ?? 0).toFixed(2)}</p>

            {product.description && (
              <p className="text-muted text-sm mb-6 leading-relaxed">{product.description}</p>
            )}

            {product.stock !== undefined && (
              <p className="text-sm text-muted mb-4">
                {product.stock > 0 ? (
                  <span className="text-success">✓ In stock ({product.stock} available)</span>
                ) : (
                  <span className="text-destructive">✗ Out of stock</span>
                )}
              </p>
            )}

            <div className="flex items-center gap-3 mb-6">
              <label className="text-sm text-muted">Quantity</label>
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 flex items-center justify-center text-muted transition-base hover:bg-muted/10"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(q + 1, product.stock != null && product.stock > 0 ? product.stock : 999))}
                  aria-label="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center text-muted transition-base hover:bg-muted/10"
                >
                  +
                </button>
              </div>
              {product.stock !== undefined && product.stock <= 5 && (
                <span className="text-xs text-orange-500">Only {product.stock} left</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="btn-secondary flex-1 py-2.5"
              >
                {addingToCart ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={buying || product.stock === 0}
                className="btn-primary flex-1 py-2.5"
              >
                {buying ? "Processing..." : product.stock === 0 ? "Out of Stock" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h2 className="text-lg font-semibold text-foreground mb-5">Reviews ({reviews.length})</h2>

        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="border border-border rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm text-muted">Your rating:</label>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    aria-label={`Rate ${star} out of 5 stars`}
                    className={`text-xl transition-base ${star <= reviewRating ? "text-yellow-500" : "text-muted/30"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Write your review..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              className="input resize-y min-h-[80px] mb-3"
            />
            <button
              type="submit"
              disabled={submittingReview || !reviewComment.trim()}
              className="btn-primary px-5"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {!isAuthenticated && (
          <p className="text-sm text-muted mb-6">
            <Link href="/login" className="text-foreground font-medium transition-base hover:opacity-70">Sign in</Link>
            {" "}to write a review.
          </p>
        )}

        {reviews.length === 0 && (
          <p className="text-muted text-sm">No reviews yet. Be the first to review!</p>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex text-yellow-500 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? "opacity-100" : "opacity-30"}>★</span>
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{review.user_name || "Anonymous"}</span>
                {review.created_at && (
                  <span className="text-xs text-muted">{new Date(review.created_at).toLocaleDateString()}</span>
                )}
              </div>
              <p className="text-sm text-muted leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
