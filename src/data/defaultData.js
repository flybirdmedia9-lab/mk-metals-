import fischerChemicalImage from '../assets/mk/fischer-chemical.jpg'
import fischerSteelImage from '../assets/mk/fischer-steel.jpg'
import fischerSanitaryImage from '../assets/mk/fischer-sanitary.jpg'
import fischerStandardImage from '../assets/mk/fischer-standard.jpg'
import neoperlAeratorsImage from '../assets/mk/neoperl-aerators.jpg'
import azudFiltersImage from '../assets/mk/azud-filters.jpg'

export const initialCategories = [
  {
    id: 'chemical-fixings',
    name: 'Chemical Fixings',
    description: 'High-performance anchors, injection mortars and resin systems for heavy-duty construction.',
  },
  {
    id: 'steel-fixings',
    name: 'Steel Fixings',
    description: 'Robust steel anchors, bolts and fasteners for structural installations.',
  },
  {
    id: 'sanitary-fixings',
    name: 'Sanitary Fixings',
    description: 'Reliable fixtures and mounting systems for bathrooms and sanitary environments.',
  },
  {
    id: 'plumbing-accessories',
    name: 'Plumbing Accessories',
    description: 'Water-saving components and spares designed for modern plumbing systems.',
  },
]

export const initialProducts = [
  {
    id: 'fischer-em-plus',
    slug: 'fischer-em-plus',
    name: 'Fischer Injection Mortar FIS EM Plus',
    category: 'chemical-fixings',
    shortDescription: 'Structural injection mortar for rebar anchoring and heavy-load fixing.',
    description:
      'FIS EM Plus is an approved epoxy mortar for highly demanding applications in concrete, cracked concrete and masonry. It is ideal for heavy-duty structural fixing and offers reliable curing performance in a wide temperature range.',
    price: '2,950',
    contactForPrice: false,
    status: 'In stock',
    stock: 22,
    featured: true,
    popular: true,
    latest: false,
    specs: ['Pack size: 300 ml', 'Curing time: 24 h', 'Temperature range: -40°C to 80°C'],
    image: fischerChemicalImage,
  },
  {
    id: 'fischer-v-plus',
    slug: 'fischer-v-plus',
    name: 'Fischer Injection Mortar FIS V Plus',
    category: 'chemical-fixings',
    shortDescription: 'Versatile vinyl ester mortar for demanding anchoring applications.',
    description:
      'FIS V Plus offers high adhesion and fast curing for critical anchoring installations. It is especially well-suited for damp or humid conditions, with excellent chemical resistance and handling.',
    price: '1,250',
    contactForPrice: false,
    status: 'In stock',
    stock: 16,
    featured: false,
    popular: true,
    latest: true,
    specs: ['Pack size: 150 ml', 'Setting time: 60 min', 'Maximum load: 16 kN'],
    image: fischerChemicalImage,
  },
  {
    id: 'fischer-bolt-anchor-fbn-ii',
    slug: 'fischer-bolt-anchor-fbn-ii',
    name: 'Fischer Bolt Anchor FBN II',
    category: 'steel-fixings',
    shortDescription: 'High-strength concrete anchor for reliable steel-to-concrete fastening.',
    description:
      'The FBN II bolt anchor is a powerful steel fixing with deep embedment strength. It is engineered for heavy structural tasks and provides secure load distribution in cracked and non-cracked concrete.',
    price: 'Contact for Price',
    contactForPrice: true,
    status: 'In stock',
    stock: 58,
    featured: true,
    popular: false,
    latest: false,
    specs: ['Thread size: M10–M20', 'Embedment depth: 75–120 mm', 'Material: Zinc-plated steel'],
    image: fischerSteelImage,
  },
  {
    id: 'fischer-wall-hung-set',
    slug: 'fischer-wall-hung-set',
    name: 'Fischer Wall Hung / Wall Mounting Set',
    category: 'sanitary-fixings',
    shortDescription: 'Complete fixing set for stable sanitary installations and wall units.',
    description:
      'This wall mounting set is designed to secure bathroom fixtures safely in both concrete and masonry walls. It provides a clean installation solution for washbasins, urinals and sanitary supports.',
    price: '460',
    contactForPrice: false,
    status: 'Low stock',
    stock: 8,
    featured: false,
    popular: true,
    latest: false,
    specs: ['Set includes: anchors, screws, washers', 'Suitable for ceramic fixtures', 'Easy installation guide included'],
    image: fischerSanitaryImage,
  },
  {
    id: 'neoperl-pca-spray-aerator',
    slug: 'neoperl-pca-spray-aerator',
    name: 'Neoperl PCA Spray Aerator',
    category: 'plumbing-accessories',
    shortDescription: 'Economical spray aerator for clean, splash-free water flow.',
    description:
      'The PCA Spray Aerator from Neoperl improves faucet performance while reducing water waste. It is ideal for commercial washrooms and modern plumbing fixtures that need stable aeration.',
    price: 'Contact for Price',
    contactForPrice: true,
    status: 'In stock',
    stock: 124,
    featured: false,
    popular: false,
    latest: true,
    specs: ['Flow rate: 6 l/min', 'Thread size: M22 / M24', 'Finish: chrome plated'],
    image: neoperlAeratorsImage,
  },
  {
    id: 'azud-water-storage-filter',
    slug: 'azud-water-storage-filter',
    name: 'Azud Water Storage Tank Filter',
    category: 'plumbing-accessories',
    shortDescription: 'Durable filtration unit for clean and reliable water storage.',
    description:
      'This compact filter removes debris and sediment from stored water supplies. It is engineered for use in tanks, reservoirs and industrial water systems.',
    price: '990',
    contactForPrice: false,
    status: 'In stock',
    stock: 12,
    featured: false,
    popular: false,
    latest: false,
    specs: ['Connection: 1\u2033', 'Filtration: 100 microns', 'Housing material: reinforced polymer'],
    image: azudFiltersImage,
  },
]
