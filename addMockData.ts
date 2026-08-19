import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

let client: any

async function uploadImage(url: string) {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename: 'mock-image.jpg',
  })
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  }
}

async function run() {
  const { getWriteClient } = await import('./sanity/lib/client')
  client = getWriteClient()

  console.log("Cleaning up old documents...")
  const oldDocs = (await client.fetch('*[_type in ["siteSettings", "project", "experience", "education", "service", "post", "curatedPost", "award"]]')) as Array<{ _id: string }>
  for (const doc of oldDocs) {
    if (doc._id) {
      await client.delete(doc._id).catch(() => {})
    }
  }

  console.log("Uploading fresh mock images...")
  const imgCode = await uploadImage('https://picsum.photos/seed/code/800/600')
  const imgDash = await uploadImage('https://picsum.photos/seed/dash/800/600')
  const imgAlgo = await uploadImage('https://picsum.photos/seed/algo/800/600')
  const imgHero = await uploadImage('https://picsum.photos/seed/student-hero/1200/800')
  const imgAvatar = await uploadImage('https://picsum.photos/seed/student-avatar/400/400')
  const imgStripe = await uploadImage('https://picsum.photos/seed/stripe-logo/400/400')
  const imgCal = await uploadImage('https://picsum.photos/seed/cal-logo/400/400')

  console.log("Creating Site Settings for Software Engineering Student...")
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: 'Alex Chen',
    handle: 'alexchen',
    role: 'Software Engineering Student & Full-Stack Developer',
    locationTag: 'Based in Pakistan',
    email: 'alex.chen@berkeley.edu',
    socialLinks: [
      { _key: 'github', platform: 'GitHub', url: 'https://github.com' },
      { _key: 'linkedin', platform: 'LinkedIn', url: 'https://linkedin.com' },
      { _key: 'twitter', platform: 'X / Twitter', url: 'https://x.com' },
    ],
    heroImage: imgHero,
    ctaLabel: 'Talk with me',
    introHeadline: 'A Computer Science student who loves distributed systems, clean code & building web applications.',
    introImage: imgAvatar,
    bio: 'Software Engineering senior at UC Berkeley graduating 2025. Focused on full-stack web engineering, high-throughput APIs, and distributed systems.',
    aboutBio: 'Senior Software Engineering student with hands-on experience building web platforms, high-performance microservices, and interactive tools. Passionate about distributed systems, modern React ecosystem, clean code, and developer experience.',
    stats: [
      { _key: 's1', value: '3.9/4.0', label: 'Cumulative GPA' },
      { _key: 's2', value: '3', label: 'Software Internships' },
      { _key: 's3', value: '15+', label: 'Projects Shipped' },
      { _key: 's4', value: '1.2k+', label: 'GitHub Contributions' },
    ],
    processImage: imgAvatar,
    processIntro: 'I focus on writing clean, tested, and maintainable software. From system architecture to deployment, I ensure applications are scalable and user-centered.',
    processSteps: [
      { _key: 'ps1', title: 'Problem Specs & Requirements' },
      { _key: 'ps2', title: 'System & DB Architecture' },
      { _key: 'ps3', title: 'Implementation & Unit Testing' },
      { _key: 'ps4', title: 'CI/CD & Cloud Deployment' },
    ],
    statement: 'Building high-performance software with clean code and modern architecture.',
    footerImage: imgAvatar,
    footerHeadline: "Let's build something great!",
    seoDescription: 'Alex Chen - Software Engineering Student & Full Stack Developer Portfolio',
  })

  console.log("Creating Experience documents...")
  await client.create({
    _type: 'experience',
    company: 'Stripe',
    role: 'Software Engineering Intern',
    location: 'San Francisco, CA',
    startYear: 'May 2024',
    endYear: 'Aug 2024',
    current: false,
    description: 'Developed high-throughput API endpoints in Go and TypeScript. Reduced database query latency by 35% through Redis caching and SQL indexing.',
    image: imgStripe,
  })

  await client.create({
    _type: 'experience',
    company: 'UC Berkeley Distributed Systems Lab',
    role: 'Undergraduate Systems Researcher',
    location: 'Berkeley, CA',
    startYear: 'Jan 2024',
    current: true,
    description: 'Researched fault-tolerant consensus storage algorithms under lab faculty. Implemented a Raft-based key-value store in Rust with automatic leader election.',
    image: imgCal,
  })

  await client.create({
    _type: 'experience',
    company: 'Vercel / EdTech Accelerator',
    role: 'Full Stack Developer Intern',
    location: 'Remote',
    startYear: 'Jun 2023',
    endYear: 'Sept 2023',
    current: false,
    description: 'Architected interactive student learning dashboards using Next.js, Tailwind CSS, and PostgreSQL, serving 10,000+ daily active student users.',
    image: imgCode,
  })

  await client.create({
    _type: 'experience',
    company: 'Cal Hacks / CS Developer Club',
    role: 'Lead Web Developer & Mentor',
    location: 'Berkeley, CA',
    startYear: 'Sept 2023',
    current: true,
    description: 'Led a team of 6 student developers building the official hackathon portal handling 1,200+ hacker registrations and live project submissions.',
    image: imgCal,
  })

  console.log("Creating Education documents...")
  await client.create({
    _type: 'education',
    institution: 'University of California, Berkeley',
    degree: 'B.S. in Computer Science & Software Engineering',
    startYear: '2022',
    endYear: '2026',
    current: true,
    description: 'GPA: 3.9/4.0. Relevant Coursework: Data Structures & Algorithms, Operating Systems, Distributed Systems, Computer Networks, Database Systems.',
    image: imgCal,
  })

  await client.create({
    _type: 'education',
    institution: 'San Francisco Tech Academy',
    degree: 'Full Stack & Cloud Engineering Certificate',
    startYear: '2022',
    endYear: '2022',
    current: false,
    description: 'Intensive program focusing on React, Node.js, Docker, Kubernetes, and modern cloud deployment pipelines.',
    image: imgCode,
  })

  console.log("Creating Projects...")
  const p1 = await client.create({
    _type: 'project',
    title: 'PulseCode — Real-Time Collaborative Code Editor',
    slug: { _type: 'slug', current: 'pulse-code-editor' },
    period: '2024',
    category: 'Web & Systems',
    tagline: 'Google Docs for code built with WebSockets & CRDTs.',
    excerpt: 'An ultra-fast collaborative code editor enabling multi-user real-time editing with syntax highlighting and instant compilation.',
    thumbnail: imgCode,
    coverImage: imgCode,
    featured: true,
    liveUrl: 'https://github.com',
    secondaryLinkLabel: 'GitHub Repo',
    secondaryLinkUrl: 'https://github.com',
    gallery: [{ ...imgCode, _key: 'g1' }, { ...imgDash, _key: 'g2' }],
    body: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'c1', text: 'Built using Next.js 14, WebSockets, Redis pub/sub, and Yjs CRDTs for conflict-free document synchronization.', marks: [] }],
      },
    ],
  })

  const p2 = await client.create({
    _type: 'project',
    title: 'DevPulse — Developer Velocity Analytics',
    slug: { _type: 'slug', current: 'dev-pulse-analytics' },
    period: '2024',
    category: 'Full Stack Web',
    tagline: 'Visualizing developer workflow metrics and GitHub velocity.',
    excerpt: 'Built a full-stack dashboard tracking commit frequency, PR review times, and deployment metrics using Next.js, GraphQL, and PostgreSQL.',
    thumbnail: imgDash,
    coverImage: imgDash,
    featured: true,
    liveUrl: 'https://example.com',
    secondaryLinkLabel: 'Live Demo',
    secondaryLinkUrl: 'https://example.com',
    gallery: [{ ...imgDash, _key: 'g3' }],
    body: [
      {
        _type: 'block',
        _key: 'b2',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'c2', text: 'Integrated GitHub REST & GraphQL APIs to calculate team engineering metrics.', marks: [] }],
      },
    ],
  })

  const p3 = await client.create({
    _type: 'project',
    title: 'AlgoViz — Interactive Algorithm Visualizer',
    slug: { _type: 'slug', current: 'algoviz-visualizer' },
    period: '2023',
    category: 'CS Tooling',
    tagline: 'Visualizing graph traversal and sorting algorithms in 60fps.',
    excerpt: 'An interactive educational web app helping CS students visualize complex algorithms with step-by-step memory inspection.',
    thumbnail: imgAlgo,
    coverImage: imgAlgo,
    featured: true,
    liveUrl: 'https://example.com',
    secondaryLinkLabel: 'GitHub',
    secondaryLinkUrl: 'https://github.com',
    gallery: [{ ...imgAlgo, _key: 'g4' }],
    body: [
      {
        _type: 'block',
        _key: 'b3',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'c3', text: 'Built with React, Canvas API, and Web Workers for smooth 60fps animations.', marks: [] }],
      },
    ],
  })

  console.log("Creating Services...")
  await client.create({
    _type: 'service',
    title: 'Full Stack Web Engineering',
    items: ['React / Next.js 15', 'TypeScript', 'Node.js / Express', 'PostgreSQL / MongoDB', 'Tailwind CSS v4'],
    previewImage: imgCode,
  })

  await client.create({
    _type: 'service',
    title: 'Backend & Cloud Architecture',
    items: ['Node.js / Go / Rust', 'REST & GraphQL APIs', 'Docker / Containerization', 'Redis Caching', 'CI/CD Pipelines'],
    previewImage: imgDash,
  })

  await client.create({
    _type: 'service',
    title: 'Code Audits & Performance',
    items: ['Site Speed Optimization', 'Accessibility (WCAG)', 'Clean Architecture Refactoring', 'Unit & Integration Testing'],
    previewImage: imgAlgo,
  })

  console.log("Creating Curated Blog Posts...")
  await client.create({
    _type: 'curatedPost',
    title: 'Building a Raft Consensus Key-Value Store in Rust',
    mediumUrl: 'https://medium.com/@username/building-a-raft-consensus-key-value-store-in-rust-12345',
    excerpt: 'Lessons learned implementing distributed consensus algorithms, leader election, and log replication from scratch.',
    coverImage: imgCode,
    publishedDate: new Date().toISOString(),
    displayOrder: 1,
    isHidden: false,
  })

  await client.create({
    _type: 'curatedPost',
    title: 'Mastering Data Structures for Technical Coding Interviews',
    mediumUrl: 'https://medium.com/@username/mastering-data-structures-for-technical-coding-interviews-67890',
    excerpt: 'A practical guide to patterns, space-time complexities, and top problem-solving strategies for CS students.',
    coverImage: imgAlgo,
    publishedDate: new Date().toISOString(),
    displayOrder: 2,
    isHidden: false,
  })

  console.log("Creating Awards...")
  await client.create({
    _type: 'award',
    project: { _type: 'reference', _ref: p1._id },
    awardType: '1st Place Overall Winner — CalHacks 2024',
    date: '2024-10-20',
  })

  await client.create({
    _type: 'award',
    project: { _type: 'reference', _ref: p2._id },
    awardType: "Dean's Honor List (6 Consecutive Semesters)",
    date: '2024-05-15',
  })

  console.log("Successfully seeded fresh Software Engineering Student mock data!")
}

run().catch((err) => {
  console.error("Error seeding mock data:", err)
  process.exit(1)
})

