// Script to show which locations need to be changed
// Run this to verify the changes

const oldLocations = ["м. Суми", "м. Охтирка", "м. Конотоп", "м. Ромни", "м. Глухів", "м. Путивль", "м. Тростянець"]

const newLocations = [
  "м. Шостка", // Main city - 60%
  "смт Вороніж", // Nearby village
  "с. Собич", // Nearby village
  "с. Клишки", // Nearby village
  "смт Ямпіль", // Nearby town
  "с. Богданівка", // Nearby village
]

console.log("Locations to replace:")
console.log("Replace 'м. Суми' -> 'м. Шостка' or nearby villages")
console.log("Replace 'м. Охтирка' -> 'м. Шостка' or 'смт Вороніж'")
console.log("Replace 'м. Конотоп' -> 'м. Шостка' or 'с. Собич'")
console.log("Replace 'м. Ромни' -> 'м. Шостка' or 'смт Ямпіль'")
console.log("\nKeep: 'м. Львів', 'м. Київ', 'Варшава' for displaced students")
