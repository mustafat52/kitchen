export const zones = [
  { id: 1, name: 'CMZ', display_order: 1 },
]

export const getZoneById = (id) => zones.find((z) => z.id === id) || null
