window.shudhProductCatalogue = [
  { name: "Handi / Kadni", size: "6, 7, 8 muh", approxWeight: "3–8 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/kadni-handi.webp", icon: "donga" },
  { name: "Tadka Pan", size: "6–10 muh", approxWeight: "700 g–2 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/tadka-pan.webp", icon: "tawa" },
  { name: "Big Deg", size: "14 inch and above", approxWeight: "7 kg and above", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/big-deg.webp", icon: "donga" },
  { name: "Tutma Tawa", aliases: ["Tutma Tava"], size: "9, 10, 11 and other sizes", approxWeight: "1–2 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/tutma-tawa.webp", icon: "tawa" },
  { name: "Tikki Tawi / Roti Tawi", aliases: ["Tikki Tavi", "Iron Tawi", "Iron Tawa"], size: "16–40 inch", approxWeight: "4 kg and above", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/tawi.webp", icon: "tawa" },
  { name: "White Batta / Sarbloh Set", aliases: ["White Batta"], size: "6, 7, 8 and other sizes", approxWeight: "200 g–1 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/white-batta-set.webp", icon: "bata" },
  { name: "Batta / Sarbloh Set", aliases: ["Batta"], size: "6, 7, 8 and other sizes", approxWeight: "200 g–1 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/sarbloh-batta.webp", icon: "bata" },
  { name: "Chotti Kadahi (13–14 gauge)", aliases: ["Kadhai"], size: "12–18 inch", approxWeight: "1.25–4 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/sarbloh-kadai.webp", icon: "kadhai" },
  { name: "Chotti Deg / Donga", aliases: ["Deg"], size: "6, 7, 8 muh", approxWeight: "3–8 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/chotti-deg-dongi.webp", icon: "donga" },
  { name: "Fry Pan", size: "9, 10, 11, 12 inch", approxWeight: "1–2 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/sarbloh-fry-pan.webp", icon: "kadhai" },
  { name: "Tadka Fry Pan", size: "6–10 muh", approxWeight: "700 g–2 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/tadka-fry-pan.webp", icon: "kadhai" },
  { name: "Karchi / Chamcha (Without Handle)", aliases: ["Karchi without Handle", "Chamcha without Handle"], size: "9, 10, 11, 12 inch", approxWeight: "1–2 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/karchi-without-handle.webp", icon: "chamcha" },
  { name: "Karchi / Chamcha (With Handle)", aliases: ["Iron Spoon", "Chamcha with Handle", "Karchi with Handle"], size: "15–24 inch", approxWeight: "500 g–2 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/chamcha-with-handle.webp", icon: "chamcha" },
  { name: "Iron Plain Tawa", aliases: ["Tawa", "Iron Tava"], size: "9, 10, 11 and other sizes", approxWeight: "1–2 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/plane-tawa.webp", icon: "tawa" },
  { name: "Londa / One Piece (10 gauge)", size: "18–40 inch", approxWeight: "4–45 kg", price: "Price range on request", minimumOrder: "10 kg", image: "Assets/products/one-piece.webp", icon: "donga" },
];

window.getShudhProductByName = (name) => {
  const normalized = String(name || "").trim().toLowerCase();
  return window.shudhProductCatalogue.find((product) =>
    product.name.toLowerCase() === normalized ||
    (product.aliases || []).some((alias) => alias.toLowerCase() === normalized)
  );
};
