import cors from "cors";
import express from "express";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/sizes", (req, res) => {
  const limit = Number(req.query.limit) || 10;

  res.json({
    success: true,
    data: [
      {
        id: "1",
        name: "Small",
        category: { label: "Adulte", code: "ADULT" },
        code: "S",
        isActive: true,
        createdAt: "2024-11-15T09:00:00Z",
        updatedAt: "2025-01-10T10:30:00Z",
      },
      {
        id: "2",
        name: "Medium",
        category: { label: "Adulte", code: "ADULT" },
        code: "M",
        isActive: true,
        createdAt: "2024-11-15T09:00:00Z",
        updatedAt: "2025-01-10T10:30:00Z",
      },
      {
        id: "3",
        name: "Large",
        category: { label: "Adulte", code: "ADULT" },
        code: "L",
        isActive: true,
        createdAt: "2024-11-15T09:00:00Z",
        updatedAt: "2025-01-10T10:30:00Z",
      },
      {
        id: "4",
        name: "6 ans",
        category: { label: "Enfant", code: "KIDS" },
        code: "6Y",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "5",
        name: "8 ans",
        category: { label: "Enfant", code: "KIDS" },
        code: "8Y",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "6",
        name: "8 ans",
        category: { label: "Enfant", code: "KIDS" },
        code: "8Y",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "7",
        name: "8 ans",
        category: { label: "Enfant", code: "KIDS" },
        code: "8Y",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "8",
        name: "8 ans",
        category: { label: "Enfant", code: "KIDS" },
        code: "8Y",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "9",
        name: "8 ans",
        category: { label: "Enfant", code: "KIDS" },
        code: "8Y",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "10",
        name: "8 ans",
        category: { label: "Enfant", code: "KIDS" },
        code: "8Y",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
    ],
    code: 200,
    message: "Success",
    meta: {
      total: 10,
      page: 1,
      pageSize: limit,
    },
  });
});

app.get("/categories", (req, res) => {
  const limit = Number(req.query.limit) || 10;
  res.json({
    success: true,
    data: [
      {
        id: "1",
        name: "Adulte",
        code: "ADULT",
      },
      {
        id: "2",
        name: "Enfant",
        code: "KIDS",
      },
      {
        id: "3",
        name: "Bébé",
        code: "BABY",
      },
      {
        id: "4",
        name: "Accessoires",
        code: "ACCESSORY",
      },
      {
        id: "5",
        name: "Accessoires",
        code: "ACCESSORY",
      },
      {
        id: "6",
        name: "Accessoires",
        code: "ACCESSORY",
      },
      {
        id: "7",
        name: "Accessoires",
        code: "ACCESSORY",
      },
      {
        id: "8",
        name: "Accessoires",
        code: "ACCESSORY",
      },
    ],
    code: 200,
    message: "Success",
    meta: {
      total: 8,
      page: 1,
      pageSize: limit,
    },
  });
});

app.get("/suppliers", (req, res) => {
  const limit = Number(req.query.limit) || 10;
  res.json({
    success: true,
    data: [
      {
        id: "1",
        name: "Supplier One",
        code: "SUP1",
        contact: "zazaza",
        address: "vory",
      },
      {
        id: "2",
        name: "Supplier Two",
        code: "SUP2",
        contact: "zazaza",
        address: "vory",
      },
      {
        id: "3",
        name: "Supplier Three",
        code: "SUP3",
        contact: "zazaza",
        address: "vory",
      },
      {
        id: "4",
        name: "Supplier Four",
        code: "SUP4",
        contact: "zazaza",
        address: "Mojangaly ",
      },
      {
        id: "5",
        name: "Supplier Five",
        code: "SUP5",
        contact: "zazaza",
        address: "vory",
      },
      {
        id: "6",
        name: "Supplier Six",
        code: "SUP6",
        contact: "zazaza",
        address: "vory",
      },
      {
        id: "7",
        name: "Supplier Seven",
        code: "SUP7",
        contact: "zazaza",
        address: "vory",
      },
      {
        id: "8",
        name: "Supplier Eight",
        code: "SUP8",
        contact: "zazaza",
        address: "vory",
      },
      {
        id: "9",
        name: "Supplier Nine",
        code: "SUP9",
        contact: "zazaza",
        address: "vory",
      },
      {
        id: "10",
        name: "Supplier Ten",
        code: "SUP10",
        contact: "zazaza",
        address: "vory",
      },
    ].slice(0, limit),
    code: 200,
    message: "Success",
    meta: {
      total: 10,
      page: 1,
      pageSize: limit,
    },
  });
});

