// ================================================================
//  GoSafe Global — Products Data
// ================================================================
const PRODUCTS = [
  // ── Metal Detectors ──
  {
    id: 1,
    name: 'Weapon Scanner (Hand-Held)',
    category: 'metal',
    categoryLabel: 'Metal Detectors',
    image: 'images/handheld.png',
    rating: 4.8,
    reviews: 42,
    badge: 'hot',
    priceOnRequest: true,
    shortDesc: 'Fast weapon screening with large search head for extra coverage. Digital go-no-go threshold circuit.',
    features: [
      'Large search head for extra coverage',
      'No false alarms – digital go-no-go threshold',
      'High sensitivity for non-intrusive body searching',
      'Instant visual and audio alarms',
      'Detects Ferrous, Non-Ferrous & Alloys',
      'Rechargeable battery operation'
    ],
    sku: 'HHMD-WS-01'
  },
  {
    id: 2,
    name: '18 Zone Door Frame Metal Detector (DFMD-18Z)',
    category: 'metal',
    categoryLabel: 'Metal Detectors',
    image: 'images/metal_detector.png',
    rating: 4.9,
    reviews: 67,
    badge: 'new',
    priceOnRequest: true,
    shortDesc: '18-zone detection for precise target location with internal battery backup over 12 hrs.',
    features: [
      'Internal battery backup over 12 hrs',
      'Reliable microprocessor based design',
      '18 zone detection for precise target location',
      'Individual zone sensitivity adjustment',
      'Intelligent traffic counter',
      'Password protection'
    ],
    sku: 'DFMD-18Z'
  },
  {
    id: 3,
    name: '33 Zone Door Frame Metal Detector (DFMD-33Z)',
    category: 'metal',
    categoryLabel: 'Metal Detectors',
    image: 'images/metal_detector.png',
    rating: 5.0,
    reviews: 29,
    badge: 'hot',
    priceOnRequest: true,
    shortDesc: 'High performance 33-zone multi-zone detection. 250 levels of zone-wise sensitivity adjustment.',
    features: [
      '33 detection zones for accurate pinpointing',
      'Exceptional immunity to external interference',
      '250 levels of zone-wise sensitivity adjustment',
      'Auto calibration – no zero adjustment required',
      'LED bar graph signal strength indicator',
      'Built-in battery backup for over 12 hours',
      'Wireless remote control'
    ],
    sku: 'DFMD-33Z'
  },
  {
    id: 4,
    name: 'Single Zone Door Frame Metal Detector',
    category: 'metal',
    categoryLabel: 'Metal Detectors',
    image: 'images/metal_detector.png',
    rating: 4.7,
    reviews: 18,
    badge: null,
    priceOnRequest: true,
    shortDesc: 'Quick installation, no training required. 9 levels of sensitivity and 2 alarm levels.',
    features: [
      'Intelligent counter for traffic entry & exit',
      'Quick installation – no training required',
      'Automatic zero adjustment',
      'Ignores external metals',
      '9 levels of sensitivity and 2 levels of alarm',
      '10 step bar-graph indicator'
    ],
    sku: 'DFMD-SZ'
  },
  {
    id: 5,
    name: 'Single Wall Type Metal Detector (SPMD)',
    category: 'metal',
    categoryLabel: 'Metal Detectors',
    image: 'images/metal_detector.png',
    rating: 5.0,
    reviews: 15,
    badge: 'new',
    priceOnRequest: true,
    shortDesc: '6 horizontal zones. LCD display, password protected, detects on both sides.',
    features: [
      '6 zones horizontally',
      'Multi-alarm sounds to choose',
      'LCD Display for better visualization',
      'Can detect on both sides',
      'Password protected for better security',
      '250 levels of zone-wise sensitivity adjustment'
    ],
    sku: 'SPMD-01'
  },

  // ── Entrance Automation ──
  {
    id: 6,
    name: 'Boom Barrier Gate',
    category: 'entrance',
    categoryLabel: 'Entrance Automation',
    image: 'images/boom_barrier.png',
    rating: 4.8,
    reviews: 53,
    badge: 'hot',
    priceOnRequest: true,
    shortDesc: 'Automatic vehicle access control. Fast arm operation with loop detector integration.',
    features: [
      'Fast opening/closing speed (1.5s–6s)',
      'Long arm versions up to 6m',
      'Loop detector and remote control compatible',
      'LED arm lighting available',
      'Manual release in case of power failure',
      'Waterproof and dustproof housing'
    ],
    sku: 'BB-AUTO-01'
  },
  {
    id: 7,
    name: 'Flap Barrier Turnstile',
    category: 'entrance',
    categoryLabel: 'Entrance Automation',
    image: 'images/flap_barrier.png',
    rating: 4.7,
    reviews: 38,
    badge: null,
    priceOnRequest: true,
    shortDesc: 'Elegant pedestrian access control with bi-directional flap panels for office/metro use.',
    features: [
      'Bi-directional access control',
      'Stainless steel housing with glass flaps',
      'Card reader, fingerprint & face recognition compatible',
      'Anti-pinch safety mechanism',
      'Emergency unlock on power failure',
      'High traffic throughput (30–40 persons/min)'
    ],
    sku: 'FB-ELITE-01'
  },
  {
    id: 8,
    name: 'Speed Gate',
    category: 'entrance',
    categoryLabel: 'Entrance Automation',
    image: 'images/speed_gate.png',
    rating: 4.9,
    reviews: 24,
    badge: 'new',
    priceOnRequest: true,
    shortDesc: 'High-speed glass wing gates for premium corporate/hotel lobbies. Sleek, silent operation.',
    features: [
      'High-speed glass wing panels',
      'Silent brushless motor operation',
      'ADA compliant wide lane option',
      'Full-height integration capable',
      'Customizable wing colors',
      '50+ persons/min throughput'
    ],
    sku: 'SG-PREMIUM-01'
  },

  // ── CCTV ──
  {
    id: 9,
    name: 'IP Security Camera System',
    category: 'cctv',
    categoryLabel: 'CCTV & Surveillance',
    image: 'images/cctv.png',
    rating: 4.8,
    reviews: 76,
    badge: 'hot',
    priceOnRequest: true,
    shortDesc: 'Full HD IP cameras with night vision, motion detection and remote mobile access.',
    features: [
      '4K Ultra HD resolution available',
      'IR night vision up to 30m',
      'Motion detection alerts to mobile',
      'IP67 weatherproof rating',
      'Wide angle 104° lens',
      'H.265+ video compression'
    ],
    sku: 'CCTV-IP-4K'
  },
  {
    id: 10,
    name: 'PTZ Dome Camera',
    category: 'cctv',
    categoryLabel: 'CCTV & Surveillance',
    image: 'images/cctv.png',
    rating: 4.7,
    reviews: 31,
    badge: null,
    priceOnRequest: true,
    shortDesc: 'Pan-Tilt-Zoom dome camera with 30x optical zoom and 360° continuous rotation.',
    features: [
      '30x optical zoom',
      '360° continuous pan rotation',
      'Auto-tracking feature',
      'IR night vision up to 100m',
      'AI-powered motion analytics',
      'Vandal-proof housing'
    ],
    sku: 'PTZ-DOME-30X'
  },

  // ── X-Ray ──
  {
    id: 11,
    name: 'X-Ray Baggage Scanner',
    category: 'xray',
    categoryLabel: 'X-Ray Scanners',
    image: 'images/xray.png',
    rating: 4.9,
    reviews: 19,
    badge: 'new',
    priceOnRequest: true,
    shortDesc: 'Dual-energy X-ray baggage inspection system for airports, malls, and government buildings.',
    features: [
      'Dual energy color imaging',
      'Tunnel size: 620mm × 440mm',
      'Penetration: 30mm steel',
      'Wire resolution: 0.1mm diameter',
      'Image storage for 100,000+ images',
      'Operator safety certified'
    ],
    sku: 'XRY-BAG-6040'
  },
  {
    id: 12,
    name: 'Parcel X-Ray Scanner (Large)',
    category: 'xray',
    categoryLabel: 'X-Ray Scanners',
    image: 'images/xray.png',
    rating: 4.8,
    reviews: 12,
    badge: null,
    priceOnRequest: true,
    shortDesc: 'Large tunnel X-ray scanner for parcel and cargo inspection. High-throughput conveyor system.',
    features: [
      'Large tunnel: 1000mm × 800mm',
      'High-speed conveyor belt',
      'Multi-view imaging',
      'Automated threat detection',
      'Network connectivity for remote monitoring',
      'CE and RoHS certified'
    ],
    sku: 'XRY-PKG-1080'
  }
];

// Make available globally
window.GOSAFE_PRODUCTS = PRODUCTS;
