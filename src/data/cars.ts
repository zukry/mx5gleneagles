export type OriginalityStatus = "Present" | "Missing" | "Unknown" | "Modified"

export type OriginalityItem = {
  category: string
  name: string
  status: OriginalityStatus
}

export type ChangeLogEntry = {
  date: string
  updatedBy: string
  changes: string[]
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
  createdAt: string
  updatedAt: string
  updatedBy: string
  dataConfidence: "Low" | "Medium" | "High"
  originalityRating: string
  photoCount: number
  documentCount: number
  changelog: ChangeLogEntry[]
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
    createdAt: "15 June 2026",
    updatedAt: "15 June 2026",
    updatedBy: "Registry administrator",
    dataConfidence: "High",
    originalityRating: "Exceptional",
    photoCount: 0,
    documentCount: 0,
    changelog: [
      {
        date: "15 June 2026",
        updatedBy: "Registry administrator",
        changes: [
          "Created registry entry GE-001",
          "Added current registration N9 OWO",
          "Added previous registration chain",
          "Added partial VIN",
          "Added initial originality checklist",
          "Added restoration status",
        ],
      },
    ],
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
