export type OriginalityStatus = "Present" | "Missing" | "Unknown" | "Modified"

export type OriginalityItem = {
  category: string
  name: string
  status: OriginalityStatus
}

export type RegistryCar = {
  id: string
  slug: string
  registration: string
  previousRegistrations: string[]
  vinPublic: string
  colour: string
  interior: string
  country: string
  status: string
  summary: string
  originality: OriginalityItem[]
}

export const cars: RegistryCar[] = [
  {
    id: "GE-001",
    slug: "ge-001",
    registration: "N9 OWO",
    previousRegistrations: ["N131 FHE", "N2 EAC", "N131 FHE", "N9 OWO"],
    vinPublic: "JMZNA18P200301***",
    colour: "Montego Blue Mica",
    interior: "Champagne leather / tartan",
    country: "United Kingdom",
    status: "Under restoration",
    summary:
      "A UK Mazda MX-5 Gleneagles currently undergoing a major preservation-focused restoration.",
    originality: [
      { category: "Identity", name: "Original Gleneagles edition", status: "Present" },
      { category: "Identity", name: "Montego Blue Mica paint", status: "Present" },
      { category: "Interior", name: "Champagne leather seats", status: "Present" },
      { category: "Interior", name: "Tartan seat inserts", status: "Present" },
      { category: "Interior", name: "Nardi steering wheel", status: "Present" },
      { category: "Interior", name: "Wood centre console", status: "Present" },
      { category: "Accessories", name: "Tartan document wallet", status: "Present" },
      { category: "Accessories", name: "Tonneau cover", status: "Present" },
      { category: "Accessories", name: "Wind blocker", status: "Present" },
      { category: "Accessories", name: "OEM Gleneagles hardtop", status: "Missing" },
      { category: "Documentation", name: "Original sales invoice", status: "Missing" },
      { category: "Documentation", name: "Original service history", status: "Missing" },
      { category: "Mechanical", name: "Power steering", status: "Present" },
      { category: "Mechanical", name: "Air conditioning", status: "Missing" },
    ],
  },
]
