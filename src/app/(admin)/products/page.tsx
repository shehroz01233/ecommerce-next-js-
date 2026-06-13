// "use client";

// import { useEffect, useState } from "react";
// import { AdminAPI } from "../../lib/api";

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   image?: string;
// }

// export default function AdminProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // SAFE FETCH FUNCTION (FIXED)
//   const fetchProducts = async () => {
//     try {
//       const data = await AdminAPI.getAllProducts();

//       console.log("API RESPONSE:", data); // 🔍 DEBUG

//       // ✅ ALWAYS FORCE ARRAY SAFETY
//       let safeProducts: Product[] = [];

//       if (Array.isArray(data)) {
//         safeProducts = data;
//       } else if (Array.isArray(data?.products)) {
//         safeProducts = data.products;
//       } else if (Array.isArray(data?.data)) {
//         safeProducts = data.data;
//       }

//       setProducts(safeProducts);
//     } catch (err: any) {
//       setError(
//         err.message || "Failed to load products"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // DELETE PRODUCT
//   const handleDelete = async (id: number) => {
//     try {
//       await AdminAPI.deleteProduct(id);

//       setProducts((prev) =>
//         prev.filter((p) => p.id !== id)
//       );
//     } catch (err: any) {
//       alert(err.message || "Delete failed");
//     }
//   };

//   // LOADING UI
//   if (loading) {
//     return (
//       <h3 style={{ padding: "20px" }}>
//         Loading products...
//       </h3>
//     );
//   }

//   // ERROR UI
//   if (error) {
//     return (
//       <h3 style={{ color: "red", padding: "20px" }}>
//         {error}
//       </h3>
//     );
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>🛠️ Admin Products</h1>

//       {/* EMPTY STATE */}
//       {products.length === 0 ? (
//         <p>No products found</p>
//       ) : (
//         <div style={{ marginTop: "20px" }}>
//           {products.map((product) => (
//             <div
//               key={product.id}
//               style={{
//                 display: "flex",
//                 justifyContent:
//                   "space-between",
//                 alignItems: "center",
//                 padding: "10px",
//                 borderBottom:
//                   "1px solid #ddd",
//               }}
//             >
//               {/* PRODUCT INFO */}
//               <div>
//                 <h3>{product.name}</h3>
//                 <p>${product.price}</p>
//               </div>

//               {/* DELETE BUTTON */}
//               <button
//                 onClick={() =>
//                   handleDelete(product.id)
//                 }
//                 style={{
//                   background: "red",
//                   color: "white",
//                   border: "none",
//                   padding: "8px 12px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { JSX, useEffect, useState } from "react";
import { AdminAPI } from "../../lib/api";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH PRODUCTS (SAFE)
  // =========================
  const fetchProducts = async () => {
    try {
      const data = await AdminAPI.getAllProducts();

      console.log("API RESPONSE:", data);

      let safeProducts: Product[] = [];

      if (Array.isArray(data)) {
        safeProducts = data;
      } else if (Array.isArray(data?.products)) {
        safeProducts = data.products;
      } else if (Array.isArray(data?.data)) {
        safeProducts = data.data;
      }

      setProducts(safeProducts);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (id: number) => {
    try {
      await AdminAPI.deleteProduct(id);

      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  // =========================
  // RENDER WITHOUT .map()
  // =========================
  const renderProducts = () => {
    const items: JSX.Element[] = [];

    products.forEach((product) => {
      items.push(
        <div
          key={product.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>

          <button
            onClick={() =>
              handleDelete(product.id)
            }
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      );
    });

    return items;
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <h3 style={{ padding: "20px" }}>
        Loading products...
      </h3>
    );
  }

  // =========================
  // ERROR STATE
  // =========================
  if (error) {
    return (
      <h3 style={{ color: "red", padding: "20px" }}>
        {error}
      </h3>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛠️ Admin Products</h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {renderProducts()}
        </div>
      )}
    </div>
  );
}