app.get("/colors", (req, res) => {
  const limit = Number(req.query.limit) || 10;
  res.json({
    success: true,
    data: [
      {
        id: "1",
        name: "Red",
        code: "RED",
        hexa: "#FF0000",
        isActive: true,
        createdAt: "2024-11-15T09:00:00Z",
        updatedAt: "2025-01-10T10:30:00Z",
      },
      {
        id: "2",
        name: "Green",
        code: "GREEN",
        hexa: "#00FF00",
        isActive: true,
        createdAt: "2024-11-15T09:00:00Z",
        updatedAt: "2025-01-10T10:30:00Z",
      },
      {
        id: "3",
        name: "Blue",
        code: "BLUE",
        hexa: "#0000FF",
        isActive: true,
        createdAt: "2024-11-15T09:00:00Z",
        updatedAt: "2025-01-10T10:30:00Z",
      },
      {
        id: "4",
        name: "Yellow",
        code: "YELLOW",
        hexa: "#FFFF00",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "5",
        name: "Pink",
        code: "PINK",
        hexa: "#FFC0CB",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "6",
        name: "Black",
        code: "BLACK",
        hexa: "#000000",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "7",
        name: "White",
        code: "WHITE",
        hexa: "#FFFFFF",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "8",
        name: "Gray",
        code: "GRAY",
        hexa: "#808080",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "9",
        name: "Orange",
        code: "ORANGE",
        hexa: "#FFA500",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
      {
        id: "10",
        name: "Purple",
        code: "PURPLE",
        hexa: "#800080",
        isActive: true,
        createdAt: "2024-12-01T14:15:00Z",
        updatedAt: "2025-01-20T11:45:00Z",
      },
    ].slice(0, limit),
    code: 200,
    message: "Success",
    meta: {
      total: 10,
      page: 1,
      pageSize: limit,
    },
  });
});

app.get("/collections", (req, res) => {
  const limit = Number(req.query.limit) || 10;
  res.json({
    success: true,
    data: [
      {
        id: "1",
        name: "Summer Vibes",
        image: {
          url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbluepix.fr%2Fcontent%2Fuploads%2Fphotos%2F2022%2F11%2Fbluepix_f4931761cd19f46317fdfb86d08870f2.jpg&f=1&nofb=1&ipt=e2a6e83b4a1a51857dc9142488b0dee49425be9e41707a83961b06fe9d6aec9a",
          imagename: "Summer Vibes Collection",
        },
        code: "SUMMER2025",
      },
      {
        id: "2",
        name: "Winter Glow",
        image: {
          url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D788854926604931&f=1&nofb=1&ipt=41beaf89f15ce4600b25f7eecb1051ddf1c4f89f7826cdcd3dc62cea09b8344e",
          imagename: "Winter Glow Collection",
        },
        code: "WINTER2025",
      },
      {
        id: "3",
        name: "Spring Blossom",
        image: {
          url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbluepix.fr%2Fcontent%2Fuploads%2Fphotos%2F2022%2F11%2Fbluepix_f4931761cd19f46317fdfb86d08870f2.jpg&f=1&nofb=1&ipt=e2a6e83b4a1a51857dc9142488b0dee49425be9e41707a83961b06fe9d6aec9a",
          imagename: "Spring Blossom Collection",
        },
        code: "SPRING2025",
      },
      {
        id: "4",
        name: "Autumn Trends",
        image: {
          url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbluepix.fr%2Fcontent%2Fuploads%2Fphotos%2F2022%2F11%2Fbluepix_f4931761cd19f46317fdfb86d08870f2.jpg&f=1&nofb=1&ipt=e2a6e83b4a1a51857dc9142488b0dee49425be9e41707a83961b06fe9d6aec9a",
          imagename: "Autumn Trends Collection",
        },
        code: "AUTUMN2025",
      },
      {
        id: "5",
        name: "Urban Chic",
        image: {
          url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbluepix.fr%2Fcontent%2Fuploads%2Fphotos%2F2022%2F11%2Fbluepix_f4931761cd19f46317fdfb86d08870f2.jpg&f=1&nofb=1&ipt=e2a6e83b4a1a51857dc9142488b0dee49425be9e41707a83961b06fe9d6aec9a",
          imagename: "Urban Chic Collection",
        },
        code: "URBAN2025",
      },
      {
        id: "6",
        name: "Bohemian Rhapsody",
        image: {
          url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbluepix.fr%2Fcontent%2Fuploads%2Fphotos%2F2022%2F11%2Fbluepix_f4931761cd19f46317fdfb86d08870f2.jpg&f=1&nofb=1&ipt=e2a6e83b4a1a51857dc9142488b0dee49425be9e41707a83961b06fe9d6aec9a",
          imagename: "Bohemian Rhapsody Collection",
        },
        code: "BOHO2025",
      },
      {
        id: "7",
        name: "Minimalist Elegance",
        image: {
          url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbluepix.fr%2Fcontent%2Fuploads%2Fphotos%2F2022%2F11%2Fbluepix_f4931761cd19f46317fdfb86d08870f2.jpg&f=1&nofb=1&ipt=e2a6e83b4a1a51857dc9142488b0dee49425be9e41707a83961b06fe9d6aec9a",
          imagename: "Minimalist Elegance Collection",
        },
        code: "MINIMAL2025",
      },
      {
        id: "8",
        name: "Vintage Revival",
        image: {
          url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbluepix.fr%2Fcontent%2Fuploads%2Fphotos%2F2022%2F11%2Fbluepix_f4931761cd19f46317fdfb86d08870f2.jpg&f=1&nofb=1&ipt=e2a6e83b4a1a51857dc9142488b0dee49425be9e41707a83961b06fe9d6aec9a",
          imagename: "Vintage Revival Collection",
        },
        code: "VINTAGE2025",
      },
      {
        id: "9",
        name: "Sporty Edge",
        image: {
          url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbluepix.fr%2Fcontent%2Fuploads%2Fphotos%2F2022%2F11%2Fbluepix_f4931761cd19f46317fdfb86d08870f2.jpg&f=1&nofb=1&ipt=e2a6e83b4a1a51857dc9142488b0dee49425be9e41707a83961b06fe9d6aec9a",
          imagename: "Sporty Edge Collection",
        },
        code: "SPORTY2025",
      },
      {
        id: "10",
        name: "Luxury Couture",
        image: {
          url: "https://example.com/images/luxury_couture.jpg",
          imagename: "Luxury Couture Collection",
        },
        code: "LUXURY2025",
      },
    ].slice(0, limit),
    code: 200,
    message: "Success",
    meta: {
      total: 10,
      page: 1,
      pageSize: limit,
    },
  });
});
app.listen(port, () => {
  console.log(`Mock API listening at http://localhost:${port}`);
});
