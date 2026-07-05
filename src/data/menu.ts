/* ═══════════════════════════════════════════════════════════════════════════
   MENU DATA — rendered as structured content (never an image) and reused for
   schema.org Menu JSON-LD. Dietary tags: (V) vegetarian, (N) contains nuts.
   Sizes: MAMMA = price listed · NONNA = +$5 (bigger, for a bigger appetite).
   ═══════════════════════════════════════════════════════════════════════════ */

export const NONNA_UPCHARGE = 5;

export type Dietary = "V" | "N";

export interface MenuItem {
  name: string;
  price?: number; // omitted when the item lists sub-prices in `description`
  description: string;
  tags?: Dietary[];
}

export interface MenuCategory {
  id: string;
  title: string;
  /** Optional note shown under the category title. */
  note?: string;
  /** True when items are sized MAMMA / NONNA. */
  sized?: boolean;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: "sangaweech",
    title: "Eat'a Sangaweech",
    note: "Made-to-order filled focaccia & panini. Sizes: MAMMA (as priced) · NONNA +$5.",
    sized: true,
    items: [
      {
        name: "The Backhander",
        price: 17,
        description:
          "Mortadella, salami, ham, provolone, eggplant strips, rocket, green olive spread",
      },
      {
        name: "Padre Prosciutto",
        price: 16,
        description:
          "Prosciutto di parma, parmesan, rocket, tomato, pickled tomato, balsamic",
      },
      {
        name: "The Salami Slipper",
        price: 16,
        description:
          "Salami, provolone, marinated peppers, rocket, nduja & sundried tomato spread",
      },
      {
        name: "The Wooden Spoon",
        price: 17,
        description:
          "Chicken cotoletta (schnitzel), provolone, peppers, pickled tomato, olives, basil",
      },
      {
        name: "Madonna Mortadella",
        price: 17,
        description: "Mortadella, stracciatella, pistachio pesto spread",
        tags: ["N"],
      },
      {
        name: "The Leather Belt",
        price: 17,
        description:
          "Chicken parmigiana, provolone, grana padano, ragu sugo, basil",
      },
      {
        name: "Papa Porchetta",
        price: 16,
        description: "Porchetta, fennel, radicchio, red pepper spread",
      },
      {
        name: "Capitano Capocollo",
        price: 16,
        description: "Capocollo, mozzarella, giardiniera, basil pesto",
        tags: ["N"],
      },
      {
        name: "La Bella",
        price: 15,
        description: "Tomato, mozzarella, pickled green tomato, rocket, balsamic",
        tags: ["V"],
      },
      {
        name: "The Ball Breaker",
        price: 16,
        description:
          "Meatballs (beef), grana padano, provolone, sugo, salsa verde",
      },
      {
        name: "Sausage Festa",
        price: 16,
        description: "Pork & fennel sausage, grana padano, peppers, potato",
      },
      {
        name: "The Backyard",
        price: 15,
        description: "Green olive, bullhorn peppers, potato, provolone",
        tags: ["V"],
      },
    ],
  },
  {
    id: "more",
    title: "Eat'a More",
    note: "Sides & sweets.",
    items: [
      {
        name: "Nonna's Nuggets",
        price: 10,
        description: "Chicken, parmesan crumb, sea salt",
      },
      {
        name: "Home Chopped Chips",
        price: 7.5,
        description: "Sea salt",
      },
      { name: "Nutella Sangaweech", price: 11, description: "" },
      {
        name: "Tiramisu Slice",
        price: 10,
        description: "Classic, lemon, strawberry, pistachio",
      },
      {
        name: "Italian Sundae",
        price: 9,
        description: "Nutella Banana / Pavlova / Pistachio / Bueno / Salted Olive",
      },
    ],
  },
  {
    id: "drinks",
    title: "Drink'a Something",
    items: [
      {
        name: "Cold",
        description:
          "Soft Drinks $5 · Italian Sodas $6 · Sparkling Water $5 · Water $5",
      },
      {
        name: "Hot",
        description:
          "White Coffee $5 · Black Coffee $4–5 · Hot Chocolate $6 · Chai Latte $5 · Tea $5",
      },
      {
        name: "Iced",
        description:
          "Iced Chai Latte $7 · Iced Long Black $7 · Iced Tiramisu Latte $9 · Fredo Cappuccino $9",
      },
      {
        name: "Shakes",
        description:
          "Vanilla $9 · Chocolate $9 · Nutella $9 · Raffaello $10 · Ferrero $10 · Limonata $10 · Tiramisu $10 · Pistachio $10",
      },
    ],
  },
];

export const allergenNote =
  "If you have an allergy, please speak to our team before ordering. All products are prepared and handled on site in a shared environment. We cannot guarantee that cross-contact with allergens will not occur.";

export const dietaryLegend: { code: Dietary; label: string }[] = [
  { code: "N", label: "Contains nuts" },
  { code: "V", label: "Vegetarian" },
];
