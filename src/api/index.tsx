const api = {
  product: {
    list: "/products",
    default: "/product",
    // image: "/product/getimage",

    // filter by category, type,
    category: (id: string) => `/product/category/${id}`,
    type: (id: string) => `/product/type/${id}`,
    stock: (id: string) => `/product/depot/${id}`,
  },
  stock: { list: "/stocks", default: "/stock" },
  category: {
    list: "/categorys",
    default: "/category",
    sub: "/category/subCategories",
  },
  type: { list: "/types", default: "/type", sub: "/type/subTypes" },
  brand: { list: "/brands", default: "/brand" },
  discount: { list: "/discounts", default: "/discount" },
  testimonial: { list: "/testimonials", default: "/testimonial" },
  summary: { list: "/movements", default: "/movement" },
  order: { list: "/orders", default: "/order" },
  user: {
    list: "/users",
    default: "/user",
    auth: "/auth",
    email: "/user/email",
  },
  size: { list: "/sizes", default: "/size" },
  supplier: { list: "/suppliers", default: "/supplier" },
};

export default api;
