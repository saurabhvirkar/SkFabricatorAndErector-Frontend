export interface ServiceItem {
  slug: string;
  title: string;
  subtitle: string;
  teaser: string;
  description: string;
  iconName: string;
  bulletTitle?: string;
  bullets: string[];
  photoPlaceholder: string;
  featured: boolean;
}

export interface ClientItem {
  id: string;
  name: string;
  tagline?: string;
  category: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'piping' | 'structural' | 'tanks' | 'maintenance' | 'insulation' | 'filters';
  categoryLabel: string;
  description: string;
  photoPlaceholder: string;
  client?: string;
}

export interface CompanyStat {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export const COMPANY_DETAILS = {
  name: 'SK Fabricator & Erector',
  legalName: 'M/s. S K FABRICATOR AND ERECTOR',
  tagline: 'PERFECTION THROUGH PRECISION',
  heroHeadline: 'Industrial Piping, Structural Fabrication & Plant Maintenance — Built to Run.',
  introText: 'We, M/s. S K FABRICATOR AND ERECTOR, are one of the leading Engineering Contractors for Industrial Piping, Structure Fabrication, Storage Tanks, Equipment Erection, Ducting & Insulation Works for project & maintenance jobs, committed towards quality services.',
  infrastructureText: 'Our office & store is fully equipped with all modern equipment, tools, and infrastructure backed by our efficient team of Engineers, Supervisors, and workers. We aim at perfection in jobs that we undertake and complete in record time.',
  phonePrimary: '+91 9130 01 2070',
  phoneSecondary: '+91 9552 03 4884',
  email: 'skfabricator2070@gmail.com',
  address: '17/3/1 Wakad Road, Thergaon, Pune - 411033, Maharashtra, India',
  googleMapsUrl: 'https://maps.google.com/?q=Wakad+Road,+Thergaon,+Pune+411033',
};

export const COMPANY_STATS: CompanyStat[] = [
  { label: 'Years Active', value: 15, suffix: '+', icon: 'history_edu' },
  { label: 'Projects Completed', value: 250, suffix: '+', icon: 'task_alt' },
  { label: 'Tonnage Fabricated', value: 10000, suffix: ' MT+', icon: 'precision_manufacturing' },
  { label: 'Zero-Incident Safety', value: 100, suffix: '%', icon: 'shield' },
];

export const CORE_SERVICES: ServiceItem[] = [
  {
    slug: 'mechanical-and-piping',
    title: 'Mechanical & Piping Fabrication',
    subtitle: 'High-Precision Process & Industrial Piping Systems',
    teaser: 'Renowned service provider catering to Automotive, Pharma, Dairy, Chemical, and Power industries.',
    description: 'Industrial Piping is the heart of SK’s business. Ever since our inception, we are renowned as a leading service provider of Piping Fabrication. These fabrication services cater to the needs of various AUTOMOTIVE, PHARMA, DAIRY AND FOOD, CHEMICAL, AND POWER INDUSTRIES. Due to our rich experience, we are capable of imparting these services for piping of any size and any type.',
    iconName: 'valve',
    bulletTitle: 'WE HAVE EXPERTISE IN',
    bullets: [
      'SS Pipeline Fabrication & Erection',
      'Fire Pipe Line Installation',
      'Gas Pipe Line (PNG, LPG, Compressed Air, Nitrogen)',
      'Petrol and Diesel Pipe Line Systems',
      'Steam Line, Nitrogen Line, Chiller Line & Process Air'
    ],
    photoPlaceholder: 'PHOTO NEEDED: Heavy Industrial Steam & Process Piping Yard',
    featured: true
  },
  {
    slug: 'jacketed-piping-fabrication',
    title: 'Jacketed Piping Fabrication',
    subtitle: 'Thermal Integrity Double-Walled Piping Systems',
    teaser: 'Precision double-walled piping designed to maintain precise material temperatures in process lines.',
    description: 'Jacketed piping systems are fundamentally different than single-wall piping and demand specialized expertise. Our team of engineers, technicians, welders, and machinists is experienced in designing, fabricating, and installing jacketed piping systems. Jacketed piping requires absolute precision in welding and layout as it is double-walled to maintain uniform temperature of materials passing through.',
    iconName: 'layers',
    bulletTitle: 'JACKETED PIPING CAPABILITIES',
    bullets: [
      'Core & Jacket Temperature-Controlled Welding',
      'Core Pressure Testing & Radiography Inspection',
      'Thermal Expansion Bellows & Jumpers',
      'Stainless Steel & High-Alloy Jacket Fabrication'
    ],
    photoPlaceholder: 'PHOTO NEEDED: Dual-Wall Jacketed Pipe Spool Assembly',
    featured: true
  },
  {
    slug: 'structure-fabrication-and-erection',
    title: 'Structure Fabrication & Erection',
    subtitle: 'Heavy Steel Infrastructure & Industrial Frameworks',
    teaser: 'Structural steel works for plants, pipe racks, platforms, access ladders, and industrial buildings.',
    description: 'We undertake Structural Steel works for all types of Plants and Industrial Buildings, including I-Beams, Angles, Channels, Flat Bars, Squares, and Rectangular tubing fabrications. We manufacture industrial fabrication works such as pipe supports, steel pipe racks, maintenance platforms, access ladders, and gantries both at our facilities and directly on client sites.',
    iconName: 'domain',
    bulletTitle: 'STRUCTURAL STEEL CAPABILITIES',
    bullets: [
      'I-Beam, Channel, Angle & Heavy Tubular Structures',
      'Industrial Pipe Racks & High-Elevation Mezzanines',
      'Custom Access Platforms, Catwalks & Safety Ladders',
      'Onsite Heavy Crane Erection & Alignment'
    ],
    photoPlaceholder: 'PHOTO NEEDED: Structural Steel Framing & High Bay Erection',
    featured: true
  },
  {
    slug: 'storage-tank-manufacturing',
    title: 'Storage Tank Manufacturing',
    subtitle: 'MS / SS High & Low Pressure Storage Solutions',
    teaser: 'High quality MS/SS storage tanks for oil, petroleum, chemical, juice, and water storage.',
    description: 'We are one of the leading Steel Storage Tank manufacturers and exporters offering high quality, durable, and reliable MS/SS storage tanks. We manufacture, supply, and export square steel tanks, cylindrical tanks, low/high pressure water tanks, and chemical processing tanks.',
    iconName: 'propane_tank',
    bulletTitle: 'STORAGE TANK RANGE',
    bullets: [
      'Mild Steel & Stainless Steel Storage Tanks',
      'Oil, Petroleum & Hazardous Organic Chemical Tanks',
      'Juice & Food-Grade SS Storage Vessels',
      'High/Low Pressure Water Tanks & Site Installation'
    ],
    photoPlaceholder: 'PHOTO NEEDED: Heavy Stainless Steel & Mild Steel Vertical Storage Vessels',
    featured: true
  },
  {
    slug: 'ss-magnetic-filters',
    title: 'SS Magnetic Filters',
    subtitle: 'Ferrous Particle Separation for High-Purity Flow Lines',
    teaser: 'Meticulously designed magnetic filters to eliminate iron particles in liquid and semi-liquid process lines.',
    description: 'Our company offers meticulously designed SS Magnetic Filters that are widely used for separating iron particles from large volume liquid or semi-liquid line flow systems. Installed directly in process lines along the passage of fluid flow, our magnetic filters are easy to clean and re-install.',
    iconName: 'filter_alt',
    bulletTitle: 'MAGNETIC FILTER FEATURES',
    bullets: [
      'High-Intensity Neodymium Rare-Earth Magnetic Rods',
      'Sanitary Grade Stainless Steel Construction (SS304/SS316)',
      'Quick-Release Clamp Design for Rapid Maintenance',
      'Custom Flanged & Threaded Inlet/Outlet Configurations'
    ],
    photoPlaceholder: 'PHOTO NEEDED: SS Magnetic Filter Unit with Internal Rod Housing',
    featured: false
  },
  {
    slug: 'industrial-plant-maintenance',
    title: 'Plant Maintenance & Shutdown Work',
    subtitle: 'Operational Up-time & Turnaround Engineering',
    teaser: 'Onsite repair, maintenance, and major shutdown services for rotating and reciprocating equipment.',
    description: 'SK Fabricator provides onsite repair and maintenance services during turnarounds or as part of routine maintenance crews. We replace bearings, seals, couplings, gaskets, change oil, diagnose issues, install/remove motors, regrout machinery bases, and perform onsite machining and welding.',
    iconName: 'build_circle',
    bulletTitle: 'MAINTENANCE SERVICES',
    bullets: [
      'Major Turnaround & Scheduled Plant Shutdown Execution',
      'Rotating & Reciprocating Equipment Overhauling',
      'Onsite Precision Welding, Machining & Base Alignment',
      'Preventive Maintenance to Increase Mean Time Between Failures'
    ],
    photoPlaceholder: 'PHOTO NEEDED: Onsite Technician Servicing Heavy Industrial Machinery',
    featured: true
  },
  {
    slug: 'insulation-works',
    title: 'Industrial Insulation Works',
    subtitle: 'Thermal Conservation & Armaflex Cold Systems',
    teaser: 'Steam, hot, cold, reactor, and Armaflex cold insulation wrapped around piping to eliminate energy loss.',
    description: 'Pipe Insulations are combinations of high-grade materials wrapped around piping to retard the flow of heat energy. Pipe insulation reduces energy losses to a great extent, directly decreasing operational costs. Piping is insulated according to insulation class, operating temperature, and specified thickness.',
    iconName: 'ac_unit',
    bulletTitle: 'PIPE INSULATION TYPES',
    bullets: [
      'Steam Pipe Thermal Insulation',
      'Hot & Cold Line Cladding Insulation Work',
      'Reactor Vessel & Process Tank Insulation',
      'Armaflex Cold Insulation Systems'
    ],
    photoPlaceholder: 'PHOTO NEEDED: Insulated Overhead Steam & Process Piping Network',
    featured: false
  }
];

export const CLIENT_LOGOS: ClientItem[] = [
  { id: 'avery-dennison', name: 'Avery Dennison', category: 'Materials Science & Packaging' },
  { id: 'arai', name: 'ARAI', tagline: 'Progress through Research', category: 'Automotive Testing & Research' },
  { id: 'royal-agro', name: 'Royal Agro', tagline: 'Growth Strength Evolve', category: 'Agrochemicals & Process' },
  { id: 'globe-gas', name: 'Globe Gas', category: 'LPG & Industrial Gas Solutions' },
  { id: 'ks-engineers', name: 'KS Engineers', category: 'Industrial Machinery & Plant EPC' },
  { id: 'horiba', name: 'HORIBA', tagline: 'Explore the future', category: 'Precision Analytical Instruments' },
  { id: 'voltas', name: 'Voltas', tagline: 'A TATA Enterprise', category: 'Engineering & Air Conditioning' },
  { id: 'inspired-control', name: 'Inspired Control Systems', category: 'Automation & Process Control' }
];

export const WHY_CHOOSE_US = [
  { title: 'Customized Solutions', desc: 'Engineered tailor-made fabrication to exact site dimensions and pressure ratings.', icon: 'tune' },
  { title: 'Reliable Services', desc: 'Proven track record across 250+ chemical, automotive, and power plant installations.', icon: 'verified' },
  { title: 'Client-Friendly Approach', desc: 'Single point of contact from initial drawing detailing to commissioning.', icon: 'handshake' },
  { title: 'Competitive Pricing', desc: 'Optimized fabrication process with modularization to maximize project value.', icon: 'payments' },
  { title: 'Timely Delivery', desc: 'We make no commitments we cannot keep; guaranteed completion in record time.', icon: 'schedule' },
  { title: 'Experienced Staff', desc: 'Backbone of certified welding specialists, supervisors, and detailers.', icon: 'engineering' },
  { title: 'Quality Management', desc: 'Rigorous inspection standards, NDT testing, and comprehensive documentation.', icon: 'workspace_premium' }
];

export const PROJECT_GALLERY: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Gas Header Pipeline Assembly',
    category: 'piping',
    categoryLabel: 'Piping',
    description: 'Overhead flanged gas distribution piping system installed at automotive manufacturing plant.',
    photoPlaceholder: 'PHOTO NEEDED: High-Pressure Yellow Gas Pipeline Run'
  },
  {
    id: 'proj-2',
    title: 'Water Storage System Piping',
    category: 'piping',
    categoryLabel: 'Piping',
    description: 'Multi-line fluid utility connection manifold connected to industrial water reserve tank.',
    photoPlaceholder: 'PHOTO NEEDED: Utility Water Tank Pipe Network'
  },
  {
    id: 'proj-3',
    title: 'Industrial Exhaust Ducting Spool',
    category: 'maintenance',
    categoryLabel: 'Maintenance & Ducting',
    description: 'Heavy gauge stainless steel exhaust duct section with custom expansion joints.',
    photoPlaceholder: 'PHOTO NEEDED: Heavy SS Blower & Duct Work Assembly'
  },
  {
    id: 'proj-4',
    title: 'Factory Ventilation System',
    category: 'structural',
    categoryLabel: 'Structural',
    description: 'Outdoor cyclone separator and ductwork tower installed for plant air management.',
    photoPlaceholder: 'PHOTO NEEDED: Vertical Industrial Exhaust Tower'
  },
  {
    id: 'proj-5',
    title: 'Precision Stainless Spool Piece',
    category: 'piping',
    categoryLabel: 'Piping',
    description: 'High-grade SS316 flanged pipe spool with integrated instrument ports.',
    photoPlaceholder: 'PHOTO NEEDED: Sanitary SS Flanged Spool Piece'
  },
  {
    id: 'proj-6',
    title: 'Onsite Piping Installation Crew',
    category: 'maintenance',
    categoryLabel: 'Maintenance',
    description: 'Skilled welding crew installing industrial process piping during plant turnaround.',
    photoPlaceholder: 'PHOTO NEEDED: Welders Executing Onsite Pipe Alignment'
  },
  {
    id: 'proj-7',
    title: 'Exhaust Filter Cyclone Battery',
    category: 'filters',
    categoryLabel: 'Filters & Vessels',
    description: 'Battery of stainless steel filtration units mounted to plant exterior wall.',
    photoPlaceholder: 'PHOTO NEEDED: Multi-Column Stainless Filter Battery'
  },
  {
    id: 'proj-8',
    title: 'Skid-Mounted Dosing Skid',
    category: 'piping',
    categoryLabel: 'Piping',
    description: 'Compact skid-mounted chemical dosing system with valves and magnetic flowmeters.',
    photoPlaceholder: 'PHOTO NEEDED: Precision Skid-Mounted Pipe Assembly'
  },
  {
    id: 'proj-9',
    title: 'SS Magnetic Filter Housing',
    category: 'filters',
    categoryLabel: 'Filters & Vessels',
    description: 'Sanitary SS magnetic filter vessel with internal magnetic rod basket.',
    photoPlaceholder: 'PHOTO NEEDED: SS Magnetic Filter Unit Component'
  },
  {
    id: 'proj-10',
    title: 'High-Capacity Storage Tank',
    category: 'tanks',
    categoryLabel: 'Storage Tanks',
    description: 'Heavy duty vertical mild steel storage vessel prior to protective insulation coating.',
    photoPlaceholder: 'PHOTO NEEDED: Red Lead Primer Storage Vessel'
  },
  {
    id: 'proj-11',
    title: 'Plant Safety Enclosures',
    category: 'structural',
    categoryLabel: 'Structural',
    description: 'Custom safety barrier cages and elevated equipment protection surrounds.',
    photoPlaceholder: 'PHOTO NEEDED: Yellow Safety Barrier Enclosures'
  },
  {
    id: 'proj-12',
    title: 'Stainless Storage Tank Battery',
    category: 'tanks',
    categoryLabel: 'Storage Tanks',
    description: 'Battery of 4 vertical cylindrical stainless steel chemical storage tanks.',
    photoPlaceholder: 'PHOTO NEEDED: Vertical SS Chemical Storage Vessels'
  }
];
